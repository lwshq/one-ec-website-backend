import { Request, Response, ErrorRequestHandler } from "express";
import AppResponse from "../../utils/AppResponse";
import { meterDataSchema, userDataSchema } from "../../utils/validationSchemas";
import prisma from "../../utils/client";
import CreateCustomerAction from "../../actions/user/userCreateAction";


class UserController {


    async create(req: Request, res: Response) {
        try {
            const id = req.coorData.coop_id

            const userValidation = userDataSchema.safeParse(req.body.userData);
            if (!userValidation.success) {
                return AppResponse.sendError({
                    res,
                    data: null,
                    message: `User Validation error: ${userValidation.error.errors.map(e => e.message).join(", ")}`,
                    code: 400
                });
            }

            const meterValidation = meterDataSchema.safeParse(req.body.meterData);
            if (!meterValidation.success) {
                return AppResponse.sendError({
                    res,
                    data: null,
                    message: `Meter Validation error: ${meterValidation.error.errors.map(e => e.message).join(", ")}`,
                    code: 400
                });
            }

            const userData = await prisma.user.findUnique({
                where: { email: req.body.userData.email }
            });

            if (userData) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Email already exists",
                    code: 400
                });
            }

            const { user, meterAccount, accountRegistry } = await CreateCustomerAction.execute(req.body.userData, req.body.meterData, id);
            return AppResponse.sendSuccess({
                res: res,
                data: { user, meterAccount, accountRegistry },
                message: "Customer created successfully",
                code: 201
            });

        } catch (error: any) {
            return AppResponse.sendError({
                res: res,
                data: null,
                message: `Internal server error ${error.message}`,
                code: 500
            });
        }
    }

}

export default UserController;