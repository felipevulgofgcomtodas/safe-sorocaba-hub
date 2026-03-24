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

export const shelters: Shelter[] = [
  { id: 1, name: "UNISO", address: "Rod. Raposo Tavares, Km 92,5", lat: -23.5039, lng: -47.4543, capacity: 500, occupied: 120, type: "universidade", status: "disponivel", donations: [
    { item: "Alimentos", needed: 200, received: 155, unit: "kg" },
    { item: "Água", needed: 300, received: 220, unit: "L" },
    { item: "Cobertores", needed: 50, received: 38, unit: "un" },
    { item: "Colchões", needed: 40, received: 28, unit: "un" },
  ]},
  { id: 2, name: "FACENS", address: "Rod. Sen. José Ermírio de Moraes, 1425", lat: -23.4817, lng: -47.4255, capacity: 400, occupied: 310, type: "universidade", status: "parcial", donations: [
    { item: "Alimentos", needed: 180, received: 180, unit: "kg" },
    { item: "Água", needed: 250, received: 190, unit: "L" },
    { item: "Kit Higiene", needed: 60, received: 42, unit: "un" },
    { item: "Fraldas", needed: 35, received: 20, unit: "pct" },
  ]},
  { id: 3, name: "UNIP Sorocaba", address: "Av. Independência, 210", lat: -23.4785, lng: -47.4440, capacity: 350, occupied: 80, type: "universidade", status: "disponivel", donations: [
    { item: "Roupas", needed: 120, received: 85, unit: "un" },
    { item: "Medicamentos", needed: 30, received: 12, unit: "cx" },
    { item: "Água", needed: 200, received: 200, unit: "L" },
    { item: "Cobertores", needed: 35, received: 35, unit: "un" },
  ]},
  { id: 4, name: "Paço Municipal", address: "Av. Eng. Carlos Reinaldo Mendes, 3041", lat: -23.5022, lng: -47.4577, capacity: 200, occupied: 45, type: "publico", status: "disponivel", donations: [
    { item: "Alimentos", needed: 90, received: 67, unit: "kg" },
    { item: "Colchões", needed: 25, received: 18, unit: "un" },
    { item: "Kit Higiene", needed: 40, received: 40, unit: "un" },
    { item: "Fraldas", needed: 20, received: 8, unit: "pct" },
  ]},
  { id: 5, name: "CIC Sorocaba", address: "Av. Américo Figueiredo, 3000", lat: -23.5085, lng: -47.4797, capacity: 300, occupied: 290, type: "centro", status: "lotado", donations: [
    { item: "Alimentos", needed: 150, received: 150, unit: "kg" },
    { item: "Água", needed: 400, received: 350, unit: "L" },
    { item: "Medicamentos", needed: 25, received: 25, unit: "cx" },
    { item: "Roupas", needed: 80, received: 72, unit: "un" },
  ]},
  { id: 6, name: "Parque Campolim", address: "Av. Antônio Carlos Comitre - Campolim", lat: -23.5110, lng: -47.4762, capacity: 250, occupied: 60, type: "publico", status: "disponivel", donations: [
    { item: "Cobertores", needed: 30, received: 14, unit: "un" },
    { item: "Água", needed: 150, received: 100, unit: "L" },
    { item: "Alimentos", needed: 75, received: 40, unit: "kg" },
  ]},
  { id: 7, name: "Parque Chico Mendes", address: "Av. Itavuvu - Jd. Santa Cecília", lat: -23.4595, lng: -47.4258, capacity: 200, occupied: 40, type: "publico", status: "disponivel", donations: [
    { item: "Kit Higiene", needed: 25, received: 10, unit: "un" },
    { item: "Fraldas", needed: 15, received: 15, unit: "pct" },
    { item: "Colchões", needed: 20, received: 5, unit: "un" },
  ]},
  { id: 8, name: "Ginásio Gualberto Moreira", address: "R. da Penha, 680 - Vila Santana", lat: -23.4952, lng: -47.4445, capacity: 400, occupied: 100, type: "ginasio", status: "disponivel", donations: [
    { item: "Alimentos", needed: 160, received: 110, unit: "kg" },
    { item: "Roupas", needed: 55, received: 30, unit: "un" },
    { item: "Água", needed: 280, received: 200, unit: "L" },
    { item: "Medicamentos", needed: 18, received: 7, unit: "cx" },
  ]},
  { id: 9, name: "Centro Cultural de Sorocaba", address: "R. São Bento, 400 - Centro", lat: -23.5018, lng: -47.4589, capacity: 200, occupied: 60, type: "centro", status: "disponivel", donations: [
    { item: "Cobertores", needed: 22, received: 22, unit: "un" },
    { item: "Alimentos", needed: 65, received: 50, unit: "kg" },
    { item: "Kit Higiene", needed: 30, received: 18, unit: "un" },
  ]},
  { id: 10, name: "E.E. Baltazar Fernandes", address: "R. Baltazar Fernandes, 218 - Centro", lat: -23.5020, lng: -47.4565, capacity: 150, occupied: 60, type: "escola", status: "disponivel", donations: [
    { item: "Água", needed: 100, received: 75, unit: "L" },
    { item: "Fraldas", needed: 12, received: 4, unit: "pct" },
    { item: "Roupas", needed: 40, received: 25, unit: "un" },
  ]},
  { id: 11, name: "E.E. Getúlio Vargas", address: "R. Hermelino Matarazzo, 100 - Vila Hortência", lat: -23.4926, lng: -47.4681, capacity: 180, occupied: 100, type: "escola", status: "parcial", donations: [
    { item: "Alimentos", needed: 70, received: 45, unit: "kg" },
    { item: "Colchões", needed: 15, received: 6, unit: "un" },
    { item: "Medicamentos", needed: 10, received: 3, unit: "cx" },
  ]},
  { id: 12, name: "E.E. Antonio Padilha", address: "R. Padre Luís, 327 - Centro", lat: -23.5011, lng: -47.4498, capacity: 200, occupied: 30, type: "escola", status: "disponivel", donations: [
    { item: "Kit Higiene", needed: 45, received: 30, unit: "un" },
    { item: "Água", needed: 180, received: 120, unit: "L" },
    { item: "Cobertores", needed: 28, received: 12, unit: "un" },
  ]},
  { id: 13, name: "Catedral Metropolitana", address: "Praça Cel. Fernando Prestes - Centro", lat: -23.5022, lng: -47.4573, capacity: 120, occupied: 20, type: "igreja", status: "disponivel", donations: [
    { item: "Alimentos", needed: 45, received: 45, unit: "kg" },
    { item: "Roupas", needed: 30, received: 22, unit: "un" },
  ]},
  { id: 14, name: "Igreja São Bento", address: "R. São Bento, 750 - Centro", lat: -23.5002, lng: -47.4537, capacity: 100, occupied: 85, type: "igreja", status: "parcial", donations: [
    { item: "Água", needed: 120, received: 95, unit: "L" },
    { item: "Medicamentos", needed: 8, received: 8, unit: "cx" },
    { item: "Fraldas", needed: 18, received: 10, unit: "pct" },
  ]},
  { id: 15, name: "Ginásio Municipal de Esportes", address: "R. Cel. Nogueira Padilha, 1500", lat: -23.4947, lng: -47.4651, capacity: 600, occupied: 150, type: "ginasio", status: "disponivel", donations: [
    { item: "Alimentos", needed: 250, received: 170, unit: "kg" },
    { item: "Colchões", needed: 60, received: 35, unit: "un" },
    { item: "Cobertores", needed: 70, received: 45, unit: "un" },
    { item: "Água", needed: 500, received: 380, unit: "L" },
  ]},
  { id: 16, name: "SESI Sorocaba", address: "R. Cesário Motta, 200 - Vila Lucy", lat: -23.4889, lng: -47.4583, capacity: 450, occupied: 200, type: "ginasio", status: "parcial", donations: [
    { item: "Kit Higiene", needed: 80, received: 55, unit: "un" },
    { item: "Roupas", needed: 100, received: 60, unit: "un" },
    { item: "Alimentos", needed: 190, received: 140, unit: "kg" },
  ]},
  { id: 17, name: "Centro Comunitário Vila Haro", address: "R. Aparecida, 500 - Vila Haro", lat: -23.5168, lng: -47.4722, capacity: 100, occupied: 10, type: "centro", status: "disponivel", donations: [
    { item: "Água", needed: 60, received: 20, unit: "L" },
    { item: "Cobertores", needed: 12, received: 3, unit: "un" },
  ]},
  { id: 18, name: "E.E. Newton Prado", address: "R. Newton Prado, 80 - Centro", lat: -23.5036, lng: -47.4519, capacity: 160, occupied: 40, type: "escola", status: "disponivel", donations: [
    { item: "Alimentos", needed: 55, received: 30, unit: "kg" },
    { item: "Fraldas", needed: 10, received: 2, unit: "pct" },
    { item: "Medicamentos", needed: 12, received: 5, unit: "cx" },
  ]},
  { id: 19, name: "SENAI Sorocaba", address: "R. Brig. Tobias, 600 - Centro", lat: -23.4975, lng: -47.4478, capacity: 250, occupied: 70, type: "centro", status: "disponivel", donations: [
    { item: "Colchões", needed: 30, received: 20, unit: "un" },
    { item: "Água", needed: 200, received: 150, unit: "L" },
    { item: "Kit Higiene", needed: 35, received: 22, unit: "un" },
  ]},
  { id: 20, name: "Centro Esportivo do Trabalhador", address: "Av. São Paulo, 1000 - Jd. Vergueiro", lat: -23.4852, lng: -47.4543, capacity: 500, occupied: 180, type: "ginasio", status: "disponivel", donations: [
    { item: "Alimentos", needed: 220, received: 160, unit: "kg" },
    { item: "Roupas", needed: 90, received: 50, unit: "un" },
    { item: "Cobertores", needed: 45, received: 30, unit: "un" },
    { item: "Água", needed: 350, received: 280, unit: "L" },
  ]},
  { id: 21, name: "FATEC Sorocaba", address: "R. José Crespo Gonzales, 222", lat: -23.4764, lng: -47.4429, capacity: 300, occupied: 50, type: "universidade", status: "disponivel", donations: [
    { item: "Kit Higiene", needed: 50, received: 35, unit: "un" },
    { item: "Medicamentos", needed: 15, received: 9, unit: "cx" },
  ]},
  { id: 22, name: "SESC Sorocaba", address: "R. Cesário Motta, 450 - Vila Lucy", lat: -23.4901, lng: -47.4555, capacity: 350, occupied: 120, type: "ginasio", status: "disponivel", donations: [
    { item: "Alimentos", needed: 140, received: 100, unit: "kg" },
    { item: "Água", needed: 250, received: 180, unit: "L" },
    { item: "Fraldas", needed: 22, received: 14, unit: "pct" },
  ]},
  { id: 23, name: "Igreja N.S. Aparecida", address: "R. Aparecida, 300 - Além Ponte", lat: -23.5121, lng: -47.4633, capacity: 90, occupied: 50, type: "igreja", status: "parcial", donations: [
    { item: "Cobertores", needed: 15, received: 8, unit: "un" },
    { item: "Roupas", needed: 25, received: 15, unit: "un" },
  ]},
  { id: 24, name: "E.E. Machado de Assis", address: "R. Cel. Nogueira Padilha, 400", lat: -23.4981, lng: -47.4612, capacity: 140, occupied: 130, type: "escola", status: "lotado", donations: [
    { item: "Alimentos", needed: 100, received: 100, unit: "kg" },
    { item: "Água", needed: 200, received: 200, unit: "L" },
    { item: "Medicamentos", needed: 20, received: 20, unit: "cx" },
    { item: "Cobertores", needed: 30, received: 30, unit: "un" },
  ]},
  { id: 25, name: "Igreja Evangélica Central", address: "Av. General Carneiro, 220 - Centro", lat: -23.5008, lng: -47.4602, capacity: 110, occupied: 40, type: "igreja", status: "disponivel", donations: [
    { item: "Kit Higiene", needed: 20, received: 12, unit: "un" },
    { item: "Fraldas", needed: 8, received: 3, unit: "pct" },
  ]},
  { id: 26, name: "E.E. Dr. Julio Prestes", address: "R. Dr. Julio Prestes, 150 - Além Ponte", lat: -23.5098, lng: -47.4687, capacity: 170, occupied: 90, type: "escola", status: "parcial", donations: [
    { item: "Alimentos", needed: 80, received: 55, unit: "kg" },
    { item: "Colchões", needed: 18, received: 10, unit: "un" },
    { item: "Roupas", needed: 35, received: 20, unit: "un" },
  ]},
  { id: 27, name: "Centro Comunitário Além Ponte", address: "R. Além Ponte, 100", lat: -23.5112, lng: -47.4701, capacity: 90, occupied: 88, type: "centro", status: "lotado", donations: [
    { item: "Água", needed: 150, received: 150, unit: "L" },
    { item: "Alimentos", needed: 80, received: 80, unit: "kg" },
    { item: "Cobertores", needed: 20, received: 20, unit: "un" },
  ]},
  { id: 28, name: "E.E. Prof. Ataliba Pires", address: "R. Ataliba Pires, 300 - Jd. Vergueiro", lat: -23.4831, lng: -47.4561, capacity: 130, occupied: 65, type: "escola", status: "parcial", donations: [
    { item: "Medicamentos", needed: 14, received: 6, unit: "cx" },
    { item: "Kit Higiene", needed: 28, received: 15, unit: "un" },
    { item: "Água", needed: 90, received: 60, unit: "L" },
  ]},
  { id: 29, name: "Igreja Metodista Central", address: "R. 15 de Novembro, 180 - Centro", lat: -23.5013, lng: -47.4555, capacity: 80, occupied: 15, type: "igreja", status: "disponivel", donations: [
    { item: "Roupas", needed: 20, received: 8, unit: "un" },
    { item: "Cobertores", needed: 10, received: 4, unit: "un" },
  ]},
  { id: 30, name: "Centro Comunitário Maria Eugênia", address: "R. Maria Eugênia, 50", lat: -23.5172, lng: -47.4398, capacity: 70, occupied: 30, type: "centro", status: "disponivel", donations: [
    { item: "Alimentos", needed: 30, received: 18, unit: "kg" },
    { item: "Água", needed: 50, received: 30, unit: "L" },
    { item: "Fraldas", needed: 6, received: 1, unit: "pct" },
  ]},
];

