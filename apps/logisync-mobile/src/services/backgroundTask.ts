import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import SecureStore from 'expo-secure-store';
import axios from 'axios';
import { DeviceEventEmitter } from 'react-native';

export const BACKGROUND_TRACKING_TASK = 'BACKGROUND_LOCATION_TRACKING';
const BASE_URL = 'http://192.168.100.27:3000';
const BG_BATCH_KEY = 'background_batch_queue_';
const LAST_PUSH_TIME_KEY = 'last_server_push_time';

// Configuration parameters
const BATCH_SEND_INTERVAL_MS = 30000; // Send batch to server every 30 seconds

// Fast In-Memory fallback time
let lastServerPushTime = Date.now();

TaskManager.defineTask(BACKGROUND_TRACKING_TASK, async ({ data, error }: any) => {
    if (error || !data) return;

    const { locations } = data;
    if (!locations || locations.length === 0) return;

    // Fix: extract correctly from array
    const location = locations[0];
    const { latitude: lat, longitude: lng } = location.coords;
    const timestamp = new Date().toISOString();

    const targetOrderId = await AsyncStorage.getItem('active_tracking_order_id');
    if (!targetOrderId) return;

    const payload = { lat, lng, timestamp };

    // 1. Check if App is active in the Foreground
    const isAppActive = DeviceEventEmitter.listenerCount('localForegroundLocationUpdate') > 0;
    if (isAppActive) {
        // App is open! Pass single payload directly to UI screen
        DeviceEventEmitter.emit('localForegroundLocationUpdate', { orderId: targetOrderId, ...payload });
        return;
    }

    // 2. App is Minimized/Locked -> Local Batching Mode
    try {
        const queueKey = `${BG_BATCH_KEY}${targetOrderId}`;

        // Retrieve current background queue
        const existingData = await AsyncStorage.getItem(queueKey);
        const batchQueue = existingData ? JSON.parse(existingData) : [];
        batchQueue.push(payload);

        // Fetch reliable time from Storage first (handles OS memory wipe)
        const storedLastPushTime = await AsyncStorage.getItem(LAST_PUSH_TIME_KEY);
        const actualLastPushTime = storedLastPushTime ? parseInt(storedLastPushTime, 10) : lastServerPushTime;

        const currentTime = Date.now();

        // Check if our 30-second window has passed
        if (currentTime - actualLastPushTime >= BATCH_SEND_INTERVAL_MS) {
            const netState = await NetInfo.fetch();
            const token = await SecureStore.getItemAsync('driver_auth_token');

            if (netState.isConnected && token) {
                // Inner isolated try-catch to absolutely protect against API failure data-loss
                try {
                    // Send ALL accumulated locations in ONE single request
                    await axios.post(`${BASE_URL}/api/v1/tracking/batch-sync`,
                        {
                            orderId: targetOrderId,
                            coordinates: batchQueue
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` },
                            timeout: 10000 // 10 seconds timeout safeguard
                        }
                    );

                    // SUCCESS: Clear out this specific interval queue and update timer flags
                    await AsyncStorage.removeItem(queueKey);

                    // Update both Storage and RAM to secure the next interval cycle
                    await AsyncStorage.setItem(LAST_PUSH_TIME_KEY, currentTime.toString());
                    lastServerPushTime = currentTime;

                    console.log(`📦 [BG BATCH] Sent ${batchQueue.length} coordinates in 1 HTTP payload.`);
                } catch (axiosError) {
                    // CATCH NETWORK FAILURES: Save data back to storage safely if server is down / timeout
                    console.error('❌ [BG BATCH] Axios API push failed. Saving queue safely back to storage.', axiosError);
                    await AsyncStorage.setItem(queueKey, JSON.stringify(batchQueue));
                }
            } else {
                // If offline or token missing, save the appended list back down to storage
                await AsyncStorage.setItem(queueKey, JSON.stringify(batchQueue));
                console.log(`⏳ [BG BATCH] Device offline or unauthorized. Cached data. Queue size: ${batchQueue.length}`);
            }
        } else {
            // Still within the 30-second collection window; just update local storage array
            await AsyncStorage.setItem(queueKey, JSON.stringify(batchQueue));
            console.log(`⏳ [BG BATCH] Within time window. Cached locally. Queue size: ${batchQueue.length}`);
        }
    } catch (err) {
        console.error('Error handling background location batch:', err);
    }
});
