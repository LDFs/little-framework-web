<template>
  <div class="kohoku-page">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <button @click="handleClick">点击我</button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

// 定义响应式变量
const title = ref('欢迎来到 Kohoku 页面');
const description = ref('这是一个使用 Vue 3 和 TypeScript 创建的简单页面。');

// 定义方法
const handleClick = () => {
  description.value = '按钮已被点击！';
};
</script>

<style scoped>
.kohoku-page {
  text-align: center;
  margin-top: 50px;
}

button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>