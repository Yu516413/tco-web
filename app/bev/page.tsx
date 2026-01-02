"use client";

import { useState } from "react";
import NumberInput from "@/components/ui/number-input";

export default function BEVPage() {

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
  const [electricityConsumption, setElectricityConsumption] = useState(0.55);
  const [adblueConsumption, setAdblueConsumption] = useState(0.0);
  const [tireLife, setTireLife] = useState(80000);
  const [lubricantConsumption, setLubricantConsumption] = useState(0.5);
  const [tollRate, setTollRate] = useState(0.0);

  //
  // ---------------- Leasing & Acquisition ----------------
  //
  const [leasingMonthly, setLeasingMonthly] = useState(5000);
  const [leasingYears, setLeasingYears] = useState(10);
  const [transferCost, setTransferCost] = useState(5000);
  const [registrationCost, setRegistrationCost] = useState(150);
  const [commissioningCost, setCommissioningCost] = useState(9500);
  const [returnCost, setReturnCost] = useState(2500);

  //
  // ---------------- Annual Fixed Costs ----------------
  //
  const [vehicleTax, setVehicleTax] = useState(0);
  const [insurance, setInsurance] = useState(8000);
  const [inspectionFees, setInspectionFees] = useState(285);
  const [inspectionMaintenance, setInspectionMaintenance] = useState(400);
  const [repairs, setRepairs] = useState(500);
  const [smallParts, setSmallParts] = useState(250);
  const [cleaning, setCleaning] = useState(500);
  const [garageCost, setGarageCost] = useState(4000);
  const [onboardMaintenance, setOnboardMaintenance] = useState(1500);

  //
  // ---------------- Market Prices ----------------
  //
  const [electricityPrice, setElectricityPrice] = useState(0.60);
  const [adbluePrice, setAdbluePrice] = useState(1.10);
  const [lubricantPrice, setLubricantPrice] = useState(2.50);
  const [tireCost, setTireCost] = useState(3000);

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

  // variable cost per km
  const electricityCostKm = electricityConsumption * electricityPrice;
  const adblueCostKm = (adblueConsumption / 100) * adbluePrice;
  const lubricantCostKm = (lubricantConsumption / 1000) * lubricantPrice;
  const tireCostKm = tireCost / tireLife;

  const variableCostRound =
    (electricityCostKm +
      adblueCostKm +
      lubricantCostKm +
      tireCostKm +
      tollRate) *
    distancePerRound;

  // annual fixed costs
  const leasingRound = (leasingMonthly * 12) / annualRounds;
  const insuranceRound = insurance / annualRounds;
  const inspectionRound = inspectionFees / annualRounds;
  const maintenanceRound = inspectionMaintenance / annualRounds;
  const repairsRound = repairs / annualRounds;
  const smallPartsRound = smallParts / annualRounds;
  const cleaningRound = cleaning / annualRounds;
  const garageRound = garageCost / annualRounds;
  const onboardRound = onboardMaintenance / annualRounds;

  // one-time amortized
  const transferRound = transferCost / leasingYears / annualRounds;
  const registrationRound = registrationCost / leasingYears / annualRounds;
  const commissioningRound =
    commissioningCost / leasingYears / annualRounds;
  const returnRound = returnCost / leasingYears / annualRounds;

  // personnel costs
  const driverAnnual = driverSalaryMonth * 12 * confirmShifts;
  const adminAnnual = adminSalaryMonth * 12 * adminShare;

  const driverRound = driverAnnual / annualRounds;
  const adminPartialRound = adminAnnual / annualRounds;
  const adminGeneralRound = generalAdminCost / annualRounds;

  const totalCost =
    variableCostRound +
    leasingRound +
    insuranceRound +
    inspectionRound +
    maintenanceRound +
    repairsRound +
    smallPartsRound +
    cleaningRound +
    garageRound +
    onboardRound +
    transferRound +
    registrationRound +
    commissioningRound +
    returnRound +
    driverRound +
    adminPartialRound +
    adminGeneralRound;

  setResult(totalCost);

  // ----------------------------------------------------
  //  SAVE RESULT TO sessionStorage → for Comparison page
  // ----------------------------------------------------
  if (typeof window !== "undefined") {
    sessionStorage.setItem(
      "tco_bev",
      JSON.stringify({
        // A. Operating cost per Umlauf
        fuel: electricityCostKm * distancePerRound,
        adblue: adblueCostKm * distancePerRound,
        tires: tireCostKm * distancePerRound,
        lubricant: lubricantCostKm * distancePerRound,
        toll: tollRate * distancePerRound,

        // B. Annual fixed cost per Umlauf
        leasing: leasingRound,
        vehicle_tax: vehicleTax / annualRounds,
        insurance: insuranceRound,
        inspection: inspectionRound,
        maintenance: maintenanceRound,
        repairs: repairsRound,
        small_parts: smallPartsRound,
        cleaning: cleaningRound,
        garage: garageRound,
        onboard_system: onboardRound,

        // C. One-time amortized
        transfer: transferRound,
        registration: registrationRound,
        commissioning: commissioningRound,
        return: returnRound,

        // D. Personnel
        driver: driverRound,

        // E. Admin
        admin_partial: adminPartialRound,
        admin_general: adminGeneralRound,

        // F. AD (not applicable)
        ad_license: 0,
        steward: 0,
        tech_supervision: 0,

        // Total
        total: totalCost,
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
        className="relative h-[360px] w-full bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/3.png')"
        }}
      >
        {/* dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-5xl mx-auto pt-32 text-white px-10 drop-shadow-xl">

          <h1 className="text-5xl font-extrabold mb-4 tracking-wide">
            MAN Lion's City E
          </h1>

          <p className="opacity-95 text-2xl leading-relaxed mb-6">
            Zero-emission electric bus offering quiet, efficient and sustainable urban mobility.
          </p>

          <p className="text-xl font-semibold tracking-wide opacity-95">
            Seats: <span className="font-bold">16</span> &nbsp;·&nbsp;
            Standing: <span className="font-bold">24</span> &nbsp;·&nbsp;
            Capacity: <span className="font-bold">40 passengers</span>
          </p>
        </div>
      </div>

      {/* Main content layout */}
      <div className="flex mt-10 px-6 gap-10">

        {/* SIDEBAR */}
        <aside className="w-80 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-5 h-[80vh] overflow-y-auto">

          <h2 className="text-xl font-semibold mb-2">Route</h2>
          <NumberInput label="One-way distance" value={distanceOneWay} onChange={setDistanceOneWay} />
          <NumberInput label="Rounds / shift" value={roundsPerShift} onChange={setRoundsPerShift} />
          <NumberInput label="Shifts / day" value={shiftsPerDay} onChange={setShiftsPerDay} />
          <NumberInput label="Workdays / week" value={workdaysPerWeek} onChange={setWorkdaysPerWeek} />
          <NumberInput label="Weeks / year" value={weeksPerYear} onChange={setWeeksPerYear} />

          <h2 className="text-xl font-semibold mt-6 mb-2">Consumption</h2>
          <NumberInput label="Electricity (kWh/km)" value={electricityConsumption} onChange={setElectricityConsumption} />
          <NumberInput label="AdBlue (L/100 km)" value={adblueConsumption} onChange={setAdblueConsumption} />
          <NumberInput label="Tire life (km)" value={tireLife} onChange={setTireLife} />
          <NumberInput label="Lubricant (L/1000 km)" value={lubricantConsumption} onChange={setLubricantConsumption} />
          <NumberInput label="Toll rate (€/km)" value={tollRate} onChange={setTollRate} />

          <h2 className="text-xl font-semibold mt-6 mb-2">Leasing</h2>
          <NumberInput label="Leasing (€/month)" value={leasingMonthly} onChange={setLeasingMonthly} />
          <NumberInput label="Leasing duration (years)" value={leasingYears} onChange={setLeasingYears} />
          <NumberInput label="Transfer (€)" value={transferCost} onChange={setTransferCost} />
          <NumberInput label="Registration (€)" value={registrationCost} onChange={setRegistrationCost} />
          <NumberInput label="Commissioning (€)" value={commissioningCost} onChange={setCommissioningCost} />
          <NumberInput label="Return (€)" value={returnCost} onChange={setReturnCost} />

          <h2 className="text-xl font-semibold mt-6 mb-2">Fixed Costs</h2>
          <NumberInput label="Vehicle tax (€)" value={vehicleTax} onChange={setVehicleTax} />
          <NumberInput label="Insurance (€)" value={insurance} onChange={setInsurance} />
          <NumberInput label="Inspection (€)" value={inspectionFees} onChange={setInspectionFees} />
          <NumberInput label="Maintenance (€)" value={inspectionMaintenance} onChange={setInspectionMaintenance} />
          <NumberInput label="Repairs (€)" value={repairs} onChange={setRepairs} />
          <NumberInput label="Small parts (€)" value={smallParts} onChange={setSmallParts} />
          <NumberInput label="Cleaning (€)" value={cleaning} onChange={setCleaning} />
          <NumberInput label="Garage (€)" value={garageCost} onChange={setGarageCost} />
          <NumberInput label="Onboard (€)" value={onboardMaintenance} onChange={setOnboardMaintenance} />

          <h2 className="text-xl font-semibold mt-6 mb-2">Market Prices</h2>
          <NumberInput label="Electricity price" value={electricityPrice} onChange={setElectricityPrice} />
          <NumberInput label="AdBlue price" value={adbluePrice} onChange={setAdbluePrice} />
          <NumberInput label="Lubricant price" value={lubricantPrice} onChange={setLubricantPrice} />
          <NumberInput label="Tire cost (€)" value={tireCost} onChange={setTireCost} />

          <h2 className="text-xl font-semibold mt-6 mb-2">Personnel</h2>
          <NumberInput label="Driver salary (€)" value={driverSalaryMonth} onChange={setDriverSalaryMonth} />
          <NumberInput label="Shifts" value={confirmShifts} onChange={setConfirmShifts} />
          <NumberInput label="Admin salary (€)" value={adminSalaryMonth} onChange={setAdminSalaryMonth} />
          <NumberInput label="Admin share" value={adminShare} onChange={setAdminShare} />
          <NumberInput label="General admin (€)" value={generalAdminCost} onChange={setGeneralAdminCost} />

        </aside>

        {/* MAIN PANEL */}
        <main className="flex-1">
          <div className="bg-white shadow-lg rounded-2xl p-10">

            <h2 className="text-2xl font-bold mb-4">Total Cost Per Umlauf</h2>

            <button
              onClick={calculateTCO}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl text-lg shadow-lg"
            >
              🔋 Calculate TCO
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
