/**
* https://juejin.cn/post/7245682364932554808?searchId=2025072109370372E6EEB364F6AE531E01#heading-27 的后几个例子
* 主要是鼠标交互，使用 attribute 来设置顶点，鼠标点击/移动绘制点/线
* 使用 uniform 来设置全局变量，改变颜色
*/
<template>
  <div class="kohoku-page">
    <div class="btns-container">
      <button v-for="item in btns" @click="() => handleChange(item.id)">{{ item.name }}</button>
    </div>
    <canvas id="webgl-canvas" ref="canvasRef" width="1000" height="800">
      此浏览器不支持canvas
    </canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import {createProgramFromScripts, resizeCanvasToMatchDisplaySize} from '@/utils/webglUtils.ts'

const canvasRef = ref<HTMLCanvasElement | null>(null);
const activedId = ref(1)
const gl = ref<WebGLRenderingContext | null | undefined>(null)
const program = ref<WebGLProgram | null>(null)
// 点击按钮来切换鼠标控制方式
const btns = [
  {
    name: '点击显示点',
    id: 1
  },
  {
    name: '鼠标移动显示点',
    id: 2
  },
  {
    name: '鼠标移动显示线',
    id: 3
  },
  {
    name: '点击显示不同颜色的点',
    id: 4
  }
]
const events: Array<{ type: string; listener: EventListenerOrEventListenerObject }> = []
function handleChange(id: number) {
  activedId.value = id
  events.map((item) => {
    canvasRef.value?.removeEventListener(item.type, item.listener)
  })
  draw(gl.value, program.value);
}

