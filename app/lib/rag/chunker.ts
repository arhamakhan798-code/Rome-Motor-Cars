import fs from "fs";
import path from "path";

export interface PolicyChunk {
  id: string;
  sectionNumber: string;
  title: string;
  topic: string;
  text: string;
  keywords: string[];
}

export function generatePolicyChunks(): PolicyChunk[] {
  const filePath = path.join(process.cwd(), "policies_extracted.txt");
  if (!fs.existsSync(filePath)) {
    console.warn("policies_extracted.txt not found");
    return [];
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

  const chunks: PolicyChunk[] = [];
  let currentSecNum = "Intro";
  let currentTitle = "Corporate Policy & Governance Handbook Overview";
  let currentTopic = "General Overview & Scope";
  let currentParagraphs: string[] = [];

  const flush = () => {
    if (currentParagraphs.length > 0) {
      const fullText = currentParagraphs.join("\n\n");
      if (fullText.length > 60) {
        const id = `policy-${currentSecNum.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${chunks.length + 1}`;
        // Extract basic keywords for semantic matching
        const words = fullText
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, " ")
          .split(/\s+/)
          .filter((w) => w.length >= 4);
        const uniqueKeywords = Array.from(new Set(words)).slice(0, 30);

        chunks.push({
          id,
          sectionNumber: currentSecNum,
          title: currentTitle,
          topic: currentTopic,
          text: fullText,
          keywords: uniqueKeywords,
        });
      }
      currentParagraphs = [];
    }
  };

  const sectionRegex = /^(\d{1,2}|Appendix\s+[A-F])\.\s*(.+)$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect new major section
    const secMatch = line.match(sectionRegex);
    if (secMatch) {
      flush();
      currentSecNum = secMatch[1];
      currentTitle = secMatch[2];
      currentTopic = `${currentSecNum}. ${currentTitle}`;
      continue;
    }

    // Detect subsection e.g. 5.1, 5.2, 9.3
    const subMatch = line.match(/^(\d{1,2}\.\d{1,2})\s+(.+)$/);
    if (subMatch && currentParagraphs.length > 4) {
      // Chunk within large section
      flush();
      currentTopic = `${subMatch[1]} ${subMatch[2]}`;
    }

    currentParagraphs.push(line);
  }

  flush();
  return chunks;
}

// Write to static JSON cache
const chunks = generatePolicyChunks();
const outPath = path.join(process.cwd(), "app", "lib", "rag", "policy-chunks.json");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(chunks, null, 2), "utf-8");
console.log(`Successfully generated ${chunks.length} clean semantic policy chunks.`);

