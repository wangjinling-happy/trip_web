<script setup lang="ts">
import {
  ArrowLeft,
  CalendarDays,
  CircleDollarSign,
  Clock,
  Compass,
  ExternalLink,
  Heart,
  Images,
  MapPin,
  Route,
  Star,
  TrainFront,
  Utensils,
} from "lucide-vue-next";
import { computed } from "vue";
import { useRoute } from "vue-router";
import DestinationCard from "@/components/DestinationCard.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import SmartImage from "@/components/SmartImage.vue";
import { useFavorites } from "@/composables/useFavorites";
import { destinations } from "@/data/destinations";

const route = useRoute();
const { toggleFavorite, isFavorite } = useFavorites();

const destination = computed(() =>
  destinations.find((item) => item.slug === String(route.params.slug)),
);

const relatedDestinations = computed(() => {
  if (!destination.value) return [];

  const sameRegion = destinations.filter(
    (item) =>
      item.region === destination.value?.region &&
      item.id !== destination.value?.id,
  );
  const fallback = destinations.filter(
    (item) =>
      item.region !== destination.value?.region &&
      item.id !== destination.value?.id,
  );

  return [...sameRegion, ...fallback].slice(0, 3);
});

const priceFormatter = new Intl.NumberFormat("zh-CN", {
  style: "currency",
  currency: "CNY",
  maximumFractionDigits: 0,
});
</script>

<template>
  <NotFoundView v-if="!destination" />

  <article v-else class="detail-view">
    <header class="detail-hero">
      <SmartImage
        class="detail-hero__image"
        :src="destination.heroImage"
        :alt="`${destination.name}风景`"
        ratio="auto"
        eager
      />
      <div class="detail-hero__shade" aria-hidden="true" />
      <div class="detail-hero__content">
        <RouterLink class="back-link" to="/#discover">
          <ArrowLeft :size="17" aria-hidden="true" />
          返回目的地
        </RouterLink>
        <p class="detail-hero__location">
          <MapPin :size="16" aria-hidden="true" />
          {{ destination.province }} · {{ destination.region }}
        </p>
        <h1>{{ destination.name }}</h1>
        <p>{{ destination.summary }}</p>
        <div class="detail-hero__actions">
          <button
            type="button"
            class="button button--light"
            :aria-pressed="isFavorite(destination.id)"
            @click="toggleFavorite(destination.id)"
          >
            <Heart
              :size="18"
              :fill="isFavorite(destination.id) ? 'currentColor' : 'none'"
              aria-hidden="true"
            />
            {{ isFavorite(destination.id) ? "已收藏" : "收藏目的地" }}
          </button>
          <a
            class="button button--ghost-light"
            :href="destination.mapUrl"
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink :size="18" aria-hidden="true" />
            百度地图
          </a>
        </div>
      </div>
    </header>

    <div class="detail-layout">
      <div class="detail-main">
        <section class="detail-intro" aria-labelledby="overview-title">
          <p class="eyebrow">目的地速览</p>
          <h2 id="overview-title">为什么去{{ destination.name }}</h2>
          <p>{{ destination.description }}</p>

          <div class="highlight-list">
            <span v-for="highlight in destination.highlights" :key="highlight">
              {{ highlight }}
            </span>
          </div>
        </section>

        <section class="detail-gallery" aria-labelledby="gallery-title">
          <div class="section-heading">
            <p class="eyebrow">
              <Images :size="15" aria-hidden="true" />
              风景切片
            </p>
            <h2 id="gallery-title">先看一眼目的地</h2>
          </div>
          <div class="gallery-grid">
            <SmartImage
              v-for="(photo, index) in destination.gallery"
              :key="photo"
              :src="photo"
              :alt="`${destination.name}风景图 ${index + 1}`"
              :ratio="index === 0 ? '16 / 12' : '4 / 3'"
            />
          </div>
        </section>

        <section class="detail-attractions" aria-labelledby="attractions-title">
          <div class="section-heading section-heading--split">
            <div>
              <p class="eyebrow">
                <Route :size="15" aria-hidden="true" />
                推荐路线
              </p>
              <h2 id="attractions-title">值得留时间的地方</h2>
            </div>
            <p>以下停留时间为常规建议，实际节奏可按体力与交通调整。</p>
          </div>

          <div class="attraction-list">
            <article
              v-for="attraction in destination.attractions"
              :key="attraction.name"
              class="attraction-card"
            >
              <SmartImage
                :src="attraction.image"
                :alt="attraction.name"
                ratio="4 / 3"
              />
              <div>
                <span class="tag">{{ attraction.type }}</span>
                <h3>{{ attraction.name }}</h3>
                <p>{{ attraction.description }}</p>
                <small><Clock :size="14" aria-hidden="true" /> {{ attraction.duration }}</small>
              </div>
            </article>
          </div>
        </section>

        <section class="detail-local" aria-labelledby="local-title">
          <div class="local-card local-card--food">
            <span class="local-card__icon">
              <Utensils :size="22" aria-hidden="true" />
            </span>
            <div>
              <p class="eyebrow">地方风味</p>
              <h2 id="local-title">到了要吃什么</h2>
              <div class="tag-list">
                <span v-for="food in destination.foods" :key="food" class="tag">
                  {{ food }}
                </span>
              </div>
            </div>
          </div>

          <div class="local-card">
            <span class="local-card__icon">
              <TrainFront :size="22" aria-hidden="true" />
            </span>
            <div>
              <p class="eyebrow">交通提示</p>
              <h2>出发前留意</h2>
              <ul class="tips-list">
                <li v-for="tip in destination.transportTips" :key="tip">
                  {{ tip }}
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <aside class="detail-sidebar" aria-label="旅行信息">
        <div class="quick-facts">
          <h2>旅行信息</h2>
          <dl>
            <div>
              <dt><Star :size="17" aria-hidden="true" /> 推荐评分</dt>
              <dd>{{ destination.rating.toFixed(1) }}</dd>
            </div>
            <div>
              <dt><CalendarDays :size="17" aria-hidden="true" /> 建议停留</dt>
              <dd>{{ destination.recommendedDays }} 天</dd>
            </div>
            <div>
              <dt><CircleDollarSign :size="17" aria-hidden="true" /> 日均预算</dt>
              <dd>{{ priceFormatter.format(destination.dailyBudget) }}</dd>
            </div>
            <div>
              <dt><Compass :size="17" aria-hidden="true" /> 适合季节</dt>
              <dd>{{ destination.seasons.join("、") }}季</dd>
            </div>
          </dl>
          <a
            class="button button--primary button--full"
            :href="destination.mapUrl"
            target="_blank"
            rel="noreferrer"
          >
            在地图中查看
            <ExternalLink :size="16" aria-hidden="true" />
          </a>
        </div>
      </aside>
    </div>

    <section class="section detail-related">
      <div class="section-heading section-heading--split">
        <div>
          <p class="eyebrow">继续发现</p>
          <h2>下一站，也许在这里</h2>
        </div>
        <p>从相近区域出发，或换一种风景继续旅行。</p>
      </div>
      <div class="destination-grid">
        <DestinationCard
          v-for="item in relatedDestinations"
          :key="item.id"
          :destination="item"
          :favorite="isFavorite(item.id)"
          @toggle-favorite="toggleFavorite"
        />
      </div>
    </section>
  </article>
</template>
