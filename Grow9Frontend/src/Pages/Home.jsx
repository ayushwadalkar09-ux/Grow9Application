import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function Home() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0, 2, 12);
    camera.lookAt(0, 0, 0);

    // Enhanced lighting for brighter golden coins
    const ambientLight = new THREE.AmbientLight(0xffcc33, 0.8);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3);
    mainLight.position.set(10, 10, 10);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffdd44, 2);
    fillLight.position.set(-10, 5, -5);
    scene.add(fillLight);

    const topLight = new THREE.SpotLight(0xffee77, 3);
    topLight.position.set(0, 15, 0);
    scene.add(topLight);

    const backLight = new THREE.DirectionalLight(0xffcc33, 1.5);
    backLight.position.set(0, 5, -10);
    scene.add(backLight);

    const accentLight = new THREE.PointLight(0xffee88, 2, 60);
    accentLight.position.set(5, 0, 5);
    scene.add(accentLight);

    // Brighter golden material
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffbf00, // warm, rich gold color (closer to image)
      metalness: 1.0,
      roughness: 0.25, // slightly more rough to reduce artificial shine
      emissive: 0xffd966, // same warm gold for subtle glow
      emissiveIntensity: 0.3, // soft glow, not too bright
    });
    const coinGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 32);

    // Dense ground coins
    const groundCoins = [];
    for (let i = 0; i < 150; i++) {
      // increased from 80 to 150
      const coin = new THREE.Mesh(coinGeometry, goldMaterial);
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 8;
      coin.position.x = Math.cos(angle) * radius;
      coin.position.y = -3 + Math.random() * 1.5;
      coin.position.z = Math.sin(angle) * radius - 5;
      coin.rotation.x = Math.random() * Math.PI;
      coin.rotation.y = Math.random() * Math.PI;
      coin.rotation.z = Math.random() * Math.PI;
      coin.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.002,
        rotSpeedY: (Math.random() - 0.5) * 0.002,
        rotSpeedZ: (Math.random() - 0.5) * 0.002,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.5 + Math.random() * 0.5,
      };
      groundCoins.push(coin);
      scene.add(coin);
    }

    // Denser falling coins
    const fallingCoins = [];
    for (let i = 0; i < 120; i++) {
      // increased from 60 to 120
      const coin = new THREE.Mesh(coinGeometry, goldMaterial);
      coin.position.x = (Math.random() - 0.5) * 20;
      coin.position.y = 8 + Math.random() * 10;
      coin.position.z = (Math.random() - 0.5) * 10;
      coin.rotation.x = Math.random() * Math.PI * 2;
      coin.rotation.y = Math.random() * Math.PI * 2;
      coin.rotation.z = Math.random() * Math.PI * 2;
      coin.userData = {
        fallSpeed: 0.02 + Math.random() * 0.05, // slightly faster
        rotSpeedX: (Math.random() - 0.5) * 0.05,
        rotSpeedY: (Math.random() - 0.5) * 0.05,
        rotSpeedZ: (Math.random() - 0.5) * 0.05,
        wobbleX: (Math.random() - 0.5) * 0.02, // increased wobble
        wobbleZ: (Math.random() - 0.5) * 0.02,
        resetY: 8 + Math.random() * 10,
      };
      fallingCoins.push(coin);
      scene.add(coin);
    }

    // Denser floating coins
    const floatingCoins = [];
    for (let i = 0; i < 80; i++) {
      // increased from 40 to 80
      const coin = new THREE.Mesh(coinGeometry, goldMaterial);
      coin.position.x = (Math.random() - 0.5) * 18;
      coin.position.y = -2 + Math.random() * 8;
      coin.position.z = (Math.random() - 0.5) * 8;
      coin.rotation.x = Math.random() * Math.PI * 2;
      coin.rotation.y = Math.random() * Math.PI * 2;
      coin.rotation.z = Math.random() * Math.PI * 2;
      coin.userData = {
        rotSpeedX: (Math.random() - 0.5) * 0.02,
        rotSpeedY: (Math.random() - 0.5) * 0.02,
        rotSpeedZ: (Math.random() - 0.5) * 0.02,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.7,
        floatAmount: 0.02 + Math.random() * 0.03, // slightly bigger float
      };
      floatingCoins.push(coin);
      scene.add(coin);
    }

    let time = 0;
    function animate() {
      requestAnimationFrame(animate);
      time += 0.01;

      groundCoins.forEach((coin) => {
        coin.rotation.x += coin.userData.rotSpeedX;
        coin.rotation.y += coin.userData.rotSpeedY;
        coin.rotation.z += coin.userData.rotSpeedZ;
        coin.position.y +=
          Math.sin(
            time * coin.userData.floatSpeed + coin.userData.floatOffset
          ) * 0.001;
      });

      fallingCoins.forEach((coin) => {
        coin.position.y -= coin.userData.fallSpeed;
        coin.position.x += coin.userData.wobbleX * Math.sin(time * 3);
        coin.position.z += coin.userData.wobbleZ * Math.cos(time * 3);
        coin.rotation.x += coin.userData.rotSpeedX;
        coin.rotation.y += coin.userData.rotSpeedY;
        coin.rotation.z += coin.userData.rotSpeedZ;

        if (coin.position.y < -4) {
          coin.position.y = coin.userData.resetY;
          coin.position.x = (Math.random() - 0.5) * 20;
          coin.position.z = (Math.random() - 0.5) * 10;
        }
      });

      floatingCoins.forEach((coin) => {
        coin.rotation.x += coin.userData.rotSpeedX;
        coin.rotation.y += coin.userData.rotSpeedY;
        coin.rotation.z += coin.userData.rotSpeedZ;
        coin.position.y +=
          Math.sin(
            time * coin.userData.floatSpeed + coin.userData.floatOffset
          ) * coin.userData.floatAmount;
      });

      renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      coinGeometry.dispose();
      goldMaterial.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background:
            "linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #334155 100%)",
        }}
      />
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto bg-slate-900 bg-opacity-90 backdrop-blur-md rounded-3xl p-12 shadow-2xl border border-amber-500/30">
          <h1 className="text-5xl md:text-7xl font-bold text-amber-400 mb-6 drop-shadow-2xl">
            Invest Today, Grow Tomorrow
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed font-medium">
            Earn consistent daily growth and transform your investments into
            valuable assets. Your journey to financial growth starts here.
          </p>
        </div>
      </div>
    </div>
  );
}
