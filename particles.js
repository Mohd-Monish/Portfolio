
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';

// Optimization
const isMobile = window.innerWidth < 768;

const params = {
    // Very lightweight on mobile for stability
    numParticles: isMobile ? 4_000 : 60_000,
    numThreads: 100,
    particleSize: isMobile ? 12.0 : 6.0,
    flowSpeed: 0.02,
    minY: -10.0,
    maxY: 10.0,
    neckRadius: 4.0,
    flare: 3.0,
    twistTurns: 0.1,
    goldHue: 0.12, // Goldish
};
params.particlesPerThread = Math.floor(params.numParticles / params.numThreads);
params.numParticles = params.numThreads * params.particlesPerThread;

let camera, scene, renderer, composer, controls, bloomPass;
let particles;
const clock = new THREE.Clock();

const canvas = document.getElementById('c');

// Mouse Interaction
const mouse = new THREE.Vector2(0, 0);
const targetMouse = new THREE.Vector2(0, 0);
window.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

function init() {
    if (!canvas) return;

    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: "high-performance" // Hint for better GPU usage
    });

    // Cap DPR at 1 for mobile to save battery/perf, 2 for desktop
    renderer.setPixelRatio(isMobile ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.set(0, 0, 15);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enabled = false;

    if (!isMobile) {
        composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        // Bloom for the "Light Up" effect
        bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.5, 0.4, 0.85);
        composer.addPass(bloomPass);
    }

    // Particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(params.numParticles * 3);
    const randoms = new Float32Array(params.numParticles * 3);

    for (let i = 0; i < params.numParticles; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;

        randoms[i * 3] = Math.random();     // Speed variation
        randoms[i * 3 + 1] = Math.random();   // Phase
        randoms[i * 3 + 2] = Math.random();   // Size variation
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));

    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0.0 },
            uMouse: { value: new THREE.Vector2(0, 0) },
            uPulseTime: { value: -100.0 }, // Last pulse time
            uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
        },
        vertexShader: `
            uniform float uTime;
            uniform vec2 uMouse;
            uniform float uPulseTime;
            attribute vec3 aRandom;
            varying float vAlpha;
            
            void main() {
                vec3 pos = position;
                
                // Idle Float Movement
                pos.y += sin(uTime * 0.5 + aRandom.y * 10.0) * 0.1;
                pos.x += cos(uTime * 0.3 + aRandom.x * 10.0) * 0.1;

                // Mouse Repulsion
                float distMouse = distance(pos.xy, uMouse * 10.0);
                if (distMouse < 4.0) {
                    vec2 dir = normalize(pos.xy - uMouse * 10.0);
                    pos.xy += dir * (4.0 - distMouse) * 0.2;
                }
                
                // PULSE EFFECT (Global Explosion)
                float pulseAge = uTime - uPulseTime;
                if(pulseAge > 0.0 && pulseAge < 2.0) {
                    float wave = smoothstep(0.0, 1.0, pulseAge) * (1.0 - smoothstep(1.0, 2.0, pulseAge));
                    // Expand outwards
                    pos *= (1.0 + wave * 0.5);
                }

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_PointSize = (4.0 * aRandom.z + 2.0) * (5.0 / -mvPosition.z);
                
                // Pulse size increase
                if(pulseAge > 0.0 && pulseAge < 2.0) {
                     float wave = smoothstep(0.0, 0.2, pulseAge) * (1.0 - smoothstep(1.5, 2.0, pulseAge));
                     gl_PointSize *= (1.0 + wave * 3.0);
                }

                gl_Position = projectionMatrix * mvPosition;
                
                vAlpha = 0.4 + 0.3 * sin(uTime + aRandom.y * 20.0);
            }
          `,
        fragmentShader: `
            uniform float uTime;
            uniform float uPulseTime;
            varying float vAlpha;
            
            void main() {
                vec2 uv = gl_PointCoord * 2.0 - 1.0;
                float dist = length(uv);
                if(dist > 1.0) discard;
                
                // Base Color: Gold/White
                vec3 color = vec3(1.0, 0.9, 0.6);
                
                // PULSE COLOR: Turning to bright blue/white energy
                float pulseAge = uTime - uPulseTime;
                if(pulseAge > 0.0 && pulseAge < 2.5) {
                    float wave = smoothstep(0.0, 1.0, pulseAge);
                    color = mix(color, vec3(0.4, 0.8, 1.0), wave); // Blue shift
                    color += vec3(1.0) * wave * 2.0; // HDR Brightness
                }

                float alpha = vAlpha * (1.0 - dist);
                gl_FragColor = vec4(color, alpha);
            }
          `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // --- ENERGIZE BUTTON LOGIC ---
    const btn = document.getElementById('energizeBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            particleMaterial.uniforms.uPulseTime.value = clock.getElapsedTime();

            // Temporarily boost bloom
            if (bloomPass) {
                const originalStrength = bloomPass.strength;
                bloomPass.strength = 3.0; // BLINDING LIGHT

                // Tween back to normal
                let fade = 1.0;
                const restoreBloom = () => {
                    fade -= 0.02;
                    if (fade > 0) {
                        bloomPass.strength = originalStrength + (3.0 * fade);
                        requestAnimationFrame(restoreBloom);
                    } else {
                        bloomPass.strength = originalStrength;
                    }
                };
                restoreBloom();
            }
        });
    }
}

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    mouse.lerp(targetMouse, 0.05);

    if (particles) {
        particles.material.uniforms.uTime.value = t;
        particles.material.uniforms.uMouse.value = mouse;
    }

    if (isMobile || !composer) {
        // Bypass expensive composer on mobile or if failed to init
        renderer.render(scene, camera);
    } else {
        composer.render();
    }
}

init();
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    if (composer) {
        composer.setSize(window.innerWidth, window.innerHeight);
    }
});
animate();
