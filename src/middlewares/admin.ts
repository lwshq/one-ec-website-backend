import { Request, Response, NextFunction } from "express";
import AppResponse from "../utils/AppResponse";
import Token from "../utils/token";
import { Admin } from "@prisma/client";
import AdminShowAction from "../actions/admin/adminShowAction";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      adminData: Admin;
    }
  }
}

class AdminMiddleware {
  static async authToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return AppResponse.sendError({
        res: res,
        data: null,
        message: "Unauthorized",
        code: 403,
      });
    }

    try {
      const decodedToken = Token.validate(token);
      const adminId = (decodedToken as Admin).id;

      if (!adminId) {
        return AppResponse.sendError({
          res,
          code: 401,
          message: "Invalid token: Admin ID not found",
          data: null,
        });
      }

      const adminData = await AdminShowAction.execute(adminId);

      if (!adminData) {
        return AppResponse.sendError({
          res,
          code: 404,
          message: "Admin not found",
          data: null,
        });
      }

      req.adminData = adminData;
      next();
    } catch (error: any) {
      if (error instanceof TokenExpiredError) {
        return AppResponse.sendError({
          res: res,
          data: null,
          message: "Token expired",
          code: 401,
        });
      }

      if (error instanceof JsonWebTokenError) {
        return AppResponse.sendError({
          res: res,
          data: null,
          message: "Token invalid",
          code: 401,
        });
      }

      console.log(error);
      return AppResponse.sendError({
        res: res,
        data: null,
        message: "Internal server error",
        code: 500,
      });
    }
  }
}

export default AdminMiddleware;
