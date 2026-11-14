import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getAccessToken } from "@/app/lib/sheets";
import { Vehicle } from "@/app/lib/types";

export const dynamic = "force-dynamic";

const SPREADSHEET_ID = "19Wx2-Tqq9tMxIWzjDLVqDaPTHXKET30cDwU5ii4ZOLU";

export type { Vehicle };

/**
 * Reads local cached images from public/cars/
 * Each folder starts with '001.', '002.', etc.
 */
function getLocalCarImages(): Map<number, string[]> {
  const map = new Map<number, string[]>();
  try {
    const carsDir = path.join(process.cwd(), "public", "cars");
    if (!fs.existsSync(carsDir)) return map;

    const folders = fs.readdirSync(carsDir);
    for (const folder of folders) {
      const match = folder.match(/^(\d{1,3})\./);
      if (!match) continue;
      const num = parseInt(match[1], 10);
      const folderPath = path.join(carsDir, folder);
      if (!fs.statSync(folderPath).isDirectory()) continue;

      const files = fs
        .readdirSync(folderPath)
        .filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

      files.sort((a, b) => {
        const getRank = (name: string) => {
          if (/images\.jpe?g$/i.test(name) || /_1\.jpe?g$/i.test(name)) return 1;
          if (/images\s*\(1\)\.jpe?g$/i.test(name) || /_2\.jpe?g$/i.test(name)) return 2;
          if (/images\s*\(2\)\.jpe?g$/i.test(name) || /_3\.jpe?g$/i.test(name)) return 3;
          const m = name.match(/_(\d+)\./);
          return m ? parseInt(m[1], 10) : 99;
        };
        return getRank(a) - getRank(b);
      });

      const urls = files.map(
        (f) => `/cars/${encodeURIComponent(folder)}/${encodeURIComponent(f)}`
      );
      if (urls.length > 0) {
        map.set(num, urls);
      }
    }
  } catch (e) {
    console.warn("Could not read local cars directory:", e);
  }
  return map;
}

export async function GET() {
  try {
    const token = await getAccessToken();
    const localImagesMap = getLocalCarImages();

    // Fetch from 'Master Inventory' directly
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/'Master%20Inventory'!A2:AQ220`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(12000),
      }
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch Master Inventory: ${await res.text()}`);
    }

    const data = await res.json();
    const rows: string[][] = data.values || [];

    const vehicles: Vehicle[] = [];
    const categoriesSet = new Set<string>();

    rows.forEach((row, idx) => {
      if (!row || row.length < 3) return;

      const carNumber = idx + 1;
      const category = (row[0] || "Sports Cars").trim();
      const make = (row[1] || "").trim();
      const model = (row[2] || "").trim();
      if (!make && !model) return;

      categoriesSet.add(category);

      const yearRaw = (row[3] || "").trim();
      const year = parseInt(yearRaw.replace(/\D/g, ""), 10) || 2026;

      const priceRaw = (row[34] || "$250,000").trim();
      const priceNum = parseInt(priceRaw.replace(/[^0-9]/g, ""), 10) || 250000;
      const formattedPrice = priceRaw.startsWith("$") ? priceRaw : `$${priceNum.toLocaleString("en-US")}`;

      // Images: strictly served from local disk storage (public/cars/)
      const local = localImagesMap.get(carNumber);
      const images: string[] = local && local.length > 0 ? local : ["/hero-bg-desktop.jpg"];

      // "only cars of 2026 and 2027 would have featured tag in it"
      const featured = year === 2026 || year === 2027;

      vehicles.push({
        id: `rmc-${String(carNumber).padStart(3, "0")}`,
        number: carNumber,
        make,
        model,
        year,
        category,
        price: formattedPrice,
        priceNum,
        priceBasis: row[35] || undefined,
        status: row[4] || undefined,
        trim: row[5] || undefined,
        bodyStyle: row[6] || undefined,
        fuel: row[7] || undefined,
        engine: row[8] || undefined,
        horsepower: row[9] ? (row[9].includes("hp") ? row[9] : `${row[9]} hp`) : undefined,
        torque: row[10] ? (row[10].includes("Nm") ? row[10] : `${row[10]} Nm`) : undefined,
        accel: row[11] ? (row[11].includes("s") ? row[11] : `${row[11]} s`) : undefined,
        topSpeed: row[12] ? (row[12].includes("km/h") ? row[12] : `${row[12]} km/h`) : undefined,
        transmission: row[13] || undefined,
        drivetrain: row[14] || undefined,
        seats: row[15] || undefined,
        lengthMm: row[16] ? `${row[16]} mm` : undefined,
        widthMm: row[17] ? `${row[17]} mm` : undefined,
        heightMm: row[18] ? `${row[18]} mm` : undefined,
        bootCargo: row[19] || undefined,
        infotainment: row[20] || undefined,
        interiorComfort: row[21] || undefined,
        safetyAssist: row[22] || undefined,
        factoryWarranty: row[36] || undefined,
        dealershipWarranty: row[37] || undefined,
        serviceInterval: row[38] || undefined,
        sellingPoints: row[39] || undefined,
        bestSuitedFor: row[40] || undefined,
        dataConfidence: row[41] || undefined,
        regionalAvailability: row[42] || undefined,
        images,
        featured,
      });
    });

    // Categories in proper order
    const priorityOrder = [
      "Sports Cars",
      "Hypercars",
      "Grand Tourers",
      "Luxury Sedans",
      "Executive & Comfort",
      "Ultra-Luxury & Flagship",
      "Luxury SUVs",
      "Performance SUVs",
      "Off-Road & 4x4",
      "Electric & Hybrid Luxury",
    ];

    const sortedCategories = [
      ...priorityOrder.filter((c) => categoriesSet.has(c)),
      ...Array.from(categoriesSet).filter((c) => !priorityOrder.includes(c)),
    ];

    return NextResponse.json({
      vehicles,
      categories: sortedCategories,
      total: vehicles.length,
    });
  } catch (err: unknown) {
    console.error("Master Inventory fetch error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load master inventory." },
      { status: 500 }
    );
  }
}
