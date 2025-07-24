/** * 使用缓冲区来渲染直线 * 使用 varying 来传递插值数据 * 绘制一条彩色的线 */
<template>
  <div class="kohoku-page">
    <canvas id="webgl-canvas" ref="canvasRef" width="1000" height="800">
      此浏览器不支持canvas
    </canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  tryRender();
});
const gl = ref<WebGLRenderingContext | null | undefined>(null);
const program = ref<WebGLProgram | null>(null);

function tryRender() {
  gl.value = canvasRef.value?.getContext("webgl");
  if (!canvasRef.value) return;
  if (!gl.value) {
    console.error("WebGL not supported");
    return;
  }

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
  const vertexShader = createShader(
    gl.value,
    gl.value.VERTEX_SHADER,
    VERTEX_SHADER_SOURCE
  );
  const fragmentShader = createShader(
    gl.value,
    gl.value.FRAGMENT_SHADER,
    FRAGMENT_SHADER_SOURCE
  );

  program.value = createProgram(gl.value, vertexShader, fragmentShader);
  draw(gl.value, program.value);
}
function createShader(gl: WebGLRenderingContext, type: GLenum, source: string) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("编译着色器时发生错误：" + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  gl.useProgram(program);

  return program;
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
  const stride = 2 * Float32Array.BYTES_PER_ELEMENT; // 由于是画线，所以需要步长，也是字节的倍数
  const offset = 0;
  // 指定顶点数据布局
  gl.vertexAttribPointer(
    // 顶点属性的位置
    positionLocation,
    numComponents, // 每个顶点属性的元素数量
    type,
    normalize,
    stride,
    offset // 偏移，需要是字节的倍数
  );
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
   * count 指定绘制需要使用到多少个点
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
</style>
