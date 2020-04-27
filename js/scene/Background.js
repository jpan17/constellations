function Background(scene) {

  // create floor
  var planeGeometry = new THREE.PlaneGeometry(360, 360, 150, 150);
  // planeGeometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));

  // merge floor vertices
  // planeGeometry.mergeVertices();

  // get the vertices
  var verticesLength = planeGeometry.vertices.length;

  // create an array to store new data associated to each vertex
  for (var i = 0; i < verticesLength; i++) {
    planeGeometry.vertices[i].y += + Math.random()*5;
    planeGeometry.vertices[i].z += Math.random()*1;
  }
   
  var mat = new THREE.MeshStandardMaterial({
    color: 0x001029,
    side: THREE.DoubleSide,
    flatShading: true,
    roughness: 1.0,
    wireframe: false,
    // transparent:true,
    // opacity:0.9
	});

	var ground = new THREE.Mesh(planeGeometry, mat);
  ground.receiveShadow = true;
  ground.castShadow = false;
  ground.rotation.x = -Math.PI/2;
  scene.add(ground);

  // set up sphere container
  var sky = new THREE.Mesh(
    new THREE.SphereGeometry(180, 20, 20),
    new THREE.MeshStandardMaterial( {
      color: 0x0f67d4,
      side: THREE.BackSide,
    } )
  )
  scene.add(sky)
  collidableObjects.push(sky)

  this.update = function(time) {


  }
}
