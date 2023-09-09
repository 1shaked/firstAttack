import express from 'express';
import { Server } from "socket.io";
import { createServer } from "http";
import path from 'path';

const users: any[]   = [];
// const io = require('socket.io')(server);
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});


// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/chat'));


io.on('connection', (socket) => {
    socket.on('join', (message) => {
        console.log('message', message);
        socket.broadcast.emit('message', message);
    });
    
    // socket.on('createUser', (user) => {
    //     console.log('user', user);
    //     socket.emit('userCreated', user);
    // });
    // socket.on('disconnect', () => {});
});

app.get('/createUser', (req, res) => {
    users.push(req.query);
    console.log('users', users);
    res.render('index', { user: req.query });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../client', 'login.html'));
});

app.get('/chat', (req, res) => {
    console.log('req.query', req.query);
    res.render('index', { user: req.query });
})


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
