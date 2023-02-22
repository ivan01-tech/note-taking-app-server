import mongoose, { Types, InferSchemaType } from "mongoose";
import mongooseSequence from "mongoose-sequence";

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
/* const AutoIncrement = mongooseSequence(NoteSchema);
NoteSchema.plugin(AutoIncrement, {
  inc_field: "ticket",
  id: "ticketNums",
  start_seq: 500,
});
 */
export default mongoose.model<NoteTypes>("Note", NoteSchema);
