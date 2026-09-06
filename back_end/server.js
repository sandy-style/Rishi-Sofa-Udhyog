import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDb from "./config/mongoDb.js";
import dns from "node:dns";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import cartRoute from "./routes/cartRoute.js";
import productRouter from "./routes/productRoute.js";
import orderRouter from "./routes/orderRoute.js";
import notificationRouter from "./routes/notificationRoute.js";
import pushSubscriptionRouter from "./routes/pushSubscriptionRoute.js";
// app config
const app = express();
const PORT = process.env.PORT || 4000;

dns.setServers(["1.1.1.1", "8.8.8.8"]);
try {
  connectDb();
} catch (error) {
  console.log(error);
}
connectCloudinary();
// middlewares
app.use(express.json());
app.use(cors());

// endpoints
app.use("/api/user", userRouter);
app.use("/api/cart", cartRoute);
app.use("/api/admin", productRouter);
app.use("/api/order", orderRouter);
app.use("/api/notification", notificationRouter);
app.use("/api/push", pushSubscriptionRouter);
app.get("/", (req, res) => {
  res.send("api working");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`server running on http://localhost:${PORT}`);
});
