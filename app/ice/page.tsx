"use client";

import { useState } from "react";
import NumberInput from "@/components/ui/number-input";

export default function ICEPage() {
  //
  // ---------------- Route Parameters ----------------
  //
  const [distanceOneWay, setDistanceOneWay] = useState(7.2);
  const [roundsPerShift, setRoundsPerShift] = useState(7);
  const [shiftsPerDay, setShiftsPerDay] = useState(3);
  const [workdaysPerWeek, setWorkdaysPerWeek] = useState(5);
  const [weeksPerYear, setWeeksPerYear] = useState(50);

  //
  // ---------------- Operating Consumption ----------------
  //
  const [fuelConsumption, setFuelConsumption] = useState(28.5);
  const [adblueConsumption, setAdblueConsumption] = useState(1.2);
  const [lubricantConsumption, setLubricantConsumption] = useState(2.0);
  const [tollRate, setTollRate] = useState(0);
  const [frontTireLife, setFrontTireLife] = useState(150000);
  const [rearTireLife, setRearTireLife] = useState(100000);

  //
  // ---------------- Leasing & Acquisition ----------------
  //
  const [leasingMonthly, setLeasingMonthly] = useState(3500);
  const [leasingYears, setLeasingYears] = useState(10);
  const [transferCost, setTransferCost] = useState(5000);
  const [registrationCost, setRegistrationCost] = useState(150);
  const [commissioningCost, setCommissioningCost] = useState(9500);
  const [returnCost, setReturnCost] = useState(2500);

  //
  // ---------------- Annual Fixed Costs ----------------
  //
  const [vehicleTax, setVehicleTax] = useState(0);
  const [insurance, setInsurance] = useState(2300);
  const [inspectionFees, setInspectionFees] = useState(285);
  const [maintenanceCosts, setMaintenanceCosts] = useState(400);
  const [repairs, setRepairs] = useState(500);
  const [smallParts, setSmallParts] = useState(500);
  const [cleaning, setCleaning] = useState(500);
  const [garageCost, setGarageCost] = useState(4000);
  const [onboardMaintenance, setOnboardMaintenance] = useState(1500);

  //
  // ---------------- Market Prices ----------------
  //
  const [fuelPrice, setFuelPrice] = useState(1.6);
  const [adbluePrice, setAdbluePrice] = useState(1.1);
  const [lubricantPrice, setLubricantPrice] = useState(2.5);
  const [frontTireCost, setFrontTireCost] = useState(1000);
  const [rearTireCost, setRearTireCost] = useState(2200);

  //
  // ---------------- Personnel ----------------
  //
  const [driverSalaryMonth, setDriverSalaryMonth] = useState(3074.17);
  const [confirmShifts, setConfirmShifts] = useState(3);
  const [adminSalaryMonth, setAdminSalaryMonth] = useState(4500);
  const [adminShare, setAdminShare] = useState(0.05);
  const [generalAdminCost, setGeneralAdminCost] = useState(5000);

  const [result, setResult] = useState<number | null>(null);

  //
  // ---------------- Calculation ----------------
  //
  const calculateTCO = () => {
    const distancePerRound = distanceOneWay * 2;
    const annualRounds =
      roundsPerShift * shiftsPerDay * workdaysPerWeek * weeksPerYear;

    // Variable costs
    const fuelCostKm = (fuelConsumption / 100) * fuelPrice;
    const adblueCostKm = (adblueConsumption / 100) * adbluePrice;
    const lubricantCostKm = (lubricantConsumption / 1000) * lubricantPrice;
    const tireCostKm =
      frontTireCost / frontTireLife + rearTireCost / rearTireLife;

    const variableCostRound =
      (fuelCostKm +
        adblueCostKm +
        lubricantCostKm +
        tireCostKm +
        tollRate) *
      distancePerRound;

    // Annual amortized fixed cost per Umlauf
    const leasingAnnual = leasingMonthly * 12;

    const fixedCostsRound =
      leasingAnnual / annualRounds +
      insurance / annualRounds +
      inspectionFees / annualRounds +
      maintenanceCosts / annualRounds +
      repairs / annualRounds +
      smallParts / annualRounds +
      cleaning / annualRounds +
      garageCost / annualRounds +
      onboardMaintenance / annualRounds +
      vehicleTax / annualRounds +
      transferCost / leasingYears / annualRounds +
      registrationCost / leasingYears / annualRounds +
      commissioningCost / leasingYears / annualRounds +
      returnCost / leasingYears / annualRounds +
      (driverSalaryMonth * 12 * confirmShifts) / annualRounds +
      (adminSalaryMonth * 12 * adminShare) / annualRounds +
      generalAdminCost / annualRounds;

    const total = variableCostRound + fixedCostsRound;

    setResult(total);

    // -----------------------------------------------
    // SAVE TO SESSION STORAGE (for Comparison Page)
    // -----------------------------------------------
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "tco_ice",
        JSON.stringify({
          fuel: fuelCostKm * distancePerRound,
          adblue: adblueCostKm * distancePerRound,
          tires: tireCostKm * distancePerRound,
          lubricant: lubricantCostKm * distancePerRound,
          toll: tollRate * distancePerRound,

          leasing: leasingAnnual / annualRounds,
          vehicle_tax: vehicleTax / annualRounds,
          insurance: insurance / annualRounds,
          inspection: inspectionFees / annualRounds,
          maintenance: maintenanceCosts / annualRounds,
          repairs: repairs / annualRounds,
          small_parts: smallParts / annualRounds,
          cleaning: cleaning / annualRounds,
          garage: garageCost / annualRounds,
          onboard_system: onboardMaintenance / annualRounds,

          transfer: transferCost / leasingYears / annualRounds,
          registration: registrationCost / leasingYears / annualRounds,
          commissioning: commissioningCost / leasingYears / annualRounds,
          return: returnCost / leasingYears / annualRounds,

          driver:
            (driverSalaryMonth * 12 * confirmShifts) / annualRounds,
          admin_partial:
            (adminSalaryMonth * 12 * adminShare) / annualRounds,
          admin_general: generalAdminCost / annualRounds,

          ad_license: 0,
          steward: 0,
          tech_supervision: 0,

          total,
        })
      );
    }
  };

  //
  // ---------------- UI Layout ----------------
  //
  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO BANNER */}
      <div
        className="relative h-[360px] w-full bg-cover bg-center"
        style={{ backgroundImage: "url('/2.png')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-5xl mx-auto pt-36 text-white px-10 drop-shadow-xl">
          <h1 className="text-5xl font-extrabold mb-4 tracking-wide">
            Mercedes-Benz Citaro LE C2
          </h1>

          <p className="opacity-95 text-2xl leading-relaxed mb-6">
            High-capacity European city bus designed for efficiency and reliability.
          </p>

          <p className="text-xl font-semibold tracking-wide opacity-95">
            Seats: <span className="font-bold">39</span> &nbsp;·&nbsp;
            Standing: <span className="font-bold">60</span> &nbsp;·&nbsp;
            Capacity: <span className="font-bold">99 passengers</span>
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex mt-10 px-6 gap-10">
        {/* Sidebar */}
        <aside className="w-80 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-5 h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-2">Route</h2>
          <NumberInput label="One-way distance" value={distanceOneWay} onChange={setDistanceOneWay} />
          <NumberInput label="Rounds / shift" value={roundsPerShift} onChange={setRoundsPerShift} />
          <NumberInput label="Shifts / day" value={shiftsPerDay} onChange={setShiftsPerDay} />
          <NumberInput label="Workdays / week" value={workdaysPerWeek} onChange={setWorkdaysPerWeek} />
          <NumberInput label="Weeks / year" value={weeksPerYear} onChange={setWeeksPerYear} />

          <h2 className="text-xl font-bold mt-6 mb-2">Consumption</h2>
          <NumberInput label="Fuel (L/100 km)" value={fuelConsumption} onChange={setFuelConsumption} />
          <NumberInput label="AdBlue (L/100 km)" value={adblueConsumption} onChange={setAdblueConsumption} />
          <NumberInput label="Lubricant (L/1000 km)" value={lubricantConsumption} onChange={setLubricantConsumption} />
          <NumberInput label="Toll rate (€/km)" value={tollRate} onChange={setTollRate} />
          <NumberInput label="Front tire life (km)" value={frontTireLife} onChange={setFrontTireLife} />
          <NumberInput label="Rear tire life (km)" value={rearTireLife} onChange={setRearTireLife} />

          <h2 className="text-xl font-bold mt-6 mb-2">Leasing</h2>
          <NumberInput label="Leasing (€/month)" value={leasingMonthly} onChange={setLeasingMonthly} />
          <NumberInput label="Leasing (years)" value={leasingYears} onChange={setLeasingYears} />
          <NumberInput label="Transfer cost (€)" value={transferCost} onChange={setTransferCost} />
          <NumberInput label="Registration (€)" value={registrationCost} onChange={setRegistrationCost} />
          <NumberInput label="Commissioning (€)" value={commissioningCost} onChange={setCommissioningCost} />
          <NumberInput label="Return (€)" value={returnCost} onChange={setReturnCost} />

          <h2 className="text-xl font-bold mt-6 mb-2">Fixed Costs</h2>
          <NumberInput label="Vehicle tax (€)" value={vehicleTax} onChange={setVehicleTax} />
          <NumberInput label="Insurance (€)" value={insurance} onChange={setInsurance} />
          <NumberInput label="Inspection (€)" value={inspectionFees} onChange={setInspectionFees} />
          <NumberInput label="Maintenance (€)" value={maintenanceCosts} onChange={setMaintenanceCosts} />
          <NumberInput label="Repairs (€)" value={repairs} onChange={setRepairs} />
          <NumberInput label="Small parts (€)" value={smallParts} onChange={setSmallParts} />
          <NumberInput label="Cleaning (€)" value={cleaning} onChange={setCleaning} />
          <NumberInput label="Garage (€)" value={garageCost} onChange={setGarageCost} />
          <NumberInput label="Onboard (€)" value={onboardMaintenance} onChange={setOnboardMaintenance} />

          <h2 className="text-xl font-bold mt-6 mb-2">Market Prices</h2>
          <NumberInput label="Fuel price" value={fuelPrice} onChange={setFuelPrice} />
          <NumberInput label="AdBlue price" value={adbluePrice} onChange={setAdbluePrice} />
          <NumberInput label="Lubricant price" value={lubricantPrice} onChange={setLubricantPrice} />
          <NumberInput label="Front tire (€)" value={frontTireCost} onChange={setFrontTireCost} />
          <NumberInput label="Rear tire (€)" value={rearTireCost} onChange={setRearTireCost} />

          <h2 className="text-xl font-bold mt-6 mb-2">Personnel</h2>
          <NumberInput label="Driver salary (€)" value={driverSalaryMonth} onChange={setDriverSalaryMonth} />
          <NumberInput label="Shifts" value={confirmShifts} onChange={setConfirmShifts} />
          <NumberInput label="Admin salary (€)" value={adminSalaryMonth} onChange={setAdminSalaryMonth} />
          <NumberInput label="Admin share" value={adminShare} onChange={setAdminShare} />
          <NumberInput label="Admin cost (€)" value={generalAdminCost} onChange={setGeneralAdminCost} />
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white shadow-lg rounded-2xl p-10">
            <h2 className="text-2xl font-bold mb-4">Total Cost Per Umlauf</h2>

            <button
              onClick={calculateTCO}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg shadow-lg"
            >
              🚍 Calculate TCO
            </button>
          </div>

          {result !== null && (
            <div className="mt-6 bg-green-100 border border-green-400 text-green-900 p-6 rounded-xl text-xl shadow-lg">
              Total Cost per Umlauf: <b>{result.toFixed(2)} €</b>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
