import express from 'express';
import request from 'supertest';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../controllers/workflow.controller.js', () => ({
    sendReminders: vi.fn((_req, res) => res.status(200).json({ route: 'send-reminders' })),
}));

const workflowRouter = await import('../../routes/workflow.routes.js');
const workflowController = await import('../../controllers/workflow.controller.js');

const createApp = () => {
    const app = express();

    app.use(express.json());
    app.use('/api/v1/workflows', workflowRouter.default);

    return app;
};

describe('workflow.routes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('POST /api/v1/workflows/subscription/reminder calls sendReminders controller', async () => {
        const app = createApp();

        const response = await request(app)
            .post('/api/v1/workflows/subscription/reminder')
            .send({
                subscriptionId: 'SUBSCRIPTION_ID',
            });

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            route: 'send-reminders',
        });
        expect(workflowController.sendReminders).toHaveBeenCalledOnce();
    });
});