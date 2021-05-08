# Northcoders News API

Here is a link to the hosted version of the API: https://nc-news-eszter.herokuapp.com/api.

## The Project
Northcoders News API aims to mimick a real world backend service, such as reddit. It was built using Node.js and has a PSQL database. Knex.js was used to interact with the database and build queries. The API was built using Express. Test Driven Development was utilised throughout the project, using Jest and SuperTest.

The data is divided into four groups: topics, articles, users and comments. These are stored in separate tables and are accessed through their own controller and model components.

Northcoders News is a RESTful API with the following endpoints available:
- GET /api
- GET /api/topics
- GET /api/users
- GET /api/users/:username
- GET /api/articles
- GET /api/articles/:article_id
- GET /api/artciles/:article_id/comments

- PATCH /api/articles/article_id
- PATCH /api/comments/:comment_id

- POST /api/topics
- POST /api/users
- POST /api/articles
- POST /api/articles/:article_id/comments

- DELETE /api/articles/:article_id
- DELETE /api/comments/:comment_id

GET /api/articles endpoint accepts queries:
- sort_by: sorts the articles by any valid column (defaults to date)
- order: ascending or descending (default)
- limit: limits the number of responses (defaults to 10)
- p (page): specifies the page at which to start
- author: filters the articles by the username specified in the query
- topic: filters the articles by the topic specified in the query

GET /api/articles/:article_id/comments endpoint accepts queries:
- sort_by
- order
- limit
- p

## Instructions

- Clone the project: run `git@github.com:Eszter-T/northcoders-news---backend.git` in your terminal. 
- npm install: After opening the project with Visual Studio Code run `npm install` to install the project's dependencies. 
- Seed the database: To seed you local database run `npm seed:prod`. 
- Tests can be run with the command `npm test`.

These are the minimum versions needed to run the project:
- Node.js: v15.5.1
- Postgres: ^8.5.1
- Express: ^4.17.1
- Knex: ^0.95.1
- Jest: ^26.6.3
- SuperTest: ^6.1.3

To run the project, a knexfile.js (which contains all of the configuration for the database) is needed. The knexfile should be added to the .gitignore as it contains your postgres username and password (for linux users only). For more information please visit: http://knexjs.org/#knexfile.

Here is an example:

```js
const { DB_URL } = process.env;
const ENV = process.env.NODE_ENV || "development";
const baseConfig = {
  client: "pg",
  migrations: {
    directory: "./db/migrations",
  },
  seeds: {
    directory: "./db/seeds",
  },
};
const customConfig = {
  development: {
    connection: {
      database: "nc_news",
      // for linux
      // user: "username",
      // password: "password"
    },
  },
  test: {
    connection: {
      database: "nc_news_test",
      // for linux
      // user: "username",
      // password: "password"
    },
  },
  production: {
    connection: {
      connectionString: DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
};
module.exports = { ...customConfig[ENV], ...baseConfig };
```

