require('dotenv').config()
const express = require('express')
const app = express()



// Database COnnection

app.use(express.json())
app.use(express.urlencoded({ extended:true }))



app.get('/' , (req , res) => {
    res.send("API Is running.....")
})



app.listen(process.env.PORT , () => {
    console.log(`Server Is Running On ${process.env.PORT}`)
})