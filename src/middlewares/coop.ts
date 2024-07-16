import { Request, Response, NextFunction } from "express";
import AppResponse from "../utils/AppResponse";
import Token from "../utils/token";
import { CoopCoordinator } from "@prisma/client";
import AdminShowAction from "../actions/admin/adminShowAction";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import CoorShowAction from "../actions/coor/coorShowAction";

declare global {
  namespace Express {
    interface Request {
      coorData: CoopCoordinator;
    }
  }
}

class CoorMiddleware {
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
      const coorId = (decodedToken as CoopCoordinator).id;

      if (!coorId) {
        return AppResponse.sendError({
          res,
          code: 401,
          message: "Invalid token: Coor ID not found",
          data: null,
        });
      }

      const coorData = await CoorShowAction.execute(coorId);

      if (!coorData) {
        return AppResponse.sendError({
          res,
          code: 404,
          message: "Coordinator not found",
          data: null,
        });
      }

      req.coorData = coorData;
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

export default CoorMiddleware;
