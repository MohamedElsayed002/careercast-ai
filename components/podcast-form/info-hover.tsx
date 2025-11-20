import { InfoIcon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

// pricing (centralized)
export const PRICE_MAP = {
  // text models (prices shown per 1M tokens)
  "gpt-4o-mini": { label: "GPT-4o-mini", bestFor: "Cost-efficient; prototyping", pricePer1MInput: 0.15, pricePer1MOutput: 0.60, unit: "per 1M tokens" },
  "gpt-4-turbo": { label: "GPT-4-Turbo", bestFor: "Balanced speed / cost", pricePer1MInput: 10.0, pricePer1MOutput: 30.0, unit: "per 1M tokens" },
  "gpt-5": { label: "GPT-5", bestFor: "Highest quality (costly)", pricePer1MInput: 1.25, pricePer1MOutput: 10.0, unit: "per 1M tokens" },

  // audio models (units vary across providers: characters or minutes)
  "gpt-4o-mini-tts": { label: "gpt-4o-mini-tts", bestFor: "Low-cost TTS", pricePerUnit: 12.0, unit: "per 1M tokens (approx.)" }, // example
  "tts-1": { label: "tts-1", bestFor: "Realtime TTS", pricePerUnit: 0.08, unit: "per 1k characters (approx.)" },
  "tts-1-hd": { label: "tts-1-hd", bestFor: "Higher fidelity voice", pricePerUnit: 0.16, unit: "per 1k characters (approx.)" },
};

export function formatPriceForDisplay(p: number) {
  // show $X for readability — adapt locale if you want
  return `$${Number(p).toLocaleString(undefined, { maximumFractionDigits: 3 })}`;
}

/* Reusable InfoHover component */
export function InfoHover({ modelKey }: { modelKey: string }) {
  const info = PRICE_MAP[modelKey];
  if (!info) return null;

  // returns small hover card content — adjust classes to match your UI system
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <button aria-label={`${info.label} details`} className="p-1 rounded hover:bg-muted">
          <InfoIcon className="h-5 w-5" />
        </button>
      </HoverCardTrigger>

      <HoverCardContent className="w-80">
        <div className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm font-semibold">{info.label}</div>
              <div className="text-xs text-muted-foreground">{info.bestFor}</div>
            </div>
            {/* Text models show input/output rates, audio models show per-unit price */}
            <div className="text-sm font-medium">
              {info.pricePer1MInput !== undefined ? (
                <div className="text-right">
                  <div>{formatPriceForDisplay(info.pricePer1MInput)} / 1M in</div>
                  <div className="text-xs text-muted-foreground">{formatPriceForDisplay(info.pricePer1MOutput)} / 1M out</div>
                </div>
              ) : (
                <div className="text-right">
                  <div>{formatPriceForDisplay(info.pricePerUnit)}</div>
                  <div className="text-xs text-muted-foreground">{info.unit}</div>
                </div>
              )}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            Billing unit: {info.unit}. Prices shown are approximate — check docs for exact billing and the most recent rates.
          </div>

          <div className="text-xs text-muted-foreground">Updated: Nov 19, 2025</div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
