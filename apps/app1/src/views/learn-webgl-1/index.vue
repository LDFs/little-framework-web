/** * 学习WebGL, 第一篇, 入门 */
<template>
  <div class="goukaku-page">
    <canvas id="webgl-canvas" ref="canvasRef" width="1000" height="800">
      此浏览器不支持canvas
    </canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);
onMounted(() => {
  // draw2d();

  tryWebgl();
});

function draw2d() {
  // 2D渲染上下文
  const ctx = canvasRef.value?.getContext("2d");
  if (!ctx) {
    throw new Error("canvas上下文不存在");
  }
  ctx.fillStyle = "#2fe0a0";
  // 绘制矩形 x, y, h, w
  ctx.fillRect(10, 10, 100, 100);

  drawHouse(ctx);
}

function drawHouse(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "brown";
  ctx.fillRect(100, 100, 150, 100);

  ctx.fillStyle = "#2fe0a0";
  ctx.beginPath();
  ctx.moveTo(100, 100);
  ctx.lineTo(175, 50);
  ctx.lineTo(250, 100);
  ctx.fill();

  ctx.fillStyle = "yellow";
  ctx.fillRect(160, 150, 30, 50);

  ctx.fillStyle = "#333";
  ctx.font = "20px Arial";
  ctx.fillText("my house", 140, 130);
}

function tryWebgl() {
  // WebGL 上下文，3D
  let gl = canvasRef.value?.getContext("webgl");
  if (!gl) {
    console.log("WebGL 不支持，改用 experimental-webgl");
    gl = canvasRef.value?.getContext("experimental-webgl");
  }

  if (!gl) {
    alert("您的浏览器不支持 WebGL");
  } else {
    // 设置清除颜色（背景颜色）为红色，透明度
    gl.clearColor(1.0, 0.0, 0.0, 0.1);
    // 使用指定的清除颜色清除颜色缓冲区，清空画布
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
}
</script>

<style scoped>
.goukaku-page {
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
