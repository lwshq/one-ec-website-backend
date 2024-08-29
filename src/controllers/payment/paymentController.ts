import { Request, Response, ErrorRequestHandler } from "express";
import config from "../../config/index";
import AppResponse from "../../utils/AppResponse";

class PaymentController {
    async getPaymentForm(req: Request, res: Response) {
        try {
            let apiKey = req.query.apiKey as string;

            apiKey = apiKey.replace(/ /g, '+');
            if (!apiKey || apiKey !== config.key.xendit_api_key) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Invalid API Key",
                    code: 401
                })
            }

            const link = `http://localhost:8000/api/v1/payment/form`;
            console.log("==================================================================")
            console.log('Received API Key:', apiKey);
            console.log('Expected API Key:', config.key.xendit_api_key);
            console.log("==================================================================")
            return AppResponse.sendSuccess({
                res: res,
                data: link,
                message: "Access the payment form at the link below:",
                code: 200
            })

        } catch (error: any) {
            return AppResponse.sendError({
                res: res,
                data: null,
                message: `Internal server error: ${error.message}`,
                code: 500
            })

        }
    }
}

export default PaymentController;