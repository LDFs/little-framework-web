<template>
  <div class="app-container">
    <!-- 各种子应用的入口处 -->
    <div class="app-item" v-for="item in apps" :key="item.appCode" @click="openApp(item)">{{ item.name }}</div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

// 原版是从接口中获取应用目录
const apps = [
  {
    name: 'shiro',
    appCode: 'shiro',
    routeUrl: '/shiro',
  },
  {
    name: 'kuma',
    appCode: 'kuma',
    routeUrl: '/kuma',
  },
]
const router = useRouter();

async function openApp(item: any) {
  await router.push({
    path: item.routeUrl,
  })
}

</script>

<style scoped lang="scss">
.app-container {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 10px;
}
.app-item {
  min-width: 40px;
  min-height: 30px;
  background-color: #ffe1e1;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
}
</style>