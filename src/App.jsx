import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL = "https://farmlink-backend-awzz.onrender.com";

const buyerDatabase = [
  // Tomato
  {
    id: 1,
    name: "FreshMart Retail",
    crop: "Tomato",
    requiredQuantity: 300,
    location: "Bengaluru",
    match: 94,
    icon: "🏪",
  },
  {
    id: 2,
    name: "GreenBasket Foods",
    crop: "Tomato",
    requiredQuantity: 500,
    location: "Bengaluru",
    match: 91,
    icon: "🥬",
  },
  {
    id: 3,
    name: "CityFresh Hotels",
    crop: "Tomato",
    requiredQuantity: 200,
    location: "Bengaluru",
    match: 87,
    icon: "🏨",
  },

  // Cabbage
  {
    id: 4,
    name: "FreshHarvest Market",
    crop: "Cabbage",
    requiredQuantity: 300,
    location: "Bengaluru",
    match: 95,
    icon: "🏪",
  },
  {
    id: 5,
    name: "GreenLeaf Foods",
    crop: "Cabbage",
    requiredQuantity: 500,
    location: "Bengaluru",
    match: 91,
    icon: "🥬",
  },
  {
    id: 6,
    name: "UrbanFresh Hotels",
    crop: "Cabbage",
    requiredQuantity: 200,
    location: "Mysuru",
    match: 86,
    icon: "🏨",
  },

  // Carrot
  {
    id: 7,
    name: "DailyFresh Retail",
    crop: "Carrot",
    requiredQuantity: 300,
    location: "Bengaluru",
    match: 94,
    icon: "🏪",
  },
  {
    id: 8,
    name: "HealthyBasket Foods",
    crop: "Carrot",
    requiredQuantity: 400,
    location: "Bengaluru",
    match: 90,
    icon: "🥕",
  },
  {
    id: 9,
    name: "CityHarvest Hotels",
    crop: "Carrot",
    requiredQuantity: 200,
    location: "Bengaluru",
    match: 85,
    icon: "🏨",
  },

  // Green Chilli
  {
    id: 10,
    name: "SpiceFresh Retail",
    crop: "Green Chillies",
    requiredQuantity: 250,
    location: "Bengaluru",
    match: 95,
    icon: "🌶️",
  },
  {
    id: 11,
    name: "FreshBasket Foods",
    crop: "Green Chillies",
    requiredQuantity: 400,
    location: "Bengaluru",
    match: 91,
    icon: "🏪",
  },
  {
    id: 12,
    name: "SouthIndia Hotels",
    crop: "Green Chillies",
    requiredQuantity: 150,
    location: "Bengaluru",
    match: 86,
    icon: "🏨",
  },

  // Potato
  {
    id: 13,
    name: "DailyNeeds Market",
    crop: "Potato",
    requiredQuantity: 500,
    location: "Bengaluru",
    match: 94,
    icon: "🏪",
  },
  {
    id: 14,
    name: "FarmBasket Foods",
    crop: "Potato",
    requiredQuantity: 700,
    location: "Bengaluru",
    match: 90,
    icon: "🥔",
  },

  // Onion
  {
    id: 15,
    name: "FreshChoice Retail",
    crop: "Onion",
    requiredQuantity: 500,
    location: "Bengaluru",
    match: 93,
    icon: "🏪",
  },
  {
    id: 16,
    name: "KitchenSupply Foods",
    crop: "Onion",
    requiredQuantity: 800,
    location: "Bengaluru",
    match: 89,
    icon: "🧅",
  },

  // Brinjal
  {
    id: 17,
    name: "GreenValley Retail",
    crop: "Brinjal",
    requiredQuantity: 250,
    location: "Bengaluru",
    match: 92,
    icon: "🏪",
  },
  {
    id: 18,
    name: "FreshKitchen Hotels",
    crop: "Brinjal",
    requiredQuantity: 300,
    location: "Bengaluru",
    match: 88,
    icon: "🏨",
  },

  // Cauliflower
  {
    id: 19,
    name: "HealthyHarvest Market",
    crop: "Cauliflower",
    requiredQuantity: 300,
    location: "Bengaluru",
    match: 94,
    icon: "🏪",
  },
  {
    id: 20,
    name: "GreenPlate Foods",
    crop: "Cauliflower",
    requiredQuantity: 400,
    location: "Bengaluru",
    match: 90,
    icon: "🥬",
  },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [activeNav, setActiveNav] = useState("Home");
  const [submitted, setSubmitted] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [produceListings, setProduceListings] = useState([]);
  const [myProduce, setMyProduce] = useState([]);
  const [showAllProduce, setShowAllProduce] = useState(false);
  const [showAllPrices, setShowAllPrices] = useState(false);
  const [selectedMandi, setSelectedMandi] = useState(null);
  const [selectedProduce, setSelectedProduce] = useState(null);

  const [myInterests, setMyInterests] = useState([]);
  const [showInterests, setShowInterests] = useState(false);
  const [showInterestSuccess, setShowInterestSuccess] = useState(false);

 const visibleProduce = showAllProduce
  ? produceListings
  : Array.from(
      new Map(
        produceListings.map((item) => [
          item.crop.trim().toLowerCase(),
          item,
        ])
      ).values()
    ).slice(0, 4);

  const [matchingProduce, setMatchingProduce] = useState(null);
  const matchedBuyers = matchingProduce
  ? buyerDatabase
      .filter(
        (buyer) =>
          buyer.crop.toLowerCase() ===
          matchingProduce.crop.trim().toLowerCase()
      )
      .map((buyer) => {
        const farmerQuantity = Number(matchingProduce.quantity) || 0;
        const buyerQuantity = Number(buyer.requiredQuantity) || 0;

       let quantityScore = 0;

if (farmerQuantity === buyerQuantity) {
  quantityScore = 25;
} else {
  const difference = Math.abs(farmerQuantity - buyerQuantity);
  const percentageDifference =
    difference / Math.max(farmerQuantity, buyerQuantity);

  quantityScore = Math.max(
    5,
    Math.round(25 - percentageDifference * 20)
  );
}

        const locationScore =
          buyer.location.toLowerCase() ===
          matchingProduce.location.trim().toLowerCase()
            ? 25
            : 10;

        const cropScore = 50;

        const calculatedMatch =
          cropScore + quantityScore + locationScore;

        return {
          ...buyer,
          match: calculatedMatch,
        };
      })
      .sort((a, b) => b.match - a.match)
  : [];
  const[showBuyers,setShowBuyers] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const  [confirmedBuyer, setConfirmedBuyer] = useState(null);
  const [interestSent,setInterestSent] = useState(false);
  const[showFPO, setShowFPO] = useState(false);
  const[showPricing, setShowPricing] = useState(false);
  const [showLogistics, setShowLogistics] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const [loginForm, setLoginForm] = useState({
  email: "",
  password: "",
});

const [loggedInUser, setLoggedInUser] = useState(null);
const [loginError, setLoginError] = useState("");
const [loginLoading, setLoginLoading] = useState(false);
const [showRegister, setShowRegister] = useState(false);

const [registerForm, setRegisterForm] = useState({
  name: "",
  email: "",
  password: "",
  role: "farmer",
});

const [registerError, setRegisterError] = useState("");
const [registerLoading, setRegisterLoading] = useState(false);

  const[mandiPrices, setMandiPrices] = useState([]);

  const fpoRef = useRef(null);
  const pricingRef = useRef(null);
  const logisticsRef = useRef(null);
  const BuyersRef = useRef(null);

  const [form, setForm] = useState({
    crop: "",
    quantity: "",
    quality: "Grade A",
    location: "",
    harvestDate: "",
    expectedPrice: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginChange = (e) => {
  setLoginForm({
    ...loginForm,
    [e.target.name]: e.target.value,
  });
};

const handleLogin = async (e) => {
  e.preventDefault();

  setLoginError("");
  setLoginLoading(true);

 try {
 const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginForm),
  });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Login failed");
    }

    localStorage.setItem("farmlink_token", data.access_token);
    localStorage.setItem(
      "farmlink_user",
      JSON.stringify(data.user)
    );

    setLoggedInUser(data.user);
    setShowLogin(false);

    setLoginForm({
      email: "",
      password: "",
    });

  } catch (error) {
    console.error("Login error:", error);
    setLoginError(error.message);
  } finally {
    setLoginLoading(false);
  }
};

