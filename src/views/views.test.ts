import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import { beforeEach, describe, expect, it } from "vitest";
import { resetFavoritesForTests } from "@/composables/useFavorites";
import DestinationDetailView from "@/views/DestinationDetailView.vue";
import HomeView from "@/views/HomeView.vue";

const createTestRouter = async (path: string) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: "/", component: HomeView },
      { path: "/destination/:slug", component: DestinationDetailView },
    ],
  });

  await router.push(path);
  await router.isReady();
  return router;
};

describe("views", () => {
  beforeEach(() => {
    resetFavoritesForTests();
  });

  it("renders the home hero and discovery controls", async () => {
    const router = await createTestRouter("/");
    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.get("#hero-title").text()).toBe("旅见中国");
    expect(wrapper.get("#destination-search").attributes("placeholder")).toContain(
      "海岛",
    );
    expect(wrapper.get("#filter-title").text()).toContain("筛选");
  });

  it("renders a destination detail by slug", async () => {
    const router = await createTestRouter("/destination/beijing");
    const wrapper = mount(DestinationDetailView, {
      global: {
        plugins: [router],
      },
    });

    expect(wrapper.get("h1").text()).toBe("北京");
    expect(wrapper.text()).toContain("故宫博物院");
    expect(wrapper.text()).toContain("北京烤鸭");
  });

  it("updates saved-only results when a destination is favorited", async () => {
    const router = await createTestRouter("/");
    const wrapper = mount(HomeView, {
      global: {
        plugins: [router],
      },
    });

    await wrapper.get(".favorite-filter").trigger("click");
    await nextTick();
    expect(wrapper.findAll(".destination-grid .destination-card")).toHaveLength(0);

    await wrapper.get(".featured-grid .favorite-button").trigger("click");
    await nextTick();

    const savedCards = wrapper.findAll(".destination-grid .destination-card");
    expect(savedCards).toHaveLength(1);
    expect(savedCards[0].text()).toContain("敦煌");
  });
});
