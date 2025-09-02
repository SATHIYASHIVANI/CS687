  import React from "react";
  import { View, Text, StyleSheet } from "react-native";
  import BottomNavBar from "../components/BottomNavBar";

  export default function SavedScreen({ name, savedRecipes, onBack }) {
    return (
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.greeting}>Hello, {name}!</Text>
          <Text style={styles.title}>Saved Recipes</Text>
          {savedRecipes.length === 0 ? (
            <Text style={styles.empty}>No recipes saved yet.</Text>
          ) : (
            savedRecipes.map((recipe, idx) => (
              <Text key={idx} style={styles.recipe}>{recipe}</Text>
            ))
          )}
        </View>
        <BottomNavBar onBack={onBack} />
      </View>
    );
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      backgroundColor: "#fffbe6"
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#ff7043",
    },
    greeting: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 2,
      alignSelf: "flex-start"
    },
    empty: {
      fontSize: 16,
      color: "#888",
      marginTop: 20,
    },
    recipe: {
      fontSize: 18,
      color: "#388e3c",
      marginBottom: 10,
    },
  });