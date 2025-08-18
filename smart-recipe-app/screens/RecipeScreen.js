import React, { useState } from "react";
import { ScrollView, View, Text, Image, Button, StyleSheet } from "react-native";
import axios from "axios";

export default function RecipeScreen({ recipe, allergies, onBack }) {
  const [allergyResult, setAllergyResult] = useState(null);

  const checkAllergy = async () => {
    const res = await axios.post("http://127.0.0.1:5000/allergy-check", {
      name: recipe.name,
      allergies
    });
    setAllergyResult(res.data);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Back" onPress={onBack} />
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
      <Button title="Check Allergy" onPress={checkAllergy} />
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

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  subtitle: { fontSize: 18, fontWeight: "bold", marginTop: 20 }
});