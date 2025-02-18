
const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");

let state = 'initial'; // Track conversation state

function sendMessage() {
    let message = userInput.value.trim();
    if (message === "") return;

    addMessage("You: " + message);
    userInput.value = "";

    setTimeout(() => {
        jayResponse(message);
    }, 1000);
}

function addMessage(text) {
    let msg = document.createElement("p");
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addButton(options) {
    let buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    options.forEach(option => {
        let button = document.createElement("button");
        button.textContent = option.text;
        button.classList.add("chat-button");
        button.onclick = function () {
            addMessage("You: " + option.text);
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

function addFileUploadOption() {
    let uploadContainer = document.createElement("div");
    uploadContainer.classList.add("upload-container");

    let fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.classList.add("file-input");

    fileInput.addEventListener("change", function () {
        if (fileInput.files.length > 0) {
            addMessage("You uploaded: " + fileInput.files[0].name);
            chatBox.removeChild(uploadContainer);
            setTimeout(() => {
                jayResponse("image_uploaded");
            }, 1000);
        }
    });

    uploadContainer.appendChild(fileInput);
    chatBox.appendChild(uploadContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function jayResponse(message) {
    let response = "";

    if (state === 'initial' || message.toLowerCase().includes("hi") || message.toLowerCase().includes("hello")) {
        response = "Hi, it's Jay from Green Chilli! Would you like to leave a review and receive a free Naan on your next order?";
        addMessage("Jay: " + response);
        addButton([{ text: "Yes", value: "yes" }, { text: "No", value: "no" }]);
        state = 'waitingForYesNo';
    } else if (state === 'waitingForYesNo') {
        if (message.toLowerCase() === "yes") {
            response = "Awesome! Where would you like to leave your review?";
            addMessage("Jay: " + response);
            addButton([{ text: "Google", value: "google" }, { text: "Facebook", value: "facebook" }]);
            state = 'waitingForPlatform';
        } else {
            response = "No problem! Thanks for visiting. Have a great day!";
            addMessage("Jay: " + response);
            state = 'end';
        }
    } else if (state === 'waitingForPlatform') {
        if (message.toLowerCase() === "google") {
            response = "Please leave a review on Google: [Google Review Link]. Once you've done that, upload a screenshot of your review here.";
            addMessage("Jay: " + response);
            addFileUploadOption();
            state = 'waitingForScreenshot';
        } else if (message.toLowerCase() === "facebook") {
            response = "Please leave a review on Facebook: [Facebook Review Link]. Once you've done that, upload a screenshot of your review here.";
            addMessage("Jay: " + response);
            addFileUploadOption();
            state = 'waitingForScreenshot';
        } else {
            response = "Please choose 'Google' or 'Facebook'.";
            addMessage("Jay: " + response);
        }
    } else if (state === 'waitingForScreenshot' && message === "image_uploaded") {
        response = "Thank you for your review! Have you uploaded the screenshot?";
        addMessage("Jay: " + response);
        addButton([{ text: "Yes", value: "yes_uploaded" }, { text: "No", value: "no_uploaded" }]);
        state = 'waitingForScreenshotConfirmation';
    } else if (state === 'waitingForScreenshotConfirmation' && message === "yes_uploaded") {
        response = "Great! Now, please provide your Full Name.";
        addMessage("Jay: " + response);
        state = 'waitingForName';
    } else if (state === 'waitingForName') {
        response = "Thank you! Now, please provide your Email Address.";
        addMessage("Jay: " + response);
        state = 'waitingForEmail';
    } else {
        response = "I'm not sure what you mean. Please follow the steps in the conversation.";
        addMessage("Jay: " + response);
    }
}
