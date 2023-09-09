import express from 'express';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const users: { [userId: string]: string } = {

}

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/chat'));

// Express routes
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

io.on('connection', (socket) => {
    console.log('a user connected');
    users[socket.id] = socket.id;
    socket.on('message', (message: string) => {
        console.log(message);
        socket.broadcast.emit('message', `⟵ ${users[socket.id]} said ${message}`);
    });
    socket.on('join', (user: string) => {
        console.log('message', user);
        users[socket.id] = user;
        io.to(socket.id).emit('join', { users ,message:`${users[socket.id]} has joined the chat`});
        socket.broadcast.emit('join', { users ,message:`${user} has joined the chat`} );
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.broadcast.emit('userLogout', { users ,message:`${users[socket.id]} has left the chat`});
        delete users[socket.id];
    })
});

server.listen(process.env.PORT ?? 8080, () => console.log('listening on http://localhost:8080'));
