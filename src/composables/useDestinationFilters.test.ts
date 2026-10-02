import { describe, expect, it } from "vitest";
import { destinations } from "@/data/destinations";
import {
  countActiveFilters,
  defaultFilters,
  filterDestinations,
  filtersFromQuery,
  filtersToQuery,
} from "@/composables/useDestinationFilters";

describe("destination filters", () => {
  it("restores valid filters from a URL query", () => {
    expect(
      filtersFromQuery({
        q: "石窟",
        region: "西北",
        theme: "人文",
        season: "秋",
        budget: "舒适",
        sort: "rating",
        saved: "1",
      }),
    ).toEqual({
      query: "石窟",
      region: "西北",
      theme: "人文",
      season: "秋",
      budget: "舒适",
      sort: "rating",
      favoritesOnly: true,
    });
  });

  it("ignores invalid URL values and serializes active values", () => {
    expect(
      filtersFromQuery({
        region: "不存在的区域",
        season: "第五季",
        sort: "unknown",
      }),
    ).toEqual(defaultFilters);

    expect(
      filtersToQuery({
        ...defaultFilters,
        query: " 海岛 ",
        theme: "海岛",
        sort: "budget-asc",
      }),
    ).toEqual({
      q: "海岛",
      theme: "海岛",
      sort: "budget-asc",
    });
  });

  it("combines keyword, region, theme and season filters", () => {
    const result = filterDestinations(destinations, {
      ...defaultFilters,
      query: "古城",
      region: "西南",
      theme: "古城",
      season: "秋",
    });

    expect(result.map((destination) => destination.name)).toEqual([
      "大理",
      "丽江",
    ]);
  });

  it("sorts by rating and daily budget", () => {
    const byRating = filterDestinations(destinations, {
      ...defaultFilters,
      sort: "rating",
    });
    const byBudget = filterDestinations(destinations, {
      ...defaultFilters,
      sort: "budget-asc",
    });

    expect(byRating[0].name).toBe("敦煌");
    expect(byBudget[0].name).toBe("大理");
    expect(byBudget.at(-1)?.name).toBe("三亚");
  });

  it("limits results to favorites and counts active filters", () => {
    const result = filterDestinations(
      destinations,
      { ...defaultFilters, favoritesOnly: true },
      [1, 11],
    );

    expect(result.map((destination) => destination.name)).toEqual([
      "北京",
      "三亚",
    ]);
    expect(
      countActiveFilters({
        ...defaultFilters,
        query: "北京",
        region: "华北",
        favoritesOnly: true,
      }),
    ).toBe(3);
  });
});
