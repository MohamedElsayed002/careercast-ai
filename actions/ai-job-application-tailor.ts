import { generateObject } from "ai"
import { z } from "zod"
import { createOpenAI } from "@ai-sdk/openai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import prisma from "@/utils/db"
import { decrypt } from "@/lib/encryption"


export type AIProvider = 'openai' | 'gemini'


// Customization options schema 
const TailoringOptionsSchema = z.object({
    // Generation settings
    generateTailoredCv: z.boolean().default(true),
    generateCoverLetter: z.boolean().default(false),
    optimizeForATS: z.boolean().default(true),

    // CV Section Controls
    rewriteSummary: z.boolean().default(true),
    rewriteExperience: z.boolean().default(true),
    reorderSkills: z.boolean().default(true),
    emphasizeAchievements: z.boolean().default(true),

    // Locked sections (won't be modified)
    lockedSections: z.array(z.enum([
        'education',
        'certifications',
        'languages',
        'contact'
    ])).default([]),

    // Cover letter options (PRO only)
    coverLetterTone: z.enum([
        'professional',
        'friendly',
        'enthusiastic',
        'formal'
    ]).optional(),

    coverLetterLength: z.enum([
        'short',      // 150-200 words
        'standard',   // 250-350 words
        'detailed'    // 400-500 words
    ]).optional(),

    // Context
    targetRole: z.string().optional(),
    companyType: z.enum([
        'corporate',
        'startup',
        'tech',
        'consulting',
        'nonprofit'
    ]).optional(),

    seniorityLevel: z.enum([
        'entry',
        'junior',
        'mid',
        'senior',
        'lead',
        'executive'
    ]).optional()
})

export type TailoringOptions = z.infer<typeof TailoringOptionsSchema>


// Free Tier Schema (Limited Tailoring)

const TailoredCVFreeTierSchema = z.object({
    tailoredSummary: z.string().describe("Rewritten professional summary optimized for the job"),

    tailoredExperience: z.array(z.object({
        originalTitle: z.string().describe("Original job title from CV"),
        company: z.string().describe("Company name"),
        tailoredBullets: z.array(z.string()).max(3).describe("Max 3 rewritten bullets emphasizing job relevance")
    })).max(2).describe("Only first 2 work experiences tailored"),

    matchScoreImprovement: z.object({
        original: z.number().min(0).max(100).describe("Original CV match score"),
        tailored: z.number().min(0).max(100).describe("Tailored CV match score"),
        improvement: z.number().describe("Percentage point improvement")
    }),

    topAddedKeywords: z.array(z.string()).max(5).describe("Top 5 ATS keywords added from job description"),

    upgradePrompt: z.object({
        limitationsApplied: z.array(z.string()).describe("What was limited in free tier"),
        proFeatures: z.array(z.string()).describe("Features unlocked in PRO"),
        message: z.string().describe("Encouraging upgrade message")
    })
})

export type TailoredCVFreeTier = z.infer<typeof TailoredCVFreeTierSchema>


