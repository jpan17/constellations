function Constellation (scene, x, y, color) {

    var object = new THREE.Object3D();
    this.object = object;

    var sphereGeometry = new THREE.SphereGeometry(3, 10, 10);
    var sphereMaterial = new THREE.MeshBasicMaterial( {
        color: color,
        wireframe: false,
        flatShading: true
    })

    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.receiveShadow = false;
    sphere.position.set(x, 5, y)

    object.add(sphere)

    this.sphere = sphere;
    collidableObjects.push(this.sphere)

    scene.add(object);

  this.update = function() {
      this.sphere.rotation.x += 0.05;
  }

}