import request from 'supertest';
import app from '../app'

describe("Oracle api test", () => {

    it('index page test', async () => {
        const res = await request(app).get('/');
        expect(res.text).toBe('MVL Oracle API');
    })

    it('Get MVL price correctly', async () => {
        const res = await request(app)
        .get('/v1/oracle/mvl');

        expect(res.statusCode).toBe(200);
    })

});