import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function FilterScreen({ onClose, fetchRecipes }) {
  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
        <Text style={{ fontSize: 28, color: '#ff0055' }}>×</Text>
      </TouchableOpacity>
      <Text style={styles.title}>What's in your kitchen?</Text>
      <View style={styles.bannerCard}>
        <Text style={styles.bannerText}>Find recipes based on what you already have at home!</Text>
        <TouchableOpacity style={styles.bannerArrow}>
          <Text style={{ fontSize: 22, color: '#ff0055' }}>→</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionHeader}>Popular</Text>
      <View style={styles.gridRow}>
        {['Easy Dinner', '5 Ingredients or Less', 'Under 30 Minutes', 'Chicken', 'Breakfast', 'Desserts'].map((txt, idx) => (
          <TouchableOpacity key={idx} style={styles.gridBtn} onPress={() => fetchRecipes(txt)}>
            <Text style={styles.gridBtnText}>{txt}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.sectionHeader}>Difficulty</Text>
      <View style={styles.filterBubbleRow}>
        {['Under 1 Hour', 'Under 45 Minutes', 'Under 15 Minutes', 'Under 30 Minutes', 'Easy', '5 Ingredients or Less'].map((txt, idx) => (
          <TouchableOpacity key={idx} style={styles.filterBubble} onPress={() => fetchRecipes(txt)}>
            <Text style={styles.filterBubbleText}>{txt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

  // Helper for grid rendering
const renderResultsGrid = () => {
    if (!result || !Array.isArray(result) || result.length === 0) return null;
    return (
      <ScrollView style={{ flex: 1, backgroundColor: '#ffe066' }} contentContainerStyle={{ paddingBottom: 0, flexGrow: 1 }}>
        <View style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'stretch', width: '100%' }}>
          {(result.reduce((rows, recipe, idx, arr) => {
            if (idx % 2 === 0) rows.push([recipe, arr[idx + 1]]);
            return rows;
          }, [])).map((row, rowIdx) => (
            <View key={rowIdx} style={{ flexDirection: 'row', width: '100%' }}>
              <View style={{ flex: 1 }}>{row[0] && renderRecipeCard({ item: row[0] })}</View>
              <View style={{ flex: 1 }}>{row[1] && renderRecipeCard({ item: row[1] })}</View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

const styles = StyleSheet.create({
  searchBarWrap: { flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 10 },
  input: {
    borderWidth: 0,
    padding: 10,
    width: "85%",
    borderRadius: 18,
    backgroundColor: "#222",
    color: "#fff",
    fontSize: 16,
    marginRight: 8,
  },
  searchBtn: {
    backgroundColor: "#ffb300",
    borderRadius: 18,
    padding: 8,
    elevation: 2,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  root: { flex: 1, backgroundColor: '#181818', padding: 18 },
  closeBtn: { position: 'absolute', left: 18, top: 18, zIndex: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginTop: 60, marginBottom: 18 },
  bannerCard: { backgroundColor: '#222', borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  bannerText: { color: '#fff', fontSize: 16, flex: 1 },
  bannerArrow: { marginLeft: 12 },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginTop: 18, marginBottom: 8 },
  gridRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  gridBtn: { backgroundColor: '#333', borderRadius: 12, paddingVertical: 18, paddingHorizontal: 18, margin: 6, minWidth: 120, alignItems: 'center' },
  gridBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  filterBubbleRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
  filterBubble: { backgroundColor: '#ff0055', borderRadius: 22, paddingVertical: 10, paddingHorizontal: 18, margin: 6, alignItems: 'center', marginBottom: 8 },
  filterBubbleText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
});
