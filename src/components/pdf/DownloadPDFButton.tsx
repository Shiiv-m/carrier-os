"use client";

import dynamic from "next/dynamic";
import { Resume } from "@/types/resume";
import { Download, Loader2 } from "lucide-react";
import ResumePDF from "./ResumePDF";
import { useEffect, useState } from "react";

const PDFDownloadLinkDynamic = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

export default function DownloadPDFButton({ resume }: { resume: Resume }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
     return (
        <button disabled className="flex items-center gap-2 bg-primary/50 text-white px-4 py-2 rounded-lg font-medium transition-colors">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline">Loading PDF...</span>
        </button>
     );
  }

  return (
    <PDFDownloadLinkDynamic
      document={<ResumePDF resume={resume} />}
      fileName={`${resume.title.replace(/\s+/g, "_")}.pdf`}
      className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      {({ loading }: { loading: boolean }) => (
        <>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
          <span className="hidden sm:inline">{loading ? "Generating..." : "Download PDF"}</span>
        </>
      )}
    </PDFDownloadLinkDynamic>
  );
}
