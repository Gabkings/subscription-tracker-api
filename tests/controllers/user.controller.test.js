import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockNext, createMockResponse } from '../helpers/http.js';

const selectMock = vi.fn();

vi.mock('../../models/user.model.js', () => ({
    default: {
        find: vi.fn(),
        findById: vi.fn(),
    },
}));

const User = await import('../../models/user.model.js');
const { getUsers, getUser } = await import('../../controllers/user.controller.js');

describe('user.controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('getUsers', () => {
        it('returns all users without passwords', async () => {
            const users = [
                {
                    _id: 'USER_ID_1',
                    name: 'John Doe',
                    email: 'john@example.com',
                },
            ];

            selectMock.mockResolvedValue(users);
            User.default.find.mockReturnValue({
                select: selectMock,
            });

            const req = {};
            const res = createMockResponse();
            const next = createMockNext();

            await getUsers(req, res, next);

            expect(User.default.find).toHaveBeenCalledOnce();
            expect(selectMock).toHaveBeenCalledWith('-password');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: users,
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('passes errors to next', async () => {
            const error = new Error('Database error');

            selectMock.mockRejectedValue(error);
            User.default.find.mockReturnValue({
                select: selectMock,
            });

            const req = {};
            const res = createMockResponse();
            const next = createMockNext();

            await getUsers(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
        });
    });

    describe('getUser', () => {
        it('returns a user by id without password', async () => {
            const user = {
                _id: 'USER_ID',
                name: 'John Doe',
                email: 'john@example.com',
            };

            selectMock.mockResolvedValue(user);
            User.default.findById.mockReturnValue({
                select: selectMock,
            });

            const req = {
                params: {
                    id: 'USER_ID',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await getUser(req, res, next);

            expect(User.default.findById).toHaveBeenCalledWith('USER_ID');
            expect(selectMock).toHaveBeenCalledWith('-password');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: user,
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('passes a 404 error to next when user is not found', async () => {
            selectMock.mockResolvedValue(null);
            User.default.findById.mockReturnValue({
                select: selectMock,
            });

            const req = {
                params: {
                    id: 'MISSING_USER_ID',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await getUser(req, res, next);

            expect(next).toHaveBeenCalledOnce();

            const error = next.mock.calls[0][0];

            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe('User not found');
            expect(error.statusCode).toBe(404);
        });
    });
});