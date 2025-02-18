
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

let state = 'initial'; // Track conversation state

function sendMessage() {
    let message = userInput.value.trim();
    if (message === "") return;

    addMessage("You: " + message);
    userInput.value = "";

    setTimeout(() => {
        botResponse(message);
    }, 1000);
}

function addMessage(text) {
    let msg = document.createElement("p");
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function botResponse(message) {
    let response = "";

    if (state === 'initial' || message.toLowerCase().includes("hi") || message.toLowerCase().includes("hello") || message === "") {
        response = "Hi, it's Jay from Green Chilli! Would you like to leave a review and receive a free Naan on your next order? (Yes/No)";
        state = 'waitingForYesNo';
    } else if (state === 'waitingForYesNo') {
        if (message.toLowerCase() === "yes") {
            response = "Awesome! Where would you like to leave your review? (Google/Facebook)";
            state = 'waitingForPlatform';
        } else if (message.toLowerCase() === "no") {
            response = "No problem! Thanks for visiting. Have a great day!";
            state = 'end';
        } else {
            response = "Please respond with 'Yes' or 'No'.";
        }
    } else if (state === 'waitingForPlatform') {
        if (message.toLowerCase() === "google") {
            response = "Please leave a review on Google: [Google Review Link]. Once you've done that, upload a screenshot of your review here.";
            state = 'waitingForScreenshot';
        } else if (message.toLowerCase() === "facebook") {
            response = "Please leave a review on Facebook: [Facebook Review Link]. Once you've done that, upload a screenshot of your review here.";
            state = 'waitingForScreenshot';
        } else {
            response = "Please choose 'Google' or 'Facebook'.";
        }
    } else if (state === 'waitingForScreenshot') {
        response = "Thank you for your review! Please upload a screenshot of your review here.";
        state = 'waitingForDetails';
    } else if (state === 'waitingForDetails' && message.toLowerCase() !== "") {
        response = "Thanks for the screenshot! Please provide your **Full Name** and **Email Address**, and we will send your free Naan voucher within 6 hours!";
        state = 'waitingForNameEmail';
    } else if (state === 'waitingForNameEmail') {
        response = `Thank you! We will validate your review and send your voucher to ${message}. Expect it within 6 hours!`;
        state = 'end';
    } else {
        response = "I'm not sure what you mean. Please follow the steps in the conversation.";
    }

    addMessage("Bot: " + response);
}
