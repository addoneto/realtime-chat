const currentURI = window.location.href;
const socket = io(currentURI);

const chatForm = document.forms[0];
const messageBox = document.getElementById('message-box');
const usernameField = document.querySelector('input[name="username"]');
const messageField = document.querySelector('input[name="message"]');

window.onload = () => {
    if (localStorage.getItem('username') != undefined &&
        localStorage.getItem('username').length <= 30) { 
        // prevent old usernames with mode than 30 characters
        usernameField.value = localStorage.getItem('username');
    }
}

chatForm.onsubmit = (event) => {
    event.preventDefault();

    if (localStorage.getItem('username') != usernameField.value)
        localStorage.setItem('username', usernameField.value);

    if (usernameField.value && messageField.value) {
        const messageObj = {
            author: usernameField.value,
            message: messageField.value
        };

        const messageValidationRegex = /<div|<script|<button|<input|<form/ig;
        if(messageValidationRegex.test(messageObj.author) ||
            messageValidationRegex.test(messageObj.message)){
                alert('Write a valid text!');
                return;
        }       

        renderMessage(msg);
        socket.emit('sendMessage', messageObj);
        messageField.value = '';
    }
};

socket.on('receivedMessage', (msg) => {
    renderMessage(msg);
});

socket.on('previousMessages', (allMsgs) => {
    for (msg of allMsgs) {
        renderMessage(msg);
    }
});

function renderMessage(msg) {
    messageBox.innerHTML += `<div><strong>${msg.author}</strong><br><p>${msg.message}</p></div>`;
    messageBox.scrollTop = messageBox.scrollHeight;
}