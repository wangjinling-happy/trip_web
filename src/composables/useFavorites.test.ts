import { nextTick } from "vue";
import { beforeEach, describe, expect, it } from "vitest";
import {
  resetFavoritesForTests,
  useFavorites,
} from "@/composables/useFavorites";

describe("favorites", () => {
  beforeEach(() => {
    resetFavoritesForTests();
  });

  it("toggles and persists favorites", async () => {
    const { favoriteIds, favoriteCount, toggleFavorite, isFavorite } =
      useFavorites();

    toggleFavorite(1);
    await nextTick();

    expect(isFavorite(1)).toBe(true);
    expect(favoriteCount.value).toBe(1);
    expect(favoriteIds.value).toEqual([1]);
    expect(window.localStorage.getItem("travel-china:favorites")).toBe("[1]");

    toggleFavorite(1);
    await nextTick();

    expect(isFavorite(1)).toBe(false);
    expect(favoriteCount.value).toBe(0);
    expect(window.localStorage.getItem("travel-china:favorites")).toBe("[]");
  });

  it("returns saved destinations in data order", () => {
    const { favoriteDestinations, toggleFavorite } = useFavorites();

    toggleFavorite(11);
    toggleFavorite(1);

    expect(
      favoriteDestinations.value.map((destination) => destination.name),
    ).toEqual(["北京", "三亚"]);
  });
});
