const express = require('express');
const { HandelSignUpUser, HandelLoginUser } = require('../controller/authController');
const protect = require('../middleware/authMiddleware');
const User = require('../model/user.model');
const router = express.Router();

router.post('/signIn', HandelSignUpUser);
router.post('/login', HandelLoginUser);

// GET User Profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching profile" });
  }
});

// UPDATE User Profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { first_name, last_name, target_role, bio, linkedin, github, portfolio } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        first_name: first_name !== undefined ? first_name : req.user.first_name,
        last_name: last_name !== undefined ? last_name : req.user.last_name,
        target_role: target_role !== undefined ? target_role : req.user.target_role,
        bio: bio !== undefined ? bio : req.user.bio,
        linkedin: linkedin !== undefined ? linkedin : req.user.linkedin,
        github: github !== undefined ? github : req.user.github,
        portfolio: portfolio !== undefined ? portfolio : req.user.portfolio,
      },
      { new: true }
    ).select('-password');

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;