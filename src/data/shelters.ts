export interface DonationNeed {
  item: string;
  needed: number;
  received: number;
  unit: string;
}

export interface Shelter {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
  occupied: number;
  type: 'escola' | 'igreja' | 'ginasio' | 'centro' | 'universidade' | 'publico';
  status: 'disponivel' | 'parcial' | 'lotado';
  donations: DonationNeed[];
}

export interface RiskZone {
  name: string;
  level: 'alto' | 'medio' | 'moderado';
  center: [number, number];
  radius: number;
}

export interface SafeZone {
  name: string;
  center: [number, number];
  radius: number;
  description: string;
}

// ── 3 Pontos de Coleta Reais ────────────────────────────────────────────────
export const shelters: Shelter[] = [
  {
    id: 1,
    name: "Comunidade Santa Bárbara",
    address: "Rua Luiz Geraldo Franco de Mendonça, 150 - Jardim das Estrelas, Sorocaba - SP, 18017-310",
    lat: -23.4972,
    lng: -47.4581,
    capacity: 600,
    occupied: 15,
    type: "centro",
    status: "disponivel",
    donations: [
      { item: "Cestas Básicas",  needed: 600,  received: 15, unit: "un" },
      { item: "Kits de Higiene", needed: 700,  received: 38, unit: "un" },
      { item: "Kits de Limpeza", needed: 500,  received: 0,  unit: "un" },
      { item: "Água",            needed: 2000, received: 0,  unit: "L"  },
    ],
  },
  {
    id: 2,
    name: "Paróquia Santo Antônio",
    address: "R. Martins de Oliveira, 229 - Vila Haro, Sorocaba - SP, 18015-245",
    lat: -23.5021,
    lng: -47.4472,
    capacity: 900,
    occupied: 15,
    type: "igreja",
    status: "disponivel",
    donations: [
      { item: "Cestas Básicas",  needed: 900,  received: 15, unit: "un" },
      { item: "Kits de Higiene", needed: 1000, received: 38, unit: "un" },
      { item: "Kits de Limpeza", needed: 700,  received: 0,  unit: "un" },
      { item: "Água",            needed: 3000, received: 0,  unit: "L"  },
    ],
  },
  {
    id: 3,
    name: "Paróquia São Carlos Borromeu",
    address: "Av. Dr. Eugênio Salerno, 166 - Centro, Sorocaba - SP, 18035-430",
    lat: -23.5014,
    lng: -47.4584,
    capacity: 1500,
    occupied: 15,
    type: "igreja",
    status: "disponivel",
    donations: [
      { item: "Cestas Básicas",  needed: 1500, received: 15, unit: "un" },
      { item: "Kits de Higiene", needed: 1800, received: 38, unit: "un" },
      { item: "Kits de Limpeza", needed: 1200, received: 0,  unit: "un" },
      { item: "Água",            needed: 6000, received: 0,  unit: "L"  },
    ],
  },
];

// ── Zonas de Risco (regiões especificadas no documento) ─────────────────────
export const riskZones: RiskZone[] = [
  { name: "Avenida Dom Aguirre",               level: "alto",     center: [-23.5034, -47.4602], radius: 1200 },
  { name: "Avenida Ipanema",                   level: "alto",     center: [-23.4837, -47.4716], radius: 1000 },
  { name: "Avenida Afonso Vergueiro",          level: "medio",    center: [-23.5095, -47.4548], radius: 800  },
  { name: "Terminal Rodoviário Santo Antônio", level: "medio",    center: [-23.5064, -47.4571], radius: 600  },
  { name: "Jardim Abaeté",                     level: "moderado", center: [-23.5408, -47.4348], radius: 700  },
  { name: "Vitória Régia",                     level: "moderado", center: [-23.5588, -47.4625], radius: 600  },
];

// ── Áreas Seguras (bairros elevados, sem histórico de inundação) ────────────
export const safeZones: SafeZone[] = [
  { name: "Campolim",                    center: [-23.5110, -47.4762], radius: 1100, description: "Bairro elevado, sem histórico de inundações" },
  { name: "Wanel Ville",                 center: [-23.4750, -47.4600], radius: 850,  description: "Região elevada, bom escoamento pluvial" },
  { name: "Brigadeiro Tobias",           center: [-23.4870, -47.4350], radius: 750,  description: "Área elevada, historicamente segura" },
  { name: "Caguassu",                    center: [-23.5200, -47.4300], radius: 700,  description: "Terreno alto, boa infraestrutura de drenagem" },
  { name: "Jardim Vergueiro (cotas altas)", center: [-23.4840, -47.4530], radius: 600, description: "Subida do bairro, fora da planície de inundação" },
  { name: "Parque Tecnológico",          center: [-23.5000, -47.4350], radius: 650,  description: "Área elevada, longe dos córregos" },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
export function getStatusLabel(status: Shelter['status']) {
  switch (status) {
    case 'disponivel': return 'Disponível';
    case 'parcial':    return 'Parcialmente ocupado';
    case 'lotado':     return 'Lotado';
  }
}

export function getStatusColor(status: Shelter['status']) {
  switch (status) {
    case 'disponivel': return 'bg-safe';
    case 'parcial':    return 'bg-warning';
    case 'lotado':     return 'bg-danger';
  }
}

export function getTypeLabel(type: Shelter['type']) {
  switch (type) {
    case 'escola':      return 'Escola';
    case 'igreja':      return 'Ponto de Coleta Paroquial';
    case 'ginasio':     return 'Ginásio';
    case 'centro':      return 'Ponto de Coleta Comunitário';
    case 'universidade': return 'Universidade';
    case 'publico':     return 'Prédio Público';
  }
}

export function getRiskLevelLabel(level: RiskZone['level']) {
  switch (level) {
    case 'alto':      return 'Alto';
    case 'medio':     return 'Médio';
    case 'moderado':  return 'Moderado';
  }
}

export function getRiskLevelColor(level: RiskZone['level']) {
  switch (level) {
    case 'alto':      return '#ef4444';
    case 'medio':     return '#f97316';
    case 'moderado':  return '#eab308';
  }
}

export function isInRiskZone(lat: number, lng: number): RiskZone | null {
  for (const zone of riskZones) {
    const dist = haversineDistance(lat, lng, zone.center[0], zone.center[1]);
    if (dist <= zone.radius) return zone;
  }
  return null;
}

export function findNearestSafeShelter(lat: number, lng: number): Shelter | null {
  const available = shelters.filter(s => s.status !== 'lotado');
  if (!available.length) return null;
  return available.reduce((prev, curr) => {
    const prevDist = haversineDistance(lat, lng, prev.lat, prev.lng);
    const currDist = haversineDistance(lat, lng, curr.lat, curr.lng);
    return currDist < prevDist ? curr : prev;
  });
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
