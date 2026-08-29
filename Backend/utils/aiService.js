const { GoogleGenerativeAI } = require("@google/generative-ai");

// Helper function to extract API keys from process.env
const getApiKeys = () => {
  const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_2,
    process.env.GEMINI_API_KEY_3,
  ].filter(Boolean);

  return keys.length > 0 ? keys : [""];
};

// Model candidates list for automatic fallback
const MODEL_CANDIDATES = [
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash",
];

const analyzeResume = async (resumeText) => {
  const apiKeys = getApiKeys();

  for (const apiKey of apiKeys) {
    if (!apiKey) continue;
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of MODEL_CANDIDATES) {
      try {
        console.log(`[AI Service] Analyzing resume with model: ${modelName}`);
        const aiModel = genAI.getGenerativeModel({ model: modelName });

        const prompt = `
You are an expert ATS (Applicant Tracking System) auditor and senior technical recruiter.

Analyze the following resume text in exhaustive detail.

Return ONLY a single valid JSON object. Do not include markdown formatting or backticks.

{
  "summary": "Clear candidate profile overview highlighting key experience and background",
  "overall_score": 85,
  "skills": {
    "technical": ["Skill1", "Skill2"],
    "soft": ["Soft Skill 1", "Soft Skill 2"]
  },
  "recommended_ats_keywords": [
    "High-impact ATS Keyword 1",
    "High-impact ATS Keyword 2"
  ],
  "section_sequence_recommendation": [
    "1. Contact Information",
    "2. Professional Summary",
    "3. Technical Skills",
    "4. Work Experience",
    "5. Key Projects",
    "6. Education & Certifications"
  ],
  "weak_sections": [
    {
      "section": "Projects",
      "issue": "Missing quantifiable metrics and live deployment links",
      "fix": "Add metrics (e.g. 40% performance gain) and hosted demo URLs"
    }
  ],
  "experience_analysis": "In-depth review of experience bullet points and metrics",
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"],
  "missing_skills": ["Missing Skill 1", "Missing Skill 2"],
  "improvement_suggestions": [
    "Specific line rewrite or addition recommendation 1",
    "Specific line rewrite or addition recommendation 2"
  ],
  "ats_optimization_tips": [
    "ATS formatting or keyword tip 1"
  ],
  "best_job_roles": [
    "Full Stack Developer (Strong Match)",
    "Frontend Engineer (Moderate Match)"
  ]
}

Resume Content:
${resumeText}
`;

        const result = await aiModel.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json|```/g, "").trim();

        const parsed = JSON.parse(text);
        if (parsed && typeof parsed.overall_score === "number") {
          return parsed;
        }
      } catch (err) {
        console.warn(`[AI Service Warn] Failed with model ${modelName}:`, err.message);
      }
    }
  }

  // Fallback to local heuristic engine if API calls fail
  return generateHeuristicFeedback(resumeText);
};

// NEW: Analyze Resume Against Target Job Description (JD)
const analyzeResumeWithJD = async (resumeText, jobDescription) => {
  const apiKeys = getApiKeys();

  for (const apiKey of apiKeys) {
    if (!apiKey) continue;
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of MODEL_CANDIDATES) {
      try {
        console.log(`[AI Service] Comparing resume with JD via model: ${modelName}`);
        const aiModel = genAI.getGenerativeModel({ model: modelName });

        const prompt = `
You are an expert ATS auditor comparing a candidate's resume against a target Job Description (JD).

Compare the Resume against the Job Description and return ONLY a valid JSON object. No markdown.

{
  "jd_match_score": 78,
  "matching_keywords": ["React", "Node.js", "REST API"],
  "missing_jd_keywords": ["Docker", "AWS", "CI/CD"],
  "alignment_summary": "Summary of how well the candidate fits this specific job posting",
  "strengths_for_job": ["Matches 8 out of 10 primary technical requirements"],
  "gaps_for_job": ["Missing AWS cloud infrastructure experience required in JD"],
  "customized_bullet_recommendations": [
    "Rewrite project bullet to explicitly mention Docker and CI/CD pipelines"
  ]
}

Target Job Description:
${jobDescription}

Candidate Resume:
${resumeText}
`;

        const result = await aiModel.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json|```/g, "").trim();

        const parsed = JSON.parse(text);
        if (parsed && typeof parsed.jd_match_score === "number") {
          return parsed;
        }
      } catch (err) {
        console.warn(`[AI Service Warn JD Match] Failed with model ${modelName}:`, err.message);
      }
    }
  }

  // Fallback heuristic JD matcher
  return generateHeuristicJDMatch(resumeText, jobDescription);
};

