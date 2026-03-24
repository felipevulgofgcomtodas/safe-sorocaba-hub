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

export const shelters: Shelter[] = [
  { id: 1, name: "UNISO", address: "Rod. Raposo Tavares, Km 92,5", lat: -23.4870, lng: -47.4520, capacity: 500, occupied: 120, type: "universidade", status: "disponivel" },
  { id: 2, name: "FACENS", address: "Rod. Sen. José Ermírio de Moraes, 1425", lat: -23.4650, lng: -47.4280, capacity: 400, occupied: 310, type: "universidade", status: "parcial" },
  { id: 3, name: "UNIP Sorocaba", address: "Av. Independência, 210", lat: -23.5020, lng: -47.4580, capacity: 350, occupied: 80, type: "universidade", status: "disponivel" },
  { id: 4, name: "Paço Municipal", address: "Av. Eng. Carlos Reinaldo Mendes, 3041", lat: -23.4960, lng: -47.4370, capacity: 200, occupied: 45, type: "publico", status: "disponivel" },
  { id: 5, name: "CIC Sorocaba", address: "Av. Américo Figueiredo, 3000", lat: -23.5100, lng: -47.4650, capacity: 300, occupied: 290, type: "centro", status: "lotado" },
  { id: 6, name: "E.E. Baltazar Fernandes", address: "R. Baltazar Fernandes, 218", lat: -23.5050, lng: -47.4560, capacity: 150, occupied: 60, type: "escola", status: "disponivel" },
  { id: 7, name: "E.E. Getúlio Vargas", address: "R. Hermelino Matarazzo, 100", lat: -23.4920, lng: -47.4700, capacity: 180, occupied: 100, type: "escola", status: "parcial" },
  { id: 8, name: "E.E. Antonio Padilha", address: "R. Padre Luís, 327", lat: -23.5000, lng: -47.4400, capacity: 200, occupied: 30, type: "escola", status: "disponivel" },
  { id: 9, name: "Igreja Matriz", address: "Praça Cel. Fernando Prestes", lat: -23.5015, lng: -47.4571, capacity: 120, occupied: 20, type: "igreja", status: "disponivel" },
  { id: 10, name: "Igreja São Bento", address: "R. São Bento, 750", lat: -23.4980, lng: -47.4500, capacity: 100, occupied: 85, type: "igreja", status: "parcial" },
  { id: 11, name: "Ginásio Municipal", address: "Av. Pereira da Silva, 1500", lat: -23.5080, lng: -47.4480, capacity: 600, occupied: 150, type: "ginasio", status: "disponivel" },
  { id: 12, name: "Ginásio do SESI", address: "R. Cesário Motta, 200", lat: -23.4900, lng: -47.4600, capacity: 450, occupied: 200, type: "ginasio", status: "parcial" },
  { id: 13, name: "Centro Comunitário Vila Haro", address: "R. Aparecida, 500", lat: -23.5150, lng: -47.4700, capacity: 100, occupied: 10, type: "centro", status: "disponivel" },
  { id: 14, name: "Centro Comunitário Jd. Éden", address: "R. Palmares, 250", lat: -23.4800, lng: -47.4350, capacity: 80, occupied: 75, type: "centro", status: "lotado" },
  { id: 15, name: "E.E. Newton Prado", address: "R. Newton Prado, 80", lat: -23.5060, lng: -47.4530, capacity: 160, occupied: 40, type: "escola", status: "disponivel" },
  { id: 16, name: "Igreja N.S. Aparecida", address: "R. Aparecida, 300", lat: -23.5120, lng: -47.4620, capacity: 90, occupied: 50, type: "igreja", status: "parcial" },
  { id: 17, name: "SENAI Sorocaba", address: "R. Brig. Tobias, 600", lat: -23.4950, lng: -47.4450, capacity: 250, occupied: 70, type: "centro", status: "disponivel" },
  { id: 18, name: "E.E. Machado de Assis", address: "R. Cel. Nogueira Padilha, 400", lat: -23.5030, lng: -47.4380, capacity: 140, occupied: 130, type: "escola", status: "lotado" },
  { id: 19, name: "Centro Esportivo do Trabalhador", address: "Av. São Paulo, 1000", lat: -23.4880, lng: -47.4550, capacity: 500, occupied: 180, type: "ginasio", status: "disponivel" },
  { id: 20, name: "Igreja Evangélica Central", address: "Av. General Carneiro, 220", lat: -23.5010, lng: -47.4610, capacity: 110, occupied: 40, type: "igreja", status: "disponivel" },
  { id: 21, name: "E.E. Dr. Julio Prestes", address: "R. Dr. Julio Prestes, 150", lat: -23.4970, lng: -47.4680, capacity: 170, occupied: 90, type: "escola", status: "parcial" },
  { id: 22, name: "FATEC Sorocaba", address: "R. José Crespo Gonzales, 222", lat: -23.4750, lng: -47.4420, capacity: 300, occupied: 50, type: "universidade", status: "disponivel" },
  { id: 23, name: "Centro Comunitário Além Ponte", address: "R. Além Ponte, 100", lat: -23.5090, lng: -47.4750, capacity: 90, occupied: 88, type: "centro", status: "lotado" },
  { id: 24, name: "Ginásio Gualberto Moreira", address: "R. da Penha, 680", lat: -23.5040, lng: -47.4500, capacity: 400, occupied: 100, type: "ginasio", status: "disponivel" },
  { id: 25, name: "E.E. Prof. Ataliba Pires", address: "R. Ataliba Pires, 300", lat: -23.4830, lng: -47.4580, capacity: 130, occupied: 65, type: "escola", status: "parcial" },
  { id: 26, name: "Igreja Metodista Central", address: "R. 15 de Novembro, 180", lat: -23.5005, lng: -47.4545, capacity: 80, occupied: 15, type: "igreja", status: "disponivel" },
  { id: 27, name: "Centro Comunitário Maria Eugênia", address: "R. Maria Eugênia, 50", lat: -23.5170, lng: -47.4400, capacity: 70, occupied: 30, type: "centro", status: "disponivel" },
  { id: 28, name: "E.E. Prof. Flávio Pinto", address: "R. São Carlos, 400", lat: -23.4860, lng: -47.4470, capacity: 190, occupied: 180, type: "escola", status: "lotado" },
  { id: 29, name: "Ginásio do SESC", address: "R. Cesário Motta, 450", lat: -23.4940, lng: -47.4550, capacity: 350, occupied: 120, type: "ginasio", status: "disponivel" },
  { id: 30, name: "Centro Cultural de Sorocaba", address: "R. São Bento, 400", lat: -23.4990, lng: -47.4520, capacity: 200, occupied: 60, type: "centro", status: "disponivel" },
];

