import { z } from "zod";

export const briefingSchema = z.object({
    companyOverview: z.object({
        name: z.string(),
        industry: z.string(),
        coreBusiness: z.string(),
        recentTechTrends: z.array(
            z.string().describe("Technologies or shifts the company is currently focused on")
        ),
    }),
    candidateAlignment: z.object({
        matchingSkills: z.array(z.string()),
        missingGaps: z.array(z.string()),
        fitScore: z.number().min(0).max(100),
    }),
    recommendedProjects: z.array(
        z.object({
            title: z.string(),
            description: z.string(),
            technologiesToUse: z.array(z.string()),
            whyItMatters: z
                .string()
                .describe("How this project proves value this specific company"),
        })
    ).length(3),
    interviewTips: z.array(z.string()),
});

export type Briefing = z.infer<typeof briefingSchema>;


export function buildPrompt(companyName: string, pdfText: string) {
    return `
You are a Consulting Developer with 30+ years of experience in hiring strategy, engineering leadership, and career coaching.
Research the company named below, analyze the candidate CV text, and produce a practical roadmap to help the candidate get hired there.

Company name:
${companyName}

Candidate CV text:
${pdfText}

Instructions:
- You must use Google Search grounding for current company information before writing the answer.
- Use the company name as the target employer and tailor the analysis specifically to that company.
- Calculate fitScore carefully based on the candidate's demonstrated experience, relevant stack overlap, likely business fit, and obvious skill gaps.
- Keep matchingSkills and missingGaps concrete and evidence-based.
- Recommend exactly 3 portfolio projects that would improve the candidate's chances with this company.
- Write interview tips that are actionable, specific, and easy to practice.
 - Return valid JSON only.
 - Do not wrap the JSON in markdown fences.
 - The JSON must match this exact shape:
   {
     "companyOverview": {
       "name": string,
       "industry": string,
       "coreBusiness": string,
       "recentTechTrends": string[]
     },
     "candidateAlignment": {
       "matchingSkills": string[],
       "missingGaps": string[],
       "fitScore": number
     },
     "recommendedProjects": [
       {
         "title": string,
         "description": string,
         "technologiesToUse": string[],
         "whyItMatters": string
       }
     ],
     "interviewTips": string[]
   }
    `.trim();
}


export const companyBriefingFormSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required."),
  file: z
    .custom<File | null>((value) => value === null || value instanceof File)
    .refine((file) => file instanceof File, "Please upload your CV as a PDF.")
    .refine((file) => !file || file.type === "application/pdf", "Only PDF files are supported."),
});

export type CompanyBriefingFormValues = z.infer<typeof companyBriefingFormSchema>;