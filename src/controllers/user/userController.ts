import { Request, Response, ErrorRequestHandler } from "express";
import AppResponse from "../../utils/AppResponse";
import { meterDataSchema, requestResetSchema, resetPasswordSchema, userDataSchema, userSchema } from "../../utils/validationSchemas";
import prisma from "../../utils/client";
import CreateCustomerAction from "../../actions/user/userCreateAction";
import { User } from "../../types/custom";
import UserAuthAction from "../../actions/user/userLoginAction";
import UserRegistrationAction from "../../actions/user/userRegistrationAction";
import { UserRole } from "@prisma/client";
import UserForgotPasswordAction from "../../actions/user/userForgotPasswordAction";

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

    async auth(req: Request, res: Response) {
        try {
            const ip = req.ip || '0.0.0.0';
            const data: User = {
                email: req.body.email,
                password: req.body.password,
            };

            const validation = UserAuthAction.validate(data);

            if (!validation.success) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: `Error : ${validation.error.errors}`,
                    code: 400,
                });
            }

            const userId = await prisma.user.findFirst({
                where: {
                    email: validation.data.email,
                    deleted_at: null
                }
            });

            if (!userId) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "User not found",
                    code: 400,
                });
            }

            const user = await UserAuthAction.execute(data, ip, userId.id);


            const token = await UserAuthAction.generateToken(data);
            return AppResponse.sendSuccess({
                res: res,
                data: {
                    token,
                },
                message: "Authentication successful",
                code: 200,
            });
        }

        catch (error: any) {
            if (error.message == "Invalid Login Credentials") {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: error.message,
                    code: 401,
                });
            } else if (error.message.includes("Too many login attempts")) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: error.message,
                    code: 429
                })
            } else {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: `Internal server error : ${error.message}`,
                    code: 500,
                });
            }

        }
    }

    async register(req: Request, res: Response) {
        try {
            const validation = userSchema.safeParse(req.body);

            if (!validation.success) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                    code: 400
                });
            }

            const { password, ...userData } = validation.data;
            const normalizedUserData = {
                ...userData,
                middle_name: userData.middle_name ?? null,
                birthdate: userData.birthdate ?? null,
                contact_number: userData.contact_number ?? null,
                gender: userData.gender ?? null,
                address: userData.address ?? null,
                role: UserRole.USER
            };
            const existingUser = await prisma.user.findUnique({
                where: {
                    email: validation.data.email
                }
            })

            if (existingUser) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Email already exists",
                    code: 400
                });
            }

            const user = await UserRegistrationAction.execute(normalizedUserData, password)

            return AppResponse.sendSuccess({
                res: res,
                data: user,
                message: "User registered successfully",
                code: 201
            });
        } catch (error: any) {
            return AppResponse.sendError({
                res: res,
                data: null,
                message: `Internal server error: ${error.message}`,
                code: 500
            });
        }
    }

    async forgotPassword(req: Request, res: Response) {
        try {
          const validation = requestResetSchema.safeParse(req.body);
          if (!validation.success) {
            return AppResponse.sendError({
              res: res,
              data: null,
              message: `Validation Error: ${validation.error.errors.map(err => err.message).join(", ")}`,
              code: 400,
            });
          }
    
          const { email } = validation.data;
          await UserForgotPasswordAction.requestReset(email);
          return AppResponse.sendSuccess({
            res: res,
            data: null,
            message: "Password reset link sent successfully",
            code: 200,
          });
        } catch (error: any) {
          return AppResponse.sendError({
            res: res,
            data: null,
            message: `Error: ${error.message}`,
            code: 400,
          });
        }
      }
    
      async resetPassword(req: Request, res: Response) {
        try {
          const validation = resetPasswordSchema.safeParse(req.body);
          if (!validation.success) {
            return AppResponse.sendError({
              res: res,
              data: null,
              message: `Validation Error: ${validation.error.errors.map(err => err.message).join(", ")}`,
              code: 400,
            });
          }
    
          const { token, newPassword } = validation.data;
          await UserForgotPasswordAction.resetPassword(token, newPassword);
          return AppResponse.sendSuccess({
            res: res,
            data: null,
            message: "Password reset successfully",
            code: 200,
          });
        } catch (error: any) {
          return AppResponse.sendError({
            res: res,
            data: null,
            message: `Error: ${error.message}`,
            code: 400,
          });
        }
      }

}


export default UserController;