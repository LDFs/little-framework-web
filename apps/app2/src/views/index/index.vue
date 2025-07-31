/**
  * @Description: Three.js基础示例
  * 在一个漆黑的场景中创建一个红色半透明的立方体，并添加坐标轴辅助线。
*/

<template>
  <div id="index-page" ref="containerRef">
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as THREE from 'three';

const containerRef = ref<HTMLElement | null>(null);

/************场景**********/
const scene = new THREE.Scene();

//创建一个长方体几何对象Geometry
const geometry = new THREE.BoxGeometry(90, 150, 40); 

//创建一个材质对象Material
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000,    // 红色
    transparent:true,//开启透明
    opacity:0.5,//设置透明度
});

// 创建网格模型对象Mesh，两个参数分别为几何体geometry、材质material
const mesh = new THREE.Mesh(geometry, material);

//设置网格模型在三维空间中的位置坐标，默认是坐标原点
mesh.position.set(0,100,0);
// 把网格模型mesh添加到三维场景scene中
scene.add(mesh); 


// AxesHelper：辅助观察的坐标系
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);


/************相机**********/
// 定义相机输出画布的尺寸(单位:像素px)
const width = 800; //宽度
const height = 500; //高度
// 实例化一个透视投影相机对象
const camera = new THREE.PerspectiveCamera(30, width / height, 1, 1200);

// 相机在Three.js三维坐标系中的位置
// 根据需要设置相机位置具体值
camera.position.set(1000, 200, 200); 
// 指向mesh对应的位置
camera.lookAt(mesh.position);


/************渲染器**********/
// 创建渲染器对象
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)

onMounted(() => {
  // 确保容器元素存在
  if (containerRef.value) {
    // 将渲染器的DOM元素添加到容器中
    containerRef.value.appendChild(renderer.domElement);
  }
  
  // 渲染场景和相机
  renderer.render(scene, camera);
})
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