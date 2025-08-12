import React, { useState } from "react";
import { View, Text, TextInput, Button, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import axios from "axios";

const ALLERGIES = ["Peanuts", "Dairy", "Gluten", "Eggs", "Shellfish", "Soy", "Tree Nuts", "Fish", "Sesame", "Wheat"];

export default function App() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [query, setQuery] = useState("");
  const [recipe, setRecipe] = useState(null);
  const [allergyResult, setAllergyResult] = useState(null);
  const [error, setError] = useState("");

  // Step 1: Login
  if (step === 1) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <Button title="Next" onPress={() => setStep(2)} disabled={!name} />
      </View>
    );
  }

  // Step 2: Allergy Selection
  if (step === 2) {
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
        <Button title="Next" onPress={() => setStep(3)} />
      </View>
    );
  }

  // Step 3: Search
  if (step === 3) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Search for a Recipe</Text>
        <TextInput
          style={styles.input}
          placeholder="Recipe name"
          value={query}
          onChangeText={setQuery}
        />
        <Button
          title="Search"
          onPress={async () => {
            setError("");
            setRecipe(null);
            setAllergyResult(null);
            try {
              const res = await axios.post("http://YOUR_IP:5000/search", { name: query });
              setRecipe(res.data);
              setStep(4);
            } catch {
              setError("Recipe not found");
            }
          }}
        />
        {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      </View>
    );
  }

  // Step 4: Recipe Page
  if (step === 4 && recipe) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Button title="Back" onPress={() => setStep(3)} />
        <Text style={styles.title}>{recipe.name}</Text>
        <Image source={{ uri: recipe.image_url }} style={{ width: 250, height: 150 }} />
        <Text style={styles.subtitle}>Nutrition</Text>
        <Text>Calories: {recipe.nutrition.calories}</Text>
        <Text>Protein: {recipe.nutrition.protein}</Text>
        <Text>Fat: {recipe.nutrition.fat}</Text>
        <Text>Carbs: {recipe.nutrition.carbs}</Text>
        <Text>Benefits: {recipe.nutrition.benefits}</Text>
        <Text style={styles.subtitle}>Ingredients</Text>
        {recipe.ingredients.map(i => <Text key={i}>- {i}</Text>)}
        <Button
          title="Check Allergy"
          onPress={async () => {
            const res = await axios.post("http://YOUR_IP:5000/allergy-check", {
              name: recipe.name,
              allergies
            });
            setAllergyResult(res.data);
          }}
        />
        {allergyResult && (
          <Text style={{ color: allergyResult.allergy_risk ? "red" : "green", marginTop: 10 }}>
            {allergyResult.allergy_risk
              ? `Warning: You are allergic to ${allergyResult.matched_allergies.join(", ")} in this recipe!`
              : "This recipe is safe for you!"}
          </Text>
        )}
      </ScrollView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, width: "80%", marginBottom: 20, borderRadius: 5 },
  bubbleWrap: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  bubble: { backgroundColor: "#eee", borderRadius: 20, padding: 10, margin: 5 },
  selectedBubble: { backgroundColor: "#4caf50" }
});