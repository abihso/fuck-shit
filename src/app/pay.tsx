import React, { useState } from 'react';
import { View, Button, StyleSheet, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';

// 👈 Essential for capturing deep link returns in Expo
WebBrowser.maybeCompleteAuthSession();

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const payNow = async () => {
    setLoading(true);

    try {
      // 1. Initialize Paystack Transaction
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk_test_5770913a8108d1759799f623241fdd9f7a4e0d87', 
        },
        body: JSON.stringify({
          email: 'jane.doe@example.com',
          amount: 500000,
          reference: `TXN_${Date.now()}`,
          
          // ⚠️ MUST be a valid https URL for Paystack's API to accept it!
          callback_url: 'https://standard.paystack.co/close',
        }),
      });

      const data = await response.json();

      if (data.status && data.data?.authorization_url) {
        // 2. Open In-App Browser Session listening for your app's 'ride' scheme
        const result = await WebBrowser.openAuthSessionAsync(
          data.data.authorization_url,
          'ride://pay' // 👈 Captures the deep link back to your app
        );

        // 3. Navigate inside your app when the browser session closes
        if (result.type === 'success' || result.type === 'dismiss') {
          router.push('/pay');
        }
      } else {
        Alert.alert('Error', data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      Alert.alert('Error', 'Unable to process payment right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Pay Now" onPress={payNow} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Checkout;