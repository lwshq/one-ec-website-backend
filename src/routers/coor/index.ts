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
 *                 example: sacdalernest02@gmail.com
 *               password:
 *                 type: string
 *                 description: Password is required
 *                 example: password
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


/**
 * @swagger
 * /api/v1/coor/create:
 *   post:
 *     summary: Create Coordinator API
 *     description: |
 *       This endpoint allows an admin to create a new coordinator.
 *     tags: [Coordinator Management]
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
 *               data:
 *                 type: object
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     description: First name of the coordinator
 *                     example: John
 *                   middle_name:
 *                     type: string
 *                     description: Middle name of the coordinator
 *                     example: A.
 *                   last_name:
 *                     type: string
 *                     description: Last name of the coordinator
 *                     example: Doe
 *                   email:
 *                     type: string
 *                     description: Email of the coordinator
 *                     example: sacdalernest04@example.com
 *                   contact_number:
 *                     type: string
 *                     description: Contact number of the coordinator
 *                     example: 1234567890
 *                   address:
 *                     type: string
 *                     description: Address of the coordinator
 *                     example: "123 Main St, Anytown, USA"
 *               roleIds:
 *                 type: array
 *                 description: List of role IDs to assign to the coordinator
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *             required:
 *               - data
 *               - roleIds
 *     responses:
 *       '201':
 *         description: Coordinator created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     coordinator:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         first_name:
 *                           type: string
 *                           example: John
 *                         middle_name:
 *                           type: string
 *                           example: A.
 *                         last_name:
 *                           type: string
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           example: johndoe@example.com
 *                         contact_number:
 *                           type: string
 *                           example: 1234567890
 *                         coop_id:
 *                           type: integer
 *                           example: 1
 *                         role:
 *                           type: string
 *                           example: COORDINATOR
 *                     coordinatorRoles:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           coordinatorId:
 *                             type: integer
 *                             example: 1
 *                           roleId:
 *                             type: integer
 *                             example: 1
 *                 message:
 *                   type: string
 *                   example: Coordinator created successfully
 *                 response:
 *                   type: string
 *                   example: Success
 *                 code:
 *                   type: integer
 *                   example: 201
 *       '400':
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Validation error
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 400
 *       '404':
 *         description: Some roles not found or are deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Some roles not found or are deleted
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 404
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 *                 response:
 *                   type: string
 *                   example: Error
 *                 code:
 *                   type: integer
 *                   example: 500
 */


coorRoute.post(
    "/create",
    apiKeyAuth,
    CoorMiddleware.authToken,
    coorController.create
);




export default coorRoute;