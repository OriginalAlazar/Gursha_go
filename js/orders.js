import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const ordersList = document.getElementById("ordersList");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  console.log("Logged-in UID:", user.uid);

  try {
    // Query orders for current customer
    const ordersQuery = query(
      collection(db, "orders"),
      where("customerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(ordersQuery);

    if (snapshot.empty) {
      ordersList.innerHTML = "<p>No orders yet.</p>";
      return;
    }

    ordersList.innerHTML = "";

    for (const docSnap of snapshot.docs) {
      const order = docSnap.data();

      // Fetch restaurant name from restaurants collection
      let restaurantName = order.restaurantId;
      try {
        const restSnap = await getDoc(doc(db, "restaurants", order.restaurantId));
        if (restSnap.exists()) restaurantName = restSnap.data().name;
      } catch (e) {
        console.warn("Could not fetch restaurant name", e);
      }

      // Render items list
      const itemsHTML = order.items.map(i => `${i.name} × ${i.qty}`).join("<br/>");

      // Render order card
      ordersList.innerHTML += `
        <div class="order-card">
          <p><strong>Restaurant:</strong> ${restaurantName}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> ${order.total} ETB</p>
          <p><strong>Date:</strong> ${order.createdAt ? order.createdAt.toDate().toLocaleString() : "N/A"}</p>
          <p><strong>Items:</strong><br/>${itemsHTML}</p>
        </div>
      `;
    }

  } catch (err) {
    console.error("Error fetching orders:", err);
    ordersList.innerHTML = "<p>Failed to load orders.</p>";
  }
});
