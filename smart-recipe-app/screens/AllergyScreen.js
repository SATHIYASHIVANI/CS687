import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BottomNavBar from "../components/BottomNavBar";

const ALLERGIES = [
  "Peanuts", "Dairy", "Gluten", "Eggs", "Shellfish", "Soy", "Tree Nuts", "Fish", "Sesame", "Wheat",
  "Corn", "Mustard", "Celery", "Lupin", "Molluscs", "Sulfites", "Buckwheat", "Tomato", "Strawberry", "Kiwi"
];

export default function AllergyScreen({ allergies, setAllergies, onNext, name, onBack }) {
  const bubbleColors = ["#ff7043", "#ffd54f", "#81c784", "#4fc3f7", "#ba68c8", "#f06292", "#fff176", "#a1887f", "#ffb347", "#aed581", "#ff8a65", "#ce93d8", "#e57373", "#64b5f6", "#d4e157", "#ffb300", "#8d6e63", "#fbc02d", "#e1bee7", "#b2dfdb", "#c5e1a5"];
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hello, {name}!</Text>
      <Text style={styles.title}>Select Your Allergies</Text>
      <View style={styles.bubbleWrap}>
        {ALLERGIES.map((a, i) => {
          const selected = allergies.includes(a);
          return (
            <TouchableOpacity
              key={a}
              style={[
                styles.bubble,
                {
                  backgroundColor: selected ? bubbleColors[i % bubbleColors.length] : "#fffde7",
                  borderColor: bubbleColors[i % bubbleColors.length]
                },
                selected && styles.selectedBubble
              ]}
              onPress={() =>
                setAllergies(
                  selected
                    ? allergies.filter(x => x !== a)
                    : [...allergies, a]
                )
              }
            >
              <Text style={{ color: selected ? "#fff" : bubbleColors[i % bubbleColors.length], fontWeight: "bold", fontSize: 16 }}>{a}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity style={styles.nextBtn} onPress={onNext}>
        <Text style={styles.nextBtnText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ff7043",
    marginBottom: 8,
    alignSelf: "flex-start"
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fffbe6"
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#ffb300",
    alignSelf: "flex-start"
  },
  bubbleWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
  },
  bubble: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    margin: 6,
    borderWidth: 2,
    backgroundColor: "#fffde7",
    borderColor: "#ffd54f",
    elevation: 2,
  },
  selectedBubble: {
    borderWidth: 0,
    elevation: 4,
    backgroundColor: "#ffb300",
  },
  nextBtn: {
    width: "80%",
    backgroundColor: "#ffb300",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  nextBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});