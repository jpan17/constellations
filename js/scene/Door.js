function Door(scene) {
  var object = new THREE.Object3D();
  this.object = object;
  let loader = new THREE.STLLoader();
  loader.load('objects/Portal.stl', function (geometry) {
    let material = new THREE.MeshBasicMaterial(
      { color: 0xfdfd96} );
    door = new THREE.Mesh(geometry, material);

    // door.position.set(0,5,10);
    door.position.set(-4.5, -4.5, 0);
    door.rotation.set(0,0,0);
    door.scale.set(.05,.05,.01);

    door.castShadow = true;
    door.receiveShadow = true;

    object.position.set(0, 5, 20);
    object.add(door);
    
    scene.add(object);

  });

  // create the particle variables
  var particleCount = 500,
  particles = new THREE.Geometry();
  particles.verticesNeedUpdate = true;
  var pMaterial = new THREE.PointsMaterial({
    color: 0xfa9bff,
    size: 0.4,
    map: new THREE.TextureLoader().load('images/smoke.png'),
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  
  // now create the individual particles
  var randomColors = [0xecd4ff, 0xfcc2ff, 0xc5a3ff, 0xd5aaff];
  var pVelocity = [];
  var angles = [];
  var Rs = [];
  for (var p = 0; p < particleCount; p++) {
    // create a particle with random
    var r = Math.random() * 6;
    var theta = Math.random() * 2 * Math.PI;
    var pX = Math.cos(theta) * r;
    var pY = Math.sin(theta) * r;
    var particle = new THREE.Vector3(pX, pY, -1);

    // add it to the geometry
    particles.vertices.push(particle);
    pVelocity.push(r / 40);
    angles.push(theta);
    Rs.push(r);
  }
  this.particles = particles.vertices;
  this.pVelocity = pVelocity;
  this.angles = angles;
  this.Rs = Rs;

  // create the particle system
  var particleSystem = new THREE.Points(
  particles,
  pMaterial);
  //particleSystem.sortParticles = true;
  this.points = particleSystem;
  particleSystem.visible = false;
  // add it to the object
  object.add(this.points);

  this.update = function() {
    this.object.rotation.z += 0.05;
    //console.log(this.particles.length);
    //console.log(this.points.geometry.vertices[0]);
    this.points.geometry.verticesNeedUpdate = true;
    for (let i = 0; i < this.particles.length; i++) {
      this.angles[i] = (this.angles[i] - this.pVelocity[i]) % (Math.PI * 2);
      this.points.geometry.vertices[i].x = Math.cos(this.angles[i]) * this.Rs[i];
      this.points.geometry.vertices[i].y = Math.sin(this.angles[i]) * this.Rs[i];
    }
    //this.points.rotation.z -= 0.2;
  }

  this.show = function() {
    this.points.visible = true;
  }
}
