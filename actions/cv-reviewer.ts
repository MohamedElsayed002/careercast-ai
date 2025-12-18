import { generateObject } from "ai"
import { z } from "zod"
import { createOpenAI } from "@ai-sdk/openai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import prisma from "@/utils/db"
import { decrypt } from "@/lib/encryption"

// ============================================================================
// PROVIDER TYPE
// ============================================================================
export type AIProvider = 'openai' | 'gemini'

// ============================================================================
// FREE TIER SCHEMA (Limited Analysis)
// ============================================================================
const CVReviewSchemaFree = z.object({
    matchPercentage: z.number().min(0).max(100).describe("Overall match percentage between CV and job description"),
    isGoodMatch: z.boolean().describe("Whether the candidate is a good match (typically 60% or above)"),
    verdict: z.string().describe("A brief 1-2 sentence verdict on candidate's suitability"),
    matchedSkills: z.array(z.string()).describe("Top 5 key skills from job description found in the CV"),
    missingSkills: z.array(z.string()).describe("Top 3 critical skills from job description not found in the CV"),
    strengths: z.array(z.string()).describe("Top 3 strengths of the CV relative to the job"),
    upgradePrompt: z.object({
        hiddenFeatures: z.array(z.string()).describe("List of features available in pro version"),
        message: z.string().describe("Encouraging message to upgrade")
    })
})

export type CVReviewFreeTier = z.infer<typeof CVReviewSchemaFree>

