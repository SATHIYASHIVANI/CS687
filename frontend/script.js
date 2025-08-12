const allergiesList = ["Peanuts", "Dairy", "Gluten", "Eggs", "Shellfish", "Soy", "Tree Nuts", "Fish", "Sesame", "Wheat"];
let user = {};
let selectedAllergies = [];
let foundRecipe = null;

function renderLogin() {
  document.getElementById("app").innerHTML = `
    <h2>Login</h2>
    <input id="username" placeholder="Enter your name">
    <button onclick="handleLogin()">Next</button>
  `;
}

function handleLogin() {
  user.name = document.getElementById("username").value;
  renderAllergySelection();
}

function renderAllergySelection() {
  document.getElementById("app").innerHTML = `
    <h2>Select Your Allergies</h2>
    <div id="allergy-bubbles">
      ${allergiesList.map(a => `
        <span class="bubble" id="bubble-${a}" onclick="toggleAllergy('${a}')">${a}</span>
      `).join("")}
    </div>
    <button onclick="renderSearch()">Next</button>
  `;
}

function toggleAllergy(allergy) {
  if (selectedAllergies.includes(allergy)) {
    selectedAllergies = selectedAllergies.filter(a => a !== allergy);
  } else {
    selectedAllergies.push(allergy);
  }
  allergiesList.forEach(a => {
    const el = document.getElementById(`bubble-${a}`);
    if (el) el.className = "bubble" + (selectedAllergies.includes(a) ? " selected" : "");
  });
}

function renderSearch() {
  document.getElementById("app").innerHTML = `
    <h2>Search for a Recipe</h2>
    <input id="searchInput" placeholder="Enter recipe name">
    <button onclick="handleSearch()">Search</button>
    <div id="searchResult"></div>
  `;
}

async function handleSearch() {
  const name = document.getElementById("searchInput").value;
  const resDiv = document.getElementById("searchResult");
  resDiv.innerHTML = "Searching...";
  try {
    const response = await fetch("http://127.0.0.1:5000/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });
    if (!response.ok) throw new Error();
    foundRecipe = await response.json();
    resDiv.innerHTML = `
      <h3>${foundRecipe.name}</h3>
      <img src="${foundRecipe.image_url}" width="200"><br>
      <button onclick="renderRecipe()">View Details</button>
    `;
  } catch {
    resDiv.innerHTML = "<span style='color:red'>Recipe not found.</span>";
  }
}

async function renderRecipe() {
  document.getElementById("app").innerHTML = `
    <button onclick="renderSearch()">Back</button>
    <h2>${foundRecipe.name}</h2>
    <img src="${foundRecipe.image_url}" width="250"><br>
    <h4>Nutrition</h4>
    <ul>
      <li>Calories: ${foundRecipe.nutrition.calories}</li>
      <li>Protein: ${foundRecipe.nutrition.protein}</li>
      <li>Fat: ${foundRecipe.nutrition.fat}</li>
      <li>Carbs: ${foundRecipe.nutrition.carbs}</li>
      <li>Benefits: ${foundRecipe.nutrition.benefits}</li>
    </ul>
    <h4>Ingredients</h4>
    <ul>
      ${foundRecipe.ingredients.map(i => `<li>${i}</li>`).join("")}
    </ul>
    <div id="allergyCheck"></div>
  `;
  // Allergy check
  const response = await fetch("http://127.0.0.1:5000/allergy-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: foundRecipe.name, allergies: selectedAllergies })
  });
  const result = await response.json();
  document.getElementById("allergyCheck").innerHTML =
    result.allergy_risk
      ? `<span style="color:red">Warning: You are allergic to ${result.matched_allergies.join(", ")} in this recipe!</span>`
      : `<span style="color:green">This recipe is safe for you!</span>`;
}

// Start the app
renderLogin();