function CircleEffect(scene) {
    var object = new THREE.Object3D();
    this.object = object;
    this.points1;
    this.points2;
    object.position.y = 0;
    scene.add(object);

    var pMaterial = new THREE.PointsMaterial({
        color: 0xfa9bff,
        size: 0.7,
        map: new THREE.TextureLoader().load('images/particle.png'),
        blending: THREE.AdditiveBlending,
        //transparent: true
    });
    this.pMaterial = pMaterial;

    this.update = function() {
        this.object.position.x = controls.getPosition().x;
        this.object.position.z = controls.getPosition().z;
        
        if (effectTime > 0) {
            effectTime -= 1;
            this.points1.rotation.y += 0.01;
            this.points2.rotation.y -= 0.01;
            this.points1.position.y += 0.1;
            this.points2.position.y += 0.1;
            this.pMaterial.needsUpdate = true;
            this.pMaterial.opacity = effectTime / 75;
            /*this.points1.geometry.verticesNeedUpdate = true;
            this.points2.geometry.verticesNeedUpdate = true;
            for (let i = 0; i < this.points1.geometry.vertices.length; i++) {
                this.points1.geometry.vertices[i].y += 0.1;
                this.points2.geometry.vertices[i].y += 0.1;
            } */
            if (effectTime <= 0)
                this.end();
        }
    }

    this.start = function() {
        this.object.children = [];
        effectTime = 75;
        this.pMaterial.opacity = 1;
        var particleCount = 150,
        particles1 = new THREE.Geometry(),
        particles2 = new THREE.Geometry();
        //particles.verticesNeedUpdate = true;
        for (var p = 0; p < particleCount; p++) {
            // create a particle with random
            var r = calcRad(health);
            var theta = Math.random() * 2 * Math.PI;
            var pX = Math.cos(theta) * r;
            var pZ = Math.sin(theta) * r;
            var particle1 = new THREE.Vector3(pX, Math.random() * 8 - 8, pZ);
            var particle2 = new THREE.Vector3(pZ, Math.random() * 8 - 8, pX);

            // add it to the geometry
            particles1.vertices.push(particle1);
            particles2.vertices.push(particle2);
        }
        // create the particle system
        var particleSystem1 = new THREE.Points(
            particles1,
            this.pMaterial);
        this.points1 = particleSystem1;
        var particleSystem2 = new THREE.Points(
            particles2,
            this.pMaterial);
        this.points2 = particleSystem2;
        object.add(this.points1);
        object.add(this.points2);
    }

    this.end = function() {
        this.object.children = [];
        effectTime = 0;
    }
}