import { Router } from "express";
import config from "../../config/index";
import apiKeyAuth from "../../middlewares/apiKey";
import CoorMiddleware from "../../middlewares/coop";
import ArController from "../../controllers/ar/arController";
import CheckAccess from "../../middlewares/role";

const arRoute = Router();
const arController = new ArController();
/**
 * @swagger
 * /api/v1/ar/list:
 *   get:
 *     summary: Get all Approved Account Registry
 *     tags: [Account Registry]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account Registry retrieved successfully
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

arRoute.get(
    "/listAll",
    apiKeyAuth,
    CoorMiddleware.authToken,
    CheckAccess([], ['/soa']),
    arController.listAll
);

/**
 * @swagger
 * /api/v1/ar/list:
 *   get:
 *     summary: Get all Account Registry
 *     tags: [Account Registry]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account Registry retrieved successfully
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

arRoute.get(
    "/list",
    apiKeyAuth,
    CoorMiddleware.authToken,
    CheckAccess([], ['/soa']),
    arController.list
);

/**
 * @swagger
 * /api/v1/ar/show/{id}:
 *   get:
 *     summary: Get a account registry by ID
 *     tags: [Account Registry]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The account registry ID
 *     responses:
 *       200:
 *         description: Account registry retrieved successfully
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

arRoute.get(
    "/show/:id",
    apiKeyAuth,
    CoorMiddleware.authToken,
    CheckAccess(['view'], ['/soa']),
    arController.show
);

export default arRoute;