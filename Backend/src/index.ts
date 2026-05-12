import express from "express";
import cors from "cors";

import exerciseRouter from "./routes/exerciseRoute.js";
import exerciseReactionRouter from "./routes/exerciseReactionRoute.js";
import discomfortRouter from "./routes/discomfortRoute.js";
import bodyPartRouter from "./routes/bodyPartRoute.js";
import savedExerciseRouter from "./routes/savedExerciseRoute.js";
import { authRouter } from "./routes/authRoute.js";
import routineRouter from "./routes/routineRoute.js";

import { env } from "./config/env.js";

const app = express();

const allowedOrigins = [
  env.frontendUrl,
  "http://192.168.1.79:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (_req, res) => {
  res.send({ success: true });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/exercises", exerciseRouter);
app.use("/api/v1/exercise-reactions", exerciseReactionRouter);
app.use("/api/v1/body-parts", bodyPartRouter);
app.use("/api/v1/discomfort-types", discomfortRouter);
app.use("/api/v1/saved-exercises", savedExerciseRouter);
app.use("/api/v1/routines", routineRouter);

app.use((_req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.listen(env.port, () => {
  console.log(`App running on port ${env.port}`);
});