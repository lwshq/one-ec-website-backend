import { Router } from "express";
import config from "../../config/index";
import BillController from "../../controllers/bill/billController";
import apiKeyAuth from "../../middlewares/apiKey";
import CoorMiddleware from "../../middlewares/coop";
import CheckAccess from "../../middlewares/role";

const billRoute = Router();
const billController = new BillController();

/**
 * @swagger
 * /api/v1/bill/create/{id}:
 *   post:
 *     summary: Create a new Bill
 *     tags: [Bill]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to create a bill for and send an email summary.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the billing period
 *                 example: "2023-01-01"
 *               toDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the billing period
 *                 example: "2023-01-31"
 *               nextDate:
 *                 type: string
 *                 format: date
 *                 description: The next date for bill payment
 *                 example: "2023-02-31"
   *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The due date for bill payment
 *                 example: "2023-02-31"
 *               kwhConsume:
 *                 type: number
 *                 description: The total kWh consumed during the billing period
 *                 example: 150.5
 *               rate:
 *                 type: number
 *                 description: Rate per kWh
 *                 example: 0.12
 *               distribution:
 *                 type: number
 *                 description: Distribution charge
 *                 example: 5.00
 *               generation:
 *                 type: number
 *                 description: Generation charge
 *                 example: 3.00
 *               sLoss:
 *                 type: number
 *                 description: System loss charge
 *                 example: 2.00
 *               transmission:
 *                 type: number
 *                 description: Transmission charge
 *                 example: 4.00
 *               subsidies:
 *                 type: number
 *                 description: Subsidies
 *                 example: 1.00
 *               gTax:
 *                 type: number
 *                 description: Government tax
 *                 example: 0.30
 *               fitAll:
 *                 type: number
 *                 description: FIT-All charge
 *                 example: 0.25
 *               applied:
 *                 type: number
 *                 description: Other applied fees
 *                 example: 0.40
 *               other:
 *                 type: number
 *                 description: Any other charges
 *                 example: 0.50
  *               uCharges:
 *                 type: number
 *                 description: Any other charges
 *                 example: 0.50
 *             required:
 *               - fromDate
 *               - toDate
 *               - kwhConsume
 *               - rate
 *     responses:
 *       201:
 *         description: Bill created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Bill created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Unique identifier for the bill
 *                     amount:
 *                       type: number
 *                       description: Total amount charged
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       description: Timestamp when the bill was created
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Validation error: Missing required fields"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */


billRoute.post(
    "/create/:id/",
    apiKeyAuth,
    CoorMiddleware.authToken,
    CheckAccess(['add'], ['/soa']),
    billController.createBill
);

/**
 * @swagger
 * /api/v1/bill/calculate/{id}:
 *   post:
 *     summary: Calculate Bill Details
 *     tags: [Bill]
 *     security:
 *       - apiKeyAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID to calculate.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromDate:
 *                 type: string
 *                 format: date
 *                 description: The start date of the billing period
 *                 example: "2023-01-01"
 *               toDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the billing period
 *                 example: "2023-01-31"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the billing period
 *                 example: "2023-02-31"
 *               nextDate:
 *                 type: string
 *                 format: date
 *                 description: The end date of the billing period
 *                 example: "2023-02-31"
 *               kwhConsume:
 *                 type: number
 *                 description: The total kWh consumed during the billing period
 *                 example: 150.5
 *               rate:
 *                 type: number
 *                 description: Rate per kWh
 *                 example: 0.12
 *               distribution:
 *                 type: number
 *                 description: Distribution charge
 *                 example: 5.00
 *               generation:
 *                 type: number
 *                 description: Generation charge
 *                 example: 3.00
 *               sLoss:
 *                 type: number
 *                 description: System loss charge
 *                 example: 2.00
 *               transmission:
 *                 type: number
 *                 description: Transmission charge
 *                 example: 4.00
 *               subsidies:
 *                 type: number
 *                 description: Subsidies
 *                 example: 1.00
 *               gTax:
 *                 type: number
 *                 description: Government tax
 *                 example: 0.30
 *               fitAll:
 *                 type: number
 *                 description: FIT-All charge
 *                 example: 0.25
 *               applied:
 *                 type: number
 *                 description: Other applied fees
 *                 example: 0.40
 *               other:
 *                 type: number
 *                 description: Any other charges
 *                 example: 0.50
 *               uCharges:
 *                 type: number
 *                 description: Universal charges
 *                 example: 0.50
 *             required:
 *               - fromDate
 *               - toDate
 *               - dueDate
 *               - kwhConsume
 *               - rate
 *     responses:
 *       200:
 *         description: Bill details calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: "Bill details calculated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalAmount:
 *                       type: number
 *                       description: Total amount to be charged
 *                     components:
 *                       type: object
 *                       description: Breakdown of individual components of the bill
 *                       properties:
 *                         distributionCharge:
 *                           type: number
 *                         generationCharge:
 *                           type: number
 *                         systemLossCharge:
 *                           type: number
 *                         transmissionCharge:
 *                           type: number
 *                         subsidiesCharge:
 *                           type: number
 *                         governmentTax:
 *                           type: number
 *                         fitAllCharge:
 *                           type: number
 *                         appliedCharge:
 *                           type: number
 *                         otherCharge:
 *                           type: number
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Validation error: Missing required fields"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *                   example: "Internal server error"
 */

billRoute.post(
    "/calculate/:id",
    apiKeyAuth,
    CoorMiddleware.authToken,
    CheckAccess(['add'], ['/soa']),
    billController.calculateBillDetails
);

export default billRoute;
