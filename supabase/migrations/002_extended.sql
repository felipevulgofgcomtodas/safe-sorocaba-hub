-- =====================================================================
-- SAFE FLOOD SOROCABA — Schema Estendido v2
-- Execute no Supabase Dashboard → SQL Editor
-- =====================================================================

-- Extensão UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Remove tabelas antigas (se existirem com SERIAL)
DROP TABLE IF EXISTS doacoes CASCADE;
DROP TABLE IF EXISTS kits_produzidos CASCADE;
DROP TABLE IF EXISTS pontos_coleta CASCADE;

-- ── Pontos de Coleta ─────────────────────────────────────────────────
CREATE TABLE pontos_coleta (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  endereco    TEXT NOT NULL,
  latitude    DECIMAL(10,8) NOT NULL,
  longitude   DECIMAL(11,8) NOT NULL,
  tipo        TEXT NOT NULL,
  capacidade  INTEGER NOT NULL DEFAULT 0,
  ocupados    INTEGER NOT NULL DEFAULT 0,
  ativo       BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Áreas de Risco ───────────────────────────────────────────────────
CREATE TABLE areas_risco (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome        TEXT NOT NULL,
  nivel       TEXT NOT NULL CHECK (nivel IN ('alto','medio','moderado')),
  latitude    DECIMAL(10,8) NOT NULL,
  longitude   DECIMAL(11,8) NOT NULL,
  raio_metros INTEGER NOT NULL DEFAULT 500,
  ativo       BOOLEAN NOT NULL DEFAULT true
);

-- ── Kits de Produção ─────────────────────────────────────────────────
CREATE TABLE kits_producao (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo        TEXT NOT NULL,
  quantidade  INTEGER NOT NULL CHECK (quantidade >= 0),
  conformidade TEXT NOT NULL DEFAULT '100%',
  status      TEXT NOT NULL DEFAULT 'aprovado',
  data        TIMESTAMPTZ DEFAULT NOW()
);

-- ── Doações ──────────────────────────────────────────────────────────
CREATE TABLE doacoes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ponto_coleta_id UUID REFERENCES pontos_coleta(id),
  tipo_kit        TEXT NOT NULL,
  quantidade      INTEGER NOT NULL CHECK (quantidade > 0),
  responsavel     TEXT,
  data            TIMESTAMPTZ DEFAULT NOW()
);

-- ── Campanhas (Vaquinha) ─────────────────────────────────────────────
CREATE TABLE campanhas (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo           TEXT NOT NULL,
  descricao        TEXT NOT NULL,
  meta             NUMERIC(10,2) NOT NULL DEFAULT 0,
  valor_arrecadado NUMERIC(10,2) NOT NULL DEFAULT 0,
  chave_pix        TEXT NOT NULL,
  ativa            BOOLEAN NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Contribuições ────────────────────────────────────────────────────
CREATE TABLE contribuicoes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campanha_id  UUID REFERENCES campanhas(id),
  valor        NUMERIC(10,2) NOT NULL CHECK (valor > 0),
  nome_doador  TEXT,
  anonimo      BOOLEAN DEFAULT false,
  data         TIMESTAMPTZ DEFAULT NOW()
);

