import chunksData from "./policy-chunks.json";
import { getAccessToken } from "../sheets";
import { Vehicle } from "../types";

export interface PolicyResult {
  id: string;
  sectionNumber: string;
  title: string;
  topic: string;
  text: string;
  score: number;
}

const SPREADSHEET_ID = "19Wx2-Tqq9tMxIWzjDLVqDaPTHXKET30cDwU5ii4ZOLU";

/**
 * Semantic & keyword search across the Corporate Policy Handbook
 */
export function searchPolicies(query: string, maxResults = 3): PolicyResult[] {
  if (!query || !query.trim()) return [];

  const rawTokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  const scored: PolicyResult[] = [];

  for (const chunk of chunksData) {
    let score = 0;
    const textLower = chunk.text.toLowerCase();
    const titleLower = chunk.title.toLowerCase();
    const topicLower = chunk.topic.toLowerCase();

    for (const token of rawTokens) {
      // High weight for title / topic match
      if (titleLower.includes(token)) score += 8;
      if (topicLower.includes(token)) score += 6;
      if (chunk.keywords.includes(token)) score += 4;

      // Occurrences in full text
      const regex = new RegExp(`\\b${token}`, "gi");
      const matches = textLower.match(regex);
      if (matches) {
        score += Math.min(matches.length * 1.5, 6);
      }
    }

    // Specific domain boost
    if (query.match(/deposit|reservation|reserve|hold/i) && chunk.text.match(/reservation|deposit|booking/i)) {
      score += 15;
    }
    if (query.match(/return|refund|cancel/i) && chunk.text.match(/refund|return|cooling/i)) {
      score += 15;
    }
    if (query.match(/warrant|guarantee|defect|repair/i) && chunk.text.match(/warranty|after-sales|repair/i)) {
      score += 15;
    }
    if (query.match(/delivery|shipping|transport|handover|carrier/i) && chunk.text.match(/delivery|shipping|handover/i)) {
      score += 15;
    }
    if (query.match(/inspect|pdi|quality|check/i) && chunk.text.match(/inspection|quality|records/i)) {
      score += 15;
    }
    if (query.match(/privacy|data|gdpr|kyc|identity/i) && chunk.text.match(/privacy|data protection|kyc/i)) {
      score += 15;
    }

    if (score > 3) {
      scored.push({
        id: chunk.id,
        sectionNumber: chunk.sectionNumber,
        title: chunk.title,
        topic: chunk.topic,
        text: chunk.text,
        score,
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, maxResults);
}

/**
 * Real-time live Google Sheets search for vehicle inventory
 * Automatically reflects ANY change in Google Sheets instantaneously!
 */
export async function searchLiveInventory(query: string, maxResults = 4): Promise<Vehicle[]> {
  try {
    const token = await getAccessToken();

    // Direct live fetch from 'Master Inventory' with zero caching
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/'Master%20Inventory'!A2:AQ220`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      console.warn("Could not fetch live sheets for RAG:", await res.text());
      return [];
    }

    const data = await res.json();
    const rows: string[][] = data.values || [];

    const vehicles: Vehicle[] = [];
    rows.forEach((row, idx) => {
      if (!row || row.length < 3) return;
      const make = (row[1] || "").trim();
      const model = (row[2] || "").trim();
      if (!make && !model) return;

      const carNumber = idx + 1;
      const category = (row[0] || "Sports Cars").trim();
      const year = parseInt((row[3] || "2026").replace(/\D/g, ""), 10) || 2026;
      const priceRaw = (row[34] || "$250,000").trim();
      const priceNum = parseInt(priceRaw.replace(/[^0-9]/g, ""), 10) || 250000;
      const formattedPrice = priceRaw.startsWith("$") ? priceRaw : `$${priceNum.toLocaleString("en-US")}`;

      vehicles.push({
        id: `rmc-${String(carNumber).padStart(3, "0")}`,
        number: carNumber,
        make,
        model,
        year,
        category,
        price: formattedPrice,
        priceNum,
        images: [`/cars/001.Porsche/images.jpg`], // lightweight for RAG context
        engine: row[5] || "",
        horsepower: row[6] || "",
        acceleration: row[8] || "",
        topSpeed: row[9] || "",
        features: [row[35] || "", row[36] || ""].filter(Boolean),
        description: row[37] || `${year} ${make} ${model}`,
      });
    });

    const q = query.toLowerCase();

    // Check for price constraints
    const maxBudgetMatch = q.match(/under\s*\$?([0-9,]+)(k|m)?/i) || q.match(/less than\s*\$?([0-9,]+)(k|m)?/i);
    let maxBudget: number | null = null;
    if (maxBudgetMatch) {
      let num = parseInt(maxBudgetMatch[1].replace(/,/g, ""), 10);
      if (maxBudgetMatch[2]?.toLowerCase() === "k") num *= 1000;
      if (maxBudgetMatch[2]?.toLowerCase() === "m") num *= 1000000;
      maxBudget = num;
    }

    // Filter vehicles by query terms
    const terms = q.split(/\s+/).filter((t) => t.length >= 3 && !["the", "and", "car", "cars", "show", "what", "have", "you", "tell", "about"].includes(t));

    const scoredCars = vehicles.map((v) => {
      let score = 0;
      const fullStr = `${v.make} ${v.model} ${v.category} ${v.year} ${v.engine} ${v.horsepower} ${v.description}`.toLowerCase();

      for (const t of terms) {
        if (v.make.toLowerCase().includes(t)) score += 10;
        if (v.model.toLowerCase().includes(t)) score += 12;
        if (v.category.toLowerCase().includes(t)) score += 8;
        if (v.engine?.toLowerCase().includes(t)) score += 6;
        if (fullStr.includes(t)) score += 3;
      }

      if (maxBudget !== null) {
        if (v.priceNum <= maxBudget) {
          score += 5;
        } else {
          score -= 20; // penalize over-budget
        }
      }

      return { vehicle: v, score };
    });

    // Filter qualifying vehicles
    const qualifying = scoredCars.filter((item) => item.score > 2);

    if (qualifying.length === 0) {
      return [];
    }

    // Dynamic Variety & Rotation:
    // If multiple vehicles match well (e.g. asking for "Toyota" or "Ferrari" with many models),
    // group by top score band and randomly sample so the client receives fresh, varied recommendations
    // rather than the identical 3 cars every time they ask!
    const topScore = Math.max(...qualifying.map((q) => q.score));
    // Consider vehicles within 60% of top score as top tier
    const topTier = qualifying.filter((q) => q.score >= topScore * 0.6);

    // Shuffle topTier randomly (Fisher-Yates)
    const shuffled = [...topTier];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, maxResults).map((item) => item.vehicle);
  } catch (err) {
    console.error("Live inventory RAG search error:", err);
    return [];
  }
}