// ============================================================================
// PRO TIER SCHEMA (Full Analysis)
// ============================================================================
const CVReviewSchemaPro = z.object({
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

export type CVReviewProTier = z.infer<typeof CVReviewSchemaPro>

// ============================================================================
// SYSTEM PROMPTS
// ============================================================================
const SYSTEM_PROMPT_BASE = `
    You are an expert HR consultant and career advisor with 15+ years of experience in talent acquisition and CV optimization.
    Your role is to provide detailed, actionable, and honest analysis of CVs against job descriptions.

    ANALYSIS GUIDELINES:
    1. **Match Percentage Calculations**:
        - Consider: required skills, experience level, qualifications, industry knowledge
        - 80-100%: Exceptional match, rare to find better candidates
        - 60-79%: Good match, candidate meets most requirements
        - 40-59%: Moderate match, some gaps but potential
        - 0-39%: Poor match, significant misalignment
    
    2. **Be Specific and Evidence-Based**:
        - Reference actual content from the CV and job description
        - Avoid generic statements like "good communication skills"
        - Use concrete examples: "5 years of React experience vs 3+ years required"

    3. **Balanced Perspective**:
        - Highlight genuine strengths with specific evidence
        - Point out real weaknesses without being overly harsh
        - Focus on actionable improvements
    
    4. **Prioritize Impact**:
        - Focus on skills and experience most critical to the role
        - Consider both technical requirements and soft skills
        - Evaluate cultural and industry fit indicators
`

const SYSTEM_PROMPT_FREE = `
    ${SYSTEM_PROMPT_BASE}
    
    **FREE TIER CONSTRAINTS**:
    - Provide only the TOP 5 matched skills (most important ones)
    - Provide only the TOP 3 missing skills (most critical gaps)
    - Provide only the TOP 3 strengths (most impressive)
    - Keep verdict concise (1-2 sentences)
    - In upgradePrompt, list features like: "Detailed weaknesses analysis", "5-7 actionable recommendations", "Experience level comparison", "Key highlights and achievements"
`

const SYSTEM_PROMPT_PRO = `
    ${SYSTEM_PROMPT_BASE}
        
    5. **Actionable Recommendations**:
        - Provide specific ways to improve the CV for THIS job
        - Suggest how to better showcase existing skills
        - Recommend adding missing keywords or certifications
        - Advise on structure, formatting, or presentation improvements
`

// ============================================================================
// FREE TIER FUNCTION
// ============================================================================
export async function analyzeCVMatchFree(
    cvText: string,
    jobDescription: string,
    credentialId: string,
    provider: AIProvider = 'openai'
) {
    // Get and decrypt credential
    const credentialValue = await prisma.credential.findUnique({
        where: { id: credentialId }
    })

    if (!credentialValue) {
        throw new Error('Invalid credential')
    }

    const decryptedApiKey = decrypt(credentialValue.value)

    // Create the appropriate AI provider based on selection
    const getModel = () => {
        if (provider === 'gemini') {
            const google = createGoogleGenerativeAI({
                apiKey: decryptedApiKey
            })
            return google('gemini-2.5-flash')
        } else {
            const openai = createOpenAI({
                apiKey: decryptedApiKey
            })
            return openai('gpt-5')
        }
    }

    const prompt = `
        ${SYSTEM_PROMPT_FREE}

        Analyze the following CV against the job description and provide a LIMITED assessment for free tier users.

        --- JOB DESCRIPTION ---
        ${jobDescription}
        --- END JOB DESCRIPTION ---

        --- CANDIDATE CV ---
        ${cvText}
        --- END CV ---

        Provide a FREE TIER analysis including:
            - Match percentage based on skills, experience, and qualifications alignment
            - Whether this is a good match (true/false)
            - Brief verdict on candidate suitability (1-2 sentences max)
            - TOP 5 matched skills only (be precise, use actual skill names from both documents)
            - TOP 3 critical missing skills only
            - TOP 3 strengths with brief evidence from the CV
            - Upgrade prompt with list of premium features and encouraging message

        Remember: This is a FREE TIER analysis, so be selective and highlight only the most important items.
    `.trim()

    try {
        const { object } = await generateObject({
            model: getModel(),
            schema: CVReviewSchemaFree,
            prompt
        })

        return {
            success: true,
            analysis: object,
            tier: 'free' as const
        }
    } catch (error) {
        console.log("Error analyzing CV (Free):", error)
        return {
            success: false,
            error,
            tier: 'free' as const
        }
    }
}

// ============================================================================
// PRO TIER FUNCTION
// ============================================================================
export async function analyzeCVMatchPro(
    cvText: string,
    jobDescription: string,
    credentialId: string,
    provider: AIProvider = 'openai'
) {
    // Get and decrypt credential
    const credentialValue = await prisma.credential.findUnique({
        where: { id: credentialId }
    })

    if (!credentialValue) {
        throw new Error('Invalid credential')
    }

    const decryptedApiKey = decrypt(credentialValue.value)

    // Create the appropriate AI provider based on selection
    const getModel = () => {
        if (provider === 'gemini') {
            const google = createGoogleGenerativeAI({
                apiKey: decryptedApiKey
            })
            return google('gemini-2.5-flash')
        } else {
            const openai = createOpenAI({
                apiKey: decryptedApiKey
            })
            return openai('gpt-5')
        }
    }

    const prompt = `
        ${SYSTEM_PROMPT_PRO}

        Analyze the following CV against the job description and provide a COMPREHENSIVE assessment.

        --- JOB DESCRIPTION ---
        ${jobDescription}
        --- END JOB DESCRIPTION ---

        --- CANDIDATE CV ---
        ${cvText}
        --- END CV ---

        Provide a COMPLETE PRO TIER analysis including:
            - Match percentage based on skills, experience, and qualifications alignment
            - Whether this is a good match (true/false)
            - Clear verdict on candidate suitability (2-3 sentences)
            - ALL matched skills (be precise, use actual skill names from both documents)
            - ALL critical missing skills or qualifications
            - 4-6 concrete strengths with evidence from the CV
            - 3-5 honest weaknesses or gaps
            - 5-7 actionable recommendations to improve the CV for this specific position
            - Complete experience level comparison (years required vs years in CV with assessment)
            - 3-4 key highlights that make this candidate stand out

        Provide thorough, detailed analysis for premium users.
    `.trim()

    try {
        const { object } = await generateObject({
            model: getModel(),
            schema: CVReviewSchemaPro,
            prompt
        })

        return {
            success: true,
            analysis: object,
            tier: 'pro' as const
        }
    } catch (error) {
        console.log("Error analyzing CV (Pro):", error)
        return {
            success: false,
            error,
            tier: 'pro' as const
        }
    }
}