-- ── Mensagens do Chat ────────────────────────────────────────────────
CREATE TABLE mensagens_chat (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  autor      TEXT NOT NULL DEFAULT 'Anônimo',
  texto      TEXT NOT NULL,
  tipo       TEXT NOT NULL DEFAULT 'geral' CHECK (tipo IN ('geral','urgente','voluntario','doacao')),
  localizacao TEXT,
  data       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Voluntários ──────────────────────────────────────────────────────
CREATE TABLE voluntarios (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome           TEXT NOT NULL,
  telefone       TEXT,
  habilidades    TEXT[] NOT NULL DEFAULT '{}',
  disponibilidade TEXT NOT NULL DEFAULT 'fins-de-semana',
  bairro         TEXT,
  ativo          BOOLEAN NOT NULL DEFAULT true,
  data           TIMESTAMPTZ DEFAULT NOW()
);

-- ── Status do Sistema ────────────────────────────────────────────────
CREATE TABLE status_sistema (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nivel           TEXT NOT NULL DEFAULT 'pre-operacional' CHECK (nivel IN ('pre-operacional','atencao','alerta','operacao-ativa')),
  precipitacao_mm DECIMAL(5,2) DEFAULT 0,
  areas_risco_ativas INTEGER DEFAULT 0,
  atualizado_em   TIMESTAMPTZ DEFAULT NOW()
);

-- ── Alertas ──────────────────────────────────────────────────────────
CREATE TABLE alertas (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo     TEXT NOT NULL,
  mensagem   TEXT NOT NULL,
  nivel      TEXT NOT NULL DEFAULT 'info' CHECK (nivel IN ('info','atencao','alerta','critico')),
  ativo      BOOLEAN NOT NULL DEFAULT true,
  data       TIMESTAMPTZ DEFAULT NOW()
);

-- ── Seeds ────────────────────────────────────────────────────────────

INSERT INTO pontos_coleta (nome, endereco, latitude, longitude, tipo, capacidade, ocupados) VALUES
('Comunidade Santa Bárbara',    'Rua Luiz Geraldo Franco de Mendonça, 150 - Jardim das Estrelas',  -23.4972, -47.4581, 'Comunitário', 600,  15),
('Paróquia Santo Antônio',      'R. Martins de Oliveira, 229 - Vila Haro',                          -23.5021, -47.4472, 'Paroquial',   900,  15),
('Paróquia São Carlos Borromeu','Av. Dr. Eugênio Salerno, 166 - Centro',                            -23.5014, -47.4584, 'Paroquial',   1500, 15);

INSERT INTO areas_risco (nome, nivel, latitude, longitude, raio_metros) VALUES
('Avenida Dom Aguirre',               'alto',     -23.5034, -47.4602, 1200),
('Avenida Ipanema',                   'alto',     -23.4837, -47.4716, 1000),
('Avenida Afonso Vergueiro',          'medio',    -23.5095, -47.4548, 800),
('Terminal Rodoviário Santo Antônio', 'medio',    -23.5064, -47.4571, 600),
('Jardim Abaeté',                     'moderado', -23.5408, -47.4348, 700),
('Vitória Régia',                     'moderado', -23.5588, -47.4625, 600);

INSERT INTO kits_producao (tipo, quantidade, conformidade, status) VALUES
('Kits de Alimentos 72h (individual)',          45,  '100%', 'aprovado'),
('Kits de Alimentos 7 dias (família 4 pessoas)',10,  '100%', 'aprovado'),
('Kits de Higiene',                             114, '100%', 'aprovado');

INSERT INTO campanhas (titulo, descricao, meta, valor_arrecadado, chave_pix) VALUES
('Kits Alimentares de Emergência',
 'Financie cestas básicas e kits de 72h para famílias deslocadas pelas enchentes. Cada R$ 50 alimenta uma família por 3 dias.',
 25000, 8450, 'safeflood@sorocaba.sp.gov.br'),
('Kits de Higiene e Limpeza',
 'Garanta dignidade e saúde para as famílias nos pontos de coleta. Kits com itens essenciais de higiene pessoal e limpeza doméstica.',
 15000, 4200, 'safeflood.higiene@sorocaba.sp.gov.br'),
('Água Potável para Sorocaba',
 'Contribua com o fornecimento de água mineral e purificada. Meta: 11.000 litros distribuídos nos 3 pontos de coleta.',
 10000, 2100, 'safeflood.agua@sorocaba.sp.gov.br');

INSERT INTO status_sistema (nivel, precipitacao_mm, areas_risco_ativas) VALUES
('pre-operacional', 0, 0);

INSERT INTO alertas (titulo, mensagem, nivel, ativo) VALUES
('Sistema em Pré-Operação', 'SafeFlood Sorocaba em fase de preparação. Ativação prevista para Agosto 2025.', 'info', true);

-- ── RLS ──────────────────────────────────────────────────────────────
ALTER TABLE pontos_coleta    ENABLE ROW LEVEL SECURITY;
ALTER TABLE areas_risco      ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits_producao    ENABLE ROW LEVEL SECURITY;
ALTER TABLE doacoes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE campanhas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE contribuicoes    ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens_chat   ENABLE ROW LEVEL SECURITY;
ALTER TABLE voluntarios      ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_sistema   ENABLE ROW LEVEL SECURITY;
ALTER TABLE alertas          ENABLE ROW LEVEL SECURITY;

-- Leitura pública
CREATE POLICY "pub_read_pontos"     ON pontos_coleta   FOR SELECT USING (true);
CREATE POLICY "pub_read_risco"      ON areas_risco     FOR SELECT USING (true);
CREATE POLICY "pub_read_kits"       ON kits_producao   FOR SELECT USING (true);
CREATE POLICY "pub_read_campanhas"  ON campanhas       FOR SELECT USING (true);
CREATE POLICY "pub_read_contrib"    ON contribuicoes   FOR SELECT USING (true);
CREATE POLICY "pub_read_chat"       ON mensagens_chat  FOR SELECT USING (true);
CREATE POLICY "pub_read_status"     ON status_sistema  FOR SELECT USING (true);
CREATE POLICY "pub_read_alertas"    ON alertas         FOR SELECT USING (ativo = true);
CREATE POLICY "pub_read_voluntarios" ON voluntarios    FOR SELECT USING (true);
CREATE POLICY "pub_read_doacoes"    ON doacoes         FOR SELECT USING (true);

-- Inserção pública
CREATE POLICY "pub_insert_doacoes"     ON doacoes        FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_insert_contrib"     ON contribuicoes  FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_insert_chat"        ON mensagens_chat FOR INSERT WITH CHECK (true);
CREATE POLICY "pub_insert_voluntarios" ON voluntarios    FOR INSERT WITH CHECK (true);

-- Realtime para chat
ALTER PUBLICATION supabase_realtime ADD TABLE mensagens_chat;