export const riskZones: RiskZone[] = [
  { name: "Av. Dom Aguirre (Marginal do Rio)", level: "alto", center: [-23.5015, -47.4526], radius: 1500 },
  { name: "Parque das Águas", level: "alto", center: [-23.4968, -47.4512], radius: 1200 },
  { name: "Vila Barão", level: "alto", center: [-23.4950, -47.4575], radius: 1000 },
  { name: "Jardim Abaeté", level: "alto", center: [-23.4935, -47.4480], radius: 900 },
  { name: "Av. Afonso Vergueiro", level: "medio", center: [-23.5055, -47.4580], radius: 800 },
  { name: "Centro (região baixa)", level: "medio", center: [-23.5010, -47.4560], radius: 700 },
  { name: "Ponte Pinheiros", level: "medio", center: [-23.5000, -47.4535], radius: 600 },
  { name: "Av. Itavuvu", level: "moderado", center: [-23.4675, -47.4390], radius: 500 },
  { name: "Av. Ipanema", level: "moderado", center: [-23.4620, -47.4350], radius: 500 },
  { name: "Região do Éden", level: "moderado", center: [-23.4300, -47.3800], radius: 600 },
];

export function getStatusLabel(status: Shelter['status']) {
  switch (status) {
    case 'disponivel': return 'Disponível';
    case 'parcial': return 'Parcialmente ocupado';
    case 'lotado': return 'Lotado';
  }
}

export function getStatusColor(status: Shelter['status']) {
  switch (status) {
    case 'disponivel': return 'bg-safe';
    case 'parcial': return 'bg-warning';
    case 'lotado': return 'bg-danger';
  }
}

export function getTypeLabel(type: Shelter['type']) {
  switch (type) {
    case 'escola': return 'Escola';
    case 'igreja': return 'Igreja';
    case 'ginasio': return 'Ginásio';
    case 'centro': return 'Centro Comunitário';
    case 'universidade': return 'Universidade';
    case 'publico': return 'Prédio Público';
  }
}

export function getRiskLevelLabel(level: RiskZone['level']) {
  switch (level) {
    case 'alto': return 'Alto';
    case 'medio': return 'Médio';
    case 'moderado': return 'Moderado';
  }
}

export function getRiskLevelColor(level: RiskZone['level']) {
  switch (level) {
    case 'alto': return '#ef4444';
    case 'medio': return '#f97316';
    case 'moderado': return '#eab308';
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