const handleRegister = async (e) => {
  e.preventDefault();

  setRegisterError("");
  setRegisterLoading(true);

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerForm),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Registration failed");
    }

    alert("Account created successfully. You can now log in.");

    setShowRegister(false);
    setShowLogin(true);

    setRegisterForm({
      name: "",
      email: "",
      password: "",
      role: "farmer",
    });

  } catch (error) {
    console.error("Registration error:", error);
    setRegisterError(error.message);
  } finally {
    setRegisterLoading(false);
  }
};

const handleLogout = () => {
  localStorage.removeItem("farmlink_token");
  localStorage.removeItem("farmlink_user");
  setLoggedInUser(null);
};

  const loadProduceListings = async () => {
  try {
   const response = await fetch(`${API_URL}/produce`);

    if (!response.ok) {
      throw new Error("Failed to load produce");
    }

    const data = await response.json();

    setProduceListings(data);
  } catch (error) {
    console.error("Error loading produce:", error);
  }
};

const loadMyProduce = async () => {
  try {
    const token = localStorage.getItem("farmlink_token");

    if (!token) {
      return;
    }

    const response = await fetch(`${API_URL}/my-produce`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load my produce");
    }

    const data = await response.json();

    setMyProduce(data);
    console.log("My produce:", data);
  } catch (error) {
    console.error("Error loading my produce:", error);
  }
};

const loadMyInterests = async () => {
  try {
    const token = localStorage.getItem("farmlink_token");
    if (!token) return;

    const response = await fetch(`${API_URL}/my-interests`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load requests");
    }

    const data = await response.json();
    setMyInterests(data);
  } catch (error) {
    console.error("Error loading requests:", error);
  }
};

const loadMandiPrices = async () => {
  try {
   const response = await fetch(`${API_URL}/mandi-prices`);
    if (!response.ok) {
      throw new Error("Failed to load mandi prices");
    }

    const data = await response.json();

    setMandiPrices(data);
  } catch (error) {
    console.error("Error loading mandi prices:", error);
  }
};

useEffect(() => {
  loadProduceListings();
  loadMandiPrices();

  const savedUser = localStorage.getItem("farmlink_user");

  if (savedUser) {
    setLoggedInUser(JSON.parse(savedUser));
  }
}, []);

