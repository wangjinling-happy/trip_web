<script setup lang="ts">
import {
  ArrowRight,
  Bookmark,
  Compass,
  Search,
  SearchX,
  Sparkles,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import DestinationCard from "@/components/DestinationCard.vue";
import FilterBar from "@/components/FilterBar.vue";
import { useDestinationFilters } from "@/composables/useDestinationFilters";
import { useFavorites } from "@/composables/useFavorites";
import { destinations } from "@/data/destinations";
import type { Region } from "@/types/travel";
import { REGIONS } from "@/types/travel";

const heroImage =
  "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=2200&q=86";
const heroFailed = ref(false);

const { favoriteIds, toggleFavorite, isFavorite, favoriteCount } = useFavorites();
const { filters, results, activeFilterCount, resetFilters } =
  useDestinationFilters(destinations, favoriteIds);

const featured = computed(() =>
  [...destinations].sort((left, right) => right.rating - left.rating).slice(0, 3),
);

const regionStats = computed(() =>
  REGIONS.map((region) => ({
    name: region,
    count: destinations.filter((destination) => destination.region === region)
      .length,
  })),
);

const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const searchDestinations = () => {
  scrollToSection("discover");
};

const selectRegion = (region: Region) => {
  filters.value = { ...filters.value, region };
  scrollToSection("discover");
};
</script>

<template>
  <div class="home-view">
    <section class="hero" aria-labelledby="hero-title">
      <img
        v-if="!heroFailed"
        class="hero__media"
        :src="heroImage"
        alt="群山之上的长城与晨光"
        fetchpriority="high"
        @error="heroFailed = true"
      />
      <div class="hero__shade" aria-hidden="true" />

      <div class="hero__content">
        <p class="hero__eyebrow">
          <Compass :size="17" aria-hidden="true" />
          探索中国 · 从一处心动开始
        </p>
        <h1 id="hero-title">旅见中国</h1>
        <p class="hero__lead">
          从古都巷陌到山海岛屿，用真实风景与实用线索，找到下一段旅程。
        </p>

        <form class="hero-search" role="search" @submit.prevent="searchDestinations">
          <Search :size="21" aria-hidden="true" />
          <label class="sr-only" for="destination-search">搜索目的地或景点</label>
          <input
            id="destination-search"
            v-model="filters.query"
            type="search"
            placeholder="想去哪里？试试“海岛”或“石窟”"
            autocomplete="off"
          />
          <button type="submit">
            开始探索
            <ArrowRight :size="18" aria-hidden="true" />
          </button>
        </form>

        <div class="hero__facts" aria-label="平台信息">
          <span><strong>12</strong> 个精选目的地</span>
          <span><strong>5</strong> 大区域灵感</span>
          <span><strong>四季</strong> 出行参考</span>
        </div>
      </div>

      <button
        type="button"
        class="hero__scroll"
        aria-label="继续浏览精选目的地"
        @click="scrollToSection('featured')"
      >
        向下探索
        <ArrowRight :size="16" aria-hidden="true" />
      </button>
    </section>

    <section id="featured" class="section section--featured">
      <div class="section-heading section-heading--split">
        <div>
          <p class="eyebrow">
            <Sparkles :size="15" aria-hidden="true" />
            编辑精选
          </p>
          <h2>此刻最值得出发的方向</h2>
        </div>
        <p>
          综合季节、体验丰富度与旅行节奏，为你挑出三种截然不同的中国风景。
        </p>
      </div>

      <div class="featured-grid">
        <DestinationCard
          v-for="destination in featured"
          :key="destination.id"
          :destination="destination"
          :favorite="isFavorite(destination.id)"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </section>

    <section id="discover" class="section section--discover">
      <div class="section-heading section-heading--split">
        <div>
          <p class="eyebrow">
            <Compass :size="15" aria-hidden="true" />
            目的地图鉴
          </p>
          <h2>按你的偏好去发现</h2>
        </div>
        <p v-if="favoriteCount" class="saved-note">
          <Bookmark :size="16" aria-hidden="true" />
          已收藏 {{ favoriteCount }} 个目的地
        </p>
      </div>

      <FilterBar
        v-model="filters"
        :result-count="results.length"
        :active-filter-count="activeFilterCount"
        @reset="resetFilters"
      />

      <div v-if="results.length" class="destination-grid">
        <DestinationCard
          v-for="destination in results"
          :key="destination.id"
          :destination="destination"
          :favorite="isFavorite(destination.id)"
          @toggle-favorite="toggleFavorite"
        />
      </div>

      <div v-else class="empty-state">
        <span class="empty-state__icon">
          <SearchX :size="30" aria-hidden="true" />
        </span>
        <h3>没有找到匹配的目的地</h3>
        <p>换一个关键词，或放宽区域、季节与预算条件后重试。</p>
        <button type="button" class="button button--primary" @click="resetFilters">
          清除全部筛选
        </button>
      </div>
    </section>

    <section id="regions" class="section section--regions">
      <div class="section-heading section-heading--split">
        <div>
          <p class="eyebrow">区域灵感</p>
          <h2>从地图上挑一个方向</h2>
        </div>
        <p>每个区域都有不同的气候、风味与旅行节奏。</p>
      </div>

      <div class="region-grid">
        <button
          v-for="region in regionStats"
          :key="region.name"
          type="button"
          class="region-card"
          @click="selectRegion(region.name)"
        >
          <span>{{ region.name }}</span>
          <strong>{{ region.count }}</strong>
          <small>个目的地</small>
          <ArrowRight :size="18" aria-hidden="true" />
        </button>
      </div>
    </section>
  </div>
</template>
