export interface ATSScoreResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  mode: 'general' | 'jd-specific';
}

const ACTION_VERBS = ['led', 'managed', 'spearheaded', 'developed', 'created', 'optimized', 'increased', 'decreased', 'resolved', 'architected', 'designed', 'delivered', 'improved'];

export function calculateATSScore(resumeText: string, jobDescription: string): ATSScoreResult {
  if (!resumeText.trim()) {
    return { score: 0, matchedKeywords: [], missingKeywords: [], mode: 'general' };
  }

  const resumeTextLower = resumeText.toLowerCase();

  // Mode 1: General ATS Score (No JD provided)
  if (!jobDescription.trim()) {
    const matched: string[] = [];
    const missing: string[] = [];
    let score = 0;

    // Check email
    if (resumeTextLower.includes('@')) { matched.push('Email'); score += 15; }
    else { missing.push('Email Contact'); }

    // Check LinkedIn
    if (resumeTextLower.includes('linkedin.com')) { matched.push('LinkedIn Profile'); score += 15; }
    else { missing.push('LinkedIn Profile'); }

    // Check Metrics/Numbers
    if (/\d/.test(resumeTextLower)) { matched.push('Quantifiable Metrics'); score += 20; }
    else { missing.push('Quantifiable Metrics (Numbers)'); }

    // Check Action Verbs
    const foundVerbs = ACTION_VERBS.filter(v => resumeTextLower.includes(v));
    if (foundVerbs.length >= 3) { matched.push('Action Verbs'); score += 30; }
    else { missing.push('Strong Action Verbs'); score += (foundVerbs.length * 10); }

    // Word count check (simplistic)
    if (resumeTextLower.split(/\s+/).length > 100) { matched.push('Sufficient Length'); score += 20; }
    else { missing.push('More Content Needed'); }

    return {
      score: Math.min(score, 100),
      matchedKeywords: matched,
      missingKeywords: missing,
      mode: 'general'
    };
  }

  // Mode 2: JD-Specific Keyword Matching
  // Stop words to ignore
  const stopWords = new Set(['and', 'or', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about', 'as', 'of', 'this', 'that']);
  
  // Extract alphabetic words from job description, minimum length 3
  const jdWords = jobDescription.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const uniqueJdKeywords = Array.from(new Set(jdWords)).filter(word => !stopWords.has(word));
  
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const keyword of uniqueJdKeywords) {
    if (resumeTextLower.includes(keyword)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  }

  // Calculate score as percentage of matched keywords
  const totalKeywords = uniqueJdKeywords.length;
  const score = totalKeywords > 0 ? Math.round((matchedKeywords.length / totalKeywords) * 100) : 0;

  return {
    score,
    matchedKeywords,
    missingKeywords,
    mode: 'jd-specific'
  };
}
