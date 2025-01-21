import mongoose from "mongoose";

const Schema = mongoose.Schema;

const todoSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    uniqueId: { type: String, required: true }, // New field to store unique ID
    title: { type: String, required: true },
    description: { type: String, required: true },
    completedOn: { type: String },
    isCompleted: { type: Boolean, default: false }, // New field to track completion status
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema);

export default Todo;
