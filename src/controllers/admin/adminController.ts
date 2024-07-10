import session from "express-session";
import Mailer from "../../utils/Mailer";
import { ErrorRequestHandler, Request, Response } from "express";
import AppResponse from "../../utils/AppResponse";
import AuthAction from "../../actions/admin/authAction";
import { User } from "../../types/custom";
import bcrypt from "bcrypt";

const mailer = new Mailer();

class AdminController {

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
      const admin = req.adminData;

      if (!admin) {
        return AppResponse.sendError({
          res: res,
          data: null,
          message: "Admin not found",
          code: 404
        })
      }

      await AuthAction.logActivity(admin, 'Logged out');

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

}

export default AdminController;
