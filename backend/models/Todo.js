import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import uuid library

const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    completedOn: { type: String },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
