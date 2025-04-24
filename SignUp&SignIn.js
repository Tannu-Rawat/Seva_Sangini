// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    FacebookAuthProvider
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";




// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAtkeJij_Xi0qeo46IBZxDQXMp2hDtjejY",
    authDomain: "healthcare-9565b.firebaseapp.com",
    projectId: "healthcare-9565b",
    storageBucket: "healthcare-9565b.firebasestorage.com",
    messagingSenderId: "724920843660",
    appId: "1:724920843660:web:a5b8ac3e5f7e29e9222aa9",
    measurementId: "G-J9JNCM3GQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const fprovider = new FacebookAuthProvider();

//signup inputs
const signupName = document.getElementById("signupName");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");
const signupAshaId = document.getElementById("signupAshaId");

//signin inputs
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

//signup buttons
const signupButton = document.getElementById("signupButton");
signupButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const name = signupName.value;
    const email = signupEmail.value;
    const password = signupPassword.value;
    const ashaId = signupAshaId.value;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save additional info to Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            ashaId: ashaId,
            uid: user.uid
        });

        alert("Signup successful!");
        console.log("User data saved to Firestore.");

    } catch (error) {
        console.error("Signup error:", error.message);
        alert("Error: " + error.message);
    }
});


//signin buttons
const loginButton = document.getElementById("loginButton");
loginButton.addEventListener("click", async function (event) {
    event.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        alert("Login successful!");
        console.log("User logged in:", user.uid);
        window.location.href = "dashboard/dashboard.html";
    } catch (error) {
        console.error("Login error:", error.message);
        alert("Error: " + error.message);
    }
});

//signin with google
document.addEventListener("DOMContentLoaded", () => {
    // Google login
    const googleBtn = document.querySelector(".google-login");
    if (googleBtn) {
        googleBtn.addEventListener("click", () => {
            console.log("Google button clicked");
            signInWithPopup(auth, provider)
                .then((result) => {
                    const user = result.user;
                    alert(`Welcome, ${user.displayName}! 🎉`);
                    localStorage.setItem("isLoggedIn", "true");
                    window.location.href = "dashboard/dashboard.html";
                })
                .catch((error) => {
                    console.error("Google sign-in error:", error.message);
                    alert("Google sign-in failed 😢");
                });
        });
    }

    // Facebook login
    const facebookBtn = document.querySelector(".facebook-login");
    if (facebookBtn) {
        facebookBtn.addEventListener("click", () => {
            console.log("Facebook button clicked");
            signInWithPopup(auth, fprovider)
                .then((result) => {
                    const user = result.user;
                    alert(`Welcome, ${user.displayName}! 🎉`);
                    localStorage.setItem("isLoggedIn", "true");
                    window.location.href = "dashboard/dashboard.html";
                })
                .catch((error) => {
                    console.error("Facebook sign-in error:", error.message);
                    alert("Facebook sign-in failed 😢");
                });
        });
    }
});

