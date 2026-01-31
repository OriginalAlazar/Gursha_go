import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// DOM Elements
const totalCustomersEl = document.getElementById("totalCustomers");
const totalRestaurantsEl = document.getElementById("totalRestaurants");
const totalOrdersEl = document.getElementById("totalOrders");
const totalRevenueEl = document.getElementById("totalRevenue");

const usersTable = document.getElementById("usersTable").querySelector("tbody");
const restaurantsTable = document.getElementById("restaurantsTable").querySelector("tbody");
const ordersTable = document.getElementById("ordersTable").querySelector("tbody");

// Auth check
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Verify admin role
  const usersSnap = await getDocs(collection(db, "users"));
  const currentUser = usersSnap.docs.find(d => d.id === user.uid)?.data();
  if (!currentUser || currentUser.role !== "admin") {
    alert("Access denied: Admins only");
    window.location.href = "login.html";
    return;
  }

  // Load all sections
  await loadStats();
  await loadUsers();
  await loadRestaurants();
  await loadOrders();
});

// -------------------------
// Load Dashboard Stats
// -------------------------
async function loadStats() {
  const usersSnap = await getDocs(collection(db, "users"));
  const restaurantsSnap = await getDocs(collection(db, "restaurants"));
  const ordersSnap = await getDocs(collection(db, "orders"));

  totalCustomersEl.textContent = usersSnap.docs.filter(d => d.data().role === "customer").length;
  totalRestaurantsEl.textContent = restaurantsSnap.docs.length;
  totalOrdersEl.textContent = ordersSnap.docs.length;

  const revenue = ordersSnap.docs.reduce((sum, d) => sum + (d.data().total || 0), 0);
  totalRevenueEl.textContent = revenue.toFixed(2);
}

// -------------------------
// Load Users Table
// -------------------------
async function loadUsers() {
  usersTable.innerHTML = "";
  const snap = await getDocs(collection(db, "users"));
  snap.forEach(docSnap => {
    const u = docSnap.data();
    usersTable.innerHTML += `
      <tr>
        <td>${u.name}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
      </tr>
    `;
  });
}

// -------------------------
// Load Restaurants Table
// -------------------------
async function loadRestaurants() {
  restaurantsTable.innerHTML = "";
  const snap = await getDocs(collection(db, "restaurants"));
  snap.forEach(docSnap => {
    const r = docSnap.data();
    restaurantsTable.innerHTML += `
      <tr>
        <td>${r.name}</td>
        <td>${r.cuisine}</td>
        <td>${r.isOnline ? "Online" : "Offline"}</td>
      </tr>
    `;
  });
}

// -------------------------
// Load Orders Table
// -------------------------
async function loadOrders() {
  ordersTable.innerHTML = "";

  // Load all users & restaurants once
  const usersSnap = await getDocs(collection(db, "users"));
  const restaurantsSnap = await getDocs(collection(db, "restaurants"));

  const usersMap = new Map();
  usersSnap.docs.forEach(d => usersMap.set(d.id, d.data().name));

  const restaurantsMap = new Map();
  restaurantsSnap.docs.forEach(d => restaurantsMap.set(d.id, d.data().name));

  // Load orders sorted by createdAt descending
  const ordersSnap = await getDocs(query(collection(db, "orders"), orderBy("createdAt", "desc")));

  if (ordersSnap.empty) {
    ordersTable.innerHTML = "<tr><td colspan='5'>No orders yet.</td></tr>";
    return;
  }

  ordersSnap.forEach(docSnap => {
    const o = docSnap.data();
    const customerName = usersMap.get(o.customerId) || o.customerId;
    const restaurantName = restaurantsMap.get(o.restaurantId) || o.restaurantId;

    ordersTable.innerHTML += `
      <tr>
        <td>${docSnap.id}</td>
        <td>${customerName}</td>
        <td>${restaurantName}</td>
        <td>${o.total || 0} ETB</td>
        <td>${o.status}</td>
      </tr>
    `;
  });
}
