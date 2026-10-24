import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, FlatList, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, Redirect } from 'expo-router';
import axios from 'axios';

const TARGET_IP = '192.168.100.27';
const BASE_URL = Platform.OS === 'android' ? `http://${TARGET_IP}:3000` : `http://${TARGET_IP}:3000`;

interface Order {
  id: string;
  trackingId: string;
  customerName: string;
  pickupLocation: string;
  deliveryAddress: string;
  status: string;
}

interface DriverProfile {
  id: string;
  name: string;
  vehicleNumber: string;
  email: string;
}

export default function HomeScreen() {
  const router = useRouter();

  // Auth & Session States
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [hasToken, setHasToken] = useState<boolean>(false);

  // Data Loading States
  const [orders, setOrders] = useState<Order[]>([]);
  const [driver, setDriver] = useState<DriverProfile | null>(null);
  const [loadingOrders, setLoadingOrders] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Core API call function to fetch orders using stored profile ID
  const fetchDriverOrders = useCallback(async (isRefreshingCall = false) => {
    if (isRefreshingCall) {
      setRefreshing(true);
    } else {
      setLoadingOrders(true);
    }
    setErrorMsg(null);

    try {
      const token = await SecureStore.getItemAsync('driver_auth_token');
      const storedProfile = await AsyncStorage.getItem('driver_profile');
      console.log(token);
      console.log(storedProfile);

      if (token && storedProfile) {
        const parsedDriver: DriverProfile = JSON.parse(storedProfile);
        setDriver(parsedDriver);

        const endpoint = `${BASE_URL}/api/v1/drivers/my-orders/${parsedDriver.id}`;
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setOrders(response.data);
        }
      }
    } catch (err: any) {
      console.error('Fetch Orders Failed:', err);
      setErrorMsg(err.response?.data?.message || 'Failed to update order manifests.');
    } finally {
      setLoadingOrders(false);
      setRefreshing(false);
    }
  }, []);

  // 2. Initial Session Check on mount
  useEffect(() => {
    const checkDriverSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('driver_auth_token');
        if (token) {
          setHasToken(true);
          // Fetch orders immediately if token is verified
          await fetchDriverOrders(false);
        }
      } catch (err) {
        console.error('Session token authorization read crash:', err);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkDriverSession();
  }, [fetchDriverOrders]);

  // 3. Clear storage and force drop back to Login Node
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('driver_auth_token');
    await AsyncStorage.removeItem('driver_profile');
    setHasToken(false);
    setDriver(null);
    setOrders([]);
    router.replace('/login');
  };

  // Card UI Rendering for active delivery items
  const renderOrderCard = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.card}
      // onPress={() => router.push(`/orders/${item.id}`)} // 👈 Dynamically passes order id
      onPress={() => {
        console.log(item.id)
        return router.push({
          pathname: '/orders/[id]',
          params: { id: item.id }
        })
      }}

      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.trackingId}>{item.trackingId}</Text>
        <View style={[styles.statusBadge, item.status === 'IN_TRANSIT' ? styles.statusTransit : styles.statusDone]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.infoLabel}>Customer</Text>
        <Text style={styles.infoValue}>{item.customerName}</Text>
        <Text style={styles.infoLabel}>Pickup From</Text>
        <Text style={styles.infoValue}>{item.pickupLocation}</Text>
        <Text style={styles.infoLabel}>Delivery Destination</Text>
        <Text style={styles.infoValue}>{item.deliveryAddress}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render loading indicator while evaluating initial validation tokens
  if (checkingAuth) {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Verifying Driver Credentials...</Text>
      </View>
    );
  }

  // 🛡️ Declarative redirect fallback guard
  if (!hasToken) {
    return <Redirect href="/login" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Info & Quick Action Header */}
      <View style={styles.header}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.title} numberOfLines={1}>
            {driver ? `Hi, ${driver.name}` : 'Driver Dashboard'}
          </Text>
          <Text style={styles.subtitle}>
            {driver ? `Vehicle: ${driver.vehicleNumber}` : 'LogiSync-X Node'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.refreshButton} onPress={() => fetchDriverOrders(true)} disabled={loadingOrders || refreshing}>
            <Text style={styles.refreshButtonText}>REFRESH</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>LOGOUT</Text>
          </TouchableOpacity>
        </View>
      </View>

      {errorMsg && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      {/* List Control Block */}
      {loadingOrders ? (
        <View style={styles.loadingDataContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loadingText}>Syncing assigned manifests...</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchDriverOrders(true)} colors={['#3b82f6']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No driver manifests assigned to your node.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centeredState: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  loadingDataContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748b', fontWeight: '600' },

  // Header Panel
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  subtitle: { fontSize: 12, fontWeight: '600', color: '#64748b', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  refreshButton: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  refreshButtonText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  logoutButton: { borderWidth: 1, borderColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#ef4444', fontWeight: '700', fontSize: 11 },

  // Manifest List & Cards Layout
  listContainer: { padding: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0', elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottomWidth: 1, borderColor: '#f1f5f9', paddingBottom: 8 },
  trackingId: { fontSize: 15, fontWeight: '700', color: '#1e3a8a' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  statusTransit: { backgroundColor: '#fef3c7' },
  statusDone: { backgroundColor: '#dcfce7' },
  statusText: { fontSize: 11, fontWeight: '700', color: '#b45309' },
  cardBody: { gap: 6 },
  infoLabel: { fontSize: 10, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, fontWeight: '500', color: '#334155', marginBottom: 4 },
  // Status Feedbacks
  errorBanner: { backgroundColor: '#fee2e2', padding: 12, marginHorizontal: 20, marginTop: 16, borderRadius: 8, borderWidth: 1, borderColor: '#fca5a5' },
  errorText: { color: '#991b1b', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  emptyContainer: { alignItems: 'center', marginTop: 60 },
  emptyText: { color: '#64748b', fontSize: 14, fontWeight: '500' }
});