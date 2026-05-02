import express from "express"
import {prisma} from "./lib/prisma.js"
import { createExerciseController } from "./controllers/excersiseController.js";
import exerciseRouter from "./routes/exerciseRoute.js";
import discomfortRouter from "./routes/discomfortRoute.js";

const app = express();
app.use(express.json())
const PORT = 3000;
const router = express.Router();
const routerBodypart = express.Router();

app.get("/", (req,res) => {
    res.send({sucess:true});
})


app.use("/api/v1/users", router)
app.use("/api/v1/exercisises", exerciseRouter)
app.use("/api/v1/bodypart", routerBodypart)
app.use("/api/v1/discomfort", discomfortRouter)

app.listen(PORT, () => console.log("App running: ", PORT))