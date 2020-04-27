function Draco (scene) {

    var sphereGeometry = new THREE.SphereGeometry(5, 14, 14);
    var sphereMaterial = new THREE.MeshBasicMaterial( {
        color: 0xffbf00,
        wireframe: true,
        flatShading: true
    })

    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.receiveShadow = false;
    sphere.position.set(50, 7, 3)

    this.sphere = sphere;
    collidableObjects.push(this.sphere)

    scene.add(sphere);

  this.update = function() {
      this.sphere.rotation.x += 0.1;
  }

}