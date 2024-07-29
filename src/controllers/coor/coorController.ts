import session from "express-session";
import Mailer from "../../utils/Mailer";
import { ErrorRequestHandler, Request, Response } from "express";
import AppResponse from "../../utils/AppResponse";
import AuthAction from "../../actions/coor/authAction";
import ForgotPasswordAction from "../../actions/coor/coorForgotPassword";
import ChangePasswordAction from "../../actions/coor/coorChangePassword";
import { requestResetSchema, passwordChangeSchema, resetPasswordSchema, coorSchemaUpdate, createCoordinatorSchema, updateCoordinatorSchema } from "../../utils/validationSchemas";
import { User } from "../../types/custom";
import bcrypt from "bcrypt";
import prisma from "../../utils/client";
import { ZodError } from "zod";
import CoorCreateAction from "../../actions/coor/coorCreateAction";
import { toFinite } from "lodash";
import CoorUpdateAction from "../../actions/coor/coorUpdateAction";
import CoorListPaginateAction from "../../actions/coor/coorListPaginationAction";
import CoorDeleteAction from "../../actions/coor/coorDeleteAction";
import CoorShowAction from "../../actions/coor/coorShowAction";
import CoorListPaginatePerCoopAction from "../../actions/coor/coorListPerCoopAction";
import CoorSearchAction from "../../actions/coor/coorSearch";

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
        const role =  await AuthAction.role(data)

        return AppResponse.sendSuccess({
          res: res,
          data: {
            token,
            role,
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

      const validation = passwordChangeSchema.safeParse({ currentPassword, newPassword, confirmPassword })

      if (!validation.success) {
        return AppResponse.sendError({
          res: res,
          data: null,
          message: `Validation Error: ${validation.error.errors.map(err => err.message).join(", ")}`,
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


  async create(req: Request, res: Response) {
    try {



      const validation = createCoordinatorSchema.safeParse(req.body);
      if (!validation.success) {
        return AppResponse.sendError({
          res,
          data: null,
          message: `Validation error: ${validation.error.errors.map(e => e.message).join(", ")}`,
          code: 400
        });
      }

      const { data, roleIds } = req.body;
      const coopId = req.coorData.coop_id;

      const roles = await prisma.role.findMany({
        where: {
          id: { in: roleIds },
          deletedAt: null
        }
      });

      if (roles.length !== roleIds.length) {
        return AppResponse.sendError({
          res,
          data: null,
          message: 'Some roles not found or are deleted',
          code: 404
        });
      }

      const existingCoordinator = await prisma.coopCoordinator.findUnique({
        where: { email: data.email }
      });

      if (existingCoordinator) {
        return AppResponse.sendError({
          res,
          data: null,
          message: "Email already exists",
          code: 400
        });
      }

      const { coordinator } = await CoorCreateAction.execute(data, roleIds, coopId);
      return AppResponse.sendSuccess({
        res,
        data: { coordinator },
        message: "Coordinator created successfully",
        code: 201
      });
    } catch (error: any) {
      console.log('Error:', error);
      return AppResponse.sendError({
        res: res,
        data: null,
        message: `Internal server error ${error.message}`,
        code: 500
      });
    }
  }


  async update(req: Request, res: Response) {
    try {
      const coordinatorId = parseInt(req.params.id);
      const validation = updateCoordinatorSchema.safeParse(req.body);

      if (!validation.success) {
        return AppResponse.sendError({
          res,
          data: null,
          message: `Validation error: ${validation.error.errors.map(e => e.message).join(", ")}`,
          code: 400
        });
      }


      const { data, roleIds } = req.body;

      const result = await CoorUpdateAction.execute(coordinatorId, data, roleIds || []);
      return AppResponse.sendSuccess({
        res,
        data: { coordinator: result.coordinatorUpdate },
        message: "Coordinator updated successfully",
        code: 200
      });
    } catch (error: any) {
      if (error.message == "One or more roles do not exist") {
        return AppResponse.sendError({
          res,
          data: null,
          message: error.message,
          code: 400
        })
      } else if (error.message == "Coordinator not found.") {
        return AppResponse.sendError({
          res,
          data: null,
          message: error.message,
          code: 400
        })
      }
      else {
        return AppResponse.sendError({
          res,
          data: null,
          message: `Internal server error: ${error.message}`,
          code: 500
        });
      }

    }
  }


  async list(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    try {
      const { coors, total } = await CoorListPaginateAction.execute(page, pageSize)

      if (!coors) {
        return AppResponse.sendError({
          res: res,
          data: null,
          message: "No coor available",
          code: 404,
        })
      }

      const totalPages = Math.ceil(total / pageSize);

      return AppResponse.sendSuccess({
        res: res,
        data: {
          coors,
          pagination: {
            total,
            page,
            pageSize,
            totalPages,
          }
        },
        message: "Coors retrieved successfully",
        code: 200,
      })
    } catch (error: any) {
      return AppResponse.sendError({
        res: res,
        data: null,
        message: `Internal server error: ${error.message}`,
        code: 500
      });
    }

  }

  async delete(req: Request, res: Response) {

    try {
      const { id } = req.params;
      const coop = await CoorDeleteAction.execute(parseInt(id));

      if (!coop) {
        return AppResponse.sendError({
          res: res,
          data: null,
          message: "Coor not found",
          code: 404
        })
      }

      return AppResponse.sendSuccess({
        res: res,
        data: coop,
        message: "Coor deleted successfully",
        code: 200
      });
    } catch (error: any) {
      return AppResponse.sendError({
        res: res,
        data: null,
        message: `Internal server error ${error.message}`,
        code: 500,

      });
    }

  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const coor = await CoorShowAction.execute(parseInt(id))

      if (!coor) {
        return AppResponse.sendError({
          res: res,
          data: null,
          message: "Coor not found or deleted",
          code: 404
        })
      }

      return AppResponse.sendSuccess({
        res: res,
        data: coor,
        message: "Coor retrieved successfully",
        code: 200
      })
    } catch (error: any) {
      return AppResponse.sendError({
        res: res,
        data: null,
        message: `Internal server error ${error.message}`,
        code: 500,
      })
    }
  }

  async listPerCoop(req: Request, res: Response) {
    const coopId = req.coorData.coop_id
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    try {
      const { coors, total } = await CoorListPaginatePerCoopAction.execute(page, pageSize, coopId)

      if (!coors) {
        return AppResponse.sendError({
          res: res,
          data: null,
          message: "No coor available",
          code: 404,
        })
      }

      const totalPages = Math.ceil(total / pageSize);

      return AppResponse.sendSuccess({
        res: res,
        data: {
          coors,
          pagination: {
            total,
            page,
            pageSize,
            totalPages,
          }
        },
        message: "Coors retrieved successfully",
        code: 200,
      })
    } catch (error: any) {
      return AppResponse.sendError({
        res: res,
        data: null,
        message: `Internal server error: ${error.message}`,
        code: 500
      });
    }

  }

  async search(req: Request, res: Response) {
    const coopId = req.coorData.coop_id
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    try {
      const searchQuery = req.query.search as string;
      const { coors, total } = await CoorSearchAction.execute(page, pageSize, searchQuery, coopId)

      if (!coors) {
        return AppResponse.sendError({
          res: res,
          data: null,
          message: "No avalibale users",
          code: 400
        });
      }
      const totalPages = Math.ceil(total / pageSize);
      return AppResponse.sendSuccess({
        res: res,
        data: {
          coors,
          pagination: {
            total,
            page,
            pageSize,
            totalPages,
          }
        },
        message: "Good",
        code: 200
      })
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

export default CoorController;