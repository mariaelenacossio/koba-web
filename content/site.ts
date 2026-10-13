/**
 * Restaurant details. Placeholders in [brackets] stay exactly as written until
 * the restaurant confirms them.
 */
export const site = {
  name: "Koba",
  nameAmharic: "ኮባ",
  tagline: "Culture Corner & Eat",
  neighbourhood: "Gastown, Vancouver",
  address: "[street address to confirm]",
  hours: ["Tuesday to Sunday", "[hours to confirm]", "Weekend brunch with buna"],
  phone: "[phone to confirm]",
  email: "[email to confirm]",
  directionsUrl: "https://www.google.com/maps/search/Gastown+Vancouver",
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
    { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
    { label: "TikTok", href: "https://www.tiktok.com/", icon: "tiktok" },
    { label: "YouTube", href: "https://www.youtube.com/", icon: "youtube" },
  ],
} as const;

export type SocialIcon = (typeof site.socials)[number]["icon"];

/** Home page sections, in film order, as they appear in the main nav. */
export const sectionNav = [
  { id: "menu", label: "Menu", amharic: "ምናሌ" },
  { id: "bar", label: "Bar", amharic: "መጠጥ" },
  { id: "film", label: "Film", amharic: "ፊልም" },
  { id: "gallery", label: "Gallery", amharic: "ፎቶዎች" },
  { id: "visit", label: "Visit", amharic: "አድራሻ" },
] as const;

/** The Book dropdown and the booking pages. */
export const bookingLinks = [
  {
    href: "/reserve",
    label: "Reserve a table",
    detail: "Your own table, order from the menu",
    amharic: "ቦታ ይያዙ",
  },
  {
    href: "/gursha",
    label: "Book a Gursha seat",
    detail: "One shared table, $45 per person",
    amharic: "የጉርሻ ማዕድ",
  },
  {
    href: "/#gursha",
    label: "About the Gursha Table",
    detail: "How the shared table works",
    amharic: null,
  },
] as const;

/** Mobile tab bar destinations. The last one is the primary action. */
export const tabBarLinks = [
  { href: "/#menu", sectionId: "menu", label: "Menu", amharic: "ምናሌ" },
  { href: "/#bar", sectionId: "bar", label: "Bar", amharic: "መጠጥ" },
  { href: "/#gursha", sectionId: "gursha", label: "Gursha", amharic: "ጉርሻ" },
  { href: "/#visit", sectionId: "visit", label: "Visit", amharic: "አድራሻ" },
  { href: "/reserve", sectionId: null, label: "Reserve", amharic: "ቦታ ይያዙ" },
] as const;
