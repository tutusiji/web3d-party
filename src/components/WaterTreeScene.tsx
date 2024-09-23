import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const WaterTreeScene: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Create color palette
        const Colors = {
            cyan: 0x248079,
            brown: 0xA98F78,
            brownDark: 0x9A6169,
            green: 0x65BB61,
            greenLight: 0xABD66A,
            blue: 0x6BC6FF
        };

        const scene = new THREE.Scene();
        const h = window.innerHeight - 100;
        const w = window.innerWidth - 50;
        const aspectRatio = w / h;
        const fieldOfView = 25;
        const nearPlane = .1;
        const farPlane = 1000;
        const camera = new THREE.PerspectiveCamera(
            fieldOfView,
            aspectRatio,
            nearPlane,
            farPlane
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        const dpi = window.devicePixelRatio;
        renderer.setSize(w * dpi, h * dpi);
        mountRef.current.appendChild(renderer.domElement);
        mountRef.current.style.width = `${w}px`;
        mountRef.current.style.height = `${h}px`;

        // 创建 OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 1;
        controls.maxDistance = 50;
        controls.maxPolarAngle = Math.PI / 2;

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        camera.position.set(-5, 6, 8);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // Lights
        const light = new THREE.AmbientLight(0xffffff, .5);
        scene.add(light);

        const shadowLight = new THREE.DirectionalLight(0xffffff, .5);
        shadowLight.position.set(200, 200, 200);
        shadowLight.castShadow = true;
        scene.add(shadowLight);

        const backLight = new THREE.DirectionalLight(0xffffff, .2);
        backLight.position.set(-100, 200, 50);
        backLight.castShadow = true;
        scene.add(backLight);

        // Ground
        const geometry_left = new THREE.BoxGeometry(2, .2, 2);
        const material_grass = new THREE.MeshLambertMaterial({ color: Colors.greenLight });
        const ground_left = new THREE.Mesh(geometry_left, material_grass);
        ground_left.position.set(-1, 0.1, 0);
        scene.add(ground_left);
        customizeShadow(ground_left, .25);

        // River
        const geometry_river = new THREE.BoxGeometry(1, .1, 2);
        const material_river = new THREE.MeshLambertMaterial({ color: Colors.blue });
        const river = new THREE.Mesh(geometry_river, material_river);
        river.position.set(.5, .1, 0);
        scene.add(river);
        customizeShadow(river, .08);

        // River bed
        const geometry_bed = new THREE.BoxGeometry(1, .05, 2);
        const bed = new THREE.Mesh(geometry_bed, material_grass);
        bed.position.set(.5, .025, 0);
        scene.add(bed);

        // Right ground
        const geometry_right = new THREE.BoxGeometry(1, .2, 2);
        const ground_right = new THREE.Mesh(geometry_right, material_grass);
        ground_right.position.set(1.5, 0.1, 0);
        scene.add(ground_right);
        customizeShadow(ground_right, .25);

        // Tree function
        function tree(x: number, z: number) {
            const material_trunk = new THREE.MeshLambertMaterial({ color: Colors.brownDark });
            const geometry_trunk = new THREE.BoxGeometry(.15, .15, .15);
            const trunk = new THREE.Mesh(geometry_trunk, material_trunk);
            trunk.position.set(x, .275, z);
            trunk.castShadow = true;
            trunk.receiveShadow = true;
            scene.add(trunk);

            const geometry_leaves = new THREE.BoxGeometry(.25, .4, .25);
            const material_leaves = new THREE.MeshLambertMaterial({ color: Colors.green });
            const leaves = new THREE.Mesh(geometry_leaves, material_leaves);
            leaves.position.set(x, .2 + .15 + .4 / 2, z);
            leaves.castShadow = true;
            customizeShadow(leaves, .25);
            scene.add(leaves);
        }

        // Add trees
        tree(-1.75, -.85); tree(-1.75, -.15); tree(-1.5, -.5); tree(-1.5, .4);
        tree(-1.25, -.85); tree(-1.25, .75); tree(-.75, -.85); tree(-.75, -.25);
        tree(-.25, -.85); tree(1.25, -.85); tree(1.25, .75); tree(1.5, -.5);
        tree(1.75, -.85); tree(1.75, .35);

        // Shadow customization function
        function customizeShadow(mesh: THREE.Mesh, opacity: number) {
            const material_shadow = new THREE.ShadowMaterial({ opacity: opacity });
            const mesh_shadow = new THREE.Mesh(mesh.geometry, material_shadow);
            mesh_shadow.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
            mesh_shadow.receiveShadow = true;
            scene.add(mesh_shadow);
        }

        // Bridge
        const material_wood = new THREE.MeshLambertMaterial({ color: Colors.brown });
        for (let i = 0; i < 6; i++) {
            const geometry_block = new THREE.BoxGeometry(.15, .02, .4);
            const block = new THREE.Mesh(geometry_block, material_wood);
            block.position.set(0 + .2 * i, .21, .2);
            block.castShadow = true;
            block.receiveShadow = true;
            scene.add(block);
        }

        // Bridge rails
        const geometry_rail_v = new THREE.BoxGeometry(.04, .3, .04);
        const rail_positions = [
            { x: -.1, z: .4 }, { x: 1.1, z: .4 }, { x: -.1, z: 0 }, { x: 1.1, z: 0 }
        ];
        rail_positions.forEach(pos => {
            const rail = new THREE.Mesh(geometry_rail_v, material_wood);
            rail.position.set(pos.x, .35, pos.z);
            rail.castShadow = true;
            customizeShadow(rail, .2);
            scene.add(rail);
        });

        const geometry_rail_h = new THREE.BoxGeometry(1.2, .04, .04);
        [0, .4].forEach(z => {
            const rail_h = new THREE.Mesh(geometry_rail_h, material_wood);
            rail_h.position.set(0.5, .42, z);
            rail_h.castShadow = true;
            customizeShadow(rail_h, .2);
            scene.add(rail_h);
        });

        // Water drops
        class Drop {
            geometry: THREE.BoxGeometry;
            drop: THREE.Mesh;
            speed: number;
            lifespan: number;

            constructor() {
                this.geometry = new THREE.BoxGeometry(.1, .1, .1);
                this.drop = new THREE.Mesh(this.geometry, material_river);
                this.drop.position.set(Math.random() * .8 + .1, 0.1, 1 + (Math.random() - .5) * .1);
                scene.add(this.drop);
                this.speed = 0;
                this.lifespan = (Math.random() * 50) + 50;
            }

            update() {
                this.speed += .0007;
                this.lifespan--;
                this.drop.position.x += (.5 - this.drop.position.x) / 70;
                this.drop.position.y -= this.speed;
            }
        }

        const drops: Drop[] = [];

        let count = 0;
        const render = function () {
            requestAnimationFrame(render);
            if (count % 3 == 0) {
                for (let i = 0; i < 5; i++) {
                    drops.push(new Drop());
                }
            }
            count++;
            for (let i = 0; i < drops.length; i++) {
                drops[i].update();
                if (drops[i].lifespan < 0) {
                    scene.remove(drops[i].drop);
                    drops.splice(i, 1);
                }
            }
            controls.update(); // 更新控制器
            renderer.render(scene, camera);
        };
        render();

        // Handle window resize
        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            renderer.setSize(width * dpi, height * dpi);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            if (mountRef.current) {
                mountRef.current.style.width = `${width}px`;
                mountRef.current.style.height = `${height}px`;
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            controls.dispose(); // 清理控制器
        };
    }, []);

    return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
};

export default WaterTreeScene;