// Pro Tier Schema (Full Tailoring)
const TailoredCVProTierSchema = z.object({
    tailoredSections: z.object({
        summary: z.string().describe("Complete rewritten professional summary"),

        experience: z.array(z.object({
            company: z.string().describe("Company name"),
            title: z.string().describe("Job title"),
            duration: z.string().optional().describe("Employment duration"),
            originalBullets: z.array(z.string()).describe("Original bullet points"),
            tailoredBullets: z.array(z.string()).describe("Tailored bullet points with job-relevant keywords"),
            changes: z.array(z.string()).describe("Explanation of what was changed and why")
        })),

        skills: z.object({
            reordered: z.array(z.string()).describe("Skills reordered by job relevance (most relevant first)"),
            emphasized: z.array(z.string()).describe("Skills to highlight prominently"),
            addedKeywords: z.array(z.string()).describe("ATS keywords naturally integrated from job description")
        }),

        achievements: z.array(z.string()).optional().describe("Key achievements reformulated to match job requirements"),

        projects: z.array(z.object({
            name: z.string(),
            description: z.string().describe("Reformulated project description emphasizing relevant aspects")
        })).optional()
    }),

    coverLetter: z.object({
        content: z.string().describe("Complete cover letter text"),
        tone: z.string().describe("Tone used in the letter"),
        wordCount: z.number().describe("Total word count"),
        keyPoints: z.array(z.string()).describe("Main points addressed in letter"),
        structure: z.object({
            opening: z.string().describe("Opening paragraph"),
            body: z.string().describe("Main body paragraphs"),
            closing: z.string().describe("Closing paragraph")
        })
    }).optional(),

    matchAnalysis: z.object({
        original: z.number().min(0).max(100).describe("Original CV match percentage"),
        tailored: z.number().min(0).max(100).describe("Tailored CV match percentage"),
        improvement: z.number().describe("Percentage point improvement"),
        breakdown: z.object({
            skillsMatch: z.number().min(0).max(100).describe("Skills alignment percentage"),
            experienceMatch: z.number().min(0).max(100).describe("Experience relevance percentage"),
            keywordsMatch: z.number().min(0).max(100).describe("Keyword optimization percentage")
        })
    }),

    atsOptimization: z.object({
        addedKeywords: z.array(z.string()).describe("All ATS keywords added"),
        keywordDensity: z.array(z.object({
            keyword: z.string().describe("The keyword"),
            density: z.number().describe("Frequency/count of this keyword")
        })).describe("Frequency of each keyword as an array of keyword-density pairs"),
        missingCriticalKeywords: z.array(z.string()).describe("Important keywords still missing"),
        compatibilityScore: z.number().min(0).max(100).describe("Overall ATS compatibility score"),
        recommendations: z.array(z.string()).describe("Additional ATS optimization suggestions")
    }),

    changesSummary: z.object({
        totalChanges: z.number().describe("Total number of modifications made"),
        sectionsModified: z.array(z.string()).describe("List of CV sections that were modified"),
        majorChanges: z.array(z.string()).describe("List of significant modifications"),
        minorTweaks: z.array(z.string()).describe("Small improvements made")
    })
})

export type TailoredCVProTier = z.infer<typeof TailoredCVProTierSchema>



// System prompts

const SYSTEM_PROMPT_BASE = `
You are an expert career consultant and CV optimization specialist with 15+ years of experience in recruitment, ATS systems, and applicant tracking.

Your role is to tailor CVs to specific job descriptions while maintaining 100% truthfulness and accuracy.

CRITICAL RULES - NEVER VIOLATE:
1. **NEVER fabricate experience**: Do not add companies, roles, skills, dates, or achievements not present in the original CV
2. **Work within constraints**: Only rephrase, reorder, and emphasize existing content
3. **ATS optimization**: Naturally integrate relevant keywords from the job description
4. **Maintain authenticity**: Keep the candidate's voice and genuine experience
5. **Be strategic**: Emphasize the most relevant experiences for THIS specific job
6. **No keyword stuffing**: Keywords must be integrated naturally and contextually

TAILORING STRATEGIES:
- Rephrase bullets to mirror job description language while keeping facts intact
- Reorder experiences to highlight most relevant first
- Quantify achievements where possible (using existing data only)
- Add relevant keywords naturally (never keyword stuffing)
- Emphasize transferable skills matching the role
- Remove or de-emphasize less relevant details
- Use action verbs that match the job posting
- Mirror the language and terminology used in the job description
- Try to focus on measurable outcomes already present in the CV. like if he focused on performance or increased it by 90% rather than saying improved performance

ATS OPTIMIZATION BEST PRACTICES:
- Match exact keywords from job requirements
- Use standard section headers (Experience, Education, Skills)
- Avoid tables, images, or complex formatting
- Include both acronyms and full terms (e.g., "AI (Artificial Intelligence)")
- Use simple, clean formatting
- Avoid headers/footers that ATS systems might miss
- Use standard fonts and bullet points

WHAT YOU CAN DO:
✅ Rephrase existing experience to highlight relevance
✅ Reorder bullet points by relevance
✅ Emphasize specific skills mentioned in job description
✅ Add industry-standard keywords naturally
✅ Quantify existing achievements differently
✅ Reorder sections for impact


WHAT YOU CANNOT DO:
❌ Add new companies or positions
❌ Change employment dates
❌ Invent skills or technologies not mentioned
❌ Add fake certifications or education
❌ Create fictional projects or achievements
❌ Inflate numbers or metrics beyond what's stated
`


