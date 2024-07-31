import { Request, Response, NextFunction } from "express";
import AppResponse from "../utils/AppResponse";
import Token from "../utils/token";
import { Admin, User } from "@prisma/client";
import AdminShowAction from "../actions/admin/adminShowAction";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import UserShowAction from "../actions/user/UserShowAction";

declare global {
  namespace Express {
    interface Request {
      userData: User;
    }
  }
}

class UserMiddleware {
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
      const userId = (decodedToken as User).id;

      if (!userId) {
        return AppResponse.sendError({
          res,
          code: 401,
          message: "Invalid token: User ID not found",
          data: null,
        });
      }

      const userData = await UserShowAction.execute(userId);

      if (!userData) {
        return AppResponse.sendError({
          res,
          code: 404,
          message: "User not found",
          data: null,
        });
      }

      req.userData = userData;
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

export default UserMiddleware;
