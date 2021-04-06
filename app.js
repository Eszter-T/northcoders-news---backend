const express = require('express');
const { handlePsqlErrors, handleCustomErrors, handleServerErrors } = require('./errors/index');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/apiRouter');

app.use(cors());
app.use(express.json());
app.use('/api', apiRouter);

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;