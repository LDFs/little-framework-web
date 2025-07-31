/** 
* @Description: Three.js基础示例 
* 在一个漆黑的场景中创建一个红色半透明的立方体，并添加坐标轴辅助线。 
*/

<template>
  <div id="index-page" ref="containerRef"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as THREE from "three";
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


const containerRef = ref<HTMLElement | null>(null);

/************场景**********/
const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(90, 130, 40);

// MeshBasicMaterial材质不受光照的影响
// const material = new THREE.MeshBasicMaterial({
//   color: 0xff0aff, 
//   transparent: true, 
//   opacity: 0.5, 
// });

//MeshLambertMaterial受光照影响
const material = new THREE.MeshLambertMaterial(); 

const mesh = new THREE.Mesh(geometry, material);

mesh.position.set(0, 10, 0);
scene.add(mesh);

const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);


/************光源**********/
// 点光源：两个参数分别表示光源颜色和光照强度
const pointLight = new THREE.PointLight(0xff00ff, 10.0);
// pointLight.intensity = 10000.0;      // 也可以设置光照强度
pointLight.decay = 0.1;     //设置光源不随距离衰减
//  点光源位置
pointLight.position.set(100, 200, 200);     //点光源放在x轴上
scene.add(pointLight); //点光源添加到场景中
// 光源辅助观察
const pointLightHelper = new THREE.PointLightHelper(pointLight, 10, 0xffffff);
scene.add(pointLightHelper);

// const ambientLight = new THREE.AmbientLight(0x40ff40); //环境光
// ambientLight.intensity = 0.5; //设置环境光强度
// ambientLight.position.set(0, -100, -200); //环境光位置
// scene.add(ambientLight); //环境光添加到场景中

// 平行光
const directionalLight = new THREE.DirectionalLight(0x1045a1, 30);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
directionalLight.position.set(-80, -20, -50);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
directionalLight.target = mesh;
scene.add(directionalLight);
// DirectionalLightHelper：可视化平行光
const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5,0xf0af00);
scene.add(dirLightHelper);


/************相机**********/
const width = 800;
const height = 500; 

const camera = new THREE.PerspectiveCamera(30, width / height, 1, 2000);

camera.position.set(466, -121, 125);

camera.lookAt(mesh.position);

/************渲染器**********/
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)


/************控制器**********/
// 设置相机控件轨道控制器OrbitControls   ==== >>>>  它就是改变相机的参数(位置和方向)
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener('change', function () {
    renderer.render(scene, camera); //执行渲染操作
    // console.log('camera.position',camera.position);
});//监听鼠标、键盘事件

onMounted(() => {
  if (containerRef.value) {
    containerRef.value.appendChild(renderer.domElement);
  }

  renderer.render(scene, camera);
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
