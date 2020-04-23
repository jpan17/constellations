function Background(scene) {
  
  
  console.log("here")
  // create floor
  var planeGeometry = new THREE.PlaneGeometry(720, 720, 300, 300);
  // planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

  // merge floor vertices
  // planeGeometry.mergeVertices();

  // get the vertices
  var verticesLength = planeGeometry.vertices.length;

  // create an array to store new data associated to each vertex
  for (var i = 0; i < verticesLength; i++) {
    planeGeometry.vertices[i].y += 5 + Math.random()*15;
    planeGeometry.vertices[i].z += Math.random()*1;
  }
   
  var mat = new THREE.MeshPhongMaterial({
    color: 0xb28dff,
    transparent:true,
    opacity:0.9
	});

	var ground = new THREE.Mesh(planeGeometry, mat);
  ground.receiveShadow = true;
  ground.castShadow = false;
  ground.rotation.x = -Math.PI/2;
  scene.add(ground);

  // set up back wall
  var wallGeometry = new THREE.PlaneGeometry(600, 600);
  // var wallMaterial = new THREE.MeshStandardMaterial({color: 0xdfaff7 });
  // var wallMaterial = new THREE.MeshBasicMaterial({color: 0xdfaff7});
  var wallMaterial = new THREE.MeshBasicMaterial({color: 0xb28dff});
  // wallMaterial.lights = true;

  wallMaterial.fog = true;
  backWall = new THREE.Mesh(wallGeometry, wallMaterial);
  backWall.rotation.y = Math.PI;
  backWall.recieveShadow = true;
  // backWall.castShadow = true;
  backWall.position.y = 50;
  backWall.position.z = backDist;
  scene.add(backWall);
  collidableObjects.push(backWall);

  // right wall
  rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
  rightWall.recieveShadow = true;
  // rightWall.castShadow = true;
  rightWall.rotation.y = -Math.PI/2;
  rightWall.position.x = rightDist;
  rightWall.position.y = 50;
  scene.add(rightWall);
  collidableObjects.push(rightWall);

  // left wall
  leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
  leftWall.recieveShadow = true;
  // leftWall.castShadow = true;
  leftWall.rotation.y = Math.PI/2;
  leftWall.position.x = leftDist;
  leftWall.position.y = 50;
  scene.add(leftWall);
  collidableObjects.push(leftWall);

  // front wall
  frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
  frontWall.recieveShadow = true;
  // frontWall.castShadow = true;
  frontWall.position.y = 50;
  frontWall.position.z = frontDist;
  scene.add(frontWall);
  collidableObjects.push(frontWall);


  this.update = function(time) {


  }
}
