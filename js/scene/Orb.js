function Orb (scene, position) {
  // main object of this class
  var object = new THREE.Object3D();
  this.object = object;

  // middle cube
  var cubeMaterial = new THREE.MeshBasicMaterial(
    { color: 0xffffff, vertexColors: THREE.VertexColors }
  );
  var size = 5;

  var cubeGeometry = new THREE.CubeGeometry (size, size, size, 1, 1, 1,);
  var customMaterial = new THREE.ShaderMaterial(
    {
      uniforms:
      {
        "c": {type: "f", value: .2},
        "p": {type: "f", value: 1.9},
        glowColor: {type: "c", value: new THREE.Color(0xffff00)},
        viewVector: {type: "v3", value: camera.position}
      },
      vertexShader: document.getElementById('vertexShader').textContent,
      fragmentShader: document.getElementById('fragmentShader').textContent,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    }
  );
  
  var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  this.cube = cube;
  cube.receiveShadow = false;
  cube.scale.set(0.3,0.3,0.3)
  object.add(cube)

  // now let's add glow effect
  var glowCube = new THREE.CubeGeometry(size, size, size, 1,1,1);
  var glowBox = new THREE.Mesh(glowCube, customMaterial.clone());
  this.glowBox = glowBox;
  glowBox.position.x = cube.position.x;
  glowBox.position.y = cube.position.y;
  glowBox.position.z = cube.position.z;
  glowBox.receiveShadow = false;
  glowBox.scale.set(0.35,0.35,0.35);
  object.add(glowBox);

  // create the particle variables
  var particleCount = 25,
  particles = new THREE.Geometry();
  var pMaterial = new THREE.PointsMaterial({
    color: 0x66F9FF,
    size: 0.3,
    map: new THREE.TextureLoader().load("images/particle.png"),
    blending: THREE.AdditiveBlending,
    transparent: true
  });

  // now create the individual particles
  for (var p = 0; p < particleCount; p++) {
    // create a particle with random
    // position values, -250 -> 250
    var pX = Math.random() * 4 - 2,
      pY = Math.random() * 4 - 2,
      pZ = Math.random() * 4 - 2,
      particle = new THREE.Vector3(pX, pY, pZ);

    // add it to the geometry
    particles.vertices.push(particle);
  }

  // create the particle system
  var particleSystem = new THREE.Points(
  particles,
  pMaterial);
  this.points = particleSystem;
  
  // add it to the object
  object.add(particleSystem);
  if (position === undefined) {
    object.position.x = Math.random()*400-200;
    object.position.y = 2;
    object.position.z = Math.random()*400-200;
  } else {
    object.position.x = position.x + Math.random() * 14 - 7;
    object.position.y = 2;
    object.position.z = position.z + Math.random() * 14 - 7;
  }
  scene.add(this.object);
  
  this.update = function() {
    this.cube.rotation.x += 0.05;
    this.cube.rotation.y += 0.05;
    this.glowBox.rotation.x += 0.05;
    this.glowBox.rotation.y += 0.05;
    //this.points.rotation.x -= 0.1;
    this.points.rotation.y -= 0.1;
  }

}
