<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { RouterView, useRoute } from "vue-router";
import AppFooter from "@/components/AppFooter.vue";
import AppHeader from "@/components/AppHeader.vue";
import FavoriteDrawer from "@/components/FavoriteDrawer.vue";
import { destinations } from "@/data/destinations";

const route = useRoute();

watchEffect(() => {
  if (typeof document === "undefined") return;

  if (route.name === "destination-detail") {
    const destination = destinations.find(
      (item) => item.slug === String(route.params.slug),
    );
    document.title = destination
      ? `${destination.name}旅行指南｜旅见中国`
      : "目的地未找到｜旅见中国";
  } else if (route.name === "not-found") {
    document.title = "页面未找到｜旅见中国";
  } else {
    document.title = "旅见中国｜发现下一段旅程";
  }
});

const isDetailPage = computed(() => route.name === "destination-detail");
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">跳到主要内容</a>
    <AppHeader />
    <main id="main-content" :class="{ 'main-content--detail': isDetailPage }">
      <RouterView />
    </main>
    <AppFooter />
    <FavoriteDrawer />
  </div>
</template>
