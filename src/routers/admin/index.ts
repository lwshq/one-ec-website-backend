import { Router } from "express";
import session from "express-session";
import config from "../../config/index";
import AdminController from "../../controllers/admin/adminController";
import apiKeyAuth from "../../middlewares/apiKey";
import AdminMiddleware from "../../middlewares/admin";

const adminRoute = Router();
const adminController = new AdminController();


/**
 * @swagger
 * tags:
 *   name: Admin Authentication
 *   description: This API will allow the user to log in to the system
 */
/**
 * @swagger
 * /api/v1/admin/authenticate:
 *   post:
 *     summary: Authentication API
 *     description: |
 *       This endpoint allows the admin to log in. It has two possible outcomes:
 *       1. If the device used by the admin is trusted, a token will be generated.
 *       2. If the device is not trusted, a verification code will be sent to the admin's email.
 *     tags: [Admin Authentication]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email is required
 *                 example: sampleemail@gmail.com
 *               password:
 *                 type: string
 *                 description: Password is required
 *                 example: pass123
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 response:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *       '401':
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 401
 */

adminRoute.post(
    "/authenticate",
    apiKeyAuth,
    adminController.auth
);

/**
 * @swagger
 * tags:
 *   name: Admin Auth Verification
 *   description: This API will allow the user to verify their log in
 */

export default adminRoute;