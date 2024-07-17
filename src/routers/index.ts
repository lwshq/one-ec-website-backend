import express from "express";
import adminRoute from "./admin";
import coopRoute from "./coop";
import coorRoute from "./coor";
import roleRoute from "./role";
const routes = express.Router();

routes.use("/admin", adminRoute);
routes.use("/coop", coopRoute);
routes.use("/coor", coorRoute);
routes.use("/role", roleRoute);
export default routes;
