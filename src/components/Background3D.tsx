import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Background3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 6;

    // Particles
    const particleCount = 480;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 13;

      const t = Math.random();
      if (t < 0.42) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.73; colors[i * 3 + 2] = 0.16;
      } else if (t < 0.72) {
        colors[i * 3] = 0; colors[i * 3 + 1] = 1; colors[i * 3 + 2] = 0.88;
      } else if (t < 0.88) {
        colors[i * 3] = 0.69; colors[i * 3 + 1] = 0.38; colors[i * 3 + 2] = 1;
      } else {
        colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1;
      }
      sizes[i] = Math.random() * 2.2 + 0.35;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      vertexColors: true,
      transparent: true,
      uniforms: {
        time: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vC;
        uniform float time;
        void main() {
          vC = color;
          vec3 p = position;
          p.y += sin(time * 0.2 + position.x * 0.28) * 0.46;
          p.x += cos(time * 0.16 + position.z * 0.22) * 0.26;
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_PointSize = size * (280.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vC;
        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;
          gl_FragColor = vec4(vC, smoothstep(0.5, 0.05, d) * 0.55);
        }
      `,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Orbs
    const createOrb = (r: number, x: number, y: number, z: number, c1: string, c2: string) => {
      const orbMaterial = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: {
          time: { value: 0 },
          c1: { value: new THREE.Color(c1) },
          c2: { value: new THREE.Color(c2) },
        },
        vertexShader: `
          varying vec3 vN;
          void main() {
            vN = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vN;
          uniform vec3 c1;
          uniform vec3 c2;
          uniform float time;
          void main() {
            float f = dot(vN, vec3(0,0,1));
            float rim = 1.0 - f;
            vec3 c = mix(c1, c2, rim * rim);
            gl_FragColor = vec4(c, rim * rim * (0.27 + 0.13 * sin(time * 1.1)));
          }
        `,
      });
      const orbMesh = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), orbMaterial);
      orbMesh.position.set(x, y, z);
      scene.add(orbMesh);
      return orbMesh;
    };

    const orb1 = createOrb(2.2, -5, 3, -3, '#FFB928', '#FF4500');
    const orb2 = createOrb(1.8, 5, -2, -4, '#00FFE0', '#0060FF');
    const orb3 = createOrb(1.3, 1, 5, -5, '#B060FF', '#FFB928');

    const grid = new THREE.GridHelper(50, 50, 0xFFB928, 0x060A0E);
    grid.position.y = -8;
    // @ts-ignore
    grid.material.opacity = 0.062;
    // @ts-ignore
    grid.material.transparent = true;
    scene.add(grid);

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.006;
      material.uniforms.time.value = time;
      [orb1, orb2, orb3].forEach(o => {
        // @ts-ignore
        o.material.uniforms.time.value = time;
      });

      orb1.position.y = 3 + Math.sin(time * 0.33) * 0.65;
      orb2.position.x = 5 + Math.cos(time * 0.26) * 0.46;
      camera.position.x = Math.sin(time * 0.037) * 0.3;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
};

export default Background3D;
