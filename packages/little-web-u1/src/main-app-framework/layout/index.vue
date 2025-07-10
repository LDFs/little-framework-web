<template>
  <div id="main-app-layout">
    <div id="layout-container">
      <button @click="toApp" class="app-btn">application</button>
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();
const toApp = () => {
  console.log('toApp');
  router.push('/application');
}

</script>

<style scoped lang="scss">
#main-app-layout {
  width: 100%;
  height: 100vh;
  background-color: #313131;
  padding: 0;
  margin: 0;
  #layout-container {
    width: 80%;
    height: 80%;
    margin: 0 auto;
    background-color: #fff;
    .app-btn {
      width: 100px;
      height: 30px;
      border: none;
      border-radius: 5px;
      background-color: #313131;
      color: #fff;
      cursor: pointer;
    }
  }
}
</style>