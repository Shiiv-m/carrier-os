"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Sparkles, ArrowLeft, Send, Loader2, Zap, Brain, Rocket } from "lucide-react";
import Link from "next/link";
import { generateResumeFromRaw } from "@/lib/gemini";
import { useResumes } from "@/hooks/useResumes";
import { v4 as uuidv4 } from "uuid";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";

export default function AIResumePage() {
  const [rawText, setRawText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { saveResume } = useResumes();

  const handleGenerate = async () => {
    if (!rawText.trim()) return;

    setIsGenerating(true);
    setError(null);

    try {
      const structuredResume = await generateResumeFromRaw(rawText);
      
      const now = new Date().toISOString();
      const newResume = {
        ...structuredResume,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now,
        // Ensure IDs for nested items
        skills: structuredResume.skills.map((s: any) => ({ ...s, id: uuidv4() })),
        experience: structuredResume.experience.map((e: any) => ({ ...e, id: uuidv4() })),
        education: structuredResume.education.map((ed: any) => ({ ...ed, id: uuidv4() })),
      };

      saveResume(newResume);
      router.push(`/editor/${newResume.id}`);
    } catch (err) {
      console.error(err);
      setError("Failed to architect your resume. Please check your connection and try again.");
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-4xl mx-auto relative w-full overflow-hidden flex flex-col">
      <BackgroundAnimation />
      
      <div className="relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-3 rounded-2xl">
              <Wand2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
              AI Resume Architect
            </h1>
          </div>
          <p className="text-xl text-muted">
            Drop your messy notes, LinkedIn bio, or old resume text. We'll build you a masterpiece.
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!isGenerating ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              key="input-state"
              className="space-y-6"
            >
              <div className="relative group">
                <textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste your professional story here... 
e.g. 'I was a Senior Dev at Google for 3 years where I led the Maps team and improved performance by 40%. Before that I studied CS at Stanford...'"
                  className="w-full h-80 bg-card/50 backdrop-blur-xl border-2 border-border rounded-3xl p-8 text-lg focus:outline-none focus:border-primary/50 transition-all resize-none shadow-2xl group-hover:bg-card/80"
                />
                <div className="absolute bottom-6 right-6">
                   <div className="flex items-center gap-2 text-xs text-muted font-medium bg-background/50 px-3 py-1.5 rounded-full border border-border italic">
                     <Brain className="w-3 h-3" /> Processing powered by Gemini 2.5 Flash
                   </div>
                </div>
              </div>

              {error && (
                <p className="text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20 text-sm font-medium">
                  {error}
                </p>
              )}

              <button
                onClick={handleGenerate}
                disabled={!rawText.trim()}
                className="w-full md:w-auto px-10 py-5 bg-primary text-primary-foreground font-black text-xl rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-primary/25 group"
              >
                Architect My Resume <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key="loading-state"
              className="flex flex-col items-center justify-center py-20 px-8 bg-card/30 backdrop-blur-xl border-2 border-dashed border-primary/20 rounded-3xl"
            >
              <div className="relative mb-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-32 h-32 border-4 border-primary/10 border-t-primary rounded-full shadow-[0_0_50px_-12px_rgba(var(--primary),0.5)]"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Brain className="w-12 h-12 text-primary" />
                </motion.div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4 text-center">Architecting your career...</h2>
              <div className="max-w-md w-full space-y-3">
                 <LoadingStep label="Parsing raw data entries" delay={0} />
                 <LoadingStep label="Optimizing for ATS algorithms" delay={1.5} />
                 <LoadingStep label="Fine-tuning professional impact" delay={3} />
                 <LoadingStep label="Building your masterpiece" delay={4.5} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function LoadingStep({ label, delay }: { label: string; delay: number }) {
  const [completed, setCompleted] = useState(false);

  useState(() => {
    const timer = setTimeout(() => setCompleted(true), (delay + 1) * 1000);
    return () => clearTimeout(timer);
  });

  return (
    <div className="flex items-center gap-3">
      {completed ? (
        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
          <Zap className="w-3 h-3 text-white fill-current" />
        </div>
      ) : (
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      )}
      <span className={`font-medium ${completed ? 'text-foreground' : 'text-muted'}`}>{label}</span>
    </div>
  );
}
