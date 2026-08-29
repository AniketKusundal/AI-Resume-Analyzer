require('dotenv').config();
const express = require('express');
const ConnectDB = require('./config/connection');
const UserRouter = require('./routes/user.route');
const ResumeRoute = require('./routes/resume.route');
const JobRoute = require('./routes/jobs.route');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Database Connection
ConnectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route for Deployment Platforms (Render/Vercel)
app.get('/', (req, res) => {
    res.json({ message: "ResuMatch AI Backend API is Running Cleanly 🚀", status: "OK" });
});

// All API Routes 
app.use('/user', UserRouter);
app.use('/resume', ResumeRoute);
app.use('/job', JobRoute);

app.listen(PORT, () => {
    console.log(`Server Is Running On Port ${PORT}`);
});