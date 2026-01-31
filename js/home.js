import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const restaurantList = document.getElementById("restaurantList");
const searchInput = document.getElementById("searchInput");

let allRestaurants = [];

/* =====================
   LOAD RESTAURANTS
===================== */
async function loadRestaurants() {
  showLoading();

  const q = query(
    collection(db, "restaurants"),
    where("isOnline", "==", true)
  );

  const snapshot = await getDocs(q);
  allRestaurants = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  renderRestaurants(allRestaurants);
}

/* =====================
   RENDER
===================== */
function renderRestaurants(list) {
  restaurantList.innerHTML = "";

  if (list.length === 0) {
    restaurantList.innerHTML =
      `<p class="loading">No restaurants found.</p>`;
    return;
  }

  list.forEach(r => {
    const card = document.createElement("div");
    card.className = "restaurant-card";

    card.innerHTML = `
      <div class="restaurant-img"
        style="background-image:url('${r.image || "images/restaurant-placeholder.jpg"}')">
        <span class="open-badge">Open</span>
      </div>

      <div class="restaurant-info">
        <h4>${r.name}</h4>
        <p>${r.cuisine || "Local Cuisine"}</p>

        <div class="meta">
          <span>⭐ ${r.rating || "4.5"}</span>
          <span>⏱ ${r.deliveryTime || "30–40 min"}</span>
        </div>

        <button onclick="orderNow('${r.id}')">Order Now</button>
      </div>
    `;

    restaurantList.appendChild(card);
  });
}

/* =====================
   SEARCH (LIVE)
===================== */
searchInput.addEventListener("input", e => {
  const term = e.target.value.toLowerCase();

  const filtered = allRestaurants.filter(r =>
    r.name.toLowerCase().includes(term) ||
    (r.cuisine && r.cuisine.toLowerCase().includes(term))
  );

  renderRestaurants(filtered);
});

/* =====================
   HELPERS
===================== */
function showLoading() {
  restaurantList.innerHTML =
    `<p class="loading">Loading restaurants...</p>`;
}

window.orderNow = function (id) {
  localStorage.setItem("restaurantId", id);
  window.location.href = "menu.html";
};

/* =====================
   INIT
===================== */
loadRestaurants();
