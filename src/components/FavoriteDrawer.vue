<script setup lang="ts">
import { Heart, Trash2, X } from "lucide-vue-next";
import { onMounted, onUnmounted, watch } from "vue";
import { useFavorites } from "@/composables/useFavorites";

const {
  drawerOpen,
  favoriteDestinations,
  closeDrawer,
  toggleFavorite,
} = useFavorites();

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape" && drawerOpen.value) closeDrawer();
};

watch(drawerOpen, (open) => {
  document.body.classList.toggle("drawer-open", open);
});

onMounted(() => window.addEventListener("keydown", handleEscape));
onUnmounted(() => {
  window.removeEventListener("keydown", handleEscape);
  document.body.classList.remove("drawer-open");
});
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <button
        v-if="drawerOpen"
        type="button"
        class="drawer-backdrop"
        aria-label="关闭收藏抽屉"
        @click="closeDrawer"
      />
    </Transition>

    <Transition name="drawer">
      <aside
        v-if="drawerOpen"
        class="favorite-drawer"
        aria-label="我的收藏"
        aria-modal="true"
        role="dialog"
      >
        <header class="favorite-drawer__header">
          <div>
            <p class="eyebrow">旅行清单</p>
            <h2>我的收藏</h2>
          </div>
          <button
            type="button"
            class="icon-button"
            aria-label="关闭收藏抽屉"
            @click="closeDrawer"
          >
            <X :size="21" aria-hidden="true" />
          </button>
        </header>

        <div v-if="favoriteDestinations.length" class="favorite-drawer__list">
          <article
            v-for="destination in favoriteDestinations"
            :key="destination.id"
            class="favorite-item"
          >
            <RouterLink
              :to="`/destination/${destination.slug}`"
              class="favorite-item__link"
              @click="closeDrawer"
            >
              <img :src="destination.heroImage" :alt="`${destination.name}风景`" />
              <span>
                <strong>{{ destination.name }}</strong>
                <small>{{ destination.province }} · {{ destination.recommendedDays }} 天</small>
              </span>
            </RouterLink>
            <button
              type="button"
              class="icon-button icon-button--danger"
              :aria-label="`移除${destination.name}收藏`"
              @click="toggleFavorite(destination.id)"
            >
              <Trash2 :size="18" aria-hidden="true" />
            </button>
          </article>
        </div>

        <div v-else class="favorite-drawer__empty">
          <span class="empty-icon"><Heart :size="25" aria-hidden="true" /></span>
          <h3>还没有收藏</h3>
          <p>在看到心动的目的地时，点击卡片上的心形按钮即可加入这里。</p>
          <RouterLink class="button button--primary" to="/" @click="closeDrawer">
            开始探索
          </RouterLink>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
