jest.setTimeout(20000); 

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');

describe('Rendu API', () => {
  let server;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/testDB');
    server = app.listen(4001); 
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await server.close();
  });

  test('GET /rendus should return status 200 and array', async () => {
    const res = await request(server).get('/rendus');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});
