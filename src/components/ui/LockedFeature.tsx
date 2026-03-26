"use client";

import { Lock, Check } from "lucide-react";
import { motion } from "framer-motion";

interface LockedFeatureProps {
  children: React.ReactNode;
  featureName?: string;
  isLocked?: boolean;
  description?: string[];
}

export default function LockedFeature({
  children,
  featureName,
  isLocked = true,
  description = [],
}: LockedFeatureProps) {
  if (!isLocked) return <>{children}</>;

  return (
    <div className="relative group/locked overflow-hidden rounded-2xl w-full h-full min-h-[400px] max-h-screen">
      {/* Visual content with reduced opacity and disabled interaction */}
      <div className="opacity-20 grayscale-[0.8] pointer-events-none transition-all duration-700 filter blur-[2px] group-hover/locked:blur-[4px] h-full overflow-hidden">
        {children}
      </div>

      {/* Locked Overlay */}
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-background/20 backdrop-blur-[2px]">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="bg-card/90 border border-border/50 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-6 backdrop-blur-xl max-w-sm border-t-primary/20"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_30px_rgba(124,58,237,0.3)] animate-pulse">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-card"></div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground tracking-tight">
                {featureName || "Feature"}
              </h3>
              <p className="text-xs text-primary font-bold uppercase tracking-[0.2em]">
                Coming Soon to Pro
              </p>
            </div>

            {description.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border/50 text-left">
                {description.map((point, index) => (
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    key={index} 
                    className="flex gap-2 items-start"
                  >
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted leading-relaxed">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
            
            <button className="w-full mt-2 bg-primary hover:bg-primary/90 text-white py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
              Notify Me When Ready
            </button>
          </div>
        </motion.div>
      </div>

      {/* Subtle border overlay */}
      <div className="absolute inset-0 border-2 border-primary/5 rounded-2xl pointer-events-none group-hover/locked:border-primary/20 transition-colors duration-700" />
    </div>
  );
}

