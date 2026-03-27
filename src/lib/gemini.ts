"use server";

import { GoogleGenerativeAI, SchemaType, ResponseSchema } from "@google/generative-ai";

export async function summarizeGithubRepos(reposText: string) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            company: { type: SchemaType.STRING, description: "The project or repository name" },
            position: { type: SchemaType.STRING, description: "Role, e.g., 'Creator' or 'Lead Developer'" },
            startDate: { type: SchemaType.STRING, description: "Start date if derivable, else year like '2023'" },
            endDate: { type: SchemaType.STRING, description: "End date or 'Present'" },
            description: { type: SchemaType.STRING, description: "A highly professional, ATS-friendly string of 3 bullet points using strong action verbs, separated by actual newline characters (\\n). e.g. '• Architected X\\n• Built Y\\n• Scaled Z'" }
          },
          required: ["company", "position", "startDate", "endDate", "description"]
        }
      }
    }
  });
  
  const prompt = `Analyze the following GitHub repositories and their readmes. 
  Extract the top projects and format them into professional resume 'Experience' or 'Project' entries.
  Ensure the description consists of exactly 3 impactful bullet points separated by newlines.
  
  Repositories Data:
  ${reposText}`;

  try {
    const result = await model.generateContent(prompt);
    const jsonText = result.response.text();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to generate resume entries from GitHub.");
  }
}

export async function autoTailorResume(currentExperience: any[], currentSkills: any[], jobDescription: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const schema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      experiences: {
        type: SchemaType.ARRAY,
        description: "The existing experience entries with highly tailored, optimized bullet points targeting the job description.",
        items: {
          type: SchemaType.OBJECT,
          properties: {
            id: { type: SchemaType.STRING },
            description: { 
              type: SchemaType.STRING,
              description: "Strictly 3-5 high-impact bullet points heavily optimized for the provided Job Description."
            }
          },
          required: ["id", "description"]
        }
      },
      skillsToAdd: {
        type: SchemaType.ARRAY,
        description: "A highly curated list of up to 5 critical skills explicitly requested in the Job Description that the user is currently missing.",
        items: { type: SchemaType.STRING }
      }
    },
    required: ["experiences", "skillsToAdd"]
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  const prompt = `
You are a world-class ATS Resume Tailoring AI. 

User's current Experience data:
${JSON.stringify(currentExperience, null, 2)}

User's current Skills data:
${JSON.stringify(currentSkills, null, 2)}

Target Job Description:
${jobDescription}

CRITICAL INSTRUCTIONS:
1. Re-write the "description" field of their existing experiences to organically include keywords and qualifications heavily sought after by the Job Description. Ensure you map the EXACT same "id" to the output so it updates flawlessly.
2. The description MUST remain exactly 3-5 bullet points, utilizing strong action verbs and quantifying achievements where possible without hallucinating strict metrics.
3. Suggest up to 5 "skillsToAdd" that are explicitly requested in the JD but are missing from their current skills array.
`;

  const result = await model.generateContent(prompt);
  const jsonText = result.response.text();
  return JSON.parse(jsonText) as { experiences: { id: string, description: string }[], skillsToAdd: string[] };
}

export async function extractLinkedInProfile(profileText: string) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            company: { type: SchemaType.STRING },
            position: { type: SchemaType.STRING },
            startDate: { type: SchemaType.STRING },
            endDate: { type: SchemaType.STRING },
            description: { type: SchemaType.STRING, description: "A highly professional, ATS-friendly string of exactly 3 bullet points using strong action verbs, separated by actual newline characters (\\n)." }
          },
          required: ["company", "position", "startDate", "endDate", "description"]
        }
      }
    }
  });
  
  const prompt = `Extract all professional Work Experience entries from the following LinkedIn profile text or URL contents. 
  Format them into professional ATS resume entries with exactly 3 impactful bullet points each.
  
  Profile Data:
  ${profileText}`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to extract LinkedIn profile.");
  }
}

export async function refineExperienceDescription(description: string, jobDescription?: string) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const jobDescText = jobDescription ? "\\nMake sure to align it with this Job Description if possible:\\n" + jobDescription + "\\n" : "";
  
  const prompt = `Rewrite the following resume experience description to be highly impactful, metric-driven, and action-oriented. 
  Turn vague statements into strong accomplishments (e.g., change "Led a team" to "Spearheaded a cross-functional team of 5, increasing sprint velocity by 22%").
  Keep the same number of bullet points, or format as bullet points if it's currently a paragraph.
  Do not hallucinate facts, but you can confidently estimate reasonable metrics if none are provided. Make it sound extremely professional and powerful.
  ${jobDescText}
  
  Current Description:
  ${description}
  
  Return ONLY the raw rewritten description text. No markdown formatting, no explanations, no quotes. Just the text.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to refine description.");
  }
}

export async function generateResumeFromRaw(rawText: string) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  
  const schema: ResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
      title: { type: SchemaType.STRING, description: "A catchy but professional title for the resume" },
      personalInfo: {
        type: SchemaType.OBJECT,
        properties: {
          fullName: { type: SchemaType.STRING },
          email: { type: SchemaType.STRING },
          phone: { type: SchemaType.STRING },
          location: { type: SchemaType.STRING },
          website: { type: SchemaType.STRING },
          linkedin: { type: SchemaType.STRING }
        },
        required: ["fullName", "email"]
      },
      skills: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING }
          },
          required: ["name"]
        }
      },
      experience: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            company: { type: SchemaType.STRING },
            position: { type: SchemaType.STRING },
            startDate: { type: SchemaType.STRING },
            endDate: { type: SchemaType.STRING },
            current: { type: SchemaType.BOOLEAN },
            description: { type: SchemaType.STRING, description: "3-5 impactful bullet points separated by newlines (\\n)" }
          },
          required: ["company", "position", "startDate", "endDate", "current", "description"]
        }
      },
      education: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            institution: { type: SchemaType.STRING },
            degree: { type: SchemaType.STRING },
            fieldOfStudy: { type: SchemaType.STRING },
            startDate: { type: SchemaType.STRING },
            endDate: { type: SchemaType.STRING }
          },
          required: ["institution", "degree", "fieldOfStudy", "startDate", "endDate"]
        }
      }
    },
    required: ["title", "personalInfo", "skills", "experience", "education"]
  };

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  const prompt = `Convert the following raw text into a structured, professional resume. 
  Extract personal information, skills, work experience, and education. 
  Ensure the experience descriptions are highly professional and use strong action verbs.
  
  Raw Text:
  ${rawText}`;

  try {
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to generate resume from raw text.");
  }
}

export async function generateCoverLetter(resumeSummary: string, rawInput: string) {
  if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not set.");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  
  const prompt = `Write a professional, compelling cover letter based on the provided resume data and the user's additional input (which might include a job description or specific goals).
  
  Resume Context:
  ${resumeSummary}
  
  User's Raw Input:
  ${rawInput}
  
  The cover letter should be formatted professionally, be approximately 250-400 words, and emphasize fit for the role mentioned in the raw input.
  Return ONLY the raw cover letter text. No markdown formatting, no explanations. Just the text.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Failed to generate cover letter.");
  }
}
