/** 
* 简单旋转动画
* 全屏
  */

<template>
  <button v-if="!fullScreen" @click="toFullScreen">全屏</button>
  <button v-else @click="resetScreen">恢复</button>
  <div id="index-page" ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const containerRef = ref<HTMLElement | null>(null);
let width = 800;
let height = 500;
const fullScreen = ref(false)

function createScene() {
  const scene = new THREE.Scene();

  const axesHelper = new THREE.AxesHelper(150);
  scene.add(axesHelper);
  return scene;
}

function createBox() {
  const geometry = new THREE.BoxGeometry(90, 130, 40);
  //MeshLambertMaterial受光照影响
  const material = new THREE.MeshLambertMaterial();

  const mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(0, 10, 0);
  return mesh;
}

function createLights(mesh: THREE.Mesh) {
  // 点光源：两个参数分别表示光源颜色和光照强度
  const pointLight = new THREE.PointLight(0xff00ff, 10.0);
  // pointLight.intensity = 10000.0;      // 也可以设置光照强度
  pointLight.decay = 0.1; //设置光源不随距离衰减
  //  点光源位置
  pointLight.position.set(100, 200, 200); //点光源放在x轴上

  // 光源辅助观察
  const pointLightHelper = new THREE.PointLightHelper(pointLight, 10, 0xffffff);

  // 平行光
  const directionalLight = new THREE.DirectionalLight(0x1045a1, 30);
  // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(-80, -20, -50);
  // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
  directionalLight.target = mesh;

  // DirectionalLightHelper：可视化平行光
  const dirLightHelper = new THREE.DirectionalLightHelper(
    directionalLight,
    5,
    0xf0af00
  );

  return [pointLight, pointLightHelper, directionalLight, dirLightHelper];
}

function createCamera(mesh: THREE.Mesh) {
  const camera = new THREE.PerspectiveCamera(30, width / height, 1, 2000);
  camera.position.set(466, -121, 125);
  camera.lookAt(mesh.position);
  return camera;
}

/************控制器**********/
function createControl(scene, camera, renderer) {
  // 设置相机控件轨道控制器OrbitControls   ==== >>>>  它就是改变相机的参数(位置和方向)
  const controls = new OrbitControls(camera, renderer.domElement);
  // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener("change", function () {
    renderer.render(scene, camera); //执行渲染操作
    // console.log('camera.position',camera.position);
  }); //监听鼠标、键盘事件
}

function doRender() {
  const scene = createScene();
  const box = createBox();

  const lights = createLights(box);
  const camera = createCamera(box);
  scene.add(box);
  scene.add(camera);
  lights.map((item) => scene.add(item));

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
  createControl(scene, camera, renderer)

  //// 这样在切换时，会报错，但是画面没异常
  if (containerRef.value) {
    if(containerRef.value.hasChildNodes()) {
      containerRef.value.childNodes.forEach(node => containerRef.value?.removeChild(node))
    }
    containerRef.value.appendChild(renderer.domElement);
  }

  // const clock = new THREE.Clock();
  function render() {
    box.rotateY(0.01);      //  每次绕y轴旋转0.01弧度
    renderer.render(scene, camera);
    // const spt = clock.getDelta()*1000;//毫秒
    // console.log('两帧渲染时间间隔(毫秒)',spt);
    // console.log('帧率FPS',1000/spt);
    requestAnimationFrame(render);//请求再次执行渲染函数render，渲染下一帧
  }
  render()
}

function toFullScreen() {
  fullScreen.value = true
  width = window.innerWidth
  height = window.innerHeight
  doRender()
}
function resetScreen() {
    fullScreen.value = false
  width = 800
  height = 500
  doRender()
}

onMounted(() => {
  doRender();
});
</script>

<style scoped>
#index-page {
  text-align: center;
  margin-top: 50px;
}

.index-page h1 {
  color: #42b983;
}

.index-page p {
  color: #333;
}
</style>
