import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const restaurantList = document.getElementById("restaurantList");

async function loadRestaurants() {
  restaurantList.innerHTML = "Loading...";

  try {
    const q = query(
      collection(db, "restaurants"),
      where("isOnline", "==", true)
    );

    const snapshot = await getDocs(q);
    restaurantList.innerHTML = "";

    if (snapshot.empty) {
      restaurantList.innerHTML = "<p>No restaurants available.</p>";
      return;
    }

    snapshot.forEach((doc) => {
      const r = doc.data();

      const card = document.createElement("div");
      card.className = "restaurant-card";
      card.innerHTML = `
        <h4>${r.name}</h4>
        <p>${r.cuisine}</p>
        <button onclick="orderNow('${doc.id}')">Order Now</button>
      `;

      restaurantList.appendChild(card);
    });
  } catch (err) {
    restaurantList.innerHTML = "Failed to load restaurants.";
    console.error(err);
  }
}

window.orderNow = function (id) {
  localStorage.setItem("restaurantId", id);
  window.location.href = "menu.html";
};

loadRestaurants();
