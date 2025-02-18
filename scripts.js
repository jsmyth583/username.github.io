document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("start-button").addEventListener("click", startChat);
});

function startChat() {
    document.getElementById("start-button").style.display = "none";
    document.getElementById("chat-header").style.display = "block";
    document.getElementById("chat-box").style.display = "block";
    document.getElementById("user-input").style.display = "block";
    document.getElementById("send-button").style.display = "block";

    addMessage("Jay: Hi, it's Jay from Green Chilli! Would you like to leave a review and receive a free Naan on your next order?");
    addButton([{ text: "Yes", value: "yes" }, { text: "No", value: "no" }]);
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

function jayResponse(message) {
    let response = "";

    if (message === "yes") {
        response = "Awesome! Where would you like to leave your review?";
        addMessage("Jay: " + response);
        addButton([{ text: "Google", value: "google" }, { text: "Facebook", value: "facebook" }]);
    } else if (message === "no") {
        response = "No problem! Thanks for visiting. Have a great day!";
        addMessage("Jay: " + response);
    } else if (message === "google" || message === "facebook") {
        response = `Please leave a review on ${message.charAt(0).toUpperCase() + message.slice(1)}. Once you've done that, upload a screenshot of your review here.`;
        addMessage("Jay: " + response);
        addFileUploadOption();
    }
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
                addMessage("Jay: Thank you! Now, please provide your Full Name.");
            }, 1000);
        }
    });

    uploadContainer.appendChild(fileInput);
    chatBox.appendChild(uploadContainer);
    chatBox.scrollTop = chatBox.scrollHeight;
}
