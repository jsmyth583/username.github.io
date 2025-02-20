document.addEventListener("DOMContentLoaded", function () {
    let startButton = document.getElementById("start-button");
    if (startButton) {
        startButton.addEventListener("click", startChat);
    }

    if (sessionStorage.getItem("chatState")) {
        restoreChat();
    }
});

let chatStarted = false;
let chatHistory = [];
let rewards = ["Free Naan", "10% Off Next Order", "Free Drink", "Free Side Dish"];

function saveChatState() {
    sessionStorage.setItem("chatState", JSON.stringify(chatHistory));
}

function restoreChat() {
    let savedChat = sessionStorage.getItem("chatState");
    if (savedChat) {
        chatHistory = JSON.parse(savedChat);
        chatHistory.forEach(entry => {
            addMessage(entry.text, "bot");
            if (entry.options.length > 0) {
                addButton(entry.options);
            }
        });
    }
}

function startChat() {
    if (chatStarted) return;
    chatStarted = true;
    
    document.getElementById("start-button").style.display = "none";
    document.getElementById("chat-header").style.display = "block";
    document.getElementById("chat-box").style.display = "block";
    
    console.log("Starting chat... Displaying review options.");
    askQuestion("Jay: Where would you like to leave your review?", [
        { text: "Google", value: "google" },
        { text: "Facebook", value: "facebook" }
    ]);
}

function askQuestion(text, options = []) {
    addMessage(text, "bot");
    if (options.length > 0) {
        console.log("Adding buttons: ", options);
        addButton(options);
    } else {
        enableUserInput();
    }
    chatHistory.push({ text, options });
    saveChatState();
}

function enableUserInput(nextStep) {
    let userInput = document.getElementById("user-input");
    let sendButton = document.getElementById("send-button");
    
    userInput.style.display = "block";
    sendButton.style.display = "block";
    userInput.focus();
    
    sendButton.onclick = function () {
        let inputText = userInput.value.trim();
        if (inputText) {
            addMessage("You: " + inputText, "user");
            userInput.value = "";
            userInput.style.display = "none";
            sendButton.style.display = "none";
            if (nextStep) nextStep(inputText);
        }
    };
}

function addMessage(text, sender) {
    let chatBox = document.getElementById("chat-box");
    let msg = document.createElement("div");
    msg.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChatState();
}

function addButton(options) {
    let chatBox = document.getElementById("chat-box");
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    
    options.forEach(option => {
        let button = document.createElement("button");
        button.textContent = option.text;
        button.classList.add("chat-button");
        button.onclick = function () {
            console.log("User selected: ", option.value);
            addMessage("You: " + option.text, "user");
            buttonContainer.remove();
            jayResponse(option.value);
        };
        buttonContainer.appendChild(button);
    });
    
    chatBox.appendChild(buttonContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChatState();
}

function jayResponse(message) {
    sessionStorage.setItem("reviewPlatform", message);
    saveChatState();
    
    console.log("Navigating to: ", message);
    if (message === "google") {
        window.open("https://www.google.com/search?q=green+chilli+bangor+reviews", "_blank");
    } else if (message === "facebook") {
        window.open("https://www.facebook.com/greenchillibangor/reviews/", "_blank");
    }
    
    setTimeout(() => askForScreenshot(), 3000);
}

function askForScreenshot() {
    askQuestion("Jay: Once you've left your review, upload a screenshot here.");
    addFileUploadOption();
}

function addFileUploadOption() {
    let chatBox = document.getElementById("chat-box");
    let uploadContainer = document.createElement("div");
    uploadContainer.classList.add("upload-container");

    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.classList.add("file-input");

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            addMessage("You uploaded: " + fileInput.files[0].name, "user");
            uploadContainer.remove();
            setTimeout(() => {
                askForName();
            }, 1000);
        }
    });
    
    uploadContainer.appendChild(fileInput);
    chatBox.appendChild(uploadContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChatState();
}

function askForName() {
    askQuestion("Jay: Thank you! Please provide your Full Name.", askForEmail);
}

function askForEmail(name) {
    sessionStorage.setItem("userName", name);
    askQuestion("Jay: Now, please provide your Email Address.", finalThankYou);
}

function finalThankYou(email) {
    sessionStorage.setItem("userEmail", email);
    addMessage("Jay: Thank you! Your review will be validated, and your voucher will be emailed to you within the next 12 hours. Please check your inbox/spam folder.", "bot");
    addMessage("Jay: We appreciate your support and hope to serve you again soon!", "bot");
    saveChatState();
}
