import { Request, Response, NextFunction } from "express";
import config from "../config";
import AppResponse from "../utils/AppResponse";

const api_key = config.key.x_key;

const apiKeyAuth =  (req: Request, res:Response, next : NextFunction) =>
{
    const apiKeyHeader = req.headers['x-api-key'];

    if (apiKeyHeader && apiKeyHeader=== api_key) 
    {
        next();
    }
    else
    {
        return AppResponse.sendError({
            res:res,
            data:null,
            message:"Forbidden Access",
            code : 403
        });
    }

};

export default apiKeyAuth;