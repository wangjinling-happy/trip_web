<script setup lang="ts">
import { ref, watch } from "vue";
import { Mountain } from "lucide-vue-next";

const props = withDefaults(
  defineProps<{
    src: string;
    alt: string;
    ratio?: string;
    eager?: boolean;
  }>(),
  {
    ratio: "16 / 10",
    eager: false,
  },
);

const failed = ref(false);
const loaded = ref(false);

watch(
  () => props.src,
  () => {
    failed.value = false;
    loaded.value = false;
  },
);
</script>

<template>
  <div
    class="smart-image"
    :class="{ 'smart-image--loaded': loaded, 'smart-image--failed': failed }"
    :style="{ aspectRatio: ratio }"
  >
    <img
      v-if="!failed"
      :src="src"
      :alt="alt"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      @load="loaded = true"
      @error="failed = true"
    />
    <div v-else class="smart-image__fallback" role="img" :aria-label="alt">
      <Mountain :size="32" aria-hidden="true" />
      <span>图片暂不可用</span>
    </div>
  </div>
</template>

<style scoped>
.smart-image {
  position: relative;
  width: 100%;
  overflow: hidden;
  background:
    linear-gradient(135deg, rgba(23, 58, 58, 0.08), rgba(184, 80, 56, 0.08)),
    var(--color-surface-muted);
}

.smart-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transform: scale(1.015);
  transition:
    opacity 420ms ease,
    transform 700ms ease;
}

.smart-image--loaded img {
  opacity: 1;
  transform: scale(1);
}

.smart-image__fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 0.65rem;
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

@media (prefers-reduced-motion: reduce) {
  .smart-image img {
    transition: none;
    transform: none;
  }
}
</style>
