import mongoose from "mongoose";
import { userRoles } from "../constants";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  roles: [
    {
      type: String,
      default: userRoles.employee,
    },
  ],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
