import mongoose, { Types, InferSchemaType } from "mongoose";
import mongooseSequence from "mongoose-sequence";

const connection = mongoose.createConnection(process.env.DATABASE_URL!);

const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    text: {
      type: String,
      require: true,
    },
    complete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export type NoteTypes = InferSchemaType<typeof NoteSchema>;

export default mongoose.model<NoteTypes>("Note", NoteSchema);
