import express from 'express';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

import Connection from './database/db.js';
import Routes from './routes/Routes.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000;

const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const DATABASE = process.env.DB_NAME;


app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/', Routes);

Connection(username, password, DATABASE);

// socket configuration

const io = new Server(9000, {
  cors: {
//     origin: 'http://localhost:3000',
    origin: process.env.origin,
  },
})


let users = [];

const addUser = (userData, socketId) => {
  !users.some(user => user.sub === userData.sub) && users.push({ ...userData, socketId });
}

const removeUser = (socketId) => {
  users = users.filter(user => user.socketId !== socketId);
}

const getUser = (userId) => {
  return users.find(user => user.sub === userId);
}

io.on('connection', (socket) => {
  // console.log('user connected')

  //connect
  socket.on("addUser", userData => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  })

  //send message
  socket.on('sendMessage', (data) => {
    // console.log("send message",data);
    const user = getUser(data.receiverId);
    // console.log(user)
    io.to(user.socketId).emit('getMessage', data)
  })

  //disconnect
  socket.on('disconnect', () => {
    // console.log('user disconnected');
    removeUser(socket.id);
    io.emit('getUsers', users);
  })
})


app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));
