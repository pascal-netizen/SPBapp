export interface Material {
  id: string
  name: string
  kc11: number | null  // N/mm²
  mc: number | null
}

export const materials: Material[] = [
  { id: 'alu',      name: 'Aluminium (Knetleg.)',     kc11: 700,  mc: 0.23 },
  { id: 's235',     name: 'Baustahl S235',             kc11: 1600, mc: 0.25 },
  { id: 's355',     name: 'Baustahl S355',             kc11: 1780, mc: 0.25 },
  { id: 'c45',      name: 'Vergütungsstahl C45',       kc11: 1900, mc: 0.26 },
  { id: '42crmo4',  name: 'Vergütungsstahl 42CrMo4',   kc11: 2100, mc: 0.25 },
  { id: '1.4301',   name: 'Edelstahl 1.4301',          kc11: 2200, mc: 0.27 },
  { id: '1.4571',   name: 'Edelstahl 1.4571',          kc11: 2500, mc: 0.28 },
  { id: 'gjl250',   name: 'Gusseisen GJL-250',         kc11: 1150, mc: 0.28 },
  { id: 'gjs400',   name: 'Gusseisen GJS-400',         kc11: 1450, mc: 0.27 },
  { id: 'messing',  name: 'Messing',                   kc11: 780,  mc: 0.22 },
  { id: 'titan',    name: 'Titan Ti6Al4V',             kc11: 1500, mc: 0.23 },
  { id: 'custom',   name: 'Benutzerdefiniert',          kc11: null, mc: null },
]

export function getMaterial(id: string): Material | undefined {
  return materials.find(m => m.id === id)
}
