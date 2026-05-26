import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import tradeRoutes from "./routes/tradeRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("GET / received");
  res.send("Trading Journal Backend Running");
});

app.use("/api/trades", tradeRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

app.listen(5001, "127.0.0.1", () => {
  console.log("Server running on http://127.0.0.1:5001");
});