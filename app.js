const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./db/mongodb');
const socketio = require('./middleware/socketio');
const routes = require('./routes/routes');





const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
dotenv.config();
connectDB();

app.use(cors()); // 모든 도메인 허용
app.use(express.json());
app.use('/', routes);

const server = createServer(app);

// socket.io에 CORS 설정 추가
const io = new Server(server, {
  cors: {
    origin: '*', // 모든 프론트 허용
    methods: ['GET', 'POST'],
    credentials: true
  }
});

socketio(io);

server.listen(3000, () => {

  console.log('서버시작');
});
