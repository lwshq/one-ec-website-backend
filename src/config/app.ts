import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import AppError from "../utils/AppError";
import routes from "../routers";
import morgan from "morgan";
import swagger from "../utils/swagger";
import cors from "cors";
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.set('trust proxy', true);
// Development logging
if (process.env.PROJECT_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/", routes);
swagger(app);

app.get("/", (req, res) => {
  return res.redirect("/docs");
});

// Global Error Handler for all routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

export default app;