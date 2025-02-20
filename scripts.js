document.addEventListener("DOMContentLoaded", function () {
    let startButton = document.getElementById("start-button");
    if (startButton) {
        console.log("Start button found and event listener added.");
        startButton.addEventListener("click", startChat);
    } else {
        console.log("Start button NOT found! Check your index.html file.");
    }

    if (sessionStorage.getItem("chatState")) {
        restoreChat();
    }
});

let chatStarted = false;
let chatHistory = [];

function startChat() {
    if (chatStarted) return;
    chatStarted = true;
    
    console.log("startChat function triggered!");
    document.getElementById("start-button").style.display = "none";
    document.getElementById("chat-header").style.display = "block";
    document.getElementById("chat-box").style.display = "block";
    askQuestion("Jay: Where would you like to leave your review?", [
        { text: "Google", value: "google" },
        { text: "Facebook", value: "facebook" }
    ]);
}

function askQuestion(text, options) {
    addMessage(text, "bot");
    addButton(options);
    chatHistory.push({ text, options });
    saveChatState();
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
            addMessage("You: " + option.text, "user");
            buttonContainer.remove();
            chatHistory.push({ userResponse: option.value });
            jayResponse(option.value);
        };
        buttonContainer.appendChild(button);
    });

    let backButton = document.createElement("button");
    backButton.textContent = "← Go Back";
    backButton.classList.add("chat-button", "back-button");
    backButton.onclick = function () {
        goBack();
    };
    buttonContainer.appendChild(backButton);
    
    chatBox.appendChild(buttonContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
    saveChatState();
}

function goBack() {
    if (chatHistory.length > 1) {
        chatHistory.pop(); 
        let lastStep = chatHistory[chatHistory.length - 1];
        document.getElementById("chat-box").innerHTML = "";
        chatHistory.forEach(step => {
            if (step.text) addMessage(step.text, "bot");
            if (step.options) addButton(step.options);
            if (step.userResponse) addMessage("You: " + step.userResponse, "user");
        });
        saveChatState();
    }
}

function jayResponse(message) {
    sessionStorage.setItem("reviewPlatform", message);
    saveChatState();
    
    if (message === "google") {
        window.open("https://www.google.com/search?q=green+chilli+bangor+reviews", "_blank");
    } else if (message === "facebook") {
        window.open("https://www.facebook.com/greenchillibangor/reviews/", "_blank");
    }
    
    setTimeout(() => askForScreenshot(), 1000);
}

function askForScreenshot() {
    askQuestion("Jay: Once you've left your review, upload a screenshot here.", []);
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

function saveChatState() {
    sessionStorage.setItem("chatState", JSON.stringify(chatHistory));
}

function restoreChat() {
    chatHistory = JSON.parse(sessionStorage.getItem("chatState")) || [];
    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML = "";
    chatStarted = true;
    document.getElementById("start-button").style.display = "none";
    document.getElementById("chat-header").style.display = "block";
    document.getElementById("chat-box").style.display = "block";

    chatHistory.forEach(step => {
        if (step.text) addMessage(step.text, "bot");
        if (step.options) addButton(step.options);
        if (step.userResponse) addMessage("You: " + step.userResponse, "user");
    });
}
