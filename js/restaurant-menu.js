import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const menuContainer = document.getElementById("menuItems");

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }
  loadMenu(user.uid);
});

async function loadMenu(restaurantId) {
  menuContainer.innerHTML = "Loading menu...";

  const q = query(
    collection(db, "menuItems"),
    where("restaurantId", "==", restaurantId)
  );

  const snapshot = await getDocs(q);
  menuContainer.innerHTML = "";

  if (snapshot.empty) {
    menuContainer.innerHTML = "<p>No menu items yet.</p>";
    return;
  }

  snapshot.forEach((docSnap) => {
    const item = docSnap.data();
    const div = document.createElement("div");
    div.className = "menu-row";

    div.innerHTML = `
      <span>${item.name} – ${item.price} ETB (${item.category})</span>
      <button>${item.available ? "Available" : "Unavailable"}</button>
    `;

    const btn = div.querySelector("button");
    btn.onclick = async () => {
      const ref = doc(db, "menuItems", docSnap.id);
      await updateDoc(ref, { available: !item.available });
      loadMenu(restaurantId);
    };

    menuContainer.appendChild(div);
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
