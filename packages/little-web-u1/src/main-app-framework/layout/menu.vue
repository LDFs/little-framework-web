<template>
  <div class="menu-container">
    <!-- 循环渲染每个菜单项 -->
    <div 
      v-for="item in menuItems" 
      :key="item.appCode" 
      class="menu-item-wrapper"
      @mouseenter="handleMouseEnter(item.appCode)"
      @mouseleave="handleMouseLeave(item.appCode)"
      @click="handleItemClick(item)"
    >
      <span :style="{ color: isHovered[item.appCode] ? 'white' : 'gray' }" class="menu-item-text">
        {{ item.name }}
      </span>
      <button 
        :style="{ backgroundColor: getRandomLightColor(item.appCode) }"
        class="menu-item"
      >
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 定义传入的 props
const props = defineProps<{
  menuItems: Array<{ appCode: string; name: string }>
}>();

// 定义事件发射
const emits = defineEmits(['item-click']);

// 记录每个菜单项的悬停状态
const isHovered = ref<Record<string, boolean>>({});

// 处理鼠标进入事件
const handleMouseEnter = (id: string) => {
  isHovered.value[id] = true;
};

// 处理鼠标离开事件
const handleMouseLeave = (id: string) => {
  isHovered.value[id] = false;
};

// 生成随机浅色系颜色
const getRandomLightColor = (id: string) => {
  // 为每个菜单项缓存颜色，保证颜色固定
  if (!getRandomLightColor.colors[id]) {
    const r = Math.floor(180 + Math.random() * 76);
    const g = Math.floor(180 + Math.random() * 76);
    const b = Math.floor(180 + Math.random() * 76);
    getRandomLightColor.colors[id] = `rgb(${r}, ${g}, ${b})`;
  }
  return getRandomLightColor.colors[id];
};
// 用于缓存每个菜单项的颜色
getRandomLightColor.colors = {};

// 处理菜单项点击事件
const handleItemClick = (item: { appCode: string; name: string }) => {
  emits('item-click', item);
};
</script>

<style scoped>
.menu-container {
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #4a4a4a;
  width: 150px; /* 设置菜单容器宽度 */
}

.menu-item-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 让内容靠右 */
  margin-bottom: 10px;
  cursor: pointer;
}

.menu-item-text {
  margin-right: 10px; /* 文字与圆形按钮之间的间距 */
  white-space: nowrap; /* 防止文字换行 */
}

.menu-item {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 50%; /* 设置为圆形 */
  transition: background-color 0.3s;
  cursor: pointer;
}

.menu-item:hover {
  filter: brightness(0.9); /* 鼠标悬停时高亮 */
}
</style>