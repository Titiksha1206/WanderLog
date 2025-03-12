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

//Edit Travel Story 
app.post("/edit-story/:id", authenticateToken, async(req, res) => {
    const { id } = req.params;
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;
  

  // validate required fields
  if (!title || !story || !visitedLocation || !visitedDate || !imageUrl) {
    return res
      .status(400)
      .json({ error: true, message: "ALL FIELDS ARE REQUIRED" });
  }

  /* convert visitedDate from milliseconds to Date object
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
}); */

//convert visitedDate from miliseconds to Date object
    const parsedVisitedDate = new Date (parseInt(visitedDate));

    try{
        //find travel story by ID and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if(!travelStory){
            return res.status(404).json({error: true, message:"Travel story not found"});
        }

            const placeholderImgUrl = 'http://localhost:8000/assets/placeholder.png';

            travelStory.title = title;
            travelStory.story = story;
            travelStory.visitedLocation = visitedLocation;
            travelStory.imageUrl = imageUrl || placeholderImgUrl;
            travelStory.visitedDate = parsedVisitedDate;

            await travelStory.save();
            res.status(200).json({story:travelStory, message:'Update Successful'});
    }catch (error) {
        res.status(500).json({error: true, message:error.message});
    }
  } );

  

//Delete a Travel Story
 app.delete("/delete-story/:id", authenticateToken, async(req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try{
        //find travel story by ID and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if(!travelStory){
            return res.status(404).json({error: true, message:"Travel story not found"});
        }
        //Delete the travel story from the database
        await travelStory.deleteOne({_id: id, userId: userId});

        //Extract the filename from imageUrl 
        const imageUrl = travelStory.imageUrl;
        const filename = Path2D.basename(imageUrl);

        //define the file path 
        const filePath = Path2D.join(__dirname,'uploads',filename);

        //delete the image file from the uploads folder 
        FileSystem.unlink(filePath,(err)=> {
            if (err){
                console.error("Failed to delete image file:",err);
                //Optionally, you could still respond with a success status here
                //if you don't want to treat this as a critical error.
            }
        });
        res.status(200).json({message:"Travel story deleted successfully"});
    } catch (error){
        res.status(500).json({error: true, message:error.message});
    }
  })


  //Update isFavourite
 app.put("/update-is-favourite/:id", authenticateToken, async(req, res) => {
    const { id } =req.params;
    const { isFavourite } = req.body;
    const { iserId} = req.user;

    try{
        const travelStory = await TravelStory.findOne({_id: id, userId: userId});

        if(!travelStory){
            return res.status(404).json({error: true,message: "Travel story not found"});
        }

        travelStory.isFavourite = isFavourite;

        await travelStory.save();
        res.status(200).json({story:travelStory,message:'Update Successful' });
    } catch (error){
        res.status(500).json({error: true, message:error.message});
    }
    })


//Search travel stories
 app.post("/search/:id", authenticateToken, async(req, res) => {
    const { query }=req.query;
    const { userId } = req.user;

    if (!query) {
        return res.status(404).json({error: true , message: "query is required" });
    }

    try{
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                {  title: { $regex: query, $options: "i" }},
       {  story: { $regex: query, $options: "i" }},
                { visitedLocation: { $regex: query, $options: "i" }},
            ],
        }).sort({ isFavourite: -1});

        res.status(200).json({stories: searchResults});
    }catch (error){
        res.status(500).json({error: true, message:error.message});
    }
 })  


//Filter travel stories by date range
 app.get("/travel-stories/filter", authenticateToken, async(req, res) => {
        const { startDate, endDate } = req.query;
        const { userId } = req.user;

        try{
            //convert startdate and endDate from miliseconds to Date objects
            const start = new Date (parseInt(startDate));
            const end = new Date(parseInt(endDate));

            //find travel stories that belong to the authenticated user and fall within the date range
            const filteredStories = await TravelStory.find({
                userId: userId,
                visitedDate:{ $gte: start, $lte: end },
            }).sort({ isFavourite: -1});

            res.status(200).json({stories: filteredStories});
        }catch (error){
            res.status(500).json({error: true, message:error.message});
        }
    });      
  
  
  
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export { app };
