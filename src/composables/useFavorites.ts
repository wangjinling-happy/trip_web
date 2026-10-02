import { computed, ref, watch } from "vue";
import { destinations } from "@/data/destinations";

const STORAGE_KEY = "travel-china:favorites";

const readFavorites = () => {
  if (typeof window === "undefined") return [] as number[];

  try {
    const stored = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "[]",
    ) as unknown;

    return Array.isArray(stored)
      ? stored.filter(
          (value): value is number =>
            typeof value === "number" && Number.isInteger(value),
        )
      : [];
  } catch {
    return [];
  }
};

const favoriteIds = ref<number[]>(readFavorites());
const drawerOpen = ref(false);

watch(
  favoriteIds,
  (value) => {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }
  },
  { deep: true },
);

const favoriteDestinations = computed(() =>
  destinations.filter((destination) => favoriteIds.value.includes(destination.id)),
);

const toggleFavorite = (destinationId: number) => {
  favoriteIds.value = favoriteIds.value.includes(destinationId)
    ? favoriteIds.value.filter((id) => id !== destinationId)
    : [...favoriteIds.value, destinationId];
};

const isFavorite = (destinationId: number) =>
  favoriteIds.value.includes(destinationId);

export const useFavorites = () => ({
  favoriteIds,
  favoriteDestinations,
  favoriteCount: computed(() => favoriteIds.value.length),
  drawerOpen,
  openDrawer: () => {
    drawerOpen.value = true;
  },
  closeDrawer: () => {
    drawerOpen.value = false;
  },
  toggleFavorite,
  isFavorite,
});

export const resetFavoritesForTests = () => {
  favoriteIds.value = [];
  drawerOpen.value = false;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Test runtimes can expose a storage getter that is unavailable.
    }
  }
};