const SYSTEM_PROMPT_FREE = `
    ${SYSTEM_PROMPT_BASE}

    **FREE TIER LIMITATIONS**:
    - Tailor only the professional summary
    - Tailor only the first 2 work experiences (max 3 bullets each)
    - Provide top 5 added keywords only
    - Calculate basic match score improvement 
    - No cover letter generation 
    - Limited ATS analysis 

    Your goal is to demonstrate clear value while encouraging users to upgrade for full tailoring capabilities. 
`

const SYSTEM_PROMPT_PRO = `
    ${SYSTEM_PROMPT_BASE}

    **PRO TIER CAPABILITIES**:'
    - Full CV tailoring across all sections (unless locked by user)
    - Cover letter generation with customizable tone and length 
    - Comprehensive ATS analysis with keyword density tracking 
    - Detailed change tracking and explanations
    - Project descriptions optimization 
    - Skills reordering by relevance
    - Complete match analysis breakdown 

    Provide a thorough, professional tailoring that maximizes the candidate's chances while maintaining complete truthfulness.
`

// Free Tier Function 
export async function tailorCVFree(
    originalCvText: string,
    jobDescription: string,
    options: Partial<TailoringOptions>,
    credentialId: string,
    provider: AIProvider = 'openai'
) {


    // Get and decrypt credential 
    const credentialValue = await prisma.credential.findUnique({
        where: { id: credentialId }
    })

    if (!credentialValue) {
        throw new Error("Invalid credential")
    }

    const decryptedApiKey = decrypt(credentialValue.value)

    // Create the appropriate AI provider based on selection
    const getModel = () => {
        if (provider === 'gemini') {
            const google = createGoogleGenerativeAI({
                apiKey: decryptedApiKey
            })
            return google("gemini-2.5-flash")
        } else {
            const openai = createOpenAI({
                apiKey: decryptedApiKey
            })
            return openai("gpt-5")
        }
    }

    const prompt = `
        ${SYSTEM_PROMPT_FREE}

        **TASK**: Tailor the CV below for the specific job description, applying FREE TIER limitations.

        --- JOB DESCRIPTION ---
        ${jobDescription}
        --- END JOB DESCRIPTION ---

        --- ORIGINAL CV ---
        ${originalCvText}
        --- END ORIGINAL CV ---

        --- USER PREFERENCES ---
        ${JSON.stringify(options, null, 2)}
        --- END PREFERENCES ---

        Provide a LIMITED tailoring suitable for free tier users that includes:
        1. Rewritten professional summary optimized for the job 
        2. Only the first 2 work experiences tailored (max 3 bullets each)
        3. Match score improvement (original vs tailored)
        4. Top 5 most important ATS keywords added
        5. Upgrade prompt explaining limitations and PRO benefits 

        Focus on demonstrating clear value while staying within free tier constraints.
        Make sure all changes are based STRICTLY on existing CV context - NEVER INVENT EXPERIENCE.
    `.trim()

    try {
        const { object } = await generateObject({
            model: getModel(),
            schema: TailoredCVFreeTierSchema,
            prompt
        })

        return {
            success: true,
            tailoredCV: object,
            tier: 'free' as const
        }

    } catch (error) {

        console.error("Error tailoring CV (Free Tier):", error)

        return {
            success: false,
            error,
            tier: 'free' as const
        }
    }
}

