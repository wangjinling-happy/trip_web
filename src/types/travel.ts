export const REGIONS = ["华北", "华东", "华南", "西南", "西北"] as const;
export const THEMES = ["自然", "人文", "古城", "城市", "海岛", "美食"] as const;
export const SEASONS = ["春", "夏", "秋", "冬"] as const;
export const BUDGET_LEVELS = ["经济", "舒适", "品质"] as const;
export const SORT_OPTIONS = [
  { value: "recommended", label: "综合推荐" },
  { value: "rating", label: "评分优先" },
  { value: "budget-asc", label: "日均预算从低到高" },
  { value: "budget-desc", label: "日均预算从高到低" },
] as const;

export type Region = (typeof REGIONS)[number];
export type Theme = (typeof THEMES)[number];
export type Season = (typeof SEASONS)[number];
export type BudgetLevel = (typeof BUDGET_LEVELS)[number];
export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

export interface Attraction {
  name: string;
  image: string;
  description: string;
  duration: string;
  type: Theme;
}

export interface Destination {
  id: number;
  slug: string;
  name: string;
  province: string;
  region: Region;
  summary: string;
  description: string;
  heroImage: string;
  gallery: string[];
  themes: Theme[];
  seasons: Season[];
  budgetLevel: BudgetLevel;
  dailyBudget: number;
  recommendedDays: number;
  rating: number;
  highlights: string[];
  attractions: Attraction[];
  foods: string[];
  transportTips: string[];
  mapUrl: string;
}

export interface DestinationFilters {
  query: string;
  region: Region | "";
  theme: Theme | "";
  season: Season | "";
  budget: BudgetLevel | "";
  sort: SortOption;
  favoritesOnly: boolean;
}
