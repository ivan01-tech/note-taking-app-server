import mongoose, { InferSchemaType } from "mongoose";
import { userRoles } from "../constants.js";

// export interface UserTypes {
//   username: string;
//   password: string;
//   active: boolean;
//   roles: string[];
// }

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

export type UserTypes = InferSchemaType<typeof UserSchema>;

export default mongoose.model<UserTypes>("User", UserSchema);
