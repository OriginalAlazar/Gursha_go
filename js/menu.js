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
const tabs = document.querySelectorAll(".category-tabs .tab");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
let allMenuItems = []; // store all items for filtering

// Initialize cart count
updateCartCount();

/* =====================
   LOAD RESTAURANT
===================== */
async function loadRestaurant() {
  if (!restaurantId) {
    alert("No restaurant selected");
    window.location.href = "home.html";
    return;
  }

  const snap = await getDoc(doc(db, "restaurants", restaurantId));
  if (snap.exists()) {
    restaurantName.textContent = snap.data().name;
  }
}

/* =====================
   LOAD MENU ITEMS
===================== */
async function loadMenu() {
  menuList.innerHTML = "<p>Loading menu...</p>";

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

  allMenuItems = snapshot.docs.map(docSnap => ({
    id: docSnap.id,
    ...docSnap.data()
  }));

  renderMenu(allMenuItems);
}

/* =====================
   RENDER MENU ITEMS
===================== */
function renderMenu(list) {
  menuList.innerHTML = "";

  if (list.length === 0) {
    menuList.innerHTML = "<p>No items in this category.</p>";
    return;
  }

  list.forEach(item => {
    const div = document.createElement("div");
    div.className = "menu-item";

    div.innerHTML = `
      <div class="menu-img" style="background-image:url('${item.image || 'images/food-placeholder.jpeg'}')"></div>
      <h4>${item.name}</h4>
      <div class="category">${item.category}</div>
      <div class="price">${item.price} ETB</div>
      <button>Add to Cart</button>
    `;

    div.querySelector("button").onclick = () => addToCart({
      id: item.id,
      name: item.name,
      price: item.price
    });

    menuList.appendChild(div);
  });
}

/* =====================
   ADD TO CART
===================== */
function addToCart(item) {
  const existing = cart.find(i => i.id === item.id);
  if (existing) existing.qty += 1;
  else cart.push({ ...item, qty: 1 });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

/* =====================
   UPDATE CART COUNT
===================== */
function updateCartCount() {
  const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
  cartCount.textContent = totalQty;
}

/* =====================
   GO TO CART
===================== */
window.goToCart = function () {
  window.location.href = "cart.html";
}

/* =====================
   CATEGORY TABS
===================== */
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    // Highlight active tab
    tabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const category = tab.dataset.category;
    if (category === "All") renderMenu(allMenuItems);
    else renderMenu(allMenuItems.filter(item => item.category === category));
  });
});

/* =====================
   INITIAL LOAD
===================== */
loadRestaurant();
loadMenu();
