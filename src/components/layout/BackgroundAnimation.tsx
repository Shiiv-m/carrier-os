"use client";
import { motion } from "framer-motion";

export default function BackgroundAnimation({ variant = "default" }: { variant?: "default" | "tracker" | "community" | "profile" | "settings" | "source" | "network" }) {
  let orb1 = "bg-primary/20";
  let orb2 = "bg-purple-600/15";
  let orb3 = "bg-indigo-500/10";
  let particle = "bg-primary/40";

  if (variant === "tracker") {
    orb1 = "bg-blue-500/10";
    orb2 = "bg-cyan-500/15";
    orb3 = "bg-sky-500/10";
    particle = "bg-cyan-400/40";
  } else if (variant === "community") {
    orb1 = "bg-orange-500/15";
    orb2 = "bg-yellow-500/15";
    orb3 = "bg-pink-500/10";
    particle = "bg-yellow-400/40";
  } else if (variant === "profile") {
    orb1 = "bg-emerald-500/15";
    orb2 = "bg-teal-500/10";
    orb3 = "bg-cyan-500/10";
    particle = "bg-emerald-400/40";
  } else if (variant === "settings") {
    orb1 = "bg-zinc-500/15";
    orb2 = "bg-stone-500/10";
    orb3 = "bg-neutral-500/10";
    particle = "bg-zinc-400/40";
  } else if (variant === "source") {
    orb1 = "bg-blue-600/15";
    orb2 = "bg-indigo-500/15";
    orb3 = "bg-sky-500/10";
    particle = "bg-indigo-400/40";
  } else if (variant === "network") {
    orb1 = "bg-rose-500/15";
    orb2 = "bg-violet-500/15";
    orb3 = "bg-fuchsia-500/10";
    particle = "bg-rose-400/40";
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1]">
      <motion.div
        animate={{
          y: [0, -40, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[10%] left-[10%] w-[35vw] h-[35vw] max-w-[500px] max-h-[500px] rounded-full blur-[120px] ${orb1}`}
      />
      <motion.div
        animate={{
          y: [0, 50, 0],
          x: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className={`absolute bottom-[10%] right-[5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] ${orb2}`}
      />
      <motion.div
        animate={{
          y: [0, 20, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className={`absolute top-[40%] left-[40%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full blur-[80px] ${orb3}`}
      />
      {/* Tiny floating particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 rounded-full blur-[1px] ${particle}`}
          initial={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: 0
          }}
          animate={{
            y: [0, Math.random() * -100 - 50],
            x: [0, Math.random() * 50 - 25],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  );
}
