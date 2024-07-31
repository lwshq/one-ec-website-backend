import { Router } from "express";
import config from "../../config/index";
import UserController from "../../controllers/user/userController";
import apiKeyAuth from "../../middlewares/apiKey";
import CoorMiddleware from "../../middlewares/coop";
import CoorController from "../../controllers/coor/coorController";
import coorRoute from "../coor";
import CheckAccess from "../../middlewares/role";

const userRoute = Router();
const userController = new UserController();


 /**
 * @swagger
 * /api/v1/user/create:
 *   post:
 *     summary: Create User API
 *     description: |
 *       This endpoint allows for the creation of a new user along with meter account details. A random password is generated, hashed, and associated with the user. A meter account is created with the user's name, and an account registry entry is made.
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userData:
 *                 type: object
 *                 description: Personal details of the user
 *                 properties:
 *                   first_name:
 *                     type: string
 *                     description: First name of the user
 *                     example: John
 *                     required: true
 *                   middle_name:
 *                     type: string
 *                     description: Middle name of the user
 *                     example: A.
 *                     nullable: true
 *                   last_name:
 *                     type: string
 *                     description: Last name of the user
 *                     example: Doe
 *                     required: true
 *                   birthdate:
 *                     type: string
 *                     format: date
 *                     description: Birthdate of the user
 *                     nullable: true
 *                   email:
 *                     type: string
 *                     description: Email address of the user
 *                     example: johndoe@example.com
 *                   contact_number:
 *                     type: string
 *                     description: Contact number of the user
 *                     example: "+1234567890"
 *                     nullable: true
 *                   gender:
 *                     type: string
 *                     description: Gender of the user
 *                     example: "Male"
 *                     nullable: true
 *                   address:
 *                     type: string
 *                     description: Residential address of the user
 *                     example: "123 Main St, Anytown, USA"
 *                     nullable: true
 *               meterData:
 *                 type: object
 *                 description: Meter installation details for the user
 *                 properties:
 *                   meterNumber:
 *                     type: integer
 *                     description: Unique meter identifier
 *                     example: 12345678
 *                   customerType:
 *                     type: string
 *                     description: Type of customer for the meter
 *                     example: "Residential"
 *                     nullable: true
 *                   meterActivated:
 *                     type: boolean
 *                     description: Status indicating if the meter is activated
 *                     example: true
 *     responses:
 *       '201':
 *         description: User, meter account, and account registry created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         firstName:
 *                           type: string
 *                           example: John
 *                         lastName:
 *                           type: string
 *                           example: Doe
 *                         email:
 *                           type: string
 *                           example: johndoe@example.com
 *                         contactNumber:
 *                           type: string
 *                           example: "+1234567890"
 *                     meterAccount:
 *                       type: object
 *                       properties:
 *                         meterNumber:
 *                           type: integer
 *                           example: 12345678
 *                     accountRegistry:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                 message:
 *                   type: string
 *                   example: User created successfully
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



userRoute.post(
    "/create",
    apiKeyAuth,
    CoorMiddleware.authToken,
    userController.create
);


/**
 * @swagger
 * /api/v1/user/authenticate:
 *   post:
 *     summary: Authentication API
 *     description: |
 *       This endpoint allows the user to log in.
 *     tags: [User Management]
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

userRoute.post(
    "/authenticate",
    apiKeyAuth,
    userController.auth
);
export default userRoute;