const express = require('express');
var http = require("http");
const app = express();
const port = 7000;
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const userModel = require('./model/user_model');
const userRouter = require('./routes/user_route');
const cors = require("cors");

var server = http.createServer(app);
var io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

app.use(express.json());
app.use(cors());
app.use(express.json());
var clients = {};

io.on("connection", (socket) => {
  console.log("connected");
  socket.on("signin", (id) => {
    console.log(id, "has joined");
    clients[id] = socket;
    // console.log(clients[id]);
    // console.log(clients);
  });
  socket.on("message", (msg) => {
    console.log(msg);
    let targetId = msg.targetId;
    console.log(clients[targetId]);
    if (clients[targetId]) {
      clients[targetId].emit("message", msg);  
    }
  });
});

app.use(body_parser.json());
app.use('/',userRouter);

mongoose.connect('mongodb+srv://tanbir:tanbir114@cluster0.bb4slcn.mongodb.net/?retryWrites=true&w=majority')
.then(client => {
    server.listen(port, ()=>{
        console.log(`Server listening on port http://localhost: ${port}`)
    });
    console.log('Connected!');
})
.catch(err =>{
    console.log('Error connecting');
    console.log(err);
    throw err;
});