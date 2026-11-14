import crypto from "crypto";
import fs from "fs";
import path from "path";

const SPREADSHEET_ID = "19Wx2-Tqq9tMxIWzjDLVqDaPTHXKET30cDwU5ii4ZOLU";
const SHEET_NAME = "Clients";

// Cached token
let cachedToken: { token: string; expiresAt: number } | null = null;

function getServiceAccount() {
  // 1. Check all possible environment variable names
  const envJson =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
    process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT ||
    process.env.SERVICE_ACCOUNT_JSON;

  if (envJson && envJson.trim().length > 0) {
    try {
      let rawStr = envJson.trim();
      // Remove wrapping single/double quotes if user pasted with quotes
      if (
        (rawStr.startsWith("'") && rawStr.endsWith("'")) ||
        (rawStr.startsWith('"') && rawStr.endsWith('"'))
      ) {
        rawStr = rawStr.slice(1, -1);
      }
      const parsed = JSON.parse(rawStr);
      if (parsed.private_key) {
        parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
      }
      return parsed;
    } catch {
      try {
        const decoded = Buffer.from(envJson.trim(), "base64").toString("utf-8");
        const parsed = JSON.parse(decoded);
        if (parsed.private_key) {
          parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON:", e);
      }
    }
  }

  // 2. Check individual environment variables
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  if (clientEmail && privateKey) {
    return {
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, "\n"),
    };
  }

  // 3. Local filesystem fallback (local dev)
  const primaryPath = path.join(process.cwd(), "service-account.json");
  const fallbackPath = path.join(process.cwd(), "..", "rome-motor-cars-1b038ee7e6af.json");

  let filePath = primaryPath;
  if (!fs.existsSync(primaryPath) && fs.existsSync(fallbackPath)) {
    filePath = fallbackPath;
  }

  if (fs.existsSync(filePath)) {
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    if (parsed.private_key) {
      parsed.private_key = parsed.private_key.replace(/\\n/g, "\n");
    }
    return parsed;
  }

  throw new Error(
    "Google Service Account credentials not found. Please add GOOGLE_SERVICE_ACCOUNT_JSON to your Vercel Environment Variables (select Production, Preview, Development) and trigger a redeployment."
  );
}

function base64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.token;
  }

  const sa = getServiceAccount();
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = base64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    })
  );

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(`${header}.${claimSet}`);
  const signature = sign.sign(sa.private_key, "base64url");
  const assertion = `${header}.${claimSet}.${signature}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Failed to obtain Google access token: ${errText}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: now + (data.expires_in || 3600),
  };
  return data.access_token;
}

export interface ClientRecord {
  rowNumber?: number;
  clientId: string;
  username: string;
  email: string;
  passwordHash: string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
}

/**
 * Ensures the 'Clients' tab exists in the master Google Sheet, with headers:
 * [Client ID, Username, Email, PasswordHash, Avatar, CreatedAt, LastLogin]
 */
export async function ensureClientsSheet(): Promise<void> {
  const token = await getAccessToken();

  // Get sheet metadata
  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties`,
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!metaRes.ok) {
    throw new Error(`Failed to fetch spreadsheet metadata: ${await metaRes.text()}`);
  }

  const meta = await metaRes.json();
  const existingSheets: string[] =
    meta.sheets?.map((s: { properties: { title: string } }) => s.properties.title) || [];

  if (!existingSheets.includes(SHEET_NAME)) {
    // Create the 'Clients' sheet
    const addRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: SHEET_NAME,
                  gridProperties: { rowCount: 1000, columnCount: 10 },
                },
              },
            },
          ],
        }),
      }
    );

    if (!addRes.ok) {
      throw new Error(`Failed to create Clients tab: ${await addRes.text()}`);
    }

    // Insert headers
    const headerRow = [
      ["Client ID", "Username", "Email", "PasswordHash", "Avatar", "CreatedAt", "LastLogin"],
    ];
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A1:G1?valueInputOption=RAW`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: headerRow }),
      }
    );
  }
}

/**
 * Fetch all clients from Google Sheet
 */
export async function getAllClients(): Promise<ClientRecord[]> {
  await ensureClientsSheet();
  const token = await getAccessToken();

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A2:G`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch clients: ${await res.text()}`);
  }

  const data = await res.json();
  const rows: string[][] = data.values || [];

  return rows.map((row, index) => ({
    rowNumber: index + 2, // 1-based index, row 1 is header
    clientId: row[0] || "",
    username: row[1] || "",
    email: row[2] || "",
    passwordHash: row[3] || "",
    avatar: row[4] || "",
    createdAt: row[5] || "",
    lastLogin: row[6] || "",
  }));
}

/**
 * Add a new client to the Google Sheet
 */
export async function insertClient(client: Omit<ClientRecord, "rowNumber">): Promise<ClientRecord> {
  await ensureClientsSheet();
  const token = await getAccessToken();

  const rowData = [
    client.clientId,
    client.username,
    client.email,
    client.passwordHash,
    client.avatar,
    client.createdAt,
    client.lastLogin,
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A:G:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [rowData] }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to append client: ${await res.text()}`);
  }

  return { ...client };
}

