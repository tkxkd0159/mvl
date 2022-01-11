import request from 'supertest';
import app from '../app'

describe("Oracle api test", () => {

    it('index page test', async () => {
        const res = await request(app).get('/');
        expect(res.text).toBe('MVL Oracle API');
    })

});