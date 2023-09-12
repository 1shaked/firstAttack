"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: { origin: "*" }
});
const users = {};
// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path_1.default.join(__dirname, '../client/chat'));
// Express routes
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client', 'index.html'));
});
app.get('/login', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client', 'login.html'));
});
app.get('/example', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../client/chat', 'example.html'));
});
app.get('/chat', (req, res) => {
    console.log('req.query', req.query);
    res.render('index', { user: req.query });
});
io.on('connection', (socket) => {
    console.log('a user connected');
    users[socket.id] = socket.id;
    socket.on('message', (message) => {
        console.log(message);
        socket.broadcast.emit('message', `⟵ ${users[socket.id]} said ${message}`);
    });
    socket.on('join', (user) => {
        console.log('message', user);
        users[socket.id] = user;
        io.to(socket.id).emit('join', { users, message: `${users[socket.id]} has joined the chat` });
        socket.broadcast.emit('join', { users, message: `${user} has joined the chat` });
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('userLogout', { users, message: `${users[socket.id]} has left the chat` });
        delete users[socket.id];
    });
});
server.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8080, () => console.log('listening on http://localhost:8080'));
