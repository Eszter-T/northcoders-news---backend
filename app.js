const express = require('express');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors/index');
const app = express();
const apiRouter = require('./routes/apiRouter');


app.use(express.json());
app.use('/api', apiRouter);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;