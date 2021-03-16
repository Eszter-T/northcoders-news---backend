const apiRouter = require('express').Router();
const topicsRouter = require('../routes/topicsRouter');
const usersRouter = require('../routes/usersRouter');
const articlesRouter = require('../routes/articlesRouter');
const commentsRouter = require('../routes/commentsRouter');

const fs = require('fs')

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

apiRouter.route('').get((req, res, next) => {
    return res
        .status(200)
        .send(JSON.parse(fs.readFileSync('endpoints.json', "utf-8")))
});

module.exports = apiRouter;