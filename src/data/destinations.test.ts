import { describe, expect, it } from "vitest";
import { destinations } from "@/data/destinations";
import {
  BUDGET_LEVELS,
  REGIONS,
  SEASONS,
  THEMES,
} from "@/types/travel";

describe("destination data", () => {
  it("contains the twelve planned destinations with unique identifiers", () => {
    expect(destinations).toHaveLength(12);
    expect(destinations.map((destination) => destination.name)).toEqual([
      "北京",
      "西安",
      "成都",
      "杭州",
      "厦门",
      "青岛",
      "重庆",
      "桂林",
      "大理",
      "丽江",
      "三亚",
      "敦煌",
    ]);
    expect(new Set(destinations.map((destination) => destination.id)).size).toBe(
      destinations.length,
    );
    expect(new Set(destinations.map((destination) => destination.slug)).size).toBe(
      destinations.length,
    );
  });

  it("keeps required content and enum values valid", () => {
    for (const destination of destinations) {
      expect(destination.summary.length).toBeGreaterThan(10);
      expect(destination.description.length).toBeGreaterThan(30);
      expect(destination.heroImage).toMatch(/^https:\/\//);
      expect(destination.gallery.length).toBeGreaterThanOrEqual(3);
      expect(destination.attractions.length).toBeGreaterThanOrEqual(3);
      expect(destination.highlights.length).toBeGreaterThanOrEqual(4);
      expect(destination.foods.length).toBeGreaterThanOrEqual(4);
      expect(destination.transportTips.length).toBeGreaterThanOrEqual(3);
      expect(destination.dailyBudget).toBeGreaterThan(0);
      expect(destination.recommendedDays).toBeGreaterThan(0);
      expect(destination.rating).toBeGreaterThanOrEqual(4);
      expect(destination.rating).toBeLessThanOrEqual(5);
      expect(REGIONS).toContain(destination.region);
      expect(BUDGET_LEVELS).toContain(destination.budgetLevel);
      expect(
        destination.themes.every((theme) => THEMES.includes(theme)),
      ).toBe(true);
      expect(
        destination.seasons.every((season) => SEASONS.includes(season)),
      ).toBe(true);
      expect(
        destination.attractions.every(
          (attraction) =>
            attraction.image.startsWith("https://") &&
            attraction.description.length > 10,
        ),
      ).toBe(true);
    }
  });
});
