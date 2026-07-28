import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../middlewares/auth.middleware.js', () => ({
    default: vi.fn((req, _res, next) => {
        req.user = {
            id: 'USER_ID',
            _id: 'USER_ID',
        };
        next();
    }),
}));

vi.mock('../../controllers/subscription.controller.js', () => ({
    createSubscription: vi.fn((_req, res) => res.status(201).json({ route: 'create-subscription' })),
    getUserSubscriptions: vi.fn((_req, res) => res.status(200).json({ route: 'get-user-subscriptions' })),
}));

const subscriptionRouter = await import('../../routes/subscription.routes.js');
const authorize = await import('../../middlewares/auth.middleware.js');
const subscriptionController = await import('../../controllers/subscription.controller.js');

const createApp = () => {
    const app = express();

    app.use(express.json());
    app.use('/api/v1/subscriptions', subscriptionRouter.default);

    return app;
};

describe('subscription.routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('GET /api/v1/subscriptions returns placeholder list response', async () => {
        const app = createApp();

        const response = await request(app).get('/api/v1/subscriptions');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: 'GET all subscriptions',
        });
    });

    it('POST /api/v1/subscriptions uses authorize and calls createSubscription controller', async () => {
        const app = createApp();

        const response = await request(app)
            .post('/api/v1/subscriptions')
            .send({
                name: 'Test Subscription',
                price: 10,
            });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            route: 'create-subscription',
        });
        expect(authorize.default).toHaveBeenCalledOnce();
        expect(subscriptionController.createSubscription).toHaveBeenCalledOnce();
    });

    it('GET /api/v1/subscriptions/user/:id uses authorize and calls getUserSubscriptions controller', async () => {
        const app = createApp();

        const response = await request(app).get('/api/v1/subscriptions/user/USER_ID');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            route: 'get-user-subscriptions',
        });
        expect(authorize.default).toHaveBeenCalledOnce();
        expect(subscriptionController.getUserSubscriptions).toHaveBeenCalledOnce();
    });

    it('PUT /api/v1/subscriptions/:id returns placeholder update response', async () => {
        const app = createApp();

        const response = await request(app)
            .put('/api/v1/subscriptions/SUBSCRIPTION_ID')
            .send({
                name: 'Updated Subscription',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: 'UPDATE subscription',
        });
    });

    it('DELETE /api/v1/subscriptions/:id returns placeholder delete response', async () => {
        const app = createApp();

        const response = await request(app).delete('/api/v1/subscriptions/SUBSCRIPTION_ID');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: 'DELETE subscription',
        });
    });

    it('PUT /api/v1/subscriptions/:id/cancel returns placeholder cancel response', async () => {
        const app = createApp();

        const response = await request(app).put('/api/v1/subscriptions/SUBSCRIPTION_ID/cancel');

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            title: 'CANCEL subscription',
        });
    });
});