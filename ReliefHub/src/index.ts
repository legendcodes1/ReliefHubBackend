import express from "express"
import {prisma} from "./lib/prisma.js"
import { createExerciseController } from "./controllers/excersiseController.js";
import exerciseRouter from "./routes/exerciseRoute.js";

const app = express();
app.use(express.json())
const PORT = 3000;
const router = express.Router();
const routerExercises = express.Router();
const routerBodypart = express.Router();
const routerDiscomfort = express.Router();

app.get("/", (req,res) => {
    res.send({sucess:true});
})

router.get("/", async (req, res) => {
  try {

    const user = await prisma.users.findMany();


    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to find user" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;

    const user = await prisma.users.create({
      data: {
        username,
        email,
      },
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create user" });
  }
});

routerBodypart.post("/", async (req, res) => {
  const {name} = req.body
  try {
    const createBodyPart = await prisma.body_parts.create({
      data: {
      name
      }
    });

    return res.status(201).json(createBodyPart);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create excersise" });
  }
});

routerDiscomfort.post("/", async (req, res) => {
  const {name} = req.body
  try {
    const createDiscomfortyType = await prisma.discomfort_types.create({
      data: {
      name
      }
    });

    return res.status(201).json(createDiscomfortyType);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create Discomfort type" });
  }
});


app.use("/api/v1/users", router)
app.use("/api/v1/excersises", exerciseRouter)
app.use("/api/v1/bodypart", routerBodypart)
app.use("/api/v1/discomfort", routerDiscomfort)

app.listen(PORT, () => console.log("App running: ", PORT))