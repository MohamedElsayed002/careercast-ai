"use client"

import { ArrowRight, FileUp } from "lucide-react";
import { useFormContext } from "react-hook-form";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function CompanyBriefingFormStep({
  onSubmit
}: {
  onSubmit: () => void
}) {

  const form = useFormContext()

  return (
    <div className="p-8 md:p-10">
      <form onSubmit={onSubmit} className="space-y-5">
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ex: Microsoft Egypt, Oracle"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CV PDF</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    field.onChange(e.target.files?.[0] ?? null)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          <FileUp className="size-4" />
          Analyze My CV
          <ArrowRight className="size-4" />
        </Button>
      </form>
    </div>
  );
}
