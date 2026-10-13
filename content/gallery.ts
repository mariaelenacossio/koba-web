import manifest from "./stills.generated.json";

/**
 * Film stills used across the site and in the gallery. Pixel data and the
 * exact frame times come from `pnpm media:stills` (stills.generated.json);
 * the words live here.
 */

export const galleryCategories = [
  { id: "patio", label: "Patio" },
  { id: "coffee", label: "Coffee ceremony" },
  { id: "dining", label: "Dining" },
  { id: "gursha", label: "Gursha" },
  { id: "bar", label: "Bar" },
] as const;

export type GalleryCategory = (typeof galleryCategories)[number]["id"];

const alt = {
  "patio-02":
    "The hostess, in a white habesha kemis with a green and gold tibeb border, welcomes guests at the carved entrance under the gold KOBA sign.",
  "patio-06": "The hostess walks through the open carved walnut doors toward the candlelit room.",
  "coffee-10":
    "A coffee ceremony just inside the entrance, incense rising, framed by gold leaf banana leaf panels.",
  "coffee-14": "The hostess walks past the buna ceremony and into the dining room.",
  "dining-19":
    "A server pours from a brass jug for guests at a candlelit table, the backlit bar behind.",
  "dining-24": "A server in a green and gold jacket looks after a full dining room.",
  "dining-28":
    "A server in white gloves brings a platter of injera and stews to a table as the hostess looks on.",
  "gursha-32":
    "Guests reach across one shared injera platter at the Gursha Table, feeding each other a bite.",
  "gursha-34":
    "The hostess and her guests reach into the same injera platter at the Gursha Table, laughing.",
  "gursha-37": "The hostess laughs with guests at the Gursha Table, emerald velvet drapes behind.",
  "bar-44": "The bartender stirs a drink at the green marble bar while the hostess looks on.",
  "bar-49": "The bartender stirs a cocktail in front of gold honeycomb panels and amber bottles.",
  "tej-52":
    "The bartender pours tej from a bottle into a round berele flask, the hostess smiling behind the bar.",
  "tej-58": "A berele flask of tej on the bar, the hostess smiling behind it.",
} as const satisfies Record<string, string>;

export type StillId = keyof typeof alt;

export type Still = {
  id: StillId;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Gallery filter. Tej stills sit under Bar. */
  category: GalleryCategory;
  /** Second in the film this frame comes from. */
  time: number;
};

function isStillId(id: string): id is StillId {
  return id in alt;
}

export const stills: Still[] = manifest.map((m) => {
  if (!isStillId(m.id)) {
    throw new Error(
      `content/gallery.ts has no alt text for still "${m.id}". Add it before using the still.`,
    );
  }
  return {
    id: m.id,
    src: m.src,
    width: m.width,
    height: m.height,
    alt: alt[m.id],
    category: (m.scene === "tej" ? "bar" : m.scene) as GalleryCategory,
    time: m.chosen,
  };
});

export function still(id: StillId): Still {
  const found = stills.find((s) => s.id === id);
  if (!found)
    throw new Error(`Still "${id}" is not in stills.generated.json. Run pnpm media:stills.`);
  return found;
}
