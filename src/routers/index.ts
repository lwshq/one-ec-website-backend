import express from "express";
import adminRoute from "./admin";
import coopRoute from "./coop";
import coorRoute from "./coor";
import roleRoute from "./role";
import billRoute from "./bill";
import arRoute from "./ar";
const routes = express.Router();

routes.use("/admin", adminRoute);
routes.use("/coop", coopRoute);
routes.use("/coor", coorRoute);
routes.use("/role", roleRoute);
routes.use("/bill", billRoute)
routes.use("/ar", arRoute)

export default routes;
