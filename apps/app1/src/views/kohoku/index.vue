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

function tryRender() {
  const gl = canvasRef.value?.getContext("webgl");
  if (!gl) {
    console.error("WebGL not supported");
    return;
  }
  // 顶点着色器
  // vec4的4个参数分别为x,y,z,w齐次坐标（x/w, y/w, z/w）
  const VERTEX_SHADER_SOURCE = `
    attribute vec4 a_position;
    void main() {
      // 矩形
      // gl_Position = vec4(0.1, 0.1, 0.1, 1.0);
      // gl_PointSize = 30.0;
      // 三角形
      gl_Position = a_position;
    }
  `;
  // 片元着色器
  // vec4的4个参数分别为r,g,b,a，颜色
  const FRAGMENT_SHADER_SOURCE = `
    void main() {
      // gl_FragColor = vec4(1, 0, 0.5, 1);
      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
  `;
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    FRAGMENT_SHADER_SOURCE
  );

  const program = createProgram(gl, vertexShader, fragmentShader);
  draw(gl, program);
}
/**
 * 主要使用到的对象：着色器、程序对象、缓冲区对象、顶点
 */

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
  // 创建一个程序对象
  const program = gl.createProgram();
  // 将着色器附加到程序上
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // 链接一个程序对象
  gl.linkProgram(program);
  // 将指定的程序设置为当前渲染状态的一部分
  gl.useProgram(program);

  return program;
}

function draw(gl: WebGLRenderingContext, program: WebGLProgram) {
  // 创建一个缓冲区对象
  const positionBuffer = gl.createBuffer();
  // 将缓冲区对象绑定到目标
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // 矩形
  // const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  // 三角形
  const positions = [0, 0.1, 0, 0.5, 1, 0];
  // 创建并初始化缓冲区对象的数据存储
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const numComponents = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  // 指定顶点数据布局
  gl.vertexAttribPointer(
    gl.getAttribLocation(program, "a_position"), // a_position 对应顶点着色器的东西
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  // 启用一个顶点属性数组
  gl.enableVertexAttribArray(gl.getAttribLocation(program, "a_position"));

  // 设置视口
  gl.viewport(0, 0, gl.canvas.width / 2, gl.canvas.height / 2);
  // 指定清空颜色缓冲区时使用的颜色
  gl.clearColor(0.0, 0.0, 0.0, 0.1);
  // 清空缓冲区到预设值
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 从数组数据渲染基元
  gl.drawArrays(gl.TRIANGLES, 0, 3); // 三角形
  // gl.drawArrays(gl.POINTS, 0, 1);   // 矩形
}
</script>

<style scoped>
.kohoku-page {
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
