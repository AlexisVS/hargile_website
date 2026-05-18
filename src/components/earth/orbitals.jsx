"use client";

import * as THREE from "three";
import {useEffect} from "react";

export default function Orbitals() {
    useEffect(() => {
        const objects = []

        const scene = new THREE.Scene();
        const canvas = document.querySelector("#orbitals");
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({antialias: true, canvas: canvas});

        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        createLight(scene);

        //Solar System Object
        const solarSystem = new THREE.Object3D();
        scene.add(solarSystem);
        objects.push(solarSystem);

        //Earth Orbit Object
        const earthOrbit = new THREE.Object3D();
        earthOrbit.position.x = 10;
        solarSystem.add(earthOrbit);
        objects.push(earthOrbit);

        // Sun Object
        const geometrySun = new THREE.SphereGeometry(1, 30, 30);
        const sunMaterial = new THREE.MeshLambertMaterial({color: 0xFFAA00, wireframe: true});
        const sunMesh = new THREE.Mesh(geometrySun, sunMaterial);
        sunMesh.scale.set(5, 5, 5)
        solarSystem.add(sunMesh);
        objects.push(sunMesh);

        //Earth Object
        const geometryEarth = new THREE.SphereGeometry(1, 30, 30);
        const earthMaterial = new THREE.MeshPhongMaterial({color: 0x2233FF});
        const earthMesh = new THREE.Mesh(geometryEarth, earthMaterial);
        earthOrbit.add(earthMesh);
        objects.push(earthMesh);

        //Moon Orbit
        const moonOrbit = new THREE.Object3D();
        moonOrbit.position.x = 2;
        earthOrbit.add(moonOrbit);

        //Moon Object
        const geometryMoon = new THREE.SphereGeometry(1, 30, 30);
        const moonMaterial = new THREE.MeshPhongMaterial({color: 0x808080});
        const moonMesh = new THREE.Mesh(geometryMoon, moonMaterial);
        moonMesh.scale.set(0.5, 0.5, 0.5);
        moonOrbit.add(moonMesh);
        objects.push(moonMesh);

        camera.position.set(0, 40, -20);
        camera.up.set(0, 0, 1);
        camera.lookAt(0, 0, 1);

        function animate(time) {
            time *= 0.001;

            objects.forEach(object => {
                object.rotation.y = time;
            });

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        animate();
    }, []);

    return (
        <div>
            <canvas id={"orbitals"}></canvas>
        </div>
    );
}