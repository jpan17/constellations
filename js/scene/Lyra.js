function Lyra (scene) {

    var sphereGeometry = new THREE.SphereGeometry(2.5, 5, 5);
    var sphereMaterial = new THREE.MeshBasicMaterial( {
        color: 0x3449eb,
        wireframe: true,
        flatShading: true
    })

    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.receiveShadow = false;
    sphere.position.set(-10, 4.5, -2)

    this.sphere = sphere;
    collidableObjects.push(this.sphere)

    scene.add(sphere);

  this.update = function() {
  }

}