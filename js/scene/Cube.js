function Cube(scene, dimension, position) {
  if (dimension === undefined) {
  // random cubes
    var width = Math.round(Math.random()*50+10);
    var height = Math.round(Math.random()*200+50);
    var depth = Math.round(Math.random()*50+10);
    var boxGeo = new THREE.BoxGeometry(width, height, depth);
  } else {
    var boxGeo = new THREE.BoxGeometry(dimension.x, Math.round(Math.random()*200+50), dimension.z);
  }

  var randomColors = [0xecd4ff, 0xfcc2ff, 0xc5a3ff, 0xd5aaff]
  boxMaterial = new THREE.MeshBasicMaterial({
    color: randomColors[Math.floor(Math.random()*4)],
  });

  box = new THREE.Mesh(boxGeo, boxMaterial);
  // boxMaterial.lights = true;
  if (position === undefined) {
    box.position.x = Math.random()*400-200;// for some reason these are clustering
    box.position.y = 0;
    box.position.z = Math.random()*400-200;
  } else {
    box.position.x = position.x;
    box.position.y = 0;
    box.position.z = position.z;
  }
  //if (Math.abs(box.position.x) < PLAYERCOLLISIONDIST)
    //box.position.x += PLAYERCOLLISIONDIST;

  //if (Math.abs(box.position.z) < PLAYERCOLLISIONDIST)
    //box.position.z += PLAYERCOLLISIONDIST;
  // box.receiveShadow = true;
  // box.castShadow = true;
  scene.add(box);
  boxes.push(box);
  // console.log(boxes)

  collidableObjects.push(box);
}

