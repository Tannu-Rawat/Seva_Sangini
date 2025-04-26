import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyAtkeJij_Xi0qeo46IBZxDQXMp2hDtjejY",
  authDomain: "healthcare-9565b.firebaseapp.com",
  projectId: "healthcare-9565b",
  storageBucket: "healthcare-9565b.firebasestorage.com",
  messagingSenderId: "724920843660",
  appId: "1:724920843660:web:a5b8ac3e5f7e29e9222aa9",
  measurementId: "G-J9JNCM3GQN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const nameEl = document.getElementById('profile-name');
const ashaIdEl = document.getElementById('profile-ashaid');
const emailEl = document.getElementById('profile-email');
const phoneEl = document.getElementById('profile-phone');
const districtEl = document.getElementById('profile-district');
const stateEl = document.getElementById('profile-state');
const pincodeEl = document.getElementById('profile-pin');

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // Fetch user data from Firestore where document ID is user.uid
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      nameEl.textContent = data.name || "No Name";
      ashaIdEl.textContent = data.ashaId || "N/A";
      emailEl.textContent = data.email || user.email || "N/A";
      phoneEl.textContent = data.mobile || "N/A";
      districtEl.textContent = data.district || "N/A";
      stateEl.textContent = data.state || "N/A";
      pincodeEl.textContent = data.pincode || "N/A";
      // Optionally, set a profile image based on name
      document.getElementById('profile-pic').src="../images_folder/human.png";
    } else {
      nameEl.textContent = "Profile not found";
      ashaIdEl.textContent = "-";
      emailEl.textContent = "-";
      phoneEl.textContent = "-";
      districtEl.textContent = "-";
      stateEl.textContent = "-";
      pincodeEl.textContent = "-";
    }
  } else {
    // Not logged in, redirect to login page
    window.location.href = "../index.html";
  }
});