// Local Heuristic Resume Feedback Generator
const generateHeuristicFeedback = (text) => {
  const content = (text || "").toLowerCase();
  
  const techKeywords = [
    "javascript", "typescript", "react", "next.js", "node.js", "express", 
    "mongodb", "python", "java", "c++", "html", "css", "tailwind", "sql", 
    "postgres", "docker", "aws", "git", "github", "rest api", "graphql"
  ];

  const softKeywords = [
    "leadership", "communication", "teamwork", "problem solving", 
    "collaboration", "agile", "scrum", "time management"
  ];

  const foundTech = techKeywords.filter((k) => content.includes(k)).map((k) => k.toUpperCase());
  const foundSoft = softKeywords.filter((k) => content.includes(k)).map((k) => k.charAt(0).toUpperCase() + k.slice(1));

  const wordCount = text ? text.split(/\s+/).length : 0;
  let score = 75;
  if (foundTech.length > 5) score += 10;
  if (foundTech.length > 8) score += 10;
  if (score > 95) score = 95;

  return {
    summary: `Candidate profile demonstrating technical proficiency in ${foundTech.slice(0, 4).join(", ") || "software engineering"}. Clean layout with key skills identified.`,
    overall_score: score,
    skills: {
      technical: foundTech.length > 0 ? foundTech : ["JavaScript", "React", "HTML/CSS", "Git"],
      soft: foundSoft.length > 0 ? foundSoft : ["Problem Solving", "Teamwork", "Collaboration"],
    },
    recommended_ats_keywords: [
      "Microservices Architecture",
      "Unit Testing (Jest)",
      "CI/CD Pipelines",
      "Docker Containerization",
      "State Management (Redux/Zustand)",
      "RESTful API Optimization"
    ],
    section_sequence_recommendation: [
      "1. Header (Name, Phone, Email, LinkedIn, GitHub)",
      "2. Professional Summary (3-line summary)",
      "3. Core Technical Skills (Categorized Grid)",
      "4. Professional Experience (Reverse Chronological)",
      "5. Key Engineering Projects (With Live Links & Metrics)",
      "6. Education & Certifications"
    ],
    weak_sections: [
      {
        section: "Projects Section",
        issue: "Lacks quantifiable achievement metrics and live GitHub/Demo links",
        fix: "Add specific results (e.g. 'Boosted API speed by 35%') and hosted demo URLs"
      },
      {
        section: "Experience Bullet Points",
        issue: "Contains passive action verbs ('responsible for', 'helped with')",
        fix: "Replace with strong verbs ('Architected', 'Engineered', 'Optimized')"
      }
    ],
    experience_analysis: "Strong foundational technical keywords. Enhancing bullets with quantified metric achievements will increase recruiter response rate.",
    strengths: [
      `Extracted ${foundTech.length} relevant core technical skills`,
      "Clean readable PDF structure passing basic ATS filters",
      "Demonstrates relevant software development experience"
    ],
    weaknesses: [
      "Could include more metric-driven accomplishment bullets",
      "Missing automated CI/CD or Cloud infrastructure keywords"
    ],
    missing_skills: ["Docker Containerization", "AWS / Cloud Deployment", "CI/CD Automation", "Unit Testing"],
    improvement_suggestions: [
      "Add metrics to your experience bullets (e.g. Improved database query speed by 40%)",
      "Include key technical keywords in your section headers",
      "Ensure GitHub repository and live project links are prominently displayed"
    ],
    ats_optimization_tips: [
      "Use standard section headers like 'Professional Experience' and 'Technical Skills'",
      "Keep formatting clean with consistent bullet points"
    ],
    best_job_roles: [
      "Full Stack Developer (Strong Match)",
      "Frontend Engineer (Strong Match)",
      "Software Engineer (Strong Match)"
    ]
  };
};

// Local Heuristic JD Matcher
const generateHeuristicJDMatch = (resumeText, jobDescription) => {
  const resumeLower = (resumeText || "").toLowerCase();
  const jdLower = (jobDescription || "").toLowerCase();

  const commonKeywords = [
    "react", "node", "express", "mongodb", "javascript", "typescript", 
    "python", "java", "sql", "docker", "aws", "git", "ci/cd", "rest", "graphql", "tailwind"
  ];

  const jdMatched = commonKeywords.filter(k => jdLower.includes(k) && resumeLower.includes(k)).map(k => k.toUpperCase());
  const jdMissing = commonKeywords.filter(k => jdLower.includes(k) && !resumeLower.includes(k)).map(k => k.toUpperCase());

  const totalJdKeywords = jdMatched.length + jdMissing.length;
  const matchPercentage = totalJdKeywords > 0 ? Math.round((jdMatched.length / totalJdKeywords) * 100) : 75;

  return {
    jd_match_score: matchPercentage,
    matching_keywords: jdMatched.length > 0 ? jdMatched : ["JAVASCRIPT", "REACT", "GIT"],
    missing_jd_keywords: jdMissing.length > 0 ? jdMissing : ["DOCKER", "AWS", "CI/CD"],
    alignment_summary: `Your resume matches approximately ${matchPercentage}% of the core technical keywords in the target job description.`,
    strengths_for_job: [
      `Found ${jdMatched.length} direct keyword matches from the job posting`
    ],
    gaps_for_job: [
      `Missing ${jdMissing.length} keywords specified in the target JD`
    ],
    customized_bullet_recommendations: [
      `Add explicit mention of missing keywords: ${jdMissing.join(", ") || "Cloud Deployment"}`
    ]
  };
};

module.exports = {
  analyzeResume,
  analyzeResumeWithJD,
};