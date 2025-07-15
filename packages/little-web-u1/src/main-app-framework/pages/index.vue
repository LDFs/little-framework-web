<template>
  <div class="app-container">
    <!-- 各种子应用的入口处 -->
    <div class="app-item" v-for="item in microApps" :key="item.appCode" @click="openApp(item)">{{ item.name }}</div>
    <!-- 用来展示应用的啥啥吧 -->
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import {microApps} from '../../store/index.ts'

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