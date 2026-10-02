<script setup lang="ts">
import {
  CalendarDays,
  Heart,
  MapPin,
  Star,
  WalletCards,
} from "lucide-vue-next";
import { computed } from "vue";
import SmartImage from "@/components/SmartImage.vue";
import type { Destination } from "@/types/travel";

const props = defineProps<{
  destination: Destination;
  favorite: boolean;
}>();

const emit = defineEmits<{
  (event: "toggle-favorite", id: number): void;
}>();

const priceLabel = computed(() =>
  new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    maximumFractionDigits: 0,
  }).format(props.destination.dailyBudget),
);
</script>

<template>
  <article class="destination-card">
    <RouterLink
      class="destination-card__image-link"
      :to="`/destination/${destination.slug}`"
      :aria-label="`查看${destination.name}旅行指南`"
    >
      <SmartImage
        :src="destination.heroImage"
        :alt="`${destination.name}风景`"
        ratio="16 / 11"
      />
      <span class="destination-card__region">{{ destination.region }}</span>
    </RouterLink>

    <button
      type="button"
      class="favorite-button"
      :class="{ 'favorite-button--active': favorite }"
      :aria-label="favorite ? `取消收藏${destination.name}` : `收藏${destination.name}`"
      :aria-pressed="favorite"
      @click="emit('toggle-favorite', destination.id)"
    >
      <Heart :size="19" :fill="favorite ? 'currentColor' : 'none'" aria-hidden="true" />
    </button>

    <div class="destination-card__body">
      <div class="destination-card__heading">
        <div>
          <p class="destination-card__location">
            <MapPin :size="14" aria-hidden="true" />
            {{ destination.province }}
          </p>
          <h3>
            <RouterLink :to="`/destination/${destination.slug}`">
              {{ destination.name }}
            </RouterLink>
          </h3>
        </div>
        <span class="rating">
          <Star :size="15" fill="currentColor" aria-hidden="true" />
          {{ destination.rating.toFixed(1) }}
        </span>
      </div>

      <p class="destination-card__summary">{{ destination.summary }}</p>

      <div class="tag-list" aria-label="旅行主题">
        <span v-for="theme in destination.themes" :key="theme" class="tag">
          {{ theme }}
        </span>
      </div>

      <dl class="destination-card__meta">
        <div>
          <dt><CalendarDays :size="15" aria-hidden="true" /> 建议</dt>
          <dd>{{ destination.recommendedDays }} 天</dd>
        </div>
        <div>
          <dt><WalletCards :size="15" aria-hidden="true" /> 日均</dt>
          <dd>{{ priceLabel }}</dd>
        </div>
      </dl>
    </div>
  </article>
</template>
