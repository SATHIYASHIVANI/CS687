import React from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";

const ALLERGIES = ["Peanuts", "Dairy", "Gluten", "Eggs", "Shellfish", "Soy", "Tree Nuts", "Fish", "Sesame", "Wheat"];

export default function AllergyScreen({ allergies, setAllergies, onNext }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Allergies</Text>
      <View style={styles.bubbleWrap}>
        {ALLERGIES.map(a => (
          <TouchableOpacity
            key={a}
            style={[styles.bubble, allergies.includes(a) && styles.selectedBubble]}
            onPress={() =>
              setAllergies(
                allergies.includes(a)
                  ? allergies.filter(x => x !== a)
                  : [...allergies, a]
              )
            }
          >
            <Text style={{ color: allergies.includes(a) ? "#fff" : "#333" }}>{a}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="Next" onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  bubbleWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  bubble: { backgroundColor: "#eee", borderRadius: 20, padding: 10, margin: 5 },
  selectedBubble: { backgroundColor: "#4caf50" }
});