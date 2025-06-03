import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const WaterTreeScene: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const [isConeTrees, setIsConeTrees] = useState(false);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const treeObjectsRef = useRef<THREE.Object3D[]>([]);

    // 切换树的类型
    const toggleTreeType = () => {
        setIsConeTrees(prev => !prev);
    };

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
        sceneRef.current = scene;
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

        // 材质定义
        const material_trunk = new THREE.MeshLambertMaterial({ color: Colors.brownDark });
        const material_leaves = new THREE.MeshLambertMaterial({ color: Colors.green });

        // 立方体树函数
        function cubeTree(x: number, z: number) {
            const geometry_trunk = new THREE.BoxGeometry(.15, .15, .15);
            const trunk = new THREE.Mesh(geometry_trunk, material_trunk);
            trunk.position.set(x, .275, z);
            trunk.castShadow = true;
            trunk.receiveShadow = true;
            scene.add(trunk);
            treeObjectsRef.current.push(trunk);

            const geometry_leaves = new THREE.BoxGeometry(.25, .4, .25);
            const leaves = new THREE.Mesh(geometry_leaves, material_leaves);
            leaves.position.set(x, .2 + .15 + .4 / 2, z);
            leaves.castShadow = true;
            customizeShadow(leaves, .25);
            scene.add(leaves);
            treeObjectsRef.current.push(leaves);
        }

        // 圆锥体树函数
        function coneTree(x: number, z: number) {
            const geometry_trunk = new THREE.CylinderGeometry(.07, .07, .2, 8);
            const trunk = new THREE.Mesh(geometry_trunk, material_trunk);
            trunk.position.set(x, .2, z);
            trunk.castShadow = true;
            trunk.receiveShadow = true;
            scene.add(trunk);
            treeObjectsRef.current.push(trunk);

            const geometry_leaves = new THREE.ConeGeometry(.2, .5, 8);
            const leaves = new THREE.Mesh(geometry_leaves, material_leaves);
            leaves.position.set(x, .45, z);
            leaves.castShadow = true;
            customizeShadow(leaves, .25);
            scene.add(leaves);
            treeObjectsRef.current.push(leaves);
        }

        // 创建树的函数
        function createTrees(useConeTrees: boolean) {
            // 清除现有的树
            treeObjectsRef.current.forEach(obj => {
                scene.remove(obj);
            });
            treeObjectsRef.current = [];

            // 树的位置
            const treePositions = [
                {x: -1.75, z: -.85}, {x: -1.75, z: -.15}, {x: -1.5, z: -.5}, {x: -1.5, z: .4},
                {x: -1.25, z: -.85}, {x: -1.25, z: .75}, {x: -.75, z: -.85}, {x: -.75, z: -.25},
                {x: -.25, z: -.85}, {x: 1.25, z: -.85}, {x: 1.25, z: .75}, {x: 1.5, z: -.5},
                {x: 1.75, z: -.85}, {x: 1.75, z: .35}
            ];

            // 根据类型创建树
            const treeFunc = useConeTrees ? coneTree : cubeTree;
            treePositions.forEach(pos => treeFunc(pos.x, pos.z));
        }

        // 初始创建树
        createTrees(isConeTrees);

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

        // 创建共享几何体用于水滴
        const dropGeometry = new THREE.BoxGeometry(.1, .1, .1);
        
        // 水滴类定义
        class Drop {
            drop: THREE.Mesh;
            speed!: number;
            lifespan!: number;
            active: boolean;

            constructor() {
                this.drop = new THREE.Mesh(dropGeometry, material_river);
                this.reset();
                this.active = false; // 初始状态为非活跃
            }

            reset() {
                this.drop.position.set(
                    Math.random() * .8 + .1, 
                    0.1, 
                    1 + (Math.random() - .5) * .1
                );
                this.speed = 0;
                this.lifespan = (Math.random() * 50) + 50;
                return this;
            }

            update() {
                this.speed += .0007;
                this.lifespan--;
                this.drop.position.x += (.5 - this.drop.position.x) / 70;
                this.drop.position.y -= this.speed;
                return this;
            }

            activate() {
                if (!this.active) {
                    scene.add(this.drop);
                    this.active = true;
                }
                return this;
            }

            deactivate() {
                if (this.active) {
                    scene.remove(this.drop);
                    this.active = false;
                }
                return this;
            }
        }

        // 创建对象池
        const MAX_DROPS = 100; // 最大水滴数量限制
        const dropPool: Drop[] = [];
        const activeDrops: Drop[] = [];
        
        // 初始化对象池
        for (let i = 0; i < MAX_DROPS; i++) {
            dropPool.push(new Drop());
        }

        // 渲染循环
        let count = 0;
        const render = function () {
            requestAnimationFrame(render);
            
            // 每3帧创建新水滴
            if (count % 3 === 0 && activeDrops.length < MAX_DROPS) {
                // 限制同时活跃的水滴数量
                const dropsToCreate = Math.min(5, MAX_DROPS - activeDrops.length);
                
                for (let i = 0; i < dropsToCreate; i++) {
                    if (dropPool.length > 0) {
                        const drop = dropPool.pop()!;
                        drop.reset().activate();
                        activeDrops.push(drop);
                    }
                }
            }
            
            // 更新和回收水滴
            for (let i = activeDrops.length - 1; i >= 0; i--) {
                activeDrops[i].update();
                
                if (activeDrops[i].lifespan < 0) {
                    activeDrops[i].deactivate();
                    dropPool.push(activeDrops[i]);
                    activeDrops.splice(i, 1);
                }
            }
            
            count++;
            controls.update(); // 更新控制器
            renderer.render(scene, camera);
        };
        
        render();

        // 处理窗口大小变化
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

        // 清理函数
        return () => {
            window.removeEventListener('resize', handleResize);
            
            // 清理所有水滴
            [...activeDrops, ...dropPool].forEach(drop => {
                if (drop.active) {
                    scene.remove(drop.drop);
                }
            });
            
            // 释放几何体和材质
            dropGeometry.dispose();
            material_river.dispose();
            material_grass.dispose();
            material_wood.dispose();
            material_trunk.dispose();
            material_leaves.dispose();
            
            // 清理渲染器和控制器
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            controls.dispose();
        };
    }, []);

    // 当树类型状态变化时，更新树
    useEffect(() => {
        if (sceneRef.current) {
            const scene = sceneRef.current;
            // 获取当前场景中的所有材质和颜色信息
            const Colors = {
                cyan: 0x248079,
                brown: 0xA98F78,
                brownDark: 0x9A6169,
                green: 0x65BB61,
                greenLight: 0xABD66A,
                blue: 0x6BC6FF
            };

            const material_trunk = new THREE.MeshLambertMaterial({ color: Colors.brownDark });
            const material_leaves = new THREE.MeshLambertMaterial({ color: Colors.green });

            // 清除现有的树
            treeObjectsRef.current.forEach(obj => {
                scene.remove(obj);
            });
            treeObjectsRef.current = [];

            // 树的位置
            const treePositions = [
                {x: -1.75, z: -.85}, {x: -1.75, z: -.15}, {x: -1.5, z: -.5}, {x: -1.5, z: .4},
                {x: -1.25, z: -.85}, {x: -1.25, z: .75}, {x: -.75, z: -.85}, {x: -.75, z: -.25},
                {x: -.25, z: -.85}, {x: 1.25, z: -.85}, {x: 1.25, z: .75}, {x: 1.5, z: -.5},
                {x: 1.75, z: -.85}, {x: 1.75, z: .35}
            ];

            // 根据当前状态选择树函数
            if (isConeTrees) {
                // 圆锥体树
                treePositions.forEach(pos => {
                    const geometry_trunk = new THREE.CylinderGeometry(.07, .07, .2, 8);
                    const trunk = new THREE.Mesh(geometry_trunk, material_trunk);
                    trunk.position.set(pos.x, .2, pos.z);
                    trunk.castShadow = true;
                    trunk.receiveShadow = true;
                    scene.add(trunk);
                    treeObjectsRef.current.push(trunk);

                    const geometry_leaves = new THREE.ConeGeometry(.2, .5, 8);
                    const leaves = new THREE.Mesh(geometry_leaves, material_leaves);
                    leaves.position.set(pos.x, .45, pos.z);
                    leaves.castShadow = true;
                    // 添加阴影
                    const material_shadow = new THREE.ShadowMaterial({ opacity: .25 });
                    const mesh_shadow = new THREE.Mesh(geometry_leaves, material_shadow);
                    mesh_shadow.position.set(pos.x, .45, pos.z);
                    mesh_shadow.receiveShadow = true;
                    scene.add(mesh_shadow);
                    treeObjectsRef.current.push(mesh_shadow);
                    
                    scene.add(leaves);
                    treeObjectsRef.current.push(leaves);
                });
            } else {
                // 立方体树
                treePositions.forEach(pos => {
                    const geometry_trunk = new THREE.BoxGeometry(.15, .15, .15);
                    const trunk = new THREE.Mesh(geometry_trunk, material_trunk);
                    trunk.position.set(pos.x, .275, pos.z);
                    trunk.castShadow = true;
                    trunk.receiveShadow = true;
                    scene.add(trunk);
                    treeObjectsRef.current.push(trunk);

                    const geometry_leaves = new THREE.BoxGeometry(.25, .4, .25);
                    const leaves = new THREE.Mesh(geometry_leaves, material_leaves);
                    leaves.position.set(pos.x, .2 + .15 + .4 / 2, pos.z);
                    leaves.castShadow = true;
                    // 添加阴影
                    const material_shadow = new THREE.ShadowMaterial({ opacity: .25 });
                    const mesh_shadow = new THREE.Mesh(geometry_leaves, material_shadow);
                    mesh_shadow.position.set(pos.x, .2 + .15 + .4 / 2, pos.z);
                    mesh_shadow.receiveShadow = true;
                    scene.add(mesh_shadow);
                    treeObjectsRef.current.push(mesh_shadow);
                    
                    scene.add(leaves);
                    treeObjectsRef.current.push(leaves);
                });
            }
        }
    }, [isConeTrees]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
            <button 
                onClick={toggleTreeType}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 15px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    zIndex: 1000,
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
                }}
            >
                {isConeTrees ? '切换为立方体树' : '切换为圆锥体树'}
            </button>
        </div>
    );
};

export default WaterTreeScene;