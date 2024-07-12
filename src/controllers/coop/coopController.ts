import { Request, Response, ErrorRequestHandler } from "express";
import CoopCreateAction from "../../actions/coop/coopCreateAction";
import AppResponse from "../../utils/AppResponse";
import CoopUpdateAction from "../../actions/coop/coopUpdateAction";
import CoopShowAction from "../../actions/coop/coopShowAction";

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
                })
            }

            const coop = await CoopCreateAction.execute(req.body);

            return AppResponse.sendSuccess({
                res: res,
                data: coop,
                message: "Campus created succesfully",
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
                    message: "Coop not found",
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

}

export default CoopController;