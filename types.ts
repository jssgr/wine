export enum Role {
  TASTER = 'taster',
  ADMIN = 'admin',
}

export interface User {
  name: string;
  role: Role;
}

export enum WineType {
    RED = 'Tinto',
    WHITE = 'Blanco',
    ROSE = 'Rosado',
    SPARKLING = 'Espumoso',
    DESSERT = 'Postre',
}

export enum Clarity {
    CLEAR = 'Limpio',
    HAZY = 'Turbio',
    CLOUDY = 'Opaco',
}

export enum Body {
    LIGHT = 'Ligero',
    MEDIUM = 'Medio',
    FULL = 'Robusto',
}

export enum Aroma {
    FRUITY = 'Afrutado',
    FLORAL = 'Floral',
    SPICY = 'Especiado',
    WOODY = 'Madera',
    EARTHY = 'Terroso',
    HERBAL = 'Herbal',
}

export interface TastingRecord {
  id: string;
  tasterName: string;
  date: string; // ISO string format
  wineName: string;
  winery: string;
  year: number;
  wineType: WineType;
  region: string;
  // Visual
  appearanceColor: string;
  appearanceClarity: Clarity;
  // Olfactory
  aromaIntensity: number; // 1-5 slider
  aromaNotes: Aroma[]; // Checkboxes
  // Gustatory
  flavorAcidity: number; // 1-5 slider
  flavorTannins: number; // 1-5 slider
  flavorBody: Body;
  finish: number; // 1-5 stars
  // Overall
  overallRating: number; // 1-5 stars
  notes: string;
}