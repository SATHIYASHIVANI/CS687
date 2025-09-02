import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";

export default function LoginScreen({ onNext, onCreateAccount }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Smart Recipe</Text>
      <Text style={styles.subtitle}>Welcome! Please log in to continue.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#ffb300"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#ffb300"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={[styles.button, !(email && password) && styles.buttonDisabled]}
        onPress={() => onNext(email, password)}
        disabled={!(email && password)}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.createAccount} onPress={onCreateAccount}>
        <Text style={styles.createText}>New user? Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fffbe6"
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffb300",
    textShadowColor: "#ffe082",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 24,
  },
  input: {
    borderWidth: 2,
    borderColor: "#ffb300",
    padding: 14,
    width: "90%",
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#fffde7",
    color: "#6d4c41",
    fontSize: 18,
  },
  button: {
    width: "90%",
    backgroundColor: "#ffb300",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: "#ffe082",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
  createAccount: {
    marginTop: 8,
  },
  createText: {
    color: "#388e3c",
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});