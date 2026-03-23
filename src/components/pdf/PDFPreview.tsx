"use client";

import dynamic from "next/dynamic";
import { Resume } from "@/types/resume";

const PDFViewerDynamic = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center text-muted">Loading PDF Viewer...</div> }
);

import ResumePDF from "./ResumePDF";

export default function PDFPreview({ resume }: { resume: Resume | null }) {
  if (!resume) return null;

  return (
    <div className="w-full h-[80vh] min-h-[500px]">
      <PDFViewerDynamic className="w-full h-full border-none rounded-sm shadow-2xl" showToolbar={false}>
        <ResumePDF resume={resume} isPreview={true} />
      </PDFViewerDynamic>
    </div>
  );
}
