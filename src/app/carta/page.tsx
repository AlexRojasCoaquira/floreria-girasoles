"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function CartaPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [fallingFlowers, setFallingFlowers] = useState<
    {
      id: number;
      left: number;
      delay: number;
      size: number;
      duration: number;
      variant: number;
    }[]
  >([]);
  const [showFlowers, setShowFlowers] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Nevada infinita de girasoles: orden 100% ALEATORIO de caída desde arriba (sin barrido de izq a der)
    if (isOpen) {
      const count = 40;
      // Posiciones horizontales que cubren la pantalla de forma equilibrada
      const positions = Array.from(
        { length: count },
        (_, i) => ((i * (92 / count) + Math.random() * 2.5) % 90) + 5,
      );
      // Barajado aleatorio (Fisher-Yates) para que los girasoles caigan en orden completamente impredecible
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
      }

      const generated = Array.from({ length: count }).map((_, i) => ({
        id: i,
        // Posición horizontal completamente aleatoria (nunca en secuencia de izquierda a derecha)
        left: positions[i],
        // Entrada escalonada natural desde arriba
        delay: i * 0.22 + Math.random() * 0.16,
        size: Math.floor(Math.random() * 100 + 54), // 54px a 82px
        duration: Math.random() * 1.6 + 5.6, // Caída suave de ~5.6s a 7.2s
        variant: Math.floor(Math.random() * 3), // Variante de bamboleo aleatoria
      }));
      setFallingFlowers(generated);
      setShowFlowers(true);
    } else {
      setShowFlowers(false);
      setFallingFlowers([]);
    }
  }, [isOpen]);

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);

    // Reproducir audio flores.mp3 al abrir el sobre
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => {
          console.log("Audio playback notice:", err);
        });
    }

    // Smooth sequence: envelope straightens and opens first, then letter smoothly glides out
    setTimeout(() => {
      setShowCard(true);
    }, 450);
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    // Smooth sequence: letter glides down inside first, then envelope closes and returns to tilted rest
    setShowCard(false);

    // Pausar audio si se cierra el sobre
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }

    setTimeout(() => {
      setIsOpen(false);
    }, 550);
  };

  const handleToggle = () => {
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  };

  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch(() => {});
    } else {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_center,_#fffdf2_0%,_#fef4cc_32%,_#fae498_65%,_#d97706_100%)] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden select-none font-sans text-stone-800">
      {/* Audio element for flores.mp3 */}
      <audio
        ref={audioRef}
        src="/flores.mp3"
        preload="auto"
        loop
        onPlay={() => setIsPlayingAudio(true)}
        onPause={() => setIsPlayingAudio(false)}
      />

      {/* Google Fonts for luxury calligraphy and classic serifs */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@500;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,400;1,600&family=Great+Vibes&family=Playfair+Display:ital,wght@0,500;0,600;1,500;1,600&display=swap");

        .font-cursive {
          font-family: "Great Vibes", "Alex Brush", cursive;
        }
        .font-handwriting {
          font-family: "Alex Brush", cursive;
        }
        .font-serif-luxury {
          font-family: "Playfair Display", "Cormorant Garamond", Georgia, serif;
        }
        .font-cinzel {
          font-family: "Cinzel", Georgia, serif;
        }

        /* 3D Envelope perspective */
        .envelope-wrapper {
          perspective: 1400px;
        }

        /* Natural gravitational swing for pendant */
        @keyframes swing {
          0%,
          100% {
            transform: rotate(-3.5deg);
          }
          50% {
            transform: rotate(3.5deg);
          }
        }

        .animate-swing {
          transform-origin: top center;
          animation: swing 3.8s ease-in-out infinite;
        }

        /* Sunflower pendant rotation */
        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 14s linear infinite;
        }

        /* Rhythmic Heartbeat pulse for the closed tilted envelope */
        @keyframes envelope-heartbeat-tilted {
          0%,
          100% {
            transform: rotate(-5.5deg) scale(1);
            filter: drop-shadow(0 20px 38px rgba(180, 110, 10, 0.28));
          }
          14% {
            transform: rotate(-4.8deg) scale(1.038);
            filter: drop-shadow(0 26px 48px rgba(217, 119, 6, 0.45));
          }
          28% {
            transform: rotate(-5.5deg) scale(1);
            filter: drop-shadow(0 20px 38px rgba(180, 110, 10, 0.28));
          }
          42% {
            transform: rotate(-6.2deg) scale(1.055);
            filter: drop-shadow(0 30px 54px rgba(245, 158, 11, 0.55));
          }
          70% {
            transform: rotate(-5.5deg) scale(1);
            filter: drop-shadow(0 20px 38px rgba(180, 110, 10, 0.28));
          }
        }

        .animate-envelope-tilted-pulse {
          animation: envelope-heartbeat-tilted 2.4s
            cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
        }

        /* Animación estilo nevada de girasoles (ondulación suave sinusoidal y caída ligera) */
        @keyframes snowfall-sway-1 {
          0% {
            transform: translate3d(0, -20vh, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.95;
          }
          25% {
            transform: translate3d(36px, 20vh, 0) rotate(14deg);
          }
          50% {
            transform: translate3d(-32px, 55vh, 0) rotate(-14deg);
          }
          75% {
            transform: translate3d(28px, 88vh, 0) rotate(12deg);
            opacity: 0.95;
          }
          92% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(-18px, 126vh, 0) rotate(-8deg);
            opacity: 0;
          }
        }

        @keyframes snowfall-sway-2 {
          0% {
            transform: translate3d(0, -20vh, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.95;
          }
          25% {
            transform: translate3d(-42px, 22vh, 0) rotate(-16deg);
          }
          50% {
            transform: translate3d(38px, 58vh, 0) rotate(15deg);
          }
          75% {
            transform: translate3d(-26px, 90vh, 0) rotate(-12deg);
            opacity: 0.95;
          }
          92% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(20px, 126vh, 0) rotate(9deg);
            opacity: 0;
          }
        }

        @keyframes snowfall-sway-3 {
          0% {
            transform: translate3d(0, -20vh, 0) rotate(-8deg);
            opacity: 0;
          }
          10% {
            opacity: 0.95;
          }
          30% {
            transform: translate3d(52px, 28vh, 0) rotate(18deg);
          }
          60% {
            transform: translate3d(-48px, 68vh, 0) rotate(-16deg);
          }
          85% {
            transform: translate3d(32px, 96vh, 0) rotate(12deg);
            opacity: 0.9;
          }
          100% {
            transform: translate3d(-22px, 126vh, 0) rotate(-8deg);
            opacity: 0;
          }
        }

        .animate-snowfall-1 {
          animation-name: snowfall-sway-1;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
        }

        .animate-snowfall-2 {
          animation-name: snowfall-sway-2;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
        }

        .animate-snowfall-3 {
          animation-name: snowfall-sway-3;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          animation-fill-mode: both;
        }

        @keyframes wax-sun-glow {
          0%,
          100% {
            transform: scale(1);
            filter: drop-shadow(0 0 12px rgba(217, 119, 6, 0.5));
          }
          50% {
            transform: scale(1.06);
            filter: drop-shadow(0 0 22px rgba(245, 158, 11, 0.85));
          }
        }

        .animate-sun-glow {
          animation: wax-sun-glow 2.2s ease-in-out infinite;
        }
      `}</style>

      {/* Ambient background lighting and warm sunflower radiance */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[720px] bg-amber-300/35 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[600px] h-[600px] bg-yellow-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-yellow-200/40 rounded-full blur-2xl" />
      </div>

      {/* Nevada Suave de Girasoles Reales al Abrir (Efecto de copos de nieve, dura 5 segundos) */}
      {isOpen && fallingFlowers.length > 0 && (
        <div
          className={`fixed inset-0 pointer-events-none z-30 overflow-hidden transition-opacity duration-1000 ${
            showFlowers ? "opacity-100" : "opacity-0"
          }`}
        >
          {fallingFlowers.map((flower) => (
            <div
              key={flower.id}
              className={`absolute select-none pointer-events-none ${
                flower.variant === 0
                  ? "animate-snowfall-1"
                  : flower.variant === 1
                    ? "animate-snowfall-2"
                    : "animate-snowfall-3"
              }`}
              style={{
                top: "-120px",
                left: `${flower.left}%`,
                width: `${flower.size}px`,
                height: `${flower.size}px`,
                animationDelay: `${flower.delay}s`,
                animationDuration: `${flower.duration}s`,
              }}
            >
              <Image
                src="/girasol-usuario.png"
                alt="Girasol con tallo y hoja cayendo como nieve"
                width={flower.size}
                height={flower.size}
                className="w-full h-full object-contain filter drop-shadow-[0_8px_18px_rgba(0,0,0,0.18)]"
              />
            </div>
          ))}
        </div>
      )}

      {/* Interactive Container (Self-contained, no external redirects) */}
      <div className="w-full max-w-lg flex flex-col items-center justify-center my-auto py-8">
        {/* Envelope & Letter Wrapper */}
        <div className="envelope-wrapper relative w-[340px] sm:w-[420px] flex justify-center items-center">
          {/* =========================================================
              THE EXACT BOTANICAL SUNFLOWER ENVELOPE (Fiel a la foto)
              Inicia inclinado (-5.5deg), palpita con emoción, y al presionar
              se alinea suavemente al centro mientras la carta emerge con delicadeza.
              ========================================================= */}
          <div
            onClick={handleToggle}
            className={`relative w-full h-[263px] sm:h-[325px] cursor-pointer transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] select-none ${
              isOpen
                ? "rotate-0 scale-95 translate-y-36 sm:translate-y-48 opacity-45 hover:opacity-85"
                : "animate-envelope-tilted-pulse hover:scale-[1.02]"
            }`}
          >
            {/* Real Botanical Envelope Container with Natural Paper Shadow */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-[#d6c7b0]/70 bg-[#f7f2e7]">
              {/* Photorealistic Envelope Back Body & Botanical Art */}
              <Image
                src="/sobre-recortado.jpg"
                alt="Sobre Artesanal de Girasoles"
                fill
                priority
                className="object-cover pointer-events-none"
              />

              {/* Fine gold foil edge hairline */}
              <div className="absolute inset-1.5 border border-amber-400/25 rounded-xl pointer-events-none" />

              {/* Interior Silk Lining (Revealed behind the flap when open) */}
              <div
                className={`absolute inset-0 bg-gradient-to-b from-[#faf6ee] to-[#ece1cc] transition-opacity duration-700 pointer-events-none ${
                  isOpen ? "opacity-90" : "opacity-0"
                }`}
              >
                <Image
                  src="/sobre-interior.jpg"
                  alt="Interior del Sobre"
                  fill
                  className="object-cover opacity-65"
                />
              </div>
            </div>

            {/* Envelope Top Flap (Animated 3D Opening with Real Flap Graphic) */}
            <div
              className="absolute top-0 left-0 right-0 h-[48%] z-30 transition-transform duration-700 origin-top rounded-t-2xl overflow-hidden pointer-events-none"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
              }}
            >
              {/* Flap Outside (When closed, matches the top of the photo) */}
              <div className="relative w-full h-[263px] sm:h-[325px]">
                <Image
                  src="/sobre-recortado.jpg"
                  alt="Solapa del Sobre"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Gold foil edge line on flap */}
              <div className="absolute inset-0 border-b-2 border-amber-400/60 pointer-events-none" />
            </div>

            {/* Sello de Lacre Dorado con Aura Luminosa Pulsante (Solo cuando cerrado) */}
            {!isOpen && (
              <div
                className="absolute z-40 pointer-events-none animate-sun-glow rounded-full"
                style={{
                  top: "46.5%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "72px",
                  height: "72px",
                }}
              >
                {/* Subtle radiant golden aura accentuating the seal */}
                <div className="w-full h-full rounded-full bg-amber-400/20 blur-md" />
              </div>
            )}
          </div>

          {/* =========================================================
              THE LUXURY GIFT CARD (Emerge suavemente del sobre)
              ========================================================= */}
          <div
            className={`fixed sm:absolute z-50 transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom flex flex-col items-center ${
              isOpen && showCard
                ? "opacity-100 scale-100 -translate-y-6 sm:-translate-y-10 pointer-events-auto"
                : isOpen
                  ? "opacity-0 scale-85 translate-y-24 pointer-events-none"
                  : "opacity-0 scale-75 translate-y-32 pointer-events-none hidden"
            }`}
          >
            {/* PHYSICAL JEWELRY PRESENTATION CARD */}
            <div className="w-[325px] sm:w-[380px] bg-[#fffefb] rounded-2xl shadow-[0_25px_60px_rgba(180,83,9,0.25)] p-6 sm:p-7 border border-[#eedab8] relative flex flex-col items-center text-center overflow-hidden">
              {/* Outer Double Filigree Gold Border */}
              <div className="absolute inset-2.5 border border-amber-400/50 rounded-xl pointer-events-none" />
              <div className="absolute inset-3.5 border border-amber-300/30 rounded-lg pointer-events-none" />

              {/* Sunflower Corner Ornaments */}
              <div className="absolute top-3.5 left-3.5 text-amber-600/70 text-xs select-none pointer-events-none">
                🌻
              </div>
              <div className="absolute bottom-3.5 left-3.5 text-amber-600/70 text-xs select-none pointer-events-none">
                🌻
              </div>
              <div className="absolute bottom-3.5 right-3.5 text-amber-600/70 text-xs select-none pointer-events-none">
                🌻
              </div>

              {/* Botón sutil de cierre de esquina */}
              <button
                onClick={handleClose}
                className="absolute top-2.5 right-2.5 text-amber-800/60 hover:text-amber-950 text-xs w-6 h-6 rounded-full bg-amber-100/60 hover:bg-amber-200/80 border border-amber-300/40 flex items-center justify-center transition cursor-pointer z-30"
                title="Guardar carta en el sobre"
              >
                ✕
              </button>

              {/* HEADER: DREAMWORKS SHREK OFFICIAL EMBLEM */}
              <div className="relative w-full flex flex-col justify-center items-center pt-1 pb-2">
                <span className="text-[12px] font-cinzel tracking-[0.28em] text-amber-800/80 uppercase font-semibold mb-1">
                  Florería Girasol • Edición Especial
                </span>
                <Image
                  src="/Shrek-Logo.png"
                  alt="DreamWorks Shrek Logo"
                  width={220}
                  height={80}
                  priority
                  className="w-44 sm:w-52 h-auto object-contain drop-shadow-xs"
                />
              </div>

              {/* JEWELRY DISPLAY AREA WITH WOVEN GOLD CHAIN & ROTATING SUNFLOWER PENDANT */}
              <div className="w-full relative h-[215px] sm:h-[235px] flex justify-center items-start my-1">
                {/* Card side cuts/notches with depth shadow */}
                <div className="absolute top-2 left-[-26px] w-6 h-1.5 bg-[#451f08]/20 rounded-r-full shadow-inner" />
                <div className="absolute top-2 right-[-26px] w-6 h-1.5 bg-[#451f08]/20 rounded-l-full shadow-inner" />

                {/* SVG Woven Gold Necklace Chain */}
                <svg
                  className="w-[330px] h-[115px] absolute top-0 z-10 pointer-events-none"
                  viewBox="0 0 300 100"
                >
                  <defs>
                    <linearGradient
                      id="luxuryGoldChain"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#b48325" />
                      <stop offset="20%" stopColor="#f5d77f" />
                      <stop offset="40%" stopColor="#fff3b0" />
                      <stop offset="60%" stopColor="#ffd700" />
                      <stop offset="80%" stopColor="#f5d77f" />
                      <stop offset="100%" stopColor="#b48325" />
                    </linearGradient>
                    <filter
                      id="goldGlow"
                      x="-20%"
                      y="-20%"
                      width="140%"
                      height="140%"
                    >
                      <feDropShadow
                        dx="0"
                        dy="1.5"
                        stdDeviation="1"
                        floodColor="#78450a"
                        floodOpacity="0.4"
                      />
                    </filter>
                  </defs>
                  {/* Left chain strand */}
                  <path
                    d="M 12 10 Q 150 110 150 88"
                    fill="none"
                    stroke="url(#luxuryGoldChain)"
                    strokeWidth="4"
                    strokeDasharray="2,2.5"
                    filter="url(#goldGlow)"
                  />
                  {/* Right chain strand */}
                  <path
                    d="M 288 10 Q 150 110 150 88"
                    fill="none"
                    stroke="url(#luxuryGoldChain)"
                    strokeWidth="4"
                    strokeDasharray="2,2.5"
                    filter="url(#goldGlow)"
                  />
                </svg>

                {/* PENDANT CONTAINER (Natural Gravity Swing & Hover Interactivity) */}
                <div className="absolute top-[72px] z-20 flex flex-col items-center animate-swing group cursor-pointer">
                  {/* Gold Jewelry Bail / Hook with Bezel Detail */}
                  <div className="w-4 h-10 bg-gradient-to-b from-[#fff2b2] via-[#e5b838] to-[#996f12] rounded-t-sm border border-[#b88c1b] shadow-sm mb-[-11px] z-30 relative flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-xs" />
                  </div>

                  {/* MASTERPIECE ROTATING SUNFLOWER PENDANT */}
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_12px_24px_rgba(161,98,7,0.35)]">
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full animate-spin-slow"
                    >
                      <defs>
                        {/* Outer Petal Gradient: Sunlit Gold */}
                        <linearGradient
                          id="sunlitPetalGrad1"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#fff9c4" />
                          <stop offset="25%" stopColor="#ffd600" />
                          <stop offset="70%" stopColor="#ff9100" />
                          <stop offset="100%" stopColor="#e65100" />
                        </linearGradient>

                        {/* Inner Petal Gradient: Deep Saffron */}
                        <linearGradient
                          id="sunlitPetalGrad2"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#fff176" />
                          <stop offset="35%" stopColor="#ffb300" />
                          <stop offset="100%" stopColor="#bf360c" />
                        </linearGradient>

                        {/* Seed Center Texture (Fibonacci Inspired) */}
                        <pattern
                          id="seedGridGold"
                          width="6"
                          height="6"
                          patternUnits="userSpaceOnUse"
                        >
                          <rect width="6" height="6" fill="#1f0e06" />
                          <rect
                            x="0.5"
                            y="0.5"
                            width="5"
                            height="5"
                            fill="#301509"
                            stroke="#5c2910"
                            strokeWidth="0.5"
                          />
                          <circle
                            cx="3"
                            cy="3"
                            r="1.2"
                            fill="#d97706"
                            opacity="0.9"
                          />
                        </pattern>

                        <radialGradient
                          id="centerDomeShadow"
                          cx="38%"
                          cy="38%"
                          r="62%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#54230c"
                            stopOpacity="0.25"
                          />
                          <stop
                            offset="65%"
                            stopColor="#1c0b04"
                            stopOpacity="0.85"
                          />
                          <stop
                            offset="100%"
                            stopColor="#080201"
                            stopOpacity="0.98"
                          />
                        </radialGradient>
                      </defs>

                      <g transform="translate(100, 100)">
                        {/* Layer 1: 18 Outer Pointed Petals */}
                        {[
                          0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220,
                          240, 260, 280, 300, 320, 340,
                        ].map((angle) => (
                          <g
                            key={`outer-petal-${angle}`}
                            transform={`rotate(${angle})`}
                          >
                            <path
                              d="M 0,-93 C 15,-72 18,-38 8,-24 C 0,-28 -8,-28 -8,-24 C -18,-38 -15,-72 0,-93 Z"
                              fill="url(#sunlitPetalGrad1)"
                              stroke="#c26300"
                              strokeWidth="0.8"
                            />
                            {/* Petal Spine Highlight */}
                            <path
                              d="M 0,-88 L 0,-32"
                              stroke="#fff3b0"
                              strokeWidth="1.2"
                              opacity="0.85"
                            />
                          </g>
                        ))}

                        {/* Layer 2: 18 Interleaved Inner Petals */}
                        {[
                          10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230,
                          250, 270, 290, 310, 330, 350,
                        ].map((angle) => (
                          <g
                            key={`inner-petal-${angle}`}
                            transform={`rotate(${angle})`}
                          >
                            <path
                              d="M 0,-86 C 13,-66 15,-36 6,-24 C 0,-27 -6,-27 -6,-24 C -15,-36 -13,-66 0,-86 Z"
                              fill="url(#sunlitPetalGrad2)"
                              stroke="#ad4300"
                              strokeWidth="0.6"
                            />
                          </g>
                        ))}

                        {/* Center Textured Seed Disk */}
                        <circle
                          r="32"
                          fill="url(#seedGridGold)"
                          stroke="#4a1f0a"
                          strokeWidth="2.5"
                        />
                        {/* 3D Convex Dome Shading */}
                        <circle r="32" fill="url(#centerDomeShadow)" />
                        {/* Outer Dark Gold Bezel */}
                        <circle
                          r="33"
                          fill="none"
                          stroke="#e5a122"
                          strokeWidth="1"
                          opacity="0.75"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* ROMANTIC CALLIGRAPHIC LOVE LETTER (Deep Espresso Ink) */}
              <div className="w-full px-2 sm:px-3 pt-2 pb-1 flex flex-col items-center">
                {/* Decorative gold quote mark */}
                <span className="text-amber-500/50 text-2xl font-serif-luxury leading-none select-none">
                  “
                </span>

                <p className="font-cursive text-2xl sm:text-[27px] text-[#29160d] leading-[1.3] tracking-wide antialiased my-1 drop-shadow-2xs">
                  Vi esta flor y pensé en ti porque es bonita; en realidad a mí
                  no me gusta, pero creí que a ti sí te gustaría... porque tú sí
                  eres bonita.
                </p>

                {/* Elegant sunflower separator flourish */}
                <div className="flex items-center justify-center gap-2 text-amber-500/80 py-1 select-none">
                  <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-amber-400" />
                  <span className="text-sm">🌻</span>
                  <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-amber-400" />
                </div>

                <span className="text-[11px] font-cinzel font-semibold tracking-[0.2em] text-amber-900/80 uppercase mt-0.5">
                  Con todo mi amor
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
