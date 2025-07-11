<template>
  <div class="application-layout">
    <aside class="sidebar">
      <ul>
        <li v-for="app in apps" :key="app.id" @click="selectApp(app)">
          {{ app.name }}
        </li>
      </ul>
    </aside>
    <main class="content">
      <component :is="selectedApp?.component" v-if="selectedApp"></component>
      <p v-else>请选择一个子应用</p>
    </main>
    <aside class="sidebar">
      <ul>
        <li v-for="app in apps" :key="app.id" @click="selectApp(app)">
          {{ app.name }}
        </li>
      </ul>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

interface App {
  id: number;
  name: string;
  component: string;
  route: string;
}

// 子应用路由配置
const apps = ref<App[]>([
  { id: 1, name: "子应用1", component: "AppOne", route: "/app1" },
  { id: 2, name: "子应用2", component: "AppTwo", route: "/app2" },
  { id: 3, name: "子应用3", component: "AppThree", route: "/app3" },
]);

const selectedApp = ref<App | null>(null);

function selectApp(app: App) {
  selectedApp.value = app;
}
</script>

<style scoped>
.application-layout {
  display: flex;
  height: 100%;
}

.sidebar {
  width: 20%;
  background-color: #f4f4f4;
  padding: 10px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #fff;
}
</style>
