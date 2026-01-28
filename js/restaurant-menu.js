import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const menuContainer = document.getElementById("menuItems");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  loadMenu(user.uid);
});

async function loadMenu(restaurantId) {
  menuContainer.innerHTML = "Loading...";

  const q = query(
    collection(db, "menuItems"),
    where("restaurantId", "==", restaurantId)
  );

  const snapshot = await getDocs(q);
  menuContainer.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();
    menuContainer.innerHTML += `
      <div class="menu-row">
        ${item.name} – ${item.price} ETB (${item.category})
      </div>
    `;
  });
}

window.addItem = async function () {
  const name = itemName.value.trim();
  const price = Number(itemPrice.value);
  const category = itemCategory.value;

  if (!name || !price) return alert("Fill all fields");

  const user = auth.currentUser;

  await addDoc(collection(db, "menuItems"), {
    restaurantId: user.uid,
    name,
    price,
    category,
    available: true,
    createdAt: serverTimestamp()
  });

  itemName.value = "";
  itemPrice.value = "";

  loadMenu(user.uid);
};
