import { useState, useEffect } from "react";
import axios from 'axios';

export default function RenalRadar() {
  const [foodInput, setFoodInput] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]); // for dropdown suggestions
  const [allFoods, setAllFoods] = useState([]); // store full food list from backend

  // Load all food names from backend once when component mounts
  useEffect(() => {
  const fetchFoods = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/food/");

      console.log("RAW RESPONSE:", response.data);

      const foodsArray = Array.isArray(response.data)
        ? response.data
        : response.data.results || [];

      const uniqueMap = {};

foodsArray.forEach(food => {
  const clean = food.name
    .split("_")[0]
    .toLowerCase()
    .trim();

  uniqueMap[clean] = true;
});

const names = Object.keys(uniqueMap);

      console.log("NAMES:", names);

      setAllFoods(names);
    } catch (err) {
      console.log("Failed to load food list for suggestions:", err);
    }
  };

  fetchFoods();
}, []);
  // Update suggestions whenever user types
  useEffect(() => {
  if (foodInput.length > 0) {
    const filtered = allFoods.filter(name =>
      name.includes(foodInput.toLowerCase().trim())
    );

    console.log("INPUT:", foodInput);
    console.log("FILTERED:", filtered);

    setSuggestions(filtered.slice(0, 10));
  } else {
    setSuggestions([]);
  }
}, [foodInput, allFoods]);

  // When user clicks a suggestion
  const handleSuggestionClick = (suggestion) => {
    setFoodInput(suggestion); // fill input with selected name
    setSuggestions([]); // hide dropdown
    // Optional: auto trigger analyze (uncomment if you want)
    // handleAnalyze({ preventDefault: () => {} });
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);

    const food = foodInput.toLowerCase().trim();
    if (!food) {
      setError("Please enter a food name");
      return;
    }

    try {
      const response = await axios.get(
  `http://127.0.0.1:8000/api/food/${encodeURIComponent(food)}/`
);
      const data = response.data;

      let advice = "";
      if (data.potassium_mg > 300) advice += "⚠️ High potassium – consider limiting or leaching (double-boil method).\n";
      if (data.phosphorus_mg > 100) advice += "⚠️ High phosphorus – watch portions, avoid phosphate additives.\n";
      if (data.sodium_mg > 100)    advice += "⚠️ Higher sodium – choose low-sodium alternatives when possible.\n";
      if (advice === "") advice = "✅ Generally kidney-friendly in appropriate portions!";

      setResult({
  name: foodInput,
  sodium: data.sodium_mg,
  potassium: data.potassium_mg,
  phosphorus: data.phosphorus_mg,
  protein: data.protein_g,
  category: data.category,
  advice,
  risk: data.ml_risk_level,
  riskColor: data.ml_risk_color
});
    } catch (err) {
      console.log("Error:", err);

      if (err.response?.status === 404) {
        setError(
          `"${foodInput}" not found in database. Add it in Django admin or try: banana, apple, roti...`
        );
      } else {
        setError("Error connecting to backend. Make sure Django server is running.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ zIndex: -2 }}
      >
        <source src="/food.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/70"
        style={{ zIndex: -1 }}
      />

      <div className="relative z-10 w-full max-w-5xl px-6 py-12 md:py-20">
        <h1 className="text-4xl md:text-8xl font-bold text-center mb-8 text-yellow-300 drop-shadow-lg">
          RenalRadar
        </h1>

        <p className="text-center text-lg md:text-xl mb-10 text-gray-200 drop-shadow-md max-w-3xl mx-auto">
          Scan foods for kidney-friendly nutrition – sodium, potassium, phosphorus & protein check
        </p>

        {/* Form with Autocomplete */}
        <form
          onSubmit={handleAnalyze}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-10 md:mb-12 max-w-2xl mx-auto relative"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={foodInput}
              onChange={(e) => setFoodInput(e.target.value)}
              placeholder="Type a food (e.g., banana, roti, dal...)"
              className="w-full px-6 py-4 rounded-full bg-white/15 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/40 backdrop-blur-md shadow-lg text-base md:text-lg"
            />

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
  <ul className="absolute w-full bg-black/80 border border-white/30 rounded-b-xl max-h-60 overflow-y-auto z-20 backdrop-blur-md shadow-2xl mt-1">
    {suggestions.map((sug, index) => (
      <li
        key={index}
        onClick={() => handleSuggestionClick(sug)}
        className="px-6 py-3 text-white hover:bg-white/20 cursor-pointer transition-colors capitalize"
      >
        {sug.split("_")[0]}
      </li>
    ))}
  </ul>
)}
<p className="text-white text-center mt-4">
  
</p>

<p className="text-yellow-300 text-center">
  
</p>
          </div>

          <button
            type="submit"
            className="px-10 py-4 rounded-full bg-gradient-to-r from-yellow-400 to-red-500 text-white font-bold shadow-xl hover:scale-105 active:scale-100 transition-all duration-200 text-base md:text-lg"
          >
            Analyze
          </button>
        </form>

        {/* === Popular Foods Section – 30 daily Indian foods with emojis === */}
        <div className="mt-10 md:mt-14 text-center">
          <h3 className="text-xl md:text-2xl font-semibold text-yellow-300 mb-6 drop-shadow-md">
            Quick Picks – Daily Use Foods
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 md:gap-5 max-w-6xl mx-auto">
            {[
              { name: "banana", display: "🍌 Banana" },
              { name: "apple", display: "🍎 Apple" },
              { name: "potato", display: "🥔 Potato" },
              { name: "spinach", display: "🥬 Spinach" },
              { name: "cucumber", display: "🥒 Cucumber" },
              { name: "carrot", display: "🥕 Carrot" },
              { name: "white rice", display: "🍚 White Rice" },
              { name: "cabbage", display: "🥬 Cabbage" },
              { name: "cauliflower", display: "🥦 Cauliflower" },
              { name: "tomato", display: "🍅 Tomato" },
              { name: "onion", display: "🧅 Onion" },
              { name: "dal", display: "🫘 Dal" },
              { name: "roti", display: "🫓 Roti" },
              { name: "paneer", display: "🧀 Paneer" },
              { name: "egg", display: "🥚 Egg" },
              { name: "fish", display: "🐟 Fish" },
              { name: "chicken", display: "🍗 Chicken" },
              { name: "mango", display: "🥭 Mango" },
              { name: "papaya", display: "🍈 Papaya" },
              { name: "berries", display: "🍓 Berries" },
              { name: "milk", display: "🥛 Milk" },
              { name: "curd", display: "🥛 Curd" },
              { name: "ghee", display: "🧈 Ghee" },
              { name: "oil", display: "🛢️ Oil" },
              { name: "salt", display: "🧂 Salt" },
              { name: "sugar", display: "🍬 Sugar" },
              { name: "tea", display: "🍵 Tea" },
              { name: "coffee", display: "☕ Coffee" },
              { name: "bread", display: "🍞 Bread" },
              { name: "butter", display: "🧈 Butter" },
            ].map((food) => (
              <button
                key={food.name}
                onClick={() => setFoodInput(food.name)}
                className="p-4 md:p-5 rounded-2xl bg-white/10 border border-white/30 backdrop-blur-md hover:bg-white/20 hover:scale-105 transition-all shadow-lg text-white font-medium text-base md:text-lg flex items-center justify-center gap-2"
              >
                <span className="text-xl md:text-2xl">{food.display.split(' ')[0]}</span>
                <span>{food.display.split(' ').slice(1).join(' ')}</span>
              </button>
            ))}
          </div>

          <p className="mt-8 text-sm md:text-base text-gray-300">
            Click any button to analyze instantly, or type any food name!
          </p>
        </div>

        {error && (
          <p className="text-center text-red-400 font-medium mb-8 drop-shadow-md mt-10">{error}</p>
        )}

        {result && (
          <div className="bg-black/45 backdrop-blur-xl border border-white/15 rounded-3xl p-8 md:p-10 shadow-2xl max-w-3xl mx-auto mt-10">
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center capitalize text-white drop-shadow">
              
            </h2>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center capitalize text-white drop-shadow">
  {result.name}
</h2>

<p className={`text-xl font-bold text-center mt-2 ${
  result.riskColor === "green"
    ? "text-green-400"
    : result.riskColor === "orange"
    ? "text-yellow-400"
    : "text-red-400"
}`}>
  {result.risk}
</p>


            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 mb-8 text-center">
              <div>
                <p className="text-sm md:text-base text-gray-300">Sodium</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{result.sodium} mg</p>
              </div>
              <div>
                <p className="text-sm md:text-base text-gray-300">Potassium</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{result.potassium} mg</p>
              </div>
              <div>
                <p className="text-sm md:text-base text-gray-300">Phosphorus</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{result.phosphorus} mg</p>
              </div>
              <div>
                <p className="text-sm md:text-base text-gray-300">Protein</p>
                <p className="text-2xl md:text-3xl font-bold text-white">{result.protein} g</p>
              </div>
            </div>

            <p className="text-lg md:text-xl font-medium text-center mb-6 text-yellow-200">
              {result.category}
            </p>

            <p className="text-base md:text-lg whitespace-pre-line text-center leading-relaxed text-gray-100">
              {result.advice}
            </p>
          </div>
        )}

        <div className="mt-12 md:mt-16 text-center text-sm text-gray-400">
          <p>Values are from backend database (per 100g). Always consult your renal dietitian.</p>
          <p className="mt-2">Add more foods via Django admin panel.</p>
        </div>
      </div>
    </div>
  );
}