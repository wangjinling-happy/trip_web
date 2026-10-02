<script setup lang="ts">
import { Heart, RotateCcw, SlidersHorizontal } from "lucide-vue-next";
import type {
  BudgetLevel,
  DestinationFilters,
  Region,
  Season,
  SortOption,
} from "@/types/travel";
import {
  BUDGET_LEVELS,
  REGIONS,
  SEASONS,
  SORT_OPTIONS,
  THEMES,
} from "@/types/travel";

const model = defineModel<DestinationFilters>({ required: true });
const props = defineProps<{
  resultCount: number;
  activeFilterCount: number;
}>();

const emit = defineEmits<{
  (event: "reset"): void;
}>();

const update = <Key extends keyof DestinationFilters>(
  key: Key,
  value: DestinationFilters[Key],
) => {
  model.value = { ...model.value, [key]: value };
};

const updateSelect = <T extends Region | Season | BudgetLevel | SortOption>(
  key: "region" | "season" | "budget" | "sort",
  event: Event,
) => {
  const value = (event.target as HTMLSelectElement).value as T;
  model.value = { ...model.value, [key]: value };
};
</script>

<template>
  <section class="filter-panel" aria-labelledby="filter-title">
    <div class="filter-panel__header">
      <div>
        <p class="eyebrow">
          <SlidersHorizontal :size="15" aria-hidden="true" />
          精准发现
        </p>
        <h2 id="filter-title">筛选心仪的目的地</h2>
      </div>
      <p class="filter-panel__count">找到 {{ props.resultCount }} 个目的地</p>
    </div>

    <div class="filter-panel__controls">
      <label class="field">
        <span>区域</span>
        <select
          :value="model.region"
          @change="updateSelect<Region>('region', $event)"
        >
          <option value="">全部区域</option>
          <option v-for="region in REGIONS" :key="region" :value="region">
            {{ region }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>季节</span>
        <select
          :value="model.season"
          @change="updateSelect<Season>('season', $event)"
        >
          <option value="">四季皆宜</option>
          <option v-for="season in SEASONS" :key="season" :value="season">
            {{ season }}季
          </option>
        </select>
      </label>

      <label class="field">
        <span>预算</span>
        <select
          :value="model.budget"
          @change="updateSelect<BudgetLevel>('budget', $event)"
        >
          <option value="">全部预算</option>
          <option v-for="budget in BUDGET_LEVELS" :key="budget" :value="budget">
            {{ budget }}
          </option>
        </select>
      </label>

      <label class="field">
        <span>排序</span>
        <select
          :value="model.sort"
          @change="updateSelect<SortOption>('sort', $event)"
        >
          <option
            v-for="option in SORT_OPTIONS"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <div class="filter-panel__footer">
      <div class="theme-filter" role="group" aria-label="旅行主题">
        <button
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip--active': model.theme === '' }"
          @click="update('theme', '')"
        >
          全部主题
        </button>
        <button
          v-for="theme in THEMES"
          :key="theme"
          type="button"
          class="filter-chip"
          :class="{ 'filter-chip--active': model.theme === theme }"
          :aria-pressed="model.theme === theme"
          @click="update('theme', theme)"
        >
          {{ theme }}
        </button>
      </div>

      <div class="filter-panel__actions">
        <button
          type="button"
          class="favorite-filter"
          :class="{ 'favorite-filter--active': model.favoritesOnly }"
          :aria-pressed="model.favoritesOnly"
          @click="update('favoritesOnly', !model.favoritesOnly)"
        >
          <Heart
            :size="16"
            :fill="model.favoritesOnly ? 'currentColor' : 'none'"
            aria-hidden="true"
          />
          只看收藏
        </button>
        <button
          type="button"
          class="clear-filter"
          :disabled="activeFilterCount === 0"
          @click="emit('reset')"
        >
          <RotateCcw :size="16" aria-hidden="true" />
          清除筛选
        </button>
      </div>
    </div>
  </section>
</template>
