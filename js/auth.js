import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// -------------------------
// Error helpers
// -------------------------
function showError(message) {
  const errorDiv = document.getElementById("error");
  if (errorDiv) errorDiv.textContent = message;
}

function clearError() {
  const errorDiv = document.getElementById("error");
  if (errorDiv) errorDiv.textContent = "";
}

// -------------------------
// Role redirect function
// -------------------------
function redirectByRole(role) {
  switch (role) {
    case "customer":
      window.location.href = "home.html";
      break;
    case "restaurant":
      window.location.href = "restaurant-dashboard.html";
      break;
    case "admin":
      window.location.href = "admin.html";
      break;
    default:
      alert("Unknown role");
  }
}

// -------------------------
// SIGN UP (email/password)
// -------------------------
window.signup = async function () {
  clearError();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const roleInput = document.querySelector('input[name="role"]:checked');

  if (!name || !email || !password || !confirmPassword) {
    showError("All fields are required.");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters.");
    return;
  }

  if (password !== confirmPassword) {
    showError("Passwords do not match.");
    return;
  }

  if (!roleInput) {
    showError("Please select a role.");
    return;
  }

  const role = roleInput.value;

  try {
    // 1️⃣ Create Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2️⃣ Create Firestore user
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      createdAt: serverTimestamp()
    });

    // 3️⃣ Create restaurant document if role=restaurant
    if (role === "restaurant") {
      await setDoc(doc(db, "restaurants", user.uid), {
        name: name + "'s Restaurant",
        ownerId: user.uid,
        cuisine: "Not set",
        isOnline: true,
        createdAt: serverTimestamp()
      });
    }

    // 4️⃣ Redirect
    redirectByRole(role);

  } catch (error) {
    showError(error.message);
  }
};

// -------------------------
// LOGIN (email/password)
// -------------------------
window.login = async function () {
  clearError();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    showError("Email and password are required.");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    let userSnap = await getDoc(doc(db, "users", user.uid));

    // 1️⃣ Auto-create admin if missing
    if (!userSnap.exists() && user.email === "admin@gmail.com") {
      await setDoc(doc(db, "users", user.uid), {
        name: "Admin",
        email: user.email,
        role: "admin",
        createdAt: serverTimestamp()
      });
      redirectByRole("admin");
      return;
    }

    if (!userSnap.exists()) {
      showError("User record not found.");
      return;
    }

    redirectByRole(userSnap.data().role);

  } catch (error) {
    showError("Invalid email or password.");
  }
};

// -------------------------
// GOOGLE LOGIN
// -------------------------
window.googleLogin = async function () {
  clearError();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    let snap = await getDoc(userRef);

    // 1️⃣ If user doesn't exist, auto-create
    if (!snap.exists()) {
      // Default role: customer (or admin if email matches)
      let role = "customer";
      if (user.email === "admin@gmail.com") role = "admin";

      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        role,
        createdAt: serverTimestamp()
      });

      // If Google login is restaurant (optional), you can add logic here
      redirectByRole(role);
      return;
    }

    // 2️⃣ Redirect existing users by role
    redirectByRole(snap.data().role);

  } catch (error) {
    console.error(error);
    showError("Google sign-in failed.");
  }
};
