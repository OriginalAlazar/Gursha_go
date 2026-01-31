import { collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const summaryDiv = document.getElementById("orderSummary");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
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
  if (cart.length === 0) {
    summaryDiv.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let subtotal = 0;
  summaryDiv.innerHTML = "<h4>Order Summary</h4>";

  cart.forEach(item => {
    subtotal += item.price * item.qty;
    summaryDiv.innerHTML += `
      <p>${item.name} × ${item.qty} = ${item.price * item.qty} ETB</p>
    `;
  });

  summaryDiv.innerHTML += `
    <hr/>
    <p>Subtotal: ${subtotal} ETB</p>
    <p>Delivery Fee: ${deliveryFee} ETB</p>
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
    alert("Your cart is empty");
    return;
  }

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

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
