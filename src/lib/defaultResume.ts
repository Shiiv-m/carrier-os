import { Resume } from "@/types/resume";
import { v4 as uuidv4 } from "uuid";

export const createEmptyResume = (): Resume => {
  const now = new Date().toISOString();
  return {
    id: uuidv4(),
    title: "Untitled Resume",
    createdAt: now,
    updatedAt: now,
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
    },
    skills: [],
    experience: [],
    education: [],
  };
};
