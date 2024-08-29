import { Router } from "express";
import PaymentController from "../../controllers/payment/paymentController";
import config from "../../config/index";
import CoorController from "../../controllers/coor/coorController";
import apiKeyAuth from "../../middlewares/apiKey";
import UserMiddleware from "../../middlewares/user";
import CheckAccess from "../../middlewares/role";

const paymentRoute = Router();
const paymentController = new PaymentController();

paymentRoute.get(
    "/payment-form",
    paymentController.getPaymentForm
);

paymentRoute.get(
    "/form",
    (req, res) => {
        res.render("payment/paymentForm", {
            apiKey: config.key.xendit_api_key,
        });
    }
);

export default paymentRoute;