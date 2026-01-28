// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 🔥 Your Firebase config (replace with your real keys)
const firebaseConfig = {
  apiKey: "AIzaSyDB9AcYVsTtuWY6L5ie_vQouqum8i3x84I",
  authDomain: "food-delivery-e8633.firebaseapp.com",
  projectId: "food-delivery-e8633",
  storageBucket: "food-delivery-e8633.firebasestorage.app",
  messagingSenderId: "995477509859",
  appId: "1:995477509859:web:1931f85f068ace842597d6",
  measurementId: "G-FJVG77VNVZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
window.auth = auth;
window.db = db;
