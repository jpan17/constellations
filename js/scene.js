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
var starNum = 30000;

// constellations
const NUM_CONSTELLATIONS = 88;
var constellationList = [];
var constellationNames = [];
var constellationDescriptions = [];
var constellationRadii = [];
var constellations = constellations();

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
var PLAYERCOLLISIONDIST = 5;
var CONSTELLATION_COLLISION_DIST = 4;

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

  ambient = new THREE.AmbientLight( darkBlue, 0.75 );
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
  var starGeometry = new THREE.SphereGeometry(0.1, 20, 20)
  var starMaterial = new THREE.MeshBasicMaterial( {
    color: lightGreen,
    side: THREE.DoubleSide
  })

  for (var i = 0; i < starNum; i++) {
    var star = new THREE.Mesh(starGeometry, starMaterial);
    var x = -500 + Math.random() * 1000;
    var y = -500 + Math.random() * 1000;
    var z = -500 + Math.random() * 1000;
    star.position.set(x, y, z);
    scene.add(star);
  }

  // 8. Constellations
  for (var i = 0; i < NUM_CONSTELLATIONS; i++) {
    var currentConstellation = constellations[i];

    // determine coordinates on map
    var raHour = currentConstellation.raHour;
    var raMinute = currentConstellation.raMinute;
    var raSecond = currentConstellation.raSecond;
    var declinationDegree = currentConstellation.declinationDegree;
    var declinationMinute = currentConstellation.declinationMinute;
    var declinationSecond = currentConstellation.declinationSecond;

    var X = calculateCartesianX(raHour, raMinute, raSecond, 
      declinationDegree, declinationMinute, declinationSecond);
    
    var Y = calculateCartesianY(raHour, raMinute, raSecond, 
      declinationDegree, declinationMinute, declinationSecond);

    // determine color
    var color = 0x000000;
    var starColor = currentConstellation.starColor;
    if (starColor == "White") {
      color = 0xffffff;
    } else if (starColor == "Orange/Red") {
      color = 0xffbda1;
    } else if (starColor == "Red") {
      color = 0xffbb9e;
    } else if (starColor == "Yellow") {
      color = 0xfbffc9;
    } else if (starColor == "Orange") {
      color = 0xffdf87;
    } else if (starColor == "Blue") {
      color = 0xb3c2ff; 
    } else if (starColor == "Blue/White") {
      color = 0xc9f2ff;
    } else {
      console.log(currentConstellation.latin)
    }

    // determine vertex length
    var numStars = currentConstellation.mainStars * 2;

    // determine rotation speed
    var objectType = currentConstellation.objectType;
    var rotationSpeed = 0;
    if (objectType == "Inanimate") {
      rotationSpeed = 0;
    } else if (objectType == "Human") {
      rotationSpeed = 0.01;
    } else if (objectType == "Animal") {
      rotationSpeed = 0.05;
    } else if (objectType == "Mythological") {
      rotationSpeed = 0.1;
    } else {
      console.log(currentConstellation.latin);
    }

    // determine radius
    var radius = currentConstellation.area / 200;

    var tempConstellation = new Constellation(scene, X, Y, color, numStars,
      rotationSpeed, radius);
    constellationList.push(tempConstellation);
    constellationRadii.push(radius);
    constellationNames.push(currentConstellation.latin);
    constellationDescriptions.push(currentConstellation.english)

  }

  // create the background
  sceneSubject = [new Background(scene)];

	window.addEventListener('resize', onWindowResize, false);//resize callback
}

// used this to calculate coordinates
// http://fmwriters.com/Visionback/Issue14/wbputtingstars.htm
function calculateCartesianX(raHour, raMinute, raSecond, 
  declinationDegree, declinationMinute, declinationSecond) {

    var A = raHour * 15 + raMinute * 0.25 + raSecond * 0.004166;
    var sign = 1;
    if (declinationDegree <= 0) {
      sign = -1;
    }
    var B = (Math.abs(declinationDegree) + declinationMinute / 60 + declinationSecond / 3600) * sign * declinationDegree;
    var C = 160;

    return (C * Math.cos(B)) * Math.cos(A)

}

function calculateCartesianY(raHour, raMinute, raSecond, 
  declinationDegree, declinationMinute, declinationSecond) {

    var A = raHour * 15 + raMinute * 0.25 + raSecond * 0.004166;
    var sign = 1;
    if (declinationDegree <= 0) {
      sign = -1;
    }
    var B = (Math.abs(declinationDegree) + declinationMinute / 60 + declinationSecond / 3600) * sign * declinationDegree;
    var C = 160;

    return (C * Math.cos(B)) * Math.sin(A)

}

function getConstellation() {
  // console.log("here")
  var currentPos = controls.getObject().position;

  for (var i = 0; i < constellationList.length; i++) {
    var dist = new THREE.Vector3().subVectors(constellationList[i].object.position, currentPos).length();
    // console.log(dist)
    if (dist < constellationRadii[i] + CONSTELLATION_COLLISION_DIST) {

      // display text
      blocker.style.display = '';
      instructions.innerHTML = "<br><strong>" + constellationNames[i] + "</strong><br><strong>" + constellationDescriptions[i] + "</strong>";
      instructions.style.color = 'White';
      instructions.style.display = '';
      
      setTimeout(fade_out, 2000);

    }
  }
}

function animate() {
    var delta = clock.getDelta();

    // constellations
    for (var i = 0; i < NUM_CONSTELLATIONS; i++) {
      constellationList[i].update();
    }

    getConstellation();

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
