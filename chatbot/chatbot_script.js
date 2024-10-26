// Firebase configuration
var firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');

// Function to display messages
function displayMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    messageElement.textContent = message;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom

    // If bot message, activate TTS
    if (sender === 'bot') {
        speakText(message);
    }
}

// Function to handle TTS (text-to-speech)
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}

// Send user message and retrieve bot response
function sendMessage() {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    displayMessage(userMessage, 'user');
    userInput.value = '';

    // Retrieve response from Firestore
    displayThinking();
    setTimeout(() => {
        getBotResponse(userMessage);
    }, 1000); // Delay to simulate thinking
}

// Function to display 'bot is thinking'
function displayThinking() {
    const thinkingElement = document.createElement('div');
    thinkingElement.classList.add('message', 'bot-message', 'bot-thinking');
    thinkingElement.textContent = "Thinking";
    chatLog.appendChild(thinkingElement);
    chatLog.scrollTop = chatLog.scrollHeight;
}

// Retrieve bot response from Firestore
async function getBotResponse(userMessage) {
    const keywords = userMessage.toLowerCase().split(' ');
    const responses = [];

    try {
        for (const keyword of keywords) {
            const responseRef = db.collection('responses').doc(keyword);
            const doc = await responseRef.get();
            if (doc.exists) {
                responses.push(doc.data().response);
            }
        }
        
        if (responses.length === 0) {
            const fullResponseRef = db.collection('responses').doc(userMessage.toLowerCase());
            const fullDoc = await fullResponseRef.get();
            if (fullDoc.exists) {
                responses.push(fullDoc.data().response);
            }
        }
        
        // Remove thinking animation and display response
        const thinkingMessages = document.querySelectorAll('.bot-thinking');
        thinkingMessages.forEach(msg => msg.remove());
        
        if (responses.length > 0) {
            displayMessage(responses.join(' '), 'bot');
        } else {
            displayMessage("I'm not sure about that. Could you ask something else?", 'bot');
        }
    } catch (error) {
        console.error("Error fetching response:", error);
    }
}

// Toggle chatbot open/close
function toggleChatbot() {
    const chatbot = document.querySelector('.chatbot-container');
    chatbot.classList.toggle('open');
}

// Send message on Enter keypress
userInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
