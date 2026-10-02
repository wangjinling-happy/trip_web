# 旅见中国

一个使用 Vue 3、TypeScript 和 Vite 构建的国内旅游推荐网页。项目包含 12 个目的地的搜索、组合筛选、详情、收藏抽屉和响应式布局，全部使用本地静态数据与远程 Unsplash 图片。

## 本地运行

```bash
npm install
npm run dev
```

## 验证命令

```bash
npm run typecheck
npm test
npm run build
```

## 项目结构

- `src/data/destinations.ts`：目的地、景点、美食与交通数据
- `src/composables/useDestinationFilters.ts`：搜索、筛选、排序与 URL 同步
- `src/composables/useFavorites.ts`：收藏状态与本地持久化
- `src/views/HomeView.vue`：首页探索体验
- `src/views/DestinationDetailView.vue`：目的地详情页

景区开放、价格和交通信息均可能变化，实际出行请以官方发布为准。
