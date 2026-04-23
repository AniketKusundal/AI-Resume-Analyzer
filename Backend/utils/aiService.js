const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeResume = async (resumeText) => {
  try {
    const aiModel = genAI.getGenerativeModel({
      model: "gemini-3-flash-preview", // ✅ more stable than preview
    });

    const prompt = `
You are an expert ATS (Applicant Tracking System) and senior technical recruiter.

Analyze the following resume in a highly detailed and structured way.

Return ONLY valid JSON. Do not include backticks.

{
  "summary": "",
  "overall_score": 0,
  "skills": {
    "technical": [],
    "soft": []
  },
  "experience_analysis": "",
  "strengths": [],
  "weaknesses": [],
  "missing_skills": [],
  "improvement_suggestions": [],
  "ats_optimization_tips": [],
  "best_job_roles": []
}

Resume:
${resumeText}
`;

    const result = await aiModel.generateContent(prompt);

    let text = result.response.text();

    // 🔥 CLEAN RESPONSE
    text = text.replace(/```json|```/g, "").trim();

    // 🔥 SAFE PARSE
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch (parseError) {
      console.log("JSON PARSE ERROR:", parseError.message);

      return {
        summary: "AI response format error",
        overall_score: 50,
        skills: { technical: [], soft: [] },
        experience_analysis: "",
        strengths: [],
        weaknesses: [],
        missing_skills: [],
        improvement_suggestions: [],
        ats_optimization_tips: [],
        best_job_roles: [],
      };
    }

  } catch (error) {
    console.log("AI ERROR:", error.message);

    // 🔥 FALLBACK (VERY IMPORTANT)
    return {
      summary: "AI service temporarily unavailable",
      overall_score: 50,
      skills: { technical: [], soft: [] },
      experience_analysis: "",
      strengths: [],
      weaknesses: [],
      missing_skills: [],
      improvement_suggestions: [],
      ats_optimization_tips: [],
      best_job_roles: [],
    };
  }
};

module.exports = analyzeResume;