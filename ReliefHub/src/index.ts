import express from "express"
import {prisma} from "./lib/prisma.js"

const app = express();
app.use(express.json())
const PORT = 3000;
const router = express.Router();
const routerExercises = express.Router();
const routerBodypart = express.Router();

app.get("/", (req,res) => {
    res.send({sucess:true});
})


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


routerExercises.get("/", async (req, res) => {
  try {
    const user = await prisma.exercises.findMany({
    });

    return res.status(201).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to get excersise" });
  }
});

routerExercises.post("/", async (req, res) => {
  const {title, description, video_url, safety_notes} = req.body
  try {
    const excersises = await prisma.exercises.create({
      data: {
      title, 
      description, 
      video_url, 
      safety_notes
      }
    });

    return res.status(201).json(excersises);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create excersise" });
  }
});

routerExercises.put("/:id", async (req, res) => {
  const {id}  = req.params
  const {title, description, video_url, safety_notes} = req.body
  try {
    const excersises = await prisma.exercises.update({
      where: { id: id },
      data: { title, description, video_url, safety_notes },
 
    });

    return res.status(200).json(excersises);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create excersise" });
  }
});

routerExercises.delete("/:id", async (req, res) => {
  const {id}  = req.params
  try {
    const excersises = await prisma.exercises.delete({
      where: { id: id }
 
    });

    return res.status(201).json(excersises);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create excersise" });
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

app.use("/api/v1/users", router)
app.use("/api/v1/excersises", routerExercises)
app.use("/api/v1/bodypart", routerBodypart)

app.listen(PORT, () => console.log("App running: ", PORT))