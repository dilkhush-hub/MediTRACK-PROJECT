import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";

const canvas = document.getElementById("hospital3DCanvas");
const status = document.getElementById("hospital3DStatus");
const resetButton = document.getElementById("hospital3DReset");
const rotateButton = document.getElementById("hospital3DRotate");

if (canvas && status && resetButton && rotateButton) {
    try {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f5ff);
        const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
        camera.position.set(10, 7, 11);
        camera.lookAt(0, 1.4, 0);

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        scene.add(new THREE.HemisphereLight(0xffffff, 0x9aabc9, 2.1));
        const sunlight = new THREE.DirectionalLight(0xffffff, 2.4);
        sunlight.position.set(7, 12, 8);
        sunlight.castShadow = true;
        sunlight.shadow.mapSize.set(1024, 1024);
        scene.add(sunlight);
        const fillLight = new THREE.PointLight(0x8aaaff, 45, 30);
        fillLight.position.set(-7, 5, -5);
        scene.add(fillLight);

        const hospital = new THREE.Group();
        scene.add(hospital);
        const mat = {
            wall: new THREE.MeshStandardMaterial({ color: 0xf7f9ff, roughness: 0.72 }),
            side: new THREE.MeshStandardMaterial({ color: 0xdce6f8, roughness: 0.8 }),
            blue: new THREE.MeshStandardMaterial({ color: 0x5265e8, roughness: 0.48 }),
            dark: new THREE.MeshStandardMaterial({ color: 0x263b82, roughness: 0.55 }),
            glass: new THREE.MeshStandardMaterial({ color: 0x8fc7f4, metalness: 0.18, roughness: 0.22, emissive: 0x17395d, emissiveIntensity: 0.16 }),
            white: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 }),
            red: new THREE.MeshStandardMaterial({ color: 0xe65368, roughness: 0.45 }),
            ground: new THREE.MeshStandardMaterial({ color: 0xdce7f8, roughness: 1 })
        };
        function box(parent, w, h, d, material, x, y, z) {
            const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
            mesh.position.set(x, y, z);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            parent.add(mesh);
            return mesh;
        }

        const platform = new THREE.Mesh(new THREE.CylinderGeometry(5.2, 5.2, 0.28, 64), mat.white);
        platform.position.y = -0.12; platform.receiveShadow = true; hospital.add(platform);
        const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), mat.ground);
        ground.rotation.x = -Math.PI / 2; ground.position.y = -0.28; ground.receiveShadow = true; scene.add(ground);

        // Main building, roof and side wings
        box(hospital, 5.8, 3.6, 3.2, mat.wall, 0, 1.75, 0);
        box(hospital, 6.0, 0.28, 3.38, mat.blue, 0, 3.62, 0);
        box(hospital, 3.4, 1.1, 2.4, mat.side, 0, 4.28, -0.15);
        box(hospital, 3.55, 0.18, 2.55, mat.dark, 0, 4.86, -0.15);
        box(hospital, 1.65, 2.5, 2.8, mat.side, -3.55, 1.2, 0.05);
        box(hospital, 1.65, 2.5, 2.8, mat.side, 3.55, 1.2, 0.05);
        box(hospital, 1.75, 0.2, 2.95, mat.blue, -3.55, 2.52, 0.05);
        box(hospital, 1.75, 0.2, 2.95, mat.blue, 3.55, 2.52, 0.05);

        // Front windows and frames
        for (let row = 0; row < 2; row++) {
            for (let col = 0; col < 4; col++) {
                const x = -2.05 + col * 1.37, y = 2.45 - row * 1.28;
                box(hospital, 0.78, 0.72, 0.07, mat.glass, x, y, 1.64);
                box(hospital, 0.08, 0.76, 0.09, mat.white, x, y, 1.69);
                box(hospital, 0.82, 0.07, 0.09, mat.white, x, y, 1.69);
            }
        }
        for (const x of [-3.55, 3.55]) {
            for (let row = 0; row < 2; row++) box(hospital, 0.72, 0.72, 0.07, mat.glass, x, 1.92 - row * 1.05, 1.48);
        }

        // Entrance, steps and canopy
        box(hospital, 1.05, 1.75, 0.12, mat.dark, 0, 0.88, 1.67);
        box(hospital, 0.42, 1.2, 0.05, mat.glass, -0.27, 0.65, 1.75);
        box(hospital, 0.42, 1.2, 0.05, mat.glass, 0.27, 0.65, 1.75);
        box(hospital, 1.75, 0.18, 0.9, mat.blue, 0, 1.92, 2.05);
        box(hospital, 2.0, 0.18, 0.55, mat.side, 0, 0.12, 2.12);
        box(hospital, 2.3, 0.18, 0.7, mat.side, 0, -0.02, 2.35);

        // Medical cross and MediTrack sign
        box(hospital, 0.24, 0.9, 0.12, mat.red, 0, 4.25, 1.08);
        box(hospital, 0.78, 0.24, 0.12, mat.red, 0, 4.25, 1.08);
        const signCanvas = document.createElement("canvas");
        signCanvas.width = 512; signCanvas.height = 128;
        const ctx = signCanvas.getContext("2d");
        ctx.fillStyle = "#263b82"; ctx.fillRect(0, 0, 512, 128);
        ctx.fillStyle = "#fff"; ctx.font = "bold 54px Arial";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("MEDI TRACK", 256, 66);
        const signTexture = new THREE.CanvasTexture(signCanvas);
        signTexture.colorSpace = THREE.SRGBColorSpace;
        box(hospital, 2.5, 0.62, 0.12, mat.dark, 0, 3.28, 1.72);
        const sign = new THREE.Mesh(new THREE.PlaneGeometry(2.35, 0.52), new THREE.MeshStandardMaterial({ map: signTexture }));
        sign.position.set(0, 3.28, 1.79); hospital.add(sign);

        // Decorative trees and circular platform detail
        const trunk = new THREE.MeshStandardMaterial({ color: 0x8b6748 });
        const leaves = new THREE.MeshStandardMaterial({ color: 0x43a878, roughness: 0.9 });
        for (const [x, z] of [[-4.1, 2.8], [4.1, 2.8], [-4.5, -2.5], [4.5, -2.5]]) {
            box(hospital, 0.16, 0.8, 0.16, trunk, x, 0.35, z);
            const crown = new THREE.Mesh(new THREE.SphereGeometry(0.55, 18, 14), leaves);
            crown.position.set(x, 1.05, z); crown.castShadow = true; hospital.add(crown);
        }
        const ring = new THREE.Mesh(new THREE.TorusGeometry(4.65, 0.035, 8, 100), new THREE.MeshStandardMaterial({ color: 0x8298ef, metalness: 0.3, roughness: 0.4 }));
        ring.rotation.x = Math.PI / 2; ring.position.y = 0.03; hospital.add(ring);

        let autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let dragging = false, previousX = 0, previousY = 0;
        let targetX = 0, targetY = -0.35, zoom = 1;
        if (!autoRotate) {
            rotateButton.textContent = "Start rotation";
            rotateButton.setAttribute("aria-pressed", "false");
        }
        function resize() {
            const width = canvas.clientWidth || 600, height = canvas.clientHeight || 390;
            renderer.setSize(width, height, false);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(canvas);

        canvas.addEventListener("pointerdown", (event) => {
            dragging = true; previousX = event.clientX; previousY = event.clientY;
            canvas.setPointerCapture(event.pointerId);
        });
        canvas.addEventListener("pointermove", (event) => {
            if (!dragging) return;
            targetY += (event.clientX - previousX) * 0.008;
            targetX = THREE.MathUtils.clamp(targetX + (event.clientY - previousY) * 0.004, -0.35, 0.55);
            previousX = event.clientX; previousY = event.clientY;
        });
        const stopDrag = () => { dragging = false; };
        canvas.addEventListener("pointerup", stopDrag);
        canvas.addEventListener("pointercancel", stopDrag);
        canvas.addEventListener("wheel", (event) => {
            event.preventDefault();
            zoom = THREE.MathUtils.clamp(zoom - event.deltaY * 0.001, 0.78, 1.35);
        }, { passive: false });

        resetButton.addEventListener("click", () => { targetX = 0; targetY = -0.35; zoom = 1; });
        rotateButton.addEventListener("click", () => {
            autoRotate = !autoRotate;
            rotateButton.textContent = autoRotate ? "Pause rotation" : "Start rotation";
            rotateButton.setAttribute("aria-pressed", String(autoRotate));
        });
        status.textContent = "3D hospital ready — drag the model to explore.";

        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);
            const delta = Math.min(clock.getDelta(), 0.05);
            if (autoRotate && !dragging) targetY += delta * 0.22;
            hospital.rotation.y += (targetY - hospital.rotation.y) * 0.08;
            hospital.rotation.x += (targetX - hospital.rotation.x) * 0.08;
            hospital.scale.setScalar(zoom);
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener("beforeunload", () => { observer.disconnect(); renderer.dispose(); }, { once: true });
    } catch (error) {
        console.error("Three.js hospital model failed:", error);
        status.textContent = "3D model could not load. Please use a modern browser with WebGL enabled.";
    }
}
