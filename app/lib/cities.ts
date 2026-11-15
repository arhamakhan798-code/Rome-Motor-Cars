export const ATELIER_CITIES = [
  "Karachi",
  "Lahore",
  "Islamabad",
  "Dubai",
  "Abu Dhabi",
  "Doha",
  "Riyadh",
  "London",
  "Paris",
  "Monaco",
  "Geneva",
  "Zurich",
  "Milan",
  "New York",
  "Los Angeles",
  "Miami",
  "Tokyo",
  "Singapore",
  "Shanghai",
  "Hong Kong",
] as const;

export type AtelierCity = (typeof ATELIER_CITIES)[number];
