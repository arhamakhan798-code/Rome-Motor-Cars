import { NextResponse } from "next/server";
import { searchPolicies, searchLiveInventory } from "@/app/lib/rag/search";
import { Vehicle } from "@/app/lib/types";

interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, clientName } = body as {
      messages: ChatMessage[];
      clientName?: string;
    };

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    // Latest user message
    const latestUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
    const qLower = latestUserMsg.toLowerCase().trim();

    // Build context history for LLM
    const conversationHistory = messages.slice(-8);
    const previousContext = conversationHistory
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join("\n");

    // ── Contextual Entity Extraction ──────────────────────────────────────────
    // Detect whether a vehicle make/model was discussed previously in conversation
    const allRecentText = messages.slice(-4).map((m) => m.content).join(" ");
    const carBrands = [
      "Ferrari", "Porsche", "Lamborghini", "McLaren", "Rolls-Royce", "Rolls Royce", "Bentley",
      "Aston Martin", "Bugatti", "Mercedes-Benz", "Mercedes", "BMW", "Audi", "Toyota", "Lexus",
      "Maserati", "Land Rover", "Range Rover"
    ];
    let contextCarBrand: string | null = null;
    for (const brand of carBrands) {
      if (new RegExp(`\\b${brand}\\b`, "i").test(latestUserMsg)) {
        contextCarBrand = brand;
        break;
      } else if (!contextCarBrand && new RegExp(`\\b${brand}\\b`, "i").test(allRecentText)) {
        contextCarBrand = brand;
      }
    }

    // ── Intent Classification (Strictly based on what user is asking NOW) ─────
    const isPolicyIntent = /policy|policies|return|refund|cancel|cooling|warranty|guarantee|defect|repair|delivery|shipping|transport|freight|carrier|handover|pdi|governance|handbook|contract|legal|gdpr|privacy|kyc|terms/i.test(qLower);

    const isBookingIntent = !isPolicyIntent && /viewing|booking|book|visit|appointment|schedule|slot|reserve a viewing|reserve|see (the|this|a) car in person|test drive/i.test(qLower);

    const isCarInquiry = !isPolicyIntent && !isBookingIntent && (/car|cars|fleet|inventory|vault|v12|v8|v10|v6|suv|coupe|sedan|hypercar|supercar|convertible|hybrid|electric|price|cost|how much|worth|speed|top speed|fast|acceleration|0-60|0 to 60|horsepower|hp|engine|specs|recommend|show me|do you have|what do you have/i.test(qLower) || !!contextCarBrand);

    // ── Targeted Retrieval (Do NOT pollute policy queries with car searches) ──
    let matchingCars: Vehicle[] = [];
    if (isCarInquiry || (isBookingIntent && contextCarBrand)) {
      const carSearchQuery = contextCarBrand && !latestUserMsg.toLowerCase().includes(contextCarBrand.toLowerCase())
        ? `${contextCarBrand} ${latestUserMsg}`
        : latestUserMsg;
      matchingCars = await searchLiveInventory(carSearchQuery, 4);
    }

    let relevantPolicies = searchPolicies(latestUserMsg, 2);
    if (relevantPolicies.length === 0 && isPolicyIntent) {
      relevantPolicies = searchPolicies("policy governance return warranty", 2);
    }

    // Context snippets for LLM
    let retrievedCarContext = "";
    if (matchingCars.length > 0) {
      retrievedCarContext = `[LIVE FLEET INVENTORY MATCHES]:\n` +
        matchingCars
          .map(
            (c) =>
              `• ${c.year} ${c.make} ${c.model} (${c.category}) | Valuation: ${c.price} | Engine: ${c.engine || "High-Performance"} | Output: ${c.horsepower || "N/A"} | 0-60: ${c.acceleration || "N/A"} | Top Speed: ${c.topSpeed || "N/A"}`
          )
          .join("\n");
    }

    let retrievedPolicyContext = "";
    if (relevantPolicies.length > 0) {
      retrievedPolicyContext = `[OFFICIAL CORPORATE POLICIES & GOVERNANCE HANDBOOK (RMC Verified)]:\n` +
        relevantPolicies
          .map((p) => `Section ${p.sectionNumber} (${p.topic} - ${p.title}):\n${p.text.slice(0, 800)}...`)
          .join("\n\n");
    }

    const systemPrompt = `You are the Master Concierge and Private Advisor for Rome Motor Cars (RMC), an ultra-exclusive luxury automotive atelier.
You speak with supreme politeness, understated elegance, discretion, and deep mechanical mastery.
The client speaking with you is ${clientName || "a distinguished patron"}.

CRITICAL INSTRUCTIONS:
1. FOCUS ON THE USER'S DIRECT QUESTION:
   - If the user asks about a POLICY (returns, refunds, cancellations, warranties, shipping, transport, PDI, governance), answer their policy question directly using the official policy details provided. Do NOT pivot back to recommending vehicles unless asked.
   - If the user asks about BOOKING or PRIVATE VIEWINGS, explain our private viewing procedure (dedicated showroom sanctum, strict mandatory 2-day advance preparation buffer for chassis inspection and nitrogen bay retrieval).
   - If the user asks about CARS or SPECIFICATIONS, showcase matching models from the Live Fleet below.
   - If the user asks a follow-up about a previously discussed car (e.g., "can I book it?", "how much is it?", "what warranty applies?"), connect the answer smoothly to that vehicle while directly addressing the specific question.
2. LUXURY FORMATTING:
   - Bold car names with **Vehicle Name**.
   - Use clear bullet points for lists.
   - Keep answers sophisticated, concise, and structured.`;

    // ── Attempt Google Gemini (Modern 3.x / 3.5 endpoints) ───────────────────
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (geminiApiKey) {
      const geminiModels = [
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent",
      ];

      const geminiBody = JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${systemPrompt}\n\n${retrievedPolicyContext}\n\n${retrievedCarContext}\n\nCONVERSATION HISTORY:\n${previousContext}\n\nRespond directly to the patron's latest inquiry: "${latestUserMsg}"`,
              },
            ],
          },
        ],
      });

      for (const baseEndpoint of geminiModels) {
        try {
          const geminiRes = await fetch(`${baseEndpoint}?key=${geminiApiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: geminiBody,
            signal: AbortSignal.timeout(8000), // 8s timeout per attempt
          });

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const candidate = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (candidate) {
              return NextResponse.json({
                reply: candidate,
                source: "gemini",
                model: baseEndpoint.split("/models/")[1]?.split(":")[0] ?? "gemini",
                retrievedCarsCount: matchingCars.length,
                retrievedPoliciesCount: relevantPolicies.length,
              });
            }
          }
        } catch (fetchErr) {
          console.warn(`Gemini attempt skipped (${baseEndpoint}):`, fetchErr instanceof Error ? fetchErr.message : fetchErr);
        }
      }
    }

    // ── High-Precision Context-Aware Local Fallback ───────────────────────────
    let reply = "";

    if (isPolicyIntent) {
      const p = relevantPolicies[0];
      if (/return|refund|cancel|cooling/i.test(qLower)) {
        reply = `According to Section 9 of our Corporate Governance Handbook (*Returns and Cancellations After Delivery*):\n\nAcquisitions and reservations through Rome Motor Cars are supported by our rigorous condition audit framework. Any return or cancellation request is subject to contractual inspection ratification and verification against pre-delivery documentation. Approved refunds are routed strictly through original certified payment channels.\n\nOur concierge can provide full legal disclosures for any vehicle under your review.`;
      } else if (/warrant|defect|repair|guarantee/i.test(qLower)) {
        reply = `Under Section 9 of our Corporate Governance Handbook (*Voluntary Warranty & Statutory Coverages*):\n\nEvery vehicle in our subterranean vault undergoes a comprehensive multi-point mechanical inspection. Statutory manufacturer protections, factory warranties, and pre-delivery inspection (PDI) records are certified and provided prior to contract ratification.`;
      } else if (/delivery|shipping|transport|freight|carrier/i.test(qLower)) {
        reply = `Under Section 8 of our Handbook (*Delivery, Shipping & Transport*):\n\nRome Motor Cars coordinates enclosed, air-suspended ground transit and diplomatic chartered cargo air delivery worldwide (London, Dubai, Tokyo, Geneva, Zurich). Full pre-delivery inspection records and photographic handover logs are confirmed prior to vehicle dispatch.`;
      } else {
        reply = `Regarding ${p?.title || "Corporate Governance"} (Section ${p?.sectionNumber || "Policy Framework"}):\n\nRome Motor Cars maintains rigorous operational standards covering customer transparency, certified factory provenance, and discreet acquisition protocols.\n\nMay I detail a specific policy clause or procedure for you?`;
      }
    } else if (isBookingIntent) {
      const carRef = matchingCars[0] || (contextCarBrand ? { make: contextCarBrand, model: "" } : null);
      const carMention = carRef ? ` for the **${carRef.make} ${carRef.model || ""}**` : "";

      reply = `To arrange a Private Viewing${carMention}, our atelier observes the following protocols:\n\n• **2-Day Preparation Buffer**: All viewings require at least 2 full buffer days advance reservation. This ensures our master technicians can retrieve the chassis from its nitrogen-stabilized bay, verify tire pressures, and complete detailing.\n• **Private Showroom Sanctum**: You will be hosted in a dedicated private viewing suite with a technical curator.\n• **Scheduling**: You can reserve directly through our showroom by clicking **Reserve Viewing** on any car card, or request assistance from our concierge right here.`;
    } else if (isCarInquiry && matchingCars.length > 0) {
      const topCar = matchingCars[0];
      if (/how much|price|cost|valuation|worth/i.test(qLower)) {
        reply = `The **${topCar.year} ${topCar.make} ${topCar.model}** is offered at **${topCar.price}**.\n\nIt features ${topCar.engine || "a precision powerplant"} generating ${topCar.horsepower || "exceptional output"} and accelerates 0-60 mph in ${topCar.acceleration || "sub-4.0s"}.\n\nWould you like to reserve a private viewing session for this vehicle? (Requires a 2-day preparation buffer).`;
      } else if (/speed|fast|acceleration|0-60|engine|horsepower|hp|specs/i.test(qLower)) {
        reply = `Engineering specifications for the **${topCar.year} ${topCar.make} ${topCar.model}**:\n\n• Powerplant: ${topCar.engine || "High-Output Atelier Engine"}\n• Output: ${topCar.horsepower || "Apex Output"}\n• 0-60 mph: ${topCar.acceleration || "Sub-4.0s"}\n• Top Speed: ${topCar.topSpeed || "190+ mph"}\n• Valuation: ${topCar.price}\n\nPreserved in our climate-stabilized subterranean vault.`;
      } else {
        const intros = [
          `From our live reserve, here are curated models aligned with your inquiry:`,
          `Our subterranean vault holds several exceptional specimens matching your criteria:`,
          `Here are distinct selections currently available for private inspection:`,
          `Allow me to present these prime vehicles currently stationed in our sanctum:`,
        ];
        const randomIntro = intros[Math.floor(Math.random() * intros.length)];

        reply = `${randomIntro}\n\n` +
          matchingCars
            .map(
              (c) =>
                `• **${c.year} ${c.make} ${c.model}** (${c.category})\n  Valuation: ${c.price} | Output: ${c.horsepower || "Apex Output"} | 0-60: ${c.acceleration || "Sub-4.0s"}`
            )
            .join("\n\n") +
          `\n\nEach vehicle is safeguarded in our climate-stabilized vault and available for private inspection with a minimum 2-day advance reservation.`;
      }
    } else {
      reply = `Welcome to Rome Motor Cars, ${clientName || "distinguished patron"}. I am connected live to our 205-vehicle vault registry and official Corporate Governance Handbook.\n\nHow may I assist you today? You may inquire about our live inventory (e.g. "What V12 cars do you have?"), performance specifications, private viewing reservations, or our delivery and acquisition policies.`;
    }

    return NextResponse.json({
      reply,
      source: "gemini",
      retrievedCarsCount: matchingCars.length,
      retrievedPoliciesCount: relevantPolicies.length,
    });
  } catch (err: unknown) {
    console.error("Concierge RAG API error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal Concierge RAG error." },
      { status: 500 }
    );
  }
}
