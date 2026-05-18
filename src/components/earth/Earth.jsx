"use client";

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import { useEffect, useState, useRef } from "react";
import Lenis from 'lenis';
import Loading from "@/components/earth/Loading";

export default function Earth({ children }) {
    const [texturesLoaded, setTexturesLoaded] = useState(false);
    const [progress, setProgress] = useState(0);
    const loading = !texturesLoaded;
    const canvasRef = useRef(null);
    const rendererRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const controlsRef = useRef(null);
    const animationRef = useRef(null);
    const statsRef = useRef(null);
    const earthGroupRef = useRef(null);
    const cloudsMeshRef = useRef(null);
    const earthMeshRef = useRef(null);

    // Référence pour la position de scroll actuelle
    const scrollProgressRef = useRef(0);
    const lenisRef = useRef(null);
    const loadingManagerRef = useRef(null);
    if (loadingManagerRef.current === null) {
        loadingManagerRef.current = new THREE.LoadingManager();
    }

    // Fonction pour déterminer la qualité en fonction de l'appareil
    const getDeviceQuality = () => {
        // Vérifier si le dispositif est mobile
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        );

        // Vérifier les capacités GPU via le nombre de pixels max
        const pixelRatio = window.devicePixelRatio || 1;
        const screenWidth = window.innerWidth * pixelRatio;
        const screenHeight = window.innerHeight * pixelRatio;
        const totalPixels = screenWidth * screenHeight;

        // Déterminer la qualité
        if (isMobile || totalPixels < 1000000) {
            return "low";
        } else if (totalPixels < 4000000) {
            return "medium";
        } else {
            return "high";
        }
    };

    // Configuration de Lenis pour le smooth scrolling
    useEffect(() => {
        if (typeof window === 'undefined') return;

        lenisRef.current = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });

        // Mise à jour de la position de scroll
        lenisRef.current.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
            scrollProgressRef.current = progress;
        });

        function raf(time) {
            if (lenisRef.current) {
                lenisRef.current.raf(time);
                requestAnimationFrame(raf);
            }
        }

        requestAnimationFrame(raf);

        return () => {
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        // Déterminer la qualité de l'appareil
        const deviceQuality = getDeviceQuality();

        // Configurer les paramètres de qualité
        const qualitySettings = {
            low: {
                segments: 32,
                textureScale: 0.25,
                pixelRatio: 1
            },
            medium: {
                segments: 64,
                textureScale: 0.5,
                pixelRatio: 1
            },
            high: {
                segments: 80,
                textureScale: 1,
                pixelRatio: window.devicePixelRatio || 1
            }
        };

        const quality = qualitySettings[deviceQuality];

        // Scène & Caméra
        sceneRef.current = new THREE.Scene();
        cameraRef.current = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        cameraRef.current.position.z = 3;

        // Renderer avec optimisations
        rendererRef.current = new THREE.WebGLRenderer({
            antialias: deviceQuality !== "low",
            powerPreference: "high-performance",
            precision: deviceQuality === "low" ? "lowp" : "mediump",
            alpha: true, // Pour avoir un fond transparent
        });

        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current.setPixelRatio(quality.pixelRatio);
        rendererRef.current.setClearColor(0x000000, 0); // Fond transparent

        // Optimisations du renderer
        rendererRef.current.sortObjects = false;

        // Initialiser les contrôles mais les désactiver initialement
        // puisque la caméra sera animée par le scroll
        controlsRef.current = new OrbitControls(cameraRef.current, rendererRef.current.domElement);
        controlsRef.current.enableDamping = true;
        controlsRef.current.dampingFactor = 0.05;
        controlsRef.current.rotateSpeed = 0.5;
        controlsRef.current.zoomSpeed = 0.7;
        controlsRef.current.minDistance = 1.5;
        controlsRef.current.maxDistance = 10;
        controlsRef.current.enablePan = false;
        controlsRef.current.enabled = false; // Désactiver les contrôles manuels

        // Initialisation du moniteur de performance (FPS)
        statsRef.current = new Stats();
        statsRef.current.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        statsRef.current.dom.style.position = 'absolute';
        statsRef.current.dom.style.top = '0px';
        statsRef.current.dom.style.left = '0px';
        statsRef.current.dom.style.zIndex = '100';

        // Lumière
        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        light.position.set(-5, 2, 2);
        sceneRef.current.add(light);

        // Ambiance légère pour éclairer uniformément
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        sceneRef.current.add(ambientLight);

        // Loading Manager
        const loadingManager = loadingManagerRef.current;
        loadingManager.onLoad = () => {
            setTexturesLoaded(true);
        };
        loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            setProgress(Math.round((itemsLoaded / itemsTotal) * 100));
        };

        // Revenir aux paramètres originaux pour les textures
        const textureLoader = new THREE.TextureLoader(loadingManager);

        // Chargement simple sans modifications des paramètres par défaut de Three.js
        const dayTexture = textureLoader.load("/textures/earth/textures/2_no_clouds_16k.jpeg");
        const nightTexture = textureLoader.load("/textures/earth/textures/NIGHT.jpg");
        const cloudsTexture = textureLoader.load("/textures/earth/textures/fair_clouds_8k.jpeg");

        // Définir les paramètres après le chargement pour stabiliser les textures
        nightTexture.minFilter = THREE.LinearFilter;
        nightTexture.magFilter = THREE.LinearFilter;
        nightTexture.generateMipmaps = false;

        // Matériau de la Terre
        const earthMaterial = new THREE.ShaderMaterial({
            uniforms: {
                dayTexture: { value: dayTexture },
                nightTexture: { value: nightTexture },
                lightDirection: { value: light.position.clone().normalize() },
                nightIntensity: { value: 1.2 }, // Valeur plus conservative
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                    gl_Position = projectionMatrix * vec4(vPosition, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D dayTexture;
                uniform sampler2D nightTexture;
                uniform vec3 lightDirection;
                uniform float nightIntensity;
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec2 vUv;
                void main() {
                    // Calcul de l'intensité lumineuse basée sur l'angle avec la source de lumière
                    float intensity = dot(vNormal, lightDirection);
                    
                    // Transition avec des valeurs fixes comme dans la version originale
                    float transition = smoothstep(0.0, 0.4, intensity);
                    
                    // Échantillonnage des textures
                    vec4 dayColor = texture2D(dayTexture, vUv);
                    vec4 nightColor = texture2D(nightTexture, vUv) * nightIntensity;
                    
                    // Mélange des textures jour/nuit
                    gl_FragColor = mix(nightColor, dayColor, transition);
                }
            `,
        });

        // Planète avec géométrie adaptée à la qualité
        const earthGeometry = new THREE.SphereGeometry(1, quality.segments, quality.segments);
        const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
        earthMeshRef.current = earthMesh;

        // Matériau des Nuages
        const cloudsMaterial = new THREE.ShaderMaterial({
            uniforms: {
                cloudTexture: { value: cloudsTexture },
                lightDirection: { value: light.position.clone().normalize() },
                transitionThreshold: { value: 0.03 },
                fixedOpacity: { value: 0.5 },
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D cloudTexture;
                uniform vec3 lightDirection;
                uniform float transitionThreshold;
                uniform float fixedOpacity;
                varying vec3 vNormal;
                varying vec2 vUv;
                void main() {
                    float intensity = dot(vNormal, lightDirection);
                    float transition = smoothstep(transitionThreshold, transitionThreshold + 0.1, intensity);
                    vec4 cloudColor = texture2D(cloudTexture, vUv);
                    cloudColor.a = fixedOpacity * transition;
                    gl_FragColor = cloudColor;
                }
            `,
            transparent: true,
        });

        // Mesh des nuages avec géométrie adaptée à la qualité
        const cloudsGeometry = new THREE.SphereGeometry(1.005, quality.segments, quality.segments);
        const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
        cloudsMeshRef.current = cloudsMesh;

        // Inclinaison de la Terre
        const earthGroup = new THREE.Group();
        earthGroupRef.current = earthGroup;
        earthGroup.add(earthMesh);
        earthGroup.add(cloudsMesh);
        sceneRef.current.add(earthGroup);
        earthGroup.rotation.z = THREE.MathUtils.degToRad(23.5);

        // Configurer les animations basées sur le scroll
        // Positions initiale et finale de la caméra
        const initialCameraPosition = new THREE.Vector3(0, 0, 3);
        const finalCameraPosition = new THREE.Vector3(2, -0.5, 1.7);

        // Animation avec vitesse de rotation ralentie et rendu stable
        let lastTime = 0;
        function animate(time) {
            animationRef.current = requestAnimationFrame(animate);

            // Mise à jour des statistiques FPS
            if (statsRef.current) {
                statsRef.current.begin();
            }

            // Calcul du delta pour une animation indépendante du taux de rafraîchissement
            const delta = lastTime ? (time - lastTime) / 1000 : 0;
            lastTime = time;

            // Utilisation d'un delta fixe pour éviter les fluctuations
            const fixedDelta = Math.min(delta, 0.016); // Max 60fps équivalent

            // Rotation des objets
            if (earthMeshRef.current) earthMeshRef.current.rotation.y += 0.0001 * fixedDelta * 60;
            if (cloudsMeshRef.current) cloudsMeshRef.current.rotation.y += 0.00015 * fixedDelta * 60;

            // Animation basée sur le scroll
            if (cameraRef.current) {
                // Interpolation entre position initiale et finale en fonction du scroll
                const scrollProgress = scrollProgressRef.current;

                // Position de la caméra basée sur le scroll
                cameraRef.current.position.lerpVectors(
                    initialCameraPosition,
                    finalCameraPosition,
                    scrollProgress
                );

                // Rotation du groupe Earth basée sur le scroll
                if (earthGroupRef.current) {
                    earthGroupRef.current.rotation.y = scrollProgress * Math.PI * 0.5; // Rotation de 90 degrés
                }

                // Toujours regarder le centre de la Terre
                cameraRef.current.lookAt(0, 0, 0);
            }

            // Mettre à jour les contrôles si nécessaire
            if (controlsRef.current && controlsRef.current.enabled) {
                controlsRef.current.update();
            }

            // Rendu
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }

            // Finaliser la mesure de performance
            if (statsRef.current) {
                statsRef.current.end();
            }
        }

        // Gestion du redimensionnement de la fenêtre
        const handleResize = () => {
            if (cameraRef.current && rendererRef.current) {
                cameraRef.current.aspect = window.innerWidth / window.innerHeight;
                cameraRef.current.updateProjectionMatrix();
                rendererRef.current.setSize(window.innerWidth, window.innerHeight);
            }
        };

        window.addEventListener('resize', handleResize);

        // Démarrer l'animation seulement après le chargement
        if (texturesLoaded) {
            animate();
        }

        // Nettoyage
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }

            // Disposer les contrôles
            if (controlsRef.current) {
                controlsRef.current.dispose();
            }

            if (rendererRef.current && rendererRef.current.domElement && rendererRef.current.domElement.parentNode) {
                rendererRef.current.domElement.parentNode.removeChild(rendererRef.current.domElement);
            }

            // Libérer la mémoire
            if (earthGeometry) earthGeometry.dispose();
            if (cloudsGeometry) cloudsGeometry.dispose();
            if (earthMaterial) earthMaterial.dispose();
            if (cloudsMaterial) cloudsMaterial.dispose();
            if (dayTexture) dayTexture.dispose();
            if (nightTexture) nightTexture.dispose();
            if (cloudsTexture) cloudsTexture.dispose();
            if (rendererRef.current) rendererRef.current.dispose();
        };
    }, [texturesLoaded]);

    // Une fois le chargement terminé, attacher le renderer au vrai DOM
    useEffect(() => {
        if (!loading && canvasRef.current && rendererRef.current) {
            // Style du conteneur Canvas pour qu'il soit en arrière-plan
            canvasRef.current.style.position = 'fixed';
            canvasRef.current.style.top = '0';
            canvasRef.current.style.left = '0';
            canvasRef.current.style.width = '100%';
            canvasRef.current.style.height = '100%';
            canvasRef.current.style.zIndex = '-1';
            canvasRef.current.style.pointerEvents = 'none'; // Permet de cliquer à travers le canvas

            // Ajouter le canvas de rendu Three.js
            canvasRef.current.appendChild(rendererRef.current.domElement);

            // Ajouter l'indicateur de FPS
            if (statsRef.current) {
                document.body.appendChild(statsRef.current.dom);
            }

            // Nettoyer les écouteurs lors du démontage
            return () => {
                // Nettoyer l'indicateur de FPS
                if (statsRef.current && statsRef.current.dom && statsRef.current.dom.parentNode) {
                    statsRef.current.dom.parentNode.removeChild(statsRef.current.dom);
                }
            };
        }
    }, [loading]);

    return (
        <>
            {loading ? (
                <Loading progress={progress} />
            ) : (
                <>
                    <div ref={canvasRef} id="planet" />
                    <div className="content-container">
                        {children}
                    </div>
                </>
            )}
        </>
    );
}
