<script setup lang="ts">
import { ArrowLeft, MapPinned } from "lucide-vue-next";
</script>

<template>
  <section class="not-found" aria-labelledby="not-found-title">
    <div class="not-found__mark" aria-hidden="true">
      <MapPinned :size="40" />
    </div>
    <p class="eyebrow">404 · 路线之外</p>
    <h1 id="not-found-title">这处风景暂时没有收录</h1>
    <p>也许是链接写错了，或者这段旅程还没有抵达。返回首页继续寻找目的地。</p>
    <RouterLink class="button button--primary" to="/">
      <ArrowLeft :size="17" aria-hidden="true" />
      返回首页
    </RouterLink>
  </section>
</template>
