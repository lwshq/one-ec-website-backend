import { Request, Response, ErrorRequestHandler } from "express";
import CoopCreateAction from "../../actions/coop/coopCreateAction";
import AppResponse from "../../utils/AppResponse";
import CoopUpdateAction from "../../actions/coop/coopUpdateAction";
import CoopShowAction from "../../actions/coop/coopShowAction";
import CoopListAction from "../../actions/coop/coopListAction";
import CoopDeleteAction from "../../actions/coop/coopDeleteAction";
import prisma from "../../utils/client";

class CoopController {
    async create (req: Request, res: Response) {
        try {
            const validation = CoopCreateAction.validate(req.body);

            if (!validation.success) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                    code: 400
                });
            }

            // Check if the email already exists
            const existingCoordinator = await prisma.coopCoordinator.findUnique({
                where: { email: req.body.coordinator.email }
            });

            if (existingCoordinator) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Email already exists",
                    code: 400
                });
            }

            const { coop, coordinator, role } = await CoopCreateAction.execute(req.body);

            return AppResponse.sendSuccess({
                res: res,
                data: { coop, coordinator, role },
                message: "Cooperative created successfully",
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
            const validation = CoopUpdateAction.validate(req.body);

            if (!validation.success) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: `Validation error: ${validation.error.errors.map((err) => err.message).join(", ")}`,
                    code: 400,
                });
            }

            const coopShow = await CoopShowAction.execute(parseInt(id));

            if (!coopShow) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Coop not found",
                    code: 404,
                })
            }


            const coop = await CoopUpdateAction.execute(parseInt(id), req.body);


            return AppResponse.sendSuccess({
                res: res,
                data: coop,
                message: "Campus updated successfully",
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
            const coop = await CoopShowAction.execute(parseInt(id))

            if (!coop) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Coop not found or deleted",
                    code: 404
                })
            }

            return AppResponse.sendSuccess({
                res: res,
                data: coop,
                message: "Campus retrieved successfully",
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
            const { coops, total } = await CoopListAction.execute(page, pageSize)

            if (!coops) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "No coop available",
                    code: 404,
                })
            }

            const totalPages = Math.ceil(total / pageSize);

            return AppResponse.sendSuccess({
                res: res,
                data: {
                    coops,
                    pagination: {
                        total,
                        page,
                        pageSize,
                        totalPages,
                    }
                },
                message: "Coops retrieved successfully",
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
            const coop = await CoopDeleteAction.execute(parseInt(id));

            if (!coop) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Coop not found",
                    code: 404
                })
            }

            return AppResponse.sendSuccess({
                res: res,
                data: coop,
                message: "Coop deleted successfully",
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

export default CoopController;