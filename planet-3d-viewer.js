import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export class Planet3DViewer {
    constructor(container, planetId, planetName, modelPath) {
        this.container = container;
        this.planetId = planetId;
        this.planetName = planetName;
        this.modelPath = modelPath;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
    }

    async init() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a2a);

        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(2, 2, 4);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.container.innerHTML = '';
        this.container.appendChild(this.renderer.domElement);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.autoRotate = true;

        const ambientLight = new THREE.AmbientLight(0x404060);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(3, 5, 2);
        this.scene.add(directionalLight);
        
        const backLight = new THREE.PointLight(0x4466cc, 0.5);
        backLight.position.set(-2, 1, -3);
        this.scene.add(backLight);

        this.createPlanetSphere();

        this.tryLoadGLB();

        this.animate();
        
        window.addEventListener('resize', () => this.onResize());
    }

    createPlanetSphere() {
        const colors = {
            mars: 0xff4444,
            jupiter: 0xd4a574,
            saturn: 0xe8d4a8,
            earth: 0x4488ff,
            venus: 0xe8b856,
            mercury: 0xaaaaaa
        };
        
        const color = colors[this.planetId] || 0x88aaff;
        
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        const material = new THREE.MeshStandardMaterial({ 
            color: color,
            metalness: 0.2,
            roughness: 0.5,
            emissive: 0x111122,
            emissiveIntensity: 0.2
        });
        
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.castShadow = true;
        this.sphere.receiveShadow = true;
        this.scene.add(this.sphere);
        
        console.log('✅ Сфера создана для', this.planetName);
    }

    tryLoadGLB() {
        if (!this.modelPath) {
            console.log('Нет пути к GLB');
            return;
        }
        
        const loader = new GLTFLoader();
        loader.load(this.modelPath, 
            (gltf) => {
                if (this.sphere) {
                    this.scene.remove(this.sphere);
                }
                const model = gltf.scene;
                this.scene.add(model);
                console.log('✅ GLB модель загружена!');
            },
            (progress) => {
                console.log('Загрузка:', Math.round(progress.loaded / progress.total * 100), '%');
            },
            (error) => {
                console.log('❌ GLB не загрузился, оставляем сферу');
                console.log('Ошибка:', error.message);
            }
        );
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    onResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    zoomIn() { this.camera.position.z *= 0.85; }
    zoomOut() { this.camera.position.z *= 1.15; }
    toggleAutoRotate() { this.controls.autoRotate = !this.controls.autoRotate; }
    resetView() { this.camera.position.set(2, 2, 4); this.controls.target.set(0, 0, 0); }
    dispose() { this.renderer?.dispose(); }
}