// Pro Tier Function
export async function tailorCVPro(
    originalCvText: string,
    jobDescription: string,
    options: Partial<TailoringOptions>,
    credentialId: string,
    provider: AIProvider = 'openai'
) {

    // Validate and set defaults for options 
    const validatedOptions = TailoringOptionsSchema.parse(options)


    // Get and decrypt credential 
    const credentialValue = await prisma.credential.findUnique({
        where: { id: credentialId }
    })


    if (!credentialValue) {
        throw new Error("Invalid credential")
    }

    const decryptedApiKey = decrypt(credentialValue.value)

    // Create the appropriate AI provider based on selection
    const getModel = () => {
        if (provider === 'gemini') {
            const google = createGoogleGenerativeAI({
                apiKey: decryptedApiKey
            })
            return google("gemini-2.5-flash")
        } else {
            const openai = createOpenAI({
                apiKey: decryptedApiKey
            })
            return openai("gpt-5")
        }
    }

    const coverLetterIntructions = validatedOptions.generateCoverLetter ? `
    **COVER LETTER REQUIREMENTS**:
    - Tone: ${validatedOptions.coverLetterLength || 'professional'}
    - Length: ${validatedOptions.coverLetterLength || 'standard'}
    - Address 3-4 key job requirements from the job description 
    - Highlight 3-4 most relevant experiences from CV 
    - Show genuine enthusiasm for the role and company
    - Keep it professional and authentic 
    - Structure: opening paragraph 2-3 body paragraphs, closing paragraph
- Word count target: ${validatedOptions.coverLetterLength === 'short' ? '150-200' : validatedOptions.coverLetterLength === 'detailed' ? '400-500' : '250-350'} words 
    ` : ''

    const prompt = `
        ${SYSTEM_PROMPT_PRO}

        **TASK** Provide a COMPLETE professional tailoring of the CV below for the specific job description.

        --- JOB DESCRIPTION ---
        ${jobDescription}
        --- END JOB DESCRIPTION ---

        --- ORIGINAL CV ---
        ${originalCvText}
        --- END ORIGINAL CV ---

        --- USER PREFERENCES ---
        Rewrite Summary: ${validatedOptions.rewriteSummary}
        Rewrite Experience: ${validatedOptions.rewriteExperience}
        Reorder Skills: ${validatedOptions.reorderSkills}
        Emphasize Achievements: ${validatedOptions.emphasizeAchievements}
        Optimize for ATS: ${validatedOptions.optimizeForATS}
        Generate Cover Letter: ${validatedOptions.generateCoverLetter}
        Target Role: ${validatedOptions.targetRole || 'Not Specified'}
        Company Type: ${validatedOptions.companyType || 'Not Specified'}
        Seniority Level: ${validatedOptions.seniorityLevel || 'Not Specified'}

        --- LOCKED SECTIONS (DO NOT MODIFY) ---
        ${validatedOptions.lockedSections.length > 0 ? validatedOptions.lockedSections.join(', ') : 'None'}
        --- END LOCKED SECTIONS ---
        ${coverLetterIntructions}

        Provide a COMPLETE PRO TIER tailoring that includes:
        1. Fully tailored CV sections (summary, experience, skills, achievements, projects)
        2. Detailed explanation of all changes made
        3. Optional cover letter (if requested)
        4. Comprehensive match analysis with breakdown
        5. Full ATS optimization report with keyword density
        6. Complete changes summary

        Requirements:
        - Maintain 100% truthfulness - NEVER INVENT EXPERIENCE
        - Respect locked sections - do not modify them
        - Integrate keywords naturally, no stuffing 
        - Provide detailed explanations for all changes
        - Calculate accurate match scores before and after
        - Track all keywords added and their density
        - Identify any critical missing keywords

        Focus on maximizing the candidate's chances for THIS SPECIFIC JOB while maintaining complete authenticity.
    `.trim()

    try {
        const { object } = await generateObject({
            model: getModel(),
            schema: TailoredCVProTierSchema,
            prompt
        })

        return {
            success: true,
            tailoredCV: object,
            tier: 'pro' as const
        }
    } catch (error) {

        console.error("CV Tailoring Error (Pro):", error)
        return {
            success: false,
            error,
            tier: 'pro' as const
        }
    }

}

export function validateTailoredContent(
    originalCvText: string,
    tailoredContent: string
): { valid: boolean; issues: string[] } {
    const issues: string[] = []

    // Check for common fabrication patterns that might indicate hallucination
    const suspiciousPatterns = [
        { pattern: /\b(CEO|CTO|CFO|COO|VP|SVP|EVP|Director|President)\b/gi, name: 'Executive titles' },
        { pattern: /\b\d+\s*(million|billion|trillion)\b/gi, name: 'Large monetary values' },
        { pattern: /\b(founded|co-founded|created|established|launched)\s+\w+/gi, name: 'Company creation claims' },
        { pattern: /\bPatent\s+#?\d+/gi, name: 'Patent numbers' },
        { pattern: /\bPhD|Doctorate|Masters|MBA\b/gi, name: 'Advanced degrees' }
    ]

    for (const { pattern, name } of suspiciousPatterns) {
        const tailoredMatches = tailoredContent.match(pattern) || []
        const originalMatches = originalCvText.match(pattern) || []

        if (tailoredMatches.length > originalMatches.length) {
            issues.push(`Potential fabrication detected: ${name} appear more frequently in tailored version`)
        }
    }

    return {
        valid: issues.length === 0,
        issues
    }
}