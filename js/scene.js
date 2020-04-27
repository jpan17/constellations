/*global THREE*/
/****************************** SCENE GLOBAL VARS ******************************/
var sceneWidth;
var sceneHeight;
var camera;
var scene;
var renderer;
var dom;
var clock;

// objects related to scene objects
var light;
var sceneSubject;

// objects related to timer/health
var circle;
var circleGeo; 
var circleMat;
var circleEffect;
var effectTime = 0;

/****************************** FLAGS *****************************************/
var random = false;
var DEBUG = false;
var STATE = "instructions";

/****************************** ROOM VARS *************************************/
var ground;
var backWall;
var leftWall;
var rightWall;
var frontWall; // front means facing player initially

var backDist = 200;
var leftDist = -200;
var rightDist = 200;
var frontDist = -200;

// obstacles in the game
var collidableObjects = []; // An array of collidable objects used later
var MAXLIGHTORBS = 70;
var PLAYERCOLLISIONDIST = 5;
var PLAYERLIGHTDIST = 6;
var PLAYERDOORDIST = 7;

/****************************** CONTROL VARS **********************************/
var blocker = document.getElementById('blocker');
//var orbitControl;

// control global variables
var player;
var controls;
var controlsEnabled = false;
var gameStarted = false;
// Flags to determine which direction the player is moving
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

var MOVESPEED = 30,
    LOOKSPEED = 0.075

getPointerLock();
document.onclick = function () {  
  if (STATE == "instructions"){
    init();
    STATE = "start"
  }
}

function init() {
  //listenForPlayerMovement();

  clock = new THREE.Clock();
  clock.start();
  health = 100;

	// set up the scene
  createScene();
  
	//call game loop
  getPointerLock();
  instructions.innerHTML = "";
  STATE = "play"
  animate();
}

function createScene(){
	// 1. set up scene
  sceneWidth=window.innerWidth;
  sceneHeight=window.innerHeight;
  scene = new THREE.Scene();//the 3d scene

	// 2. camera
  camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, .4, 2000 );//perspective camera
  camera.position.y = 2;
  camera.position.z = 0;
  scene.add(camera);

	// 3. renderer
  renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
  renderer.setClearColor(0xcce0ff, 1); // enable fog (??)
  
  renderer.shadowMap.enabled = true;//enable shadow
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize( sceneWidth, sceneHeight );
  dom = document.getElementById('container');
	dom.appendChild(renderer.domElement);

  // setup player movement
  controls = new THREE.PlayerControls(camera, dom);
  controls.getObject().position.set(0, 0, 0);
  scene.add(controls.getObject());

	// 4. lights
  if (DEBUG == true) {
    console.log("test")
    scene.add(new THREE.AmbientLight(0x666666));
    light = new THREE.DirectionalLight(0xe3e8f2, 1.75);
    light.position.set(50, 200, 100);
    light.position.multiplyScalar(1.3);
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    let d = 300;
    light.shadow.camera.left = -d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = -d;
    light.shadow.camera.far = 1000;
    scene.add(light);
  }
  var light = new THREE.DirectionalLight( 0xffffff );
  light.position.set( 0, 1, 1 ).normalize();
  scene.add(light);

  // radius of flashlight circle 
  circleGeo = new THREE.CircleGeometry(64, 64, 3);
  circleGeo.vertices.shift();
  circleMat = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 5,});
  circle = new THREE.LineLoop(circleGeo, circleMat);
  circle.rotation.x = -Math.PI/2;
  circle.visible = false;
  scene.add(circle);
  circleEffect = new CircleEffect(scene);

  // create the background
  sceneSubject = [new Background(scene)];

	window.addEventListener('resize', onWindowResize, false);//resize callback
}

function animate(){
    var delta = clock.getDelta();
    
    // update circle position
    let currentPos = controls.getObject().position;
    circleGeo = new THREE.CircleGeometry(64, 64, 3);
    circleGeo.vertices.shift();
    circle.geometry = circleGeo;
    circle.position.set(currentPos.x, 0.1, currentPos.z);

    controls.animatePlayer(delta);

    render();

    // keep requesting renderer
    requestAnimationFrame(animate);
}

function render(){
  renderer.render(scene, camera);//draw
}

function onWindowResize() {
	//resize & align
	sceneHeight = window.innerHeight;
	sceneWidth = window.innerWidth;
	renderer.setSize(sceneWidth, sceneHeight);
	camera.aspect = sceneWidth/sceneHeight;
	camera.updateProjectionMatrix();
}

function getPointerLock() {
  document.onclick = function () {
    dom.requestPointerLock();
  }
  if (!gameStarted) {
    document.addEventListener('pointerlockchange', lockChange, false);
    gameStarted = true;
    // console.log("ruh roh")
  } else {
    // console.log("uh oh")
  }
}

function lockChange() {
    // Turn on controls
    if (document.pointerLockElement === dom) {
        // Hide blocker and instructions
        blocker.style.display = "none";
        controls.enabled = true;
        gameStarted = true;
    // Turn off the controls
    } else {
      // Display the blocker and instruction
        blocker.style.display = "";
        controls.enabled = false;
        gameStarted = true;
    }
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}

var fade_out = function() {
  instructions.innerHTML = ""; 
  doorFound = false;
}

/* This code was adapted from
https://docs.microsoft.com/en-us/windows/uwp/get-started/get-started-tutorial-game-js3d
*/

function rayIntersect(ray, distance, objects) {
  var close = [];
  //console.log(distance);
  if (Array.isArray(objects)) {
    var intersects = ray.intersectObjects(objects);
    for (var i = 0; i < intersects.length; i++) {
      // If there's a collision, push into close
      if (intersects[i].distance < distance) {
        //console.log(intersects[i].distance);
        close.push(intersects[i]);
      }
    }
  }
  else {
    var intersect = ray.intersectObject(objects);
      if (intersect.distance < distance) {
        close.push(intersect);
    }
  }
  //if (close.length > 0)
    //console.log("close", close.length);
  return close;
}
