document.addEventListener("DOMContentLoaded", function () {
    let startButton = document.getElementById("start-button");
    if (startButton) {
        console.log("Start button found and event listener added.");
        startButton.addEventListener("click", startChat);
    } else {
        console.log("Start button NOT found! Check your index.html file.");
    }
});

let chatStarted = false;

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
    let chatBox = document.getElementById("chat-box");
    let existingMessages = Array.from(chatBox.getElementsByClassName("bot-message"));
    if (existingMessages.some(msg => msg.textContent === text)) return;
    
    addMessage(text, "bot");
    addButton(options);
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
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");
    
    options.forEach(option => {
        let button = document.createElement("button");
        button.textContent = option.text;
        button.classList.add("chat-button");
        button.onclick = function () {
            addMessage("You: " + option.text, "user");
            chatBox.removeChild(buttonContainer);
            jayResponse(option.value);
        };
        buttonContainer.appendChild(button);
    });

    chatBox.appendChild(buttonContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function jayResponse(message) {
    if (message === "google") {
        window.open("https://www.google.com/search?q=green+chilli+bangor+reviews", "_blank");
    } else if (message === "facebook") {
        window.open("https://www.facebook.com/greenchillibangor/reviews/", "_blank");
    }
}
