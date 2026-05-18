export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// ── App types ────────────────────────────────────────────────────────────────

export interface PontoColeta {
  id: string
  nome: string
  endereco: string
  latitude: number
  longitude: number
  tipo: string
  capacidade: number
  ocupados: number
  ativo: boolean
  created_at: string
}

export interface AreaRisco {
  id: string
  nome: string
  nivel: 'alto' | 'medio' | 'moderado'
  latitude: number
  longitude: number
  raio_metros: number
  ativo: boolean
}

export interface KitProducao {
  id: string
  tipo: string
  quantidade: number
  conformidade: string
  status: string
  data: string
}

export interface Doacao {
  id: string
  ponto_coleta_id: string | null
  tipo_kit: string
  quantidade: number
  responsavel: string | null
  data: string
}

export interface Campanha {
  id: string
  titulo: string
  descricao: string
  meta: number
  valor_arrecadado: number
  chave_pix: string
  ativa: boolean
  created_at: string
}

export interface Contribuicao {
  id: string
  campanha_id: string | null
  valor: number
  nome_doador: string | null
  anonimo: boolean
  data: string
}

export interface MensagemChat {
  id: string
  autor: string
  texto: string
  tipo: 'geral' | 'urgente' | 'voluntario' | 'doacao'
  localizacao: string | null
  data: string
}

export interface Voluntario {
  id: string
  nome: string
  telefone: string | null
  habilidades: string[]
  disponibilidade: string
  bairro: string | null
  ativo: boolean
  data: string
}

export interface StatusSistema {
  id: string
  nivel: 'pre-operacional' | 'atencao' | 'alerta' | 'operacao-ativa'
  precipitacao_mm: number
  areas_risco_ativas: number
  atualizado_em: string
}

export interface Alerta {
  id: string
  titulo: string
  mensagem: string
  nivel: 'info' | 'atencao' | 'alerta' | 'critico'
  ativo: boolean
  data: string
}

// ── Supabase Database type ────────────────────────────────────────────────────

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      pontos_coleta: {
        Row: PontoColeta
        Insert: Omit<PontoColeta, 'id' | 'created_at'>
        Update: Partial<Omit<PontoColeta, 'id'>>
      }
      areas_risco: {
        Row: AreaRisco
        Insert: Omit<AreaRisco, 'id'>
        Update: Partial<Omit<AreaRisco, 'id'>>
      }
      kits_producao: {
        Row: KitProducao
        Insert: Omit<KitProducao, 'id'>
        Update: Partial<Omit<KitProducao, 'id'>>
      }
      doacoes: {
        Row: Doacao
        Insert: Omit<Doacao, 'id'>
        Update: Partial<Omit<Doacao, 'id'>>
      }
      campanhas: {
        Row: Campanha
        Insert: Omit<Campanha, 'id' | 'created_at'>
        Update: Partial<Omit<Campanha, 'id'>>
      }
      contribuicoes: {
        Row: Contribuicao
        Insert: Omit<Contribuicao, 'id'>
        Update: Partial<Omit<Contribuicao, 'id'>>
      }
      mensagens_chat: {
        Row: MensagemChat
        Insert: Omit<MensagemChat, 'id'>
        Update: Partial<Omit<MensagemChat, 'id'>>
      }
      voluntarios: {
        Row: Voluntario
        Insert: Omit<Voluntario, 'id'>
        Update: Partial<Omit<Voluntario, 'id'>>
      }
      status_sistema: {
        Row: StatusSistema
        Insert: Omit<StatusSistema, 'id'>
        Update: Partial<Omit<StatusSistema, 'id'>>
      }
      alertas: {
        Row: Alerta
        Insert: Omit<Alerta, 'id'>
        Update: Partial<Omit<Alerta, 'id'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
