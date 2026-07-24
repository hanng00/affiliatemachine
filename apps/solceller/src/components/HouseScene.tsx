import { useEffect, useRef } from "react";
import * as THREE from "three";

interface HouseSceneProps {
  /** Number of solar panels to lay out on the roof. */
  panels: number;
}

/**
 * A small, lazy-loaded 3D villa with a pitched roof. As the user draws a bigger
 * roof (more panels), more panels appear on the roof plane. Purely decorative /
 * engagement — it carries no SEO weight, so it loads after the fold and never
 * blocks the prerendered content.
 */
export default function HouseScene({ panels }: HouseSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const panelGroupRef = useRef<THREE.Group | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#D8EEFB");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(6, 4.5, 7);
    camera.lookAt(0, 1, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights — a warm "sun" key light plus soft ambient.
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xfff2cc, 1.1);
    sun.position.set(5, 8, 4);
    scene.add(sun);

    // Ground
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(9, 48),
      new THREE.MeshStandardMaterial({ color: "#9BD49B" })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    scene.add(ground);

    const house = new THREE.Group();

    // Walls
    const walls = new THREE.Mesh(
      new THREE.BoxGeometry(4, 2, 3),
      new THREE.MeshStandardMaterial({ color: "#F4EFE6" })
    );
    walls.position.y = 1;
    house.add(walls);

    // Pitched roof (a prism made from a cylinder with 3 radial segments).
    const roofMat = new THREE.MeshStandardMaterial({ color: "#7C4A2D" });
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0, 1, 1, 3, 1, false), roofMat);
    // Scale a 3-sided cylinder into a ridged roof spanning the walls.
    roof.scale.set(2.55, 1.3, 2.2);
    roof.rotation.y = Math.PI / 2;
    roof.position.y = 2.65;
    house.add(roof);

    // The south-facing roof plane that panels sit on.
    const roofPlane = new THREE.Group();
    // Position/rotation roughly aligned with one slope of the prism.
    roofPlane.position.set(0, 2.55, 0.62);
    roofPlane.rotation.x = -Math.PI / 5;
    house.add(roofPlane);
    house.userData.roofPlane = roofPlane;

    scene.add(house);

    const panelGroup = new THREE.Group();
    roofPlane.add(panelGroup);
    panelGroupRef.current = panelGroup;

    let raf = 0;
    let angle = 0;
    const animate = () => {
      angle += 0.0035;
      house.rotation.y = Math.sin(angle) * 0.35;
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

  // Rebuild the panel grid whenever the count changes.
  useEffect(() => {
    const group = panelGroupRef.current;
    if (!group) return;

    while (group.children.length) {
      const child = group.children[0] as THREE.Mesh;
      group.remove(child);
      child.geometry?.dispose();
      (child.material as THREE.Material)?.dispose();
    }

    const shown = Math.min(panels, 40);
    if (shown === 0) return;

    const cols = Math.min(5, Math.ceil(Math.sqrt(shown)));
    const rows = Math.ceil(shown / cols);
    const pw = 0.5;
    const ph = 0.34;
    const gap = 0.06;
    const panelMat = new THREE.MeshStandardMaterial({
      color: "#1E3A5F",
      metalness: 0.4,
      roughness: 0.35,
    });
    const geo = new THREE.BoxGeometry(pw, 0.04, ph);

    const totalW = cols * pw + (cols - 1) * gap;
    const totalH = rows * ph + (rows - 1) * gap;

    let placed = 0;
    for (let r = 0; r < rows && placed < shown; r++) {
      for (let c = 0; c < cols && placed < shown; c++) {
        const panel = new THREE.Mesh(geo, panelMat);
        panel.position.set(
          c * (pw + gap) - totalW / 2 + pw / 2,
          0.03,
          r * (ph + gap) - totalH / 2 + ph / 2
        );
        group.add(panel);
        placed++;
      }
    }
  }, [panels]);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
