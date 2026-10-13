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

/**
 * Booking rules. DEMO VALUES until the restaurant confirms them; swapping in
 * the real ones is a change to this object only. Emails and the site URL are
 * environment variables (BOOKINGS_NOTIFY_EMAIL, BOOKINGS_FROM_EMAIL,
 * NEXT_PUBLIC_SITE_URL).
 */
export const booking = {
  timeZone: "America/Vancouver",
  /** 0 is Sunday, 1 is Monday. Closed Mondays. */
  closedWeekdays: [1],
  hoursLabel: "Tuesday to Sunday, 5:00 to 10:00 pm",
  /** How many days ahead a guest can book, counting today as day 0. */
  windowDays: 60,
  reservation: {
    times: ["5:00 pm", "6:30 pm", "8:00 pm"],
    maxGuests: 8,
  },
  gursha: {
    times: ["6:30 pm", "8:30 pm"],
    seatsPerSitting: 12,
    maxSeatsPerBooking: 6,
    pricePerSeat: 45,
    setTypes: [
      { value: "standard", label: "Standard set" },
      { value: "vegetarian", label: "Vegetarian set" },
      { value: "vegan", label: "Vegan set" },
    ],
  },
  /** Bookings are deleted this many months after the visit. */
  retentionMonths: 12,
} as const;

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
