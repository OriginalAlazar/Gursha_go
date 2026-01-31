import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const restaurantNameEl = document.getElementById("restaurantName");
const todayOrdersEl = document.getElementById("todayOrders");
const todayRevenueEl = document.getElementById("todayRevenue");
const recentOrdersEl = document.getElementById("recentOrders");
const onlineToggle = document.getElementById("onlineToggle");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // Load restaurant info
  const restaurantRef = doc(db, "restaurants", user.uid);
  const restaurantSnap = await getDoc(restaurantRef);
  if (restaurantSnap.exists()) {
    const data = restaurantSnap.data();
    restaurantNameEl.textContent = data.name;
    onlineToggle.checked = data.isOnline;
  }

  // Load recent orders (limit 5)
  const ordersQuery = query(
    collection(db, "orders"),
    where("restaurantId", "==", user.uid),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  const orderSnap = await getDocs(ordersQuery);

  let ordersHTML = "<h4>Recent Orders</h4>";
  let totalOrders = 0;
  let totalRevenue = 0;

  orderSnap.forEach((doc) => {
    const o = doc.data();
    totalOrders += 1;
    totalRevenue += o.total || 0;
    ordersHTML += `<div class="order-item">#${doc.id} – ${o.status}</div>`;
  });

  todayOrdersEl.textContent = totalOrders;
  todayRevenueEl.textContent = totalRevenue + " ETB";
  recentOrdersEl.innerHTML = ordersHTML;
});
