import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../controllers/auth.controller.js', () => ({
    signUp: vi.fn((_req, res) => res.status(201).json({ route: 'sign-up' })),
    signIn: vi.fn((_req, res) => res.status(200).json({ route: 'sign-in' })),
    signOut: vi.fn((_req, res) => res.status(200).json({ route: 'sign-out' })),
}));

const authRouter = await import('../../routes/auth.router.js');
const authController = await import('../../controllers/auth.controller.js');

const createApp = () => {
    const app = express();

    app.use(express.json());
    app.use('/api/v1/auth', authRouter.default);

    return app;
};

describe('auth.router', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('POST /api/v1/auth/sign-up calls signUp controller', async () => {
        const app = createApp();

        const response = await request(app)
            .post('/api/v1/auth/sign-up')
            .send({
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({ route: 'sign-up' });
        expect(authController.signUp).toHaveBeenCalledOnce();
    });

    it('POST /api/v1/auth/sign-in calls signIn controller', async () => {
        const app = createApp();

        const response = await request(app)
            .post('/api/v1/auth/sign-in')
            .send({
                email: 'john@example.com',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ route: 'sign-in' });
        expect(authController.signIn).toHaveBeenCalledOnce();
    });

    it('POST /api/v1/auth/sign-out calls signOut controller', async () => {
        const app = createApp();

        const response = await request(app).post('/api/v1/auth/sign-out');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ route: 'sign-out' });
        expect(authController.signOut).toHaveBeenCalledOnce();
    });
});