import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import 'dotenv/config';
// import config from './config.json' assert { type: 'json' };

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const config = require('./config.json');

import { User } from './models/user.model.js';

mongoose.connect(config.connectionstring);

const app = express();
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.use(express.json({limit: 16000}));

app.use(cors(
    {
        origin: 'process.env.CORS_ORIGIN',
        credentials: true,

    }
));

// express.use(express.static("public"));

app.use(express.urlencoded({
    extended: true,
    limit: '16mb'
}));

// create account api
app.post("/create-account", async (req, res) => {
    const {username, password, email} = req.body;
    if(!username || !password || !email) {
   return res.status(400).json({error: true, message: 'ALL FIELDS ARE REQUIRED'});
    }

    const isUser  = await User.findOne({email});
    if(isUser) {
        return res.status(400).json({error: true, message: 'Email already exists'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        username,
        password: hashedPassword,
        email
    });

    await user.save();

    const accessToken = jwt.sign(
        { userId: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"72h"}
    );
    return res.status(201).json({ error: false, user: {username: user.username, email: user.email}, accessToken,
        message: 'Registration Successfully'
     });
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
export {app};