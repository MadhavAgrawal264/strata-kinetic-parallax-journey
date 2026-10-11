export interface StrataRealm {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  altitude: number; // in meters (negative for ocean depths)
  altitudeFormatted: string;
  pressure: string;
  temperature: string;
  dominantElement: string;
  accentColor: string;
  glowColor: string;
  description: string;
  keyMetrics: {
    label: string;
    value: string;
    unit: string;
  }[];
  coordinates: string;
}

export interface ParallaxSettings {
  depthMultiplier: number; // 0.3 to 2.0
  tiltEnabled: boolean;
  exploded3D: boolean;
  soundEnabled: boolean;
}
