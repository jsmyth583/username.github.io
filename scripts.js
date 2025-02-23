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

    // Add a "Go Back" button to return to the initial question
    showGoBackToInitialChoice();
}

// ✅ **Fix: Add the missing `askReviewPlatform()` function**
function askReviewPlatform() {
    askQuestion("Jay: Where would you like to leave your review? Don't forget to take a screenshot of your review before continuing!", [
        { text: "Google", value: "google" },
        { text: "Facebook", value: "facebook" }
    ], handleReviewPlatform);
}

// ✅ **Ensure the "Go Back" button properly returns to the first question**
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

// ✅ **Fix: This function correctly resets the question**
function goBackToInitialChoice() {
    document.getElementById("chat-box").innerHTML = ""; // Clear chat

    // Re-ask the first question
    askQuestion("Jay: To get a Spin to Win, do you want to leave a review or post on social media?", [
        { text: "Leave a Review", value: "review" },
        { text: "Post on Social Media", value: "social" }
    ], handleInitialChoice);
}

// ✅ **Ensure handling of Google/Facebook reviews works**
function handleReviewPlatform(platform) {
    sessionStorage.setItem("reviewPlatform", platform);
    saveChatState();

    if (platform === "google") {
        window.open("https://www.google.com/search?q=green+chilli+bangor+reviews", "_blank");
        setTimeout(() => askForScreenshot(), 3000);
    } else if (platform === "facebook") {
        window.open("https://www.facebook.com/greenchillibangor/reviews/", "_blank");
        setTimeout(() => askForScreenshot(), 3000);
    }
}

// ✅ **Fix: Add message to remind users about screenshots**
function askForScreenshot() {
    askQuestion("Jay: Once you've left your review, please upload a screenshot here.", [], addFileUploadOption);
}

// ✅ **Fix: Ensure "Post on Social Media" correctly displays**
function askSocialMediaInstructions() {
    addMessage("Jay: To leave a Social Media review, follow these steps:", "bot");
    
    addMessage("1️⃣ Like/Follow our pages: \n📌 [Facebook](https://www.facebook.com/greenchillibangor?locale=en_GB) \n📌 [Instagram](https://www.instagram.com/green_chilli_restaurant/)", "bot");
    
    addMessage("2️⃣ Post this image on your Instagram Story, Instagram Feed, or Facebook Story:", "bot");

    // Display the image they need to post
    let chatBox = document.getElementById("chat-box");
    let image = document.createElement("img");
    image.src = "https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/481024849_1437852797540419_1520032287454362269_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=PNb1F3GFhuwQ7kNvgEQGQKA&_nc_oc=AdgZhbD-BBSpftS6KtOi0ofOhNckQXmpKUhT-BsRZ_trv7BCv4453IOTHeNWMjclqCo&_nc_zt=23&_nc_ht=scontent-man2-1.xx&_nc_gid=ADN3WEz-QymNklxdlKiWZ4K&oh=00_AYBikKR8bfUsgVxTdV1kVIczuWjprSGOzuV2u2xey1SyDg&oe=67C03B82";
    image.style.width = "100%";
    image.style.borderRadius = "10px";
    chatBox.appendChild(image);

    addMessage("3️⃣ Tag our business in your post: \n📍 @greenchillibangor on Facebook \n📍 @green_chilli_restaurant on Instagram", "bot");

    addMessage("Once you've done that, upload a screenshot of your post here:", "bot");
    
    // Add file upload option
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
