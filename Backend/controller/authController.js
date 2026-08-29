const User = require("../model/user.model");
const bcrypt = require('bcrypt');
const genrateToken = require("../utils/genrateToken");

async function HandelSignUpUser(req, res) {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({
                Message: "All fields (first_name, last_name, email, password) are required",
                message: "All fields (first_name, last_name, email, password) are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Check if Existing User
        const ExistingUser = await User.findOne({ email: normalizedEmail });
        if (ExistingUser) {
            return res.status(400).json({
                Message: "User with this email already exists",
                message: "User with this email already exists"
            });
        }

        // Hash Password
        const HashPassword = await bcrypt.hash(password, 10);

        // Create User
        const UserData = await User.create({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: normalizedEmail,
            password: HashPassword,
        });

        const userResponse = {
            _id: UserData._id,
            first_name: UserData.first_name,
            last_name: UserData.last_name,
            email: UserData.email,
        };

        const token = genrateToken(UserData._id);

        return res.status(201).json({
            Message: "User Created Successfully",
            message: "User Created Successfully",
            user: userResponse,
            token
        });
    } catch (error) {
        console.error("SignUp Error:", error);
        return res.status(500).json({
            Message: "Server Error during registration",
            message: "Server Error during registration"
        });
    }
}

async function HandelLoginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                Message: "Email and password are required",
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find User 
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({
                Message: "Invalid Email or Password",
                message: "Invalid Email or Password"
            });
        }

        // Compare Password
        const ismatch = await bcrypt.compare(password, user.password);

        if (!ismatch) {
            return res.status(400).json({
                Message: "Invalid Email or Password",
                message: "Invalid Email or Password"
            });
        }

        const token = genrateToken(user._id);

        const userResponse = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };

        return res.status(200).json({
            Message: "Login Successfully",
            message: "Login Successfully",
            token,
            user: userResponse, 
        });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            Message: "Server Error during login",
            message: "Server Error during login"
        });
    }
}

module.exports = {
    HandelLoginUser,
    HandelSignUpUser,
};