export const riskZones = [
  {
    name: "Rio Sorocaba - Centro",
    level: "alto" as const,
    coords: [
      [-23.500, -47.460], [-23.502, -47.458], [-23.505, -47.455],
      [-23.508, -47.453], [-23.510, -47.456], [-23.508, -47.460],
      [-23.505, -47.462], [-23.502, -47.461],
    ] as [number, number][],
  },
  {
    name: "Av. Dom Aguirre",
    level: "alto" as const,
    coords: [
      [-23.498, -47.455], [-23.500, -47.452], [-23.503, -47.449],
      [-23.505, -47.451], [-23.503, -47.454], [-23.500, -47.457],
    ] as [number, number][],
  },
  {
    name: "Parque das Águas",
    level: "medio" as const,
    coords: [
      [-23.508, -47.465], [-23.510, -47.462], [-23.513, -47.460],
      [-23.515, -47.463], [-23.513, -47.466], [-23.510, -47.467],
    ] as [number, number][],
  },
  {
    name: "Vila Barão",
    level: "alto" as const,
    coords: [
      [-23.512, -47.470], [-23.514, -47.467], [-23.517, -47.465],
      [-23.519, -47.468], [-23.517, -47.471], [-23.514, -47.472],
    ] as [number, number][],
  },
  {
    name: "Jardim Abaeté",
    level: "medio" as const,
    coords: [
      [-23.480, -47.445], [-23.482, -47.442], [-23.485, -47.440],
      [-23.487, -47.443], [-23.485, -47.446], [-23.482, -47.447],
    ] as [number, number][],
  },
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
