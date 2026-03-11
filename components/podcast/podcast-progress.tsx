"use client";

import { getSteps } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";


export function PodcastProgress({
  isGenerating,
  currentStep,
  includeSummary,
  errorMessage,
}: {
  isGenerating: boolean;
  currentStep: number | null;
  includeSummary: boolean;
  errorMessage?: string;
}) {
  if (!isGenerating) return null;

  const steps = getSteps(includeSummary);

  return (
    <div className="rounded-md border border-white/10 bg-black/30 px-4 py-3 text-white my-10">
      <div className="text-xs uppercase tracking-wide text-white/70">
        Podcast status
      </div>
      <ul className="mt-3 space-y-2 text-sm">
        {steps.map((step) => {
          const isDone = typeof currentStep === "number" && step.id < currentStep;
          const isActive = typeof currentStep === "number" && step.id === currentStep;

          return (
            <li key={step.id} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/20">
                {isDone ? (
                  <Check className="h-3.5 w-3.5 text-emerald-300" />
                ) : isActive ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-200" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                )}
              </span>
              <span className={isDone ? "text-white/60 line-through" : ""}>
                Step {step.id}: {step.label}
              </span>
            </li>
          );
        })}
      </ul>
      {currentStep === null && (
        <div className="mt-3 text-xs text-white/60">
          Waiting for progress updates...
        </div>
      )}
      {errorMessage && (
        <div className="mt-2 text-xs text-red-300">{errorMessage}</div>
      )}
    </div>
  );
}
