/**
* 使用 drawElements 绘制立方体，并给每个面设置不同颜色
*/
<template>
  <div class="kohoku-page">
    <div class="slider-container" style="margin-bottom: 20px;">
      <div>
        <label>旋转 X: </label>
        <span>{{ rotationX }}</span>
        <input type="range" min="0" max="180" step="0.01" v-model="rotationX" @input="onChange" />
      </div>
      <div>
        <label>旋转 Y: </label>
        <span>{{ rotationY }}</span>
        <input type="range" min="0" max="180" step="0.01" v-model="rotationY" @input="onChange" />
      </div>
      <div>
        <label>旋转 Z: </label>
        <span>{{ rotationZ }}</span>
        <input type="range" min="0" max="180" step="0.01" v-model="rotationZ" @input="onChange" />
      </div>
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
const rotationX = ref(0.0);
const rotationY = ref(0.0);
const rotationZ = ref(0.0);

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
    attribute vec4 aPosition;
    uniform float uRotateX; // 旋转角度
    uniform float uRotateY; // 旋转角度
    uniform float uRotateZ; // 旋转角度
    void main() {
      float radian1 = radians(uRotateX);
      float cos1 = cos(radian1);
      float sin1 = sin(radian1);
      mat4 rotate1 = mat4(
        1, 0,0,0,
        0, cos1,-sin1,0,
        0, sin1, cos1,0,
        0, 0,0,1
      );

      float radian2 = radians(uRotateY);
      float cos2 = cos(radian2);
      float sin2 = sin(radian2);
      mat4 rotate2 = mat4(
        cos2, 0, -sin2, 0,
        0, 1, 0, 0,
        sin2, 0, cos2, 0,
        0, 0, 0, 1
      );

      float radian3 = radians(uRotateZ);
      float cos3 = cos(radian3);
      float sin3 = sin(radian3);
      mat4 rotate3 = mat4(
        cos3, -sin3, 0, 0,
        sin3, cos3, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
      );

      gl_Position = aPosition * rotate1 * rotate2 * rotate3;
      gl_PointSize = 10.0;
    }
  `;
  const FRAGMENT_SHADER_SOURCE = `
    precision mediump float; // 设置精度
    uniform vec4 uColor; // 颜色
    void main() {
      gl_FragColor = uColor;
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

  /**
   * 立方体的顶点坐标
   * 每个面的顶点单独定义
   * 6个面，每个面4个顶点，共24个顶点
   */
  const positions = [
    // 前面
      -0.5, 0.5, 0.5,
      0.5, 0.5, 0.5,
      0.5, -0.5, 0.5, 
      -0.5, -0.5, 0.5,

      // 右面
      0.5, 0.5, 0.5,
      0.5, 0.5, -0.5,
      0.5, -0.5, -0.5,
      0.5, -0.5, 0.5,

      // 后面
      0.5, 0.5, -0.5,
      -0.5, 0.5, -0.5,
      -0.5, -0.5, -0.5,
      0.5, -0.5, -0.5,

      // 左面
      -0.5, 0.5, -0.5,
      -0.5, 0.5, 0.5,
      -0.5, -0.5, 0.5,
      -0.5, -0.5, -0.5,

      // 下面
      -0.5, -0.5, -0.5,
      0.5, -0.5, -0.5,
      0.5, -0.5, 0.5,
      -0.5, -0.5, 0.5,

      // 上面
      -0.5, 0.5, -0.5,
      0.5, 0.5, -0.5,
      0.5, 0.5, 0.5,
      -0.5, 0.5, 0.5
    ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // 前面顶点数据对应的每个顶点的索引
  const indices = new Uint16Array([
    0, 1, 2,
    0, 2, 3,
    4, 5, 6,
    4, 6, 7,
    8, 9, 10,
    8, 10, 11,
    12, 13, 14,
    12, 14, 15,
    16, 17, 18,
    16, 18, 19,
    20, 21, 22,
    20, 22, 23
  ]);
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(
    positionLocation,    // 顶点属性的位置
    3,         // 每个顶点 *当前属性* 的元素数量
    gl.FLOAT,   // 数据类型
    false,     // 是否归一化
    3 * Float32Array.BYTES_PER_ELEMENT, // 从一个数据到下一个数据要跳过多少位，也是字节的倍数。。是指在 positions 中，读取每个顶点时要跳过的字节数
    0        // 偏移，表示当前点的数据中，从哪个位置开始是这个属性的数据。单位为字节
  );
  // 开启从缓冲中获取数据
  gl.enableVertexAttribArray(positionLocation);

  // 设置uniform变量
  const rotationLocationX = gl.getUniformLocation(program, "uRotateX");
  gl.uniform1f(rotationLocationX, rotationX.value);

  const rotationLocationY = gl.getUniformLocation(program, "uRotateY");
  gl.uniform1f(rotationLocationY, rotationY.value);

  const rotationLocationZ = gl.getUniformLocation(program, "uRotateZ");
  gl.uniform1f(rotationLocationZ, rotationZ.value);


  // 设置视口
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 0.1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); // 开启更新深度缓冲区

  const faceColors = [
    [0.654, 0.231, 0.67, 0.8], // 前面颜色
    [0.231, 0.654, 0.123, 0.8], // 右面颜色
    [0.098, 0.231, 0.654, 0.8], // 后面颜色
    [0.121, 0.654, 0.231, 0.8], // 左面颜色
    [0.231, 0.110, 0.654, 0.8], // 上面颜色
    [0.654, 0.67, 0.231, 0.8]  // 下面颜色
  ]
  const uColorLocation = gl.getUniformLocation(program, "uColor");
  for (let i = 0; i < faceColors.length; i++) {
    // 绘制每个面
    gl.uniform4fv(uColorLocation, faceColors[i]);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 6 * Uint16Array.BYTES_PER_ELEMENT);
  }

  // gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);


  // 解绑缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
function onChange() {
  if (!gl.value || !program.value) return;

  // 重新绘制
  draw(gl.value, program.value);
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
