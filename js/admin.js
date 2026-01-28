import {
  collection,
  getDocs,
  query,
  where,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const totalCustomersEl = document.getElementById("totalCustomers");
const totalRestaurantsEl = document.getElementById("totalRestaurants");
const totalOrdersEl = document.getElementById("totalOrders");
const totalRevenueEl = document.getElementById("totalRevenue");

const usersTable = document.getElementById("usersTable").querySelector("tbody");
const restaurantsTable = document.getElementById("restaurantsTable").querySelector("tbody");
const ordersTable = document.getElementById("ordersTable").querySelector("tbody");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const snap = await getDocs(collection(db, "users"));
  const currentUser = snap.docs.find(d => d.id === user.uid)?.data();
  if (!currentUser || currentUser.role !== "admin") {
    alert("Access denied: Admins only");
    window.location.href = "login.html";
    return;
  }

  loadStats();
  loadUsers();
  loadRestaurants();
  loadOrders();
});

async function loadStats() {
  const usersSnap = await getDocs(collection(db, "users"));
  const restaurantsSnap = await getDocs(collection(db, "restaurants"));
  const ordersSnap = await getDocs(collection(db, "orders"));

  totalCustomersEl.textContent = usersSnap.docs.filter(d => d.data().role === "customer").length;
  totalRestaurantsEl.textContent = restaurantsSnap.docs.length;
  totalOrdersEl.textContent = ordersSnap.docs.length;

  const revenue = ordersSnap.docs.reduce((sum, d) => sum + (d.data().total || 0), 0);
  totalRevenueEl.textContent = revenue;
}

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

async function loadOrders() {
  ordersTable.innerHTML = "";
  const snap = await getDocs(collection(db, "orders"));
  snap.forEach(docSnap => {
    const o = docSnap.data();
    ordersTable.innerHTML += `
      <tr>
        <td>${docSnap.id}</td>
        <td>${o.customerId}</td>
        <td>${o.restaurantId}</td>
        <td>${o.total} ETB</td>
        <td>${o.status}</td>
      </tr>
    `;
  });
}
