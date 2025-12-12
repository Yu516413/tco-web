"use client"; 

import { useState } from "react";

export default function Home() {
  // Toggle for collapsible section
  const [open, setOpen] = useState(false);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* ===== Background Image (Animated using CSS keyframes) ===== */}
      <img
        src="/1.png"
        className="hero-bg absolute inset-0 w-full h-full object-cover"
        alt="background"
      />

      {/* ===== Dark overlay for readability ===== */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* ===== Main Hero Content ===== */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full px-6">
        <h1 className="text-6xl font-bold text-white drop-shadow-lg text-center">
          Smart Mobility TCO Platform
        </h1>

        <p className="text-2xl text-white mt-6 drop-shadow-md text-center">
          Calculate, compare and optimize the cost of bus fleets — ICE, BEV, and BEV_AD.
        </p>

        {/* ===== Start Button ===== */}
        <a
          href="/ice"
          className="mt-10 inline-block px-10 py-4 bg-white text-black rounded-xl shadow-lg hover:bg-gray-200 transition"
        >
          Start Calculation →
        </a>

        {/* ===== Collapsible Route Info Section ===== */}
        <div className="mt-16 w-full max-w-4xl">

          {/* ---- Toggle Button ---- */}
          <button
            onClick={() => setOpen(!open)}
            className="w-full bg-white/80 backdrop-blur-md border border-gray-300 px-6 py-4 rounded-xl shadow-md text-xl font-semibold flex justify-between items-center hover:bg-white"
          >
            <span>Route Information</span>
            <span>{open ? "▲" : "▼"}</span>
          </button>

          {/* ---- Collapsible Body ---- */}
          {open && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Card 1 */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold">One-way Distance</h3>
                <p className="text-gray-700 text-xl mt-1">7.2 km</p>
              </div>

              {/* Card 2 */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold">Rounds per Shift</h3>
                <p className="text-gray-700 text-xl mt-1">7</p>
              </div>

              {/* Card 3 */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold">Shifts per Day</h3>
                <p className="text-gray-700 text-xl mt-1">3</p>
              </div>

              {/* Card 4 */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold">Workdays per Week</h3>
                <p className="text-gray-700 text-xl mt-1">5</p>
              </div>

              {/* Card 5 */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold">Weeks per Year</h3>
                <p className="text-gray-700 text-xl mt-1">50</p>
              </div>

              {/* Card 6 */}
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-xl shadow-md border border-gray-200">
                <h3 className="text-lg font-semibold">Total Rounds per Year</h3>
                <p className="text-gray-700 text-xl mt-1">5250</p>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}