onMounted(() => {
  tryRender();
});

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
    uniform vec4 uPosition;    // 也可以使用 uniform 标识符, 创建全局变量
    attribute vec2 aPosition;
    void main() {
      gl_Position = vec4(aPosition, 1.0, 1.0);
      gl_PointSize = 10.0;
    }
  `;
  const FRAGMENT_SHADER_SOURCE = `
    precision mediump float;    // 设置精度
    uniform vec2 uColor;
    void main() {
      gl_FragColor = vec4(uColor.r, uColor.g, 0.0, 1.0);    // vec4(1, 0, 0.5, 1);
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

  const positionLocation = gl.getAttribLocation(program, "aPosition"); // aPosition 对应顶点着色器的东西
  const colorLocation = gl.getUniformLocation(program, 'uColor');

  // 设置视口
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.0, 0.0, 0.0, 0.1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 渲染
  // gl.drawArrays(gl.POINTS, 0, 1); // 点
  console.log('activedId.value: ', activedId.value);
  if(activedId.value === 1){
    mouseClick(positionLocation, gl)
  }else if(activedId.value === 2) {
    mouseMove(positionLocation, gl)
  }else if(activedId.value === 3){
    mouseMoveLine(positionLocation, gl)
  }else {
    mouseClickColor(positionLocation, colorLocation, gl)
  }

  // 解绑缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

// 鼠标点击出现点
function mouseClick(positionLocation: number, gl: WebGLRenderingContext){
  if(!canvasRef.value) return 
  const handleClick = (event: MouseEvent) => {
    // 坐标
    const x = event.clientX;
    const y = event.clientY;

    const domPosition = event.target.getBoundingClientRect();

    const domx = x - domPosition.left;   // 所点击位置在画布中距离画布左侧的长度
    const domy = y - domPosition.top;

    const halfWidth = canvasRef.value.offsetWidth / 2;            // 画布一半的宽度
    const halfHeight = canvasRef.value.offsetHeight / 2;          // 画布一半的高度
    // 将点击位置转换为WebGL坐标系
    const ex = (domx - halfWidth) / halfWidth
    const ey = (halfHeight - domy) / halfHeight

    gl.clearColor(0.0, 0.0, 0.0, 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.vertexAttrib2f(positionLocation, ex, ey);
    gl.drawArrays(gl.POINTS, 0, 1);
  };

  canvasRef.value.addEventListener('click', handleClick);
  events.push({type: 'click', listener: handleClick})
}
// 鼠标移动出现点
function mouseMove(positionLocation: number, gl: WebGLRenderingContext){
  if(!canvasRef.value) return 
  const handleMove = (event: MouseEvent) => {
    // 坐标
    const x = event.clientX;
    const y = event.clientY;

    const domPosition = event.target.getBoundingClientRect();

    const domx = x - domPosition.left;   // 所点击位置在画布中距离画布左侧的长度
    const domy = y - domPosition.top;

    const halfWidth = canvasRef.value.offsetWidth / 2;            // 画布一半的宽度
    const halfHeight = canvasRef.value.offsetHeight / 2;          // 画布一半的高度
    // 将点击位置转换为WebGL坐标系
    const ex = (domx - halfWidth) / halfWidth
    const ey = (halfHeight - domy) / halfHeight

    gl.clearColor(0.0, 0.0, 0.0, 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.vertexAttrib2f(positionLocation, ex, ey);
    gl.drawArrays(gl.POINTS, 0, 1);
  };
  canvasRef.value.addEventListener('mousemove', handleMove);
  events.push({type: 'mousemove', listener: handleMove})
}
// 鼠标移动出现线
function mouseMoveLine(positionLocation: number, gl: WebGLRenderingContext){
  if(!canvasRef.value) return 
  const points: any[] = [];
  const handleMove = (event: MouseEvent) => {
    // 坐标
    const x = event.clientX;
    const y = event.clientY;

    const domPosition = event.target.getBoundingClientRect();

    const domx = x - domPosition.left;   // 所点击位置在画布中距离画布左侧的长度
    const domy = y - domPosition.top;

    const halfWidth = canvasRef.value.offsetWidth / 2;            // 画布一半的宽度
    const halfHeight = canvasRef.value.offsetHeight / 2;          // 画布一半的高度
    // 将点击位置转换为WebGL坐标系
    const ex = (domx - halfWidth) / halfWidth
    const ey = (halfHeight - domy) / halfHeight

    gl.clearColor(0.0, 0.0, 0.0, 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    points.push({
      ex, ey
    });

    for(let i=0; i < points.length; i++) {
      gl.vertexAttrib2f(positionLocation, points[i].ex, points[i].ey);
      gl.drawArrays(gl.POINTS, 0, 1);
    }

  };
  canvasRef.value.addEventListener('mousemove', handleMove);
  events.push({type: 'mousemove', listener: handleMove})
}

// 鼠标点击绘制不同颜色的点
function mouseClickColor(positionLocation: number, colorLocation: WebGLUniformLocation | null, gl: WebGLRenderingContext) {
  if(!canvasRef.value) return 
  const points: any[] = [];
  const handleClick = (event: MouseEvent) => {
    // 坐标
    const x = event.clientX;
    const y = event.clientY;

    const domPosition = event.target?.getBoundingClientRect();

    const domx = x - domPosition.left;   // 所点击位置在画布中距离画布左侧的长度
    const domy = y - domPosition.top;

    const halfWidth = canvasRef.value!.offsetWidth / 2;            // 画布一半的宽度
    const halfHeight = canvasRef.value!.offsetHeight / 2;          // 画布一半的高度
    // 将点击位置转换为WebGL坐标系
    const ex = (domx - halfWidth) / halfWidth
    const ey = (halfHeight - domy) / halfHeight
    gl.clearColor(0.0, 0.0, 0.0, 0.1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    points.push({
      ex, ey
    });

    for(let i=0; i < points.length; i++) {
      gl.vertexAttrib2f(positionLocation, points[i].ex, points[i].ey);
      // 设置颜色
      // uniform[1234][fi][v]() 指定 uniform 变量的值。所有在 ShaderProgram 对象中定义的，且激活的 uniform 变量在 ShaderProgram 执行 link 成功后被初始化为 0。
      // 它们将保留通过调用此方法分配给它们的值，直到再次将其初始化为 0 时
      gl.uniform2f(colorLocation, points[i].ex, points[i].ey);
      gl.drawArrays(gl.POINTS, 0, 1);
    }
  };
  canvasRef.value.addEventListener('click', handleClick);
  events.push({type: 'click', listener: handleClick})
}

</script>

<style scoped lang="scss">
.kohoku-page {
  text-align: center;
  margin-top: 50px;
}

.btns-container {
  display: flex; gap: 10px;
  margin: 10px;
  button {
    flex: 1;
    background-color: #5faafa;
    color: white;
    border: none;
    padding: 10px 0;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #0056b3;
    }
  }
}
</style>
