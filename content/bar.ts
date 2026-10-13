import type { ListingCategory } from "./listing";

/** Drinks. To change a drink or a price, edit this file only. */
export const bar: readonly ListingCategory[] = [
  {
    id: "traditional",
    label: "Traditional",
    amharic: "ባህላዊ",
    items: [
      {
        name: "Tej",
        amharic: "ጠጅ",
        price: "$12, flask $38",
        description: "House honey wine, served in a round berele flask.",
      },
      {
        name: "Tella",
        amharic: "ጠላ",
        price: "$9",
        description: "Traditional spiced home-brewed beer.",
      },
      {
        name: "Katikala",
        amharic: "ካቲካላ",
        price: "$11",
        description: "Ethiopian distilled spirit, neat or in a cocktail.",
      },
    ],
  },
  {
    id: "cocktails",
    label: "Cocktails",
    amharic: "ኮክቴል",
    items: [
      { name: "Koba Sun", price: "$16", description: "Tej, lemon, ginger and a gold honey rim." },
      {
        name: "Berbere Margarita",
        price: "$16",
        description: "Tequila, lime, honey and a berbere salt rim.",
      },
      {
        name: "Jebena Espresso Martini",
        price: "$17",
        description: "Ethiopian coffee, vodka and cardamom.",
      },
      {
        name: "Mitmita Mule",
        price: "$15",
        description: "Ginger beer, lime and a touch of mitmita heat.",
      },
    ],
  },
  {
    id: "zero",
    label: "Buna and zero-proof",
    amharic: "ቡና እና ከአልኮል ነፃ",
    items: [
      {
        name: "Buna Ceremony",
        amharic: "ቡና",
        price: "$14",
        description: "Freshly roasted coffee poured from the jebena, with incense.",
      },
      {
        name: "Spris",
        price: "$9",
        description: "Layered fresh juices: avocado, mango and guava.",
      },
      {
        name: "Spiced Shai",
        price: "$6",
        description: "Ethiopian tea with cardamom and cinnamon.",
      },
    ],
  },
];
