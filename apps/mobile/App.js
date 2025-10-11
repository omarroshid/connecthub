import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Somali Cameo</Text>
      <Text style={styles.text}>Welcome to the Somali creator–fan marketplace mobile app!</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 32, fontWeight: 'bold' },
  text: { fontSize: 18, color: '#555', marginTop: 10 },
});
