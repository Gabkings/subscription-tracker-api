import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../middlewares/auth.middleware.js', () => ({
    default: vi.fn((req, _res, next) => {
        req.user = {
            id: 'USER_ID',
        };
        next();
    }),
}));

vi.mock('../../controllers/user.controller.js', () => ({
    getUsers: vi.fn((_req, res) => res.status(200).json({ route: 'get-users' })),
    getUser: vi.fn((_req, res) => res.status(200).json({ route: 'get-user' })),
}));

const userRouter = await import('../../routes/user.router.js');
const authorize = await import('../../middlewares/auth.middleware.js');
const userController = await import('../../controllers/user.controller.js');

const createApp = () => {
    const app = express();

    app.use(express.json());
    app.use('/api/v1/users', userRouter.default);

    return app;
};

describe('user.router', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('GET /api/v1/users calls getUsers controller', async () => {
        const app = createApp();

        const response = await request(app).get('/api/v1/users');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ route: 'get-users' });
        expect(userController.getUsers).toHaveBeenCalledOnce();
    });

    it('GET /api/v1/users/:id uses authorize and calls getUser controller', async () => {
        const app = createApp();

        const response = await request(app).get('/api/v1/users/USER_ID');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ route: 'get-user' });
        expect(authorize.default).toHaveBeenCalledOnce();
        expect(userController.getUser).toHaveBeenCalledOnce();
    });

    it('POST /api/v1/users returns placeholder create response', async () => {
        const app = createApp();

        const response = await request(app)
            .post('/api/v1/users')
            .send({
                name: 'John Doe',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: 'CREATE new user',
        });
    });

    it('PUT /api/v1/users/:id returns placeholder update response', async () => {
        const app = createApp();

        const response = await request(app)
            .put('/api/v1/users/USER_ID')
            .send({
                name: 'Updated Name',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: 'UPDATE user',
        });
    });

    it('DELETE /api/v1/users/:id returns placeholder delete response', async () => {
        const app = createApp();

        const response = await request(app).delete('/api/v1/users/USER_ID');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: 'DELETE user',
        });
    });
});