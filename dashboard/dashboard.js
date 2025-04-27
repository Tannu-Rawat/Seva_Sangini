// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import { getFirestore, doc, setDoc, query, collection, where, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import {
    getAuth,
    
    signOut  // <<< added this
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtkeJij_Xi0qeo46IBZxDQXMp2hDtjejY",
    authDomain: "healthcare-9565b.firebaseapp.com",
    projectId: "healthcare-9565b",
    storageBucket: "healthcare-9565b.appspot.com",
    messagingSenderId: "724920843660",
    appId: "1:724920843660:web:a5b8ac3e5f7e29e9222aa9",
    measurementId: "G-J9JNCM3GQN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Correct logout function
function logout() {
    auth.signOut()
        .then(() => {
            window.location.href = "../index.html";  // Redirect to login or home page after logout
        })
        .catch((error) => {
            console.error('Sign out error:', error);
            alert('Error signing out: ' + error.message);
        });
}
document.getElementById('logoutBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    logout();
});
// Bootstrap translate tip function (no change needed)
window.showTranslateTip = function() {
    var myModal = new bootstrap.Modal(document.getElementById('translateTipModal'));
    myModal.show();
};
// Get today's date in YYYY-MM-DD format
document.addEventListener('DOMContentLoaded', function() {
    // Get pendingTasks from localStorage (default to empty array if not set)
    const pendingTasks = JSON.parse(localStorage.getItem('pendingTasks')) || [];
    // Show the count in the h2
    document.getElementById('todays-visits-count').textContent = pendingTasks.length;
});

document.addEventListener('DOMContentLoaded', function() {
    const highRiskCount = localStorage.getItem('highRiskCount') || 0;
    document.getElementById('needs-attention-count').textContent = highRiskCount;
});

 








