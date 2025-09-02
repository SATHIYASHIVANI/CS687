async function getRecommendation() {
  const pref = document.getElementById("prefInput").value;

  const response = await fetch("http://10.30.16.92:5000/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences: pref.split(",") })
  });

  const data = await response.json();
  const resultsDiv = document.getElementById("results");
    const searchTerm = document.getElementById("prefInput").value;
  const searchResponse = await fetch("http://10.30.16.92:5000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: searchTerm })
    });
    const searchData = await searchResponse.json();
    if (Array.isArray(searchData) && searchData.length > 0) {
      resultsDiv.innerHTML = `<h3>Recipes Found:</h3>` +
        searchData.map(item => `
          <div style="margin-bottom:20px;">
            <img src="${item.image_url}" alt="${item.name}" style="width:120px;height:90px;object-fit:cover;border-radius:12px;box-shadow:0 2px 8px #ccc;">
            <h4>${item.name}</h4>
            <p><b>Cuisine:</b> ${item.cuisine}</p>
            <p><b>Ingredients:</b> ${item.ingredients.join(", ")}</p>
            <p><b>Nutrition:</b><br>
              Calories: ${item.nutrition?.calories || "-"}<br>
              Protein: ${item.nutrition?.protein || "-"}<br>
              Fat: ${item.nutrition?.fat || "-"}<br>
              Carbs: ${item.nutrition?.carbs || "-"}<br>
              Benefits: ${item.nutrition?.benefits || "-"}
            </p>
          </div>
        `).join("");
    } else if (searchData.ai_recipe) {
      resultsDiv.innerHTML = `<h3>AI Generated Recipe:</h3><pre>${searchData.ai_recipe}</pre>`;
    } else {
      resultsDiv.innerHTML = `<h3>No recipes found.</h3>`;
    }
}

// Food image filenames from backend static folder
const foodImages = [
  "Avocado Toast.jpg",
  "Beef Bulgogi.jpg",
  "Butter Chicken.jpg",
  "Caesar Salad.jpg",
  "Chicken Tikka Masala.jpg",
  "Falafel Wrap.jpg",
  "Fish and chips.jpg",
  "Greek Salad.jpg",
  "Japanese Miso Soup.jpg",
  "Pad Thai with a Peanut Sauce.jpg",
  "Pancakes.jpg",
  "Pho Recipe.jpg",
  "Shakshuka.jpg",
  "Spaghetti Carbonara.jpg",
  "Spiral Ratatouille.jpg",
  "Tacos Al Pastor.jpg",
  "Vegetable Biryani.jpg",
  "Vegetable Stir Fry.jpg"
];

const galleryDiv = document.getElementById("gallery");
foodImages.forEach(img => {
  const imgElem = document.createElement("img");
  imgElem.src = `http://10.30.16.92:5000/static/${encodeURIComponent(img)}`;
  imgElem.alt = img.replace(/\.jpg$/, "");
  imgElem.style.width = "120px";
  imgElem.style.height = "90px";
  imgElem.style.objectFit = "cover";
  imgElem.style.borderRadius = "12px";
  imgElem.style.boxShadow = "0 2px 8px #ccc";
  galleryDiv.appendChild(imgElem);
});
