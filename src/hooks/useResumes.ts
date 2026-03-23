"use client";

import { useState, useEffect } from "react";
import { Resume } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "builder_resumes";

export function useResumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setResumes(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse resumes", e);
      }
    }
    setIsLoaded(true);
  }, []);

  const saveResume = (resume: Resume) => {
    setResumes((prev) => {
      const existingIndex = prev.findIndex((r) => r.id === resume.id);
      let newResumes;
      const now = new Date().toISOString();
      if (existingIndex >= 0) {
        newResumes = [...prev];
        newResumes[existingIndex] = { ...resume, updatedAt: now };
      } else {
        newResumes = [...prev, { ...resume, createdAt: now, updatedAt: now }];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newResumes));
      return newResumes;
    });
  };

  const deleteResume = (id: string) => {
    setResumes((prev) => {
      const newResumes = prev.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newResumes));
      return newResumes;
    });
  };

  const duplicateResume = (id: string) => {
    setResumes((prev) => {
      const existing = prev.find((r) => r.id === id);
      if (!existing) return prev;
      
      const now = new Date().toISOString();
      const newResume: Resume = {
        ...existing,
        id: uuidv4(),
        title: `${existing.title} (Copy)`,
        createdAt: now,
        updatedAt: now,
      };
      const newResumes = [...prev, newResume];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newResumes));
      return newResumes;
    });
  };

  return { resumes, saveResume, deleteResume, duplicateResume, isLoaded };
}