useEffect(() => {
  if (loggedInUser?.role === "farmer") {
    loadMyProduce();
    loadMyInterests();
  }
}, [loggedInUser]);

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Save the farmer's produce
   const response = await fetch(`${API_URL}/produce`, {
      method: "POST",
     headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("farmlink_token")}`,
},
body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error("Failed to save produce");
    }

    const data = await response.json();

    console.log("Produce saved:", data);

    setMatchingProduce({
  crop: form.crop,
  quantity: form.quantity,
  location: form.location,
  quality: form.quality,
});

    // Get AI price prediction from backend
    const predictionResponse = await fetch(
      `${API_URL}/predict-price/${encodeURIComponent(form.crop.trim())}`
    );

    if (!predictionResponse.ok) {
      throw new Error("Failed to get price prediction");
    }

    const predictionData = await predictionResponse.json();

    console.log("Price prediction:", predictionData);

if (!predictionData.lower_price || !predictionData.upper_price) {
 alert(`No market price data found for ${form.crop}.`);
  setPrediction(null);
  setSubmitted(false);
  loadProduceListings();
  return;
}

// Store prediction for displaying on the webpage
setPrediction({
  ...predictionData,
  expectedPrice: Number(form.expectedPrice),
});
setSubmitted(true);
loadProduceListings();

  } catch (error) {
    console.error("Error:", error);
    alert("Could not connect to backend");
  }
};

  return (
    <div className="app">
<nav className="navbar">
  <div className="logo">
    <span className="logo-leaf">🌿</span>
    <span>FarmLink AI</span>
  </div>

  <div className="nav-links">
  <a
    className={activeNav === "Home" ? "active" : ""}
    href="#"
    onClick={() => setActiveNav("Home")}
  >
    Home
  </a>

  <a
    className={activeNav === "Market" ? "active" : ""}
    href="#market"
    onClick={() => setActiveNav("Market")}
  >
    Market
  </a>

  <a
    className={activeNav === "Buyers" ? "active" : ""}
    href="#buyers"
    onClick={() => {
      setActiveNav("Buyers");
      setShowBuyers(true);
    }}
  >
    Buyers
  </a>

  <a
    className={activeNav === "About" ? "active" : ""}
    href="#about"
    onClick={() => setActiveNav("About")}
  >
    About
  </a>
</div>

  <div className="nav-account">
    {loggedInUser ? (
      <>
    <span className="welcome-user">
        {loggedInUser.role === "farmer" ? "🌾" : "🛒"}{" "}
         {loggedInUser.name}
    </span>

    {loggedInUser.role === "farmer" && (
  <button
    className="login-btn"
    onClick={() => setShowInterests(true)}
  >
    🔔 Requests ({myInterests.length})
  </button>
)}

        <button
          className="login-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </>
    ) : (
      <button
        className="login-btn"
        onClick={() => setShowLogin(true)}
      >
        <span className="login-icon">◉</span>
        Login / Register
        <span className="login-arrow">⌄</span>
      </button>
    )}
  </div>
</nav>

<section className="hero">
  <div className="hero-content">
    <p className="tag">AI-POWERED AGRICULTURAL MARKETPLACE</p>

    <h1>
      Empowering Farmers
      <br />
      with <span>Smarter Markets</span>
    </h1>

    <p className="hero-text">
      Know the price. Find the buyer. Move the produce.
    </p>

    <div className="hero-buttons">
     <button
  className="primary-btn"
  onClick={() => {
   if (loggedInUser?.role === "buyer") {
  document
    .getElementById("marketplace")
    ?.scrollIntoView({ behavior: "smooth" });
} else {
      setShowForm(true);
    }
  }}
>
  {loggedInUser?.role === "buyer"
    ? "🔎 Find Produce"
    : "🌾 List Your Produce"}
</button>

      <button
  className="secondary-btn"
  onClick={() => {
    if (loggedInUser?.role === "buyer") {
      setShowForm(true);
    } else {
      setShowBuyers(true);
    }
  }}
>
  {loggedInUser?.role === "buyer"
    ? "🌾 List Your Produce"
    : "🔎 Find Buyers"}
</button>
    </div>
  </div>

<div className="price-card">
  <div className="price-card-top">
    <div className="price-card-heading">
      <div className="ai-icon">🤖</div>

      <div>
        <div className="card-title">
          AI Price Intelligence
        </div>

        <p>
          Real-time market analysis & price prediction
        </p>
      </div>
    </div>
  </div>

  <div className="price-crop">
    {prediction?.crop || "Tomato"}
  </div>

  <div className="price">
    {prediction
      ? `₹${prediction.lower_price} – ₹${prediction.upper_price}`
      : "₹22 – ₹26"}
    <span>/kg</span>
  </div>

  <div className="confidence">
    ✓{" "}
    {prediction
      ? `${prediction.confidence.charAt(0).toUpperCase()}${prediction.confidence.slice(1)} Confidence`
      : "High Confidence"}
  </div>

  <div className="price-meta">
    <span>
      📊 {prediction?.data_points || 12} market data points
    </span>

    <span>
      🏛️ {prediction?.source || "AGMARKNET"}
    </span>
  </div>

  <button
    type="button"
    className="analysis-btn"
    onClick={() => {
  document
    .getElementById("market")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
}}
  >
    View Analysis →
  </button>
</div>

</section>

  {showPricing && (
  <section className="pricing-section" ref={pricingRef}>
    <div className="pricing-card">

      <div className="pricing-header">
        <div>
          <p className="tag">TRANSPARENT TRANSACTION</p>
          <h2>💰 Transparent Pricing</h2>
          <p>
            Every major cost is shown clearly before the order is confirmed.
          </p>
        </div>

        <button
          className="close-btn"
          onClick={() => setShowPricing(false)}
        >
          ✕
        </button>
      </div>

     <div className="order-summary">
  <div>
    <span>Produce</span>
    <strong>{form.crop || matchingProduce?.crop || "—"}</strong>
  </div>

  <div>
    <span>Quantity</span>
    <strong>
      {form.quantity || matchingProduce?.quantity || "—"} kg
    </strong>
  </div>

  <div>
    <span>AI Price Range</span>
    <strong>
      {prediction
        ? `₹${prediction.lower_price}–₹${prediction.upper_price}/kg`
        : "—"}
    </strong>
  </div>
</div>

      <h3 className="breakdown-title">
        Transaction Breakdown
      </h3>

     <div className="price-row">
  <span>🌾 Estimated produce value</span>
  <strong>
    ₹{(
      Number(form.quantity || matchingProduce?.quantity || 0) *
      Number(prediction?.average_price || form.expectedPrice || 0)
    ).toLocaleString("en-IN")}
  </strong>
</div>

<div className="price-row">
  <span>🚚 Logistics</span>
  <strong>₹1,000</strong>
</div>

<div className="price-row">
  <span>🏪 Platform service fee</span>
  <strong>₹300</strong>
</div>

<div className="price-total">
  <span>Total buyer payment</span>
  <strong>
    ₹{(
      Number(form.quantity || matchingProduce?.quantity || 0) *
        Number(prediction?.average_price || form.expectedPrice || 0) +
      1000 +
      300
    ).toLocaleString("en-IN")}
  </strong>
</div>

<div className="farmer-receives">
  <span>👨‍🌾 Farmer receives</span>
  <strong>
    ₹{(
      Number(form.quantity || matchingProduce?.quantity || 0) *
      Number(prediction?.average_price || form.expectedPrice || 0)
    ).toLocaleString("en-IN")}
  </strong>
</div>

      <div className="transparency-note">
        💡 <strong>Transparent pricing:</strong>
        <p>
          The farmer and buyer can see the major transaction components
          before confirming the order.
        </p>
      </div>

 <button
  className="primary-btn order-btn"
  onClick={() => {
    setShowLogistics(true);

    setTimeout(() => {
      logisticsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }}
>
  Confirm Order
  </button>

    </div>
  </section>
)}


  {showLogistics && !orderConfirmed && (
  <section className="demo-section" ref={logisticsRef}>
    <h2>🚚 Smart Logistics Activated</h2>

<p className="demo-note">
  Prototype logistics visualization — route and delivery values are illustrative.
</p>

<div className="route-card">

  <div className="route-header">
    <div>
      <span>📍 PICKUP</span>
     <h3>{matchingProduce?.location || form.location || "Bengaluru FPO"}</h3>
    </div>

    <div className="route-arrow">→</div>

    <div>
      <span>🏪 DESTINATION</span>
      <h3>{confirmedBuyer?.location || "Buyer Location"}</h3>
    </div>
  </div>

  <div className="route-line">
    <div className="route-dot">📦</div>
    <div className="route-progress"></div>
    <div className="route-dot">🏪</div>
  </div>

  <div className="shipment-info">
    <div>
      <span>Produce</span>
      <strong>
  {form.quantity || matchingProduce?.quantity || "—"} kg{" "}
  {form.crop || matchingProduce?.crop || "—"}
</strong>
    </div>

    <div>
      <span>Estimated Delivery</span>
      <strong>1 Day</strong>
    </div>

    <div>
      <span>Status</span>
      <strong>Ready for Pickup</strong>
    </div>
  </div>

  <button
    type="button"
    className="primary-btn"
    onClick={() => setOrderConfirmed(true)}
  >
    Confirm Pickup
  </button>

  </div>
  </section>
)}
   
   {orderConfirmed && (
  <section className="demo-section">
    <div className="order-success-card">

  <div className="success-icon">
    ✓
  </div>

  <h2>Order Confirmed</h2>

  <p className="success-message">
    FarmLink AI transaction completed successfully.
  </p>

  <div className="order-summary">

    <div className="summary-item">
      <span>📦 Produce</span>
     <strong>
  {form.quantity || matchingProduce?.quantity || "—"} kg{" "}
  {form.crop || matchingProduce?.crop || "—"}
</strong>
    </div>

    <div className="summary-item">
      <span>💰 Order Value</span>
      <strong>
  ₹{(
    Number(form.quantity || matchingProduce?.quantity || 0) *
    Number(prediction?.average_price || form.expectedPrice || 0)
  ).toLocaleString("en-IN")}
</strong>
    </div>

    <div className="summary-item">
      <span>🏭 FPO Status</span>
      <strong>Order Aggregated</strong>
    </div>

    <div className="summary-item">
      <span>🚚 Logistics</span>
      <strong>Pickup confirmed</strong>
    </div>


    <div className="summary-item">
  <span>🏪 Buyer</span>
  <strong>{confirmedBuyer?.name || "Buyer"}</strong>
</div>

  </div>

  <div className="completion-message">
    <strong>Transaction Ready for Fulfillment</strong>
    <p>
      Farmer, FPO and buyer workflow has been successfully connected.
    </p>
  </div>

  <button
    type="button"
    className="primary-btn"
    onClick={() => {
      setOrderConfirmed(false);
      setShowLogistics(false);
      setShowPricing(false);
      setShowFPO(false);
      setShowBuyers(false);
    }}
  >
    Back 
  </button>
</div>
  </section>
)}
       
       {showFPO && (
  <section className="fpo-section" ref={fpoRef}>
    <div className="fpo-card">

      <div className="fpo-header">
        <div>
          <p className="tag">FPO SMART AGGREGATION</p>

          <h2>👨‍🌾 Multi-Farmer Aggregation</h2>

          <p>
            Combine produce from multiple farmers to fulfil larger
            buyer requirements.
          </p>
        </div>

        <button
          className="close-btn"
          onClick={() => setShowFPO(false)}
        >
          ✕
        </button>
      </div>

      <div className="demand-box">
        <span>Buyer Requirement</span>
        <strong>500 kg Tomato</strong>
      </div>

      <h3 className="farmer-title">
        Farmers contributing to this order
      </h3>

      <div className="farmer-list">

        <div className="farmer-row">
          <div className="farmer-icon">👨‍🌾</div>

          <div className="farmer-info">
            <h3>Farmer A</h3>
            <p>Grade A • Bengaluru</p>
          </div>

          <strong>200 kg</strong>
        </div>

        <div className="farmer-row">
          <div className="farmer-icon">👩‍🌾</div>

          <div className="farmer-info">
            <h3>Farmer B</h3>
            <p>Grade A • Bengaluru</p>
          </div>

          <strong>150 kg</strong>
        </div>

        <div className="farmer-row">
          <div className="farmer-icon">👨‍🌾</div>

          <div className="farmer-info">
            <h3>Farmer C</h3>
            <p>Grade A • Bengaluru</p>
          </div>

          <strong>150 kg</strong>
        </div>

      </div>

      <div className="aggregation-total">
        <span>Total Aggregated Produce</span>
        <strong>500 kg</strong>
      </div>

      <div className="fpo-success">
        ✓ Buyer requirement successfully fulfilled
      </div>

       <button
        className="primary-btn aggregation-btn"
        onClick={() => {
        setShowPricing(true);

           setTimeout(() => {
            pricingRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }, 100);
        }}
      >
       Confirm FPO Aggregation
     </button>

    </div>
  </section>
)}

{showBuyers && (
 <section
  className="buyers-section"
  id="buyers"
  ref={BuyersRef}
 >
    <div className="buyers-card">
      <div className="buyers-header">
        <div>
          <p className="tag">AI-POWERED MATCHING</p>
          <h2>🤝 Smart Buyer Matching</h2>
          <p>
            Buyers matched based on crop, quantity, location and
            requirements.
          </p>
        </div>

        <button
          className="close-btn"
          onClick={() => setShowBuyers(false)}
        >
          ✕
        </button>
      </div>

     <div className="match-summary">
  <div>
    <span>Produce</span>
    <strong>
      {matchingProduce?.crop || "No produce listed"}
    </strong>
  </div>

  <div>
    <span>Quantity</span>
    <strong>
      {matchingProduce?.quantity
        ? `${matchingProduce.quantity} kg`
        : "—"}
    </strong>
  </div>

  <div>
    <span>Location</span>
    <strong>
      {matchingProduce?.location || "—"}
    </strong>
  </div>
 </div>

      <h3 className="matched-title">Top Matched Buyers</h3>

      <div className="buyer-list">
  {matchedBuyers.length > 0 ? (
    matchedBuyers.map((buyer) => (
      <div className="buyer" key={buyer.id}>

        <div className="buyer-icon">
          {buyer.icon}
        </div>

        <div className="buyer-info">
          <h3>{buyer.name}</h3>

          <p>
            Needs: {buyer.requiredQuantity} kg {buyer.crop}
          </p>

          <p>📍 {buyer.location}</p>
        </div>

        <div className="match-score">
          <strong>{buyer.match}%</strong>
          <span>Match</span>
        </div>

        <button
          className="connect-btn"
          onClick={() => {
            setSelectedBuyer({
              name: buyer.name,
              crop: buyer.crop,
              quantity: `${buyer.requiredQuantity} kg`,
              location: buyer.location,
              match: `${buyer.match}%`,
            });

            setInterestSent(false);
          }}
        >
          Connect
        </button>

      </div>
    ))
  ) : (
    <div className="no-buyers">
      <h3>🔎 No matching buyers found</h3>

      <p>
        We couldn't find buyers for{" "}
        <strong>
          {matchingProduce?.crop || "this produce"}
        </strong>{" "}
        yet.
      </p>

      <p>
        Try another crop or check again as more buyers join
        FarmLink AI.
      </p>
    </div>
  )}
</div>

      <div className="matching-explanation">
        💡 <strong>Why these buyers?</strong>
        <span>
          Matching considers crop type, quantity, location and buyer
          requirements.
        </span>
      </div>
    </div>
  </section>
)}

{selectedProduce && (
  <div className="produce-details-overlay">
    <div className="produce-details-modal">

      <button
        className="produce-details-close"
        onClick={() => setSelectedProduce(null)}
      >
        ✕
      </button>

      <div className="produce-details-icon">
        🌾
      </div>

      <p className="tag">AVAILABLE PRODUCE</p>

      <h2>{selectedProduce.crop}</h2>

      <p className="produce-details-subtitle">
        Fresh produce listed by a FarmLink AI farmer.
      </p>

      <div className="produce-details-grid">

        <div>
          <span>📦 Quantity</span>
          <strong>{selectedProduce.quantity} kg</strong>
        </div>

        <div>
          <span>⭐ Quality</span>
          <strong>{selectedProduce.quality}</strong>
        </div>

        <div>
          <span>📍 Location</span>
          <strong>{selectedProduce.location}</strong>
        </div>

        <div>
          <span>💰 Expected Price</span>
          <strong>₹{selectedProduce.expected_price}/kg</strong>
        </div>

        <div>
          <span>📅 Harvest Date</span>
          <strong>{selectedProduce.harvest_date || "Not provided"}</strong>
        </div>

      </div>

     <button
  className="primary-btn"
  onClick={async () => {
   if (loggedInUser?.role === "buyer") {
  try {
    const response = await fetch(`${API_URL}/interests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("farmlink_token")}`,
      },
      body: JSON.stringify({
        produce_id: selectedProduce.id,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Failed to send interest");
    }

    setSelectedProduce(null);
    setShowInterestSuccess(true);

  } catch (error) {
    console.error("Interest error:", error);
    alert(error.message);
  }
} else {
      setMatchingProduce(selectedProduce);
      setSelectedProduce(null);
      setShowBuyers(true);

      setTimeout(() => {
        BuyersRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }}
>
  {loggedInUser?.role === "buyer"
    ? "🤝 Send Interest"
    : "🔎 Find Matching Buyers"}
</button>

    </div>
  </div>
)}

{showInterests && (
  <div className="produce-details-overlay">
    <div className="produce-details-modal">

      <button
        className="produce-details-close"
        onClick={() => setShowInterests(false)}
      >
        ✕
      </button>

      <div className="produce-details-icon">
        🔔
      </div>

      <p className="tag">FARMER REQUESTS</p>

      <h2>Buyer Interests</h2>

      <p className="produce-details-subtitle">
        Buyers who have shown interest in your produce.
      </p>

      {myInterests.length === 0 ? (
        <p>No buyer requests yet.</p>
      ) : (
        <div className="buyer-list">
          {myInterests.map((interest) => (
            <div className="buyer" key={interest.id}>

              <div className="buyer-icon">
                🛒
              </div>

              <div className="buyer-info">
               <h3>🛒 {interest.buyer_name || `Buyer #${interest.buyer_id}`}</h3>

                <p>
                  🌾 Crop: <strong>{interest.crop}</strong>
                </p>

                <p>
                  📦 Quantity: <strong>{interest.quantity} kg</strong>
                </p>

                <p>
                  📍 Location: <strong>{interest.location}</strong>
                </p>

                <p>
                  🔔 Status: <strong>{interest.status}</strong>
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  </div>
)}

