import session from "express-session";
import Mailer from "../../utils/Mailer";
import { ErrorRequestHandler, Request, Response } from "express";
import AppResponse from "../../utils/AppResponse";
import AuthAction from "../../actions/coor/authAction";
import ForgotPasswordAction from "../../actions/coor/coorForgotPassword";
import ChangePasswordAction from "../../actions/coor/coorChangePassword";
import { requestResetSchema, passwordChangeSchema, resetPasswordSchema } from "../../utils/validationSchemas";
import { User } from "../../types/custom";
import bcrypt from "bcrypt";

class CoorController {
    async auth(req: Request, res: Response) {
        try {
            const data: User = {
                email: req.body.email,
                password: req.body.password,
            };

            const validation = AuthAction.validate(data);

            if (!validation.success) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: `Error : ${validation.error.errors}`,
                    code: 400,
                });
            }

            const admin = await AuthAction.execute(data);

            if (admin) {
                await AuthAction.logActivity(admin, 'Logged in');

                const token = await AuthAction.generateToken(data);

                return AppResponse.sendSuccess({
                    res: res,
                    data: {
                        token,
                    },
                    message: "Authentication successful",
                    code: 200,
                });
            }

        } catch (error: any) {
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

    async logout(req: Request, res: Response) {
        try {
          const coor = req.coorData;
    
          if (!coor) {
            return AppResponse.sendError({
              res: res,
              data: null,
              message: "Coordinator not found",
              code: 404
            })
          }
    
          await AuthAction.logActivity(coor, 'Logged out');
    
          return AppResponse.sendSuccess({
            res: res,
            data: null,
            message: "Logout successful",
            code: 200
          });
    
        } catch (error: any) {
          return AppResponse.sendError({
            res: res,
            data: null,
            message: `Internal server error : ${error.message}`,
            code: 500
          })
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
          await ForgotPasswordAction.requestReset(email);
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

      async changePassword(req: Request, res: Response) {
        try {
          const coorId = req.coorData.id;
          const { currentPassword, newPassword, confirmPassword } = req.body;
    
          const validation = passwordChangeSchema.safeParse({ currentPassword, newPassword, confirmPassword})
    
          if(!validation.success) {
            return AppResponse.sendError({
              res: res,
              data: null,
              message:  `Validation Error: ${validation.error.errors.map(err => err.message).join(", ")}`,
              code: 400,
            });
          }
    
          await ChangePasswordAction.changePassword(coorId, currentPassword, newPassword);
    
          return AppResponse.sendSuccess({
            res: res,
            data: null,
            message: "Password changed successfully",
            code: 200,
          })
        } catch (error: any) {
          return AppResponse.sendError({
            res: res,
            data: null,
            message: error.message,
            code: 400
          })
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
          await ForgotPasswordAction.resetPassword(token, newPassword);
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

export default CoorController;