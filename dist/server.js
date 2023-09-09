"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const path_1 = __importDefault(require("path"));
const users = [];
// const io = require('socket.io')(server);
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" }
});
// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../client/chat'));
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
    res.sendFile(path_1.default.join(__dirname, '../client', 'index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client', 'login.html'));
});
app.get('/chat', (req, res) => {
    console.log('req.query', req.query);
    res.render('index', { user: req.query });
});
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
