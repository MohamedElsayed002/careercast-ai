"use client";
import { useState } from "react";
import { useCreatePodcast } from "@features/podcast/hooks/useCreatePodcast";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Custom() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [voice, setVoice] = useState<string | null>(null)
  const { mutate: createPodcast, isPending, error } = useCreatePodcast({
    onSuccess: async (data: { audioUrl?: string; pdfUrl?: string, pdfId: string, audioId: string }) => {
      setAudioUrl(data.audioUrl ?? null);
      setPdfUrl(data.pdfUrl ?? null);
      toast('Podcast created successfully')
    },
    onError: (err: unknown) => {
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
      toast.error(errorMessage);
    },
  });


  const handleSubmit = () => {
    // reset URLs; validation; then fire mutation
    setAudioUrl(null);
    setPdfUrl(null);
    if (!message || message.trim().length === 0 || !voice) {
      toast.error("Please enter a message");
      return;
    }
    createPodcast({ message, voice });
  };

  // Try to download the PDF by fetching it and forcing download.
  // If fetch fails (CORS), fallback to opening in a new tab.
  const downloadPdf = async () => {
    if (!pdfUrl) return;
    try {
      const res = await fetch(pdfUrl);
      if (!res.ok) throw new Error("Failed to fetch PDF for download");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      // try to set a sensible filename
      a.download = "podcast-brief.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // fallback: open in new tab
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6">
      <Select onValueChange={(value) => setVoice(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a voice" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Voices</SelectLabel>
            <SelectItem value="alloy">Alloy</SelectItem>
            <SelectItem value="ash">Ash</SelectItem>
            <SelectItem value="ballad">Ballad</SelectItem>
            <SelectItem value="cedar">Cedar</SelectItem>
            <SelectItem value="coral">Coral</SelectItem>
            <SelectItem value="echo">Echo</SelectItem>
            <SelectItem value="marin">Marin</SelectItem>
            <SelectItem value="sage">Sage</SelectItem>
            <SelectItem value="shimmer">Shimmer</SelectItem>
            <SelectItem value="verse">Verse</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      {voice && <audio src={`/${voice}.mp3`} autoPlay />}
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your podcast text here... Be creative! 🎙️"
        className="w-full border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-4 min-h-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm focus:border-purple-500 dark:focus:border-purple-400 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900 transition-all text-lg resize-none"
      />
      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 text-white font-bold text-lg shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200 relative overflow-hidden group"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isPending ? (
            <>
              <span className="animate-spin">⚡</span>
              Creating podcast...
            </>
          ) : (
            <>
              🎙️ Create Podcast (audio + PDF)
            </>
          )}
        </span>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {Boolean(error) && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 font-medium">❌ Error: {error instanceof Error ? error.message : 'An error occurred'}</p>
        </div>
      )}

      {audioUrl && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 shadow-lg">
          <h3 className="font-bold text-xl mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            🎵 Your Audio Podcast
          </h3>
          <audio controls src={audioUrl} className="w-full rounded-xl" />
        </div>
      )}

      {pdfUrl && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-2 border-cyan-200 dark:border-cyan-800 shadow-lg">
          <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
            <h3 className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              📄 PDF Brief
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => window.open(pdfUrl, "_blank", "noopener,noreferrer")}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Open PDF
              </button>
              <button
                onClick={downloadPdf}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
