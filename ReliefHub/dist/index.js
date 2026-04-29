import express from "express";
import cors from "cors";
import exerciseRouter from "./routes/exerciseRoute.js";
import discomfortRouter from "./routes/discomfortRoute.js";
import { env } from "./config/env.js";
import { authRouter } from "./routes/authRoute.js";
const app = express();
app.use(express.json());
// const PORT = 3000;
const routerBodypart = express.Router();
app.get("/", (req, res) => {
    res.send({ sucess: true });
});
app.use(cors({
    origin: env.frontendUrl,
    credentials: true,
}));
app.use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
});
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/exercisises", exerciseRouter);
app.use("/api/v1/bodypart", routerBodypart);
app.use("/api/v1/discomfort", discomfortRouter);
app.listen(env.port, () => console.log("App running: ", env.port));
