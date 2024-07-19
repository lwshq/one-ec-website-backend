import { Request, Response } from "express";
import SoaCreateAction from "../../actions/bill/SoaCreateAction";
import AppResponse from "../../utils/AppResponse";
class BillController {
    // Method to create a bill
    async createBill(req: Request, res: Response) {
        try {
            const validation = SoaCreateAction.validate(req.body);
            const coopId = req.coorData.coop_id;

            if (!validation.success) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                    code: 400
                });
            }
    
            const newBill = await SoaCreateAction.execute(req.body, coopId);

            return AppResponse.sendSuccess({
                res,
                data: newBill,
                message: 'Bill Created successfully',
                code: 201
            })
        } catch (error: any) {
            console.error("Error creating bill:", error);
            return AppResponse.sendError({
                res: res,
                data: null,
                message: `Internal server error: ${error.message}`,
                code: 500
            })
        }
    }
}

export default BillController;
