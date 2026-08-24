import mongoose, { mongo } from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationCode: { type: String, default: "" },
    cartData: { type: Object, default: {} },
    verificationCodeExpires: { type: Date, default: null },
  },
  { minimize: false, timestamps: true },
);
const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
