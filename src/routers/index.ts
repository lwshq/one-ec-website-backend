import express from "express";
import adminRoute from "./admin";
import coopRoute from "./coop";
import coorRoute from "./coor";
const routes = express.Router();

routes.use("/admin", adminRoute);
routes.use("/coop", coopRoute)
routes.use("/coor", coorRoute)
export default routes;
