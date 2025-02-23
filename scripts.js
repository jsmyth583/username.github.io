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

    askQuestion("Jay: Where would you like to leave your review? (Please take a screenshot after submitting!)", [
        { text: "Google", value: "google" },
        { text: "Facebook", value: "facebook" }
    ], handleReviewPlatform);
}

function askQuestion(text, options = [], callback = null) {
    addMessage(text, "bot");
    chatHistory.push({ text, options, callback });
    saveChatState();

    if (options.length > 0) {
        addButton(options, callback);
    } else {
        enableUserInput(callback);
    }

    showGoBackButton();
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

function showGoBackButton() {
    let chatBox = document.getElementById("chat-box");
    let existingBackButton = document.getElementById("go-back-button");
    if (existingBackButton) existingBackButton.remove();

    if (chatHistory.length > 1) {
        let backButton = document.createElement("button");
        backButton.textContent = "← Go Back";
        backButton.id = "go-back-button";
        backButton.classList.add("chat-button");

        backButton.onclick = function () {
            goBack();
        };

        // Wait 500ms so messages appear first, THEN show the button
        setTimeout(() => {
            chatBox.appendChild(backButton);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 500); // Delay helps reduce distraction
    }
}


function goBack() {
    if (chatHistory.length > 1) {
        chatHistory.pop(); // Remove the current question
        let lastStep = chatHistory.pop(); // Get the previous question
        document.getElementById("chat-box").innerHTML = ""; // Clear chat box

        // Rebuild the chat history up to the lastStep
        chatHistory.forEach(entry => {
            addMessage(entry.text, "bot");
            if (entry.options.length > 0) {
                addButton(entry.options, entry.callback);
            }
        });

        // **Now properly re-ask the lastStep question with its options or input box**
        if (lastStep.options.length > 0) {
            askQuestion(lastStep.text, lastStep.options, lastStep.callback);
        } else {
            askQuestion(lastStep.text, [], lastStep.callback);
        }
    }
    saveChatState();
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
    askQuestion("Jay: Thank you! Please provide your Full Name.", [], askForEmail);
}

function askForEmail(name) {
    sessionStorage.setItem("userName", name);
    askQuestion("Jay: Now, please provide your Email Address.", [], finalThankYou);
}

function finalThankYou(email) {
    sessionStorage.setItem("userEmail", email);
    addMessage("Jay: Thank you for submitting your details!", "bot");

    // Add a button to trigger the spinner
    let chatBox = document.getElementById("chat-box");
    let spinButton = document.createElement("button");
    spinButton.textContent = "🎰 Spin the Wheel!";
    spinButton.classList.add("chat-button");
    spinButton.onclick = function () {
        spinButton.remove(); // Remove the button after clicking
        showSpinningAnimation();
    };

    chatBox.appendChild(spinButton);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChatState();
}

// Function to create spinning animation
function showSpinningAnimation() {
    let chatBox = document.getElementById("chat-box");

    // Create a spinning message
    let spinner = document.createElement("div");
    spinner.classList.add("spinner");
    spinner.textContent = "🎰 Spinning...";

    chatBox.appendChild(spinner);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Simulate spinning delay before displaying reward
    setTimeout(() => {
        spinner.remove(); // Remove the spinning animation
        giveReward(); // Display the reward
    }, 3000);
}

// Function to randomly select a reward
function giveReward() {
    let rewards = ["Chips 🍟", "Naan Bread 🍞", "Onion Bhaji 🧅", "Chicken Pakora 🍗"];
    let chosenReward = rewards[Math.floor(Math.random() * rewards.length)];

    // Display the reward to the user
    addMessage(`Jay: 🎉 You won **${chosenReward}**!`, "bot");
    addMessage("Jay: Your review will be validated, and your voucher will be emailed to you within 12 hours.", "bot");
    addMessage("Jay: We appreciate your support and hope to serve you again soon!", "bot");

    saveChatState();
}

