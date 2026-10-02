<script setup lang="ts">
import { Compass } from "lucide-vue-next";
</script>

<template>
  <footer id="about" class="site-footer">
    <div class="site-footer__inner">
      <div>
        <p class="footer-brand">
          <Compass :size="20" aria-hidden="true" />
          旅见中国
        </p>
        <p class="footer-copy">
          用可靠的旅行线索，帮助你找到下一次出发的方向。
        </p>
      </div>
      <p class="footer-note">
        本页为旅行灵感演示项目，价格与开放信息请以出行时官方发布为准。
      </p>
    </div>
  </footer>
</template>
