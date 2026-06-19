// src/lib/mockProducts.ts
// Jeu de données de secours premium utilisant vos photos de collection réelles

export interface MockProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number; // en FCFA
  images: string[];
  sizes: string[];
  stock: number;
  active: boolean;
  featured: boolean;
  collectionId: "normale" | "feminine";
  collection: {
    name: string;
    slug: string;
  };
  category: {
    name: string;
    slug: string;
  };
}

export const mockProducts: MockProduct[] = [
  // ─── COLLECTION NORMALE ───
  {
    id: "prod-normale-1",
    name: "T-Shirt Infini Signature Black",
    slug: "t-shirt-infini-signature-black",
    description: "T-shirt premium confectionné en coton lourd haut de gamme. Coupe oversize moderne, col épais et logo InfiniWear discret sérigraphié sur le torse. La pièce maîtresse de votre garde-robe quotidienne.",
    price: 25000,
    images: ["/images/normale/IMG_2210.PNG"],
    sizes: ["S", "M", "L", "XL"],
    stock: 45,
    active: true,
    featured: true,
    collectionId: "normale",
    collection: { name: "Collection Normale", slug: "normale" },
    category: { name: "T-Shirts", slug: "t-shirts" }
  },
  {
    id: "prod-normale-2",
    name: "Short Molleton Noir Classique",
    slug: "short-molleton-noir-classique",
    description: "Short décontracté en molleton brossé ultra-doux. Coupe décontractée arrivant juste au-dessus du genou, taille élastique avec cordons de serrage premium en métal et poches latérales zippées.",
    price: 20000,
    images: ["/images/normale/IMG_2063.JPG.jpeg"],
    sizes: ["S", "M", "L"],
    stock: 12,
    active: true,
    featured: true,
    collectionId: "normale",
    collection: { name: "Collection Normale", slug: "normale" },
    category: { name: "Shorts", slug: "shorts" }
  },
  {
    id: "prod-normale-3",
    name: "Short Molleton Signature Grey",
    slug: "short-molleton-signature-grey",
    description: "Short de coupe athlétique premium, développé pour allier aisance et esthétique contemporaine. Finition brute vintage sur l'ourlet bas.",
    price: 22000,
    images: ["/images/normale/IMG_2064.JPG.jpeg", "/images/normale/IMG_2065.JPG.jpeg"],
    sizes: ["M", "L", "XL"],
    stock: 19,
    active: true,
    featured: false,
    collectionId: "normale",
    collection: { name: "Collection Normale", slug: "normale" },
    category: { name: "Shorts", slug: "shorts" }
  },
  {
    id: "prod-normale-4",
    name: "Cargo Tech Obsidian",
    slug: "cargo-tech-obsidian",
    description: "Pantalon cargo tactique en nylon résistant à l'eau. Poches cargo géométriques 3D, chevilles ajustables par sangles et boucle utilitaire à la ceinture.",
    price: 35000,
    images: ["/images/normale/IMG_2332.jpeg"],
    sizes: ["S", "M", "L", "XL"],
    stock: 8,
    active: true,
    featured: true,
    collectionId: "normale",
    collection: { name: "Collection Normale", slug: "normale" },
    category: { name: "Pantalons", slug: "pantalons" }
  },
  {
    id: "prod-normale-5",
    name: "Hoodie Structural Silence",
    slug: "hoodie-structural-silence",
    description: "Sweat-shirt à capuche haute densité sans cordons pour une silhouette futuriste propre. Coupe boxy lourde et emmanchures basses inspirées du streetwear haut de gamme.",
    price: 45000,
    images: ["/images/normale/ChatGPT Image 14 juin 2026, 20_26_45.png", "/images/normale/ChatGPT Image 14 juin 2026, 20_31_35.png"],
    sizes: ["S", "M", "L", "XL"],
    stock: 22,
    active: true,
    featured: true,
    collectionId: "normale",
    collection: { name: "Collection Normale", slug: "normale" },
    category: { name: "Sweats & Hoodies", slug: "sweats-hoodies" }
  },

  // ─── COLLECTION FÉMININE ───
  {
    id: "prod-feminine-1",
    name: "Crop Top Infini Rose",
    slug: "crop-top-infini-rose",
    description: "Haut court ajusté confectionné dans une maille technique côtelée ultra-douce. Coloris rose poudré avec logo infini signature tissé en ton sur ton.",
    price: 15000,
    images: ["/images/feminine/IMG_3409.JPG.jpeg"],
    sizes: ["XS", "S", "M"],
    stock: 24,
    active: true,
    featured: true,
    collectionId: "feminine",
    collection: { name: "Collection Féminine", slug: "feminine" },
    category: { name: "Crops", slug: "crops" }
  },
  {
    id: "prod-feminine-2",
    name: "Débardeur Sculpted Beige",
    slug: "debardeur-sculpted-beige",
    description: "Débardeur sculptant premium aux lignes épurées et minimalistes. Dos nageur sophistiqué et finitions thermocollées pour un confort invisible optimal.",
    price: 18000,
    images: ["/images/feminine/IMG_3411.JPG.jpeg"],
    sizes: ["XS", "S", "M", "L"],
    stock: 14,
    active: true,
    featured: true,
    collectionId: "feminine",
    collection: { name: "Collection Féminine", slug: "feminine" },
    category: { name: "Tops", slug: "tops" }
  },
  {
    id: "prod-feminine-3",
    name: "Ensemble Street Chic Noir",
    slug: "ensemble-street-chic-noir",
    description: "Ensemble coordonné associant un haut asymétrique drapé et un pantalon fluide structuré. L'équilibre idéal entre esthétique urbaine et confort moderne.",
    price: 45000,
    images: ["/images/feminine/IMG_3413.JPG.jpeg"],
    sizes: ["S", "M"],
    stock: 5,
    active: true,
    featured: true,
    collectionId: "feminine",
    collection: { name: "Collection Féminine", slug: "feminine" },
    category: { name: "Ensembles", slug: "ensembles" }
  },
  {
    id: "prod-feminine-4",
    name: "T-Shirt Cropped Blanc",
    slug: "t-shirt-cropped-blanc",
    description: "T-shirt boxy raccourci en jersey de coton biologique. Col rond classique ajusté et broderie blanche subtile au dos représentant l'identité InfiniWear.",
    price: 16000,
    images: ["/images/feminine/IMG_3414.JPG.jpeg"],
    sizes: ["XS", "S", "M"],
    stock: 30,
    active: true,
    featured: false,
    collectionId: "feminine",
    collection: { name: "Collection Féminine", slug: "feminine" },
    category: { name: "T-Shirts", slug: "t-shirts" }
  },
  {
    id: "prod-feminine-5",
    name: "Veste Tailleur Sculpted",
    slug: "veste-tailleur-sculpted",
    description: "Veste croisée à coupe structurée, épaules marquées d'inspiration couture et fermeture asymétrique. Un design moderne mêlant tailoring classique et streetwear futuriste.",
    price: 55000,
    images: ["/images/feminine/IMG_3415.JPG.jpeg"],
    sizes: ["S", "M", "L"],
    stock: 3,
    active: true,
    featured: true,
    collectionId: "feminine",
    collection: { name: "Collection Féminine", slug: "feminine" },
    category: { name: "Vestes", slug: "vestes" }
  },
  {
    id: "prod-feminine-6",
    name: "T-Shirt Slim Signature White",
    slug: "t-shirt-slim-signature-white",
    description: "T-shirt ajusté blanc premium en coton léger extensible avec broderie du logo InfiniWear noir sur le torse. Pièce intemporelle pour vos silhouettes décontractées chic.",
    price: 18000,
    images: [
      "/images/feminine/IMG_3416.JPG.jpeg",
      "/images/feminine/IMG_3419.JPG.jpeg",
      "/images/feminine/IMG_3418.JPG.jpeg"
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 42,
    active: true,
    featured: true,
    collectionId: "feminine",
    collection: { name: "Collection Féminine", slug: "feminine" },
    category: { name: "T-Shirts", slug: "t-shirts" }
  },
  {
    id: "prod-feminine-7",
    name: "Débardeur Backless Signature Black",
    slug: "debardeur-backless-signature-black",
    description: "Débardeur en coton nervuré noir avec un dos nageur ajouré très graphique et bretelles croisées sophistiquées. Coupe ajustée ultra-féminine.",
    price: 15000,
    images: [
      "/images/feminine/IMG_3417.JPG.jpeg",
      "/images/feminine/IMG_3418.JPG.jpeg"
    ],
    sizes: ["XS", "S", "M"],
    stock: 18,
    active: true,
    featured: true,
    collectionId: "feminine",
    collection: { name: "Collection Féminine", slug: "feminine" },
    category: { name: "Tops", slug: "tops" }
  },
  {
    id: "prod-feminine-8",
    name: "T-Shirt Slim Signature Blue",
    slug: "t-shirt-slim-signature-blue",
    description: "T-shirt ajusté bleu ciel premium en coton extensible respirant. Logo InfiniWear brodé sur le torse. Parfait à associer avec une jupe en jean pour un look décontracté.",
    price: 18000,
    images: [
      "/images/feminine/IMG_3420.JPG.jpeg",
      "/images/feminine/IMG_3418.JPG.jpeg"
    ],
    sizes: ["XS", "S", "M", "L"],
    stock: 22,
    active: true,
    featured: true,
    collectionId: "feminine",
    collection: { name: "Collection Féminine", slug: "feminine" },
    category: { name: "T-Shirts", slug: "t-shirts" }
  },
  {
    id: "prod-feminine-9",
    name: "Trio Lookbook Infini",
    slug: "trio-lookbook-infini",
    description: "Découvrez nos pièces emblématiques de la Collection Féminine dans ce pack éditorial. Des designs géométriques, des mailles côtelées et des coupes étudiées pour sculpter votre silhouette.",
    price: 48000,
    images: [
      "/images/feminine/IMG_3419.JPG.jpeg",
      "/images/feminine/IMG_3418.JPG.jpeg"
    ],
    sizes: ["S", "M", "L"],
    stock: 7,
    active: true,
    featured: false,
    collectionId: "feminine",
    collection: { name: "Collection Féminine", slug: "feminine" },
    category: { name: "Ensembles", slug: "ensembles" }
  }
];
