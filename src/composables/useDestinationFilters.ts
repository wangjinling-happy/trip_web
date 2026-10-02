import { computed, ref, watch } from "vue";
import type { Ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type {
  BudgetLevel,
  Destination,
  DestinationFilters,
  Region,
  Season,
  SortOption,
  Theme,
} from "@/types/travel";
import {
  BUDGET_LEVELS,
  REGIONS,
  SEASONS,
  SORT_OPTIONS,
  THEMES,
} from "@/types/travel";

export const defaultFilters: DestinationFilters = {
  query: "",
  region: "",
  theme: "",
  season: "",
  budget: "",
  sort: "recommended",
  favoritesOnly: false,
};

type QueryPrimitive = string | null | undefined;
type QueryRecord = Record<string, QueryPrimitive | QueryPrimitive[]>;

const firstValue = (value: QueryPrimitive | QueryPrimitive[]) => {
  const resolved = Array.isArray(value) ? value[0] : value;
  return typeof resolved === "string" ? resolved : "";
};

const isRegion = (value: string): value is Region =>
  REGIONS.includes(value as Region);
const isTheme = (value: string): value is Theme => THEMES.includes(value as Theme);
const isSeason = (value: string): value is Season =>
  SEASONS.includes(value as Season);
const isBudget = (value: string): value is BudgetLevel =>
  BUDGET_LEVELS.includes(value as BudgetLevel);
const isSort = (value: string): value is SortOption =>
  SORT_OPTIONS.some((option) => option.value === value);

export const filtersFromQuery = (query: QueryRecord): DestinationFilters => {
  const region = firstValue(query.region);
  const theme = firstValue(query.theme);
  const season = firstValue(query.season);
  const budget = firstValue(query.budget);
  const sort = firstValue(query.sort);

  return {
    query: firstValue(query.q).trim(),
    region: isRegion(region) ? region : "",
    theme: isTheme(theme) ? theme : "",
    season: isSeason(season) ? season : "",
    budget: isBudget(budget) ? budget : "",
    sort: isSort(sort) ? sort : "recommended",
    favoritesOnly: firstValue(query.saved) === "1",
  };
};

export const filtersToQuery = (
  filters: DestinationFilters,
): Record<string, string> => {
  const query: Record<string, string> = {};

  if (filters.query.trim()) query.q = filters.query.trim();
  if (filters.region) query.region = filters.region;
  if (filters.theme) query.theme = filters.theme;
  if (filters.season) query.season = filters.season;
  if (filters.budget) query.budget = filters.budget;
  if (filters.sort !== "recommended") query.sort = filters.sort;
  if (filters.favoritesOnly) query.saved = "1";

  return query;
};

const querySignature = (query: QueryRecord) => {
  const sorted = Object.entries(query)
    .map(([key, value]) => [key, firstValue(value)] as const)
    .filter(([, value]) => value)
    .sort(([left], [right]) => left.localeCompare(right));

  return JSON.stringify(sorted);
};

export const filterDestinations = (
  items: Destination[],
  filters: DestinationFilters,
  favoriteIds: number[] = [],
) => {
  const keyword = filters.query.trim().toLocaleLowerCase("zh-CN");

  const filtered = items.filter((destination) => {
    const matchesKeyword =
      !keyword ||
      [
        destination.name,
        destination.province,
        destination.region,
        destination.summary,
        destination.description,
        ...destination.themes,
        ...destination.highlights,
        ...destination.attractions.map((attraction) => attraction.name),
      ]
        .join(" ")
        .toLocaleLowerCase("zh-CN")
        .includes(keyword);

    const matchesRegion =
      !filters.region || destination.region === filters.region;
    const matchesTheme =
      !filters.theme || destination.themes.includes(filters.theme);
    const matchesSeason =
      !filters.season || destination.seasons.includes(filters.season);
    const matchesBudget =
      !filters.budget || destination.budgetLevel === filters.budget;
    const matchesFavorites =
      !filters.favoritesOnly || favoriteIds.includes(destination.id);

    return (
      matchesKeyword &&
      matchesRegion &&
      matchesTheme &&
      matchesSeason &&
      matchesBudget &&
      matchesFavorites
    );
  });

  return [...filtered].sort((left, right) => {
    switch (filters.sort) {
      case "rating":
        return right.rating - left.rating || left.id - right.id;
      case "budget-asc":
        return left.dailyBudget - right.dailyBudget || left.id - right.id;
      case "budget-desc":
        return right.dailyBudget - left.dailyBudget || left.id - right.id;
      default:
        return left.id - right.id;
    }
  });
};

export const countActiveFilters = (filters: DestinationFilters) =>
  [
    filters.query.trim(),
    filters.region,
    filters.theme,
    filters.season,
    filters.budget,
    filters.favoritesOnly,
  ].filter(Boolean).length;

export const useDestinationFilters = (
  items: Destination[],
  favoriteIds: Ref<number[]>,
) => {
  const route = useRoute();
  const router = useRouter();
  const filters = ref<DestinationFilters>(
    filtersFromQuery(route.query as QueryRecord),
  );

  const results = computed(() =>
    filterDestinations(items, filters.value, favoriteIds.value),
  );
  const activeFilterCount = computed(() => countActiveFilters(filters.value));

  watch(
    filters,
    (value) => {
      const nextQuery = filtersToQuery(value);
      if (querySignature(route.query as QueryRecord) !== querySignature(nextQuery)) {
        void router.replace({ query: nextQuery });
      }
    },
    { deep: true },
  );

  watch(
    () => route.query,
    (value) => {
      const nextFilters = filtersFromQuery(value as QueryRecord);
      if (
        querySignature(filtersToQuery(filters.value)) !==
        querySignature(value as QueryRecord)
      ) {
        filters.value = nextFilters;
      }
    },
  );

  const resetFilters = () => {
    filters.value = { ...defaultFilters };
  };

  return {
    filters,
    results,
    activeFilterCount,
    resetFilters,
  };
};
