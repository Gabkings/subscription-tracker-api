import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createMockNext, createMockResponse } from '../helpers/http.js';

const sessionMock = {
    startTransaction: vi.fn(),
    commitTransaction: vi.fn(),
    abortTransaction: vi.fn(),
    endSession: vi.fn(),
};

vi.mock('mongoose', () => ({
    default: {
        startSession: vi.fn(),
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        genSalt: vi.fn(),
        hash: vi.fn(),
        compare: vi.fn(),
    },
}));

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn(),
    },
}));

vi.mock('../../config/env.js', () => ({
    JWT_SECRET: 'TEST_JWT_SECRET',
    JWT_EXPIRES_IN: '1d',
}));

vi.mock('../../models/user.model.js', () => ({
    default: {
        findOne: vi.fn(),
        create: vi.fn(),
    },
}));

const mongoose = await import('mongoose');
const bcrypt = await import('bcryptjs');
const jwt = await import('jsonwebtoken');
const User = await import('../../models/user.model.js');
const { signUp, signIn, signOut } = await import('../../controllers/auth.controller.js');

describe('auth.controller', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mongoose.default.startSession.mockResolvedValue(sessionMock);
        sessionMock.commitTransaction.mockResolvedValue();
        sessionMock.abortTransaction.mockResolvedValue();
    });

    describe('signUp', () => {
        it('creates a user and returns a JWT token', async () => {
            const createdUser = {
                _id: 'USER_ID',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'hashedPassword',
            };

            User.default.findOne.mockResolvedValue(null);
            bcrypt.default.genSalt.mockResolvedValue('salt');
            bcrypt.default.hash.mockResolvedValue('hashedPassword');
            User.default.create.mockResolvedValue([createdUser]);
            jwt.default.sign.mockReturnValue('JWT_TOKEN');

            const req = {
                body: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'plainPassword',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await signUp(req, res, next);

            expect(sessionMock.startTransaction).toHaveBeenCalledOnce();
            expect(User.default.findOne).toHaveBeenCalledWith({
                email: 'john@example.com',
            });
            expect(bcrypt.default.hash).toHaveBeenCalledWith('plainPassword', 'salt');
            expect(User.default.create).toHaveBeenCalledWith(
                [
                    {
                        name: 'John Doe',
                        email: 'john@example.com',
                        password: 'hashedPassword',
                    },
                ],
                {
                    session: sessionMock,
                },
            );
            expect(jwt.default.sign).toHaveBeenCalledWith(
                {
                    userId: 'USER_ID',
                },
                'TEST_JWT_SECRET',
                {
                    expiresIn: '1d',
                },
            );
            expect(sessionMock.commitTransaction).toHaveBeenCalledOnce();
            expect(sessionMock.endSession).toHaveBeenCalledOnce();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User created successfully',
                data: {
                    token: 'JWT_TOKEN',
                    user: createdUser,
                },
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('passes a 409 error when user already exists', async () => {
            User.default.findOne.mockResolvedValue({
                _id: 'EXISTING_USER_ID',
            });

            const req = {
                body: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'plainPassword',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await signUp(req, res, next);

            expect(sessionMock.abortTransaction).toHaveBeenCalledOnce();
            expect(sessionMock.endSession).toHaveBeenCalledOnce();
            expect(next).toHaveBeenCalledOnce();

            const error = next.mock.calls[0][0];

            expect(error.message).toBe('User already exists');
            expect(error.statusCode).toBe(409);
        });
    });

    describe('signIn', () => {
        it('signs in a user and returns a JWT token', async () => {
            const user = {
                _id: 'USER_ID',
                email: 'john@example.com',
                password: 'hashedPassword',
            };

            User.default.findOne.mockResolvedValue(user);
            bcrypt.default.compare.mockResolvedValue(true);
            jwt.default.sign.mockReturnValue('JWT_TOKEN');

            const req = {
                body: {
                    email: 'john@example.com',
                    password: 'plainPassword',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await signIn(req, res, next);

            expect(User.default.findOne).toHaveBeenCalledWith({
                email: 'john@example.com',
            });
            expect(bcrypt.default.compare).toHaveBeenCalledWith('plainPassword', 'hashedPassword');
            expect(jwt.default.sign).toHaveBeenCalledWith(
                {
                    userId: 'USER_ID',
                },
                'TEST_JWT_SECRET',
                {
                    expiresIn: '1d',
                },
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User signed in successfully',
                data: {
                    token: 'JWT_TOKEN',
                    user,
                },
            });
            expect(next).not.toHaveBeenCalled();
        });

        it('passes a 404 error when user is not found', async () => {
            User.default.findOne.mockResolvedValue(null);

            const req = {
                body: {
                    email: 'missing@example.com',
                    password: 'plainPassword',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await signIn(req, res, next);

            const error = next.mock.calls[0][0];

            expect(error.message).toBe('User not found');
            expect(error.statusCode).toBe(404);
        });

        it('passes a 401 error when password is invalid', async () => {
            User.default.findOne.mockResolvedValue({
                _id: 'USER_ID',
                email: 'john@example.com',
                password: 'hashedPassword',
            });
            bcrypt.default.compare.mockResolvedValue(false);

            const req = {
                body: {
                    email: 'john@example.com',
                    password: 'wrongPassword',
                },
            };
            const res = createMockResponse();
            const next = createMockNext();

            await signIn(req, res, next);

            const error = next.mock.calls[0][0];

            expect(error.message).toBe('Invalid password');
            expect(error.statusCode).toBe(401);
        });
    });

    describe('signOut', () => {
        it('returns a successful sign out response', async () => {
            const req = {};
            const res = createMockResponse();

            await signOut(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: 'User signed out successfully',
            });
        });
    });
});