/**
 * Update an existing client's details in the Google Sheet
 */
export async function updateClientRow(
  rowNumber: number,
  client: Omit<ClientRecord, "rowNumber">
): Promise<void> {
  const token = await getAccessToken();

  const rowData = [
    client.clientId,
    client.username,
    client.email,
    client.passwordHash,
    client.avatar,
    client.createdAt,
    client.lastLogin,
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}!A${rowNumber}:G${rowNumber}?valueInputOption=USER_ENTERED`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [rowData] }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to update client row ${rowNumber}: ${await res.text()}`);
  }
}

// ── Password Hashing Helpers ─────────────────────────────────
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, originalHash] = storedHash.split(":");
  if (!salt || !originalHash) return false;
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return hash === originalHash;
}

// ── Private Viewings Management ──────────────────────────────
const VIEWINGS_SHEET_NAME = "Private Viewings";

export interface ViewingRecord {
  tokenNumber: string;
  timestamp: string;
  clientId: string;
  username: string;
  email: string;
  vehicleId: string;
  vehicleName: string;
  vehicleYear: number;
  requestedDate: string;
  specialNotes: string;
  status: string; // 'In Process' | 'Confirmed' | 'Completed' | 'Cancelled'
  lastUpdated?: string;
}

/**
 * Ensures 'Private Viewings' tab exists in Google Sheets
 */
export async function ensureViewingsSheet(): Promise<void> {
  const token = await getAccessToken();

  const metaRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?fields=sheets.properties`,
    {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!metaRes.ok) return;

  const meta = await metaRes.json();
  const existingSheets: string[] =
    meta.sheets?.map((s: { properties: { title: string } }) => s.properties.title) || [];

  if (!existingSheets.includes(VIEWINGS_SHEET_NAME)) {
    const addRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: VIEWINGS_SHEET_NAME,
                  gridProperties: { rowCount: 1000, columnCount: 15 },
                },
              },
            },
          ],
        }),
      }
    );

    if (addRes.ok) {
      const headers = [
        "Token Number",
        "Timestamp",
        "Client ID",
        "Username",
        "Email",
        "Vehicle ID",
        "Vehicle Name",
        "Vehicle Year",
        "Requested Date",
        "Special Notes",
        "Status",
        "Last Updated",
      ];

      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${VIEWINGS_SHEET_NAME}!A1:L1?valueInputOption=USER_ENTERED`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ values: [headers] }),
        }
      );
    }
  }
}

/**
 * Insert a new viewing request into Google Sheets
 */
export async function insertViewingRecord(record: ViewingRecord): Promise<void> {
  await ensureViewingsSheet();
  const token = await getAccessToken();

  const rowData = [
    record.tokenNumber,
    record.timestamp,
    record.clientId,
    record.username,
    record.email,
    record.vehicleId,
    record.vehicleName,
    record.vehicleYear,
    record.requestedDate,
    record.specialNotes,
    record.status || "In Process",
    record.lastUpdated || record.timestamp,
  ];

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${VIEWINGS_SHEET_NAME}!A:L:append?valueInputOption=USER_ENTERED`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ values: [rowData] }),
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to append viewing record: ${await res.text()}`);
  }
}

/**
 * Get all viewings for a given client ID from Google Sheets
 */
export async function getClientViewings(clientId: string): Promise<ViewingRecord[]> {
  await ensureViewingsSheet();
  const token = await getAccessToken();

  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${VIEWINGS_SHEET_NAME}!A2:L200`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const rows: string[][] = data.values || [];

  const viewings: ViewingRecord[] = [];
  const cleanId = clientId.trim().toLowerCase();

  rows.forEach((row) => {
    if (!row || row.length < 3) return;
    const rowClientId = (row[2] || "").trim().toLowerCase();
    if (rowClientId === cleanId) {
      viewings.push({
        tokenNumber: row[0] || "",
        timestamp: row[1] || "",
        clientId: row[2] || "",
        username: row[3] || "",
        email: row[4] || "",
        vehicleId: row[5] || "",
        vehicleName: row[6] || "",
        vehicleYear: parseInt(row[7], 10) || 2026,
        requestedDate: row[8] || "",
        specialNotes: row[9] || "",
        status: row[10] || "In Process",
        lastUpdated: row[11] || "",
      });
    }
  });

  // Sort newest first
  viewings.reverse();
  return viewings;
}


