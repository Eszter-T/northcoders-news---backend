process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const { dbConnection } = require('../db/dbConnection');

beforeEach(() => dbConnection.seed.run());
afterAll(() => dbConnection.destroy());


describe('/api', () => {
  test('GET endpoints', () => {
    return request(app)
    .get('/api')
    .expect(200)
    .then(( { body } ) => {
      expect(typeof body).toBe('object');
      expect(body).toHaveProperty('GET /api');
      expect(body).toHaveProperty('GET /api/topics');
      expect(body).toHaveProperty('GET /api/articles');
      expect(body).toHaveProperty('GET /api/articles/:article_id');
      expect(body).toHaveProperty('GET /api/articles/:article_id/comments');
      expect(body).toHaveProperty('GET /api/users/:username');
      expect(body).toHaveProperty('PATCH /api/articles/:article_id');
      expect(body).toHaveProperty('PATCH /api/comments/:comment_id');
      expect(body).toHaveProperty('POST /api/articles/:article_id/comments');
      expect(body).toHaveProperty('DELETE /api/comments/:comment_id');
      expect(body).toHaveProperty('DELETE /api/articles/:article_id');
    });
  });
  describe('/topics', () => {
    test('GET reponds with an array of topic objects', () => {
      return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: {topics} }) => {
         expect(topics.length).toBe(3);
         expect(topics[0]).toHaveProperty('slug');
         expect(topics[0]).toHaveProperty('description');
      });
    });
    test('POST responds with the posted topic', () => {
      return request(app)
      .post('/api/topics')
      .send({ description: 'Thoughts about Mondays', slug: 'Monday'})
      .expect(201)
      .then(({ body: { topic } }) => {
        expect(topic).toEqual({ description: 'Thoughts about Mondays', slug: 'Monday'});
      });
    });
    test('ERROR- Status 400 - malformed body/missing required fields', () => {
      return request(app)
      .post('/api/topics')
      .send({})
      .expect(400)
      .then(({ body: {msg}}) => {
        expect(msg).toBe('Bad request');
      });
    });
    test('ERROR - Status 400 - failing schema validation', () => {
      return request(app)
      .post('/api/topics')
      .send({ username: 'bigboy' })
      .expect(400)
      .then(({ body: {msg} }) => {
        expect(msg).toBe('Bad request');
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
         expect(typeof user).toBe('object');
         expect(user).toEqual({
          username: 'butter_bridge',
          name: 'jonny',
          avatar_url: 'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg',
        });
      });
    });
    test('ERROR - user that does not exist, status: 404 not found', () => {
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
    test('GET responds with an array of user objects', () => {
      return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: {users}}) => {
        expect(users.length).toBe(4);
        expect(users[0]).toHaveProperty('username');
        expect(users[0]).toHaveProperty('name');
        expect(users[0]).toHaveProperty('avatar_url');
      });
    });
    test('INVALID METHODS - status:405', () => {
      const invalidMethods = ['patch', 'put', 'delete'];
      const methodPromises = invalidMethods.map((method) => {
        return request(app)
          [method]('/api/users')
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).toBe('Method not allowed');
          });
      });
      return Promise.all(methodPromises);
    });
  });
    test('POST responds with the posted user', () => {
      return request(app)
      .post('/api/users')
      .send({
        username: 'bookworm',
        name: 'george',
        avatar_url: 'https://www.thebestbookstoread.com/my-books/uploads/2020/08/GoT.jpg'
      })
      .expect(201)
      .then(({ body: { user } }) => {
        expect(user).toEqual({
          username: 'bookworm',
          name: 'george',
          avatar_url: 'https://www.thebestbookstoread.com/my-books/uploads/2020/08/GoT.jpg'
        });
      });
    });
    test('ERROR- Status 400 - malformed body/missing required fields', () => {
      return request(app)
      .post('/api/users')
      .send({})
      .expect(400)
      .then(({ body: {msg}}) => {
        expect(msg).toBe('Bad request');
      });
    });
    test('ERROR - Status 400 - failing schema validation', () => {
      return request(app)
      .post('/api/topics')
      .send({ user_rating: 10 })
      .expect(400)
      .then(({ body: {msg} }) => {
        expect(msg).toBe('Bad request');
      });
    });
  describe.only('/articles', () => {
    test('GET responds with an array of article objects, each article obj has comment_count property', () => {
      return request(app)
      .get('/api/articles?limit=12')
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(Array.isArray(articles)).toBe(true);
        expect(articles).toHaveLength(12);
        expect(articles[0]).toHaveProperty('comment_count', "13");
      });
    });
    test('GET QUERY responds with a limited number of articles (defaults to 10)', () => {
      return request(app)
      .get('/api/articles?limit=8')
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles.length).toBe(8);
      });
    });
    test('GET QUERY specifies the page at which to start', () => {
      return request(app)
      .get('/api/articles?p=2')
      .expect(200)
      .then(({ body: { articles }}) => {
        expect(articles[0].article_id).toBe(11);
      });
    });
    test('GET has a total count property, displaying the total number of articles', () => {
      return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty('total_count');
        expect(body.total_count).toBe("12");
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
    test('ERROR - Status 404 - non-existent topic in query', () => {
      return request(app)
      .get('/api/articles?topic=not-a-topic')
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).toBe('Topic not found')
      });
    });
    test('POST responds with the posted article', () => {
      return request(app)
      .post('/api/articles')
      .send({
        title: 'My favourite type of cat',
        topic: 'cats',
        author: 'butter_bridge',
        body: 'Smelly cat. The best!!!',
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article).toEqual(
          {
            article_id: 13,
            title: 'My favourite type of cat',
            body: 'Smelly cat. The best!!!',
            votes: 0,
            topic: 'cats',
            author: 'butter_bridge',
            created_at: expect.any(String)
          }
        );
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
        expect(article).toMatchObject(
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
        expect(article.comment_count).toBe("13");
      });
    });
    test('DELETE responds with status 204 and no content', () => {
      return request(app)
      .delete('/api/articles/2')
      .expect(204)
      .then(() => {
        return dbConnection.select("*").from("articles").where("article_id", 2);
      })
      .then((articles) => {
        expect(articles).toHaveLength(0);
      });
    });
    test('DELETEs an article referenced by the comments table', () => {
      return request(app)
      .delete('/api/articles/1')
      .expect(204)
      .then(() => {
        return dbConnection.select("*").from("articles").where("article_id", 1);
      })
      .then((articles) => {
        expect(articles).toHaveLength(0);
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
      const invalidMethods = ['put'];
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
        expect(article).toEqual(
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
    test('POST responds with the posted comment', () => {
      return request(app)
      .post('/api/articles/9/comments')
      .send({username: 'butter_bridge', body: 'Thought about it, they are not, indeed.'})
      .expect(201)
      .then(({ body: { comment } }) => {
        expect(comment).toEqual(
          {
            comment_id: 19,
            body: 'Thought about it, they are not, indeed.',
            article_id: 9,
            author: 'butter_bridge',
            votes: 0,
            created_at: expect.any(String)
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
    test('GET QUERY responds with a limited number of comments (defaults to 10)', () => {
      return request(app)
      .get('/api/articles/1/comments?limit=8')
      .expect(200)
      .then(({ body: { comments }}) => {
        expect(comments.length).toBe(8);
      });
    });
    test('GET QUERY specifies the page at which to start', () => {
      return request(app)
      .get('/api/articles/1/comments?p=2')
      .expect(200)
      .then(({ body: { comments }}) => {
        expect(comments[0].comment_id).toBe(12);
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
  describe('/comments', () => {
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
    test('DELETE responds with status 204 and no content', () => {
      return request(app)
      .delete('/api/comments/2')
      .expect(204)
      .then(() => {
        return dbConnection.select("*").from("comments").where("comment_id", 2);
      })
      .then((comments) => {
        expect(comments).toHaveLength(0);
      });
    });
  });
});