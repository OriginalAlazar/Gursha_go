import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const ordersList = document.getElementById("ordersList");

/* =====================
   AUTH CHECK
===================== */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  loadOrders(user.uid);
});

/* =====================
   LOAD ORDERS
===================== */
async function loadOrders(userId) {
  ordersList.innerHTML = "<p>Loading your orders...</p>";

  try {
    const ordersQuery = query(
      collection(db, "orders"),
      where("customerId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(ordersQuery);

    if (snapshot.empty) {
      showEmptyState();
      return;
    }

    ordersList.innerHTML = "";

    for (const docSnap of snapshot.docs) {
      const order = docSnap.data();
      const restaurantName = await getRestaurantName(order.restaurantId);
      renderOrder(order, restaurantName);
    }

  } catch (error) {
    console.error("Error loading orders:", error);
    ordersList.innerHTML = "<p>Failed to load orders.</p>";
  }
}

/* =====================
   GET RESTAURANT NAME
===================== */
async function getRestaurantName(restaurantId) {
  try {
    const restSnap = await getDoc(doc(db, "restaurants", restaurantId));
    if (restSnap.exists()) return restSnap.data().name;
  } catch (err) {
    console.warn("Restaurant fetch failed:", err);
  }
  return restaurantId; // fallback
}

/* =====================
   RENDER ORDER CARD
===================== */
function renderOrder(order, restaurantName) {
  const orderDate = order.createdAt
    ? order.createdAt.toDate().toLocaleString()
    : "N/A";

  const itemsHTML = order.items
    .map(item => `<li>${item.name} × ${item.qty}</li>`)
    .join("");

  const statusClass = order.status
    ? order.status.toLowerCase()
    : "pending";

  ordersList.innerHTML += `
    <div class="order-card">
      <div class="order-header">
        <div class="restaurant-name">${restaurantName}</div>
        <span class="status ${statusClass}">
          ${order.status || "Pending"}
        </span>
      </div>

      <div class="order-info">
        <p><strong>Total:</strong> ${order.total} ETB</p>
        <p><strong>Date:</strong> ${orderDate}</p>
      </div>

      <ul class="items-list">
        ${itemsHTML}
      </ul>
    </div>
  `;
}

/* =====================
   EMPTY STATE
===================== */
function showEmptyState() {
  ordersList.innerHTML = `
    <div class="empty-state">
      <h3>No orders yet</h3>
      <p>You haven’t placed any orders yet.</p>
      <a href="home.html">Browse Restaurants</a>
    </div>
  `;
}
