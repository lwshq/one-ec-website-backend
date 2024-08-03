"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SoaCreateAction_1 = __importDefault(require("../../actions/bill/SoaCreateAction"));
const AppResponse_1 = __importDefault(require("../../utils/AppResponse"));
const UserShowAction_1 = __importDefault(require("../../actions/user/UserShowAction"));
const Mailer_1 = __importDefault(require("../../utils/Mailer"));
const path_1 = __importDefault(require("path"));
const pdf_1 = __importDefault(require("../../views/pdf"));
const fs_1 = __importDefault(require("fs"));
const arShowAction_1 = __importDefault(require("../../actions/ar/arShowAction"));
class BillController {
    createBill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const validation = SoaCreateAction_1.default.validate(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                        code: 400
                    });
                }
                const ar = yield arShowAction_1.default.execute(parseInt(id));
                if (!ar) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "AR not found",
                        code: 404,
                    });
                }
                const newBill = yield SoaCreateAction_1.default.execute(req.body, ar.meterId);
                const user = yield UserShowAction_1.default.execute(ar.userId);
                if (!user) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "User not found",
                        code: 404,
                    });
                }
                const pdfPath = path_1.default.join(__dirname, `../../temp/bills/bill-${newBill.id}.pdf`);
                yield pdf_1.default.generatePDF(newBill, pdfPath);
                const mailer = new Mailer_1.default;
                yield mailer.sendEmailSummary(user.email, newBill.kwhConsume, newBill.amount, newBill.rate, pdfPath);
                fs_1.default.unlinkSync(pdfPath);
                return AppResponse_1.default.sendSuccess({
                    res,
                    data: newBill,
                    message: 'Bill Created successfully',
                    code: 201
                });
            }
            catch (error) {
                console.error("Error creating bill:", error);
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: `Internal server error: ${error.message}`,
                    code: 500
                });
            }
        });
    }
    calculateBillDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const validation = SoaCreateAction_1.default.validate(req.body);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                        code: 400
                    });
                }
                const ar = yield arShowAction_1.default.execute(parseInt(id));
                if (!ar) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "AR not found",
                        code: 404,
                    });
                }
                const billDetails = yield SoaCreateAction_1.default.calculateDetails(req.body, ar.id);
                return AppResponse_1.default.sendSuccess({
                    res,
                    data: billDetails,
                    message: 'Bill details calculated successfully',
                    code: 200
                });
            }
            catch (error) {
                console.error("Error calculating bill details:", error);
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: `Internal server error: ${error.message}`,
                    code: 500
                });
            }
        });
    }
}
exports.default = BillController;
//# sourceMappingURL=billController.js.map