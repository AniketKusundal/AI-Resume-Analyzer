const express = require('express')
const { HandelSignUpUser, HandelLoginUser } = require('../controller/authController');
const protect = require('../middleware/authMiddleware');
const router = express.Router()


router.post('/signIn' , HandelSignUpUser),
router.post("/login" , HandelLoginUser),



router.post("/profile" , protect , (req, res)=> {
    res.json({
        Message : "protected route working",
        user : req.user,
    })
})


module.exports = router;