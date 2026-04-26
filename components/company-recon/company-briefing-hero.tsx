import { Building2, Sparkles, Target, UploadCloud } from "lucide-react";

export function CompanyBriefingHero() {
  return (
    <div className="bg-[linear-gradient(135deg,_#0f766e_0%,_#155e75_55%,_#082f49_100%)] p-8 text-white md:p-10">
      <div className="mb-6 inline-flex rounded-2xl bg-white/12 p-3 ring-1 ring-white/15 backdrop-blur">
        <Sparkles className="size-7" />
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-teal-50">
        Two-step workflow
      </div>

      <h1 className="mt-5 max-w-xl text-4xl font-black tracking-tight sm:text-5xl">
        Turn a raw CV into a company-specific hiring briefing
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-teal-50/90 sm:text-base">
        Step 1 collects the company name and CV, then shows the live analysis
        process. Step 2 reveals the final briefing with the sources Gemini used
        through Google Search.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
          <UploadCloud className="mb-3 size-5 text-teal-100" />
          <p className="text-sm font-semibold">Upload CV</p>
          <p className="mt-1 text-xs text-teal-50/80">
            Send a PDF and extract the resume text first.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
          <Building2 className="mb-3 size-5 text-teal-100" />
          <p className="text-sm font-semibold">Research company</p>
          <p className="mt-1 text-xs text-teal-50/80">
            Ground the analysis with real web sources from Google Search.
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
          <Target className="mb-3 size-5 text-teal-100" />
          <p className="text-sm font-semibold">Get a strategy</p>
          <p className="mt-1 text-xs text-teal-50/80">
            Review fit score, gaps, projects, and interview guidance.
          </p>
        </div>
      </div>
    </div>
  );
}
