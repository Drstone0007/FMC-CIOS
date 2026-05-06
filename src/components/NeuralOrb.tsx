import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface NeuralOrbProps {
  isAnalyzing: boolean;
  swarmActive: number; // 0 to 1
}

const NeuralOrb: React.FC<NeuralOrbProps> = ({ isAnalyzing, swarmActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(240, 166);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 240 / 166, 0.1, 100);
    camera.position.z = 3.5;

    // Center Orb
    const orbMaterial = new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        time: { value: 0 },
        ph: { value: isAnalyzing ? 1 : 0 },
        sw: { value: swarmActive },
      },
      vertexShader: `
        varying vec3 vN;
        uniform float time;
        void main() {
          vN = normalize(normalMatrix * normal);
          vec3 p = position;
          p += normal * (sin(position.x * 4.0 + time * 2.0) * 0.037 + sin(position.y * 3.0 + time * 1.5) * 0.027);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vN;
        uniform float time;
        uniform float ph;
        uniform float sw;
        void main() {
          float f = dot(vN, vec3(0,0,1));
          float rim = 1.0 - f;
          vec3 gold = vec3(1.0, 0.73, 0.16);
          vec3 cyan = vec3(0.0, 1.0, 0.88);
          vec3 pur = vec3(0.69, 0.38, 1.0);
          vec3 c = mix(gold, cyan, sin(time * 0.27 + ph) * 0.5 + 0.5);
          c = mix(c, pur, sw * 0.54);
          gl_FragColor = vec4(c, f * 0.83 + rim * rim * 0.37);
        }
      `,
    });

    const orb = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), orbMaterial);
    scene.add(orb);

    // Atmosphere
    const auraMaterial = new THREE.ShaderMaterial({
      transparent: true,
      side: THREE.BackSide,
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vN;
        void main() {
          vN = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vN;
        uniform float time;
        void main() {
          float rim = 1.0 - dot(vN, vec3(0,0,-1));
          vec3 c = mix(vec3(1.0, 0.72, 0.1), vec3(0.69, 0.38, 1.0), sin(time * 0.43) * 0.5 + 0.5);
          gl_FragColor = vec4(c, pow(rim, 2.4) * 0.34);
        }
      `,
    });
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 32), auraMaterial));

    // Rings
    const createRing = (r: number, tube: number, rx: number, ry: number, col: number) => {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(r, tube, 8, 64),
        new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.3 })
      );
      ring.rotation.x = rx;
      ring.rotation.y = ry;
      scene.add(ring);
      return ring;
    };

    const rng1 = createRing(1.5, 0.012, Math.PI / 2, 0, 0xFFB928);
    const rng2 = createRing(1.7, 0.010, Math.PI / 4, Math.PI / 3, 0x00FFE0);
    const rng3 = createRing(1.9, 0.008, Math.PI / 6, Math.PI / 1.5, 0xFF4560);
    const rng4 = createRing(2.1, 0.007, Math.PI / 3, Math.PI / 4, 0xB060FF);

    const ptL = new THREE.PointLight(0xFFB928, 2, 10);
    ptL.position.set(2, 2, 3);
    scene.add(ptL);
    scene.add(new THREE.AmbientLight(0x001020, 1));

    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.012;
      orbMaterial.uniforms.time.value = time;
      orbMaterial.uniforms.ph.value += ( (isAnalyzing ? 1 : 0) - orbMaterial.uniforms.ph.value ) * 0.05;
      orbMaterial.uniforms.sw.value += ( swarmActive - orbMaterial.uniforms.sw.value ) * 0.05;
      auraMaterial.uniforms.time.value = time;

      rng1.rotation.z = time * 0.57;
      rng2.rotation.z = -time * 0.37;
      rng2.rotation.x = Math.PI / 4 + Math.sin(time * 0.27) * 0.18;
      rng3.rotation.y = time * 0.47;
      rng4.rotation.z = time * 0.21;
      rng4.rotation.x = time * 0.14;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      renderer.dispose();
    };
  }, [isAnalyzing, swarmActive]);

  return <canvas ref={canvasRef} className="block w-full h-[166px]" />;
};

export default NeuralOrb;
