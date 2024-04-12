const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
var cors = require('cors')
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');
require('dotenv').config();


const server = http.createServer(app);
// const io = new Server(server);
const io = new Server(server, {
    path: '/',
    transports: ['websocket', 'polling'],
    cors: {
        origin: "*",
        methods: ["POST", "GET"],
        credentials: true
      },
      allowEIO3: true,
});

app.use(express.static('build'));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const userSocketMap = {}
const getAllConnectedClients = (roomId)=>{
   return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
        return {
            socketId,
            username: userSocketMap[socketId],
        }
   })
}

io.on('connection', (socket)=>{
    console.log('socket connected', socket.id);

        // 1. client aaya or use store kiya
        // 2. room me join kraya
        // 3. us roomid me jitne client the un sabhi ko msg send kiya ki new user add ho gya h

    socket.on(ACTIONS.JOIN, ({roomId, username})=>{
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        // console.log(clients);
         clients.forEach(({socketId})=>{
              io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
              })
         })
    })
 
     // editor me code change hone pr ye event call hoga
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];  // socket jitne bhi room se connected h unki list mil jayegi 
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });

    });

    // console.log("what is your name",process.env.HELLO_WORLD);

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=> console.log('listening on port', PORT));