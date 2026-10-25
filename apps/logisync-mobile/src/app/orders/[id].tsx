import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Alert, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// --- Imports for Location Tracking & Offline Sync ---
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io, Socket } from 'socket.io-client';

const TARGET_IP = '192.168.100.27';
const BASE_URL = Platform.OS === 'android' ? `http://${TARGET_IP}:3000` : `http://${TARGET_IP}:3000`;
const STORAGE_PREFIX = 'offline_coords_';

interface OrderDetail {
    id: string;
    trackingId: string;
    customerName: string;
    pickupLocation: string;
    deliveryAddress: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export default function OrderDetailScreen() {
    const { id } = useLocalSearchParams(); // Extract dynamic order ID parameter
    const orderId = Array.isArray(id) ? id[0] : id;
    const router = useRouter();

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // --- Tracking & Socket Refs ---
    const socketRef = useRef<Socket | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Fetch primary order detail records
    const fetchOrderDetail = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const token = await SecureStore.getItemAsync('driver_auth_token');
            const endpoint = `${BASE_URL}/api/v1/orders/${orderId}`;
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.status === 200) {
                setOrder(response.data);
            }
        } catch (err: any) {
            console.error('Fetch detail crash:', err);
            setErrorMsg(err.response?.data?.message || 'Failed to pull order status metrics.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (orderId) fetchOrderDetail();
    }, [orderId]);

    // --- WebSocket & Location Tracking Lifecycle Effect ---
    useEffect(() => {
        if (!orderId) return;

        // Initialize Socket connection in 'tracking' namespace
        socketRef.current = io(`${BASE_URL}/tracking`, {
            transports: ['websocket'],
            autoConnect: false,
        });

        socketRef.current.connect();

        socketRef.current.on('connect', () => {
            console.log('🟢 Socket connected to /tracking namespace!');
        });

        socketRef.current.on('joined', (data) => {
            console.log('✅ Joined room:', data);
        });

        socketRef.current.on('error', (err) => {
            console.error('❌ Socket error:', err);
        });

        socketRef.current.emit('joinOrderStream', { orderId });

        // NetInfo listener for offline/online sync recovery
        const unsubscribeNetInfo = NetInfo.addEventListener(async (state) => {
            if (state.isConnected && orderId) {
                await syncOfflineCoordinates(orderId);
            }
        });

        // Start or Stop tracking based on order status
        if (order?.status === 'IN_TRANSIT') {
            startTrackingLoop(orderId, socketRef);
        } else {
            stopTrackingLoop();
        }

        return () => {
            stopTrackingLoop();
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            unsubscribeNetInfo();
        };
    }, [order?.status, orderId]);

    // --- 5-Second Location Loop & Telemetry / AsyncStorage Handler ---
    const startTrackingLoop = (targetOrderId: string, socketInstanceRef: React.MutableRefObject<Socket | null>) => {
        stopTrackingLoop(); // Clear any existing interval

        intervalRef.current = setInterval(async () => {
            try {
                // Fetch current fine location coordinates
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High,
                });

                const { latitude: lat, longitude: lng } = location.coords;
                const timestamp = new Date().toISOString();

                const netState = await NetInfo.fetch();

                if (netState.isConnected) {
                    // Online: Push directly via WebSocket
                    if (socketInstanceRef.current && socketInstanceRef.current.connected) {
                        socketInstanceRef.current.emit('pushLiveTelemetry', {
                            orderId: targetOrderId,
                            lat,
                            lng,
                            timestamp,
                        });
                    } else {
                        // Fallback if socket dropped
                        await saveToAsyncStorage(targetOrderId, { lat, lng, timestamp });
                    }
                } else {
                    // Offline: Save to AsyncStorage queue
                    await saveToAsyncStorage(targetOrderId, { lat, lng, timestamp });
                }
            } catch (error) {
                console.error('Error fetching location telemetry:', error);
            }
        }, 5000);
    };

    const stopTrackingLoop = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Helper: Save offline coordinate to AsyncStorage
    const saveToAsyncStorage = async (targetOrderId: string, coord: { lat: number; lng: number; timestamp: string }) => {
        try {
            const key = `${STORAGE_PREFIX}${targetOrderId}`;
            const existingData = await AsyncStorage.getItem(key);
            const coordsList = existingData ? JSON.parse(existingData) : [];

            coordsList.push(coord);
            await AsyncStorage.setItem(key, JSON.stringify(coordsList));
            console.log('💾 [OFFLINE] Coordinate saved to AsyncStorage queue. Total queued:', coordsList.length);
        } catch (err) {
            console.error('Failed to save offline coordinate', err);
        }
    };

    // Helper: Sync offline coordinates when internet recovers
    const syncOfflineCoordinates = async (targetOrderId: string) => {
        try {
            const key = `${STORAGE_PREFIX}${targetOrderId}`;
            const existingData = await AsyncStorage.getItem(key);
            if (!existingData) return;

            const coordinates = JSON.parse(existingData);
            if (coordinates.length === 0) return;

            if (!Array.isArray(coordinates) || coordinates.length === 0) {
                return;
            }

            console.log('🔄 [SYNC] Internet recovered! Attempting to batch sync queued coordinates:', coordinates.length);

            const token = await SecureStore.getItemAsync('driver_auth_token');

            console.log(token);
            console.log(coordinates);

            // Hit your batch-sync backend endpoint
            const response = await axios.post(`${BASE_URL}/api/v1/tracking/batch-sync`, {
                orderId: targetOrderId,
                coordinates
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200 || response.status === 201) {
                await AsyncStorage.removeItem(key);
                console.log('✅ [SYNC] Offline coordinates batch-synced successfully and cleared from storage!');
            }
        } catch (err) {
            console.error('Batch sync failed:', err);
        }
    };

    // Handle structural backend status updates
    const handleUpdateStatus = async (nextStatus: string) => {
        setUpdating(true);
        try {
            const token = await SecureStore.getItemAsync('driver_auth_token');
            const endpoint = `${BASE_URL}/api/v1/orders/${orderId}/status`;

            const response = await axios.patch(endpoint, { status: nextStatus }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200 || response.status === 201) {
                setOrder(response.data);
                Alert.alert('Status Updated', `Manifest updated to ${nextStatus.replace('_', ' ')}.`);
            }
        } catch (err: any) {
            console.error('Status alteration failure:', err);
            Alert.alert('Update Failed', err.response?.data?.message || 'Could not shift order status.');
        } finally {
            setUpdating(false);
        }
    };

    // Conditional render function tailored to driver workflow
    const renderActionButtons = () => {
        if (!order || updating) return null;

        switch (order.status) {
            case 'ASSIGNED':
                return (
                    <TouchableOpacity
                        style={[styles.btn, styles.btnOrange]}
                        onPress={() => handleUpdateStatus('PICKED_UP')}
                    >
                        <Text style={styles.btnText}>PICK UP</Text>
                    </TouchableOpacity>
                );

            case 'PICKED_UP':
                return (
                    <TouchableOpacity
                        style={[styles.btn, styles.btnOrange]}
                        onPress={() => handleUpdateStatus('IN_TRANSIT')}
                    >
                        <Text style={styles.btnText}>IN TRANSIT</Text>
                    </TouchableOpacity>
                );

            case 'IN_TRANSIT':
                return (
                    <View style={styles.splitBtnRow}>
                        <TouchableOpacity
                            style={[styles.btn, styles.btnGreen, { flex: 1 }]}
                            onPress={() => handleUpdateStatus('DELIVERED')}
                        >
                            <Text style={styles.btnText}>DELIVER</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.btn, styles.btnRed, { flex: 0.35 }]}
                            onPress={() => handleUpdateStatus('CANCELLED')}
                        >
                            <Text style={styles.btnText}>CANCEL</Text>
                        </TouchableOpacity>
                    </View>
                );

            case 'CANCELLED':
                return (
                    <View style={[styles.completedNotice, styles.noticeRed]}>
                        <Text style={[styles.completedText, styles.textRed]}>Order Cancelled</Text>
                    </View>
                );

            case 'DELIVERED':
                return (
                    <View style={[styles.completedNotice, styles.noticeGreen]}>
                        <Text style={[styles.completedText, styles.textGreen]}>Order Delivered</Text>
                    </View>
                );

            default:
                return (
                    <View style={styles.completedNotice}>
                        <Text style={styles.completedText}>Status Completed</Text>
                    </View>
                );
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingText}>Fetching order details...</Text>
            </View>
        );
    }

    if (errorMsg || !order) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorText}>{errorMsg || 'Order record missing.'}</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backBtnText}>Return to Dashboard</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => router.back()} style={styles.navBack}>
                    <Text style={styles.navBackText}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.navTitle}>Manifest Details</Text>

                <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => fetchOrderDetail()}
                    disabled={updating}
                >
                    <Text style={styles.refreshButtonText}>REFRESH</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
                <View style={styles.statusSection}>
                    <Text style={styles.trackIdLabel}>{order.trackingId}</Text>
                    <View style={styles.badgeWrapper}>
                        <Text style={styles.badgeText}>{order.status.replace('_', ' ')}</Text>
                    </View>
                </View>

                <View style={styles.detailsCard}>
                    <Text style={styles.sectionHeader}>Logistics Information</Text>

                    <Text style={styles.fieldLabel}>Customer Identity</Text>
                    <Text style={styles.fieldValue}>{order.customerName}</Text>

                    <Text style={styles.fieldLabel}>Origin (Pickup Location)</Text>
                    <Text style={styles.fieldValue}>{order.pickupLocation}</Text>

                    <Text style={styles.fieldLabel}>Destination (Delivery Address)</Text>
                    <Text style={styles.fieldValue}>{order.deliveryAddress}</Text>

                    <Text style={styles.fieldLabel}>Registered Node Timestamp</Text>
                    <Text style={styles.fieldValue}>{new Date(order.createdAt).toLocaleString()}</Text>
                </View>
            </ScrollView>

            <View style={styles.footerActions}>
                {updating && <ActivityIndicator size="small" color="#3b82f6" style={{ marginBottom: 10 }} />}
                {renderActionButtons()}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc', padding: 24 },
    loadingText: { marginTop: 12, color: '#64748b', fontWeight: '600' },
    errorText: { color: '#ef4444', fontWeight: '700', textAlign: 'center', marginBottom: 16 },

    navbar: { height: 56, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#e2e8f0' },
    navBack: { paddingVertical: 6 },
    navBackText: { color: '#3b82f6', fontWeight: '700', fontSize: 15 },
    navTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
    refreshButton: { backgroundColor: '#0f172a', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, minWidth: 60, alignItems: 'center' },
    refreshButtonText: { color: '#FFFFFF', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

    scrollBody: { padding: 20 },
    statusSection: { alignItems: 'center', backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 20 },
    trackIdLabel: { fontSize: 18, fontWeight: '800', color: '#1e3a8a', marginBottom: 8 },
    badgeWrapper: { backgroundColor: '#1e3a8a', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
    badgeText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },

    detailsCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    sectionHeader: { fontSize: 14, fontWeight: '800', color: '#0f172a', borderBottomWidth: 1, borderColor: '#f1f5f9', paddingBottom: 8, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.5 },
    fieldLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 4 },
    fieldValue: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 16 },

    footerActions: { backgroundColor: '#FFFFFF', padding: 20, borderTopWidth: 1, borderColor: '#e2e8f0' },
    btn: { padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    btnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', letterSpacing: 0.5 },
    btnOrange: { backgroundColor: '#f97316' },
    btnGreen: { backgroundColor: '#22c55e' },
    btnRed: { backgroundColor: '#ef4444' },
    splitBtnRow: { flexDirection: 'row', gap: 12 },
    completedNotice: { padding: 12, backgroundColor: '#f1f5f9', borderRadius: 8, alignItems: 'center' },
    completedText: { color: '#94a3b8', fontWeight: '700', fontSize: 13 },
    backBtn: { padding: 12, backgroundColor: '#0f172a', borderRadius: 8 },
    backBtnText: { color: '#FFFFFF', fontWeight: '700' },
    noticeRed: { backgroundColor: '#fee2e2', borderColor: '#fca5a5', borderWidth: 1 },
    textRed: { color: '#ef4444' },
    noticeGreen: { backgroundColor: '#dcfce7', borderColor: '#bbf7d0', borderWidth: 1 },
    textGreen: { color: '#22c55e' },
});