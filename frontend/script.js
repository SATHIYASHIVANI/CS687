async function getRecommendation() {
  const pref = document.getElementById("prefInput").value;

  const response = await fetch("http://127.0.0.1:5000/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ preferences: pref.split(",") })
  });

  const data = await response.json();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<h3>Recommended Recipes:</h3>" + 
    data.map(item => `<p>${item.title}</p>`).join("");
}
