import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { Redirect, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

// Locked to your verified local development network node
const TARGET_IP = '192.168.100.27';
const BASE_URL = Platform.OS === 'android' ? `http://${TARGET_IP}:3000` : `http://${TARGET_IP}:3000`;
const LOGIN_ENDPOINT = `${BASE_URL}/api/v1/identity/login`;

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Validation Error', 'Please fill in all identity credentials.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(LOGIN_ENDPOINT, {
                email: email.trim(),
                password: password
            });
            // console.log(response.status)
            // console.log(response.data)
            // console.log(response.data.accessToken)
            if ((response.status === 200 || response.status === 201) && response.data.accessToken) {
                await SecureStore.setItemAsync('driver_auth_token', response.data.accessToken);

                // 2. Serialize and save the user block object (Acts exactly like your browser's localStorage)
                const userProfileString = JSON.stringify(response.data.user);
                await AsyncStorage.setItem('driver_profile', userProfileString);

                // --- Request Location Permissions Right After Successful Login ---
                try {
                    const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
                    if (fgStatus === 'granted') {
                        await Location.requestBackgroundPermissionsAsync();
                    } else {
                        Alert.alert('Permission Required', 'Location permission is required for dispatch tracking.');
                    }
                } catch (locErr) {
                    console.error('Failed to request location permissions:', locErr);
                }
                // -----------------------------------------------------------------

                // Alert.alert('Success', 'Authentication validated!', [
                //     {
                //         text: 'Go to Dashboard', onPress: () => router.replace('/')
                //     }
                // ]);
                Alert.alert('Success', 'Authentication validated!');
                return router.replace('/')
            } else {
                // Add a backup error message if the token was somehow missing
                Alert.alert('Authentication Failed', 'Token missing from server response.');
            }

        } catch (error: any) {
            console.error('Axios Login Failure Instance:', error);
            const errorMessage = error.response?.data?.message || 'Could not connect to the server. Check if NestJS is running.';
            Alert.alert('Network Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.brandingBlock}>
                <Text style={styles.title}>LogiSync<Text style={styles.titleAccent}>-X</Text></Text>
                <Text style={styles.subtitle}>Driver Gateway Node</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="driver@logisync.com"
                    placeholderTextColor="#94a3b8"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    placeholder="••••••••"
                    placeholderTextColor="#94a3b8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
                    {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>SIGN IN</Text>}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 24, justifyContent: 'center' },
    brandingBlock: { alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 32, fontWeight: '900', color: '#0f172a', letterSpacing: -1 },
    titleAccent: { color: '#06b6d4' },
    subtitle: { fontSize: 14, fontWeight: '600', color: '#64748b', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
    form: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 16, borderWidth: 1, borderColor: '#e2e8f0' },
    label: { fontSize: 12, fontWeight: '700', color: '#1e3a8a', marginBottom: 8, textTransform: 'uppercase' },
    input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 14, marginBottom: 20, color: '#0f172a' },
    button: { backgroundColor: '#3b82f6', padding: 16, borderRadius: 10, alignItems: 'center' },
    buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' }
});
