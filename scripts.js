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
                addButton(entry.options, entry.callback);
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

    askQuestion("Jay: To get a Spin to Win, do you want to leave a review or post on social media?", [
        { text: "Leave a Review", value: "review" },
        { text: "Post on Social Media", value: "social" }
    ], handleInitialChoice);
}

function handleInitialChoice(choice) {
    if (choice === "review") {
        askReviewPlatform();
    } else if (choice === "social") {
        askSocialMediaInstructions();
    }

    showGoBackToInitialChoice();
}

// Show "Go Back" button for the initial choice
function showGoBackToInitialChoice() {
    let chatBox = document.getElementById("chat-box");
    let existingBackButton = document.getElementById("go-back-button-initial");
    if (existingBackButton) existingBackButton.remove();

    let backButton = document.createElement("button");
    backButton.textContent = "← Go Back";
    backButton.id = "go-back-button-initial";
    backButton.classList.add("chat-button");

    backButton.onclick = function () {
        goBackToInitialChoice();
    };

    chatBox.appendChild(backButton);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to return to the first question
function goBackToInitialChoice() {
    document.getElementById("chat-box").innerHTML = ""; // Clear chat

    askQuestion("Jay: To get a Spin to Win, do you want to leave a review or post on social media?", [
        { text: "Leave a Review", value: "review" },
        { text: "Post on Social Media", value: "social" }
    ], handleInitialChoice);
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

function addButton(options, callback) {
    let chatBox = document.getElementById("chat-box");
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    options.forEach(option => {
        let button = document.createElement("button");
        button.textContent = option.text;
        button.classList.add("chat-button");
        button.onclick = function () {
            addMessage("You: " + option.text, "user");
            buttonContainer.remove();
            if (callback) callback(option.value);
        };
        buttonContainer.appendChild(button);
    });

    chatBox.appendChild(buttonContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChatState();
}

function askReviewPlatform() {
    askQuestion("Jay: Where would you like to leave your review?", [
        { text: "Google", value: "google" },
        { text: "Facebook", value: "facebook" }
    ], handleReviewPlatform);
}

function handleReviewPlatform(platform) {
    sessionStorage.setItem("reviewPlatform", platform);
    saveChatState();

    if (platform === "google") {
        window.open("https://www.google.com/search?q=green+chilli+bangor+reviews", "_blank");
    } else if (platform === "facebook") {
        window.open("https://www.facebook.com/greenchillibangor/reviews/", "_blank");
    }

    setTimeout(() => askForScreenshot(), 3000);
}

function askSocialMediaInstructions() {
    addMessage("Jay: To leave a Social Media review, follow these steps:", "bot");
    addMessage("📌 Like/Follow our pages: \n🔗 [Facebook](https://www.facebook.com/greenchillibangor?locale=en_GB) \n🔗 [Instagram](https://www.instagram.com/green_chilli_restaurant/)", "bot");
    addMessage("📸 Post this image on Instagram or Facebook (Story or Feed):", "bot");

    let chatBox = document.getElementById("chat-box");
    let image = document.createElement("img");
    image.src = "https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/481024849_1437852797540419_1520032287454362269_n.jpg";
    image.style.width = "100%";
    image.style.borderRadius = "10px";
    chatBox.appendChild(image);

    addMessage("📍 Tag our business: \n🔗 @greenchillibangor (Facebook) \n🔗 @green_chilli_restaurant (Instagram)", "bot");
    addMessage("📤 Once done, upload a screenshot of your post here:", "bot");
    
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
            setTimeout(() => askForName(), 1000);
        }
    });

    uploadContainer.appendChild(fileInput);
    chatBox.appendChild(uploadContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChatState();
}

function askForName() {
    askQuestion("Jay: Thank you! Please provide your Full Name.", [], askForEmail);
}

function askForEmail(name) {
    sessionStorage.setItem("userName", name);
    askQuestion("Jay: Now, please provide your Email Address.", [], finalThankYou);
}

function finalThankYou(email) {
    sessionStorage.setItem("userEmail", email);
    addMessage("Jay: Thank you for submitting your details!", "bot");

    let chatBox = document.getElementById("chat-box");
    let spinButton = document.createElement("button");
    spinButton.textContent = "🎰 Spin the Wheel!";
    spinButton.classList.add("chat-button");
    spinButton.onclick = function () {
        spinButton.remove();
        showSpinningAnimation();
    };

    chatBox.appendChild(spinButton);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChatState();
}

// Function for spinning animation and reward selection
function showSpinningAnimation() {
    let chatBox = document.getElementById("chat-box");
    let spinner = document.createElement("div");
    spinner.classList.add("spinner");
    spinner.textContent = "🎰 Spinning...";
    chatBox.appendChild(spinner);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        spinner.remove();
        giveReward();
    }, 3000);
}

function giveReward() {
    let rewards = ["Chips 🍟", "Naan Bread 🍞", "Onion Bhaji 🧅", "Chicken Pakora 🍗"];
    let chosenReward = rewards[Math.floor(Math.random() * rewards.length)];
    addMessage(`Jay: 🎉 You won **${chosenReward}**!`, "bot");
}
