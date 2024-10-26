// Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();
    const storage = firebase.storage();

    // Form submission
    document.getElementById('donationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const restaurantName = document.getElementById('restaurantName').value;
        const contactNumber = document.getElementById('contactNumber').value;
        const email = document.getElementById('email').value;
        const foodQuality = document.getElementById('foodQuality').value;
        const foodType = document.getElementById('foodType').value;
        const foodQuantity = document.getElementById('foodQuantity').value;
        const address = document.getElementById('address').value;
        const imageFile = document.getElementById('imageUpload').files[0];

        // Upload image to Firebase Storage
        const imageRef = storage.ref(`food_images/${imageFile.name}`);
        imageRef.put(imageFile).then(snapshot => {
            snapshot.ref.getDownloadURL().then(imageUrl => {
                // Save the donation details in Firestore
                db.collection('donations').add({
                    name,
                    restaurantName,
                    contactNumber,
                    email,
                    foodQuality,
                    foodType,
                    foodQuantity,
                    address,
                    imageUrl
                }).then(() => {
                    alert('Donation successful!');
                    document.getElementById('donationForm').reset();
                }).catch(error => {
                    console.error('Error storing donation:', error);
                });
            });
        }).catch(error => {
            console.error('Error uploading image:', error);
        });
    });

    // Fetch donations
    function fetchDonationsAndRedirect() {
db.collection('donations').get().then(snapshot => {
    const donations = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        donations.push({
            id: doc.id,  // Store the document ID if needed
            imageUrl: data.imageUrl,
            restaurantName: data.restaurantName,
            name: data.name,
            foodQuality: data.foodQuality,
            foodType: data.foodType,
            foodQuantity: data.foodQuantity,
            contactNumber: data.contactNumber,
            address: data.address
        });
    });
    // Store donations in local storage (or pass as a URL parameter)
    localStorage.setItem('donations', JSON.stringify(donations));
    window.location.href = '/donate button/fetch.html';  // Redirect to fetch.html
}).catch(error => {
    console.error('Error fetching donations:', error);
});
}
// Function to scroll to top on page load
window.addEventListener('load', () => {
    window.scrollTo(0, 0); // Ensure page starts at top
});

// Show/hide scroll buttons based on scroll direction and position
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const scrollToBottomBtn = document.getElementById('scrollToBottom');
    let lastScrollY = window.pageYOffset;

    // Scroll event listener
    window.addEventListener('scroll', () => {
        const currentScrollY = window.pageYOffset;

        if (currentScrollY > lastScrollY && currentScrollY > 50) {
            // User scrolled down and passed 50px
            scrollToTopBtn.classList.add('show');
            scrollToBottomBtn.classList.remove('show');
        } else if (currentScrollY < lastScrollY && currentScrollY > 50) {
            // User scrolled up and passed 50px
            scrollToBottomBtn.classList.add('show');
            scrollToTopBtn.classList.remove('show');
        } else if (currentScrollY <= 50) {
            // Hide both buttons if near the top
            scrollToTopBtn.classList.remove('show');
            scrollToBottomBtn.classList.remove('show');
        }

        lastScrollY = currentScrollY;
    });

    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll to bottom functionality
    scrollToBottomBtn.addEventListener('click', () => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    });
});
