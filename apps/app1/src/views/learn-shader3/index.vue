/**
* 设置平移、缩放
* 通过slider滑块和颜色选择器来控制图形的平移、缩放和颜色
*/
<template>
  <div class="kohoku-page">
    <div class="slider-container" style="margin-bottom: 20px;">
      <div>
        <label>平移 X: </label>
        <span>{{ translationX }}</span>
        <input type="range" min="-1" max="1" step="0.01" v-model="translationX" @input="onChange" />
      </div>
      <div>
        <label>平移 Y: </label>
        <span>{{ translationY }}</span>
        <input type="range" min="-1" max="1" step="0.01" v-model="translationY" @input="onChange" />
      </div>
    </div>
    <div class="slider-container" style="margin-bottom: 20px;">
      <div>
        <label>缩放 X: </label>
        <span>{{ scaleX }}</span>
        <input type="range" min="0" max="2" step="0.01" v-model="scaleX" @input="onChange" />
      </div>
      <div>
        <label>缩放 Y: </label>
        <span>{{ scaleY }}</span>
        <input type="range" min="0" max="2" step="0.01" v-model="scaleY" @input="onChange" />
      </div>
    </div>
    <div>
      <label>颜色: </label>
      <span>{{ color }}</span>
      <input type="color" v-model="color" @input="onChange" />
    </div>
    <canvas id="webgl-canvas" ref="canvasRef" width="100" height="80">
      此浏览器不支持canvas
    </canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { createProgramFromScripts, resizeCanvasToMatchDisplaySize } from '@/utils/webglUtils.ts'

const canvasRef = ref<HTMLCanvasElement | null>(null);
const translationX = ref(0);
const translationY = ref(0);
const scaleX = ref(1.0);
const scaleY = ref(1.0);
const color = ref("#ff5600");

onMounted(() => {
  tryRender();
});
const gl = ref<WebGLRenderingContext | null | undefined>(null);
const program = ref<WebGLProgram | null | undefined>(null);

function tryRender() {
  if (!canvasRef.value) {
    console.error("Canvas element not found");
    return;
  }
  gl.value = canvasRef.value?.getContext("webgl");
  if (!gl.value) {
    console.error("WebGL not supported");
    return;
  }
  resizeCanvasToMatchDisplaySize(canvasRef.value)

  const VERTEX_SHADER_SOURCE = `
    attribute vec2 aPosition;
    uniform vec2 uTranslation; // 平移向量
    uniform vec2 uScale; // 缩放向量
    varying vec4 vColor;
    uniform vec4 uColor; // 颜色
    void main() {
      gl_Position = vec4((aPosition + uTranslation) * uScale, 1.0, 1.0);
      gl_PointSize = 10.0;
      vColor = uColor;
    }
  `;
  const FRAGMENT_SHADER_SOURCE = `
    precision highp float;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }
  `;

  program.value = createProgramFromScripts(gl.value, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)
  if (program.value)
    draw(gl.value, program.value);
  else {
    throw ("*** Error: program创建失败！");
  }
}

function draw(gl: WebGLRenderingContext, program: WebGLProgram) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    -0.8, 0.8,
    -0.8, -0.8,
    0.0, 0.8,
    0.0, -0.8,];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(
    positionLocation,    // 顶点属性的位置
    2,         // 每个顶点 *当前属性* 的元素数量
    gl.FLOAT,   // 数据类型
    false,     // 是否归一化
    2 * Float32Array.BYTES_PER_ELEMENT, // 从一个数据到下一个数据要跳过多少位，也是字节的倍数。。是指在 positions 中，读取每个顶点时要跳过的字节数
    0        // 偏移，表示当前点的数据中，从哪个位置开始是这个属性的数据。单位为字节
  );
  // 开启从缓冲中获取数据
  gl.enableVertexAttribArray(positionLocation);

  // 设置uniform变量
  const translationLocation = gl.getUniformLocation(program, "uTranslation");
  gl.uniform2f(translationLocation, translationX.value, translationY.value); // 平移向量
  const scaleLocation = gl.getUniformLocation(program, "uScale");
  gl.uniform2f(scaleLocation, scaleX.value, scaleY.value); // 缩放向量
  
  // const colorBuffer = gl.createBuffer();
  // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(hexToRgba1(color.value)), gl.STATIC_DRAW);
  const colorLocation = gl.getUniformLocation(program, "uColor");
  gl.uniform4fv(colorLocation, hexToRgba1(color.value));

  // 设置视口
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 0.1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  gl.drawArrays(gl.POINTS, 0, 4);

  // 解绑缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

function onChange() {
  if (!gl.value || !program.value) return;

  // 更新uniform变量
  const translationLocation = gl.value.getUniformLocation(program.value, "uTranslation");
  gl.value.uniform2f(translationLocation, translationX.value, translationY.value);

  // 重新绘制
  draw(gl.value, program.value);
}
function hexToRgba1(hex: string): [number, number, number, number] {
  // 去掉 #
  hex = hex.replace('#', '');
  // 只支持 #RRGGBB
  if (hex.length !== 6) return [1, 1, 1, 1];
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return [r, g, b, 1];
}

</script>

<style scoped lang="scss">
.kohoku-page {
  text-align: center;
  margin-top: 50px;
}

.slider-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  label {
    display: inline-block;
    width: 50px;
  }

  span {
    display: inline-block;
    margin-right: 10px;
    width: 50px;
    text-align: center;
  }
}

#webgl-canvas {
  width: 1000px;
  height: 800px;
}
</style>
