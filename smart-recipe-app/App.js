import React, { useState } from "react";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import AllergyScreen from "./screens/AllergyScreen";
import SearchScreen from "./screens/SearchScreen";
import RecipeScreen from "./screens/RecipeScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SavedScreen from "./screens/SavedScreen";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [screen, setScreen] = useState("allergy");
  const [name, setName] = useState("User");
  const [dob, setDob] = useState("2000-01-01");
  const [photoUri, setPhotoUri] = useState("http://127.0.0.1:5000/static/profile.jpg");
  const [allergies, setAllergies] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleNext = (email, password) => {
  setName(email.split("@")[0] || "User");
  setLoggedIn(true);
  setScreen("allergy");
  };

  const handleCreateAccount = () => {
    alert("Create Account pressed!");
  };

  const goHome = () => setScreen("home");
  const goSearch = () => setScreen("search");
  const goSaved = () => setScreen("saved");
  const goProfile = () => {
    setScreen("profile");
  };
  const goCart = () => setScreen("cart");

  // Add ingredients to cart with local store prices
  // Add ingredients to cart
  const addIngredientsToCart = async (ingredients = []) => {
    // Mock API call to get prices from Walmart/Fred Meyer
    try {
      const res = await fetch("https://mock-store-api.com/prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, location: "Portland, OR" })
      });
      const prices = await res.json(); // { ingredient: price }
      const newItems = ingredients.map(name => ({ name, price: prices[name] || (Math.random() * 3 + 1) }));
      setCartItems(prev => [...prev, ...newItems]);
    } catch (err) {
      // fallback to random prices
      const newItems = ingredients.map(name => ({ name, price: Math.random() * 3 + 1 }));
      setCartItems(prev => [...prev, ...newItems]);
    }
    goCart();
  };

  if (!loggedIn) {
    return (
      <LoginScreen
        onNext={handleNext}
        onCreateAccount={handleCreateAccount}
      />
    );
  }

  switch (screen) {
    case "search":
      return (
        <SearchScreen
          name={name}
          onBack={goHome}
          onSelectRecipe={recipe => {
            setSelectedRecipe(recipe);
            setScreen("recipe");
          }}
          onProfile={goProfile}
          onCart={goCart}
        />
      );
    case "recipe":
      return (
        <RecipeScreen
          recipe={selectedRecipe}
          allergies={allergies}
          onBack={goSearch}
          onAddToCart={addIngredientsToCart}
        />
      );
    case "profile":
      return (
        <ProfileScreen
          name={name}
          dob={dob}
          photoUri={photoUri}
          onBack={goHome}
          onCart={goCart}
          onSearch={goSearch}
          onDiscover={goSearch}
        />
      );
    case "saved":
      return (
        <SavedScreen
          name={name}
          savedRecipes={savedRecipes}
          onBack={goHome}
        />
      );
  // mealplans case removed
    case "cart":
      return (
        <CartScreen
          cartItems={cartItems}
          onBack={goSearch}
        />
      );
    case "allergy":
      return (
        <AllergyScreen
          name={name}
          allergies={allergies}
          setAllergies={setAllergies}
          onNext={goSearch}
          onBack={goHome}
        />
      );
    default:
      return (
        <>
          <Text style={{ color: 'red', fontSize: 20, textAlign: 'center', marginTop: 40 }}>
            Something went wrong. Please restart the app or check your navigation logic.
          </Text>
        </>
      );
  }
}