import express from "express";
import authLimiter from "../middleware/loginLimitter";
import authController from "../controllers/authController";

const authRoute = express.Router();

authRoute.route("/").post(authLimiter, authController.login);

authRoute.route("/refresh").get(authController.refresh);

authRoute.route("/logout").post(authController.logout);

export default authRoute;
