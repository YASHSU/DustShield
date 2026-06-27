import { SimulatorInputs, SimulatorOutputs, RetrofitInputs, RetrofitOutputs } from '../types';
import { BASE_LEAKAGE_FACTORS, CARGO_VALUATION } from '../constants';

const TRIP_DISTANCE = 35; // average trip distance in km (Raipur-Bhilai corridor)

export function calculateDustLeakage(inputs: SimulatorInputs): SimulatorOutputs {
  const {
    cargoType,
    payload,
    truckCount,
    avgSpeed,
    windSpeed,
    humidity,
    roadDryness,
    hasCover,
    filterInstalled,
    filterEfficiency,
    rearDustCurtain,
    aerodynamicDiffuser,
    tailgateSeal
  } = inputs;

  const baseFactor = BASE_LEAKAGE_FACTORS[cargoType] || 0.05;
  
  // 1. Calculate environmental factors
  // Higher speed increases air turbulence and dust shearing
  const speedFactor = Math.pow(avgSpeed / 40, 1.4);
  // Higher wind speed carries more fine particles out of the truck bed
  const windFactor = Math.pow(1 + windSpeed / 15, 1.2);
  // Dryness factor: dry roads and cargo leak far more (0% dryness = wet, no dust)
  const drynessFactor = roadDryness / 75;
  // Humidity: high humidity causes dust particles to agglomerate and settle
  const humidityFactor = 100 / (humidity + 50);

  // Raw leakage per trip (kg per ton-km) * tons * km
  const baseLeakagePerTrip = baseFactor * payload * TRIP_DISTANCE;
  const unmitigatedLeakagePerTrip = baseLeakagePerTrip * speedFactor * windFactor * drynessFactor * humidityFactor;

  // 2. Calculate Mitigation Impacts
  let mitigationMultiplier = 1.0;
  
  if (hasCover) {
    mitigationMultiplier *= 0.30; // 70% reduction for high-quality tarpaulin/sliding covers
  }
  if (rearDustCurtain) {
    mitigationMultiplier *= 0.85; // 15% reduction from shielding the tail vacuum
  }
  if (aerodynamicDiffuser) {
    mitigationMultiplier *= 0.80; // 20% reduction by channeling air over the cargo bed
  }
  if (tailgateSeal) {
    mitigationMultiplier *= 0.75; // 25% reduction by stopping fine particles escaping bottom/sides
  }
  if (filterInstalled) {
    // Active dust filters work on vacuum or enclosed spaces, capture efficiency applies
    const captureFactor = 1 - (filterEfficiency / 100);
    mitigationMultiplier *= captureFactor;
  }

  // 3. Compute outputs
  const beforeLeakage = Math.min(payload * 1000 * 0.05, unmitigatedLeakagePerTrip); // Cap at 5% of payload
  const afterLeakage = beforeLeakage * mitigationMultiplier;

  const estimatedDustLeakage = afterLeakage;
  const totalDailyDustLeakage = afterLeakage * truckCount;
  
  // PM10 impact in ug/m3 in the local airshed
  const pm10Contribution = (totalDailyDustLeakage / 100) * 1.5;

  const materialLossKg = totalDailyDustLeakage;
  const valuePerKg = (CARGO_VALUATION[cargoType] || 2000) / 1000;
  const materialLossValueINR = materialLossKg * valuePerKg;

  const beforeDailyLeakage = beforeLeakage * truckCount;
  const dailyDustSaved = beforeDailyLeakage - totalDailyDustLeakage;
  const dailySavingsINR = dailyDustSaved * valuePerKg;
  const annualSavingsINR = dailySavingsINR * 300; // 300 active hauling days

  const dustReductionPercent = Math.round((1 - mitigationMultiplier) * 100);

  // Environmental Score ranges from 10 to 100
  // Score drops by 1 point for every 20kg of daily leakage
  const environmentalScore = Math.max(10, Math.min(100, Math.round(100 - (totalDailyDustLeakage / 25))));

  return {
    estimatedDustLeakage: Number(estimatedDustLeakage.toFixed(2)),
    totalDailyDustLeakage: Number(totalDailyDustLeakage.toFixed(1)),
    pm10Contribution: Number(pm10Contribution.toFixed(1)),
    materialLossKg: Number(materialLossKg.toFixed(1)),
    materialLossValueINR: Math.round(materialLossValueINR),
    dustReductionPercent,
    dailySavingsINR: Math.round(dailySavingsINR),
    annualSavingsINR: Math.round(annualSavingsINR),
    environmentalScore,
    beforeLeakage: Number(beforeLeakage.toFixed(2)),
    afterLeakage: Number(afterLeakage.toFixed(2))
  };
}

export function calculateRetrofitROI(
  inputs: RetrofitInputs,
  simulatorInputs: SimulatorInputs
): RetrofitOutputs {
  const { fleetSize, retrofitCostPerTruck, annualMaintenancePerTruck, tripsPerDayPerTruck } = inputs;
  
  // Calculate leakage for single truck unmitigated vs mitigated
  const simOutputs = calculateDustLeakage(simulatorInputs);
  
  // Calculate savings based on a single truck
  const cargoVal = CARGO_VALUATION[simulatorInputs.cargoType] || 2000;
  const valuePerKg = cargoVal / 1000;
  
  const leakageDiffPerTrip = simOutputs.beforeLeakage - simOutputs.afterLeakage;
  const dailyDustSavedPerTruck = leakageDiffPerTrip * tripsPerDayPerTruck;
  
  const annualDustSavedKg = dailyDustSavedPerTruck * fleetSize * 300;
  const annualMaterialSavedKg = annualDustSavedKg;
  
  // Direct materials savings + secondary benefits (e.g. ₹8,000/truck-year saved from fines & cleanup costs)
  const materialSavingsTotal = annualMaterialSavedKg * valuePerKg;
  const penaltyAvoidanceSavings = fleetSize * 12000; 
  const annualSavingsINR = materialSavingsTotal + penaltyAvoidanceSavings;

  const totalInvestment = fleetSize * retrofitCostPerTruck;
  const annualMaintenanceTotal = fleetSize * annualMaintenancePerTruck;

  const netAnnualSavings = annualSavingsINR - annualMaintenanceTotal;
  
  // Payback period in months
  let paybackPeriodMonths = 12;
  if (netAnnualSavings > 0) {
    paybackPeriodMonths = Number(((totalInvestment / netAnnualSavings) * 12).toFixed(1));
  } else {
    paybackPeriodMonths = 99; // infinite/never
  }

  // 5-Year Return on Investment
  // ROI = (Total Savings over 5 years - Initial Cost - Maintenance over 5 years) / Initial Cost * 100
  const fiveYearNetReturn = (netAnnualSavings * 5) - totalInvestment;
  const roiPercent = totalInvestment > 0 ? Math.round((fiveYearNetReturn / totalInvestment) * 100) : 0;

  return {
    totalInvestment,
    annualMaintenanceTotal,
    annualDustSavedKg: Math.round(annualDustSavedKg),
    annualMaterialSavedKg: Math.round(annualMaterialSavedKg),
    annualSavingsINR: Math.round(annualSavingsINR),
    paybackPeriodMonths: Math.max(0.5, paybackPeriodMonths),
    roiPercent
  };
}
