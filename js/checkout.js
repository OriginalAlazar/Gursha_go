import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const summaryDiv = document.getElementById("orderSummary");

const cart = JSON.parse(localStorage.getItem("cart")) || [];
const restaurantId = localStorage.getItem("restaurantId");
const deliveryFee = 50;

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  currentUser = user;
  renderSummary();
});

function renderSummary() {
  let subtotal = 0;
  summaryDiv.innerHTML = "<h4>Order Summary</h4>";

  cart.forEach((item) => {
    subtotal += item.price * item.qty;
    summaryDiv.innerHTML += `
      <p>${item.name} × ${item.qty}</p>
    `;
  });

  summaryDiv.innerHTML += `
    <p>Subtotal: ${subtotal} ETB</p>
    <p>Delivery: ${deliveryFee} ETB</p>
    <h3>Total: ${subtotal + deliveryFee} ETB</h3>
  `;
}

window.placeOrder = async function () {
  const address = document.getElementById("address").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!address || !phone) {
    alert("Please enter address and phone number");
    return;
  }

  if (cart.length === 0) {
    alert("Cart is empty");
    return;
  }

  let subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  await addDoc(collection(db, "orders"), {
    customerId: currentUser.uid,
    restaurantId,
    items: cart,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    address,
    phone,
    status: "Pending",
    createdAt: serverTimestamp()
  });

  localStorage.removeItem("cart");
  alert("✅ Order placed successfully!");
  window.location.href = "orders.html";
};
