
        // Redirect to index.html if not logged in
        if (localStorage.getItem("isLoggedIn") !== "true") {
            window.location.href = "../index.html";
        }

        // Logout function
        function logout() {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "../index.html";
}
function showTranslateTip() {
    var myModal = new bootstrap.Modal(document.getElementById('translateTipModal'));
    myModal.show();
}
