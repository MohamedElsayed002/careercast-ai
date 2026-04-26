"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  companyBriefingFormSchema,
  CompanyBriefingFormValues,
} from "@/actions/briefing-schema";

import { CompanyBriefingFormStep } from "./company-briefing-form-step";
import { CompanyBriefingHero } from "./company-briefing-hero";
import { Form } from "@/components/ui/form";

export function CompanyCvBriefing() {
  const form = useForm<CompanyBriefingFormValues>({
    resolver: zodResolver(companyBriefingFormSchema),
    defaultValues: {
      companyName: "",
      file: null,
    },
  });

  const [text, setText] = useState("");
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: CompanyBriefingFormValues) {
    setLoading(true);
    setText("");
    setSources([]);

    const formData = new FormData();
    formData.append("companyName", values.companyName);
    if (values.file) formData.append("file", values.file);

    const response = await fetch("/api/test/company-briefing", {
      method: "POST",
      body: formData,
    });

    if (!response.body) {
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;

      const chunk = decoder.decode(value || new Uint8Array());
      buffer += chunk;

      if (buffer.includes("__SOURCES__")) {
        const [textPart, sourcesPart] = buffer.split("__SOURCES__");

        setText(textPart);

        try {
          setSources(JSON.parse(sourcesPart));
        } catch (err) {
          console.error("Failed to parse sources", err);
        }

        break;
      } else {
        setText((prev) => prev + chunk);
      }
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-2xl border bg-white shadow">
          <div className="grid md:grid-cols-2">
            <CompanyBriefingHero />

            <Form {...form}>
              <CompanyBriefingFormStep
                onSubmit={form.handleSubmit(onSubmit)}
              />
            </Form>
          </div>
        </section>

        {/* ✅ Streaming text */}
        {text && (
          <div className="whitespace-pre-wrap rounded-xl border p-4">
            {text}
          </div>
        )}

        {/* ✅ Sources */}
        {sources.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Sources</h3>
            {sources.map((item: any, i) => (
              <div key={i} className="text-sm">
                {item.title || JSON.stringify(item)}
              </div>
            ))}
          </div>
        )}

        {loading && <p>wait...</p>}
      </div>
    </main>
  );
}