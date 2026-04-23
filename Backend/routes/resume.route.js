const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const Resume = require("../model/resume.model");
const fs = require("fs");
const ExtractTextFromPdf = require("../utils/resumeParser");
const analyzeResume = require("../utils/aiService");

const router = express.Router();


// ===================== UPLOAD =====================
router.post("/upload", protect, upload.single("resume"), async (req, res) => {
  try {
    // 🔹 Extract text
    const extractedText = await ExtractTextFromPdf(req.file.path);

    // 🔹 AI Analysis (SAFE)
    let analysis;
    try {
      analysis = await analyzeResume(extractedText);
    } catch (error) {
      console.log("AI ERROR:", error.message);

      analysis = {
        summary: "AI unavailable",
        overall_score: 50,
        skills: { technical: [], soft: [] },
      };
    }

    // 🔹 Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",   // 🔥 THIS IS THE REAL FIX
  folder: "resume",
  format: "pdf",
    });

    // 🔹 Save to DB
    const newResume = await Resume.create({
      userId: req.user._id,
      fileUrl: result.secure_url,
      extractedText: extractedText,
      aiFeedback: analysis,
      atsScore: analysis.overall_score,
    });

    // 🔹 SEND CORRECT RESPONSE (IMPORTANT)
    return res.status(200).json({
      message: "Upload successful",
      fileUrl: result.secure_url,
      atsScore: analysis.overall_score,
      aiFeedback: analysis,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Upload Failed",
    });
  } finally {
    // 🔹 Always delete temp file
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }
  }
});


// ===================== GET ALL =====================
router.get("/my-resumes", protect, async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Resumes fetched successfully",
      count: resumes.length,
      data: resumes,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching resumes",
    });
  }
});


// ===================== GET SINGLE =====================
router.get("/:id", protect, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    // 🔐 Ownership check
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    return res.status(200).json({
      message: "Resume fetched successfully",
      data: resume,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching resume",
    });
  }
});


// ===================== DELETE =====================
router.delete("/:id", protect, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found",
      });
    }

    // 🔐 Ownership check
    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await Resume.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: "Resume deleted successfully",
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error deleting resume",
    });
  }
});

module.exports = router;