"use client";

import React, { useEffect, useState } from "react";

// ---------------- PIE CHART IMPORTS ----------------
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// ---------------- TYPE ----------------
interface TCOData {
  [key: string]: number;
}

// ---------------- COST STRUCTURE ----------------
const costStructure: Record<string, [string, string][]> = {
  "Operating Costs per km": [
    ["fuel", "Fuel / Energy"],
    ["adblue", "AdBlue"],
    ["tires", "Tires"],
    ["lubricant", "Lubricant"],
    ["toll", "Toll"],
  ],
  "Fixed Vehicle Costs per Period": [
    ["leasing", "Leasing"],
    ["vehicle_tax", "Vehicle Tax"],
    ["insurance", "Insurance"],
    ["inspection", "Inspection"],
    ["maintenance", "Maintenance"],
    ["repairs", "Repairs"],
    ["small_parts", "Small Parts"],
    ["cleaning", "Cleaning"],
    ["garage", "Garage"],
    ["onboard_system", "Onboard System Maint."],
  ],
  "One-time Costs (Allocated)": [
    ["transfer", "Delivery"],
    ["registration", "Registration"],
    ["commissioning", "Commissioning"],
    ["return", "Return Cost"],
  ],
  "Personnel Costs": [["driver", "Driver Salary"]],
  "Administrative Costs": [
    ["admin_partial", "Admin Partial"],
    ["admin_general", "General Admin"],
  ],
  "Autonomous Costs": [
    ["ad_license", "AD License"],
    ["steward", "Steward"],
    ["tech_supervision", "Tech Supervision"],
  ],
};

// ---------------- CELL COLOR LOGIC ----------------
const getCellColor = (i: number, b: number, a: number) => {
  if (i === b && b === a) return "bg-gray-200"; // all equal

  let cls = "";

  if (b > i) cls += " bg-blue-100";
  if (a > i) cls += " bg-red-100";
  if (i > b || i > a) cls += " bg-yellow-100";

  return cls;
};

// ---------------- PIE DATA BUILDER ----------------
const toPieData = (title: string, data: TCOData) => ({
  labels: Object.keys(data).filter((k) => k !== "total"),
  datasets: [
    {
      label: title,
      data: Object.keys(data)
        .filter((k) => k !== "total")
        .map((k) => data[k]),
      backgroundColor: [
        "#4F81BD", "#C0504D", "#9BBB59", "#8064A2",
        "#4BACC6", "#F79646", "#92A9CF", "#D99694",
        "#8DB3E2", "#E6B8B7",
      ],
    },
  ],
});

// ---------------- MAIN COMPONENT ----------------
export default function ComparisonPage() {
  const [ice, setIce] = useState<TCOData | null>(null);
  const [bev, setBev] = useState<TCOData | null>(null);
  const [bevAd, setBevAd] = useState<TCOData | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Load sessionStorage data
  useEffect(() => {
    const i = sessionStorage.getItem("tco_ice");
    const b = sessionStorage.getItem("tco_bev");
    const a = sessionStorage.getItem("tco_bev_ad");

    if (i) setIce(JSON.parse(i));
    if (b) setBev(JSON.parse(b));
    if (a) setBevAd(JSON.parse(a));

    setLoaded(true);
  }, []);

  if (!loaded) return <div className="p-10 text-xl">Loading…</div>;

  if (!ice || !bev || !bevAd) {
    return (
      <div className="p-10 text-xl text-red-600">
        ⚠ Please calculate ICE, BEV, and BEV-AD TCO first.
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-4">📊 TCO Comparison</h1>
      <p className="text-lg mb-10 text-gray-600">
        Cost comparison across ICE, BEV and BEV-AD. Color highlights show differences clearly.
      </p>

      {/* ---------------- TABLE ---------------- */}
      <div className="overflow-x-auto rounded-xl shadow-xl bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 w-1/3 text-left text-lg">Cost Category</th>
              <th className="p-4 w-1/6 text-left text-lg">ICE</th>
              <th className="p-4 w-1/6 text-left text-lg">BEV</th>
              <th className="p-4 w-1/6 text-left text-lg">BEV-AD</th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(costStructure).map(([cat, items]) => (
              <React.Fragment key={cat}>
                {/* Category Row */}
                <tr>
                  <td colSpan={4} className="bg-gray-200 p-3 text-xl font-bold">
                    📘 {cat}
                  </td>
                </tr>

                {/* Cost Rows */}
                {items.map(([key, label]) => {
                  const i = ice[key] ?? 0;
                  const b = bev[key] ?? 0;
                  const a = bevAd[key] ?? 0;

                  return (
                    <tr key={key} className="border-b">
                      <td className="p-3 font-medium">{label}</td>
                      <td className={`p-3 ${getCellColor(i, b, a)}`}>{i.toFixed(2)} €</td>
                      <td className={`p-3 ${getCellColor(i, b, a)}`}>{b.toFixed(2)} €</td>
                      <td className={`p-3 ${getCellColor(i, b, a)}`}>{a.toFixed(2)} €</td>
                    </tr>
                  );
                })}
              </React.Fragment>
            ))}

            {/* TOTAL ROW */}
            <tr className="bg-green-100 font-bold">
              <td className="p-3 text-xl">TOTAL Cost per Umlauf</td>
              <td className="p-3">{ice.total.toFixed(2)} €</td>
              <td className="p-3">{bev.total.toFixed(2)} €</td>
              <td className="p-3">{bevAd.total.toFixed(2)} €</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ---------------- PIE CHARTS ---------------- */}
      <h2 className="text-3xl font-bold mt-16 mb-6">🥧 Cost Composition</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-8">
        {/* ICE */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-center text-xl font-bold mb-4">ICE Bus</h3>
          <Pie data={toPieData("ICE", ice)} />
        </div>

        {/* BEV */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-center text-xl font-bold mb-4">BEV Bus</h3>
          <Pie data={toPieData("BEV", bev)} />
        </div>

        {/* BEV-AD */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-center text-xl font-bold mb-4">BEV-AD Bus</h3>
          <Pie data={toPieData("BEV-AD", bevAd)} />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-10 p-6 bg-blue-50 border rounded-xl text-lg">
        ✔ Blue = BEV higher  
        ✔ Red = BEV-AD higher  
        ✔ Yellow = ICE higher  
        ✔ Grey = All equal  
      </div>
    </div>
  );
}
