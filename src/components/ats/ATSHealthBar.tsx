"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Activity } from "lucide-react";

interface ATSHealthBarProps {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  mode?: 'general' | 'jd-specific';
}

export default function ATSHealthBar({ score, matchedKeywords, missingKeywords, mode = 'general' }: ATSHealthBarProps) {
  // Determine color and glow based on score
  let color = "text-red-500";
  let bgGlow = "shadow-[0_0_15px_rgba(239,68,68,0.5)]";
  let borderColor = "border-red-500/50";
  let gradient = "from-red-500/20 to-transparent";

  if (score >= 80) {
    color = "text-green-500";
    bgGlow = "shadow-[0_0_25px_rgba(34,197,94,0.6)]";
    borderColor = "border-green-500/50";
    gradient = "from-green-500/20 to-transparent";
  } else if (score >= 50) {
    color = "text-yellow-500";
    bgGlow = "shadow-[0_0_20px_rgba(234,179,8,0.5)]";
    borderColor = "border-yellow-500/50";
    gradient = "from-yellow-500/20 to-transparent";
  }

  // We now show it even if JD is not provided, using general mode. 
  // If score is 0 and no keywords (e.g. empty resume), hide it.
  if (score === 0 && matchedKeywords.length === 0 && missingKeywords.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`fixed right-6 top-24 w-72 bg-card/90 backdrop-blur-xl border ${borderColor} rounded-2xl p-5 z-40 transition-all duration-500 ${bgGlow} overflow-hidden`}
    >
      <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-b ${gradient} pointer-events-none opacity-50`} />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Activity className={`w-5 h-5 ${color} animate-pulse`} />
              ATS Health
            </h3>
            <p className="text-[10px] text-muted font-medium uppercase tracking-wider mt-1">
              {mode === 'general' ? 'General Best Practices' : 'JD Keyword Match'}
            </p>
          </div>
          <span className={`text-2xl font-black ${color}`}>{score}%</span>
        </div>

        {/* Score Progress Bar */}
        <div className="w-full bg-background/50 rounded-full h-2.5 mb-6 overflow-hidden border border-border">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-2.5 rounded-full ${color.replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}
          />
        </div>

        {/* Keywords */}
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
          {missingKeywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-red-400 mb-2 uppercase tracking-wider">Missing Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {missingKeywords.slice(0, 10).map((kw) => (
                  <span key={kw} className="flex items-center gap-1 text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-md border border-red-500/20">
                    <XCircle className="w-3 h-3" /> {kw}
                  </span>
                ))}
                {missingKeywords.length > 10 && (
                  <span className="text-xs text-muted">+{missingKeywords.length - 10} more</span>
                )}
              </div>
            </div>
          )}

          {matchedKeywords.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-green-400 mb-2 uppercase tracking-wider">Matched Keywords</p>
              <div className="flex flex-wrap gap-1.5">
                {matchedKeywords.slice(0, 10).map((kw) => (
                  <span key={kw} className="flex items-center gap-1 text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded-md border border-green-500/20">
                    <CheckCircle2 className="w-3 h-3" /> {kw}
                  </span>
                ))}
                {matchedKeywords.length > 10 && (
                  <span className="text-xs text-muted">+{matchedKeywords.length - 10} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
