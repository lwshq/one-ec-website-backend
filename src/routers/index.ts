import express from "express";
import adminRoute from "./admin";
const routes = express.Router();

routes.use("/admin", adminRoute);

export default routes;
