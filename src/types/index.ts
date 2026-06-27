export interface PollutantBreakdown {
  pm25: number; // PM2.5 in ug/m3
  pm10: number; // PM10 in ug/m3
  no2: number;  // NO2 in ug/m3
  so2: number;  // SO2 in ug/m3
  co: number;   // CO in mg/m3
  o3: number;   // Ozone in ug/m3
}

export interface AQIReading {
  aqi: number;
  status: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  primaryPollutant: keyof PollutantBreakdown;
  pollutants: PollutantBreakdown;
  stationName: string;
  timestamp: string;
}

export interface WeatherData {
  temperature: number;      // Celsius
  humidity: number;         // %
  windSpeed: number;        // km/h
  windDirection: number;    // degrees (0-360)
  pressure: number;         // hPa
  visibility: number;       // km
  rainProbability: number;  // %
  uvIndex: number;          // 0-11+
  timestamp: string;
}

export interface ForecastDay {
  date: string;
  tempMin: number;
  tempMax: number;
  windSpeedMax: number;
  windDirectionAvg: number;
  humidityAvg: number;
  rainProbability: number;
  uvIndex: number;
  condition: string; // Sunny, Cloudy, Rainy, Windy, Dust Storm
}

export interface TrafficReading {
  congestionLevel: number; // 0 (empty) to 100 (gridlock)
  averageSpeed: number;    // km/h
  heavyVehicleDensity: number; // vehicles per km
  status: 'Low' | 'Moderate' | 'Heavy' | 'Gridlock';
  timestamp: string;
}

export interface RouteDetails {
  id: string;
  name: string;
  congestion: number;
  heavyTruckCount: number;
  averageSpeed: number;
  dustRiskScore: number; // 0-100
  coordinates: [number, number][]; // coordinates for Leaflet Polyline
}

export interface SimulatorInputs {
  truckType: 'Dumper (Open)' | 'Dumper (Tarp Covered)' | 'Semi-Trailer' | 'Cement Mixer' | 'Bulk Carrier';
  cargoType: 'Coal' | 'Fly Ash' | 'Iron Ore' | 'Cement' | 'Sand' | 'Aggregates';
  payload: number;          // tons per truck
  truckCount: number;       // number of trucks/day
  avgSpeed: number;         // km/h
  windSpeed: number;        // km/h
  humidity: number;         // %
  roadDryness: number;      // % (0-100, 100 means extremely dry and dusty)
  hasCover: boolean;
  filterInstalled: boolean;
  filterEfficiency: number; // % (0-100)
  rearDustCurtain: boolean;
  aerodynamicDiffuser: boolean;
  tailgateSeal: boolean;
}

export interface SimulatorOutputs {
  estimatedDustLeakage: number; // kg per trip
  totalDailyDustLeakage: number; // kg per day
  pm10Contribution: number;      // ug/m3 impact
  materialLossKg: number;        // kg per day
  materialLossValueINR: number;  // Rupees per day
  dustReductionPercent: number;  // %
  dailySavingsINR: number;       // Rupees per day
  annualSavingsINR: number;      // Rupees per year
  environmentalScore: number;    // 0-100 (100 is cleanest)
  beforeLeakage: number;         // kg per trip (without filters/covers)
  afterLeakage: number;          // kg per trip (with filters/covers)
}

export interface EngineeringSolution {
  name: string;
  dustLeakageKg: number;
  pm10Impact: number;
  materialLossKg: number;
  maintenanceCostAnnual: number;
  retrofitCost: number;
  co2ReductionTons: number;
  lifecycleYears: number;
}

export interface RetrofitInputs {
  fleetSize: number;
  retrofitCostPerTruck: number;
  annualMaintenancePerTruck: number;
  tripsPerDayPerTruck: number;
}

export interface RetrofitOutputs {
  totalInvestment: number;      // INR
  annualMaintenanceTotal: number; // INR
  annualDustSavedKg: number;     // kg
  annualMaterialSavedKg: number; // kg
  annualSavingsINR: number;     // INR
  paybackPeriodMonths: number;  // Months
  roiPercent: number;           // % over 5 years
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  estimatedReduction: number; // %
  actionableStep: string;
  category: 'Wind' | 'Traffic' | 'AQI' | 'Road' | 'Operation';
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  read: boolean;
}

export interface IndustrialZone {
  id: string;
  name: string;
  type: string;
  pollutionIndex: number; // 0-100
  coordinates: [number, number];
  description: string;
}

export interface StationData {
  id: string;
  name: string;
  aqi: number;
  pm25: number;
  pm10: number;
  coordinates: [number, number];
}
