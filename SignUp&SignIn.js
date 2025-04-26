import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase config
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
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// SIGN UP
document.getElementById("signupForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;
    const ashaId = document.getElementById("signupAshaId").value;
    const mobile = document.getElementById("signupMobile").value;
    const district = document.getElementById("signupDistrict").value;
    const state = document.getElementById("signupState").value;
    const pincode = document.getElementById("signupPincode").value;

    // Check for ashaId uniqueness
    const q = query(collection(db, "users"), where("ashaId", "==", ashaId));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        alert("Error: ashaId already exists. Please use a unique ashaId.");
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            name,
            email,
            ashaId,
            uid: user.uid,
            mobile,
            district,
            state,
            pincode,
        });

        localStorage.setItem("ashaId", ashaId);
        window.location.href = "dashboard/dashboard.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// SIGN IN
document.getElementById("loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        // Fetch ashaId from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
            localStorage.setItem("ashaId", userDoc.data().ashaId);
        }
        window.location.href = "dashboard/dashboard.html";
    } catch (error) {
        alert("Error: " + error.message);
    }
});

// GOOGLE SIGN IN
document.querySelector(".google-login").addEventListener("click", async (event) => {
    event.preventDefault();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // Check if user exists in Firestore
        const userDocRef = doc(db, "users", user.uid);
        let userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
            // Create a new user doc with a generated ashaId
            const ashaId = "G-" + user.uid.substring(0, 8);
            await setDoc(userDocRef, {
                name: user.displayName,
                email: user.email,
                ashaId,
                uid: user.uid,
            });
            localStorage.setItem("ashaId", ashaId);
        } else {
            localStorage.setItem("ashaId", userDoc.data().ashaId);
        }
        window.location.href = "dashboard/dashboard.html";
    } catch (error) {
        alert("Google sign-in failed: " + error.message);
    }
});

// PANEL TOGGLE (optional, for overlay animation)
document.getElementById('signUp').addEventListener('click', () => {
    document.getElementById('container').classList.add("right-panel-active");
});
document.getElementById('signIn').addEventListener('click', () => {
    document.getElementById('container').classList.remove("right-panel-active");
});
document.getElementById('signUp_mobile').addEventListener('click', () => {
    document.getElementById('container').classList.add("right-panel-active");
});
document.getElementById('signIn_mobile').addEventListener('click', () => {
    document.getElementById('container').classList.remove("right-panel-active");
});



