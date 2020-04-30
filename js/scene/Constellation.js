function Constellation (scene) {

    var sphereGeometry = new THREE.SphereGeometry(3, 10, 10);
    var sphereMaterial = new THREE.MeshBasicMaterial( {
        color: 0xffffff,
        wireframe: true,
        flatShading: true
    })

    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.receiveShadow = false;
    sphere.position.set(5, 5, 50)

    this.sphere = sphere;
    collidableObjects.push(this.sphere)

    scene.add(sphere);

  this.update = function() {
      this.sphere.rotation.x += 0.05;
  }

}