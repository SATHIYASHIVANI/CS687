import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, Image, Button, StyleSheet, TouchableOpacity, Modal, TextInput } from "react-native";
import axios from "axios";
import { AntDesign } from '@expo/vector-icons';

export default function RecipeScreen({ recipe, allergies, onBack, relatedRecipes = [], onAddToCart }) {
  const [allergyResult, setAllergyResult] = useState(null);
  // ChatCook state
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const [showSteps, setShowSteps] = useState(false);
  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    setChatLoading(true);
    setChatMessages(msgs => [...msgs, { sender: "user", text: chatInput }]);
    try {
      const res = await axios.post("http://10.30.16.92:5000/chat-cook", { message: chatInput });
      setChatMessages(msgs => [...msgs, { sender: "ai", text: res.data.reply }]);
    } catch (err) {
      setChatMessages(msgs => [...msgs, { sender: "ai", text: "Sorry, ChatCook is unavailable." }]);
    }
    setChatInput("");
    setChatLoading(false);
  };

  useEffect(() => {
    async function autoCheckAllergy() {
      if (recipe && allergies && allergies.length > 0) {
        const res = await axios.post("http://10.30.16.92:5000/allergy-check", {
          name: recipe.name,
          allergies
        });
        setAllergyResult(res.data);
      }
    }
    autoCheckAllergy();
  }, [recipe, allergies]);

  const checkAllergy = async () => {
    const res = await axios.post("http://10.30.16.92:5000/allergy-check", {
      name: recipe.name,
      allergies
    });
    setAllergyResult(res.data);
  };

  // Helper to split description into lines
  const descriptionLines = (recipe.description || "No description available for this recipe.").split(/\r?\n/);
  const shortDescription = descriptionLines.slice(0, 3).join(' ');
  const hasMoreDesc = descriptionLines.length > 3;

  return (
    <View style={{ flex: 1, backgroundColor: '#fffbe6' }}>
      <TouchableOpacity style={styles.chatIconBtn} onPress={() => setChatVisible(true)}>
        <Text style={{ fontSize: 28 }}>💬</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.topBackBtn} onPress={onBack}>
            <Text style={{ fontSize: 20, color: '#ffb300' }}>←</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>{recipe.name}</Text>
  {recipe.subtitle && <Text style={styles.subtitle}>{recipe.subtitle}</Text>}
        <View style={styles.infoRow}>
          <Text style={styles.infoItem}>⏱ {recipe.total_time || recipe.prep_time || "30 min"}</Text>
          <Text style={styles.infoItem}>👍 {recipe.rating || "87%"}</Text>
          <Text style={styles.infoItem}>💡 {recipe.tips || "5 Tips"}</Text>
        </View>
        <View style={styles.descriptionSection}>
          <Text style={styles.descriptionText}>
            {descExpanded ? recipe.description : shortDescription}
          </Text>
          {hasMoreDesc && !descExpanded && (
            <TouchableOpacity onPress={() => setDescExpanded(true)} style={styles.expandDescBtn}>
              <AntDesign name="pluscircle" size={22} color="#ff7043" />
            </TouchableOpacity>
          )}
          {hasMoreDesc && descExpanded && (
            <TouchableOpacity onPress={() => setDescExpanded(false)} style={styles.expandDescBtn}>
              <AntDesign name="minuscircle" size={22} color="#ff7043" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.actionBtn}><Text style={styles.actionBtnText}>I Made This!</Text></TouchableOpacity>
        <Image source={{ uri: recipe.image_url }} style={styles.mainImage} />
        <TouchableOpacity style={styles.startCookingBtn}><Text style={styles.startCookingText}>Start Cooking</Text></TouchableOpacity>
        {/* Ingredients Section */}
        <Text style={styles.sectionHeader}>Ingredients for {recipe.servings || 4} servings</Text>
        <View style={styles.ingredientsList}>
          {(recipe.ingredients || []).map((i, idx) => (
            <View key={idx} style={styles.ingredientRow}>
              <Text style={styles.ingredientText}>{i}</Text>
            </View>
          ))}
        </View>
        {/* Nutrition Info */}
        <Text style={styles.sectionHeader}>Nutrition Info</Text>
        <View style={styles.nutritionRow}>
          <Text style={styles.nutritionItem}>Calories: {recipe.nutrition?.calories || "-"}</Text>
          <Text style={styles.nutritionItem}>Protein: {recipe.nutrition?.protein || "-"}</Text>
          <Text style={styles.nutritionItem}>Fat: {recipe.nutrition?.fat || "-"}</Text>
          <Text style={styles.nutritionItem}>Carbs: {recipe.nutrition?.carbs || "-"}</Text>
        </View>
        {/* Nutrition Benefits Section */}
        {recipe.nutrition?.benefits && (
          <View style={styles.nutritionBenefitsSection}>
            <Text style={styles.sectionHeader}>Nutrition Benefits</Text>
            <Text style={styles.nutritionBenefitsText}>{recipe.nutrition.benefits}</Text>
          </View>
        )}
        {/* Step-by-step Instructions */}
        <Text style={styles.sectionHeader}>Preparation</Text>
        <View style={styles.prepTimesRow}>
          <Text style={styles.prepTime}>Total Time: {recipe.total_time || "30 min"}</Text>
          <Text style={styles.prepTime}>Prep Time: {recipe.prep_time || "10 min"}</Text>
          <Text style={styles.prepTime}>Cook Time: {recipe.cook_time || "20 min"}</Text>
        </View>
        <TouchableOpacity style={styles.stepModeBtn} onPress={() => setShowSteps(true)}>
          <Text style={styles.stepModeText}>Step-by-step mode</Text>
        </TouchableOpacity>
        <View style={styles.instructionsList}>
          {(recipe.instructions || []).map((step, idx) => (
            <View key={idx} style={styles.instructionRow}>
              <Text style={styles.instructionNum}>{idx + 1}.</Text>
              <Text style={styles.instructionText}>{step}</Text>
            </View>
          ))}
        </View>
        {/* Allergy Check */}
        <View style={styles.buttonWrapper}>
          <Button title="Check Allergy" onPress={checkAllergy} color="#ff7043" />
        </View>
        {allergyResult && (
          allergyResult.allergy_risk && allergyResult.matched_allergies && allergyResult.matched_allergies.length > 0 ? (
            <View style={styles.allergyWarning}>
              <Text style={styles.allergyWarningText}>
                Warning: You are allergic to {allergyResult.matched_allergies.join(', ')} in this recipe!
              </Text>
            </View>
          ) : (
            <Text style={styles.allergySafeText}>
              This recipe is safe for you!
            </Text>
          )
        )}
        {/* Related Recipes */}
        <Text style={styles.sectionHeader}>Related Recipes</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedScroll}>
          {relatedRecipes.map((r, idx) => (
            <TouchableOpacity key={idx} style={styles.relatedCard}>
              <Image source={{ uri: r.image_url }} style={styles.relatedImage} />
              <Text style={styles.relatedTitle}>{r.name}</Text>
              <Text style={styles.relatedSubtitle}>{r.subtitle || "One-pot"}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Cart Actions */}
        <TouchableOpacity style={styles.cartBtn} onPress={async () => {
          if (!recipe.ingredients || recipe.ingredients.length === 0) return;
          await onAddToCart(recipe.ingredients);
        }}>
          <Text style={styles.cartBtnText}>
            Add ingredients to My Cart (local store prices)
          </Text>
        </TouchableOpacity>
      </ScrollView>
      {/* ChatCook Modal */}
      <Modal visible={chatVisible} animationType="slide" transparent={true}>
        <View style={styles.chatModalOverlay}>
          <View style={styles.chatModal}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8, color: "#ffb300" }}>ChatCook</Text>
            <ScrollView style={{ maxHeight: 260, marginBottom: 8 }}>
              {chatMessages.map((msg, idx) => (
                <View key={idx} style={{ alignSelf: msg.sender === "user" ? "flex-end" : "flex-start", backgroundColor: msg.sender === "user" ? "#ffe082" : "#fffde7", borderRadius: 12, padding: 8, marginVertical: 4, maxWidth: "80%" }}>
                  <Text style={{ color: msg.sender === "user" ? "#333" : "#ffb300" }}>{msg.text}</Text>
                </View>
              ))}
            </ScrollView>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TextInput
                style={{ flex: 1, borderWidth: 1, borderColor: "#ffb300", borderRadius: 12, padding: 8, backgroundColor: "#fffde7", color: "#333" }}
                placeholder="Type your message..."
                value={chatInput}
                onChangeText={setChatInput}
                editable={!chatLoading}
              />
              <TouchableOpacity style={{ marginLeft: 8, backgroundColor: "#ffb300", borderRadius: 12, padding: 8 }} onPress={handleChatSend} disabled={chatLoading}>
                <Text style={{ fontSize: 20 }}>{chatLoading ? "..." : "Send"}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={{ marginTop: 12, alignSelf: "center" }} onPress={() => setChatVisible(false)}>
              <Text style={{ color: "#ff7043", fontWeight: "bold", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Step-by-Step Instructions Modal */}
      <Modal visible={showSteps} animationType="slide" transparent={true}>
        <View style={styles.stepsModalOverlay}>
          <View style={styles.stepsModal}>
            <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 12, color: '#ffb300' }}>Step-by-Step Instructions</Text>
            <ScrollView style={{ maxHeight: 320 }}>
              {(recipe.instructions || []).map((step, idx) => (
                <View key={idx} style={styles.stepRow}>
                  <Text style={styles.stepNum}>{idx + 1}.</Text>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.closeStepsBtn} onPress={() => setShowSteps(false)}>
              <Text style={{ color: '#ff7043', fontWeight: "bold", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  chatIconBtn: {
    position: "absolute",
    top: 18,
    right: 18,
    zIndex: 10,
    backgroundColor: "#fffde7",
    borderRadius: 24,
    padding: 8,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#ffb300",
  },
  chatModalOverlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.05)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    zIndex: 100,
  },
  chatModal: {
    width: 320,
    minHeight: 260,
    maxHeight: 400,
    backgroundColor: "#fffbe6",
    borderRadius: 18,
    padding: 16,
    margin: 18,
    elevation: 8,
    shadowColor: "#333",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: "#ffb300",
  },
  topBackBtn: { alignSelf: "flex-start", marginBottom: 8, marginTop: 8, marginLeft: 4, padding: 6, borderRadius: 8, backgroundColor: "#ffe082", elevation: 2 },
  title: { fontSize: 28, fontWeight: "bold", color: "#ffb300", marginBottom: 2, marginTop: 12, alignSelf: "center" },
  subtitle: { fontSize: 16, color: "#888", marginTop: 2, marginBottom: 8, alignSelf: "center" },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, marginTop: 8 },
  infoItem: { fontSize: 16, color: '#333', backgroundColor: '#ffe082', borderRadius: 8, padding: 6, marginRight: 6 },
  descriptionSection: { backgroundColor: '#fffde7', borderRadius: 10, padding: 12, marginBottom: 10, marginHorizontal: 8, alignItems: 'center' },
  descriptionText: { fontSize: 17, color: '#ff7043', fontWeight: 'bold', textAlign: 'center' },
  expandDescBtn: { marginTop: 6 },
  actionBtn: { backgroundColor: '#ffb300', borderRadius: 12, padding: 10, marginVertical: 8, alignSelf: 'center' },
  actionBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  mainImage: { width: '100%', height: 220, borderRadius: 18, marginBottom: 10, borderWidth: 3, borderColor: '#ffb300', backgroundColor: '#fffde7' },
  startCookingBtn: { backgroundColor: '#ff7043', borderRadius: 12, padding: 12, marginVertical: 8, alignSelf: 'center' },
  startCookingText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', marginTop: 20, color: '#ffb300', marginBottom: 6 },
  ingredientsList: { marginBottom: 12 },
  ingredientRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  ingredientText: { fontSize: 16, color: '#333', marginBottom: 2, flex: 1 },
  nutritionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12, width: '100%' },
  nutritionItem: { fontSize: 16, color: '#888', fontWeight: 'bold', marginBottom: 2 },
  prepTimesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  prepTime: { fontSize: 16, color: '#333', backgroundColor: '#ffe082', borderRadius: 8, padding: 6, marginRight: 6 },
  stepModeBtn: { backgroundColor: '#ffb300', borderRadius: 12, padding: 10, marginVertical: 8, alignSelf: 'center' },
  stepModeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  instructionsList: { marginBottom: 12 },
  instructionRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 4 },
  instructionNum: { fontSize: 18, color: '#ffb300', marginRight: 8, marginTop: 2 },
  instructionText: { fontSize: 16, color: '#333', marginBottom: 2, flex: 1 },
  buttonWrapper: { width: '80%', borderRadius: 10, overflow: 'hidden', backgroundColor: '#ffe082', elevation: 2, marginTop: 16, marginBottom: 8, alignSelf: 'center' },
  allergyWarning: { backgroundColor: '#ffe082', borderRadius: 12, padding: 12, marginVertical: 12, alignItems: 'center', borderWidth: 2, borderColor: '#d32f2f' },
  allergyWarningText: { color: '#d32f2f', fontWeight: 'bold', fontSize: 18 },
  allergySafeText: { color: '#388e3c', marginTop: 10, fontWeight: 'bold', fontSize: 16, alignSelf: 'center' },
  relatedScroll: { marginVertical: 12 },
  relatedCard: { width: 140, marginRight: 12, backgroundColor: '#fffde7', borderRadius: 12, padding: 8, alignItems: 'center', elevation: 2 },
  relatedImage: { width: 120, height: 80, borderRadius: 8, marginBottom: 6 },
  relatedTitle: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 2 },
  relatedSubtitle: { fontSize: 12, color: '#888' },
  cartBtn: { backgroundColor: '#ffb300', borderRadius: 12, padding: 12, marginVertical: 8, alignSelf: 'center' },
  cartBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  nutritionBenefitsSection: { backgroundColor: '#e8f5e9', borderRadius: 10, padding: 10, marginBottom: 12, marginHorizontal: 8 },
  nutritionBenefitsText: { fontSize: 16, color: '#388e3c', fontWeight: 'bold' },
  stepsModalOverlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  stepsModal: {
    width: 340,
    minHeight: 220,
    maxHeight: 400,
    backgroundColor: '#fffbe6',
    borderRadius: 18,
    padding: 18,
    elevation: 8,
    shadowColor: '#333',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    borderWidth: 2,
    borderColor: '#ffb300',
  },
  stepBtn: {
    backgroundColor: '#ffb300',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    elevation: 2,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  stepNum: {
    fontWeight: 'bold',
    color: '#ff7043',
    fontSize: 16,
    marginRight: 8,
  },
  stepText: {
    fontSize: 16,
    color: '#333',
    flexShrink: 1,
  },
  closeStepsBtn: {
    marginTop: 18,
    alignSelf: 'center',
  },
});