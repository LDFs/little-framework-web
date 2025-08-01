/**
  * 在顶点着色器中，两个向量可以相加
  * 使用 gl.vertexAttrib1f() 设置一个顶点属性的值
*/
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
    attribute vec2 aPosition;
    attribute vec2 aPosition1;
    void main() {
      vec2 newPos = aPosition + aPosition1;
      gl_Position = vec4(newPos, 2.0, 4.0);
      gl_PointSize = 10.0;
    }
  `;
  // 片元着色器
  // vec4的4个参数分别为r,g,b,a，颜色
  const FRAGMENT_SHADER_SOURCE = `
    void main() {
      gl_FragColor = vec4(1, 0, 0.5, 1);
    }
  `;
  // 每一对顶点着色器和片元着色器组合在一起，构成一个program(着色程序)
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
  // 将缓冲区对象绑定到目标点
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // 矩形
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];
  // 三角形
  // const positions = [0, 0.1, 0, 0.5, 1, 0];
  // 通过目标点gl.ARRAY_BUFFER, 向缓冲区中存放数据
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "aPosition")  // aPosition 对应顶点着色器的东西
  // const positionLocation1 = gl.getAttribLocation(program, "aPosition1")  // aPosition 对应顶点着色器的东西
  const numComponents = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  // 指定顶点数据布局
  gl.vertexAttribPointer(
    // 顶点属性的位置
    positionLocation, 
    numComponents,   // 每个顶点属性的元素数量
    type,
    normalize,
    stride,
    offset   // 偏移，需要是字节的倍数
  );
  // 启用一个顶点属性数组。。这个启不启用 在这儿 好像没区别
  // ***** 绘制POINTS时，有没有都可以，不过绘制的位置不同，，，绘制三角形时 需要
  // gl.enableVertexAttribArray(positionLocation);

  // 为attribute顶点属性设置常量值。。因为在顶点着色器中的aPosition定义的是vec2，所以这里使用2f函数，传入两个值
  // gl.vertexAttrib2f(positionLocation1, 2.0, 1.0)
  // 但是这里使用1f也可以，应该是它默认会给这个值指定默认值
  // gl.vertexAttrib1f(positionLocation, 0.2)

  // 设置视口
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // 指定清空颜色缓冲区时使用的颜色
  gl.clearColor(0.0, 0.0, 0.0, 0.1);
  // 清空缓冲区到预设值
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 动态改变位置，，但是在这里设置后，背景颜色会为白色
  // let x = 0;
  // setInterval(() => {
  //   x += 0.1;
  //   if (x > 2.0) {
  //     x = 0;
  //   }
  //   gl.vertexAttrib1f(positionLocation, x);
  //   gl.drawArrays(gl.POINTS, 0, 1);
  // }, 200);

  // 从数组数据渲染基元
  gl.drawArrays(gl.POINTS, 0, 1);   // 点
  // gl.drawArrays(gl.TRIANGLES, 0, 3); // 三角形

  // 解绑缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
