const db = firebase.firestore(); // Initialize Firestore
const storage = firebase.storage(); // Initialize Storage

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // Populate the email field and load existing profile data if available
        document.getElementsByName("email")[0].value = user.email;

        // Retrieve and display user profile data
        db.collection("users").doc(user.uid).get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                document.getElementsByName("name")[0].value = userData.name;
                document.getElementsByName("address")[0].value = userData.address;

                // Check if profilePicUrl exists and set it as the profile picture
                if (userData.profilePicUrl) {
                    document.getElementById("profilePicPreview").src = userData.profilePicUrl;
                } else {
                    document.getElementById("profilePicPreview").src = "/images/avatar.jpg"; // Default avatar
                }
            }
        }).catch((error) => {
            console.log("Error getting user data:", error.message);
        });
    } else {
        // User is not signed in, redirect to login
        location.replace("index.html");
    }
});

function updateProfile(event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementsByName("name")[0].value;
    const address = document.getElementsByName("address")[0].value;
    const user = firebase.auth().currentUser;

    // Prepare data to save
    const userData = {
        name: name,
        email: user.email,
        address: address,
    };

    // Save profile info to Firestore
    db.collection("users").doc(user.uid).set(userData)
        .then(() => {
            // Check if profile picture is uploaded
            const file = document.getElementById("profilePic").files[0];
            if (file) {
                const storageRef = storage.ref(`profile_pictures/${user.uid}/${file.name}`);
                
                // Upload and get the URL
                storageRef.put(file).then(() => {
                    storageRef.getDownloadURL().then((url) => {
                        // Update Firestore with the profile picture URL
                        db.collection("users").doc(user.uid).update({ profilePicUrl: url });

                        // Set the profile picture on the page in real-time
                        document.getElementById("profilePicPreview").src = url;

                        alert("Profile updated successfully!");
                        location.replace("welcome.html"); // Redirect to welcome page after saving
                    }).catch((error) => {
                        console.error("Error getting download URL:", error.message);
                        document.getElementById("error").innerHTML = error.message;
                    });
                }).catch((error) => {
                    console.error("Error uploading file:", error.message);
                    document.getElementById("error").innerHTML = error.message;
                });
            } else {
                alert("Profile updated successfully without a picture!");
                location.replace("welcome.html"); // Redirect to welcome page
            }
        })
        .catch((error) => {
            console.error("Error updating profile:", error.message);
            document.getElementById("error").innerHTML = error.message;
        });
}

// Capture Image from Webcam
document.getElementById('captureButton').onclick = function () {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');

    // Access webcam
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
            video.play();
            setTimeout(() => {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/png');
                const blob = dataURLtoBlob(dataUrl);
                uploadImage(blob); // Upload the captured image
            }, 2000);
        })
        .catch((error) => {
            console.error("Error accessing webcam:", error.message);
        });
};

// Convert data URL to Blob
function dataURLtoBlob(dataURL) {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

// Upload image to Firestore
function uploadImage(blob) {
    const user = firebase.auth().currentUser;
    const storageRef = storage.ref(`profile_pictures/${user.uid}/webcam_photo.png`);
    storageRef.put(blob).then(() => {
        storageRef.getDownloadURL().then((url) => {
            // Update Firestore with the new profile picture URL
            db.collection("users").doc(user.uid).update({ profilePicUrl: url });

            // Set the profile picture on the page
            document.getElementById("profilePicPreview").src = url;

            alert("Profile picture updated successfully!");
            location.replace("welcome.html"); // Redirect to welcome page
        }).catch((error) => {
            console.error("Error getting download URL:", error.message);
            document.getElementById("error").innerHTML = error.message;
        });
    }).catch((error) => {
        console.error("Error uploading file:", error.message);
        document.getElementById("error").innerHTML = error.message;
    });
}
