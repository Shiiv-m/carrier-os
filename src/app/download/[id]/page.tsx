"use client";

import { useEffect, useState, use } from "react";
import { useResumes } from "@/hooks/useResumes";
import { useRouter } from "next/navigation";
import { Resume } from "@/types/resume";
import DownloadPDFButton from "@/components/pdf/DownloadPDFButton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function DownloadPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { resumes, isLoaded } = useResumes();
  
  const [resume, setResume] = useState<Resume | null>(null);
  const [timeLeft, setTimeLeft] = useState(5);
  
  const resolvedParams = use(params);

  useEffect(() => {
    if (isLoaded) {
      const found = resumes.find((r) => r.id === resolvedParams.id);
      if (found) {
        setResume(found);
      } else {
        router.push("/");
      }
    }
  }, [isLoaded, resumes, resolvedParams.id, router]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [timeLeft]);

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <Link href={`/editor/${resume.id}`} className="absolute top-8 left-8 flex items-center gap-2 text-muted hover:text-foreground transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Editor
      </Link>

      <div className="w-full max-w-2xl flex flex-col items-center text-center">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 mb-6">
          Your Resume is Ready!
        </h1>
        
        {/* Placeholder Ad Block */}
        <div className="w-full max-w-lg aspect-video bg-card border-2 border-dashed border-border rounded-xl flex flex-col mb-8 p-8 relative overflow-hidden group">
          <div className="absolute top-2 right-2 text-[10px] text-muted uppercase font-bold tracking-widest bg-background/50 px-2 py-1 rounded">Advertisement</div>
          <div className="m-auto flex flex-col items-center justify-center text-center">
             <div className="w-16 h-16 bg-primary/20 rounded-full mb-4 animate-pulse"></div>
             <h3 className="font-semibold text-lg text-foreground mb-2">Support DoneDone!</h3>
             <p className="text-muted text-sm max-w-sm">
                These ads help us provide you our services for free of cost. Check out our amazing sponsors.
             </p>
          </div>
        </div>

        {/* Download Action Area */}
        <div className="h-24 flex items-center justify-center">
          {timeLeft > 0 ? (
            <div className="text-xl font-medium text-muted">
              Preparing secure PDF in <span className="text-primary font-bold">{timeLeft}</span> seconds...
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring" }}
            >
              <DownloadPDFButton resume={resume} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
