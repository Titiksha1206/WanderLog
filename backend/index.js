import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import "dotenv/config";

import { authenticateToken } from "./utilities.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);
const config = require("./config.json");

import { User } from "./models/user.model.js";
import { TravelStory } from "./models/travelStory.model.js";

mongoose.connect(config.connectionstring);

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json()); // middleware to parse JSON

app.use(
  cors({
    origin: "process.env.CORS_ORIGIN",
    credentials: true,
  })
);

// express.use(express.static("public"));

app.use(
  express.urlencoded({
    extended: true,
    limit: "16mb",
  })
);

// create account api
app.post("/create-account", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ error: true, message: "ALL FIELDS ARE REQUIRED" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res
      .status(400)
      .json({ error: true, message: "Email already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    password: hashedPassword,
    email,
  });

  await user.save();

  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "72h" }
  );
  return res
    .status(201)
    .json({
      error: false,
      user: { username: user.username, email: user.email },
      accessToken,
      message: "Registration Successfully",
    });
});

// create LOGIN API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "ALL FIELDS ARE REQUIRED" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid credentials" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res
      .status(400)
      .json({ error: true, message: "Invalid credentials" });
  }
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "72h" }
  );
  return res.status(400).json({
    error: false,
    user: { username: user.username, email: user.email },
    accessToken,
    message: "Login Successful",
  });
});

// get User API
app.get("/get-user", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({ user: isUser, message: "" });
});

// ADD travel story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, visitedDate, imageUrl } = req.body;
  const { userId } = req.user;

  // validate required fields
  if (!title || !story || !visitedLocation || !visitedDate || !imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "ALL FIELDS ARE REQUIRED" });
  }

  // convert visitedDate from milliseconds to Date object
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const newStory = new TravelStory({
      title,
      story,
      visitedLocation,
      visitedDate: parsedVisitedDate,
      imageUrl,
      userId,
    });

    await newStory.save();
     res
      .status(201)
      .json({ story: newStory, message: "Travel Story added successfully" });
  } catch (error) {
     res.status(400).json({ error: true, message: error.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { app };
