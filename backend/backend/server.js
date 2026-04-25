const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(express.json());

/* ------------------- MongoDB Connection ------------------- */

mongoose.connect("mongodb://127.0.0.1:27017/relieflink", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
});

/* ------------------- Volunteer Model ------------------- */

const volunteerSchema = new mongoose.Schema({
  name: String,
  skills: [String],
  available: Boolean
});

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

/* ------------------- Tasks (temporary storage) ------------------- */

let tasks = [];

/* ------------------- Routes ------------------- */

// Home route
app.get("/", (req, res) => {
  res.send("Smart Volunteer Backend Running 🚀");
});

/* ------------------- Volunteers ------------------- */

// Get all volunteers
app.get("/volunteers", async (req, res) => {
  const volunteers = await Volunteer.find();
  res.json(volunteers);
});

// Add volunteer
app.post("/volunteers", async (req, res) => {

  const volunteer = new Volunteer({
    name: req.body.name,
    skills: req.body.skills,
    available: req.body.available
  });

  await volunteer.save();

  res.json(volunteer);
});

/* ------------------- Tasks ------------------- */

// Create task and match volunteers
app.post("/tasks", async (req, res) => {

  const { skill_required } = req.body;

  const matched = await Volunteer.find({
    skills: skill_required,
    available: true
  });

  const task = {
    id: tasks.length + 1,
    skill_required,
    matched_volunteers: matched
  };

  tasks.push(task);

  res.json(task);
});

// Get tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

/* ------------------- Server ------------------- */

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});