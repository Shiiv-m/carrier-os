"use client";

import { useState, useEffect } from "react";
import { useResumes } from "@/hooks/useResumes";
import { useParams, useRouter } from "next/navigation";
import { Resume, Experience } from "@/types/resume";
import Link from "next/link";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, Download, Plus, Wand2 } from "lucide-react";
import PersonalInfoForm from "@/components/editor/PersonalInfoForm";
import SkillsForm from "@/components/editor/SkillsForm";
import ExperienceForm from "@/components/editor/ExperienceForm";
import EducationForm from "@/components/editor/EducationForm";
import PDFPreview from "@/components/pdf/PDFPreview";
import { motion, AnimatePresence } from "framer-motion";
import { autoTailorResume } from "@/lib/gemini";
import ATSHealthBar from "@/components/ats/ATSHealthBar";
import { calculateATSScore } from "@/lib/ats-scorer";

const STEPS = ["Personal Info", "Skills", "Experience", "Education"];

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const { resumes, saveResume, isLoaded } = useResumes();
  
  const [activeStep, setActiveStep] = useState(0);
  const [resume, setResume] = useState<Resume | null>(null);
  const [isTailoringMode, setIsTailoringMode] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [isAutoTailoring, setIsAutoTailoring] = useState(false);

  // Calculate ATS Score based on current resume contents and JD
  const resumeText = resume ? `${resume.title} ${resume.personalInfo.email} ${resume.personalInfo.linkedin} ${resume.experience.map(e => `${e.position} ${e.company} ${e.description}`).join(' ')} ${resume.skills.map(s => s.name).join(' ')} ${resume.education.map(e => `${e.degree} ${e.institution}`).join(' ')}` : "";
  const { score, matchedKeywords, missingKeywords, mode } = calculateATSScore(resumeText, jobDescription);

  useEffect(() => {
    if (isLoaded) {
      const found = resumes.find((r) => r.id === params.id);
      if (found) {
        setResume(found);
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, resumes, params.id, router]);

  const updateResume = (updated: Resume) => {
    setResume(updated);
    saveResume(updated);
  };

  const handleAutoTailor = async () => {
    if (!resume) return;
    if (!jobDescription.trim()) {
      alert("Please paste a Job Description first!");
      return;
    }
    
    setIsAutoTailoring(true);
    try {
      const response = await autoTailorResume(resume.experience, resume.skills, jobDescription);
      
      const newExperiences = resume.experience.map(exp => {
        const tailoredNode = response.experiences.find(e => e.id === exp.id);
        if (tailoredNode) {
          return { ...exp, description: tailoredNode.description };
        }
        return exp;
      });

      const newSkills = response.skillsToAdd.map(skillName => ({ id: uuidv4(), name: skillName }));

      const updatedResume = {
        ...resume,
        experience: newExperiences,
        skills: [...resume.skills, ...newSkills]
      };

      updateResume(updatedResume as Resume);
    } catch (e) {
      alert("AI Tailoring failed. Please try again.");
    } finally {
      setIsAutoTailoring(false);
    }
  };

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      <ATSHealthBar score={score} matchedKeywords={matchedKeywords} missingKeywords={missingKeywords} mode={mode} />
      
      {/* Top Navbar */}
      <header className="h-16 border-b border-border px-6 flex items-center justify-between shrink-0 bg-card">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-background rounded-full transition-colors hidden sm:block">
            <ArrowLeft className="w-5 h-5 text-muted" />
          </Link>
          <input 
            type="text" 
            value={resume.title}
            onChange={(e) => updateResume({ ...resume, title: e.target.value })}
            className="bg-transparent text-lg font-semibold text-foreground border-b border-transparent hover:border-border focus:border-primary focus:outline-none px-1 py-0.5"
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsTailoringMode(!isTailoringMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${isTailoringMode ? 'bg-primary/20 text-primary border-primary' : 'bg-transparent text-foreground border-border hover:border-primary'}`}
          >
            Tailor to JD
          </button>
          <Link href={`/download/${resume.id}`} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export Resume</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side: Editor */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-border bg-card">
          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-border hide-scrollbar">
            {STEPS.map((step, idx) => (
              <button
                key={step}
                onClick={() => setActiveStep(idx)}
                className={`whitespace-nowrap px-6 py-4 border-b-2 font-medium transition-colors ${
                  activeStep === idx
                    ? "border-primary text-primary"
                    : "border-transparent text-muted hover:text-foreground hover:border-border"
                }`}
              >
                {step}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {activeStep === 0 && <PersonalInfoForm resume={resume} onChange={updateResume} />}
                {activeStep === 1 && <SkillsForm resume={resume} onChange={updateResume} />}
                {activeStep === 2 && <ExperienceForm resume={resume} onChange={updateResume} />}
                {activeStep === 3 && <EducationForm resume={resume} onChange={updateResume} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right Side: PDF Preview or Tailor Mode */}
        <div className="w-full lg:w-1/2 bg-background flex flex-col border-l border-border overflow-hidden">
          <AnimatePresence mode="wait">
            {isTailoringMode ? (
              <motion.div
                key="tailor"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col p-6 h-full"
              >
                 <div className="flex items-center justify-between mb-4">
                   <div>
                     <h2 className="text-xl font-semibold text-foreground">Job Description</h2>
                     <p className="text-sm text-muted">Paste the exact job description below.</p>
                   </div>
                   <button 
                     onClick={handleAutoTailor}
                     className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-5 py-2 rounded-lg font-bold shadow-[0_0_15px_rgba(124,58,237,0.5)] transition-all hover:scale-105"
                   >
                     <Wand2 className="w-5 h-5 animate-pulse" /> Auto-Tailor using AI
                   </button>
                 </div>
                 <textarea
                   className="flex-1 w-full bg-card border border-border rounded-lg p-4 focus:outline-none focus:border-primary resize-none custom-scrollbar"
                   placeholder="Paste Job Description here..."
                   value={jobDescription}
                   onChange={(e) => setJobDescription(e.target.value)}
                 />
              </motion.div>
            ) : (
              <motion.div
                key="preview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-neutral-900/50"
              >
                <PDFPreview resume={resume} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* LOUD Auto-Tailoring Overlay */}
      <AnimatePresence>
        {isAutoTailoring && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl overflow-hidden"
          >
            {/* Spinning massive core */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1.5, 1, 1],
                rotate: [0, 90, 180, 270, 360],
                borderRadius: ["10%", "50%", "10%", "50%", "10%"]
              }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                times: [0, 0.25, 0.5, 0.75, 1],
                repeat: Infinity,
              }}
              className="absolute w-64 h-64 bg-gradient-to-tr from-primary via-fuchsia-500 to-indigo-500 shadow-[0_0_150px_rgba(124,58,237,1)] flex items-center justify-center"
            />
            
            {/* The literal text sitting inside/over the core */}
            <div className="z-10 bg-background/50 p-6 rounded-2xl border border-primary/50 backdrop-blur-md shadow-2xl flex flex-col items-center">
               <Wand2 className="w-16 h-16 text-white mb-4 animate-bounce drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
               <div className="text-white font-black text-3xl text-center capitalize tracking-widest drop-shadow-md">
                 Overclocking<br/>Resume...
               </div>
            </div>

            {/* Chaotic orbiting neon particles */}
            {[...Array(40)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 bg-white rounded-full mix-blend-screen"
                initial={{ x: 0, y: 0 }}
                animate={{
                  x: [0, Math.random() * 1000 - 500, Math.random() * 1000 - 500, 0],
                  y: [0, Math.random() * 1000 - 500, Math.random() * 1000 - 500, 0],
                  scale: [0, 2, 0.5, 0],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: Math.random() * 2 + 1.5,
                  repeat: Infinity,
                  ease: "anticipate"
                }}
                style={{
                  boxShadow: `0 0 20px ${i % 2 === 0 ? '#7C3AED' : '#EC4899'}`
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


