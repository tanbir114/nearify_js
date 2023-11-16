const express = require('express');
const body_parser = require('body-parser');
const userRouter = require('./routes/user_route');

const app = express();

app.use(express.json());

app.use(body_parser.json());
app.use('/',userRouter);

module.exports = app;