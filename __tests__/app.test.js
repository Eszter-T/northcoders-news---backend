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
    test('INVALID METHODS - status:405', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]('/api/users/butter_bridge')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/articles', () => {
    test('GET responds with an array of article objects, each article obj has comment_count property', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(12);
        expect(articles[0]).toHaveProperty('comment_count', "13");
      });
    });
    test('QUERY articles are sorted by date by default',() => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: {articles} }) => {
          expect(articles).toBeSortedBy('created_at', {descending: true});
      });
    });
    test('QUERY articles can be sorted by any valid column', () => {
      return request(app)
      .get('/api/articles?sort_by=topic')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).toBeSortedBy('topic', {descending: true});
      });
    });
    test('QUERY articles are ordered in descending order by default', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).toBeSortedBy('created_at', {descending: true})
      });
    });
    test('QUERY -filters the articles by author', () => {
      return request(app)
      .get('/api/articles?author=icellusedkars')
      .expect(200)
      .then(({body: {articles}}) => {
        
        expect(articles[0].author).toBe('icellusedkars');
      });
    });
    test('QUERY -filters the articles by topic', () => {
      return request(app)
      .get('/api/articles?topic=mitch')
      .expect(200)
      .then(({body: {articles}}) => {
        
        expect(articles[0].topic).toBe('mitch');
      });
    });
    test('INVALID METHODS - status:405', () => {
      const invalidMethods = ['put', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]('/api/articles')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
    test('GET article by article_id, status: 200', () => {
      return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({body: { article }}) => {
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
    test('INVALID METHODS - status:405', () => {
      const invalidMethods = ['put', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]('/api/articles/1')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Method not allowed');
          });
      });
      return Promise.all(methodPromises);
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
    test('GET responds with an array of comments for the given article', () => {
      return request(app)
      .get('/api/articles/5/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(Array.isArray(comments)).toBe(true);
        expect(comments).toHaveLength(2);
        expect(comments[0]).toMatchObject(
          {
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String)
          }
        );
      });
    });
    test('GET handles articles with no comments', () => {
      return request(app)
      .get('/api/articles/2/comments')
      .expect(200)
      .then(({ body: { comments }}) => {
        expect(comments).toHaveLength(0);
      });
    });
    test('comments are sorted by created_at by default',() => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body: { comments }}) => {
          expect(comments).toBeSortedBy('created_at', {descending: true});
      });
    });
    test('QUERY comments are sorted by author', () => {
      return request(app)
      .get('/api/articles/1/comments?sort_by=author')
      .expect(200)
      .then(({body: {comments}}) => {
        expect(comments).toBeSortedBy('author', {descending: true});
      });
    });
    test('QUERY comments ordered in descending order by default', () => {
      return request(app)
      .get('/api/articles/1/comments?order=desc')
      .expect(200)
      .then(({body: {comments}}) => {
        expect(comments).toBeSortedBy('created_at', {descending: true})
      });
    });
    test('Status 404: article_id valid but non-existent', () => {
      return request(app)
      .get('/api/articles/999/comments')
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe('Article_id not found');
      });
    });
    test('INVALID METHODS - status:405', () => {
      const invalidMethods = ['put', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]('/api/articles/1/comments')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe.only('/comments', () => {
    test('PATCH responds with the updated comment', () => {
      return request(app)
      .patch('/api/comments/1')
      .send({ inc_votes: 1})
      .expect(200)
      .then(({ body: {comment}}) => {
        expect(comment).toEqual({
          comment_id: 1,
          author: 'butter_bridge',
          article_id: 9,
          votes: 17,
          created_at: '2017-11-22T12:36:03.389Z',
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!"
        });
      });
    });
  });
});