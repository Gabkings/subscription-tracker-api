import { Router} from 'express';
import { sendReminders } from '../controllers/workflow.controller.js'

const workflowRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Workflows
 *   description: Workflow and reminder endpoints
 */

/**
 * @swagger
 * /api/v1/workflows/subscription/reminder:
 *   post:
 *     summary: Trigger subscription reminder workflow
 *     tags: [Workflows]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscriptionId
 *             properties:
 *               subscriptionId:
 *                 type: string
 *                 example: SUBSCRIPTION_ID
 *     responses:
 *       200:
 *         description: Reminder workflow processed successfully
 */
workflowRouter.post('/subscription/reminder', sendReminders);

export default workflowRouter;