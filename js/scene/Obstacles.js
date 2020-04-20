function Obstacles(scene) {
  // add in objects/obstacles
  function CustomSinCurve( scale ) {
    THREE.Curve.call( this );
    this.scale = ( scale === undefined ) ? 1 : scale;
  }

  CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
  CustomSinCurve.prototype.constructor = CustomSinCurve;

  CustomSinCurve.prototype.getPoint = function ( t ) {

    var tx = t * 3 - 1.5;
    var ty = Math.sin( 2 * Math.PI * t );
    var tz = 0;
    return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );
  };

  var path = new CustomSinCurve(10);
  var tubeGeometry = new THREE.TubeGeometry( path, 50, 5, 8, false );
  var tubeMat = new THREE.MeshBasicMaterial( { color: 0x3044c9 } );
  var tube = new THREE.Mesh( tubeGeometry, tubeMat );
  tube.rotation.x = -Math.PI/2;
  tube.position.y = 0;
  tube.position.z = -75;

  collidableObjects.push(tube);

  scene.add(tube);

  var points = [];
  for ( var i = 0; i < 10; i ++ ) {
    points.push( new THREE.Vector2( Math.sin( i * 0.2 ) * 10 + 5, ( i - 5 ) * 2 ) );
  }
  var latheGeometry = new THREE.LatheGeometry( points );
  var latheMaterial = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
  lathe = new THREE.Mesh(latheGeometry, latheMaterial );
  lathe.rotation.x = -Math.PI;
  lathe.position.z = 100;
  lathe.position.x = 80;

  collidableObjects.push(lathe);

  scene.add( lathe );

  // add in torus later
  this.update = function(time) {

  }
}
