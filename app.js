const express = require('express');
const { handle404s } = require('./errors/index');
const app = express();
const apiRouter = require('./routes/apiRouter');


app.use(express.json());
app.use('/api', apiRouter);

app.use(handle404s);

module.exports = app;