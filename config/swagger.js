import swaggerJSDoc from 'swagger-jsdoc';
import { SERVER_URL } from './env.js';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Subscription Tracker API',
        version: '1.0.0',
        description: 'API documentation for the Subscription Tracker backend.',
    },
    servers: [
        {
            url: SERVER_URL || 'http://localhost:5500',
            description: 'Current server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: 'USER_ID',
                    },
                    name: {
                        type: 'string',
                        example: 'John Doe',
                    },
                    email: {
                        type: 'string',
                        example: 'john@example.com',
                    },
                    createdAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                    updatedAt: {
                        type: 'string',
                        format: 'date-time',
                    },
                },
            },
            AuthResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: true,
                    },
                    message: {
                        type: 'string',
                        example: 'User signed in successfully',
                    },
                    data: {
                        type: 'object',
                        properties: {
                            token: {
                                type: 'string',
                                example: 'JWT_TOKEN',
                            },
                            user: {
                                $ref: '#/components/schemas/User',
                            },
                        },
                    },
                },
            },
            Subscription: {
                type: 'object',
                properties: {
                    _id: {
                        type: 'string',
                        example: 'SUBSCRIPTION_ID',
                    },
                    name: {
                        type: 'string',
                        example: 'Javascript Mastery Elite Membership',
                    },
                    price: {
                        type: 'number',
                        example: 139,
                    },
                    currency: {
                        type: 'string',
                        enum: ['USD', 'EUR', 'GBP'],
                        example: 'USD',
                    },
                    frequency: {
                        type: 'string',
                        enum: ['daily', 'weekly', 'monthly', 'yearly'],
                        example: 'monthly',
                    },
                    category: {
                        type: 'string',
                        enum: [
                            'sports',
                            'news',
                            'entertainment',
                            'lifestyle',
                            'technology',
                            'finance',
                            'politics',
                            'other',
                        ],
                        example: 'entertainment',
                    },
                    paymentMethod: {
                        type: 'string',
                        example: 'Credit Card',
                    },
                    status: {
                        type: 'string',
                        enum: ['active', 'cancelled', 'expired'],
                        example: 'active',
                    },
                    startDate: {
                        type: 'string',
                        format: 'date-time',
                        example: '2025-01-20T00:00:00.000Z',
                    },
                    renewalDate: {
                        type: 'string',
                        format: 'date-time',
                    },
                    user: {
                        type: 'string',
                        example: 'USER_ID',
                    },
                },
            },
            ErrorResponse: {
                type: 'object',
                properties: {
                    success: {
                        type: 'boolean',
                        example: false,
                    },
                    error: {
                        type: 'string',
                        example: 'Something went wrong',
                    },
                },
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;