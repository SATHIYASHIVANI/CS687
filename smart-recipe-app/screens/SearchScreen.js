import React, { useState } from "react";
import BottomNavBar from "../components/BottomNavBar";
import { View, Text, TextInput, TouchableOpacity, Image, FlatList, StyleSheet, Modal, ScrollView } from "react-native";
import axios from "axios";

export default function SearchScreen({ onBack, onSelectRecipe, name, onProfile, onCart }) {
  // ...existing code...
  const [searchFocused, setSearchFocused] = useState(false);
  // ChatCook state
  const [chatVisible, setChatVisible] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const DEFAULT_IMAGE = "http://10.30.16.92:5000/static/default_food.jpg";

  const [trendingRecipes, setTrendingRecipes] = useState([]);

  React.useEffect(() => {
    // Fetch all recipes from backend on mount
    const fetchAllRecipes = async () => {
      try {
    const res = await axios.get("http://10.30.16.92:5000/recipes");
        // Handle both array and object response formats
        let recipes = [];
        if (Array.isArray(res.data)) {
          recipes = res.data;
        } else if (res.data && Array.isArray(res.data.recipes)) {
          recipes = res.data.recipes;
        }
        setTrendingRecipes(recipes.map(r => ({ ...r, image_url: r.image_url || DEFAULT_IMAGE })));
      } catch (err) {
        setError("Could not fetch recipes from backend");
        setTrendingRecipes([]);
      }
    };
    fetchAllRecipes();
  }, []);

  const fetchRecipes = async (searchTerm) => {
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await axios.post("http://10.30.16.92:5000/search", { name: searchTerm });
      if (Array.isArray(res.data)) {
        setResult(res.data.map(r => ({ ...r, image_url: r.image_url || DEFAULT_IMAGE })));
      } else if (res.data && res.data.error) {
        setError(res.data.error);
      } else if (res.data && res.data.ai_recipe) {
        setResult([{ name: searchTerm, image_url: DEFAULT_IMAGE, ingredients: [], nutrition: {}, rating: '', ai_text: res.data.ai_recipe }]);
      } else {
        setResult([{ ...res.data, image_url: res.data.image_url || DEFAULT_IMAGE }]);
      }
    } catch (err) {
      setError("Recipe not found");
    }
    setLoading(false);
  };

  const handleSearch = () => {
    if (query.trim()) {
      fetchRecipes(query);
    }
  };

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

  const defaultRecipe = {
    cuisine: '',
    rating: '4.5',
    prep_time: '',
    cook_time: '',
    difficulty: '',
    nutrition: { calories: '', protein: '', fat: '', carbs: '' },
    ingredients: [],
    instructions: [],
    image_url: DEFAULT_IMAGE,
    description: '',
  };

  const handleSelectRecipe = (recipe) => {
    // Fill missing fields for trending recipes
    const fullRecipe = { ...defaultRecipe, ...recipe };
    onSelectRecipe(fullRecipe);
  };

  const renderRecipeCard = ({ item: recipe }) => (
    <TouchableOpacity
      key={recipe.name}
      style={styles.recipeCard}
      onPress={() => handleSelectRecipe(recipe)}
    >
      <Image source={{ uri: recipe.image_url }} style={styles.recipeImage} />
      <View style={styles.recipeInfo}>
        <View style={styles.recipeTagRow}>
          <Text style={[styles.recipeTag, { backgroundColor: '#00b8d9' }]}>Easy</Text>
          <Text style={[styles.recipeTag, { backgroundColor: '#0052cc' }]}>One-pot</Text>
        </View>
        <Text style={styles.recipeTitle} numberOfLines={2} ellipsizeMode="tail">{recipe.name}</Text>
        <View style={styles.recipeInfoRow}>
          <Text style={styles.recipeInfoItem}>25 min</Text>
          <Text style={styles.recipeInfoItem}>87%</Text>
          <Text style={styles.recipeBookmark}>🔖</Text>
        </View>
      </View>
    </TouchableOpacity>
  );



  return (
    <View style={{ flex: 1, backgroundColor: '#181818' }}>
      {/* Banner/Header Section */}
      <View style={styles.bannerWrap}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Image source={{ uri: 'https://img.taste.com.au/1tQw1g1r/w720-h480-cfill-q80/taste/2016/11/garlic-bread-104822-1.jpeg' }} style={styles.bannerLogo} />
          <Text style={styles.bannerTitle}>WELCOME TO SMART RECIPE</Text>
        </View>
        <Text style={styles.bannerSubtitle}>Here's what we recommend for you!</Text>
      </View>
      <View style={styles.topBarWrap}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <TouchableOpacity style={styles.topBackBtn} onPress={onBack}>
            <Text style={{ fontSize: 18, color: '#fff' }}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.chatCookBtn} onPress={() => setChatVisible(true)}>
            <Text style={{ fontSize: 16, color: '#fff', fontWeight: 'bold' }}>ChatCook</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.searchBarWrap}>
          <TextInput
            style={{
              borderWidth: 0,
              padding: 10,
              width: "85%",
              borderRadius: 18,
              backgroundColor: searchFocused ? "#222" : "#222",
              color: "#fff",
              fontSize: 16,
              marginRight: 8,
            }}
            placeholder="Search Smart Recipe"
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={{ fontSize: 22, color: '#222' }}>🔍</Text>
          </TouchableOpacity>
        </View>
        {/* Show filter bubbles when search bar is focused and no search results */}
        {searchFocused && !result && !loading && (
          <ScrollView style={styles.filterBubbleWrap} contentContainerStyle={{ padding: 18 }}>
            <Text style={styles.filterSectionTitle}>Difficulty</Text>
            <View style={styles.filterBubbleRow}>
              {['Under 1 Hour', 'Under 45 Minutes', 'Under 15 Minutes', 'Under 30 Minutes', 'Easy', '5 Ingredients or Less'].map((txt, idx) => (
                <TouchableOpacity key={idx} style={styles.filterBubble} onPress={() => fetchRecipes(txt)}>
                  <Text style={styles.filterBubbleText}>{txt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.filterSectionTitle}>Diets</Text>
            <View style={styles.filterBubbleRow}>
              {['Alcohol-Free', 'Kosher', 'Halal', 'Keto', 'Pescatarian', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map((txt, idx) => (
                <TouchableOpacity key={idx} style={styles.filterBubble} onPress={() => fetchRecipes(txt)}>
                  <Text style={styles.filterBubbleText}>{txt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.filterSectionTitle}>Meal</Text>
            <View style={styles.filterBubbleRow}>
              {['Snacks', 'Sides', 'Lunch', 'Drinks', 'Dinner', 'Desserts', 'Brunch', 'Breakfast', 'Appetizers'].map((txt, idx) => (
                <TouchableOpacity key={idx} style={styles.filterBubble} onPress={() => fetchRecipes(txt)}>
                  <Text style={styles.filterBubbleText}>{txt}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.filterSectionTitle}>Cooking Style</Text>
            <View style={styles.filterBubbleRow}>
              {['Budget', 'Pan Fry', 'One-Pot or Pan', 'No Bake Desserts', 'Meal Prep', 'Big Batch'].map((txt, idx) => (
                <TouchableOpacity key={idx} style={styles.filterBubble} onPress={() => fetchRecipes(txt)}>
                  <Text style={styles.filterBubbleText}>{txt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}
        {/* Show loading indicator while searching */}
        {loading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffe066' }}>
            <Text style={{ fontSize: 18, color: '#333' }}>Searching recipes...</Text>
          </View>
        )}
        {/* Show search results if a search was performed */}
        {!loading && result && Array.isArray(result) && result.length > 0 && (
          <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, backgroundColor: '#ffe066' }} contentContainerStyle={{ paddingBottom: 180, flexGrow: 1 }}>
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
          </View>
        )}
      </View>



      {/* Show trending recipes if no search results and not loading */}
      {!loading && !result && !searchFocused && (
  <ScrollView style={{ flex: 1, backgroundColor: '#ffe066' }} contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}>
          <View style={{ flexDirection: 'column', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'stretch', width: '100%' }}>
            {trendingRecipes.length > 0 ?
              (trendingRecipes.reduce((rows, recipe, idx, arr) => {
                if (idx % 2 === 0) rows.push([recipe, arr[idx + 1]]);
                return rows;
              }, [])).map((row, rowIdx) => (
                <View key={rowIdx} style={{ flexDirection: 'row', width: '100%' }}>
                  <View style={{ flex: 1 }}>{row[0] && renderRecipeCard({ item: row[0] })}</View>
                  <View style={{ flex: 1 }}>{row[1] && renderRecipeCard({ item: row[1] })}</View>
                </View>
              ))
              : <Text style={{ textAlign: 'center', marginTop: 40, color: '#333', fontSize: 18 }}>No recipes found.</Text>
            }
          </View>
        </ScrollView>
      )}

      {error ? <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text> : null}
      {error ? <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>{error}</Text> : null}
      <Modal visible={chatVisible} animationType="slide" transparent={true}>
        <View style={styles.chatModalOverlay}>
          <View style={styles.chatModal}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8, color: '#ffb300' }}>ChatCook</Text>
            <View>
              <ScrollView style={{ maxHeight: 260, marginBottom: 8 }}>
                {chatMessages.map((msg, idx) => (
                  <View key={idx} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', backgroundColor: msg.sender === 'user' ? '#ffe082' : '#fffde7', borderRadius: 12, padding: 8, marginVertical: 4, maxWidth: '80%' }}>
                    <Text style={{ color: msg.sender === 'user' ? '#333' : '#ffb300' }}>{msg.text}</Text>
                  </View>
                ))}
              </ScrollView>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TextInput style={{ flex: 1, borderWidth: 1, borderColor: '#ffb300', borderRadius: 12, padding: 8, backgroundColor: '#fffde7', color: '#333' }} placeholder="Type your message..." value={chatInput} onChangeText={setChatInput} editable={!chatLoading} />
                <TouchableOpacity style={{ marginLeft: 8, backgroundColor: '#ffb300', borderRadius: 12, padding: 8 }} onPress={handleChatSend} disabled={chatLoading}>
                  <Text style={{ fontSize: 20 }}>{chatLoading ? '...' : 'Send'}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ marginTop: 12, alignSelf: 'center' }} onPress={() => setChatVisible(false)}>
                <Text style={{ color: '#ff7043', fontWeight: 'bold', fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Reusable BottomNavBar */}
      <BottomNavBar
        active="discover"
        onDiscover={() => {
          setQuery("");
          setResult(null);
          setError("");
          setSearchFocused(false);
          // Optionally re-fetch trending recipes if needed
          // fetchAllRecipes();
        }}
        onCommunity={() => {}}
        onMealPlans={() => {}}
        onCart={onCart}
        onProfile={onProfile}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  filterBubbleWrap: {
    backgroundColor: '#ffe066',
    flex: 1,
    width: '100%',
  },
  filterSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 18,
    marginBottom: 8,
  },
  filterBubbleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  filterBubble: {
    backgroundColor: '#ff0055',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  filterBubbleText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  bannerWrap: {
  backgroundColor: '#b19c36',
    paddingTop: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#333',
  },
  bannerLogo: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 12,
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 2,
    marginLeft: 4,
    fontWeight: '500',
  },
  topBackBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 20,
    backgroundColor: "#fffbe6"
  },
  greeting: { fontSize: 22, fontWeight: "bold", color: "#333", marginBottom: 2, alignSelf: "flex-start" },
  subtitle: { fontSize: 18, color: "#333", marginBottom: 18, alignSelf: "flex-start" },
  searchBarWrap: { flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 10 },
  filterGridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  filterGridBtn: {
    backgroundColor: '#ff0055',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 6,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  filterGridText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  filterTagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
    justifyContent: 'flex-start',
  },
  filterTagBtn: {
    backgroundColor: '#ff0055',
    borderRadius: 22,
    paddingVertical: 10,
    paddingHorizontal: 18,
    margin: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTagText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  topBarWrap: {
    paddingTop: 8,
    paddingHorizontal: 8,
    backgroundColor: "#b19c36ff",
  },
  bottomNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#fffbe6',
    borderTopWidth: 1,
    borderColor: '#ffb300',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  navLabel: {
    fontSize: 12,
    color: '#333',
    fontWeight: 'bold',
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
  // --- Added styles for new search screen UI ---
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
  recipeCard: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#ffe066",
    borderRadius: 0,
    padding: 0,
  marginHorizontal: 2,
  marginVertical: 1,
    alignItems: "stretch",
    shadowColor: "#b19c36",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    minWidth: 0,
    maxWidth: '100%',
    opacity: 1,
  },
  recipeImage: {
    width: '100%',
    height: 180,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 0,
    backgroundColor: "#ffe066",
    resizeMode: "cover",
  },
  recipeInfo: {
    width: '100%',
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 0,
  },
  recipeTagRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  recipeTag: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginRight: 6,
    marginBottom: 2,
    overflow: 'hidden',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
    flexShrink: 1,
    flexWrap: "nowrap",
    textAlign: "left",
    minHeight: 38,
    maxHeight: 40,
  },
  recipeInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 2,
  },
  recipeBookmark: {
    fontSize: 18,
    marginLeft: 'auto',
    color: '#fff',
    backgroundColor: '#222',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  recipeInfoItem: {
    fontSize: 13,
    color: '#333',
    backgroundColor: '#ffe066',
    borderRadius: 6,
    paddingVertical: 2,
  paddingHorizontal: 8,
  marginRight: 6,
  },
});
// ...existing code...
