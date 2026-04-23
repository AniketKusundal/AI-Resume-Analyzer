const User = require("../model/user.model");
const bcrypt = require('bcrypt');
const genrateToken = require("../utils/genrateToken");


async function HandelSignUpUser(req , res) {

    try 
    {
        const {first_name , last_name , email , password} = req.body;

        // check the Existing User Or Not

        const ExistingUser = await User.findOne({ email})
        if (ExistingUser) {
            return res.status(400).json({Message : "User Already Exist"})
        }

        // Hass a Password
        const HashPassword = await bcrypt.hash(password , 10)

        //  Now Create User
        const UserData = await User.create({
            first_name,
            last_name,
            email,
            password :HashPassword,
        })

        const userResponse = {
          _id: UserData._id,
          first_name: UserData.first_name,
          last_name: UserData.last_name,
          email: UserData.email,
        };

        return res.status(201).json({
          Message: "User Created Successfully",
          user: userResponse,
        });
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({Message : "Server Error"})
    }
}


async function HandelLoginUser(req , res) {

    try 
    {
        const {email , password} = req.body;


        // Find User 
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({Message : "Invalid EMail And Password"})
        }

        // Compare Password

        const ismatch = await bcrypt.compare(password , user.password);

        if (!ismatch) {
            return res.status(400).json({Message : "Invalid Eamil Or Password"})
        }

        const token = genrateToken(user._id)

        return res.status(200).json({
            Message : "Login Successfully",
            token,
            user, 
        })
    } 
    catch (error)
    {
        res.return(500).json({Message : "Server Error"})
    }
}



module.exports = {
    HandelLoginUser,
    HandelSignUpUser,
}