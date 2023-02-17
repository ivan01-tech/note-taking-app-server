import express from "express";
import userController from "../controllers/userController.js";

const userRoute = express.Router();

userRoute
  .route("/")
  .get(userController.getAllUser)
  .patch(userController.updateUser)
  .post(userController.createUser)
  .delete(userController.deleteUser);

export default userRoute;
