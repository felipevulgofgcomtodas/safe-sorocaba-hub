-- =====================================================================
-- SAFE SOROCABA HUB — Schema inicial
-- Execute no Supabase Dashboard → SQL Editor
-- =====================================================================

-- Pontos de coleta reais
CREATE TABLE IF NOT EXISTS pontos_coleta (
  id                SERIAL PRIMARY KEY,
  nome              TEXT NOT NULL,
  endereco          TEXT NOT NULL,
  latitude          DECIMAL(10, 8) NOT NULL,
  longitude         DECIMAL(11, 8) NOT NULL,
  tipo              TEXT NOT NULL,
  capacidade_json   JSONB NOT NULL DEFAULT '{}',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Doações registradas pelos usuários
CREATE TABLE IF NOT EXISTS doacoes (
  id                SERIAL PRIMARY KEY,
  ponto_coleta_id   INTEGER REFERENCES pontos_coleta(id),
  tipo_kit          TEXT NOT NULL,
  quantidade        INTEGER NOT NULL CHECK (quantidade > 0),
  responsavel       TEXT,
  data              TIMESTAMPTZ DEFAULT NOW()
);

-- Kits já produzidos (controle operacional)
CREATE TABLE IF NOT EXISTS kits_produzidos (
  id          SERIAL PRIMARY KEY,
  tipo        TEXT NOT NULL,
  quantidade  INTEGER NOT NULL CHECK (quantidade > 0),
  responsavel TEXT,
  status      TEXT DEFAULT 'aprovado',
  data        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Seed: 3 pontos reais ─────────────────────────────────────────────
INSERT INTO pontos_coleta (nome, endereco, latitude, longitude, tipo, capacidade_json) VALUES
(
  'Comunidade Santa Bárbara',
  'Rua Luiz Geraldo Franco de Mendonça, 150 - Jardim das Estrelas, Sorocaba - SP, 18017-310',
  -23.4972, -47.4581,
  'Comunitário',
  '{"cestas_basicas":{"min":400,"max":600},"kits_higiene":{"min":500,"max":700},"kits_limpeza":{"min":300,"max":500},"agua_litros":{"min":1500,"max":2000}}'
),
(
  'Paróquia Santo Antônio',
  'R. Martins de Oliveira, 229 - Vila Haro, Sorocaba - SP, 18015-245',
  -23.5021, -47.4472,
  'Paroquial',
  '{"cestas_basicas":{"min":600,"max":900},"kits_higiene":{"min":700,"max":1000},"kits_limpeza":{"min":500,"max":700},"agua_litros":{"min":2000,"max":3000}}'
),
(
  'Paróquia São Carlos Borromeu',
  'Av. Dr. Eugênio Salerno, 166 - Centro, Sorocaba - SP, 18035-430',
  -23.5014, -47.4584,
  'Paroquial',
  '{"cestas_basicas":{"min":1000,"max":1500},"kits_higiene":{"min":1200,"max":1800},"kits_limpeza":{"min":800,"max":1200},"agua_litros":{"min":4000,"max":6000}}'
);

-- ── Seed: kits já produzidos ─────────────────────────────────────────
INSERT INTO kits_produzidos (tipo, quantidade, status) VALUES
('Kits de alimentos 72h (individual)',          45,  'aprovado'),
('Kits de alimentos 7 dias (família 4 pessoas)', 10, 'aprovado'),
('Kits de higiene',                             114, 'aprovado');

-- ── RLS: permitir leitura pública e inserção por qualquer usuário ────
ALTER TABLE pontos_coleta   ENABLE ROW LEVEL SECURITY;
ALTER TABLE doacoes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits_produzidos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leitura_publica_pontos"   ON pontos_coleta   FOR SELECT USING (true);
CREATE POLICY "leitura_publica_kits"     ON kits_produzidos FOR SELECT USING (true);
CREATE POLICY "leitura_publica_doacoes"  ON doacoes         FOR SELECT USING (true);
CREATE POLICY "inserir_doacoes"          ON doacoes         FOR INSERT WITH CHECK (true);
