# Northcoders News API

Here is a link to the hosted version of the API: https://nc-news-eszter.herokuapp.com/api.

## The Project
Northcoders News API aims to mimick a real world backend service, such as reddit. It was built using Node.js and has a PSQL database. Knex.js was used to interact with the database and build queries. The API was built using Express. Test Driven Development was utilised throughout the project, using Jest and SuperTest.

## Instructions
To clone the project run `git clone git@github.com:Eszter-T/be-nc-news.git` in your terminal. After opening the project with Visual Studio Code run `npm install` to install the project's dependencies. To seed you local database run `npm seed:prod`. Tests can be run with the command `npm test`.
Knexfile...

These are the minimum versions needed to run the project:
- Node.js: v15.5.1
- PostgreSQL: psql (PostgreSQL) 12.6 (Ubuntu 12.6-0ubuntu0.20.04.1)
- Express: ^4.17.1
- Knex: ^0.95.1
- Jest: ^26.6.3
- SuperTest: ^6.1.3
