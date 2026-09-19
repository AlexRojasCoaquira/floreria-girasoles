"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function CartaPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [hearts, setHearts] = useState<
    { id: number; left: number; delay: number; size: number }[]
  >([]);

  useEffect(() => {
    // Generate floating petals / stars when opened
    if (isOpen) {
      const generated = Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        left: Math.random() * 95,
        delay: Math.random() * 2,
        size: Math.random() * 14 + 12,
      }));
      setHearts(generated);
      const timer = setTimeout(() => setShowCard(true), 400);
      return () => clearTimeout(timer);
    } else {
      setShowCard(false);
      setHearts([]);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f5ede3] via-[#faefe6] to-[#ebded0] flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden select-none font-sans">
      {/* Google Fonts link for cursive typography */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Cinzel:wght@700&family=Great+Vibes&family=Playfair+Display:ital,wght@1,600&display=swap");

        .font-handwriting {
          font-family: "Caveat", cursive;
        }
        .font-shrek {
          font-family:
            system-ui,
            -apple-system,
            sans-serif;
          font-weight: 900;
          letter-spacing: 0.05em;
          text-shadow:
            2px 2px 0px #24570d,
            -1px -1px 0px #bbf573,
            0 4px 10px rgba(0, 0, 0, 0.3);
        }

        /* 3D Envelope perspective */
        .envelope-wrapper {
          perspective: 1200px;
        }

        @keyframes swing {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        .animate-swing {
          transform-origin: top center;
          animation: swing 3.5s ease-in-out infinite;
        }

        @keyframes spin-slow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }

        @keyframes float-up {
          0% {
            transform: translateY(100vh) scale(0.6) rotate(0deg);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-20vh) scale(1.1) rotate(360deg);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float-up 6s ease-in infinite;
        }
      `}</style>

      {/* Background Floating Petals */}
      {isOpen && (
        <div className="fixed inset-0 pointer-events-none z-10">
          {hearts.map((h) => (
            <span
              key={h.id}
              className="absolute text-yellow-400 animate-float drop-shadow-sm"
              style={{
                left: `${h.left}%`,
                bottom: "-20px",
                animationDelay: `${h.delay}s`,
                fontSize: `${h.size}px`,
              }}
            >
              {h.id % 3 === 0 ? "🌻" : h.id % 3 === 1 ? "✨" : "💛"}
            </span>
          ))}
        </div>
      )}

      {/* Header controls */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-medium border border-stone-200 transition shadow-2xs"
        >
          ← Volver
        </Link>
        <Link
          href="/corazon-astro"
          className="inline-flex items-center gap-1.5 text-pink-700 hover:text-pink-900 bg-pink-50/80 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-xs font-medium border border-pink-200 transition shadow-2xs"
        >
          🪐 Corazón Astro
        </Link>
      </div>

      {/* Interactive Container */}
      <div className="w-full max-w-lg flex flex-col items-center justify-center my-auto py-8">
        {/* Envelope & Letter Container */}
        <div className="envelope-wrapper relative w-[320px] sm:w-[380px] flex justify-center items-center">
          {/* ENVELOPE (Visible when closed or animated when opened) */}
          <div
            onClick={handleToggle}
            className={`relative w-full h-[230px] sm:h-[260px] cursor-pointer transition-all duration-700 select-none ${
              isOpen
                ? "scale-95 translate-y-32 sm:translate-y-40 opacity-30 hover:opacity-80"
                : "scale-100 hover:scale-105 shadow-2xl"
            }`}
          >
            {/* Envelope Back Body */}
            <div className="absolute inset-0 bg-[#d97736] rounded-2xl shadow-xl overflow-hidden border border-[#b85b1e]">
              <div className="w-full h-full bg-gradient-to-br from-[#e08343] to-[#c46524]" />
            </div>

            {/* Envelope Front Flaps (Left, Right, Bottom) */}
            <div
              className="absolute inset-0 z-20 pointer-events-none"
              style={{
                clipPath: "polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 55%)",
                background:
                  "linear-gradient(135deg, #d37130 0%, #be5d1b 50%, #ad5215 100%)",
              }}
            />

            {/* Envelope Top Flap (Animated opening) */}
            <div
              className="absolute top-0 left-0 right-0 h-1/2 z-30 transition-transform duration-700 origin-top rounded-t-2xl"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: isOpen
                  ? "linear-gradient(180deg, #c76624 0%, #b05316 100%)"
                  : "linear-gradient(180deg, #e48747 0%, #cc6f2b 100%)",
                transform: isOpen ? "rotateX(180deg)" : "rotateX(0deg)",
              }}
            />

            {/* Wax Seal / Heart Button */}
            {!isOpen && (
              <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-red-900 border-2 border-red-300/40 shadow-lg flex items-center justify-center text-white text-lg transform hover:scale-110 active:scale-95 transition">
                  🌻
                </div>
                <span className="text-[10px] font-bold text-white/90 mt-1 uppercase tracking-widest drop-shadow-md">
                  Abrir
                </span>
              </div>
            )}
          </div>

          {/* THE CARD / LETTER (SLIDES OUT & GROWS) */}
          <div
            className={`fixed sm:absolute z-50 transition-all duration-700 ease-out origin-center flex flex-col items-center ${
              isOpen && showCard
                ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                : isOpen
                  ? "opacity-80 scale-75 -translate-y-16 pointer-events-none"
                  : "opacity-0 scale-50 translate-y-20 pointer-events-none hidden"
            }`}
          >
            {/* PHYSICAL SHREK CARD */}
            <div className="w-[310px] sm:w-[350px] bg-white rounded-xl shadow-2xl p-6 sm:p-7 border border-stone-200/90 relative flex flex-col items-center text-center">
              {/* Close mini button */}
              <button
                onClick={handleToggle}
                className="absolute top-3 right-3 text-stone-300 hover:text-stone-600 text-xs w-6 h-6 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center transition cursor-pointer"
                title="Cerrar carta"
              >
                ✕
              </button>

              {/* SHREK OFFICIAL LOGO */}
              <div className="relative w-full flex justify-center items-center  px-4">
                <Image
                  src="/Shrek-Logo.png"
                  alt="DreamWorks Shrek Logo"
                  width={240}
                  height={90}
                  priority
                  className="w-48 sm:w-56 h-auto object-contain drop-shadow-sm"
                />
              </div>

              {/* JEWELRY DISPLAY AREA WITH CHAIN & ROTATING SUNFLOWER PENDANT */}
              <div className="w-full relative h-[210px] sm:h-[225px] flex justify-center items-start mb-3">
                {/* Card side cuts/holes for necklace chain */}
                <div className="absolute top-2 left-[-28px] w-5 h-1 bg-stone-300 rounded-r-full" />
                <div className="absolute top-2 right-[-28px] w-5 h-1 bg-stone-300 rounded-l-full" />

                {/* SVG Gold Necklace Chain */}
                <svg
                  className="w-[320px] h-[110px] absolute top-0 z-10 pointer-events-none"
                  viewBox="0 0 300 100"
                >
                  <defs>
                    <linearGradient
                      id="goldChain"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#cf9f38" />
                      <stop offset="25%" stopColor="#ffd700" />
                      <stop offset="50%" stopColor="#ffe680" />
                      <stop offset="75%" stopColor="#ffd700" />
                      <stop offset="100%" stopColor="#cf9f38" />
                    </linearGradient>
                  </defs>
                  {/* Left chain strand */}
                  <path
                    d="M 10 10 Q 150 105 150 85"
                    fill="none"
                    stroke="url(#goldChain)"
                    strokeWidth="4.5"
                    strokeDasharray="2,2"
                    className="drop-shadow-xs"
                  />
                  {/* Right chain strand */}
                  <path
                    d="M 290 10 Q 150 105 150 85"
                    fill="none"
                    stroke="url(#goldChain)"
                    strokeWidth="4.5"
                    strokeDasharray="2,2"
                    className="drop-shadow-xs"
                  />
                </svg>

                {/* PENDANT CONTAINER (Interactivity & Swing) */}
                <div className="absolute top-[70px] z-20 flex flex-col items-center animate-swing group cursor-pointer">
                  {/* Gold Bail / Hook */}
                  <div className="w-3.5 h-10 bg-gradient-to-b from-[#ffe57f] via-[#d4af37] to-[#8c6b12] rounded-t-sm border border-[#a88219] shadow-sm mb-[-10px] z-30" />

                  {/* LARGE ROTATING SUNFLOWER (SVG High-Definition Petals) */}
                  <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 drop-shadow-xl">
                    <svg
                      viewBox="0 0 200 200"
                      className="w-full h-full animate-spin-slow"
                    >
                      <defs>
                        {/* Outer Petal Gradient */}
                        <linearGradient
                          id="petalGrad1"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#fff176" />
                          <stop offset="30%" stopColor="#ffd600" />
                          <stop offset="70%" stopColor="#ffab00" />
                          <stop offset="100%" stopColor="#ff8f00" />
                        </linearGradient>

                        {/* Inner Petal Gradient */}
                        <linearGradient
                          id="petalGrad2"
                          x1="0%"
                          y1="0%"
                          x2="0%"
                          y2="100%"
                        >
                          <stop offset="0%" stopColor="#ffee58" />
                          <stop offset="40%" stopColor="#fbc02d" />
                          <stop offset="100%" stopColor="#e65100" />
                        </linearGradient>

                        {/* Seed Center Texture */}
                        <pattern
                          id="seedGrid"
                          width="6"
                          height="6"
                          patternUnits="userSpaceOnUse"
                        >
                          <rect width="6" height="6" fill="#1b0e07" />
                          <rect
                            x="0.5"
                            y="0.5"
                            width="5"
                            height="5"
                            fill="#2d170b"
                            stroke="#4e2c17"
                            strokeWidth="0.5"
                          />
                          <circle
                            cx="3"
                            cy="3"
                            r="1.2"
                            fill="#8d5638"
                            opacity="0.8"
                          />
                        </pattern>

                        <radialGradient
                          id="centerShade"
                          cx="40%"
                          cy="40%"
                          r="60%"
                        >
                          <stop
                            offset="0%"
                            stopColor="#3d1f0f"
                            stopOpacity="0.3"
                          />
                          <stop
                            offset="70%"
                            stopColor="#120803"
                            stopOpacity="0.8"
                          />
                          <stop
                            offset="100%"
                            stopColor="#080301"
                            stopOpacity="0.95"
                          />
                        </radialGradient>
                      </defs>

                      <g transform="translate(100, 100)">
                        {/* Layer 1: 18 Outer Petals (Pointed & Wide) */}
                        {[
                          0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220,
                          240, 260, 280, 300, 320, 340,
                        ].map((angle) => (
                          <g
                            key={`outer-${angle}`}
                            transform={`rotate(${angle})`}
                          >
                            {/* Petal shape extending from center out to 92px */}
                            <path
                              d="M 0,-92 C 14,-72 17,-38 8,-24 C 0,-28 -8,-28 -8,-24 C -17,-38 -14,-72 0,-92 Z"
                              fill="url(#petalGrad1)"
                              stroke="#e68a00"
                              strokeWidth="0.75"
                            />
                            {/* Petal central groove/vein */}
                            <path
                              d="M 0,-86 L 0,-34"
                              stroke="#ffb300"
                              strokeWidth="1.2"
                              opacity="0.8"
                            />
                          </g>
                        ))}

                        {/* Layer 2: 18 Inner Secondary Petals (Interleaved at 10deg) */}
                        {[
                          10, 30, 50, 70, 90, 110, 130, 150, 170, 190, 210, 230,
                          250, 270, 290, 310, 330, 350,
                        ].map((angle) => (
                          <g
                            key={`inner-${angle}`}
                            transform={`rotate(${angle})`}
                          >
                            <path
                              d="M 0,-85 C 12,-66 14,-36 6,-24 C 0,-27 -6,-27 -6,-24 C -14,-36 -12,-66 0,-85 Z"
                              fill="url(#petalGrad2)"
                              stroke="#d97706"
                              strokeWidth="0.5"
                            />
                          </g>
                        ))}

                        {/* Center Dark Textured Seed Disk */}
                        <circle
                          r="32"
                          fill="url(#seedGrid)"
                          stroke="#45220e"
                          strokeWidth="2.5"
                        />
                        {/* Radial Shadow overlay for 3D convex dome look */}
                        <circle r="32" fill="url(#centerShade)" />
                        {/* Outer dark rim */}
                        <circle
                          r="33"
                          fill="none"
                          stroke="#1a0a03"
                          strokeWidth="1"
                          opacity="0.6"
                        />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>

              {/* HANDWRITTEN QUOTE IN SPANISH */}
              <div className="px-2 pt-2 pb-1 space-y-1">
                <p className="font-handwriting text-xl sm:text-2xl text-stone-900 leading-[1.35] tracking-wide antialiased">
                  Vi esta flor y pensé en ti porque es bonita, en realidad a mi
                  no me gusta, pero creí que a ti si te gustaría, porque tu si
                  eres bonita
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
