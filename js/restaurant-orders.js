import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const ordersList = document.getElementById("ordersList");
let restaurantId = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  restaurantId = user.uid;
  loadOrders("Pending");
});

window.loadOrders = async function (status, btn) {
  // Highlight active tab
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  ordersList.innerHTML = "Loading...";

  const q = query(
    collection(db, "orders"),
    where("restaurantId", "==", restaurantId),
    where("status", "==", status)
  );

  const snapshot = await getDocs(q);
  ordersList.innerHTML = "";

  if (snapshot.empty) {
    ordersList.innerHTML = "<p>No orders.</p>";
    return;
  }

  snapshot.forEach((docSnap) => {
    const order = docSnap.data();
    const orderId = docSnap.id;

    let nextBtn = "";
    if (status === "Pending") nextBtn = "Accept";
    if (status === "Preparing") nextBtn = "Complete";

    const div = document.createElement("div");
    div.className = "order-card";

    div.innerHTML = `
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Items:</strong></p>
      ${order.items.map(i => `${i.name} × ${i.qty}`).join("<br/>")}
      <p><strong>Total:</strong> ${order.total} ETB</p>
      ${nextBtn ? `<button onclick="updateStatus('${orderId}', '${status}')">${nextBtn}</button>` : ""}
    `;

    ordersList.appendChild(div);
  });
};

window.updateStatus = async function (orderId, currentStatus) {
  let newStatus = "Preparing";
  if (currentStatus === "Preparing") newStatus = "Delivered";

  await updateDoc(doc(db, "orders", orderId), { status: newStatus });

  loadOrders(currentStatus);
};
