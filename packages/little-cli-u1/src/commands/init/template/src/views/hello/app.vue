<template>
  <div class="hello-container">
    <button type="button" @click="setLang('zh-CN')">中</button>
    <button type="button" style="margin-left: 10px" @click="setLang('en')">英</button>
    <div class="img-container">
      <a href="https://vitejs.dev" target="_blank">
        <img src="./assets/vite.svg" class="logo" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>
    <router-link to="/"> {{ t('home-router') }} </router-link>
    <span>-</span>
    <router-link to="/demo"> {{ t('demo-router') }} </router-link>

    <div>
      <h1>{{ msg }}</h1>

      <div class="card">
        <p>
          {{ t('edit', 'views/hello/app.vue') }}
        </p>
      </div>

      <p v-html="t('click-out', `<a href='http://docs.chn-das.com' target='_blank'>达实文档中心</a>`)"></p>
      <p v-html="t('suggest', `<a href='https://github.com/vuejs/language-tools' target='_blank'>Volar</a>`)"></p>
      <router-link to="/demo">
        <p class="read-the-demo">{{ t('read-the-demo') }}</p>
      </router-link>
    </div>
    <button type="button" @click="setTheme('light')">{{ t('light') }}</button>
    <button type="button" style="margin-left: 10px" @click="setTheme('dark')">
      {{ t('dark') }}
    </button>
    <br />
    <br />
    <div class="img-container">
      <a href="https://aiot.chn-das.com/login" target="_blank">
        <img class="das-logo" src="./assets/das.png" />
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { t, setLang, setTheme } from '@das-fed/web'

const msg = ref('vite + vue + das-fe')
</script>

<style>


.hello-container {
  height: 100%;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background: var(--hello-bg);
  color: var(--hello-color);
}
.hello-container p {
  margin-bottom: 10px;
}
.hello-container h1 {
  font-weight: 600;
  margin-bottom: 20px;
  color: var(--btn-color);
}

.img-container {
  display: flex;
  justify-content: center;
}
body {
  background: var(--hello-bg);
  color: var(--hello-color);
}
button {
  background: var(--btn-bg);
  color: var(--btn-color);
}
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.das-logo {
  height: 30px;
  will-change: filter;
  transition: filter 300ms;
}
.das-logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.read-the-demo {
  color: #888;
  /* font-size: 14px; */
  font-weight: 400;
}
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}
</style>
