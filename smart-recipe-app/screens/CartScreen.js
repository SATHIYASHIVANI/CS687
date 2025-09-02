import React from "react";
import BottomNavBar from "../components/BottomNavBar";
import { View, Text, FlatList, StyleSheet } from "react-native";

export default function CartScreen({ cartItems = [], onBack, onDiscover, onCommunity, onMealPlans, onCart, onProfile }) {
  // Calculate total price
  const total = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>My Cart</Text>
      <View style={styles.cartContainer}>
        <FlatList
          data={cartItems}
          keyExtractor={(item, idx) => item.name + idx}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>${item.price?.toFixed(2) || "-"}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No ingredients in cart.</Text>}
        />
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <Text style={styles.backBtn} onPress={onBack}>← Back</Text>
      </View>
      {/* Reusable BottomNavBar */}
    {/* BottomNavBar removed as per patch request */}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fffbe6', padding: 18 },
  cartContainer: { flex: 1, paddingBottom: 80 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 18, color: '#ff7043' },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  itemName: { fontSize: 16, color: '#333' },
  itemPrice: { fontSize: 16, color: '#333' },
  totalText: { fontSize: 18, fontWeight: 'bold', marginTop: 18, color: '#388e3c' },
  emptyText: { color: '#888', marginTop: 40, textAlign: 'center' },
  backBtn: { marginTop: 24, color: '#fff', backgroundColor: '#ff7043', padding: 12, borderRadius: 10, fontWeight: 'bold', fontSize: 18, textAlign: 'center' },
});
