const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../app');

let token;

beforeAll(async () => {
    // Login to get a token
    const res = await request(app).post('/login').send({});
    token = res.body.token;
});

afterAll(async () => {
    // Close the MongoDB connection
    await mongoose.connection.close();
});

describe('Artist API', () => {
    it('should create a new artist', async () => {
        const res = await request(app)
            .post('/api/artists')
            .set('Authorization', token)
            .send({ name: 'Artist 1', genre: 'Rock' });
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toBe('Artist 1');
    }, 30000);

    it('should get all artists', async () => {
        const res = await request(app)
            .get('/api/artists')
            .set('Authorization', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    }, 30000);

    it('should return an error if required fields are missing', async () => {
        const res = await request(app)
            .post('/api/artists')
            .set('Authorization', token)
            .send({ genre: 'Rock' });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'Name is required.');
    }, 30000);

    it('should get an artist by ID', async () => {
        const createRes = await request(app)
            .post('/api/artists')
            .set('Authorization', token)
            .send({ name: 'Artist 2', genre: 'Pop' });
        const artistId = createRes.body._id;

        const res = await request(app)
            .get(`/api/artists/${artistId}`)
            .set('Authorization', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Artist 2');
        expect(res.body.genre).toBe('Pop');
    }, 30000);

    it('should return an error if artist ID does not exist', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        const res = await request(app)
            .get(`/api/artists/${nonExistentId}`)
            .set('Authorization', token);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Artist not found.');
    }, 30000);

    it('should update an artist', async () => {
        const createRes = await request(app)
            .post('/api/artists')
            .set('Authorization', token)
            .send({ name: 'Artist 3', genre: 'Jazz' });
        const artistId = createRes.body._id;

        const res = await request(app)
            .put(`/api/artists/${artistId}`)
            .set('Authorization', token)
            .send({ name: 'Updated Artist', genre: 'Classical' });
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Updated Artist');
        expect(res.body.genre).toBe('Classical');
    }, 30000);

    it('should return an error if updating a non-existent artist', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        const res = await request(app)
            .put(`/api/artists/${nonExistentId}`)
            .set('Authorization', token)
            .send({ name: 'Updated Artist', genre: 'Classical' });
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Artist not found.');
    }, 30000);

    it('should delete an artist', async () => {
        const createRes = await request(app)
            .post('/api/artists')
            .set('Authorization', token)
            .send({ name: 'Artist 4', genre: 'Hip-Hop' });
        const artistId = createRes.body._id;

        const res = await request(app)
            .delete(`/api/artists/${artistId}`)
            .set('Authorization', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Artist deleted successfully.');
    }, 30000);

    it('should return an error if deleting a non-existent artist', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011';
        const res = await request(app)
            .delete(`/api/artists/${nonExistentId}`)
            .set('Authorization', token);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toHaveProperty('message', 'Artist not found.');
    }, 30000);

    it('should return an error if unauthorized', async () => {
        const res = await request(app)
            .get('/api/artists')
            .set('Authorization', 'invalid-token');
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Unauthorized.');
    }, 30000);

    it('should return paginated artists', async () => {
        const res = await request(app)
            .get('/api/artists?page=1&limit=5')
            .set('Authorization', token);
        expect(res.statusCode).toEqual(200);
        expect(res.body.artists.length).toBeLessThanOrEqual(5);
        expect(res.body).toHaveProperty('totalPages');
        expect(res.body).toHaveProperty('currentPage', 1);
    }, 30000);
});