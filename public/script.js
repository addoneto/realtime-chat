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

        renderMessage(messageObj);
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
    messageBox.innerHTML += `<div><strong>${(msg.author).toString()}</strong><br><p>${(msg.message).toString()}</p></div>`;
    messageBox.scrollTop = messageBox.scrollHeight;
}