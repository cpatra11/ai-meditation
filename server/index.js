import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import audioRoutes from "./routes/audioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authMiddleware, audioRoutes);
app.use("/auth", authRoutes);

app.get("/", (_, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 4000}`);
});
