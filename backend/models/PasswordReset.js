import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PasswordResetSchema = new Schema({
  userId: String,
  resetString: String,
  createdAt: Date,
  expireAt: Date,
});

const PasswordReset = mongoose.model("PasswordReset", PasswordResetSchema);

export default PasswordReset;
