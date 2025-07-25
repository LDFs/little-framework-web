/** * 使用缓冲区来渲染直线 * 使用 varying 来传递插值数据 * 绘制一条彩色的线 */
<template>
  <div class="kohoku-page">
    <canvas id="webgl-canvas" ref="canvasRef" width="100" height="80">
      此浏览器不支持canvas
    </canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {createProgramFromScripts, resizeCanvasToMatchDisplaySize} from '@/utils/webglUtils.ts'

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  tryRender();
});
const gl = ref<WebGLRenderingContext | null | undefined>(null);
const program = ref<WebGLProgram | null | undefined>(null);

function tryRender() {
  if(!canvasRef.value){
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
    attribute vec4 aColor;      // 因为使用attribute修饰的变量，可以通过js来修改值
    varying vec4 vColor;
    void main() {
      gl_Position = vec4(aPosition, 1.0, 1.0);
      gl_PointSize = 10.0;
      vColor = aColor;
    }
  `;
  const FRAGMENT_SHADER_SOURCE = `
    precision highp float;    // 设置精度
    varying vec4 vColor;
    uniform vec2 uColor;
    void main() {
      gl_FragColor = vColor;  // vec4(uColor.r, uColor.g, 0.0, 1.0);
    }
  `;

  program.value = createProgramFromScripts(gl.value, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE)
  if(program.value)
    draw(gl.value, program.value);
  else {
    throw("*** Error: program创建失败！");
  }
}

function draw(gl: WebGLRenderingContext, program: WebGLProgram) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // const positions = [0.2, 0.1, -1.0, 1.0, 1.0, -1.0, -0.5, -0.5];  // 矩形
  const positions = [0.2, 0.1, -1.0, 1.0]; // 直线
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "aPosition"); // aPosition 对应顶点着色器的东西
  // const colorLocation = gl.getUniformLocation(program, 'uColor');

  const numComponents = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 2 * Float32Array.BYTES_PER_ELEMENT; // 从一个数据到下一个数据要跳过多少位，也是字节的倍数
  const offset = 0;
  // 指定顶点数据布局，怎么从缓冲中获取数据传递给属性
  gl.vertexAttribPointer(
    // 顶点属性的位置
    positionLocation,
    numComponents, // 每个顶点属性的元素数量
    type,
    normalize,
    stride,
    offset // 偏移，需要是字节的倍数
  );
  // 开启从缓冲中获取数据
  gl.enableVertexAttribArray(positionLocation);
  // gl.uniform2f(colorLocation, 0.67, 0.1);


  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  const colors = new Float32Array([
    0.78, 0.082, 0.522, 0.6, 
    0.0, 0.749, 0.98, 0.8,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  const aColorLocation = gl.getAttribLocation(program, "aColor"); // aColor 对应顶点着色器的东西
  gl.vertexAttribPointer(
    aColorLocation,
    4, // 每个点有4个参数
    gl.FLOAT,
    false,
    4 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
  gl.enableVertexAttribArray(aColorLocation);
  /**
   * 虽然只绘制两个点，但是设置了两个点之间的差值，在光栅化时，会计算
   */

  
  // 设置视口
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 0.1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 渲染
  /**
   * void gl.drawArrays(mode, first, count);
   * mode 绘制方式：
   * - gl.POINTS：绘制点
   * - gl.LINES：绘制线段
   * - ...
   * first 指定从哪个点开始绘制
   * count 指定绘制需要使用到多少个点, 每绘制一个点就调用一次顶点着色器
   */
  gl.drawArrays(gl.LINES, 0, 2);

  // 解绑缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}
</script>

<style scoped lang="scss">
.kohoku-page {
  text-align: center;
  margin-top: 50px;
}

#webgl-canvas {
  width: 1000px;
  height: 800px;
}

</style>
