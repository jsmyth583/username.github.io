document.addEventListener("DOMContentLoaded", function () {
    let startButton = document.getElementById("start-button");
    if (startButton) {
        startButton.addEventListener("click", startChat);
    }
});

let chatHistory = [];
let waitingForEmail = false;

function startChat() {
    document.getElementById("start-button").style.display = "none";
    document.getElementById("chat-header").style.display = "block";
    document.getElementById("chat-box").style.display = "block";
    document.getElementById("user-input").style.display = "none";
    document.getElementById("send-button").style.display = "none";
    
    if (chatHistory.length === 0) {
        askQuestion("Jay: Where would you like to leave your review?", [
            { text: "Google", value: "google" }, 
            { text: "Facebook", value: "facebook" }
        ]);
    }
}

function askQuestion(text, options) {
    if (chatHistory.length === 0 || chatHistory[chatHistory.length - 1].text !== text) {
        chatHistory.push({ text, options });
        addMessage(text, "bot");
        addButton(options);
    }
}

function addMessage(text, sender) {
    let chatBox = document.getElementById("chat-box");
    let msg = document.createElement("div");
    msg.classList.add("chat-message", sender === "user" ? "user-message" : "bot-message");
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addButton(options) {
    let chatBox = document.getElementById("chat-box");
    let oldButtons = document.querySelector(".button-container");
    if (oldButtons) {
        oldButtons.remove();
    }

    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    options.forEach(option => {
        let button = document.createElement("button");
        button.textContent = option.text;
        button.classList.add("chat-button");
        button.onclick = function () {
            addMessage("You: " + option.text, "user");
            chatBox.removeChild(buttonContainer);
            setTimeout(() => {
                jayResponse(option.value);
            }, 1000);
        };
        buttonContainer.appendChild(button);
    });

    chatBox.appendChild(buttonContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function jayResponse(message) {
    if (message === "google") {
        window.open("https://www.google.com/search?si=APYL9btvhO6SAb8jF9HqTZMMa7vs_teLnZaEVrJZwRKFIIKjodRXUogKEU2bVdvL0y6BSbe9z84OE12NsQZQHqkTnjEUvWFjl7T8y-U1rAVqVxo7oawY8bdwh9RTbXAynu-QMf4arewaQpxrkXWICZlwNkMdLC8XmA%3D%3D&hl=en-GB&q=green+chilli+bangor+reviews&shndl=30&shem=lcuae&source=sh/x/loc/osrp/m5/4&kgs=39464bd113bd8b85&zx=1739986110644&no_sw_cr=1#ebo=2", "_blank");
        askQuestion("Jay: Once you've left your review, upload a screenshot here.", []);
        addFileUploadOption();
    } else if (message === "facebook") {
        window.open("https://www.facebook.com/greenchillibangor/reviews/", "_blank");
        askQuestion("Jay: Once you've left your review, upload a screenshot here.", []);
        addFileUploadOption();
    }
}

function addFileUploadOption() {
    let chatBox = document.getElementById("chat-box");
    let oldUpload = document.querySelector(".upload-container");
    if (oldUpload) {
        oldUpload.remove();
    }

    let uploadContainer = document.createElement("div");
    uploadContainer.classList.add("upload-container");

    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.classList.add("file-input");

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            addMessage("You uploaded: " + fileInput.files[0].name, "user");
            chatBox.removeChild(uploadContainer);
            setTimeout(() => {
                askForName();
            }, 1000);
        }
    });

    uploadContainer.appendChild(fileInput);
    chatBox.appendChild(uploadContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function askForName() {
    askQuestion("Jay: Thank you! Please provide your Full Name.", []);
    document.getElementById("user-input").style.display = "block";
    document.getElementById("send-button").style.display = "block";
    document.getElementById("send-button").onclick = function () {
        let userInput = document.getElementById("user-input").value;
        if (userInput.trim() !== "") {
            addMessage("You: " + userInput, "user");
            document.getElementById("user-input").value = "";
            setTimeout(() => {
                askForEmail();
            }, 1000);
        }
    };
}

function askForEmail() {
    askQuestion("Jay: Now, please provide your Email Address.", []);
    document.getElementById("send-button").onclick = function () {
        let userInput = document.getElementById("user-input").value;
        if (userInput.trim() !== "") {
            addMessage("You: " + userInput, "user");
            document.getElementById("user-input").style.display = "none";
            document.getElementById("send-button").style.display = "none";
            setTimeout(() => {
                addMessage("Jay: Thank you! Your review will be validated, and your voucher will be emailed to you within the next 12 hours. Please check your inbox/spam folder.", "bot");
                addMessage("Jay: We appreciate your support and hope to serve you again soon!", "bot");
            }, 1000);
        }
    };
}
