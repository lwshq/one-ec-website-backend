import { Response } from "express";

type ResponseParamsType = {
  res: Response;
  data: unknown;
  message?: string;
  code: number;
  totalResults?: number;
};

class AppResponse {
  static sendSuccess({
    res,
    data,
    message,
    code,
    totalResults,
  }: ResponseParamsType): void {
    res.status(code).json({
      status: "success",
      message,
      ...(totalResults && { totalResults }),
      data,
      code,
    });
  }

  static sendError({ res, data, message, code }: ResponseParamsType): void {
    res.status(code).json({
      status: "error",
      data,
      message,
      code,
    });
  }
}

export default AppResponse;