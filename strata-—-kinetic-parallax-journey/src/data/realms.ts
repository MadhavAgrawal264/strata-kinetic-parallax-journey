import { StrataRealm } from '../types';

export const STRATA_REALMS: StrataRealm[] = [
  {
    id: 'abyss',
    index: '01',
    name: 'The Hadal Abyss',
    subtitle: 'Ultra-Deep Tectonic Bathymetry & Hydrothermal Rifts',
    altitude: -10920,
    altitudeFormatted: '-10,920 m',
    pressure: '1,086 atm',
    temperature: '1.4 °C',
    dominantElement: 'Supercritical Brine',
    accentColor: '#06b6d4', // cyan-500
    glowColor: 'rgba(6, 182, 212, 0.4)',
    description:
      'The deepest oceanic trenches on Earth. Light ceases to penetrate beyond 1,000 meters; here at nearly eleven kilometers depth, crushing hydrostatic pressure shapes extreme hydrothermal ecosystems and cold tectonic subduction zones.',
    keyMetrics: [
      { label: 'Hydrostatic Force', value: '1,086', unit: 'atmospheres' },
      { label: 'Light Penetration', value: '0.00', unit: 'lux' },
      { label: 'Trench Gradient', value: '38.4', unit: 'degrees' },
      { label: 'Acoustic Velocity', value: '1,532', unit: 'm/s' }
    ],
    coordinates: '11°22′N 142°35′E · Challenger Deep'
  },
  {
    id: 'lithosphere',
    index: '02',
    name: 'Lithosphere & Crags',
    subtitle: 'Tectonic Uplift, Basalt Needles & Alpine Observatories',
    altitude: 3840,
    altitudeFormatted: '+3,840 m',
    pressure: '0.63 atm',
    temperature: '-7.2 °C',
    dominantElement: 'Crystalline Granite',
    accentColor: '#f59e0b', // amber-500
    glowColor: 'rgba(245, 158, 11, 0.4)',
    description:
      'Where tectonic plates collide, solid crust buckles into towering vertical needles. At four kilometers above sea level, atmospheric density drops by over a third, unveiling jagged crystalline rock faces carved by glacial retreat.',
    keyMetrics: [
      { label: 'Atmospheric Density', value: '0.82', unit: 'kg/m³' },
      { label: 'Rock Compressive Strength', value: '220', unit: 'MPa' },
      { label: 'Orogeny Uplift Rate', value: '4.8', unit: 'mm/year' },
      { label: 'Solar Irradiance', value: '1,120', unit: 'W/m²' }
    ],
    coordinates: '45°50′N 06°51′E · Mont Blanc Massif'
  },
  {
    id: 'troposphere',
    index: '03',
    name: 'Troposphere & Cloud Sea',
    subtitle: 'Jet Stream Velocity, Vapor Stratification & High-Altitude Flight',
    altitude: 11200,
    altitudeFormatted: '+11,200 m',
    pressure: '0.23 atm',
    temperature: '-56.5 °C',
    dominantElement: 'Subcooled Vapor',
    accentColor: '#38bdf8', // sky-400
    glowColor: 'rgba(56, 189, 248, 0.4)',
    description:
      'The ceiling of conventional weather systems and commercial flight paths. High-velocity jet streams snake through the tropopause at up to 350 km/h, sweeping endless carpets of cumulus and cirrus clouds across continental boundaries.',
    keyMetrics: [
      { label: 'Jet Stream Velocity', value: '310', unit: 'km/h' },
      { label: 'Barometric Gradient', value: '226', unit: 'hPa' },
      { label: 'Vapor Supersaturation', value: '124', unit: '%' },
      { label: 'Mach 1 Sound Speed', value: '295', unit: 'm/s' }
    ],
    coordinates: '36°14′N 139°45′E · Subtropical Tropopause'
  },
  {
    id: 'aurora',
    index: '04',
    name: 'Mesosphere & Aurora Gate',
    subtitle: 'Geomagnetic Ionization, Solar Wind & Noctilucent Curtains',
    altitude: 85000,
    altitudeFormatted: '+85,000 m',
    pressure: '0.0003 atm',
    temperature: '-88.2 °C',
    dominantElement: 'Excited Plasma',
    accentColor: '#10b981', // emerald-500
    glowColor: 'rgba(16, 185, 129, 0.4)',
    description:
      'The boundary where Earth’s magnetic field channels charged solar wind particles into the upper atmosphere. Oxygen and nitrogen atoms emit luminous curtains of emerald, turquoise, and violet light as meteors disintegrate into cosmic dust.',
    keyMetrics: [
      { label: 'Solar Wind Flux', value: '4.2×10⁸', unit: 'ions/cm²·s' },
      { label: 'Ionization Wavelength', value: '557.7', unit: 'nm' },
      { label: 'Plasma Potential', value: '-12.8', unit: 'kV' },
      { label: 'Meteor Burn Altitude', value: '82.5', unit: 'km' }
    ],
    coordinates: '69°39′N 18°57′E · Tromsø Auroral Observatory'
  },
  {
    id: 'exosphere',
    index: '05',
    name: 'Orbital Exosphere',
    subtitle: 'Zero-Gravity Curvature, Satellite Horizons & Cosmic Threshold',
    altitude: 420000,
    altitudeFormatted: '+420,000 m',
    pressure: '10⁻¹² atm',
    temperature: '+1,240 °C',
    dominantElement: 'Atomic Hydrogen',
    accentColor: '#a855f7', // purple-500
    glowColor: 'rgba(168, 85, 247, 0.4)',
    description:
      'Low Earth Orbit. Here, spacecraft orbit at 7.66 kilometers per second, completing an orbit every 92 minutes. Looking down, the razor-thin cyan line of the atmosphere separates all of human life from the infinite black silence of deep space.',
    keyMetrics: [
      { label: 'Orbital Velocity', value: '7.66', unit: 'km/s' },
      { label: 'Orbital Period', value: '92.4', unit: 'minutes' },
      { label: 'Free Fall Gravity', value: '8.83', unit: 'm/s²' },
      { label: 'Mean Free Path', value: '10,000', unit: 'km' }
    ],
    coordinates: '51.64° Orbital Inclination · Low Earth Orbit'
  }
];
