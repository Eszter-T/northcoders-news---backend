const express = require('express');
const { handlePsqlErrors, handleCustomErrors, handle404s } = require('./errors/index');
const app = express();
const apiRouter = require('./routes/apiRouter');


app.use(express.json());
app.use('/api', apiRouter);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handle404s);

module.exports = app;