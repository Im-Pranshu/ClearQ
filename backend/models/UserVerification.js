import mongoose from "mongoose";

const Schema = mongoose.Schema;

const UserVerificationSchema = new Schema({
  userId: String,
  uniqueString: String,
  createdAt: Date,
  expireAt: Date,
});

const UserVerification = mongoose.model(
  "UserVerification",
  UserVerificationSchema
);

export default UserVerification;
