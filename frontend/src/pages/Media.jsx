import { Link } from "react-router-dom";

export default function Media() {
  const categories = [
    "All",
    "Desktop",
    "Mobile",
    "Characters",
    "Vehicles",
    "Locations",
    "Artwork",
  ];

  const placeholders = Array.from({ length: 12 });

  return (
    <div className="min-h-screen bg-[#090909] text-white">

      {/* NAVBAR */}
      <header className="border-b border-white/5 backdrop-blur">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">

          <Link
            to="/"
            className="text-3xl font-bold tracking-tight"
          >
            <span className="text-white">VICE</span>
            <span className="text-[#ff7b54]">HUB</span>
          </Link>

          <div className="flex items-center gap-8 text-white/70">

            <Link
              to="/"
              className="hover:text-white transition"
            >
              Home
            </Link>

            <Link
              to="/blog"
              className="hover:text-white transition"
            >
              Blog
            </Link>

            <button className="px-6 py-3 rounded-full bg-[#ff7b54] text-black font-semibold hover:scale-105 transition">
              Join Waitlist
            </button>

          </div>
        </div>
      </header>

      {/* HERO */}

<section className="max-w-7xl mx-auto px-8 pt-16">

    <p className="uppercase tracking-[0.4em] text-[#ff7b54] text-sm font-semibold">
        ViceHub Media
    </p>

    <div className="mt-6 grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT */}

        <div>

            <h1 className="text-6xl lg:text-7xl font-bold leading-[1.05]">

                GTA 6

                <br />

                Wallpapers

            </h1>

            <p className="mt-6 text-white/60 text-xl leading-relaxed max-w-xl">

                Download premium GTA 6 wallpapers for Desktop,
                Mobile and Ultrawide in the highest quality.

            </p>

            <div className="flex flex-wrap gap-4 mt-10">

                <button className="px-7 py-4 rounded-full bg-[#ff7b54] text-black font-semibold hover:scale-105 transition">

                    Browse Wallpapers

                </button>

                <button className="px-7 py-4 rounded-full border border-white/10 hover:border-[#ff7b54]">

                    Latest Uploads

                </button>

            </div>

        </div>

        {/* FEATURED */}

        <div>

            <div className="relative rounded-[32px] overflow-hidden border border-white/10 bg-[#141414] aspect-[16/10]">

                <div className="absolute inset-0 bg-gradient-to-br from-[#202020] via-[#151515] to-[#090909]" />

                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black/70 to-transparent">

                    <span className="px-4 py-2 rounded-full bg-[#ff7b54] text-black text-sm font-semibold">

                        FEATURED

                    </span>

                    <h3 className="text-3xl font-bold mt-5">

                        Lucia — Sunset in Vice City

                    </h3>

                    <p className="text-white/60 mt-2">

                        4K • Desktop • 3840×2160

                    </p>

                </div>

            </div>

        </div>

    </div>

</section>

      {/* FILTERS */}

      <section className="max-w-7xl mx-auto px-8 mt-16 flex flex-wrap gap-4">

        {categories.map((item, index) => (

          <button
            key={item}
            className={`px-6 py-3 rounded-full border transition ${
              index === 0
                ? "bg-[#ff7b54] text-black border-[#ff7b54]"
                : "border-white/10 text-white/70 hover:border-[#ff7b54] hover:text-white"
            }`}
          >
            {item}
          </button>

        ))}

      </section>

      {/* GALLERY */}

     <section className="max-w-7xl mx-auto px-8 py-20">

    <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-7">

        {placeholders.map((_, index) => (

            <div
                key={index}
                className="group overflow-hidden rounded-[28px] bg-[#141414] border border-white/5 cursor-pointer"
            >

                <div className="aspect-[4/5] bg-gradient-to-br from-[#242424] via-[#171717] to-[#101010] relative overflow-hidden">

                    <div className="absolute inset-0 group-hover:scale-110 transition duration-700 bg-gradient-to-br from-transparent via-[#ff7b5410] to-transparent"/>

                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/70 to-transparent">

                        <span className="text-xs text-[#ff7b54]">

                            4K WALLPAPER

                        </span>

                        <h3 className="text-lg font-semibold mt-2">

                            Wallpaper {index + 1}

                        </h3>

                        <p className="text-white/50 text-sm">

                            3840 × 2160

                        </p>

                    </div>

                </div>

            </div>

        ))}

    </div>

</section>

    </div>
  );
}