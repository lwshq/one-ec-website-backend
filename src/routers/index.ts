import express from "express";
import adminRoute from "./admin";
import coopRoute from "./coop";
const routes = express.Router();

routes.use("/admin", adminRoute);
routes.use("/coop", coopRoute)
export default routes;
