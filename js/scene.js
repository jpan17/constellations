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
var hemisphere;
var ambient;
var sceneSubject;
var starNum = 300;

// colors
var darkBlue = 0x001029;
var blue = 0x0f67d4;
var lightBlue = 0x39c1e3;
var lightGreen = 0x26c9a3;
var green = 0x149174;
var darkGreen = 0x04362a;

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
  renderer.setClearColor(0xffffff, 1); // enable fog (??)
  
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
  hemisphere = new THREE.HemisphereLight( lightBlue, darkBlue, 1);
  scene.add(hemisphere);

  ambient = new THREE.AmbientLight( darkBlue, 1 );
  scene.add(ambient);

  light = new THREE.DirectionalLight( lightBlue );
  light.rotateOnAxis(new THREE.Vector3(0, 0, 0), -Math.PI);
  light.castShadow = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  light.shadow.mapSize.width = 1028;
  light.shadow.mapSize.height = 1028;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 1000;
  light.shadow.camera.left = -100;
  light.shadow.camera.right = 100;
  light.shadow.camera.top = 100;
  light.shadow.camera.bottom = -100
  scene.add(light)

  // 6. Fog
  scene.fog = new THREE.FogExp2( lightGreen, 0.002 )

  // 7. Stars
  var starGeometry = new THREE.SphereGeometry(0.05, 20, 20)
  var starMaterial = new THREE.MeshBasicMaterial( {
    color: lightGreen,
    side: THREE.DoubleSide
  })



  // create the background
  sceneSubject = [new Background(scene)];

	window.addEventListener('resize', onWindowResize, false);//resize callback
}

function calculateStarPosition(mesh, angle, radius, y) {
  const x = radius * Math.cos(angle)
  const z = radius * Math.sin(angle)
  mesh.position.set(x, y, z)
}

function animate(){
    var delta = clock.getDelta();

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
