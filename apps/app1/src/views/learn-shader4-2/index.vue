/**
* 使用 requestAnimationFrame 实现立方体旋转
*/
<template>
  <div class="kohoku-page">
    <canvas id="webgl-canvas" ref="canvasRef" width="100" height="80">
      此浏览器不支持canvas
    </canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { createProgramFromScripts, resizeCanvasToMatchDisplaySize } from '@/utils/webglUtils.ts'

const canvasRef = ref<HTMLCanvasElement | null>(null);

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
    uniform mat4 uRotateX;
    uniform mat4 uRotateY;
    uniform mat4 uRotateZ;
    void main() {
      gl_Position = aPosition * uRotateX * uRotateY * uRotateZ;
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


  // 设置视口
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 0.1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST); // 开启更新深度缓冲区

  // 颜色
  const faceColors = [
    [0.654, 0.231, 0.67, 0.8], // 前面颜色
    [0.231, 0.654, 0.123, 0.8], // 右面颜色
    [0.098, 0.231, 0.654, 0.8], // 后面颜色
    [0.121, 0.654, 0.231, 0.8], // 左面颜色
    [0.231, 0.110, 0.654, 0.8], // 上面颜色
    [0.654, 0.67, 0.231, 0.8]  // 下面颜色
  ]
  const uColorLocation = gl.getUniformLocation(program, "uColor");


  // 旋转
  const rotationLocationX = gl.getUniformLocation(program, "uRotateX");
  const rotationLocationY = gl.getUniformLocation(program, "uRotateY");
  const rotationLocationZ = gl.getUniformLocation(program, "uRotateZ");

  let deg = 0;
  function render() {
    deg += 1
    // 将角度转换为弧度
    const sinDeg = Math.sin(deg * Math.PI / 180);
    const cosDeg = Math.cos(deg * Math.PI / 180);
    gl.uniformMatrix4fv(rotationLocationX, false, new Float32Array([
      1, 0, 0, 0,
      0, cosDeg, -sinDeg, 0,
      0, sinDeg, cosDeg, 0,
      0, 0, 0, 1
    ]));
    gl.uniformMatrix4fv(rotationLocationY, false, new Float32Array([
      cosDeg, 0, sinDeg, 0,
      0, 1, 0, 0,
      -sinDeg, 0, cosDeg, 0,
      0, 0, 0, 1
    ]));
    gl.uniformMatrix4fv(rotationLocationZ, false, new Float32Array([
      cosDeg, -sinDeg, 0, 0,
      sinDeg, cosDeg, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]));
    for (let i = 0; i < faceColors.length; i++) {
      // 绘制每个面
      gl.uniform4fv(uColorLocation, faceColors[i]);
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, i * 6 * Uint16Array.BYTES_PER_ELEMENT);
    }
    window.requestAnimationFrame(render);
  }
  render()


  // 解绑缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
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
