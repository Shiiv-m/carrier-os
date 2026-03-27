"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowLeft, Send, Loader2, Zap, Brain, Rocket, Copy, Check, FileText } from "lucide-react";
import Link from "next/link";
import { generateCoverLetter } from "@/lib/gemini";
import { useResumes } from "@/hooks/useResumes";
import BackgroundAnimation from "@/components/layout/BackgroundAnimation";

export default function AICoverLetterPage() {
  const { resumes, isLoaded } = useResumes();
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [rawInput, setRawInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-select the latest resume
  useState(() => {
    if (isLoaded && resumes.length > 0 && !selectedResumeId) {
       const latest = [...resumes].sort((a, b) => 
         new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
       )[0];
       setSelectedResumeId(latest.id);
    }
  });

  const handleGenerate = async () => {
    if (!selectedResumeId || !rawInput.trim()) return;

    setIsGenerating(true);
    setError(null);
    setGeneratedLetter(null);

    try {
      const selectedResume = resumes.find(r => r.id === selectedResumeId);
      if (!selectedResume) throw new Error("Resume not found");

      // Simplified summary for context
      const resumeSummary = `
        Full Name: ${selectedResume.personalInfo.fullName}
        Title: ${selectedResume.title}
        Experience: ${selectedResume.experience.map(e => `${e.position} at ${e.company} (${e.description})`).join("; ")}
        Skills: ${selectedResume.skills.map(s => s.name).join(", ")}
      `;

      const letter = await generateCoverLetter(resumeSummary, rawInput);
      setGeneratedLetter(letter);
      setIsGenerating(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate your cover letter. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedLetter) {
      navigator.clipboard.writeText(generatedLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-5xl mx-auto relative w-full overflow-hidden flex flex-col">
      <BackgroundAnimation />
      
      <div className="relative z-10 w-full">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-500/20 p-3 rounded-2xl">
              <Sparkles className="w-8 h-8 text-purple-500" />
            </div>
            <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
              AI Cover Letter Pro
            </h1>
          </div>
          <p className="text-xl text-muted">
            Craft a high-conversion cover letter tailored to your experience and the job description.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Input */}
          <div className="space-y-6">
            <section>
              <label className="block text-sm font-bold text-foreground mb-3 px-1">1. Select a Resume</label>
              <div className="grid grid-cols-1 gap-3 max-h-60 overflow-y-auto p-1 scrollbar-hide">
                {resumes.length === 0 ? (
                    <div className="p-4 bg-muted/20 border border-border rounded-xl text-sm text-muted">
                        No resumes found. Create one first!
                    </div>
                ) : (
                    resumes.map(resume => (
                        <button
                          key={resume.id}
                          onClick={() => setSelectedResumeId(resume.id)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                            selectedResumeId === resume.id 
                            ? 'bg-purple-500/10 border-purple-500 shadow-lg shadow-purple-500/10' 
                            : 'bg-card/50 border-border hover:border-purple-500/50'
                          }`}
                        >
                          <FileText className={`w-5 h-5 ${selectedResumeId === resume.id ? 'text-purple-500' : 'text-muted'}`} />
                          <span className="font-semibold line-clamp-1">{resume.title}</span>
                          {selectedResumeId === resume.id && <Zap className="w-4 h-4 ml-auto text-purple-500 fill-current" />}
                        </button>
                    ))
                )}
              </div>
            </section>

            <section>
              <label className="block text-sm font-bold text-foreground mb-3 px-1">2. Tell us about the Job</label>
              <textarea
                value={rawInput}
                onChange={(e) => setRawInput(e.target.value)}
                placeholder="Paste the Job Description or what you want to highlight here..."
                className="w-full h-48 bg-card/50 backdrop-blur-xl border-2 border-border rounded-2xl p-6 text-lg focus:outline-none focus:border-purple-500/50 transition-all resize-none shadow-xl"
              />
            </section>

            <button
              onClick={handleGenerate}
              disabled={!selectedResumeId || !rawInput.trim() || isGenerating}
              className="w-full px-8 py-5 bg-purple-600 text-white font-black text-xl rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-xl shadow-purple-500/25 group"
            >
              {isGenerating ? 'Generating...' : 'Craft My Letter'} 
              {isGenerating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Rocket className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </button>
          </div>

          {/* Right Column: Output */}
          <div className="relative">
             <AnimatePresence mode="wait">
                {!generatedLetter && !isGenerating ? (
                    <motion.div
                      key="empty"
                      className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-card/20 border-2 border-dashed border-border rounded-3xl text-center"
                    >
                        <Brain className="w-16 h-16 text-muted/30 mb-4" />
                        <h3 className="text-lg font-bold text-muted">Ready to generate</h3>
                        <p className="text-sm text-muted">Fill out the details on the left to see the magic happen.</p>
                    </motion.div>
                ) : isGenerating ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 bg-card/20 border-2 border-dashed border-purple-500/30 rounded-3xl text-center"
                    >
                        <div className="relative mb-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                className="w-24 h-24 border-4 border-purple-500/10 border-t-purple-500 rounded-full"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-8 h-8 text-purple-500 animate-pulse" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold">Writing your letter...</h3>
                        <p className="text-sm text-muted mt-2">Connecting your story to the opportunity...</p>
                    </motion.div>
                ) : (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative bg-card/80 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-8 shadow-2xl h-full flex flex-col"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-black uppercase tracking-widest text-purple-500">Proposed Cover Letter</span>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-lg text-sm font-bold hover:bg-muted transition-colors"
                        >
                          {copied ? (
                            <><Check className="w-4 h-4 text-green-500" /> Copied!</>
                          ) : (
                            <><Copy className="w-4 h-4" /> Copy Text</>
                          )}
                        </button>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                        <p className="whitespace-pre-wrap text-foreground leading-relaxed">
                          {generatedLetter}
                        </p>
                      </div>

                      <div className="mt-8 pt-6 border-t border-border flex items-center gap-3 text-xs text-muted italic">
                        <Brain className="w-3 h-3" /> Professionally crafted by AI to maximize hiring potential.
                      </div>
                    </motion.div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl animate-bounce">
          {error}
        </div>
      )}
    </main>
  );
}
