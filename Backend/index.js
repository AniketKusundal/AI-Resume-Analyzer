require('dotenv').config()
const express = require('express')
const ConnectDB = require('./config/connection')
const UserRouter = require('./routes/user.route')
const ResumeRoute = require('./routes/resume.route')
const JobRoute = require('./routes/jobs.route')
const cors = require('cors')
const app = express()



// Database COnnection
ConnectDB();

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended:true }))


// All Routes Here 
app.use('/user' , UserRouter)
app.use('/resume' , ResumeRoute)
app.use('/job' , JobRoute)






app.listen(process.env.PORT , () => {
    console.log(`Server Is Running On ${process.env.PORT}`)
})