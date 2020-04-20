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
var key;
var keyObject;
var sceneSubject;
var door;
var doorObject;
var nearFog;
var farFog;
var cubes;
var glowBox;

// objects related to timer/health
var fogDensity;
var circle;
var circleGeo; 
var circleMat;
var circleEffect;
var effectTime = 0;
var health;
var MAXHEALTH = 100;

// game state booleans
var foundKey = false;
var doorFound = false;
var firstTimeDoor = true;
var firstTimeKey = true;

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
var boxes = [];
var orbs = [];
var collidableObjects = []; // An array of collidable objects used later
var MAXLIGHTORBS = 70;
var PLAYERCOLLISIONDIST = 5;
var PLAYERLIGHTDIST = 6;
var PLAYERDOORDIST = 7;

/****************************** CONTROL VARS **********************************/
var blocker = document.getElementById('blocker');
var endgameAlert = document.getElementById('endgameAlert');
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

function calcFog(health) {
  return 1.0 / ((health + 0.1));
}

function calcRad(health) {
  return health * 0.3;
}

function createScene(){
	// 1. set up scene
  sceneWidth=window.innerWidth;
  sceneHeight=window.innerHeight;
  scene = new THREE.Scene();//the 3d scene
  fogDensity = calcFog(health);
  if (DEBUG == false) {
    scene.fog = new THREE.FogExp2(0xffffff, fogDensity); //enable fog 
    scene.background = new THREE.Color(0xffffff);
  }

	// 2. camera
  camera = new THREE.PerspectiveCamera( 75, sceneWidth / sceneHeight, .4, 2000 );//perspective camera
  camera.position.y = 2;
  camera.position.z = 0;
  scene.add(camera);

	// 3. renderer
  renderer = new THREE.WebGLRenderer({alpha:true});//renderer with transparent backdrop
  renderer.setClearColor(0xcce0ff, 1); // enable fog (??)
  // renderer.setClearColor(0xffffff, 1);
	// renderer.setClearColor(scene.fog.color); // sets it to the grass color
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

  // radius of flashlight circle 
  circleGeo = new THREE.CircleGeometry(calcRad(health), 64, 3);
  circleGeo.vertices.shift();
  circleMat = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 5,});
  circle = new THREE.LineLoop(circleGeo, circleMat);
  circle.rotation.x = -Math.PI/2;
  circle.visible = false;
  scene.add(circle);
  circleEffect = new CircleEffect(scene);

  // create the background
  keyObject = new Key(scene);
  doorObject = new Door(scene);
  sceneSubject = [new Background(scene)];
  cubes = [];
  if (random) {
    for (let i = 0; i < 25; i++) 
      cubes.push(new Cube(scene));
  } else {
    let dimensions = new THREE.Vector3(30, 100, 30);
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        if (i == 5 && j == 5)
          continue;
        let position = new THREE.Vector3(i * 50 - 250, 0, j * 50 - 250);
        cubes.push(new Cube(scene, dimensions, position));
      }
    }
  }
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      if (i % 2 == 0 && j % 2 == 0)
        continue;
      let flip = (Math.random() <= 0.3);
      if (flip) {
        let position = new THREE.Vector3(i * 25 - 200, 0, j * 25 - 200);
        orbs.push(new   Orb(scene, position));
      }
      if (orbs.length >= MAXLIGHTORBS) {
        break;
      }
    }
    if (orbs.length >= MAXLIGHTORBS) {
      break;
    }
  }
    
	//var helper = new THREE.CameraHelper( sun.shadow.camera );
	//scene.add( helper );// enable to see the light cone

	window.addEventListener('resize', onWindowResize, false);//resize callback
}

function animate(){
    var delta = clock.getDelta();
    //animate
    for (let i = 0; i < orbs.length; i++) {
      orbs[i].update();
    }

    // get the key to spin or bounce
    if (scene.children.indexOf(key) >= 0) {
      keyObject.update(delta);
    }
    if (scene.children.indexOf(doorObject.object) >= 0)
      doorObject.update();

    if (scene.children.indexOf(circleEffect.object) >= 0)
      circleEffect.update();

    health -= 0.1;
    if (health < -0.1)
      health = -0.1;
    // check if near light
    getLight();

    if (DEBUG == false) {
      fogDensity = calcFog(health);
      scene.fog = new THREE.FogExp2(0xffffff, fogDensity); //enable fog 
    }
    
    // update circle position
    let currentPos = controls.getObject().position;
    circleGeo = new THREE.CircleGeometry(calcRad(health), 64, 3);
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

function getLight() {

  let currentPos = controls.getObject().position;

  for (let i = 0; i < orbs.length; i++) {
    let dist = new THREE.Vector3().subVectors(orbs[i].object.position, currentPos).length();
    if (dist < PLAYERCOLLISIONDIST) {
      //increase health 
      health += 25;
      if (health > MAXHEALTH)
        health = MAXHEALTH;

      // add circle effect
      circleEffect.start();

      // remove the object
      let orbIndex = scene.children.indexOf(orbs[i].object);
      orbs[i].object.children = [];
      scene.children.splice(orbIndex, 1);
      orbs.splice(i, 1);
    }
  }
}

var fade_out = function() {
  instructions.innerHTML = ""; 
  doorFound = false;
}

function detectPlayerDeath() {
  if (health <= 0) {
    health = 0;
    return true;
  }
  return false;
}

function endGame() {
    blocker.style.display = '';
    instructions.innerHTML = "<strong>GAME OVER </br></br></br> Press [SPACEBAR] to restart</strong>";
    gameOver = true;
    instructions.style.display = '';
    instructions.style.color = "SlateBlue";
    endgameAlert.style.display = 'none';
    // restart code (jess version hopefully this works)
    document.addEventListener('keydown', function(event) {
      // var key_press = String.fromCharCode(event.keyCode); 

      if (event.keyCode == 32) {
        // console.log("attempting to restart");
        STATE = "start";
        location.reload();
      }
    });
}

function wonGame() {
    blocker.style.display = '';
    instructions.innerHTML = "CONGRATULATIONS, YOU ESCAPED </br></br></br> Press [SPACEBAR] to restart";
    gameOver = true;
    instructions.style.display = '';
    instructions.style.color = "SlateBlue";
    endgameAlert.style.display = 'none';
    // restart code (jess version hopefully this works)
    // let forearmRadius = 10000;
    document.addEventListener('keydown', function(event) {
      // var key_press = String.fromCharCode(event.keyCode); 

      if (event.keyCode == 32) {
        // console.log("attempting to restart");
        STATE = "start";
        location.reload();
        
      }
    });
}

function gotKey() {
  doorObject.show();
  blocker.style.display = '';
  instructions.innerHTML = "<strong>YOU FOUND THE KEY! FIND THE PORTAL BEFORE YOUR LIGHT RUNS OUT.</strong>";
  instructions.style.color = 'SlateBlue';
  gameOver = false;
  instructions.style.display = '';
  endgameAlert.style.display = 'none';
  
  setTimeout(fade_out, 3000);
}

function gotDoor() {
  blocker.style.display = '';
  instructions.innerHTML = "<strong>YOU CANNOT EXIT BEFORE YOU FIND THE KEY THAT UNLOCKS THIS PORTAL.</strong>";
  instructions.style.color = 'SlateBlue';
  gameOver = false;
  instructions.style.display = '';
  endgameAlert.style.display = 'none';
  setTimeout(fade_out, 3000);
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
