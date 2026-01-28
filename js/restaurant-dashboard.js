import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const nameEl = document.querySelector("h2");
const ordersEl = document.querySelector(".orders-list");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Load restaurant info
  const restaurantRef = doc(db, "restaurants", user.uid);
  const restaurantSnap = await getDoc(restaurantRef);

  if (restaurantSnap.exists()) {
    nameEl.textContent = "🍽 " + restaurantSnap.data().name;
  }

  // Load today's orders (basic)
  const q = query(
    collection(db, "orders"),
    where("restaurantId", "==", user.uid)
  );

  const orderSnap = await getDocs(q);
  ordersEl.innerHTML = "<h4>Recent Orders</h4>";

  orderSnap.forEach((doc) => {
    const o = doc.data();
    ordersEl.innerHTML += `
      <div class="order-item">
        #${doc.id} – ${o.status}
      </div>
    `;
  });
});
