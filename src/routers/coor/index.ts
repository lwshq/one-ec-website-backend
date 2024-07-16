import { Router } from "express";
import config from "../../config/index";
import CoorController from "../../controllers/coor/coorController";
import apiKeyAuth from "../../middlewares/apiKey";
import CoorMiddleware from "../../middlewares/coop";

const coorRoute = Router();
const coorController = new CoorController();


/**
 * @swagger
 * /api/v1/coor/authenticate:
 *   post:
 *     summary: Authentication API
 *     description: |
 *       This endpoint allows the coordinator to log in.
 *     tags: [Coordinator Authentication]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
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

coorRoute.post(
    "/authenticate",
    apiKeyAuth,
    coorController.auth
);

/**
 * @swagger
 * /api/v1/coor/forgot:
 *   post:
 *     summary: Forgot Password API
 *     description: This endpoint allows a coordinator to request a password reset link to be sent to their registered email.
 *     tags: [Coordinator Authentication]
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
 *                 description: Registered email of the coor
 *                 example: sampleemail@gmail.com
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Password reset link sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset link sent successfully
 *                 response:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *       '400':
 *         description: Error sending password reset link
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error: Coordinator not found"
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 400
 */

coorRoute.post(
    "/forgot",
    apiKeyAuth,
    coorController.forgotPassword
)

/**
 * @swagger
 * /api/v1/coor/reset:
 *   post:
 *     summary: Reset Password API
 *     description: This endpoint allows an coor to reset their password using a token sent to their email.
 *     tags: [Coordinator Authentication]
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token received in the password reset email
 *                 example: dummytoken123
 *               newPassword:
 *                 type: string
 *                 description: New password
 *                 example: newSecurePassword123
 *             required:
 *               - token
 *               - newPassword
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *                 response:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *       '400':
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid or expired password reset token"
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 400
 */

coorRoute.post(
    "/reset",
    apiKeyAuth,
    coorController.resetPassword
)

/**
 * @swagger
 * /api/v1/coor/change-password:
 *   put:
 *     summary: Change Password API
 *     description: This endpoint allows a coor to change their password.
 *     tags: [Coordinator Authentication]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the coor
 *                 example: currentPassword123
 *               newPassword:
 *                 type: string
 *                 description: The new password for the coor
 *                 example: newSecurePassword123
 *               confirmPassword:
 *                 type: string
 *                 description: Confirm the new password
 *                 example: newSecurePassword123
 *             required:
 *               - currentPassword
 *               - newPassword
 *               - confirmPassword
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password changed successfully
 *                 response:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 200
 *       '400':
 *         description: Invalid password or passwords do not match
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Current password is incorrect"
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 400
 *       '401':
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 401
 */


coorRoute.put("/change-password",
    apiKeyAuth,
    CoorMiddleware.authToken,
    coorController.changePassword);





export default coorRoute;