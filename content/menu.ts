import type { ListingCategory } from "./listing";

/** Lunch and dinner. To change a dish or a price, edit this file only. */
export const menu: readonly ListingCategory[] = [
  {
    id: "raw",
    label: "Raw and kitfo",
    amharic: "ጥሬ ሥጋና ክትፎ",
    items: [
      {
        name: "Kurt",
        price: "$32 / lb",
        description: "Raw beef cut from selected pieces, served with fiery awaze.",
        raw: true,
      },
      {
        name: "Kitfo",
        price: "$26",
        description:
          "Finely chopped prime beef with spiced butter and mitmita, served with ayib and greens.",
        raw: true,
      },
      {
        name: "Kocho Kitfo",
        price: "$28",
        description: "Our kitfo paired with warm kocho, the traditional enset flatbread.",
        raw: true,
      },
    ],
  },
  {
    id: "tibs",
    label: "Tibs and geba weta",
    amharic: "ጥብስ",
    items: [
      {
        name: "Lega Tibs",
        price: "$24",
        description: "Juicy beef cubes sautéed with rosemary, onion and Ethiopian spices.",
      },
      { name: "Awaze Tibs", price: "$23", description: "Beef cubes in a bold awaze chili sauce." },
      {
        name: "Yeshekla Tibs",
        price: "$25",
        description: "Marbled beef cuts, served sizzling in a clay dish.",
      },
      {
        name: "Geba Weta",
        price: "$24",
        description: "Marbled prime beef slow-cooked in its own fat with rosemary and spices.",
      },
    ],
  },
  {
    id: "stews",
    label: "Stews and firfir",
    amharic: "ወጥና ፍርፍር",
    items: [
      {
        name: "Gomen Besega",
        price: "$22",
        description: "Beef and collard greens in a mild garlic and onion sauce.",
      },
      {
        name: "Misir Besega",
        price: "$22",
        description: "Red lentils with beef, berbere and Ethiopian spices.",
      },
      {
        name: "Sega Firfir",
        price: "$22",
        description: "Shredded injera tossed with beef in a light berbere sauce.",
      },
      {
        name: "Tibs Firfir",
        price: "$22",
        description: "Injera tossed with rosemary beef tibs and onion.",
      },
    ],
  },
  {
    id: "veg",
    label: "Vegetarian and vegan",
    amharic: "የጾም ምግብ",
    items: [
      {
        name: "Veggie Combo",
        price: "$24",
        description:
          "Alicha, shiro, spicy lentils, yellow split peas, collard greens and green beans.",
        diet: ["V", "VE"],
      },
      {
        name: "Shiro Wot",
        price: "$19",
        description: "Ground chickpeas slow-cooked with house spices, served in a clay pot.",
        diet: ["V", "VE"],
      },
      {
        name: "Tofu Dulet",
        price: "$19",
        description: "Tofu with onion, chili, cardamom and pepper.",
        diet: ["V", "VE"],
      },
      {
        name: "Firfir",
        price: "$19",
        description: "Shredded injera in berbere and tomato sauce.",
        diet: ["V", "VE"],
      },
    ],
  },
];
