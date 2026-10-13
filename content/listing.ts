/** Shared shape for the menu and the bar. */
export type Diet = "V" | "VE";

export type ListingItem = {
  name: string;
  /** Amharic name, shown beside the English one. */
  amharic?: string;
  price: string;
  description: string;
  /** Dietary marks, shown as plain text ("V / VE"). */
  diet?: readonly Diet[];
  /** Contains raw or undercooked ingredients; shown as "*". */
  raw?: boolean;
};

export type ListingCategory = {
  id: string;
  label: string;
  amharic: string;
  items: readonly ListingItem[];
};
