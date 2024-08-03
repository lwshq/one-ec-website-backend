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
const AppResponse_1 = __importDefault(require("../../utils/AppResponse"));
const validationSchemas_1 = require("../../utils/validationSchemas");
const client_1 = __importDefault(require("../../utils/client"));
const userCreateAction_1 = __importDefault(require("../../actions/user/userCreateAction"));
const userLoginAction_1 = __importDefault(require("../../actions/user/userLoginAction"));
class UserController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.coorData.coop_id;
                const userValidation = validationSchemas_1.userDataSchema.safeParse(req.body.userData);
                if (!userValidation.success) {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: `User Validation error: ${userValidation.error.errors.map(e => e.message).join(", ")}`,
                        code: 400
                    });
                }
                const meterValidation = validationSchemas_1.meterDataSchema.safeParse(req.body.meterData);
                if (!meterValidation.success) {
                    return AppResponse_1.default.sendError({
                        res,
                        data: null,
                        message: `Meter Validation error: ${meterValidation.error.errors.map(e => e.message).join(", ")}`,
                        code: 400
                    });
                }
                const userData = yield client_1.default.user.findUnique({
                    where: { email: req.body.userData.email }
                });
                if (userData) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "Email already exists",
                        code: 400
                    });
                }
                const { user, meterAccount, accountRegistry } = yield userCreateAction_1.default.execute(req.body.userData, req.body.meterData, id);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: { user, meterAccount, accountRegistry },
                    message: "Customer created successfully",
                    code: 201
                });
            }
            catch (error) {
                return AppResponse_1.default.sendError({
                    res: res,
                    data: null,
                    message: `Internal server error ${error.message}`,
                    code: 500
                });
            }
        });
    }
    auth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ip = req.ip || '0.0.0.0';
                const data = {
                    email: req.body.email,
                    password: req.body.password,
                };
                const validation = userLoginAction_1.default.validate(data);
                if (!validation.success) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Error : ${validation.error.errors}`,
                        code: 400,
                    });
                }
                const userId = yield client_1.default.user.findFirst({
                    where: {
                        email: validation.data.email,
                        deleted_at: null
                    }
                });
                if (!userId) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: "User not found",
                        code: 400,
                    });
                }
                const user = yield userLoginAction_1.default.execute(data, ip, userId.id);
                const token = yield userLoginAction_1.default.generateToken(data);
                return AppResponse_1.default.sendSuccess({
                    res: res,
                    data: {
                        token,
                    },
                    message: "Authentication successful",
                    code: 200,
                });
            }
            catch (error) {
                if (error.message == "Invalid Login Credentials") {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: error.message,
                        code: 401,
                    });
                }
                else if (error.message.includes("Too many login attempts")) {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: error.message,
                        code: 429
                    });
                }
                else {
                    return AppResponse_1.default.sendError({
                        res: res,
                        data: null,
                        message: `Internal server error : ${error.message}`,
                        code: 500,
                    });
                }
            }
        });
    }
}
exports.default = UserController;
//# sourceMappingURL=userController.js.map