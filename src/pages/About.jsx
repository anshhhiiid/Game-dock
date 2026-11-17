import React from "react";
import { Link } from "react-router-dom";

import {
  Gamepad2,
  Target,
  Eye,
  ShoppingBag,
  ShieldCheck,
  Truck,
  Headphones,
  Zap,
  Monitor,
  Joystick,
  Trophy,
  ArrowRight,
  Heart,
  Sparkles,
} from "lucide-react";

function About() {
  const features = [
    {
      icon: ShieldCheck,
      title: "Trusted Products",
      description:
        "Explore gaming consoles, games, and accessories from recognized gaming brands.",
    },
    {
      icon: ShoppingBag,
      title: "Easy Shopping",
      description:
        "Enjoy a simple and smooth shopping experience with an easy-to-use platform.",
    },
    {
      icon: Truck,
      title: "Reliable Delivery",
      description:
        "We aim to make getting your favourite gaming products convenient and hassle-free.",
    },
    {
      icon: Headphones,
      title: "Customer Support",
      description:
        "We're here to help you with product questions and shopping-related support.",
    },
  ];

  const categories = [
    {
      icon: Gamepad2,
      title: "Gaming Consoles",
      description: "PlayStation, Xbox, Nintendo and more.",
    },
    {
      icon: Monitor,
      title: "Gaming Accessories",
      description: "Controllers, headsets and gaming gear.",
    },
    {
      icon: Joystick,
      title: "Video Games",
      description: "Discover games across different platforms.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#100E1B] text-white">

      {/* HERO SECTION */}

      <section className="relative overflow-hidden px-4 pt-32 pb-24 md:px-8">

        {/* Background Effects */}

        <div className="absolute -top-32 -right-20 w-96 h-96 bg-purple-700/20 blur-[120px] rounded-full"></div>

        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-purple-500/10 blur-[100px] rounded-full"></div>

        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-14">

          {/* LEFT CONTENT */}

          <div>

            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 text-purple-400 px-4 py-2 rounded-full text-sm font-semibold mb-7">

              <Gamepad2 size={17} />

              LEVEL UP YOUR GAMING EXPERIENCE

            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-7">

              MORE THAN
              <br />

              JUST A{" "}

              <span className="text-purple-500">
                GAME
              </span>

              <br />

              IT'S A LIFESTYLE.

            </h1>

            <p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl mb-9">

              Welcome to GAME DOCK, your destination for gaming consoles,
              video games, and accessories. We're here to bring gamers
              closer to the products they love.

            </p>

            <div className="flex flex-wrap gap-4">

              <Link
                to="/products"
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-7 py-4 rounded-xl font-semibold transition"
              >
                Explore Products

                <ArrowRight size={19} />
              </Link>

              <Link
                to="/contact"
                className="border border-[#504466] hover:bg-[#211B32] px-7 py-4 rounded-xl font-semibold transition"
              >
                Contact Us
              </Link>

            </div>

          </div>

          {/* RIGHT VISUAL */}

          <div className="relative">

            <div className="absolute inset-0 bg-purple-600/20 blur-[90px] rounded-full"></div>

            <div className="relative bg-gradient-to-br from-[#29213F] to-[#171426] border border-[#45365E] rounded-3xl p-8 md:p-12 overflow-hidden">

              <div className="absolute -right-10 -top-10 opacity-5">
                <Gamepad2 size={300} />
              </div>

              <div className="relative">

                <div className="w-20 h-20 bg-purple-600/20 border border-purple-500/30 rounded-2xl flex items-center justify-center mb-10">

                  <Gamepad2
                    size={45}
                    className="text-purple-400"
                  />

                </div>

                <p className="text-purple-400 font-semibold text-sm tracking-widest mb-4">
                  WELCOME TO
                </p>

                <h2 className="text-4xl md:text-5xl font-black tracking-wider mb-5">
                  GAME
                  <span className="text-purple-500">
                    DOCK
                  </span>
                </h2>

                <p className="text-gray-400 leading-relaxed mb-10">
                  Your gaming destination. One place. Endless possibilities.
                  Find your next favourite gaming experience here.
                </p>

                <div className="flex items-center gap-3">

                  <div className="w-10 h-1 bg-purple-500 rounded-full"></div>

                  <div className="w-3 h-1 bg-purple-500/50 rounded-full"></div>

                  <div className="w-3 h-1 bg-purple-500/30 rounded-full"></div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* OUR STORY */}

      <section className="px-4 py-20 md:px-8 bg-[#151222]">

        <div className="max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 text-purple-400 font-semibold text-sm mb-5">

            <Sparkles size={17} />

            WHO WE ARE

          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-8">

            The Story Behind{" "}
            <span className="text-purple-500">
              GAME DOCK
            </span>

          </h2>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">

            GAME DOCK is built around one simple idea: making gaming
            products easier to discover and explore. Whether you're
            looking for your next console, a favourite video game,
            or the perfect gaming accessory, we bring different
            gaming categories together in one place.

          </p>

          <p className="text-gray-400 text-base md:text-lg leading-relaxed">

            From casual players to dedicated gaming enthusiasts,
            GAME DOCK aims to create a convenient destination for
            everyone who loves gaming.

          </p>

        </div>

      </section>

      {/* MISSION AND VISION */}

      <section className="px-4 py-20 md:px-8">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">

            <p className="text-purple-400 font-semibold text-sm mb-4">
              WHAT DRIVES US
            </p>

            <h2 className="text-3xl md:text-5xl font-bold">
              Our Mission & Vision
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">

            {/* MISSION */}

            <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-8 md:p-10 hover:border-purple-500/50 transition">

              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-7">

                <Target
                  size={34}
                  className="text-purple-400"
                />

              </div>

              <h3 className="text-2xl font-bold mb-5">
                Our Mission
              </h3>

              <p className="text-gray-400 leading-relaxed">

                Our mission is to make gaming products accessible
                and easy to explore through a user-friendly shopping
                experience. We aim to help customers discover products
                that match their gaming interests.

              </p>

            </div>

            {/* VISION */}

            <div className="bg-[#171426] border border-[#30283F] rounded-2xl p-8 md:p-10 hover:border-purple-500/50 transition">

              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-7">

                <Eye
                  size={34}
                  className="text-purple-400"
                />

              </div>

              <h3 className="text-2xl font-bold mb-5">
                Our Vision
              </h3>

              <p className="text-gray-400 leading-relaxed">

                Our vision is to build a trusted gaming destination
                where gamers can discover consoles, games, and
                accessories while enjoying a smooth and enjoyable
                shopping experience.

              </p>

            </div>

          </div>

        </div>

      </section>

      {/* WHY CHOOSE US */}

      <section className="px-4 py-20 md:px-8 bg-[#151222]">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">

            <p className="text-purple-400 font-semibold text-sm mb-4">
              THE GAME DOCK DIFFERENCE
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mb-5">
              Why Choose Us?
            </h2>

            <p className="text-gray-400 max-w-2xl mx-auto">
              We're focused on making your gaming shopping experience
              simple, convenient, and enjoyable.
            </p>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {features.map((feature, index) => {

              const Icon = feature.icon;

              return (

                <div
                  key={index}
                  className="bg-[#1B182A] border border-[#30283F] rounded-2xl p-7 hover:-translate-y-2 hover:border-purple-500/50 transition duration-300"
                >

                  <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">

                    <Icon
                      size={28}
                      className="text-purple-400"
                    />

                  </div>

                  <h3 className="text-xl font-bold mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </section>

      {/* WHAT WE OFFER */}

      <section className="px-4 py-20 md:px-8">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-14">

            <p className="text-purple-400 font-semibold text-sm mb-4">
              EXPLORE THE WORLD OF GAMING
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mb-5">
              What We Offer
            </h2>

            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to explore your gaming world,
              all in one destination.
            </p>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {categories.map((category, index) => {

              const Icon = category.icon;

              return (

                <div
                  key={index}
                  className="group bg-[#171426] border border-[#30283F] rounded-2xl p-8 hover:border-purple-500/50 transition"
                >

                  <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-7 group-hover:bg-purple-600 transition">

                    <Icon
                      size={34}
                      className="text-purple-400 group-hover:text-white transition"
                    />

                  </div>

                  <h3 className="text-xl font-bold mb-3">
                    {category.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {category.description}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

      </section>

      {/* FINAL CTA */}

      <section className="px-4 py-20 md:px-8">

        <div className="max-w-7xl mx-auto">

          <div className="relative overflow-hidden bg-gradient-to-r from-purple-800 to-purple-600 rounded-3xl p-9 md:p-16 text-center">

            <div className="absolute -right-10 -top-20 opacity-10">
              <Gamepad2 size={300} />
            </div>

            <div className="relative">

              <div className="flex justify-center mb-6">
                <Heart size={38} className="text-white" />
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Level Up?
              </h2>

              <p className="text-purple-100 max-w-2xl mx-auto mb-9 leading-relaxed">
                Explore our gaming collection and discover your
                next favourite console, game, or accessory.
                Your next gaming adventure starts here!
              </p>

              <Link
                to="/products"
                className="inline-flex items-center gap-3 bg-white text-purple-700 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold transition"
              >
                Explore Collection

                <ArrowRight size={19} />

              </Link>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default About;
