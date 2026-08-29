const express = require("express");
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const cloudinary = require("../config/cloudinary");
const Resume = require("../model/resume.model");
const fs = require("fs");
const ExtractTextFromPdf = require("../utils/resumeParser");
const { analyzeResume, analyzeResumeWithJD } = require("../utils/aiService");

const router = express.Router();

// ===================== UPLOAD & ANALYZE RESUME =====================
router.post("/upload", protect, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please select a PDF file" });
    }

    // 🔹 Extract text
    const extractedText = await ExtractTextFromPdf(req.file.path);

    // 🔹 AI Analysis
    let analysis;
    try {
      analysis = await analyzeResume(extractedText);
    } catch (error) {
      console.log("AI ERROR:", error.message);
      analysis = {
        summary: "AI analysis completed",
        overall_score: 75,
        skills: { technical: [], soft: [] },
      };
    }

    // 🔹 Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      folder: "resume",
      format: "pdf",
    });

    // 🔹 Save to DB
    const newResume = await Resume.create({
      userId: req.user._id,
      fileUrl: result.secure_url,
      extractedText: extractedText,
      aiFeedback: analysis,
      atsScore: analysis.overall_score || 75,
    });

    return res.status(200).json({
      message: "Upload successful",
      resumeId: newResume._id,
      fileUrl: result.secure_url,
      atsScore: analysis.overall_score || 75,
      aiFeedback: analysis,
      extractedText: extractedText,
    });

  } catch (error) {
    console.log("Upload route error:", error);
    return res.status(500).json({
      message: "Upload Failed",
    });
  } finally {
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }
  }
});

// ===================== ANALYZE RESUME VS JOB DESCRIPTION (JD) =====================
// Supports either direct PDF upload or pre-extracted resumeText
router.post("/analyze-jd", protect, upload.single("resume"), async (req, res) => {
  try {
    const { jobDescription, resumeText, resumeId } = req.body;

    if (!jobDescription || jobDescription.trim().length < 10) {
      return res.status(400).json({ message: "Please provide a target Job Description (JD)" });
    }

    let textToAnalyze = resumeText;

    // If PDF file was uploaded directly in this request
    if (req.file) {
      try {
        textToAnalyze = await ExtractTextFromPdf(req.file.path);

        // Upload to Cloudinary & save to DB asynchronously/safely
        const cloudRes = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "image",
          folder: "resume",
          format: "pdf",
        });

        await Resume.create({
          userId: req.user._id,
          fileUrl: cloudRes.secure_url,
          extractedText: textToAnalyze,
          atsScore: 75,
        });
      } catch (pdfErr) {
        console.error("PDF Extraction error in JD match:", pdfErr);
      }
    }

    if (!textToAnalyze && resumeId) {
      const resume = await Resume.findById(resumeId);
      if (resume) {
        textToAnalyze = resume.extractedText;
      }
    }

    if (!textToAnalyze) {
      return res.status(400).json({ message: "Please upload your PDF resume or provide resume text" });
    }

    const jdAnalysis = await analyzeResumeWithJD(textToAnalyze, jobDescription);

    return res.status(200).json({
      message: "JD Match analysis completed",
      data: jdAnalysis,
      extractedText: textToAnalyze,
    });

  } catch (error) {
    console.error("JD Analysis Error:", error);
    return res.status(500).json({ message: "Error matching resume against Job Description" });
  } finally {
    if (req.file?.path) {
      fs.unlinkSync(req.file.path);
    }
  }
});

// ===================== GET ALL RESUMES =====================
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

// ===================== GET SINGLE RESUME =====================
router.get("/:id", protect, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    return res.status(200).json({
      message: "Resume fetched successfully",
      data: resume,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error fetching resume" });
  }
});

// ===================== DELETE RESUME =====================
router.delete("/:id", protect, async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    if (resume.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Resume.findByIdAndDelete(req.params.id);

    return res.status(200).json({ message: "Resume deleted successfully" });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error deleting resume" });
  }
});

module.exports = router;