{showInterestSuccess && (
  <div className="success-overlay">
    <div className="success-modal">

      <div className="success-icon">
        ✓
      </div>

      <h2>Interest Sent Successfully!</h2>

      <p>
        Your interest has been sent to the farmer.
      </p>

      <button
        className="primary-btn"
        onClick={() => setShowInterestSuccess(false)}
      >
        OK
      </button>

    </div>
  </div>
)}

{selectedBuyer && (
  <div className="buyer-overlay">
    <div className="buyer-modal">

     <button
  className="buyer-close"
  onClick={() => {
    setSelectedBuyer(null);
    setInterestSent(false);
  }}
>
  ✕
</button>

      <div className="buyer-modal-icon">🏪</div>

      <p className="tag">BUYER CONNECTION</p>

      <h2>Connect with {selectedBuyer.name}</h2>

      <p className="buyer-modal-subtitle">
        Review the buyer requirement before sending your interest.
      </p>

      <div className="buyer-details">

        <div>
          <span>🌾 Produce</span>
          <strong>{selectedBuyer.crop}</strong>
        </div>

        <div>
          <span>📦 Requirement</span>
          <strong>{selectedBuyer.quantity}</strong>
        </div>

        <div>
          <span>📍 Location</span>
          <strong>{selectedBuyer.location}</strong>
        </div>

        <div>
          <span>🤖 AI Match</span>
          <strong>{selectedBuyer.match}</strong>
        </div>
     </div>

     {interestSent && (
  <div className="interest-success">
    ✅ Interest sent to {selectedBuyer.name} successfully!
  </div>
)}  
      
      <div className="buyer-connect-note">
        💡 Your produce matches this buyer based on crop,
        quantity and location.
      </div>

      {!interestSent && (
  <button
  className="primary-btn"
  onClick={() => {
    setInterestSent(true);
    setConfirmedBuyer(selectedBuyer);

    setTimeout(() => {
      setShowPricing(true);

      setTimeout(() => {
        pricingRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }, 700);
  }}
 >
  🤝 Send Interest
</button>
)}
    </div>
  </div>
)}



{showLogin && (
  <div className="login-overlay">
    <div className="login-modal">

      <button
        className="login-close"
        onClick={() => setShowLogin(false)}
        aria-label="Close login"
      >
        ✕
      </button>

      <div className="login-icon">🌱</div>

      <p className="login-welcome">
        WELCOME TO FARMLINK AI
      </p>

      <h2>Login to FarmLink AI</h2>

      <p className="login-subtitle">
        Connect with farmers, buyers and agricultural markets.
      </p>

      <form onSubmit={handleLogin}>

        <div className="login-field">
          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={loginForm.email}
            onChange={handleLoginChange}
            required
          />
        </div>

        <div className="login-field">
          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={loginForm.password}
            onChange={handleLoginChange}
            required
          />
        </div>

        {loginError && (
          <p
            style={{
              color: "#c0392b",
              fontSize: "13px",
              marginBottom: "15px",
            }}
          >
            {loginError}
          </p>
        )}

        <button
          type="submit"
          className="login-submit"
          disabled={loginLoading}
        >
          {loginLoading ? "Logging in..." : "Login"}
        </button>
        <button
  type="button"
  className="register-link-btn"
  onClick={() => {
    setShowLogin(false);
    setShowRegister(true);
    setRegisterError("");
  }}
 >
  New to FarmLink AI? <strong>Create an account</strong>
 </button>

      </form>

    </div>
  </div>
)}

{showRegister && (
  <div className="login-overlay">
    <div className="login-modal">

      <button
        className="login-close"
        onClick={() => setShowRegister(false)}
        aria-label="Close registration"
      >
        ✕
      </button>

      <div className="login-icon">🌱</div>

      <p className="login-welcome">
        JOIN FARMLINK AI
      </p>

      <h2>Create your account</h2>

      <p className="login-subtitle">
        Choose how you want to use FarmLink AI.
      </p>

      <form onSubmit={handleRegister}>

        <div className="login-field">
          <label>Name</label>

          <input
            type="text"
            placeholder="Enter your name"
            value={registerForm.name}
            onChange={(e) =>
              setRegisterForm({
                ...registerForm,
                name: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="login-field">
          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={registerForm.email}
            onChange={(e) =>
              setRegisterForm({
                ...registerForm,
                email: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="login-field">
          <label>Password</label>

          <input
            type="password"
            placeholder="Create a password"
            value={registerForm.password}
            onChange={(e) =>
              setRegisterForm({
                ...registerForm,
                password: e.target.value,
              })
            }
            required
          />
        </div>

        <div className="login-field">
          <label>I am a</label>

          <select
            value={registerForm.role}
            onChange={(e) =>
              setRegisterForm({
                ...registerForm,
                role: e.target.value,
              })
            }
            required
          >
            <option value="farmer">🌾 Farmer</option>
            <option value="buyer">🛒 Buyer</option>
          </select>
        </div>

        {registerError && (
          <p
            style={{
              color: "#c0392b",
              fontSize: "13px",
              marginBottom: "15px",
            }}
          >
            {registerError}
          </p>
        )}

        <button
          type="submit"
          className="login-submit"
          disabled={registerLoading}
        >
          {registerLoading ? "Creating account..." : "Create Account"}
        </button>

      </form>

      <button
        type="button"
        className="register-link-btn"
        onClick={() => {
          setShowRegister(false);
          setShowLogin(true);
          setRegisterError("");
        }}
      >
        Already have an account? <strong>Login</strong>
      </button>

    </div>
  </div>
)}

{showForm && (
        <div className="produce-overlay">
          <div className="produce-modal">
            <button
  className="produce-close"
  onClick={() => {
    setShowForm(false);
    setSubmitted(false);
  }}
>
  ✕
</button>
            <h2>🌾 List Your Produce</h2>

            <p className="form-subtitle">
              Enter your produce details to receive AI-powered price
              intelligence.
            </p>

            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div>
                    <label>Crop Name</label>
                    <input
                      type="text"
                      name="crop"
                      placeholder="e.g. Tomato"
                      value={form.crop}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Quantity (kg)</label>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="e.g. 500"
                      value={form.quantity}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Quality</label>
                    <select
                      name="quality"
                      value={form.quality}
                      onChange={handleChange}
                    >
                      <option>Grade A</option>
                      <option>Grade B</option>
                      <option>Grade C</option>
                    </select>
                  </div>

                  <div>
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      placeholder="e.g. Bengaluru"
                      value={form.location}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Harvest Date</label>
                    <input
                      type="date"
                      name="harvestDate"
                      value={form.harvestDate}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label>Expected Price (₹/kg)</label>
                    <input
                      type="number"
                      name="expectedPrice"
                      placeholder="e.g. 24"
                      value={form.expectedPrice}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <button className="primary-btn submit-btn" type="submit">
                  🤖 Get AI Price Prediction
                </button>
              </form>
            ) : (
              <div className="success-box">
                <div className="success-icon">✓</div>

                <h3>Produce Listed Successfully!</h3>

                <p>
                  <strong>{form.quantity} kg</strong> of{" "}
                  <strong>{form.crop}</strong> has been submitted.
                </p>

                <div className="prediction-box">
                  <p>🤖 AI Estimated Market Range</p>

                 <h2>
  ₹{prediction.lower_price} – ₹{prediction.upper_price}/kg
</h2>

<span>
  {prediction.confidence.charAt(0).toUpperCase() +
    prediction.confidence.slice(1)} Confidence
</span>

                  <p className="explanation">
  💡 Based on real AGMARKNET mandi price data.
  This is a decision-support estimate, not a guaranteed sale price.
</p>

<p className="prediction-source">
  📊 Data points used: {prediction.data_points} | Source: {prediction.source}
</p>
{prediction.expectedPrice > prediction.upper_price && (
  <p className="price-warning">
    ⚠️ Your expected price of ₹{prediction.expectedPrice}/kg
    is above the current market range.
  </p>
)}

{prediction.expectedPrice < prediction.lower_price && (
  <p className="price-warning">
    📉 Your expected price of ₹{prediction.expectedPrice}/kg
    is below the current market range.
  </p>
)}

{prediction.expectedPrice >= prediction.lower_price &&
  prediction.expectedPrice <= prediction.upper_price && (
    <p className="price-good">
      ✅ Your expected price of ₹{prediction.expectedPrice}/kg
      is within the current market range.
    </p>
)}
  </div>

                <button
                  className="secondary-btn"
                  onClick={() => {
                    setSubmitted(false);
                    setShowForm(false);
                  }}
                >
                  Back to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      )}

<section className="mandi-section" id="market">
  <div className="mandi-header">
    <div>
     <div className="mandi-top-row">
  <span className="market-live-badge">
    <span className="live-dot"></span>
    LIVE MARKET DATA
  </span>

  <button
    type="button"
    className="view-all-prices-btn"
    onClick={() => setShowAllPrices(true)}
  >
    View All Prices →
  </button>
</div>

      <h2>📊 Today's Mandi Prices</h2>

      <p>
        Fresh market prices with AI-powered price intelligence.
      </p>
    </div>

   

  <div className="mandi-featured-grid">
    {Array.from(
      new Map(
        mandiPrices.map((item) => [item.commodity, item])
      ).values()
    )
   .filter((item) =>
  ["Tomato", "Cabbage", "Potato", "Onion", "Carrot"].some((crop) =>
    item.commodity.toLowerCase().includes(crop.toLowerCase())
  )
)
.slice(0, 4)
      .map((item, index) => {
      const vegetableImages = {
  Carrot: "🥕",
  Tomato: "🍅",
  Potato: "🥔",
  Onion: "🧅",
  Cabbage: "🥬",
  Brinjal: "🍆",
  Cauliflower: "🥦",
  "Green Chilli": "🌶️",

  Bajra: "🌾",
  "Bajra (Pearl Millet)": "🌾",

  Jowar: "🌾",
  "Jowar (Sorghum)": "🌾",

  Maize: "🌽",
  "Maize (Corn)": "🌽",

  Wheat: "🌾",
  Rice: "🌾",
  Ragi: "🌾",
};
        const grades = ["Grade A", "Grade A", "Grade B", "Grade A"];

        const trends = ["+6.2%", "+4.8%", "-2.1%", "+3.4%"];

        const trendUp = !trends[index].startsWith("-");

        return (
          <div className="mandi-vegetable-card" key={item.id}>
           <div className="vegetable-image">
 {(() => {
  const cropName = item.commodity.toLowerCase();

  if (cropName.includes("maize")) return "🌽";
  if (cropName.includes("bajra")) return "🌾";
  if (cropName.includes("foxtail")) return "🌾";
  if (cropName.includes("jowar")) return "🌾";
  if (cropName.includes("sorghum")) return "🌾";
  if (cropName.includes("millet")) return "🌾";
  if (cropName.includes("carrot")) return "🥕";
  if (cropName.includes("tomato")) return "🍅";
  if (cropName.includes("potato")) return "🥔";
  if (cropName.includes("onion")) return "🧅";
  if (cropName.includes("cabbage")) return "🥬";
  if (cropName.includes("brinjal")) return "🍆";
  if (cropName.includes("cauliflower")) return "🥦";
  if (cropName.includes("chilli")) return "🌶️";

  return "🌱";
})()}
  
</div>
 <div className="vegetable-card-content">
   <div className="vegetable-title-row">
       <div>
  <h3>{item.commodity}</h3>
</div>
</div>

<div className="vegetable-price">
  ₹{item.modal_price}/kg
</div>

<div className="mandi-card-actions">
  <button
    type="button"
    className="mandi-details-btn"
    onClick={() => {
      setSelectedMandi(item);
    }}
  >
    View Details →
  </button>
 <span
    className={
      trendUp
        ? "vegetable-trend trend-up"
        : "vegetable-trend trend-down"
    }
  >
    {trendUp ? "↑" : "↓"} {trends[index]}
  </span>
</div>

            </div>
          </div>
        );
      })}
  </div>
</div>
  {showAllPrices && (
    <div className="all-prices-overlay">

       <button
          type="button"
          className="all-prices-close"
          onClick={() => setShowAllPrices(false)}
        >
          ✕
        </button>

      <div className="all-prices-modal">
       

        <p className="tag">MARKET PRICE LIST</p>

        <h2>All Mandi Prices</h2>

        <p className="all-prices-subtitle">
          Current vegetable prices available through FarmLink AI.
        </p>

        <div className="all-prices-list">
          {Array.from(
            new Map(
              mandiPrices.map((item) => [item.commodity, item])
            ).values()
          ).map((item) => (
            <div
              className="all-price-row"
              key={item.id}
            >
              <div>
                <strong>{item.commodity}</strong>
                <span>📍 {item.market}</span>
              </div>

              <strong>
                ₹{item.modal_price}/kg
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</section>

{loggedInUser?.role === "farmer" && (
  <section className="my-produce-section">
    <div className="section-heading">
      <span className="tag">MY FARM</span>
      <h2>My Produce</h2>
      <p>Produce you have listed on FarmLink AI.</p>
    </div>

    <div className="listings-grid">
      {myProduce.length === 0 ? (
        <p>No produce listed yet.</p>
      ) : (
        myProduce.map((item) => (
          <div className="listing-card" key={item.id}>
            <span className="listing-icon">🌾</span>
            <span className="my-listing-badge">YOUR LISTING</span>

            <h3>{item.crop}</h3>

            <p>
              Quantity: <strong>{item.quantity} kg</strong>
            </p>

            <p>
              Quality: <strong>{item.quality}</strong>
            </p>

            <p>
              Location: <strong>{item.location}</strong>
            </p>

            <p>
              Expected Price: <strong>₹{item.expected_price}/kg</strong>
            </p>
          </div>
        ))
      )}
    </div>
  </section>
)}

<section className="live-listings" id="marketplace">
  <div className="section-heading">
    <span className="tag">LIVE MARKETPLACE</span>
    <h2>Available Produce</h2>
    <p>Produce currently stored in FarmLink AI.</p>
  </div>

  <div className="listings-grid">
    {visibleProduce.map((item) => (
      <div
  className="listing-card"
  key={item.id}
  onClick={() => setSelectedProduce(item)}
 >
       <span className="listing-icon">
  {(() => {
    const crop = item.crop.toLowerCase();

    if (crop.includes("tomato")) return "🍅";
    if (crop.includes("potato")) return "🥔";
    if (crop.includes("onion")) return "🧅";
    if (crop.includes("carrot")) return "🥕";
    if (crop.includes("cabbage")) return "🥬";
    if (crop.includes("brinjal")) return "🍆";
    if (crop.includes("cauliflower")) return "🥦";
    if (crop.includes("chilli")) return "🌶️";
    if (crop.includes("maize") || crop.includes("corn")) return "🌽";

    return "🌱";
  })()}
 </span>

        <h3>{item.crop}</h3>

        <p>Quantity: <strong>{item.quantity} kg</strong></p>
        <p>Quality: <strong>{item.quality}</strong></p>
        <p>Location: <strong>{item.location}</strong></p>
        <p>Expected Price: <strong>₹{item.expected_price}/kg</strong></p>

        <button
  type="button"
  className="view-details-btn"
  onClick={(event) => {
    event.stopPropagation();
    setSelectedProduce(item);
  }}
 >
  View Details →
 </button>

      </div>
    ))}
  </div>
  {produceListings.length > 4 && (
  <div className="view-more-produce">
    <button
      className="secondary-btn"
      onClick={() => setShowAllProduce(!showAllProduce)}
    >
      {showAllProduce ? "Show Less" : "View More Produce"}
    </button>
  </div>
 )}
</section>

<section className="features">
        <div className="feature">
          <div className="feature-icon">🤖</div>
          <h3>AI Prediction</h3>
          <p>Get an estimated market price range for your produce.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">🤝</div>
          <h3>Smart Buyer Matching</h3>
          <p>Connect your produce with suitable buyers.</p>
        </div>

        <div className="feature">
          <div className="feature-icon">👨‍🌾</div>
          <h3>FPO Aggregation</h3>
          <p>Combine produce from multiple farmers to meet demand.</p>

         <button
             className="feature-btn"
                 onClick={() => {
                   setShowFPO(true);
    
                   setTimeout(() => {
                  fpoRef.current?.scrollIntoView({
                  behavior: "smooth",
                 block: "start",
                   });
                }, 100);
               }}
              >
                View Aggregation
         </button>
        </div>

        <div className="feature">
          <div className="feature-icon">🚚</div>
          <h3>Smart Logistics</h3>
          <p>Coordinate transportation and delivery efficiently.</p>
        </div>
 </section>

<section className="market-overview">
  <div className="section-heading">
    <span className="tag">MARKETPLACE OVERVIEW</span>
    <h2>FarmLink AI at a Glance</h2>
    <p>Illustrative prototype metrics for the demo.</p>
  </div>

  <div className="overview-grid">

    <div className="overview-card">
      <span>🌾</span>
      <strong>{produceListings.length}</strong>
      <p>Active Produce Listings</p>
    </div>

    <div className="overview-card">
      <span>👨‍🌾</span>
      <strong>64</strong>
      <p>Farmers Connected</p>
    </div>

    <div className="overview-card">
      <span>🏪</span>
      <strong>18</strong>
      <p>Active Buyers</p>
    </div>

    <div className="overview-card">
      <span>📦</span>
      <strong>4.8T</strong>
      <p>Produce Aggregated</p>
    </div>

  </div>
</section>

<section className="about-section" id="about">
  <div className="about-content">
    <p className="tag">ABOUT FARMLINK AI</p>

    <h2>🌱 Connecting Farmers Directly to Better Markets</h2>

    <p>
      FarmLink AI is an AI-powered agricultural marketplace designed
      to help farmers understand market prices, connect with buyers,
      combine produce through FPOs, and manage the journey from
      farm to buyer.
    </p>

   <div>
  <strong>🤖 Better Decisions</strong>
  <span>Turn market data into useful information farmers can act on.</span>
</div>

<div>
  <strong>🤝 Direct Connections</strong>
  <span>Help farmers reach suitable buyers without unnecessary middle layers.</span>
</div>

<div>
  <strong>👨‍🌾 Stronger Together</strong>
  <span>Combine smaller quantities to help farmers fulfil larger market demand.</span>
</div>

<div>
  <strong>🚚 From Farm to Buyer</strong>
  <span>Connect selling, order coordination and delivery in one workflow.</span>
</div>
  </div>
</section>

      <footer>
        <strong>FarmLink AI</strong> — From farm to buyer, intelligently.
      </footer>
    </div>
  );
}

export default App;