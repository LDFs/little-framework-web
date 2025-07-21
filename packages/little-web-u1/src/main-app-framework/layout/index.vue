<template>
  <div id="main-app-layout">
    <Menu :menu-items="microApps" @item-click="toApp"></Menu>
    <div id="layout-container">
      <router-view></router-view>
    </div>
    <SubMenu :sub-menu-items="subMicroMenu" @item-click="toSubApp" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {microApps, subMicroMenu as subMicro} from '../../store/index'
import Menu from './menu.vue';
import SubMenu from './subMenu.vue';

const router = useRouter();
const activeMicroApp = ref('');
const subMicroMenu = ref([]);
const toApp = (item: any) => {
  console.log('toApp', item);
  router.push(item.routeUrl);
  activeMicroApp.value = item.name

  subMicroMenu.value = subMicro.value[item.name] ?? [];
}
const toSubApp = (item: any) => {
  console.log('toSubApp', item);
  router.push(item.routeUrl);
  activeMicroApp.value = item.name
}

</script>

<style scoped lang="scss">
#main-app-layout {
  width: 100%;
  height: 100vh;
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