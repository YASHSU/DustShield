import { IndustrialZone, StationData, RouteDetails, SimulatorInputs } from '../types';

// Map center: coordinates between Raipur and Bhilai
export const REGION_CENTER: [number, number] = [21.215, 81.450];
export const DEFAULT_ZOOM = 11;

export const INDUSTRIAL_ZONES: IndustrialZone[] = [
  {
    id: 'bsp',
    name: 'Bhilai Steel Plant (BSP)',
    type: 'Steel & Heavy Manufacturing',
    pollutionIndex: 82,
    coordinates: [21.185, 81.390],
    description: 'One of India\'s largest integrated steel plants. Major source of iron dust and particulate matter from transport.'
  },
  {
    id: 'urla',
    name: 'Urla Industrial Area',
    type: 'Metal Casting & Rolling Mills',
    pollutionIndex: 78,
    coordinates: [21.310, 81.615],
    description: 'Concentrated industrial zone north of Raipur. High heavy vehicle traffic transporting coal and steel billets.'
  },
  {
    id: 'siltara',
    name: 'Siltara Industrial Growth Centre',
    type: 'Sponge Iron & Power Plants',
    pollutionIndex: 86,
    coordinates: [21.365, 81.650],
    description: 'Massive sponge iron and thermal power hub. Major emitter of coal fly ash, requiring high volume truck transport.'
  },
  {
    id: 'jamul',
    name: 'Jamul Cement Works',
    type: 'Cement Manufacturing',
    pollutionIndex: 72,
    coordinates: [21.238, 81.378],
    description: 'Large scale ACC cement manufacturing plant. Heavy movement of limestone, sand, and bagged/bulk cement.'
  },
  {
    id: 'kumhari',
    name: 'Kumhari Industrial Belt',
    type: 'Chemicals & Refractories',
    pollutionIndex: 68,
    coordinates: [21.218, 81.515],
    description: 'Intermediate industrial cluster between Raipur and Bhilai. High congestion on NH-53 crossing point.'
  }
];

export const AQI_STATIONS: StationData[] = [
  { id: 'st_urla', name: 'Urla Sector-4 Station', aqi: 184, pm25: 98, pm10: 195, coordinates: [21.308, 81.612] },
  { id: 'st_bsp', name: 'Bhilai Sector-1 Station', aqi: 152, pm25: 64, pm10: 148, coordinates: [21.192, 81.385] },
  { id: 'st_durg', name: 'Durg Collectorate Station', aqi: 124, pm25: 48, pm10: 110, coordinates: [21.190, 81.282] },
  { id: 'st_siltara', name: 'Siltara Sector-1 Station', aqi: 245, pm25: 165, pm10: 310, coordinates: [21.363, 81.648] },
  { id: 'st_tatibandh', name: 'Tatibandh Square Crossing', aqi: 210, pm25: 118, pm10: 250, coordinates: [21.248, 81.583] }
];

// Major transport routes for heavy trucks (approximation for visual mapping)
export const TRUCK_ROUTES: RouteDetails[] = [
  {
    id: 'r_siltara_urla_bsp',
    name: 'Siltara-Urla-Bhilai Industrial Corridor (NH-53)',
    congestion: 68,
    heavyTruckCount: 450,
    averageSpeed: 38,
    dustRiskScore: 85,
    coordinates: [
      [21.365, 81.650], // Siltara
      [21.310, 81.615], // Urla
      [21.248, 81.583], // Tatibandh (Raipur)
      [21.218, 81.515], // Kumhari
      [21.185, 81.390]  // Bhilai Steel Plant
    ]
  },
  {
    id: 'r_jamul_durg',
    name: 'Jamul-Durg Cement Transit Highway',
    congestion: 45,
    heavyTruckCount: 220,
    averageSpeed: 42,
    dustRiskScore: 60,
    coordinates: [
      [21.238, 81.378], // Jamul
      [21.210, 81.330], // Bhilai North
      [21.190, 81.285]  // Durg
    ]
  },
  {
    id: 'r_bsp_durg',
    name: 'Bhilai BSP to Durg Raw Material Line',
    congestion: 55,
    heavyTruckCount: 310,
    averageSpeed: 35,
    dustRiskScore: 72,
    coordinates: [
      [21.185, 81.390], // BSP
      [21.178, 81.332], // Bhilai Civic Center area
      [21.190, 81.285]  // Durg
    ]
  }
];

// Cost per ton in INR for different cargo types
export const CARGO_VALUATION: Record<string, number> = {
  'Coal': 6500,       // INR per ton
  'Fly Ash': 1200,    // INR per ton
  'Iron Ore': 8000,   // INR per ton
  'Cement': 9000,     // INR per ton
  'Sand': 1800,       // INR per ton
  'Aggregates': 1400  // INR per ton
};

// Base leakage emission factors (kg of dust leaked per kilometer per ton of payload)
// Under default dry conditions, no covers
export const BASE_LEAKAGE_FACTORS: Record<string, number> = {
  'Coal': 0.045,      // 45 grams per ton-km
  'Fly Ash': 0.095,   // 95 grams per ton-km (extremely light and airborne)
  'Iron Ore': 0.035,  // 35 grams per ton-km (dense, but leaks at speed)
  'Cement': 0.075,    // 75 grams per ton-km
  'Sand': 0.060,      // 60 grams per ton-km
  'Aggregates': 0.030 // 30 grams per ton-km
};

export const DEFAULT_SIMULATOR_INPUTS: SimulatorInputs = {
  truckType: 'Dumper (Open)',
  cargoType: 'Coal',
  payload: 25,
  truckCount: 150,
  avgSpeed: 45,
  windSpeed: 18,
  humidity: 45,
  roadDryness: 75,
  hasCover: false,
  filterInstalled: false,
  filterEfficiency: 85,
  rearDustCurtain: false,
  aerodynamicDiffuser: false,
  tailgateSeal: false
};
