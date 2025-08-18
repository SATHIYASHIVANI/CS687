import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, StyleSheet } from "react-native";
import axios from "axios";

export default function SearchScreen({ onSelectRecipe }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setError("");
    setResult(null);
    try {
      const res = await axios.post("http://127.0.0.1:5000/search", { name: query });
      setResult(res.data);
    } catch {
      setError("Recipe not found");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for a Recipe</Text>
      <TextInput
        style={styles.input}
        placeholder="Recipe name"
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Search" onPress={handleSearch} />
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      {result && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.recipeTitle}>{result.name}</Text>
          <Image source={{ uri: result.image_url }} style={{ width: 200, height: 120 }} />
          <Button title="View Details" onPress={() => onSelectRecipe(result)} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, width: "80%", marginBottom: 20, borderRadius: 5 },
  recipeTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 }
});