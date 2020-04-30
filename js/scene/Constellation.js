function Constellation (scene, x, y, color) {

    var object = new THREE.Object3D();
    this.object = object;

    var sphereGeometry = new THREE.SphereGeometry(3, 10, 10);
    var sphereMaterial = new THREE.MeshBasicMaterial( {
        color: color,
        flatShading: true,
        transparent: true,
        opacity: 0.4
    })

    var sphereGridGeometry = new THREE.SphereGeometry(3.25, 10, 10);
    var sphereGridMaterial = new THREE.MeshBasicMaterial( {
        color: color,
        wireframe: true,
        flatShading: true
    })

    var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.receiveShadow = false;
    sphere.position.set(x, 5, y)

    var sphereGrid = new THREE.Mesh(sphereGridGeometry, sphereGridMaterial)
    sphereGrid.receiveShadow = false;
    sphereGrid.position.set(x, 5, y)

    object.add(sphere)
    object.add(sphereGrid)

    this.sphere = sphere;
    this.sphereGrid = sphereGrid;
    collidableObjects.push(this.sphere)

    scene.add(object);

  this.update = function() {
      this.sphere.rotation.x += 0.05;
      this.sphereGrid.rotation.x += 0.05
  }

}