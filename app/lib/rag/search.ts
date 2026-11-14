import chunksData from "./policy-chunks.json";
import vaultVehiclesFallback from "./vault-vehicles.json";
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
  let vehicles: Vehicle[] = [];

  try {
    const token = await getAccessToken();

    // Direct live fetch from 'Master Inventory' with zero caching
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/'Master%20Inventory'!A2:AQ220`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      }
    );

    if (res.ok) {
      const data = await res.json();
      const rows: string[][] = data.values || [];

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
          images: [`/cars/${String(carNumber).padStart(3, "0")}.${make}/images.jpg`],
          engine: row[8] || row[7] || "High-Performance Engine",
          horsepower: row[9] ? (row[9].includes("hp") ? row[9] : `${row[9]} hp`) : "Apex Output",
          acceleration: row[11] ? (row[11].includes("s") ? row[11] : `${row[11]}s (0-100 km/h)`) : "Sub-4.0s",
          topSpeed: row[12] ? (row[12].includes("km/h") ? row[12] : `${row[12]} km/h`) : "200+ km/h",
          features: [row[39] || "", row[40] || ""].filter(Boolean),
          description: row[39] || row[40] || `${year} ${make} ${model}`,
        });
      });
    }
  } catch (err) {
    console.warn("Live sheets fetch skipped or timed out, using vault backup:", err);
  }

  // Guaranteed fallback to pre-cached 205 vault vehicles if sheets fetch had no rows
  if (vehicles.length === 0) {
    vehicles = (vaultVehiclesFallback as unknown) as Vehicle[];
  }

  const cleanQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, " ");

  // Check for price constraints
  const maxBudgetMatch =
    cleanQuery.match(/under\s*\$?([0-9,]+)(k|m)?/i) ||
    cleanQuery.match(/less than\s*\$?([0-9,]+)(k|m)?/i);
  let maxBudget: number | null = null;
  if (maxBudgetMatch) {
    let num = parseInt(maxBudgetMatch[1].replace(/,/g, ""), 10);
    if (maxBudgetMatch[2]?.toLowerCase() === "k") num *= 1000;
    if (maxBudgetMatch[2]?.toLowerCase() === "m") num *= 1000000;
    maxBudget = num;
  }

  // Filter vehicles by query terms
  const stopWords = new Set([
    "the", "and", "car", "cars", "show", "what", "have", "you", "tell", "about",
    "some", "any", "are", "there", "list", "give", "can", "see", "which", "with", "does"
  ]);

  const terms = cleanQuery
    .split(/\s+/)
    .filter((t) => t.length >= 2 && !stopWords.has(t));

  const isV12 = /\bv12\b/i.test(cleanQuery);
  const isV8 = /\bv8\b/i.test(cleanQuery);
  const isV10 = /\bv10\b/i.test(cleanQuery);

  const scoredCars = vehicles.map((v) => {
    let score = 0;
    const fullStr = `${v.make} ${v.model} ${v.category} ${v.year} ${v.engine || ""} ${v.horsepower || ""} ${v.description || ""}`.toLowerCase();

    // Specific V12 engine and flagship model matching
    if (isV12) {
      if (
        /812|purosangue|superfast|daytona|phantom|ghost|cullinan|dbs|vanquish|v12|db11|flying spur|continental gt|revuelto|aventador|murcielago|pagani/i.test(
          v.model
        ) ||
        /rolls-royce|rolls royce|pagani/i.test(v.make)
      ) {
        score += 35;
      }
    }

    // Specific V8 engine matching
    if (isV8) {
      if (/v8|roma|f8|corvette|mustang|amg|m5|m8|vantage|dbx|urus/i.test(v.model) || /ferrari|aston martin/i.test(v.make)) {
        score += 25;
      }
    }

    // Specific V10 engine matching
    if (isV10) {
      if (/v10|huracan|r8|lfa|viper/i.test(v.model) || /lamborghini/i.test(v.make)) {
        score += 25;
      }
    }

    for (const t of terms) {
      if (v.make.toLowerCase().includes(t)) score += 15;
      if (v.model.toLowerCase().includes(t)) score += 18;
      if (v.category.toLowerCase().includes(t)) score += 10;
      if (v.engine?.toLowerCase().includes(t)) score += 8;
      if (fullStr.includes(t)) score += 4;
    }

    if (maxBudget !== null) {
      if (v.priceNum <= maxBudget) {
        score += 8;
      } else {
        score -= 25; // penalize over-budget
      }
    }

    return { vehicle: v, score };
  });

  // Filter qualifying vehicles
  let qualifying = scoredCars.filter((item) => item.score > 2);

  // If no exact score > 2, return top scored or curated flagships
  if (qualifying.length === 0) {
    qualifying = scoredCars.slice(0, maxResults);
  }

  // Dynamic Variety & Rotation:
  // Randomly sample among top tier so client receives varied recommendations every time!
  const topScore = Math.max(...qualifying.map((q) => q.score));
  const topTier = qualifying.filter((q) => q.score >= topScore * 0.65);

  const shuffled = [...topTier];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, maxResults).map((item) => item.vehicle);
}

