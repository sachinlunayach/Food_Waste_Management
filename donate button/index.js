const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
const SENDGRID_API_KEY = 'Your_Send Grid_API_Key';  // Replace with your actual SendGrid API key
sgMail.setApiKey(SENDGRID_API_KEY);

exports.sendThankYouEmail = functions.firestore
    .document('donations/{donationId}')
    .onCreate((snap, context) => {
        const donation = snap.data();
        const email = donation.email; // Donor's email address

        const msg = {
            to: email,
            from: 'sachinlunayach333@gmail.com',  // Use your verified sender email
            subject: 'Thank You for Your Food Donation!',
            html: `
                <h1>Thank You, ${donation.name}!</h1>
                <p>We have received your generous food donation from <strong>${donation.restaurantName}</strong> 
                and we deeply appreciate your contribution.</p>
                <p>Here are the details of your donation:</p>
                <ul>
                    <li><strong>Food Quality:</strong> ${donation.foodQuality}</li>
                    <li><strong>Food Quantity:</strong> ${donation.foodQuantity} kg</li>
                    <li><strong>Food Type:</strong> ${donation.foodType}</li>
                    <li><strong>Address:</strong> ${donation.address}</li>
                </ul>
                <p>Your donation will help many in need. Thank you once again!</p>
                <p>Best regards, <br />Food Donation Team</p>
            `
        };

        // Send the email using SendGrid
        return sgMail.send(msg)
            .then(() => {
                console.log('Email sent to:', email);
            })
            .catch(error => {
                console.error('Error sending email:', error);
            });
    });


    
        // Counter function
function animateValue(id, target) {
    const element = document.getElementById(id);
    let current = 0;
    const increment = Math.ceil(target / 100);
    const duration = 2000;
    const interval = duration / 100;

    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            clearInterval(counter);
            element.textContent = `${Math.floor(target)}+`;
        } else {
            element.textContent = `${Math.floor(current)}+`;
        }
    }, interval);
}

// Observer function to trigger animations on scroll
function startCounters(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log("Stats container is now visible, starting counters...");
            animateValue("mealsProvided", 5000);
            animateValue("tonsSaved", 50);
            animateValue("wasteReduced", 50);
            observer.unobserve(entry.target);
        }
    });
}

// Initialize observer after DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        const observer = new IntersectionObserver(startCounters, { threshold: 0.2 });
        observer.observe(statsContainer);
        console.log("Observer initialized for stats container");
    } else {
        console.error("Stats container not found in DOM");
    }
});