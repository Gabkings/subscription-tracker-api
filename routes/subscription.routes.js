import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js'
import {
  createSubscription,
  getUserSubscriptions,
} from '../controllers/subscription.controller.js'

const subscriptionRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Subscriptions
 *   description: Subscription management endpoints
 */

/**
 * @swagger
 * /api/v1/subscriptions:
 *   get:
 *     summary: Get all subscriptions
 *     tags: [Subscriptions]
 *     responses:
 *       200:
 *         description: List of subscriptions
 */
subscriptionRouter.get('/', (req, res) => res.send({ title: 'GET all subscriptions' }));

/**
 * @swagger
 * /api/v1/subscriptions:
 *   post:
 *     summary: Create a subscription
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - frequency
 *               - category
 *               - paymentMethod
 *               - startDate
 *             properties:
 *               name:
 *                 type: string
 *                 example: Javascript Mastery Elite Membership
 *               price:
 *                 type: number
 *                 example: 139
 *               currency:
 *                 type: string
 *                 enum: [USD, EUR, GBP]
 *                 example: USD
 *               frequency:
 *                 type: string
 *                 enum: [daily, weekly, monthly, yearly]
 *                 example: monthly
 *               category:
 *                 type: string
 *                 enum: [sports, news, entertainment, lifestyle, technology, finance, politics, other]
 *                 example: entertainment
 *               paymentMethod:
 *                 type: string
 *                 example: Credit Card
 *               startDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2025-01-20T00:00:00.000Z
 *     responses:
 *       201:
 *         description: Subscription created successfully
 *       401:
 *         description: Unauthorized
 */
subscriptionRouter.post('/', authorize, createSubscription);



/**
 * @swagger
 * /api/v1/subscriptions/{id}:
 *   get:
 *     summary: Get subscription details
 *     tags: [Subscriptions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Subscription ID
 *     responses:
 *       200:
 *         description: Subscription details
 */

subscriptionRouter.get('/upcoming-renewals', (req, res) => res.send({ title: 'GET upcoming renewals' }));

subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'GET subscription details' }));



subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE subscription' }));

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE subscription' }));

/**
 * @swagger
 * /api/v1/subscriptions/user/{id}:
 *   get:
 *     summary: Get subscriptions for a specific user
 *     tags: [Subscriptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User subscriptions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subscription'
 *       401:
 *         description: Unauthorized
 */
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', (req, res) => res.send({ title: 'CANCEL subscription' }));


export default subscriptionRouter;