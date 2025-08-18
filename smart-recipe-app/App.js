import React, { useState } from "react";
import LoginScreen from "./screens/LoginScreen";
import AllergyScreen from "./screens/AllergyScreen";
import SearchScreen from "./screens/SearchScreen";
import RecipeScreen from "./screens/RecipeScreen";

export default function App() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  if (step === 1)
    return <LoginScreen name={name} setName={setName} onNext={() => setStep(2)} />;
  if (step === 2)
    return <AllergyScreen allergies={allergies} setAllergies={setAllergies} onNext={() => setStep(3)} />;
  if (step === 3)
    return <SearchScreen onSelectRecipe={recipe => { setSelectedRecipe(recipe); setStep(4); }} />;
  if (step === 4)
    return <RecipeScreen recipe={selectedRecipe} allergies={allergies} onBack={() => setStep(3)} />;
  return null;
}