"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";

interface HeartParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  targetZ: number;
  baseRadius: number;
  color: string;
  alpha: number;
  speed: number;
  sparkleSpeed: number;
  sparklePhase: number;
  paramT: number;
  isInterior: boolean;
}

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
}

interface CometEmber {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
  maxLife: number;
  alpha: number;
}

interface NameParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  originX: number;
  originY: number;
  baseRadius: number;
  color: string;
  alpha: number;
  sparkleSpeed: number;
  sparklePhase: number;
}

export default function CorazonAstroPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [astronautSpoke, setAstronautSpoke] = useState(false);
  const [astronautQuote, setAstronautQuote] = useState(
    "¡Eres mi galaxia entera! 🪐✨",
  );
  const [animationStage, setAnimationStage] = useState<
    "ascending" | "swirling" | "forming" | "beating"
  >("ascending");

  // Customizable name over heart
  const [customName, setCustomName] = useState<string>("DANIELA");
  const [nameInput, setNameInput] = useState<string>("DANIELA");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const customNameRef = useRef<string>("DANIELA");
  const initNameParticlesRef = useRef<() => void>(() => {});

  const handleSaveName = (newName: string) => {
    const trimmed = newName.trim().toUpperCase() || "DANIELA";
    setCustomName(trimmed);
    customNameRef.current = trimmed;
    initNameParticlesRef.current?.();
    setIsEditingName(false);
  };

  // Animation restart trigger
  const restartTriggerRef = useRef<number>(0);

  // Quotes pool when astronaut is clicked
  const spaceQuotes = [
    "¡Eres mi galaxia entera! 🪐✨",
    "Brillas más que mil supernovas. 💫",
    "Entre billones de estrellas, mi órbita eres tú. 🚀",
    "De aquí al infinito... ¡y más allá! 🌌",
    "¡Tu sonrisa ilumina todo mi universo! ❤️",
    "Cero gravedad, pero mi corazón cae por ti. 💖",
  ];

  const triggerAstronautSpeech = () => {
    const randomQuote =
      spaceQuotes[Math.floor(Math.random() * spaceQuotes.length)];
    setAstronautQuote(randomQuote);
    setAstronautSpoke(true);
    setTimeout(() => {
      setAstronautSpoke(false);
    }, 4500);
  };

  // Internal supernova flash when streams meet
  const burstsRef = useRef<BurstParticle[]>([]);
  const triggerSupernovaFlash = useCallback(
    (originX: number, originY: number) => {
      const redColors = [
        "#ff0033",
        "#ff1744",
        "#d50000",
        "#ff2a55",
        "#ff4d6d",
        "#ff758f",
        "#ffffff",
        "#ffcdd2",
      ];

      for (let i = 0; i < 70; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2.5;
        burstsRef.current.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: redColors[Math.floor(Math.random() * redColors.length)],
          size: Math.random() * 3.2 + 1.5,
          life: 0,
          maxLife: Math.random() * 35 + 25,
          alpha: 1,
        });
      }
    },
    [],
  );

  // Restart the formation animation
  const handleRestartAnimation = () => {
    restartTriggerRef.current += 1;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initHeartParticles();
      initNameParticles();
      initStars();
    };

    window.addEventListener("resize", handleResize);

    // Stars background
    let stars: Star[] = [];
    const initStars = () => {
      stars = [];
      const count = Math.floor((width * height) / 3800);
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5 + 0.4,
          alpha: Math.random() * 0.75 + 0.2,
          twinkleSpeed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    // Shooting stars
    const shootingStars: ShootingStar[] = [];
    const addShootingStar = () => {
      if (Math.random() < 0.02 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * width * 0.8,
          y: Math.random() * height * 0.4,
          length: Math.random() * 80 + 50,
          speed: Math.random() * 8 + 6,
          angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
          opacity: 1,
          active: true,
        });
      }
    };

    // Heart Particles (Luminous Red Palette)
    const redPalette = [
      "#ff0033", // Brilliant Ruby
      "#ff1744", // Crimson Neon
      "#d50000", // Passion Carmine
      "#e50914", // Vivid Red
      "#ff2a55", // Electric Coral Red
      "#ff3366", // Rose Red
      "#ff0844", // Deep Scarlet
      "#ff4d6d", // Soft Red
      "#ff85a1", // Starlight Pink Highlight
      "#ffffff", // Diamond Core Star
    ];

    let heartParticles: HeartParticle[] = [];

    const initHeartParticles = () => {
      heartParticles = [];
      const isMobile = width < 768;
      // Optimized count for silky-smooth 60fps performance
      const particleCount = isMobile ? 2000 : 2900;
      const scale = isMobile
        ? Math.min(width, height) / 54
        : Math.min(width, height) / 46;

      for (let i = 0; i < particleCount; i++) {
        // 22% outer silhouette, 78% interior dense body
        const isEdge = i < particleCount * 0.22;
        let t = 0;
        let spread = 1;

        if (isEdge) {
          t = (Math.PI * 2 * i) / (particleCount * 0.22) - Math.PI;
          spread = 0.96 + Math.random() * 0.06;
        } else if (i < particleCount * 0.6) {
          // Mid & outer body uniform distribution
          t = Math.random() * Math.PI * 2 - Math.PI;
          spread = Math.sqrt(Math.random()) * 0.96;
        } else {
          // Central inner core dense filling
          t = Math.random() * Math.PI * 2 - Math.PI;
          spread = Math.pow(Math.random(), 0.6) * 0.88;
        }

        // Parametric Heart formula
        const hx = 16 * Math.pow(Math.sin(t), 3);
        const hy = -(
          13 * Math.cos(t) -
          5 * Math.cos(2 * t) -
          2 * Math.cos(3 * t) -
          Math.cos(4 * t)
        );

        const jitterX = (Math.random() - 0.5) * 3;
        const jitterY = (Math.random() - 0.5) * 3;

        const targetX = hx * scale * spread + jitterX;
        const targetY = hy * scale * spread + jitterY;

        // 3D Thickness depth profile
        const maxThickness = scale * 7.5;
        const thicknessFactor = Math.cos((hy / 17) * (Math.PI / 2.6));
        const targetZ =
          (Math.random() - 0.5) *
          maxThickness *
          Math.max(0.25, thicknessFactor);

        // Slightly larger radius so fewer particles fill the heart solidly
        const baseRadius = isEdge
          ? Math.random() * 2.8 + 1.8
          : Math.random() * 2.6 + 1.5;

        heartParticles.push({
          x: targetX,
          y: targetY,
          targetX,
          targetY,
          targetZ,
          baseRadius,
          color: redPalette[Math.floor(Math.random() * redPalette.length)],
          alpha: Math.random() * 0.35 + 0.65,
          speed: Math.random() * 0.08 + 0.04,
          sparkleSpeed: Math.random() * 0.08 + 0.03,
          sparklePhase: Math.random() * Math.PI * 2,
          paramT: t,
          isInterior: !isEdge,
        });
      }
    };

    // Name Particles (Customizable name formed by red astros right above the heart)
    let nameParticles: NameParticle[] = [];

    const initNameParticles = () => {
      nameParticles = [];
      const offCanvas = document.createElement("canvas");
      const isMobile = width < 768;
      const text = customNameRef.current.trim().toUpperCase() || "DANIELA";
      const spacedText = text.split("").join(" ");

      // Dynamic font size: significantly bigger and bolder
      let fontSize = isMobile ? 54 : 56;
      if (text.length > 8) {
        fontSize = Math.floor(fontSize * (8 / text.length));
      }
      fontSize = Math.max(isMobile ? 32 : 32, fontSize);

      const offWidth = isMobile ? Math.min(width * 0.94, 380) : 620;
      const offHeight = isMobile ? 90 : 120;
      offCanvas.width = offWidth;
      offCanvas.height = offHeight;
      const offCtx = offCanvas.getContext("2d");
      if (!offCtx) return;

      offCtx.fillStyle = "#ffffff";
      offCtx.font = `900 ${fontSize}px "Cinzel", "Times New Roman", Georgia, serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(spacedText, offCanvas.width / 2, offCanvas.height / 2);

      const imgData = offCtx.getImageData(
        0,
        0,
        offCanvas.width,
        offCanvas.height,
      );
      const data = imgData.data;
      const step = isMobile ? 3 : 3;

      const heartScale = isMobile
        ? Math.min(width, height) / 54
        : Math.min(width, height) / 46;

      const nameBaseY = -heartScale * 18.2;

      // White Starlight Palette for the Name
      const whiteNamePalette = [
        "#ffffff", // Pure Diamond White
        "#ffffff", // Pure Diamond White
        "#f8fafc", // Brilliant Starlight
        "#ffffff", // Pure Diamond White
        "#f1f5f9", // Silvery Starlight
        "#ffffff", // Pure Diamond White
        "#fff5f5", // Soft Pearl White
        "#fef3c7", // Subtle Golden Starlight
      ];

      for (let y = 0; y < offCanvas.height; y += step) {
        for (let x = 0; x < offCanvas.width; x += step) {
          const idx = (y * offCanvas.width + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 110) {
            const relX = x - offCanvas.width / 2;
            const relY = y - offCanvas.height / 2;

            // Arch gracefully over the top lobes of the heart
            const arch =
              Math.cos((relX / (offCanvas.width * 0.5)) * (Math.PI / 4.4)) *
              (heartScale * 1.4);
            const targetX = relX;
            const targetY = nameBaseY + relY - arch;

            // Dispersed origin in space before forming
            const originX = targetX + (Math.random() - 0.5) * 90;
            const originY = targetY - 60 - Math.random() * 100;

            nameParticles.push({
              x: originX,
              y: originY,
              targetX,
              targetY,
              originX,
              originY,
              baseRadius: isMobile
                ? Math.random() * 2.0 + 1.3
                : Math.random() * 2.8 + 1.6,
              color:
                whiteNamePalette[
                  Math.floor(Math.random() * whiteNamePalette.length)
                ],
              alpha: Math.random() * 0.25 + 0.75,
              sparkleSpeed: Math.random() * 0.08 + 0.04,
              sparklePhase: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    };

    initNameParticlesRef.current = initNameParticles;

    initStars();
    initHeartParticles();
    initNameParticles();

    // Mouse coordinates tracking
    let mouseX = width / 2;
    let mouseY = height / 2;
    let isHovering = false;

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      isHovering = true;
      if ("touches" in e) {
        if (e.touches.length > 0) {
          mouseX = e.touches[0].clientX;
          mouseY = e.touches[0].clientY;
        }
      } else {
        mouseX = (e as MouseEvent).clientX;
        mouseY = (e as MouseEvent).clientY;
      }
    };

    const onPointerLeave = () => {
      isHovering = false;
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("mouseleave", onPointerLeave);

    // ==========================================
    // COMETS CHOREOGRAPHY & 3D SPINNING HEART
    // ==========================================
    const TOTAL_FRAMES = 240;
    let frameCount = 0;
    let lastRestartTrigger = restartTriggerRef.current;
    let hasExploded = false;

    // Comet trajectory histories for tapered tail rendering
    const comet1History: { x: number; y: number }[] = [];
    const comet2History: { x: number; y: number }[] = [];

    // Burning micro-embers shed along the comet tails
    const cometEmbers: CometEmber[] = [];

    let prevC1X = width / 2;
    let prevC1Y = height + 50;
    let prevC2X = width / 2;
    let prevC2Y = height + 50;

    let time = 0;
    let heartRotY = 0; // 3D rotation angle of the formed heart

    const render = () => {
      time += 0.035;

      // Check if restart was requested
      if (lastRestartTrigger !== restartTriggerRef.current) {
        lastRestartTrigger = restartTriggerRef.current;
        frameCount = 0;
        hasExploded = false;
        comet1History.length = 0;
        comet2History.length = 0;
        cometEmbers.length = 0;
        heartRotY = 0;
        for (let i = 0; i < nameParticles.length; i++) {
          nameParticles[i].x = nameParticles[i].originX;
          nameParticles[i].y = nameParticles[i].originY;
        }
      }

      frameCount++;
      const progress = Math.min(1, frameCount / TOTAL_FRAMES);

      // Animation stages
      let stage: "ascending" | "swirling" | "forming" | "beating" = "ascending";
      if (progress >= 0.88) {
        stage = "beating";
      } else if (progress >= 0.62) {
        stage = "forming";
      } else if (progress >= 0.28) {
        stage = "swirling";
      }
      setAnimationStage(stage);

      // Deep space cosmic dark canvas
      ctx.fillStyle = "#050209";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 - 20;
      const isMobile = width < 768;
      const heartScale = isMobile
        ? Math.min(width, height) / 54
        : Math.min(width, height) / 46;

      // Deep red celestial nebula glow
      const nebulaIntensity =
        stage === "beating" ? 0.28 : 0.16 + progress * 0.1;
      const nebulaGrad = ctx.createRadialGradient(
        cx,
        cy,
        15,
        cx,
        cy,
        Math.min(width, height) * 0.55,
      );
      nebulaGrad.addColorStop(0, `rgba(255, 0, 51, ${nebulaIntensity})`);
      nebulaGrad.addColorStop(
        0.35,
        `rgba(180, 0, 40, ${nebulaIntensity * 0.65})`,
      );
      nebulaGrad.addColorStop(0.7, "rgba(40, 5, 20, 0.15)");
      nebulaGrad.addColorStop(1, "rgba(5, 2, 9, 0)");
      ctx.fillStyle = nebulaGrad;
      ctx.fillRect(0, 0, width, height);

      // Render background twinkling stars
      ctx.save();
      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed;
        const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.twinklePhase));
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentAlpha)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Shooting stars
      addShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.015;

        if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.strokeStyle = `rgba(255, 180, 180, ${ss.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(
          ss.x - Math.cos(ss.angle) * ss.length,
          ss.y - Math.sin(ss.angle) * ss.length,
        );
        ctx.stroke();
        ctx.restore();
      }

      // ==========================================
      // CHOREOGRAPHY OF THE PAIR OF COMETS
      // ==========================================
      let comet1X = cx;
      let comet1Y = height + 50;
      let comet2X = cx;
      let comet2Y = height + 50;
      let showComets = progress < 0.92;

      const heartCuspY = cy - heartScale * 5;
      const heartTipY = cy + heartScale * 17;

      if (progress < 0.28) {
        // PHASE 1: Comets ascend in parallel
        const u = progress / 0.28;
        const startY = height + 40;
        const endY = height * 0.62;
        const currentY = startY - u * (startY - endY);
        const spacing = isMobile ? 42 : 62;

        comet1X = cx - spacing;
        comet1Y = currentY;
        comet2X = cx + spacing;
        comet2Y = currentY;
      } else if (progress < 0.62) {
        // PHASE 2: Comets swirling around each other (Double-Helix)
        const u = (progress - 0.28) / (0.62 - 0.28);
        const startY = height * 0.62;
        const endY = heartCuspY;
        const currentCenterY = startY - u * (startY - endY);

        const angle = u * Math.PI * 7;
        const baseRadius = isMobile ? 42 : 62;
        const currentRadius = baseRadius * (1 - u * 0.55);

        comet1X = cx - Math.cos(angle) * currentRadius;
        comet1Y = currentCenterY - Math.sin(angle) * (currentRadius * 0.28);

        comet2X = cx + Math.cos(angle) * currentRadius;
        comet2Y = currentCenterY + Math.sin(angle) * (currentRadius * 0.28);
      } else if (progress < 0.88) {
        // PHASE 3: Comets sweep and trace Heart Lobes
        const u = (progress - 0.62) / (0.88 - 0.62);

        // Comet 1 sweeps LEFT lobe
        const t1 = -u * Math.PI;
        const hx1 = 16 * Math.pow(Math.sin(t1), 3);
        const hy1 = -(
          13 * Math.cos(t1) -
          5 * Math.cos(2 * t1) -
          2 * Math.cos(3 * t1) -
          Math.cos(4 * t1)
        );
        comet1X = cx + hx1 * heartScale;
        comet1Y = cy + hy1 * heartScale;

        // Comet 2 sweeps RIGHT lobe
        const t2 = u * Math.PI;
        const hx2 = 16 * Math.pow(Math.sin(t2), 3);
        const hy2 = -(
          13 * Math.cos(t2) -
          5 * Math.cos(2 * t2) -
          2 * Math.cos(3 * t2) -
          Math.cos(4 * t2)
        );
        comet2X = cx + hx2 * heartScale;
        comet2Y = cy + hy2 * heartScale;

        if (u >= 0.96 && !hasExploded) {
          hasExploded = true;
          triggerSupernovaFlash(cx, heartTipY);
        }
      } else {
        showComets = false;
      }

      if (frameCount === 1) {
        prevC1X = comet1X;
        prevC1Y = comet1Y;
        prevC2X = comet2X;
        prevC2Y = comet2Y;
      }

      // Record position history for realistic comet tail
      if (showComets) {
        comet1History.push({ x: comet1X, y: comet1Y });
        comet2History.push({ x: comet2X, y: comet2Y });
        if (comet1History.length > 34) comet1History.shift();
        if (comet2History.length > 34) comet2History.shift();

        // Shed backwards micro-embers like a real comet
        const shedEmbers = (
          curX: number,
          curY: number,
          prevX: number,
          prevY: number,
        ) => {
          const dx = curX - prevX;
          const dy = curY - prevY;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const backX = -dx / len;
          const backY = -dy / len;

          for (let k = 0; k < 4; k++) {
            const speed = Math.random() * 1.8 + 0.4;
            const spread = (Math.random() - 0.5) * 5;
            cometEmbers.push({
              x: curX + spread,
              y: curY + spread,
              vx: backX * speed + (Math.random() - 0.5) * 0.6,
              vy: backY * speed + (Math.random() - 0.5) * 0.6,
              radius: Math.random() * 1.8 + 0.6,
              color: Math.random() < 0.28 ? "#ffffff" : "#ff1744",
              alpha: 0.85,
              life: 0,
              maxLife: Math.random() * 26 + 14,
            });
          }
        };

        shedEmbers(comet1X, comet1Y, prevC1X, prevC1Y);
        shedEmbers(comet2X, comet2Y, prevC2X, prevC2Y);

        prevC1X = comet1X;
        prevC1Y = comet1Y;
        prevC2X = comet2X;
        prevC2Y = comet2Y;
      } else {
        if (comet1History.length > 0) comet1History.shift();
        if (comet2History.length > 0) comet2History.shift();
      }

      // Render Comets
      const drawRealisticComet = (
        history: { x: number; y: number }[],
        headX: number,
        headY: number,
      ) => {
        if (history.length < 2) return;
        const N = history.length;

        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Gaseous envelope
        for (let j = 0; j < N - 1; j++) {
          const pA = history[j];
          const pB = history[j + 1];
          const ratio = (j + 1) / N;
          ctx.strokeStyle = `rgba(255, 0, 51, ${ratio * 0.26})`;
          ctx.lineWidth = ratio * 18 + 0.8;
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.stroke();
        }

        // Ion tail
        for (let j = 0; j < N - 1; j++) {
          const pA = history[j];
          const pB = history[j + 1];
          const ratio = (j + 1) / N;
          ctx.strokeStyle = `rgba(255, 23, 68, ${ratio * 0.72})`;
          ctx.lineWidth = ratio * 8.5 + 0.8;
          ctx.shadowBlur = ratio * 18;
          ctx.shadowColor = "#ff0033";
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.stroke();
        }

        // Core spine
        for (let j = 0; j < N - 1; j++) {
          const pA = history[j];
          const pB = history[j + 1];
          const ratio = (j + 1) / N;
          ctx.strokeStyle = `rgba(255, 240, 245, ${ratio * 0.95})`;
          ctx.lineWidth = ratio * 2.8 + 0.4;
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.stroke();
        }
        ctx.restore();

        // Comet Head
        ctx.save();
        const comaGrad = ctx.createRadialGradient(
          headX,
          headY,
          2,
          headX,
          headY,
          25,
        );
        comaGrad.addColorStop(0, "rgba(255, 255, 255, 1)");
        comaGrad.addColorStop(0.25, "rgba(255, 51, 85, 0.95)");
        comaGrad.addColorStop(0.55, "rgba(213, 0, 0, 0.45)");
        comaGrad.addColorStop(1, "rgba(255, 0, 51, 0)");
        ctx.fillStyle = comaGrad;
        ctx.beginPath();
        ctx.arc(headX, headY, 25, 0, Math.PI * 2);
        ctx.fill();

        // Nucleus
        ctx.shadowBlur = 24;
        ctx.shadowColor = "#ff0033";
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(headX, headY, 5, 0, Math.PI * 2);
        ctx.fill();

        // Ray gleam
        ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(headX - 13, headY);
        ctx.lineTo(headX + 13, headY);
        ctx.moveTo(headX, headY - 13);
        ctx.lineTo(headX, headY + 13);
        ctx.stroke();
        ctx.restore();
      };

      if (showComets) {
        drawRealisticComet(comet1History, comet1X, comet1Y);
        drawRealisticComet(comet2History, comet2X, comet2Y);
      }

      // Render Comet Embers
      for (let i = cometEmbers.length - 1; i >= 0; i--) {
        const e = cometEmbers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.vx *= 0.96;
        e.vy *= 0.96;
        e.life++;
        e.alpha = Math.max(0, 1 - e.life / e.maxLife);

        if (e.life >= e.maxLife) {
          cometEmbers.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = e.color;
        ctx.globalAlpha = e.alpha * 0.85;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#ff0033";
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // ====================================================
      // 3D ROTATION & FULL FILLING OF THE HEART PARTICLES
      // ====================================================
      // Advance 3D rotation once formed (gentle, slow and majestic celestial spin)
      if (progress >= 0.88) {
        const spinEase = Math.min(1, (progress - 0.88) / 0.08);
        heartRotY += 0.0065 * spinEase;
      }

      const cosRot = Math.cos(heartRotY);
      const sinRot = Math.sin(heartRotY);

      // Heartbeat pulse rhythm
      const heartBeat =
        stage === "beating"
          ? 1 +
            0.08 * Math.sin(time * 3.4) +
            0.04 * Math.sin(time * 6.8) +
            (Math.sin(time * 3.4) > 0.65 ? 0.07 : 0)
          : 1;

      ctx.save();
      ctx.translate(cx, cy);

      // Core stellar nebula glow inside heart when formed/beating to make the interior richly filled
      if (progress >= 0.88) {
        const coreFillRatio = Math.min(1, (progress - 0.88) / 0.08);
        const coreGrad = ctx.createRadialGradient(
          0,
          -heartScale * 2,
          0,
          0,
          -heartScale * 2,
          heartScale * 14 * heartBeat,
        );
        coreGrad.addColorStop(0, `rgba(255, 0, 51, ${0.32 * coreFillRatio})`);
        coreGrad.addColorStop(0.45, `rgba(213, 0, 0, ${0.18 * coreFillRatio})`);
        coreGrad.addColorStop(
          0.8,
          `rgba(255, 42, 85, ${0.05 * coreFillRatio})`,
        );
        coreGrad.addColorStop(1, "rgba(255, 0, 51, 0)");
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(
          0,
          -heartScale * 2,
          heartScale * 14 * heartBeat,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      for (let i = 0; i < heartParticles.length; i++) {
        const p = heartParticles[i];

        let particleAlpha = 0;

        if (stage === "ascending" || stage === "swirling") {
          particleAlpha = 0;
        } else if (stage === "forming") {
          // While forming, the comets trace the outer edge
          if (p.isInterior) {
            particleAlpha = 0;
          } else {
            const u = (progress - 0.62) / (0.88 - 0.62);
            const particleAngleFrac = Math.abs(p.paramT) / Math.PI;

            if (particleAngleFrac <= u + 0.08) {
              particleAlpha = Math.min(1, (u + 0.08 - particleAngleFrac) * 4);
            } else {
              particleAlpha = 0;
            }
          }
        } else {
          // Stage: beating - THE ENTIRE HEART FILLS UP SOLIDLY
          const fillRatio = Math.min(1, (progress - 0.88) / 0.08);
          if (p.isInterior) {
            particleAlpha = p.alpha * fillRatio;
          } else {
            particleAlpha = p.alpha;
          }
        }

        if (particleAlpha <= 0.02) continue;

        // Animate sparkle
        p.sparklePhase += p.sparkleSpeed;
        const sparkle = 0.5 + 0.5 * Math.sin(p.sparklePhase);

        // 3D rotation around vertical axis (Y-axis)
        const rotX = p.targetX * cosRot + p.targetZ * sinRot;
        const rotZ = -p.targetX * sinRot + p.targetZ * cosRot;

        // Perspective depth
        const fov = 550;
        const persp = fov / (fov + rotZ);

        const targetScreenX = rotX * persp * heartBeat;
        const targetScreenY = p.targetY * persp * heartBeat;

        // Interactive mouse push/pull
        if (isHovering && stage === "beating") {
          const screenPX = cx + targetScreenX;
          const screenPY = cy + targetScreenY;
          const dx = screenPX - mouseX;
          const dy = screenPY - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const force = (110 - dist) / 110;
            p.x += (dx / dist) * force * 12;
            p.y += (dy / dist) * force * 12;
          }
        }

        // Smooth spring return
        p.x += (targetScreenX - p.x) * 0.18;
        p.y += (targetScreenY - p.y) * 0.18;

        // Depth perspective alpha & size
        const depthAlpha = 0.55 + 0.45 * persp;
        const renderAlpha = Math.min(
          1,
          particleAlpha * (0.65 + sparkle * 0.35) * depthAlpha,
        );

        ctx.fillStyle = p.color;
        ctx.globalAlpha = renderAlpha;
        ctx.beginPath();
        ctx.arc(
          p.x,
          p.y,
          p.baseRadius * persp * (0.85 + sparkle * 0.35),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }

      // ====================================================
      // RENDER NAME PARTICLES ("DANIELA" ABOVE THE HEART)
      // Formed with the exact same celestial red astros
      // ====================================================
      const nameProgress =
        stage === "beating" ? Math.min(1, (progress - 0.88) / 0.08) : 0;

      if (nameProgress > 0.01) {
        const assembleEase = 1 - Math.pow(1 - nameProgress, 3);

        for (let i = 0; i < nameParticles.length; i++) {
          const np = nameParticles[i];

          // Fly in from space and assemble into "DANIELA"
          const currentTargetX =
            np.originX + (np.targetX - np.originX) * assembleEase;
          const currentTargetY =
            np.originY + (np.targetY - np.originY) * assembleEase;

          // Static, firm position (no palpitations or beating)
          const finalTargetX = currentTargetX;
          const finalTargetY = currentTargetY;

          // Interactive mouse push/pull for DANIELA
          if (isHovering && stage === "beating") {
            const screenNPX = cx + finalTargetX;
            const screenNPY = cy + finalTargetY;
            const dx = screenNPX - mouseX;
            const dy = screenNPY - mouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90) {
              const force = (90 - dist) / 90;
              np.x += (dx / dist) * force * 11;
              np.y += (dy / dist) * force * 11;
            }
          }

          // Smooth spring return
          np.x += (finalTargetX - np.x) * 0.16;
          np.y += (finalTargetY - np.y) * 0.16;

          // Twinkle animation
          np.sparklePhase += np.sparkleSpeed;
          const sparkle = 0.5 + 0.5 * Math.sin(np.sparklePhase);

          const renderAlpha = Math.min(
            1,
            np.alpha * nameProgress * (0.7 + sparkle * 0.3),
          );

          // Delicate diamond white starlight glow on key star points
          if (i % 4 === 0) {
            ctx.shadowBlur = 12;
            ctx.shadowColor = "rgba(255, 255, 255, 0.95)";
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fillStyle = np.color;
          ctx.globalAlpha = renderAlpha;
          ctx.beginPath();
          ctx.arc(
            np.x,
            np.y,
            np.baseRadius * (0.85 + sparkle * 0.35),
            0,
            Math.PI * 2,
          );
          ctx.fill();
        }
        ctx.shadowBlur = 0;
      }
      ctx.restore();

      // Render Supernova bursts
      for (let i = burstsRef.current.length - 1; i >= 0; i--) {
        const b = burstsRef.current[i];
        b.x += b.vx;
        b.y += b.vy;
        b.vy += 0.05;
        b.vx *= 0.97;
        b.vy *= 0.97;
        b.life += 1;
        b.alpha = Math.max(0, 1 - b.life / b.maxLife);

        if (b.life >= b.maxLife) {
          burstsRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.fillStyle = b.color;
        ctx.globalAlpha = b.alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "#ff0033";
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeave);
    };
  }, [triggerSupernovaFlash]);

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#050209] font-sans text-white">
      {/* Background Interactive Star Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Top Floating Controls Bar */}
      <header className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 sm:right-8 z-30 flex items-center justify-between pointer-events-none">
        {/* Navigation back and to catalog */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md text-xs font-medium text-white transition shadow-lg hover:scale-105 active:scale-95"
          >
            ← Inicio
          </Link>
          <Link
            href="/carta"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 backdrop-blur-md text-xs font-medium text-amber-200 transition shadow-lg hover:scale-105 active:scale-95"
          >
            💐 Carta Girasol
          </Link>
        </div>

        {/* Action buttons: Customize Name & Replay Formation */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => {
              setNameInput(customName);
              setIsEditingName(true);
            }}
            title="Personalizar el nombre sobre el corazón"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md text-xs font-semibold text-white transition shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>✨ {customName}</span>
            <span className="text-[11px] opacity-75">✏️</span>
          </button>
          <button
            onClick={handleRestartAnimation}
            title="Reiniciar animación de los cometas y formación"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 backdrop-blur-md text-xs font-medium text-red-200 transition shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Ver Formación</span>
          </button>
        </div>
      </header>

      {/* Center Cosmic Titles */}
      <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none px-4">
        <h1 className="mt-2 text-3xl sm:text-5xl font-light tracking-tight text-white drop-shadow-[0_0_25px_rgba(255,0,51,0.85)] font-serif">
          Tú eres mi Universo
        </h1>
      </div>

      {/* FLOATING CUTE CHIBI ASTRONAUT */}
      <div
        className="absolute bottom-12 sm:bottom-12 right-6 sm:right-16 z-30 flex flex-col items-center select-none cursor-pointer group"
        onClick={triggerAstronautSpeech}
        title="¡Haz clic en el astronauta!"
      >
        {/* Speech Bubble (Positioned to the left/top-left of astronaut with high z-index so balloon never covers it) */}
        <div
          className={`absolute bottom-full mb-3 right-6 sm:right-full sm:mr-4 sm:bottom-12 z-50 transition-all duration-300 transform origin-bottom-right px-4 py-2.5 rounded-2xl bg-white/95 text-stone-900 shadow-2xl border border-red-200 text-xs sm:text-sm font-semibold w-52 sm:w-60 text-center ${
            astronautSpoke
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-90 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0"
          }`}
        >
          {astronautQuote}
          {/* Desktop tail pointing towards astronaut helmet */}
          <div className="hidden sm:block absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[8px] border-l-white/95" />
          {/* Mobile tail pointing down towards helmet */}
          <div className="sm:hidden absolute -bottom-2 right-8 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white/95" />
        </div>

        {/* Astronaut SVG with Zero-Gravity Animation */}
        <div className="relative w-28 h-32 sm:w-36 sm:h-40 animate-[float_4s_ease-in-out_infinite] group-hover:scale-110 transition-transform duration-300">
          {/* Glowing Constellation Tether / Red Heart Balloon (Anchored to astronaut's raised right hand) */}
          <svg
            className="absolute -top-12 -right-4 w-20 h-24 pointer-events-none z-10"
            viewBox="0 0 100 100"
          >
            {/* Glowing Red Heart Balloon */}
            <path
              d="M 25,25 C 25,10 50,10 50,25 C 50,10 75,10 75,25 C 75,45 50,60 50,70 C 50,60 25,45 25,25 Z"
              fill="url(#redBalloonGrad)"
              stroke="#ff1744"
              strokeWidth="2"
              className="drop-shadow-[0_0_12px_rgba(255,23,68,0.9)]"
            />
            {/* String to hand */}
            <path
              d="M 50,70 Q 42,85 28,95"
              fill="none"
              stroke="#ff4d6d"
              strokeWidth="1.5"
              strokeDasharray="2 2"
            />
            <defs>
              <linearGradient
                id="redBalloonGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#ff758f" />
                <stop offset="40%" stopColor="#ff0033" />
                <stop offset="100%" stopColor="#800010" />
              </linearGradient>
            </defs>
          </svg>

          {/* Astronaut Vector Artwork */}
          <svg viewBox="0 0 160 180" className="w-full h-full drop-shadow-2xl">
            {/* Jetpack */}
            <rect
              x="38"
              y="58"
              width="24"
              height="44"
              rx="8"
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth="3"
            />
            <rect
              x="98"
              y="58"
              width="24"
              height="44"
              rx="8"
              fill="#d1d5db"
              stroke="#9ca3af"
              strokeWidth="3"
            />
            {/* Thruster Red Flames */}
            <polygon
              points="44,102 50,120 56,102"
              fill="#ff1744"
              className="animate-pulse"
            />
            <polygon
              points="104,102 110,120 116,102"
              fill="#ff1744"
              className="animate-pulse"
            />

            {/* Astronaut Body Suit */}
            <ellipse
              cx="80"
              cy="85"
              rx="36"
              ry="40"
              fill="#f9fafb"
              stroke="#e5e7eb"
              strokeWidth="3"
            />
            {/* Chest Control Panel */}
            <rect x="66" y="74" width="28" height="22" rx="4" fill="#1e293b" />
            <circle cx="73" cy="85" r="3" fill="#ff1744" />
            <circle cx="81" cy="85" r="3" fill="#ff758f" />
            <circle cx="89" cy="85" r="3" fill="#ffffff" />

            {/* Legs */}
            <path
              d="M 60,118 L 56,150 Q 56,158 68,158 L 74,158 Q 78,154 76,144 L 72,118 Z"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="3"
            />
            <path
              d="M 100,118 L 104,150 Q 104,158 92,158 L 86,158 Q 82,154 84,144 L 88,118 Z"
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="3"
            />

            {/* Left Arm */}
            <path
              d="M 46,75 Q 30,85 52,66"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="52" cy="66" r="8" fill="#e5e7eb" />

            {/* Right Arm */}
            <path
              d="M 114,75 Q 138,62 135,46"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="14"
              strokeLinecap="round"
            />
            <circle cx="135" cy="46" r="8" fill="#e5e7eb" />

            {/* Helmet */}
            <circle
              cx="80"
              cy="44"
              r="34"
              fill="#ffffff"
              stroke="#e5e7eb"
              strokeWidth="3"
            />

            {/* Helmet Visor with Red Nebula Reflection */}
            <defs>
              <linearGradient
                id="redVisorGrad"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#2b0008" />
                <stop offset="35%" stopColor="#800018" />
                <stop offset="70%" stopColor="#ff0033" />
                <stop offset="100%" stopColor="#ff758f" />
              </linearGradient>
            </defs>
            <ellipse
              cx="80"
              cy="44"
              rx="24"
              ry="18"
              fill="url(#redVisorGrad)"
              stroke="#ff4d6d"
              strokeWidth="1.5"
            />

            {/* Visor Glare */}
            <ellipse
              cx="73"
              cy="38"
              rx="12"
              ry="6"
              fill="rgba(255,255,255,0.45)"
              transform="rotate(-18 73 38)"
            />
            <circle cx="88" cy="46" r="2.5" fill="rgba(255,255,255,0.7)" />
          </svg>
        </div>
      </div>

      {/* MODAL: CUSTOMIZE NAME IN THE STARS */}
      {isEditingName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1c0812] to-[#0a0207] border border-red-500/50 shadow-[0_0_50px_rgba(255,0,51,0.4)] text-center text-white">
            <h3 className="text-xl sm:text-2xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-red-200 via-pink-100 to-red-300 font-serif">
              ✨ Nombre en las Estrellas
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-stone-300">
              Escribe el nombre que formarán los astros sobre el corazón:
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveName(nameInput);
              }}
              className="mt-5 space-y-4"
            >
              <input
                type="text"
                maxLength={14}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value.toUpperCase())}
                placeholder="DANIELA"
                autoFocus
                className="w-full px-4 py-3.5 rounded-2xl bg-black/60 border border-red-500/60 text-white text-center font-black tracking-[0.25em] text-xl sm:text-2xl focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-red-500/50 shadow-inner uppercase placeholder-stone-600"
              />

              {/* Quick Suggestions */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                {["DANIELA", "JAZMÍN", "MI AMOR", "PRINCESA", "MI CIELO"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setNameInput(suggestion)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white/5 hover:bg-white/15 border border-white/10 text-stone-300 hover:text-white transition cursor-pointer"
                    >
                      {suggestion}
                    </button>
                  ),
                )}
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-red-600 via-red-500 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-[0_0_20px_rgba(255,0,51,0.5)] transition hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Guardar y Formar ✨
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tailwind & CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-16px) rotate(3deg);
          }
        }
      `}</style>
    </div>
  );
}
