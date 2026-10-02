<script setup lang="ts">
import { Heart, Menu, X } from "lucide-vue-next";
import { onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useFavorites } from "@/composables/useFavorites";

const route = useRoute();
const menuOpen = ref(false);
const { favoriteCount, openDrawer } = useFavorites();

const closeMenu = () => {
  menuOpen.value = false;
};

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === "Escape") closeMenu();
};

watch(
  () => route.fullPath,
  () => closeMenu(),
);

onMounted(() => window.addEventListener("keydown", handleEscape));
onUnmounted(() => window.removeEventListener("keydown", handleEscape));
</script>

<template>
  <header class="site-header">
    <div class="site-header__inner">
      <RouterLink class="brand" to="/" aria-label="旅见中国首页">
        <span class="brand__mark" aria-hidden="true">旅</span>
        <span class="brand__text">
          <strong>旅见中国</strong>
          <small>JOURNEY IN CHINA</small>
        </span>
      </RouterLink>

      <button
        type="button"
        class="menu-button"
        :aria-expanded="menuOpen"
        aria-controls="primary-navigation"
        :aria-label="menuOpen ? '关闭菜单' : '打开菜单'"
        @click="menuOpen = !menuOpen"
      >
        <X v-if="menuOpen" :size="21" aria-hidden="true" />
        <Menu v-else :size="21" aria-hidden="true" />
      </button>

      <nav
        id="primary-navigation"
        class="primary-nav"
        :class="{ 'primary-nav--open': menuOpen }"
        aria-label="主要导航"
      >
        <RouterLink :to="{ path: '/', hash: '#discover' }">发现目的地</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#regions' }">区域灵感</RouterLink>
        <RouterLink :to="{ path: '/', hash: '#about' }">关于旅见</RouterLink>
      </nav>

      <button
        type="button"
        class="header-favorite"
        aria-label="打开我的收藏"
        @click="openDrawer"
      >
        <Heart :size="18" aria-hidden="true" />
        <span>我的收藏</span>
        <span v-if="favoriteCount" class="header-favorite__count">
          {{ favoriteCount }}
        </span>
      </button>
    </div>
  </header>
</template>
