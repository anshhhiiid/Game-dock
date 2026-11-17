import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/ProductCart";

function Home() {
  const dispatch = useDispatch();

  const { products, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = [
    {
      name: "PlayStation",
      description: "Explore PlayStation consoles",
      path: "/consoles?brand=Sony",
      image: "/images/pscover.png",
      color: "from-blue-950/90 via-blue-900/30",
    },
    {
      name: "Xbox",
      description: "Discover Xbox gaming",
      path: "/consoles?brand=Microsoft",
      image: "/images/xcover.png",
      color: "from-green-950/90 via-green-900/30",
    },
    {
      name: "Nintendo",
      description: "Play anywhere, anytime",
      path: "/consoles?brand=Nintendo",
      image: "/images/switch 2lmtd.png",
      color: "from-red-950/90 via-red-900/30",
    },
    {
      name: "Games",
      description: "Discover legendary games",
      path: "/games",
      image: "/images/games.png",
      color: "from-purple-950/90 via-purple-900/30",
    },
  ];
const featuredProducts = products.filter((product) =>
  [1, 6, 12, 18].includes(Number(product.id))
);
  return (
    <div className="bg-[#100E1B] text-white min-h-screen">
<main className="pt-20">
  {/* Your homepage sections */}

      {/* HERO SECTION */}

      <section className="relative min-h-[550px] flex items-center overflow-hidden rounded-3xl mx-4 md:mx-10 my-6">

        <img
          src="/images/GAME_DOCK.png"
          alt="Gaming Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#100E1B]/95 via-purple-950/70 to-purple-900/30"></div>

        <div className="relative z-10 px-8 md:px-16 py-20 max-w-2xl">

          <p className="text-purple-300 uppercase tracking-[4px] text-sm font-semibold mb-5">
            Welcome to Game Dock
          </p>

          <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
            Level Up Your
            <span className="block text-purple-400">
              Gaming World
            </span>
          </h1>

          <p className="text-gray-300 mt-6 text-base md:text-lg leading-relaxed">
            Discover the latest gaming consoles, accessories and
            legendary games. Your ultimate gaming destination starts here.
          </p>

          <Link
            to="/consoles"
            className="inline-flex items-center gap-3 mt-8 px-8 py-3.5
            rounded-xl bg-white/10 backdrop-blur-xl
            border border-white/30 text-white font-semibold
            shadow-lg shadow-purple-900/30
            hover:bg-purple-500/30 hover:border-purple-300/70
            hover:scale-105 active:scale-95
            transition-all duration-300"
          >
            Shop Now
            <span className="text-xl">→</span>
          </Link>

        </div>
      </section>

      {/* CATEGORY SECTION */}

      <section className="px-6 md:px-16 py-12">

        <div className="flex justify-between items-center mb-8">

          <div>
            <p className="text-purple-400 text-sm font-semibold tracking-widest">
              EXPLORE COLLECTIONS
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              Shop By Category
            </h2>
          </div>

          <Link
            to="/consoles"
            className="text-purple-400 hover:text-purple-300 transition"
          >
            View All →
          </Link>

        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {categories.map((category) => (

            <Link
              to={category.path}
              key={category.name}
              className="relative h-64 rounded-2xl overflow-hidden group
              border border-[#30283F] shadow-lg shadow-purple-950/20
              hover:border-purple-500/60 hover:shadow-purple-900/40
              transition-all duration-300 hover:-translate-y-2"
            >

              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-cover
                group-hover:scale-110 transition-transform duration-700"
              />

              <div
                className={`absolute inset-0 bg-gradient-to-t ${category.color} to-transparent`}
              ></div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>

              <div className="absolute bottom-0 left-0 p-6 w-full">

                <h3 className="text-2xl font-extrabold text-white mb-2
                group-hover:text-purple-300 transition">
                  {category.name}
                </h3>

                <p className="text-gray-300 text-sm">
                  {category.description}
                </p>

                <span className="inline-block mt-4 text-purple-400
                text-sm font-semibold group-hover:translate-x-2
                transition-transform duration-300">
                  Explore Collection →
                </span>

              </div>

            </Link>

          ))}

        </div>
      </section>

      {/* FEATURED PRODUCTS */}

      <section className="px-6 md:px-16 py-16">

        <p className="text-purple-400 text-sm font-semibold">
          HANDPICKED FOR YOU
        </p>

        <h2 className="text-3xl font-bold text-white mb-8">
          Featured Products
        </h2>

        {loading && (
          <p className="text-gray-400">
            Loading products...
          </p>
        )}

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        {!loading && !error && (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

           {featuredProducts.map((product) => (
  <ProductCard
    key={product.id}
    product={product}
  />
))}

          </div>

        )}

      </section>
</main>
    </div>
  );
}

export default Home;
