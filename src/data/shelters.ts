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
}

export interface RiskZone {
  name: string;
  level: 'alto' | 'medio' | 'moderado';
  center: [number, number];
  radius: number;
}

// Coordenadas exatas fornecidas manualmente
export const shelters: Shelter[] = [
  { id: 1, name: "UNISO", address: "Rod. Raposo Tavares, Km 92,5", lat: -23.5039, lng: -47.4543, capacity: 500, occupied: 120, type: "universidade", status: "disponivel" },
  { id: 2, name: "FACENS", address: "Rod. Sen. José Ermírio de Moraes, 1425", lat: -23.4817, lng: -47.4255, capacity: 400, occupied: 310, type: "universidade", status: "parcial" },
  { id: 3, name: "UNIP Sorocaba", address: "Av. Independência, 210", lat: -23.4785, lng: -47.4440, capacity: 350, occupied: 80, type: "universidade", status: "disponivel" },
  { id: 4, name: "Paço Municipal", address: "Av. Eng. Carlos Reinaldo Mendes, 3041", lat: -23.5022, lng: -47.4577, capacity: 200, occupied: 45, type: "publico", status: "disponivel" },
  { id: 5, name: "CIC Sorocaba", address: "Av. Américo Figueiredo, 3000", lat: -23.5085, lng: -47.4797, capacity: 300, occupied: 290, type: "centro", status: "lotado" },
  { id: 6, name: "Parque Campolim", address: "Av. Antônio Carlos Comitre - Campolim", lat: -23.5110, lng: -47.4762, capacity: 250, occupied: 60, type: "publico", status: "disponivel" },
  { id: 7, name: "Parque Chico Mendes", address: "Av. Itavuvu - Jd. Santa Cecília", lat: -23.4595, lng: -47.4258, capacity: 200, occupied: 40, type: "publico", status: "disponivel" },
  { id: 8, name: "Ginásio Gualberto Moreira", address: "R. da Penha, 680 - Vila Santana", lat: -23.4952, lng: -47.4445, capacity: 400, occupied: 100, type: "ginasio", status: "disponivel" },
  { id: 9, name: "Centro Cultural de Sorocaba", address: "R. São Bento, 400 - Centro", lat: -23.5018, lng: -47.4589, capacity: 200, occupied: 60, type: "centro", status: "disponivel" },
  { id: 10, name: "E.E. Baltazar Fernandes", address: "R. Baltazar Fernandes, 218 - Centro", lat: -23.5020, lng: -47.4565, capacity: 150, occupied: 60, type: "escola", status: "disponivel" },
  { id: 11, name: "E.E. Getúlio Vargas", address: "R. Hermelino Matarazzo, 100 - Vila Hortência", lat: -23.4926, lng: -47.4681, capacity: 180, occupied: 100, type: "escola", status: "parcial" },
  { id: 12, name: "E.E. Antonio Padilha", address: "R. Padre Luís, 327 - Centro", lat: -23.5011, lng: -47.4498, capacity: 200, occupied: 30, type: "escola", status: "disponivel" },
  { id: 13, name: "Catedral Metropolitana", address: "Praça Cel. Fernando Prestes - Centro", lat: -23.5022, lng: -47.4573, capacity: 120, occupied: 20, type: "igreja", status: "disponivel" },
  { id: 14, name: "Igreja São Bento", address: "R. São Bento, 750 - Centro", lat: -23.5002, lng: -47.4537, capacity: 100, occupied: 85, type: "igreja", status: "parcial" },
  { id: 15, name: "Ginásio Municipal de Esportes", address: "R. Cel. Nogueira Padilha, 1500", lat: -23.4947, lng: -47.4651, capacity: 600, occupied: 150, type: "ginasio", status: "disponivel" },
  { id: 16, name: "SESI Sorocaba", address: "R. Cesário Motta, 200 - Vila Lucy", lat: -23.4889, lng: -47.4583, capacity: 450, occupied: 200, type: "ginasio", status: "parcial" },
  { id: 17, name: "Centro Comunitário Vila Haro", address: "R. Aparecida, 500 - Vila Haro", lat: -23.5168, lng: -47.4722, capacity: 100, occupied: 10, type: "centro", status: "disponivel" },
  { id: 18, name: "E.E. Newton Prado", address: "R. Newton Prado, 80 - Centro", lat: -23.5036, lng: -47.4519, capacity: 160, occupied: 40, type: "escola", status: "disponivel" },
  { id: 19, name: "SENAI Sorocaba", address: "R. Brig. Tobias, 600 - Centro", lat: -23.4975, lng: -47.4478, capacity: 250, occupied: 70, type: "centro", status: "disponivel" },
  { id: 20, name: "Centro Esportivo do Trabalhador", address: "Av. São Paulo, 1000 - Jd. Vergueiro", lat: -23.4852, lng: -47.4543, capacity: 500, occupied: 180, type: "ginasio", status: "disponivel" },
  { id: 21, name: "FATEC Sorocaba", address: "R. José Crespo Gonzales, 222", lat: -23.4764, lng: -47.4429, capacity: 300, occupied: 50, type: "universidade", status: "disponivel" },
  { id: 22, name: "SESC Sorocaba", address: "R. Cesário Motta, 450 - Vila Lucy", lat: -23.4901, lng: -47.4555, capacity: 350, occupied: 120, type: "ginasio", status: "disponivel" },
  { id: 23, name: "Igreja N.S. Aparecida", address: "R. Aparecida, 300 - Além Ponte", lat: -23.5121, lng: -47.4633, capacity: 90, occupied: 50, type: "igreja", status: "parcial" },
  { id: 24, name: "E.E. Machado de Assis", address: "R. Cel. Nogueira Padilha, 400", lat: -23.4981, lng: -47.4612, capacity: 140, occupied: 130, type: "escola", status: "lotado" },
  { id: 25, name: "Igreja Evangélica Central", address: "Av. General Carneiro, 220 - Centro", lat: -23.5008, lng: -47.4602, capacity: 110, occupied: 40, type: "igreja", status: "disponivel" },
  { id: 26, name: "E.E. Dr. Julio Prestes", address: "R. Dr. Julio Prestes, 150 - Além Ponte", lat: -23.5098, lng: -47.4687, capacity: 170, occupied: 90, type: "escola", status: "parcial" },
  { id: 27, name: "Centro Comunitário Além Ponte", address: "R. Além Ponte, 100", lat: -23.5112, lng: -47.4701, capacity: 90, occupied: 88, type: "centro", status: "lotado" },
  { id: 28, name: "E.E. Prof. Ataliba Pires", address: "R. Ataliba Pires, 300 - Jd. Vergueiro", lat: -23.4831, lng: -47.4561, capacity: 130, occupied: 65, type: "escola", status: "parcial" },
  { id: 29, name: "Igreja Metodista Central", address: "R. 15 de Novembro, 180 - Centro", lat: -23.5013, lng: -47.4555, capacity: 80, occupied: 15, type: "igreja", status: "disponivel" },
  { id: 30, name: "Centro Comunitário Maria Eugênia", address: "R. Maria Eugênia, 50", lat: -23.5172, lng: -47.4398, capacity: 70, occupied: 30, type: "centro", status: "disponivel" },
];

export const riskZones: RiskZone[] = [
  // 🔴 ALTO RISCO
  { name: "Av. Dom Aguirre (Marginal do Rio)", level: "alto", center: [-23.5015, -47.4526], radius: 1500 },
  { name: "Parque das Águas", level: "alto", center: [-23.4968, -47.4512], radius: 1200 },
  { name: "Vila Barão", level: "alto", center: [-23.4950, -47.4575], radius: 1000 },
  { name: "Jardim Abaeté", level: "alto", center: [-23.4935, -47.4480], radius: 900 },

  // 🟠 MÉDIO RISCO
  { name: "Av. Afonso Vergueiro", level: "medio", center: [-23.5055, -47.4580], radius: 800 },
  { name: "Centro (região baixa)", level: "medio", center: [-23.5010, -47.4560], radius: 700 },
  { name: "Ponte Pinheiros", level: "medio", center: [-23.5000, -47.4535], radius: 600 },

  // 🟡 RISCO MODERADO
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
