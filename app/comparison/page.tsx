"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// ✅ Plotly must be dynamically imported in Next.js (no SSR)
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// ---------------- TYPE ----------------
interface TCOData {
  [key: string]: number;
}

// ---------------- COST STRUCTURE ----------------
const costStructure: Record<string, [string, string][]> = {
  "Operating Costs per km": [
    ["fuel", "Fuel / Energy Cost"],
    ["adblue", "AdBlue Cost"],
    ["tires", "Tire Cost"],
    ["lubricant", "Lubricant Cost"],
    ["toll", "Toll Fees"],
  ],
  "Fixed Vehicle Costs per Period": [
    ["leasing", "Leasing Cost"],
    ["vehicle_tax", "Vehicle Tax"],
    ["insurance", "Insurance"],
    ["inspection", "Inspection / Safety Check"],
    ["maintenance", "Maintenance Cost"],
    ["repairs", "Unplanned Repairs"],
    ["small_parts", "Small Parts & Wear Items"],
    ["cleaning", "Cleaning Cost"],
    ["garage", "Garage / Housing Cost"],
    ["onboard_system", "Onboard System Maintenance"],
  ],
  "One-time Costs (Allocated)": [
    ["transfer", "Delivery Cost"],
    ["registration", "Registration Cost"],
    ["commissioning", "Commissioning Cost"],
    ["return", "Return / End-of-Lease Cost"],
  ],
  "Personnel Costs": [["driver", "Driver Salary"]],
  "Administrative Costs": [
    ["admin_partial", "Administration (Partial)"],
    ["admin_general", "General Administration"],
  ],
  "Autonomous Operation Costs": [
    ["ad_license", "AD License Cost"],
    ["steward", "Steward Cost"],
    ["tech_supervision", "Technical Supervision"],
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

// ---------------- PIE DATA BUILDER (MATCH STREAMLIT prepare_pie) ----------------
const buildPie = (data: TCOData) => {
  const labels: string[] = [];
  const values: number[] = [];

  Object.values(costStructure).forEach((entries) => {
    entries.forEach(([key, label]) => {
      const v = data[key] ?? 0;
      if (key !== "total" && v > 0) {
        labels.push(label);
        values.push(v);
      }
    });
  });

  return { labels, values };
};

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
                     {cat}
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
              <td className="p-3">{(ice.total ?? 0).toFixed(2)} €</td>
              <td className="p-3">{(bev.total ?? 0).toFixed(2)} €</td>
              <td className="p-3">{(bevAd.total ?? 0).toFixed(2)} €</td>
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
          <div className="h-[460px]">
            <Plot
              data={[
                {
                  type: "pie",
                  ...buildPie(ice),
                  textinfo: "percent",
                  textposition: "auto",
                  marker: { line: { width: 1, color: "white" } },
                  hole: 0,
                } as any,
              ]}
              layout={{
                margin: { l: 10, r: 10, t: 10, b: 10 },
                showlegend: true,
                legend: {
                  x: 1.02,
                  y: 1,
                  xanchor: "left",
                  yanchor: "top",
                  font: { size: 12 },
                },
              }}
              config={{ responsive: true, displayModeBar: true }}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler
            />
          </div>
        </div>

        {/* BEV */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-center text-xl font-bold mb-4">BEV Bus</h3>
          <div className="h-[460px]">
            <Plot
              data={[
                {
                  type: "pie",
                  ...buildPie(bev),
                  textinfo: "percent",
                  textposition: "auto",
                  marker: { line: { width: 1, color: "white" } },
                  hole: 0,
                } as any,
              ]}
              layout={{
                margin: { l: 10, r: 10, t: 10, b: 10 },
                showlegend: true,
                legend: {
                  x: 1.02,
                  y: 1,
                  xanchor: "left",
                  yanchor: "top",
                  font: { size: 12 },
                },
              }}
              config={{ responsive: true, displayModeBar: true }}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler
            />
          </div>
        </div>

        {/* BEV-AD */}
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h3 className="text-center text-xl font-bold mb-4">BEV-AD Bus</h3>
          <div className="h-[460px]">
            <Plot
              data={[
                {
                  type: "pie",
                  ...buildPie(bevAd),
                  textinfo: "percent",
                  textposition: "auto",
                  marker: { line: { width: 1, color: "white" } },
                  hole: 0,
                } as any,
              ]}
              layout={{
                margin: { l: 10, r: 10, t: 10, b: 10 },
                showlegend: true,
                legend: {
                  x: 1.02,
                  y: 1,
                  xanchor: "left",
                  yanchor: "top",
                  font: { size: 12 },
                },
              }}
              config={{ responsive: true, displayModeBar: true }}
              style={{ width: "100%", height: "100%" }}
              useResizeHandler
            />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-10 p-6 bg-blue-50 border rounded-xl text-lg">
        ✔ Blue = BEV higher <br />
        ✔ Red = BEV-AD higher <br />
        ✔ Yellow = ICE higher <br />
        ✔ Grey = All equal
      </div>
    </div>
  );
}
