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

function showError(message) {
  const errorDiv = document.getElementById("error");
  if (errorDiv) errorDiv.textContent = message;
}

function clearError() {
  const errorDiv = document.getElementById("error");
  if (errorDiv) errorDiv.textContent = "";
}

// --------- SIGNUP ---------
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
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create Firestore user document
    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role,
      createdAt: serverTimestamp()
    });

    // If restaurant, create restaurant document
    if (role === "restaurant") {
      await setDoc(doc(db, "restaurants", user.uid), {
        name: name + "'s Restaurant",
        ownerId: user.uid,
        cuisine: "Not set",
        isOnline: true,
        createdAt: serverTimestamp()
      });
    }

    // Redirect by role
    redirectByRole(role);

  } catch (error) {
    showError(error.message);
  }
};

// --------- LOGIN ---------
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

    const userSnap = await getDoc(doc(db, "users", user.uid));
    if (!userSnap.exists()) {
      showError("User record not found.");
      return;
    }

    const role = userSnap.data().role;
    redirectByRole(role);

  } catch (error) {
    showError("Invalid email or password.");
  }
};

// --------- GOOGLE LOGIN ---------
window.googleLogin = async function () {
  clearError();
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      // First-time Google login → create Firestore user
      const role = "customer"; // Default role for Google signup
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        role,
        createdAt: serverTimestamp()
      });

      redirectByRole(role);
    } else {
      const role = snap.data().role;
      redirectByRole(role);
    }
  } catch (error) {
    console.error(error);
    showError("Google sign-in failed.");
  }
};

// --------- ROLE REDIRECT ---------
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
