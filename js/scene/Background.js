function Background(scene) {

  var planeGeometry = new THREE.PlaneGeometry(1000, 1000, 4);
  // var planeMaterial = new THREE.MeshStandardMaterial( { color: 0x3c0047 } );
  // var planeMaterial = new THREE.MeshBasicMaterial({color: 0x3c0047});
  var planeMaterial = new THREE.MeshBasicMaterial({color: 0xace7ff})
  ground = new THREE.Mesh( planeGeometry, planeMaterial );
  ground.receiveShadow = true;
  ground.castShadow = false;
  ground.rotation.x = -Math.PI/2;
  // console.log("ground pos")
  // console.log(ground.position.y)
  scene.add(ground);
  // console.log(ground)

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
