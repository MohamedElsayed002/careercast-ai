import { generateObject} from "ai"
import { z } from "zod"
import { createOpenAI } from "@ai-sdk/openai"

const openai =  createOpenAI({
    apiKey: ''
})

const CVReviewSchema = z.object({
    matchPercentage: z.number().min(0).max(100).describe("Overall match percentage between CV and job description"),
    isGoodMatch: z.boolean().describe("Whether the candidate is a good match (typically 60% or above)"),
    verdict: z.string().describe("A clear 2-3 sentence verdict on candidate's suitability"),
    matchedSkills: z.array(z.string()).describe("List of key skills from job description found in the CV"),
    missingSkills: z.array(z.string()).describe("Critical skills from job description not found in the CV"),
    strengths: z.array(z.string()).describe("4-6 specific strengths of the CV relative to the job"),
    weaknesses: z.array(z.string()).describe("3-5 areas where the CV falls short or could improve"),
    recommendations: z.array(z.string()).describe("5-7 actionable recommendations to improve the CV for this specific job"),
    experienceMatch: z.object({
        yearsRequired: z.string().describe("Years of experience required by the job"),
        yearsInCV: z.string().describe("Years of experience evident in the CV"),
        assessment: z.string().describe("Brief assessment of experience match")
    }),
    keyHighlights: z.array(z.string()).describe("3-4 standout achievements or qualifications from the CV")
})

export type CVReviewType = z.infer<typeof CVReviewSchema>

const SYSTEM_PROMPT = `
    You are an expert HR consultant and career advisor with 15+ years of experience in talent acquisition and CV optimization.
    Your role is to provide detailed, actionable, and honest analysis of CVs against job description.

    ANALYSIS GUIDELINES:
    1. ** Match Percentage Calculations**:
        - Consider: required skills, experience level, qualifications, industry knowledge
        -  80-100%: Exceptional match, rare to find better candidates
        - 60-79%: Good match, candidate meets most requirements
        - 40-59%: Moderate match, some gaps but potential
        - 0-39%: Poor match, significant misalignment
    
    2. ** Be Specific and Evidence-Based**:
        - Reference actual content from the CV and job description
        - Avoid generic statements like "good communication skills"
        - Use concrete examples: "5 years of React experience vs 3+ years required"

    3. ** Balanced Perspective**:
        - Highlight genuine strengths with specific evidence
        - Point out real weaknesses without being overly harsh
        - Focus on actionable improvements
    
    4. ** Prioritize impact**:
        - Focus on skills and experience most critical to the role
        - Consider both technical requirements and soft skills
        - Evaluate cultural and industry fit indicators
        
    5. **Actionable Recommendations**:
        - Provide specific ways to improve the CV for THIS job
        - Suggest how to better showcase existing skills
        - Recommend adding missing keywords or certifications
        - Advise on structure, formatting, or presentation improvements
`

export async function analyzeCVMatch(cvText: string, jobDescription: string) {
    const prompt = `
        ${SYSTEM_PROMPT}

        Analyze the following CV against the job description and provide a comprehensive assessment.

        --- JOB DESCRIPTION ---
        ${jobDescription}
        --- END JOB DESCRIPTION ---

        --- CANDIDATE CV ---
        ${cvText}
        --- END CV ---

        Provide a thorough analysis including:
            - Match percentage based on skills, experience, and qualifications alignment
            - Whether this is a good match (true/false)
            - Clear verdict on candidate suitability
            - Specific match skills (be precise, use actual skills names from both documents)
            - Critical missing skills or qualifications
            - Concrete strengths with evidence from the CV
            - Honest weaknesses or gaps
            - Actionable recommendations to improve the CV for this specific position
            - Experience level comparison 
            - Key highlights that make this candidate stand out

    `.trim()

    try {
        const { object } = await generateObject({
            model: openai('gpt-5'),
            schema: CVReviewSchema,
            prompt
        })

        return {
            success: true,
            analysis: object
        }
    }catch(error) {
        console.log("Error analyzing CV:",error)
        return {
            success: false,
            error
        }
    }
}