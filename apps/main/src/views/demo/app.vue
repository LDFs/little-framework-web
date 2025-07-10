<template>
  <div class="demo-container">
    <h2>
      {{ t('demo-msg') }}
    </h2>

    <a href="http://aiot-ui.rd.chn-das.com/das-ui" target="_blank">
      <p class="read-the-docs">{{ t('demo-doc-tip') }}</p>
    </a>

    <div>{{ t('demo-component-msg') }}</div>
    <div class="alert-container">
      <div v-for="item in ['info', 'success', 'warning', 'error']" :key="item" class="alert-item">
        <das-alert show-icon :message="`${item} Text`" :type="item" />
      </div>
    </div>

    <div>@das-fed/ui组件库中DasIcon使用案例</div>
    <das-icon icon="add" />
  </div>
</template>

<script setup lang="ts">
import { t } from '@das-fed/web'
import { DasIcon, DasAlert } from '@das-fed/ui'
</script>

<style>
.demo-container {
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  height: 100%;
  background: var(--hello-bg);
  color: var(--hello-color);
}
.demo-container h2 {
  color: var(--hello-color);
}
.alert-container {
  background: var(--demo-alert-bg);
  color: var(--demo-alert-color);
  padding: 20px;
  margin: 10px 0;
  border-radius: 10px;
  box-sizing: border-box;
  height: auto;
  min-width: 600px;
}
.alert-item {
  margin-top: 20px;
}
.alert-item:first-child {
  margin-top: 0;
}
.read-the-docs {
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
}
</style>
