import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const restaurantId = localStorage.getItem("restaurantId");
const menuList = document.getElementById("menuList");
const cartCount = document.getElementById("cartCount");
const restaurantName = document.getElementById("restaurantName");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

cartCount.textContent = cart.length;

async function loadRestaurant() {
  const snap = await getDoc(doc(db, "restaurants", restaurantId));
  if (snap.exists()) {
    restaurantName.textContent = snap.data().name;
  }
}

async function loadMenu() {
  menuList.innerHTML = "Loading menu...";

  const q = query(
    collection(db, "menuItems"),
    where("restaurantId", "==", restaurantId),
    where("available", "==", true)
  );

  const snapshot = await getDocs(q);
  menuList.innerHTML = "";

  if (snapshot.empty) {
    menuList.innerHTML = "<p>No menu items available.</p>";
    return;
  }

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();

    const div = document.createElement("div");
    div.className = "menu-item";

    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>Category: ${item.category}</p>
      <p>Price: ${item.price} ETB</p>
      <button>Add to Cart</button>
    `;

    div.querySelector("button").onclick = () => addToCart({
      id: docSnap.id,
      name: item.name,
      price: item.price
    });

    menuList.appendChild(div);
  });
}

function addToCart(item) {
  cart.push({ ...item, qty: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  cartCount.textContent = cart.length;
}

window.goToCart = function () {
  window.location.href = "cart.html";
};

loadRestaurant();
loadMenu();
