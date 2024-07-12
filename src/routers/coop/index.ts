import { Router } from "express";
import config from "../../config/index";
import CoopController from "../../controllers/coop/coopController";
import apiKeyAuth from "../../middlewares/apiKey";
import AdminMiddleware from "../../middlewares/admin";

const coopRoute = Router();
const coopController = new CoopController();

/**
 * @swagger
 * tags:
 *   name: Cooperative
 *   description: API for cooperative management
 */
/**
 * @swagger
 * /api/v1/coop/create:
 *   post:
 *     summary: Create a new Cooperative
 *     tags: [Cooperative]
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
 *               name:
 *                 type: string
 *                 description: The name of the cooperative
 *                 example: "Tech Coop"
 *               description:
 *                 type: string
 *                 description: The description of the cooperative
 *                 example: "A technology-focused cooperative"
 *               email:
 *                 type: string
 *                 description: The email of the cooperative
 *                 example: "sample@email.com"
 *               contact:
 *                 type: string
 *                 description: The contact of the cooperative
 *                 example: "09123456789"
 *             required:
 *               - name
 *               - email
 *     responses:
 *       201:
 *         description: Cooperative created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the cooperative
 *                     name:
 *                       type: string
 *                       description: Name of the cooperative
 *                     description:
 *                       type: string
 *                       description: Description of the cooperative
 *                     email:
 *                       type: string
 *                       description: email of the cooperative
 *                     contact:
 *                       type: string
 *                       description: Contact of the cooperative
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the cooperative was created
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the cooperative was last updated
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 */


coopRoute.post(
    "/create",
    apiKeyAuth,
    AdminMiddleware.authToken,
    coopController.create
);

/**
 * @swagger
 * /api/v1/coop/update/{coopId}:
 *   put:
 *     summary: Update an existing Cooperative
 *     tags: [Cooperative]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: coopId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the cooperative to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the cooperative
 *                 example: "Tech Coop New"
 *               description:
 *                 type: string
 *                 description: The updated description of the cooperative
 *                 example: "An updated description of the technology-focused cooperative"
 *               email:
 *                 type: string
 *                 description: The email of the cooperative
 *                 example: "sample@email.com"
 *               contact:
 *                 type: string
 *                 description: The contact of the cooperative
 *                 example: "09123456789"
 *     responses:
 *       200:
 *         description: Cooperative updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the cooperative
 *                     name:
 *                       type: string
 *                       description: Updated name of the cooperative
 *                     description:
 *                       type: string
 *                       description: Updated description of the cooperative
 *                     email:
 *                       type: string
 *                       description: Updated email of the cooperative
 *                     contact:
 *                       type: string
 *                       description: Updated contact of the cooperative
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the cooperative was last updated
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       404:
 *         description: Cooperative not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 */

coopRoute.put(
    "/update/:id",
    apiKeyAuth,
    AdminMiddleware.authToken,
    coopController.update
);

/**
 * @swagger
 * /api/v1/coop/show/{id}:
 *   get:
 *     summary: Get a cooperative by ID
 *     tags: [Cooperative]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The cooperative ID
 *     responses:
 *       200:
 *         description: cooperative retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       404:
 *         description: cooperative not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 */

coopRoute.get(
    "/show/:id",
    apiKeyAuth,
    AdminMiddleware.authToken,
    coopController.show
);

/**
 * @swagger
 * /api/v2/campus/list:
 *   get:
 *     summary: Get all campuses
 *     tags: [Cooperative]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cooperatives retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 */

coopRoute.get(
    "/list",
    apiKeyAuth,
    AdminMiddleware.authToken,
    coopController.list
);

/**
 * @swagger
 * /api/v1/coop/delete/{id}:
 *   delete:
 *     summary: Delete a cooperative by ID
 *     tags: [Cooperative]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The cooperative ID
 *     responses:
 *       200:
 *         description: Cooperative deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       404:
 *         description: Cooperative not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *                 code:
 *                   type: integer
 */

coopRoute.delete(
    "/delete/:id",
    apiKeyAuth,
    AdminMiddleware.authToken,
    coopController.delete
);

export default coopRoute;