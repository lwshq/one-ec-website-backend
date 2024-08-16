import { Request, Response, ErrorRequestHandler } from "express";
import AppResponse from "../../utils/AppResponse";
import ArListPaginateAction from "../../actions/ar/arListAction";
import ArShowAction from "../../actions/ar/arShowAction";



class ArController {


    async list(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const coopId = req.coorData.coop_id;

            const { ar, total } = await ArListPaginateAction.execute(page, pageSize, coopId);

            return AppResponse.sendSuccess({
                res,
                data: {
                    ar,
                    total,
                    page,
                    pageSize,
                    totalPages: Math.ceil(total / pageSize),
                },
                message: 'Account registries fetched successfully',
                code: 200
            });
        } catch (error: any) {
            return AppResponse.sendError({
                res,
                data: null,
                message: `Internal server error: ${error.message}`,
                code: 500
            });
        }
    }

    async listAll(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const pageSize = parseInt(req.query.pageSize as string) || 10;
            const coopId = req.coorData.coop_id;

            const { ar, total } = await ArListPaginateAction.listAll(page, pageSize, coopId);

            return AppResponse.sendSuccess({
                res,
                data: {
                    ar,
                    total,
                    page,
                    pageSize,
                    totalPages: Math.ceil(total / pageSize),
                },
                message: 'Account registries fetched successfully',
                code: 200
            });
        } catch (error: any) {
            return AppResponse.sendError({
                res,
                data: null,
                message: `Internal server error: ${error.message}`,
                code: 500
            });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const ar = await ArShowAction.execute(parseInt(id))

            if (!ar) {
                return AppResponse.sendError({
                    res: res,
                    data: null,
                    message: "Coop not found or deleted",
                    code: 404
                })
            }

            return AppResponse.sendSuccess({
                res: res,
                data: ar,
                message: "Coop retrieved successfully",
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

}

export default ArController