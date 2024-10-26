firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById("userEmail").innerText = user.email;
    } else {
        // Redirect to login if not authenticated
        location.replace("register.html");
    }
});

function goToProfile() {
    location.replace("profile.html"); // Navigate to the profile page
}

function logout() {
    firebase.auth().signOut().then(() => {
        location.replace("register.html"); // Redirect to login page
    });
}
