export interface Material {
  id: string
  name: string
  kc11: number | null  // N/mm²
  mc: number | null
  density?: number     // kg/dm³
  hardness?: string    // HB or HRC
  vcRange?: { milling: [number, number]; turning: [number, number]; drilling: [number, number] }
}

export const materials: Material[] = [
  { id: 'alu',      name: 'Aluminium (Knetleg.)',     kc11: 700,  mc: 0.23, density: 2.7,  hardness: '60–120 HB',  vcRange: { milling: [200, 600], turning: [200, 1000], drilling: [80, 250] } },
  { id: 's235',     name: 'Baustahl S235',             kc11: 1600, mc: 0.25, density: 7.85, hardness: '120–160 HB', vcRange: { milling: [150, 300], turning: [150, 350],  drilling: [25, 80] } },
  { id: 's355',     name: 'Baustahl S355',             kc11: 1780, mc: 0.25, density: 7.85, hardness: '160–200 HB', vcRange: { milling: [120, 250], turning: [120, 300],  drilling: [20, 70] } },
  { id: 'c45',      name: 'Vergütungsstahl C45',       kc11: 1900, mc: 0.26, density: 7.85, hardness: '200–250 HB', vcRange: { milling: [100, 220], turning: [100, 250],  drilling: [18, 60] } },
  { id: '42crmo4',  name: 'Vergütungsstahl 42CrMo4',   kc11: 2100, mc: 0.25, density: 7.85, hardness: '220–300 HB', vcRange: { milling: [80, 200],  turning: [80, 220],   drilling: [15, 50] } },
  { id: '1.4301',   name: 'Edelstahl 1.4301',          kc11: 2200, mc: 0.27, density: 7.9,  hardness: '150–200 HB', vcRange: { milling: [60, 150],  turning: [60, 180],   drilling: [10, 40] } },
  { id: '1.4571',   name: 'Edelstahl 1.4571',          kc11: 2500, mc: 0.28, density: 8.0,  hardness: '160–220 HB', vcRange: { milling: [50, 130],  turning: [50, 160],   drilling: [8, 35] } },
  { id: 'gjl250',   name: 'Gusseisen GJL-250',         kc11: 1150, mc: 0.28, density: 7.2,  hardness: '180–240 HB', vcRange: { milling: [100, 250], turning: [80, 200],   drilling: [20, 60] } },
  { id: 'gjs400',   name: 'Gusseisen GJS-400',         kc11: 1450, mc: 0.27, density: 7.1,  hardness: '140–200 HB', vcRange: { milling: [80, 200],  turning: [60, 180],   drilling: [15, 50] } },
  { id: 'messing',  name: 'Messing',                   kc11: 780,  mc: 0.22, density: 8.5,  hardness: '80–150 HB',  vcRange: { milling: [200, 500], turning: [200, 600],  drilling: [50, 150] } },
  { id: 'titan',    name: 'Titan Ti6Al4V',             kc11: 1500, mc: 0.23, density: 4.43, hardness: '36 HRC',     vcRange: { milling: [30, 80],   turning: [30, 90],    drilling: [8, 30] } },
  { id: 'custom',   name: 'Benutzerdefiniert',          kc11: null, mc: null },
]

export function getMaterial(id: string): Material | undefined {
  return materials.find(m => m.id === id)
}
