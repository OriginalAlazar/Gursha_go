const cartItemsDiv = document.getElementById("cartItems");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
const deliveryFee = 50;

function renderCart() {
  cartItemsDiv.innerHTML = "";
  let subtotal = 0;

  if (cart.length === 0) {
    cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    subtotalEl.textContent = 0;
    totalEl.textContent = deliveryFee;
    return;
  }

  cart.forEach((item, index) => {
    subtotal += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <strong>${item.name}</strong><br/>
        ${item.price} ETB
      </div>
      <div class="qty-controls">
        <button onclick="changeQty(${index}, -1)">-</button>
        <span>${item.qty}</span>
        <button onclick="changeQty(${index}, 1)">+</button>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    cartItemsDiv.appendChild(div);
  });

  subtotalEl.textContent = subtotal;
  totalEl.textContent = subtotal + deliveryFee;
}

window.changeQty = function(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty < 1) cart[index].qty = 1;
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

window.removeItem = function(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

window.goToCheckout = function() {
  if (cart.length === 0) return alert("Your cart is empty.");
  window.location.href = "checkout.html";
};

renderCart();
