import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { SystemId } from "@affiliate/heatpump-calculator";

interface HouseSceneProps {
  /** Heated area in m² — scales the house size. */
  areaSqm: number;
  /** Currently focused/best system — determines which heat pump unit to show. */
  system: SystemId;
  /** Annual savings in SEK — drives the warmth glow intensity. */
  savingsPerYear: number;
}

/**
 * A low-poly Swedish villa in a winter scene. The house reacts to the user's
 * inputs: size scales with area, the heat pump unit changes per system type,
 * and a warm interior glow intensifies with higher savings. Purely decorative /
 * engagement — loads lazily, never blocks prerendered content.
 */
export default function HouseScene({ areaSqm, system, savingsPerYear }: HouseSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    house: THREE.Group;
    warmLight: THREE.PointLight;
    heatPumpGroup: THREE.Group;
    particles: THREE.Points;
  } | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Initial setup — runs once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    // Soft twilight gradient — not too dark, inviting
    scene.background = new THREE.Color("#2d4a6d");
    scene.fog = new THREE.Fog("#2d4a6d", 12, 25);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7, 4.5, 8);
    camera.lookAt(0, 1.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting — the key to making it look good
    // 1. Soft blue ambient (moonlit feel)
    scene.add(new THREE.AmbientLight(0x8899cc, 0.6));
    
    // 2. Strong moonlight from above-left (key light)
    const moonLight = new THREE.DirectionalLight(0xddeeff, 1.2);
    moonLight.position.set(-4, 8, 4);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    moonLight.shadow.camera.near = 1;
    moonLight.shadow.camera.far = 20;
    moonLight.shadow.camera.left = -8;
    moonLight.shadow.camera.right = 8;
    moonLight.shadow.camera.top = 8;
    moonLight.shadow.camera.bottom = -8;
    scene.add(moonLight);
    
    // 3. Subtle fill light from the right (so shadows aren't pure black)
    const fillLight = new THREE.DirectionalLight(0x6688aa, 0.4);
    fillLight.position.set(5, 3, -2);
    scene.add(fillLight);
    
    // 4. Rim light from behind (separates house from background)
    const rimLight = new THREE.DirectionalLight(0x99bbdd, 0.5);
    rimLight.position.set(0, 5, -6);
    scene.add(rimLight);

    // Snowy ground — bright white, catches moonlight
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(15, 64),
      new THREE.MeshStandardMaterial({ 
        color: "#f0f5fa", 
        roughness: 0.85,
        metalness: 0.05,
      })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Snow mounds — softer, more natural
    for (let i = 0; i < 6; i++) {
      const mound = new THREE.Mesh(
        new THREE.SphereGeometry(0.4 + Math.random() * 0.5, 12, 8),
        new THREE.MeshStandardMaterial({ color: "#e8f0f5", roughness: 0.9 })
      );
      const angle = (i / 6) * Math.PI * 2 + Math.random() * 0.3;
      const dist = 4.5 + Math.random() * 2;
      mound.position.set(Math.cos(angle) * dist, 0.15, Math.sin(angle) * dist);
      mound.scale.y = 0.35;
      mound.receiveShadow = true;
      scene.add(mound);
    }

    // House group
    const house = new THREE.Group();

    // Walls — classic Swedish red (Falu rödfärg) with good roughness
    const wallMat = new THREE.MeshStandardMaterial({
      color: "#a63d2f",
      roughness: 0.75,
      metalness: 0.0,
    });
    const walls = new THREE.Mesh(new THREE.BoxGeometry(4, 2.2, 3.2), wallMat);
    walls.position.y = 1.1;
    walls.castShadow = true;
    walls.receiveShadow = true;
    house.add(walls);

    // White trim around the house (typical Swedish style)
    const trimMat = new THREE.MeshStandardMaterial({ color: "#f5f5f0", roughness: 0.6 });
    const cornerTrim = new THREE.Mesh(new THREE.BoxGeometry(0.15, 2.3, 0.15), trimMat);
    [[-2, 1.6], [2, 1.6], [-2, -1.6], [2, -1.6]].forEach(([x, z]) => {
      const trim = cornerTrim.clone();
      trim.position.set(x, 1.15, z);
      house.add(trim);
    });

    // Windows — warm golden glow, not harsh orange
    const windowMat = new THREE.MeshStandardMaterial({
      color: "#fff8e0",
      emissive: "#ffcc66",
      emissiveIntensity: 1.5,
    });
    const windowGeo = new THREE.PlaneGeometry(0.7, 0.9);
    
    // Window frames (white)
    const frameMat = new THREE.MeshStandardMaterial({ color: "#f8f8f5", roughness: 0.5 });
    const frameGeo = new THREE.PlaneGeometry(0.85, 1.05);

    // Front windows
    [-0.9, 0.9].forEach((x) => {
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.set(x, 1.2, 1.605);
      house.add(frame);
      const win = new THREE.Mesh(windowGeo, windowMat);
      win.position.set(x, 1.2, 1.61);
      house.add(win);
    });
    // Side window
    const sideFrame = new THREE.Mesh(frameGeo, frameMat);
    sideFrame.position.set(2.005, 1.2, 0);
    sideFrame.rotation.y = Math.PI / 2;
    house.add(sideFrame);
    const sideWin = new THREE.Mesh(windowGeo, windowMat);
    sideWin.position.set(2.01, 1.2, 0);
    sideWin.rotation.y = Math.PI / 2;
    house.add(sideWin);

    // Door — dark wood with white frame
    const doorFrame = new THREE.Mesh(
      new THREE.PlaneGeometry(0.9, 1.6),
      frameMat
    );
    doorFrame.position.set(0, 0.8, 1.605);
    house.add(doorFrame);
    const door = new THREE.Mesh(
      new THREE.PlaneGeometry(0.7, 1.4),
      new THREE.MeshStandardMaterial({ color: "#2a1810", roughness: 0.7 })
    );
    door.position.set(0, 0.7, 1.61);
    house.add(door);

    // Pitched roof — dark tiles
    const roofMat = new THREE.MeshStandardMaterial({ 
      color: "#1a1a1a", 
      roughness: 0.8,
      metalness: 0.1,
    });
    const roofGeo = new THREE.ConeGeometry(2.9, 1.7, 4);
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.rotation.y = Math.PI / 4;
    roof.position.y = 2.95;
    roof.castShadow = true;
    house.add(roof);

    // Snow on roof — bright white, catches light
    const snowRoof = new THREE.Mesh(
      new THREE.ConeGeometry(2.95, 0.25, 4),
      new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.9 })
    );
    snowRoof.rotation.y = Math.PI / 4;
    snowRoof.position.y = 3.6;
    house.add(snowRoof);

    // Chimney — brick red
    const chimney = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 1.1, 0.45),
      new THREE.MeshStandardMaterial({ color: "#8b4513", roughness: 0.85 })
    );
    chimney.position.set(1, 3.4, -0.5);
    chimney.castShadow = true;
    house.add(chimney);

    // Warm interior light (the "savings glow") — golden, not orange
    const warmLight = new THREE.PointLight(0xffdd99, 2, 10);
    warmLight.position.set(0, 1.5, 0);
    house.add(warmLight);
    
    // Secondary warm light for window spill
    const windowSpill = new THREE.PointLight(0xffcc77, 1.5, 5);
    windowSpill.position.set(0, 1.2, 2.5);
    house.add(windowSpill);

    scene.add(house);

    // Heat pump equipment group (swapped based on system)
    const heatPumpGroup = new THREE.Group();
    heatPumpGroup.position.set(-2.5, 0, 1);
    scene.add(heatPumpGroup);

    // Falling snow particles — bright white, visible against sky
    const snowCount = 400;
    const snowGeo = new THREE.BufferGeometry();
    const snowPositions = new Float32Array(snowCount * 3);
    for (let i = 0; i < snowCount; i++) {
      snowPositions[i * 3] = (Math.random() - 0.5) * 24;
      snowPositions[i * 3 + 1] = Math.random() * 12;
      snowPositions[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    snowGeo.setAttribute("position", new THREE.BufferAttribute(snowPositions, 3));
    const snowMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(snowGeo, snowMat);
    scene.add(particles);

    sceneRef.current = { house, warmLight, heatPumpGroup, particles };

    let raf = 0;
    let time = 0;
    const animate = () => {
      time += 0.016;

      // Gentle house sway
      house.rotation.y = Math.sin(time * 0.5) * 0.15;

      // Snow falling
      const positions = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < snowCount; i++) {
        positions[i * 3 + 1] -= 0.02 + Math.random() * 0.01;
        if (positions[i * 3 + 1] < 0) {
          positions[i * 3 + 1] = 10;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // React to area changes — scale the house
  useEffect(() => {
    if (!sceneRef.current) return;
    const { house } = sceneRef.current;
    // 100m² = scale 1.0, 200m² = scale 1.3, 50m² = scale 0.85
    const scale = 0.7 + (areaSqm / 200) * 0.6;
    house.scale.setScalar(Math.max(0.7, Math.min(1.4, scale)));
  }, [areaSqm]);

  // React to savings — warm glow intensity
  useEffect(() => {
    if (!sceneRef.current) return;
    const { warmLight } = sceneRef.current;
    // 0 savings = cozy (1.5), 30k+ savings = very warm (4.0)
    const intensity = 1.5 + Math.min(savingsPerYear / 12000, 1) * 2.5;
    warmLight.intensity = intensity;
  }, [savingsPerYear]);

  // React to system — swap heat pump equipment
  useEffect(() => {
    if (!sceneRef.current) return;
    const { heatPumpGroup } = sceneRef.current;

    // Clear existing equipment
    while (heatPumpGroup.children.length) {
      const child = heatPumpGroup.children[0] as THREE.Mesh;
      heatPumpGroup.remove(child);
      child.geometry?.dispose();
      if (child.material) {
        (child.material as THREE.Material).dispose();
      }
    }

    const metalMat = new THREE.MeshStandardMaterial({
      color: "#e0e0e0",
      metalness: 0.6,
      roughness: 0.3,
    });

    if (system === "bergvarme") {
      // Borehole — vertical pipe going into ground + small indoor unit
      const pipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 2, 12),
        new THREE.MeshStandardMaterial({ color: "#2a5a3a" })
      );
      pipe.position.set(0, -0.5, 0);
      heatPumpGroup.add(pipe);

      // Ground ring around borehole
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.3, 0.05, 8, 16),
        new THREE.MeshStandardMaterial({ color: "#4a6a5a" })
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.02;
      heatPumpGroup.add(ring);

      // Small indoor unit
      const unit = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.3), metalMat);
      unit.position.set(0.8, 0.4, 0);
      heatPumpGroup.add(unit);
    } else if (system === "luft-vatten") {
      // Outdoor unit — larger box with fan grille
      const unit = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1, 0.5), metalMat);
      unit.position.y = 0.5;
      unit.castShadow = true;
      heatPumpGroup.add(unit);

      // Fan grille
      const grille = new THREE.Mesh(
        new THREE.CircleGeometry(0.25, 16),
        new THREE.MeshStandardMaterial({ color: "#333" })
      );
      grille.position.set(0, 0.5, 0.26);
      heatPumpGroup.add(grille);

      // Pipes to house
      const pipeMat = new THREE.MeshStandardMaterial({ color: "#666" });
      const pipe1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8), pipeMat);
      pipe1.rotation.z = Math.PI / 2;
      pipe1.position.set(0.9, 0.3, 0);
      heatPumpGroup.add(pipe1);
    } else {
      // luft-luft — wall-mounted indoor unit + small outdoor
      // Outdoor unit (smaller)
      const outdoor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.6, 0.3), metalMat);
      outdoor.position.y = 0.3;
      heatPumpGroup.add(outdoor);

      // Indoor wall unit (on house wall) — represented near the group
      const indoor = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.25, 0.2),
        new THREE.MeshStandardMaterial({ color: "#f5f5f5" })
      );
      indoor.position.set(1.5, 1.8, 0);
      heatPumpGroup.add(indoor);
    }
  }, [system]);

  return (
    <div
      ref={mountRef}
      className="h-full w-full rounded-2xl overflow-hidden"
      aria-hidden="true"
    />
  );
}
