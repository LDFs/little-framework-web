/** 
  改进彩色线的实现方式，使用一个缓冲区
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

  /**
   * 使用一个缓冲区来同时存储顶点的位置坐标和颜色信息
   * 0.2, 0.1, 0.78, 0.082, 0.522, 0.6,  第一个点
   * -1.0, 1.0, 0.0, 0.749, 0.98, 0.8,  第二个点
   */
  const positions = [0.2, 0.1, 0.78, 0.082, 0.522, 0.6,  -1.0, 1.0, 0.0, 0.749, 0.98, 0.8,]; // 直线
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(
    positionLocation,    // 顶点属性的位置
    2,         // 每个顶点 *当前属性* 的元素数量
    gl.FLOAT,   // 数据类型
    false,     // 是否归一化
    6 * Float32Array.BYTES_PER_ELEMENT, // 从一个数据到下一个数据要跳过多少位，也是字节的倍数。。是指在 positions 中，读取每个顶点时要跳过的字节数
    0        // 偏移，表示当前点的数据中，从哪个位置开始是这个属性的数据。单位为字节
  );
  // 开启从缓冲中获取数据
  gl.enableVertexAttribArray(positionLocation);

  const aColorLocation = gl.getAttribLocation(program, "aColor"); 
  gl.vertexAttribPointer(
    aColorLocation,
    4,           // 每个点的颜色属性有4个元素
    gl.FLOAT,
    false,
    6 * Float32Array.BYTES_PER_ELEMENT,
    2 * Float32Array.BYTES_PER_ELEMENT,
  );
  gl.enableVertexAttribArray(aColorLocation);

  
  // 设置视口
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 0.1);
  gl.clear(gl.COLOR_BUFFER_BIT);

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
