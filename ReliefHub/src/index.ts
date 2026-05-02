import express from "express"
import cors from "cors";
import exerciseRouter from "./routes/exerciseRoute.js";
import discomfortRouter from "./routes/discomfortRoute.js";
import bodyPartRouter from "./routes/bodyPartRoute.js";
import savedExerciseRouter from "./routes/savedExerciseRoute.js";
import { env } from "./config/env.js";
import { authRouter } from "./routes/authRoute.js";

const app = express();
app.use(express.json())

app.get("/", (req,res) => {
    res.send({sucess:true});
})

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);



app.use("/api/v1/auth", authRouter);
app.use("/api/v1/exercises", exerciseRouter)
app.use("/api/v1/body-parts", bodyPartRouter)
app.use("/api/v1/discomfort-types", discomfortRouter)
app.use("/api/v1/saved-exercises", savedExerciseRouter)

app.listen(env.port, () => console.log("App running: ", env.port))

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});
