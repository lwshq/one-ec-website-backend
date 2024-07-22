import { Request, Response } from "express";
import SoaCreateAction from "../../actions/bill/SoaCreateAction";
import AppResponse from "../../utils/AppResponse";
import UserShowAction from "../../actions/user/UserShowAction";
import Mailer from "../../utils/Mailer";
import path from "path";
import PDFService from "../../views/pdf";
import fs from 'fs';
class BillController {
    async createBill(req: Request, res: Response) {
        try {
            const { id } = req.params;
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

            
            
            const newBill = await SoaCreateAction.execute(req.body, coopId, parseInt(id));
            const user = await UserShowAction.execute(parseInt(id))
            if (!user) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "User not found",
                    code: 404,
                })
            }

            const pdfPath = path.join(__dirname, `../../temp/bills/bill-${newBill.id}.pdf`);
            await PDFService.generatePDF(newBill, pdfPath);
            const mailer = new Mailer;
            await mailer.sendEmailSummary(user.email, newBill.kwhConsume, newBill.amount, newBill.rate, pdfPath)


            fs.unlinkSync(pdfPath);
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

    async calculateBillDetails(req: Request, res: Response) {
        try {
            const validation = SoaCreateAction.validate(req.body);
            if (!validation.success) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                    code: 400
                });
            }

            const billDetails = await SoaCreateAction.calculateDetails(req.body);
            return AppResponse.sendSuccess({
                res,
                data: billDetails,
                message: 'Bill details calculated successfully',
                code: 200
            });
        } catch (error: any) {
            console.error("Error calculating bill details:", error);
            return AppResponse.sendError({
                res: res,
                data: null,
                message: `Internal server error: ${error.message}`,
                code: 500
            });
        }
    }
}

export default BillController;
