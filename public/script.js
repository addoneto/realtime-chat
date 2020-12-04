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
    const scrollToBottom = false;
    scrollToBottom = element.scrollHeight - element.clientHeight <= element.scrollTop + 1;

    const messageDiv = document.createElement('div');
    messageBox.appendChild(messageDiv);
    const messageStrong = document.createElement('strong');
    const messageBody = document.createElement('p');
    messageDiv.appendChild(messageStrong);
    messageDiv.appendChild(messageBody);
    messageStrong.innerText = msg.author;
    messageBody.innerText = msg.message;

    if(scrollToBottom){
        messageBox.scrollTop = messageBox.scrollHeight;
    }
}