import { Request, Response, ErrorRequestHandler } from "express";
import AppError from "../../utils/AppError";
import AppResponse from "../../utils/AppResponse";
import prisma from "../../utils/client";
import RoleCreateAction from "../../actions/role/roleCreateAction";
import RoleUpdateAction from "../../actions/role/roleUpdateAction";
import { ZodError } from "zod";
import { roleSchemaCreate } from "../../utils/validationSchemas";
import RoleShowAction from "../../actions/role/roleShowAction";
import RoleListPaginateAction from "../../actions/role/roleListPaginateAction";
import RoleDeleteAction from "../../actions/role/roleDeleteAction";

class RoleController {

    async create(req: Request, res: Response) {

        try {
            const validation = RoleCreateAction.validate(req.body);

            if (!validation.success) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: `Validation error: ${(validation.error as ZodError).errors.map((err) => err.message).join(", ")}`,
                    code: 400
                })
            }

            const coop = await RoleCreateAction.execute(req.body);

            return AppResponse.sendSuccess({
                res: res,
                data: coop,
                message: "Role created succesfully",
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

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validation = RoleUpdateAction.validate(req.body);

            if (!validation.success) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                    code: 400,
                });
            }

            const roleShow = await RoleShowAction.execute(parseInt(id));

            if (!roleShow) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Role not found",
                    code: 404,
                })
            }


            const role = await RoleUpdateAction.execute(parseInt(id), req.body);


            return AppResponse.sendSuccess({
                res: res,
                data: role,
                message: "Role updated successfully",
                code: 200,
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

    async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const role = await RoleShowAction.execute(parseInt(id))

            if (!role) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Role not found or deleted",
                    code: 404
                })
            }

            return AppResponse.sendSuccess({
                res: res,
                data: role,
                message: "Role retrieved successfully",
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

    async list(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        try {
            const { roles, total } = await RoleListPaginateAction.execute(page, pageSize)

            if (!roles) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "No role available",
                    code: 404,
                })
            }

            const totalPages = Math.ceil(total / pageSize);

            return AppResponse.sendSuccess({
                res: res,
                data: {
                    roles,
                    pagination: {
                        total,
                        page,
                        pageSize,
                        totalPages,
                    }
                },
                message: "Roles retrieved successfully",
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
            const role = await RoleDeleteAction.execute(parseInt(id));

            if (!role) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Role not found",
                    code: 404
                })
            }

            return AppResponse.sendSuccess({
                res: res,
                data: role,
                message: "Role deleted successfully",
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


}

export default RoleController;