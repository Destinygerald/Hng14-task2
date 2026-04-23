import express from "express";
import cors from "cors";
import { Routes } from "./routes/index.js";
import { globalErrorHandler } from "./middleware/error-handler.js";

export const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  }),
);

app.use("/api/profiles", Routes);

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.use(globalErrorHandler);
