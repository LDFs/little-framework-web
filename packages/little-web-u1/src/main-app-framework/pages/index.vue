<template>
  <div class="app-container">
    <!-- 用来展示应用的啥啥吧 -->
     application-layout
  </div>
</template>

<script setup lang="ts">

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