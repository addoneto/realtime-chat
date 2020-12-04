const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];
const messageValidationRegex = /<div|<script|<button|<input|<form/ig;

io.on('connection', (socket) => {
    console.log('\x1b[32m%s\x1b[0m', `Socket Connection ${socket.id}`);

    socket.emit('previousMessages', messages);

    socket.on('sendMessage', data => {
        if(data.message.length > 1000 ||
            data.author.length > 30 ||
            messageValidationRegex.test(data.author) ||
            messageValidationRegex.test(data.message)){
            
            return;
        }
        
        // io.to(socket.id).emit('sendMessage', data);
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(process.env.PORT || 3000, () => {
    console.log('\x1b[34m%s\x1b[0m', 'Server listening at port 3000!');
});