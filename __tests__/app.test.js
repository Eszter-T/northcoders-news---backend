process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const { dbConnection } = require('../db/dbConnection');

beforeEach(() => dbConnection.seed.run());
afterAll(() => dbConnection.destroy());


describe('/api', () => {
  describe('/topics', () => {
    test('GET Status: 200', () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: {topics} }) => {
         expect(topics.length).toBe(3);
         expect(topics[0]).toHaveProperty('slug');
         expect(topics[0]).toHaveProperty('description');
      });
    });
    test('INVALID METHODS - status:405', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]('/api/topics')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/users', () => {
    test('GET user by username, status: 200', () => {
      return request(app)
      .get('/api/users/butter_bridge')
      .expect(200)
      .then(({ body: {user} }) => {
         expect(typeof user[0]).toBe('object');
         expect(user[0]).toEqual({
          username: 'butter_bridge',
          name: 'jonny',
          avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        });
      });
    });
    test('GET - user that does not exist, status: 404 not found', () => {
      return request(app)
      .get('/api/users/NotAUserYet')
      .expect(404)
      .then(({body: {msg} }) => {
        expect(msg).toBe('User not found');
      });
    });
  });
  describe.only('/articles', () => {
    test('articles are sorted in ascending title order by default',() => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: {articles} }) => {
          expect(articles).toBeSortedBy('title', 'asc');
      });
    });
    test('status 200 - each article obj has comment_count property', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles }}) => {
        //console.log(articles)
        expect(articles[0]).toHaveProperty('comment_count', "1");
      });
    });
    test('GET article by article_id, status: 200', () => {
      return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({body: { article }}) => {
        //console.log(article)
        expect(Array.isArray(article)).toBe(true);
        expect(article[0]).toMatchObject(
          {
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String)
          }
        );
        expect(article[0].comment_count).toBe("13");
      });
    });
    test('GET - article that does not exist, status: 404 not found', () => {
      return request(app)
      .get('/api/articles/999')
      .expect(404)
      .then(({body: {msg} }) => {
        expect(msg).toBe('Article not found');
      });
    });
    test('PATCH responds with the updated article', () => {
      return request(app)
      .patch('/api/articles/1')
      .send({ inc_votes : 1 })
      .expect(200)
      .then(({ body:  { article }}) => {
        expect(article[0]).toEqual(
          {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: '2018-11-15T12:21:54.171Z',
            votes: 101,
            comment_count: '13'
          }
        );
      });
    });
    test('POST reponds with the posted comment', () => {
      return request(app)
      .post('/api/articles/9/comments')
      .send({username: 'butter_bridge', body: 'Thought about it, they are not, indeed.'})
      .expect(201)
      .then(({ body: { comment } }) => {
        delete comment[0]["created_at"];
        expect(comment[0]).toEqual(
          {
            comment_id: 19,
            body: 'Thought about it, they are not, indeed.',
            article_id: 9,
            author: 'butter_bridge',
            votes: 0
          }
        );
      });
    });
  });
});