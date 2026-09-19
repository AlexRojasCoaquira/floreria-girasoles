import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-b from-rose-50/50 via-stone-50 to-emerald-50/30 text-stone-800">
      <div className="max-w-2xl text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-medium">
          🌸 Jazmín Florería
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-light tracking-tight text-stone-900">
          Belleza & Elegancia Floral
        </h1>
        <p className="text-lg text-stone-600 max-w-lg mx-auto leading-relaxed">
          Diseñamos momentos inolvidables con las flores más frescas y arreglos exclusivos para cada ocasión.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href="/carta"
            className="px-6 py-3 rounded-full bg-stone-900 text-white font-medium hover:bg-stone-800 transition shadow-sm hover:shadow"
          >
            Ver Carta / Catálogo 💐
          </Link>
          <Link
            href="/corazon-astro"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-purple-700 via-pink-600 to-rose-600 text-white font-medium hover:opacity-90 transition shadow-md hover:shadow-lg shadow-pink-500/20"
          >
            🪐 Corazón Astro ✨
          </Link>
        </div>
      </div>
    </main>
  );
}
