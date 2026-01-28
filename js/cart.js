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
    return;
  }

  cart.forEach((item, index) => {
    subtotal += item.price * item.qty;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <strong>${item.name}</strong><br/>
      ${item.price} ETB × ${item.qty}
      <br/>
      <button onclick="removeItem(${index})">Remove</button>
    `;
    cartItemsDiv.appendChild(div);
  });

  subtotalEl.textContent = subtotal;
  totalEl.textContent = subtotal + deliveryFee;
}

window.removeItem = function (index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
};

window.goToCheckout = function () {
  window.location.href = "checkout.html";
};

renderCart();
