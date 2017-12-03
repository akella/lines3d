import * as THREE from 'three';
let OrbitControls = require('three-orbit-controls')(THREE);

let canvas = document.getElementById('myscene');
let width = window.innerWidth;
let height = window.innerHeight;
let dots = 50;
let lines = 50;
let radius = 100;

// RENDERER
let renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.setSize(width, height);
renderer.setClearColor(0x999999);

// RENDERER

// camera
var camera = new THREE.PerspectiveCamera(40, width / height, 1, 1000);
camera.position.set(0, 0, 300);
// camera

// SCENE
let scene = new THREE.Scene();
let group = new THREE.Group();
scene.add(group);

var controls = new OrbitControls(camera, renderer.domElement);
// SCENE

// LINE INIT
let material = new THREE.LineBasicMaterial({
  color: 0x000000
});


let material1 = new THREE.LineBasicMaterial({
  color: 0xff0000
});

for (var i = 0; i < lines; i++) {
  let geometry = new THREE.Geometry();
  let line = new THREE.Line(geometry, material1);

  for (var j = 0; j < dots; j++) {
    let coord = j / dots * radius * 2 - radius;

    let vector = new THREE.Vector3(coord, 0,0);

    geometry.vertices.push(vector);
  }

  line.rotation.z = Math.random() * Math.PI;
  line.rotation.x = Math.random() * Math.PI;
  line.rotation.y = Math.random() * Math.PI;
  group.add(line);
}

function UpdateLines(time) {
  var vector, line,ratio;
  for (var i = 0; i < lines; i++) {
    line = group.children[i];
    for (var j = 0; j < dots; j++) {
    	vector = line.geometry.vertices[j];
    	ratio = 1 - (radius - Math.abs(vector.x))/radius;
    	vector.y = Math.sin(j/5 + time/100)*20*ratio;
    }
    line.geometry.verticesNeedUpdate = true;
  }

}


// Рисуем Девушку
let canvas2d = document.createElement('canvas');
let ctx = canvas2d.getContext('2d');
let size = 200;
canvas2d.width = size;
canvas2d.height = size;

let image = document.getElementById('photo');



var img = new Image();   
img.crossOrigin = 'Anonymous';
img.addEventListener('load', function() {
  
  ctx.drawImage(image, 0, 0, size, size);
  document.body.appendChild(canvas2d);

  let data = ctx.getImageData(0, 0, size, size);
  data = data.data;



  for (var y = 0; y < size; y++) {
    let geometry = new THREE.Geometry();
    let line = new THREE.Line(geometry, material);

    for (var x = 0; x < size; x++) {
      var bright = data[(size * y + x) * 4];
      let vector = new THREE.Vector3(x - 100, y - 100, bright/10 - 100);

      geometry.vertices.push(vector);
    }

    group.add(line);
  }
  // Закончили рисовать девушку

}, false);
img.src = 'img/photo.jpg'; //



let time = 0;
function Render() {
  time++;
  renderer.render(scene, camera);
  UpdateLines(time);
  group.rotation.x = Math.PI;
  // group.rotation.x = (time/1000);
  group.rotation.y = (time/500);
  window.requestAnimationFrame(Render);
}

Render();
