let isSignUpMode = false; // State to track whether it's Sign Up or Login mode

function toggleForm() {
    isSignUpMode = !isSignUpMode;

    const formTitle = document.getElementById("formTitle");
    const submitButton = document.getElementById("submitButton");
    const toggleButton = document.getElementById("toggleButton");
    const confirmPasswordField = document.getElementById("confirm_password_field");

    if (isSignUpMode) {
        formTitle.innerText = "Sign Up Form";
        submitButton.innerText = "Sign Up";
        toggleButton.innerText = "Login";
        confirmPasswordField.style.display = "block"; // Show Confirm Password
    } else {
        formTitle.innerText = "Login Form";
        submitButton.innerText = "Login";
        toggleButton.innerText = "Sign Up";
        confirmPasswordField.style.display = "none"; // Hide Confirm Password
    }

    document.getElementById("error").innerHTML = ""; // Clear any errors
}

function handleSubmit(event) {
    event.preventDefault();

    if (isSignUpMode) {
        signUp(); // Call sign up function
    } else {
        login(); // Call login function
    }
}

document.getElementById("loginForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission
});

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // User is signed in.
        location.replace("welcome.html"); // Redirect to welcome page
    }
});

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format validation
    return emailRegex.test(email);
}

function validatePassword(password) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; // Password strength validation
    return passwordRegex.test(password);
}

function realTimeValidation() {
    const emailInput = document.getElementsByName("email")[0];
    const passwordInput = document.getElementsByName("password")[0];
    const confirmPasswordInput = document.getElementsByName("confirm_password")[0];

    // Show email validation only when password field is focused
    passwordInput.addEventListener("focus", () => {
        if (!validateEmail(emailInput.value)) {
            document.getElementById("error").innerHTML = "Invalid email format.";
        } else {
            document.getElementById("error").innerHTML = ""; // Clear error if valid
        }
    });

    emailInput.addEventListener("input", () => {
        // Clear error on email input
        document.getElementById("error").innerHTML = "";
    });

    passwordInput.addEventListener("input", () => {
        if (!validatePassword(passwordInput.value)) {
            document.getElementById("error").innerHTML = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        } else {
            document.getElementById("error").innerHTML = ""; // Clear error
        }
    });

    confirmPasswordInput.addEventListener("input", () => {
        if (passwordInput.value !== confirmPasswordInput.value) {
            document.getElementById("error").innerHTML = "Passwords do not match.";
        } else {
            document.getElementById("error").innerHTML = ""; // Clear error
        }
    });
}

function login() {
    const email = document.getElementsByName("email")[0].value;
    const password = document.getElementsByName("password")[0].value;

    // Final validation checks before login
    if (!validateEmail(email)) {
        document.getElementById("error").innerHTML = "Invalid email format.";
        return;
    }
    if (!validatePassword(password)) {
        document.getElementById("error").innerHTML = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
        .then(() => {
            // Successful login
            location.replace("welcome.html");
        })
        .catch((error) => {
            document.getElementById("error").innerHTML = error.message; // Show error message
        });
}

function signUp() {
    const email = document.getElementsByName("email")[0].value;
    const password = document.getElementsByName("password")[0].value;
    const confirmPassword = document.getElementsByName("confirm_password")[0].value;
    document.getElementById("formTitle").innerText = "Sign Up Form";

    // Show confirm password field if it's hidden
    const confirmPasswordField = document.getElementById("confirm_password_field");
    if (confirmPasswordField.style.display === "none") {
        confirmPasswordField.style.display = "block";
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        document.getElementById("error").innerHTML = "Passwords do not match.";
        return; // Prevent further execution if passwords don't match
    }

    // Validate email and password
    if (!validateEmail(email)) {
        document.getElementById("error").innerHTML = "Invalid email format.";
        return;
    }
    if (!validatePassword(password)) {
        document.getElementById("error").innerHTML = "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
        return;
    }

    // Create user in Firebase
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            document.getElementById("error").innerHTML = ""; // Clear any previous errors

            // Now try to log in with the same credentials
            return firebase.auth().signInWithEmailAndPassword(email, password);
        })
        .then(() => {
            // Redirect to the welcome page if login is successful
            location.replace("welcome.html");
        })
        .catch((error) => {
            document.getElementById("error").innerHTML = error.message; // Show error message
        });
}

function forgotPass() {
    const email = document.getElementsByName("email")[0].value;

    firebase.auth().sendPasswordResetEmail(email)
        .then(() => {
            alert("Reset link sent to your email id");
        })
        .catch((error) => {
            document.getElementById("error").innerHTML = error.message; // Show error message
        });
}

// Call real-time validation on page load
realTimeValidation();
