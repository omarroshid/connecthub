import React, { useState } from 'react';
import { View, Text, TextInput, Button, Picker, StyleSheet, Alert } from 'react-native';

export default function OnboardingScreen() {
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('fan');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // TODO: Use Firebase user (auth) here; for now, use mock user
  const mockUser = { uid: 'mobiledemo1', email: 'mobile@demo.test' };

  const handleComplete = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const resp = await fetch('http://localhost:4000/user/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: mockUser.uid,
          email: mockUser.email,
          displayName,
          role,
          bio,
        })
      });
      if (resp.ok) {
        setSuccess(true);
        Alert.alert('Onboarding complete!', 'Your account is set up.');
      } else {
        const err = await resp.json();
        Alert.alert('Error', err.error ?? 'Failed to onboard.');
      }
    } catch (err) {
      Alert.alert('Error', 'Could not connect to API.');
    }
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Onboarding</Text>
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Picker selectedValue={role} style={styles.input} onValueChange={setRole}>
        <Picker.Item label="Fan" value="fan" />
        <Picker.Item label="Creator" value="creator" />
      </Picker>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        multiline
      />
      <Button title={loading ? "Saving..." : "Complete Setup"} onPress={handleComplete} disabled={loading} />
      {success && <Text style={{color: 'green', marginTop: 14}}>Onboarding complete! 🎉</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 28, marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#ccc', borderRadius: 4, padding: 10, marginBottom: 15 },
});
