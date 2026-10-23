import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { useRouter, Redirect } from 'expo-router'; // Redirect component imported

export default function HomeScreen() {
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);
  const [hasToken, setHasToken] = useState<boolean>(false);

  useEffect(() => {
    const checkDriverSession = async () => {
      try {
        const token = await SecureStore.getItemAsync('driver_auth_token');
        console.log(token)

        if (token) {
          setHasToken(true);
        }
      } catch (err) {
        console.error('Session token authorization read crash:', err);
      } finally {
        setCheckingAuth(false); // Verification complete, dismiss load state
      }
    };

    checkDriverSession();
  }, []);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('driver_auth_token');
    setHasToken(false);
    router.replace('/login');
  };

  // 1. Jab tak session validation chal rahi hai, tab tak loader dikhao
  if (checkingAuth) {
    return (
      <View style={styles.centeredState}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Verifying Driver Credentials...</Text>
      </View>
    );
  }

  // 2. 🛡️ Industry Standard Declarative Redirect
  // Agar token nahi mila, toh declarative link user ko direct /login screen par push kar dega bina crash hue
  if (!hasToken) {
    return <Redirect href="/login" />;
    // return <View style={styles.centeredState}>
    //   <Text style={styles.loadingText}>No Token</Text>
    // </View>
  }

  // 3. Agar token hai, toh actual dashboard render hoga
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Driver Dashboard</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome back to LogiSync-X Node Engine.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredState: { flex: 1, backgroundColor: '#f8fafc', justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, fontSize: 14, color: '#64748b', fontWeight: '600' },
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingVertical: 15 },
  title: { fontSize: 24, fontWeight: '800', color: '#0f172a' },
  logoutText: { color: '#FF3B30', fontWeight: '700', fontSize: 14 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  welcome: { fontSize: 16, color: '#64748b', textAlign: 'center', fontWeight: '500' }
});
