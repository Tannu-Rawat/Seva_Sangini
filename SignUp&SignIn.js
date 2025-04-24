// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtkeJij_Xi0qeo46IBZxDQXMp2hDtjejY",
  authDomain: "healthcare-9565b.firebaseapp.com",
  projectId: "healthcare-9565b",
  storageBucket: "healthcare-9565b.firebasestorage.app",
  messagingSenderId: "724920843660",
  appId: "1:724920843660:web:a5b8ac3e5f7e29e9222aa9",
  measurementId: "G-J9JNCM3GQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app);

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
signupButton.addEventListener("click", async function(event){
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
loginButton.addEventListener("click", async function(event){
    event.preventDefault();

    const email = loginEmail.value;
    const password = loginPassword.value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        alert("Login successful!");
        console.log("User logged in:", user.uid);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Login error:", error.message);
        alert("Error: " + error.message);
    }
});

