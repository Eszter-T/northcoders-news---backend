process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const { dbConnection } = require('../db/dbConnection');

beforeEach(() => {
    dbConnection.seed.run();
})

afterAll(() => {
    dbConnection.destroy();
});

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
  });
});