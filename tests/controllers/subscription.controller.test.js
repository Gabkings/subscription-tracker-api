import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockNext, createMockResponse } from '../helpers/http.js';

vi.mock('../../config/env.js', () => ({
    SERVER_URL: 'http://localhost:5500',
}));

vi.mock('../../config/upstash.js', () => ({
    workflowClient: {
        trigger: vi.fn(),
    },
}));

vi.mock('../../models/subscription.model.js', () => ({
    default: {
        create: vi.fn(),
        find: vi.fn(),
    },
}));

const Subscription = await import('../../models/subscription.model.js');
const { workflowClient } = await import('../../config/upstash.js');
const {
    createSubscription,
    getUserSubscriptions,
} = await import('../../controllers/subscription.controller.js');

describe('subscription.controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('createSubscription', () => {
        it('creates a subscription and triggers workflow', async () => {
            const subscription = {
                id: 'SUBSCRIPTION_ID',
                _id: 'SUBSCRIPTION_ID',
                name: 'Test Subscription',
                user: 'USER_ID',
            };

            Subscription.default.create.mockResolvedValue(subscription);
            workflowClient.trigger.mockResolvedValue({
                workflowRunId: 'WORKFLOW_RUN_ID',
            });

            const req = {
                body: {
                    name: 'Test Subscription',
                    price: 10,
                },
                user: {
                    _id: 'USER_ID',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await createSubscription(req, res, next);

            expect(Subscription.default.create).toHaveBeenCalledWith({
                name: 'Test Subscription',
                price: 10,
                user: 'USER_ID',
            });
            expect(workflowClient.trigger).toHaveBeenCalledWith({
                url: 'http://localhost:5500/api/v1/workflows/subscription/reminder',
                body: {
                    subscriptionId: 'SUBSCRIPTION_ID',
                },
                headers: {
                    'content-type': 'application/json',
                },
                retries: 0,
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: {
                    subscription,
                    workflowRunId: 'WORKFLOW_RUN_ID',
                },
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('passes errors to next', async () => {
            const error = new Error('Create failed');

            Subscription.default.create.mockRejectedValue(error);

            const req = {
                body: {
                    name: 'Test Subscription',
                },
                user: {
                    _id: 'USER_ID',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await createSubscription(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getUserSubscriptions', () => {
        it('returns subscriptions for the authenticated owner', async () => {
            const subscriptions = [
                {
                    _id: 'SUBSCRIPTION_ID',
                    name: 'Test Subscription',
                    user: 'USER_ID',
                },
            ];

            Subscription.default.find.mockResolvedValue(subscriptions);

            const req = {
                user: {
                    id: 'USER_ID',
                },
                params: {
                    id: 'USER_ID',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await getUserSubscriptions(req, res, next);

            expect(Subscription.default.find).toHaveBeenCalledWith({
                user: 'USER_ID',
            });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: subscriptions,
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('passes a 401 error when user is not account owner', async () => {
            const req = {
                user: {
                    id: 'USER_ID',
                },
                params: {
                    id: 'OTHER_USER_ID',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await getUserSubscriptions(req, res, next);

            expect(next).toHaveBeenCalledOnce();

            const error = next.mock.calls[0][0];

            expect(error.message).toBe('You are not the owner of this account');
            expect(error.status).toBe(401);
        });
    });
});