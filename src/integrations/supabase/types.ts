export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      avaliacoes: {
        Row: {
          comentario: string | null
          created_at: string
          id: string
          nome_cliente: string | null
          nota: number
          oficina_id: string
          os_id: string
        }
        Insert: {
          comentario?: string | null
          created_at?: string
          id?: string
          nome_cliente?: string | null
          nota: number
          oficina_id: string
          os_id: string
        }
        Update: {
          comentario?: string | null
          created_at?: string
          id?: string
          nome_cliente?: string | null
          nota?: number
          oficina_id?: string
          os_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "avaliacoes_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avaliacoes_os_id_fkey"
            columns: ["os_id"]
            isOneToOne: true
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string
          oficina_id: string
          telefone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          oficina_id: string
          telefone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          oficina_id?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clientes_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas"
            referencedColumns: ["id"]
          },
        ]
      }
      colaboradores: {
        Row: {
          ativo: boolean
          created_at: string
          funcao: string | null
          id: string
          nome: string
          oficina_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          funcao?: string | null
          id?: string
          nome: string
          oficina_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          funcao?: string | null
          id?: string
          nome?: string
          oficina_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "colaboradores_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas"
            referencedColumns: ["id"]
          },
        ]
      }
      financeiro_lancamentos: {
        Row: {
          created_at: string
          data: string
          descricao: string
          id: string
          oficina_id: string
          tipo: string
          valor: number
        }
        Insert: {
          created_at?: string
          data?: string
          descricao: string
          id?: string
          oficina_id: string
          tipo?: string
          valor?: number
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string
          id?: string
          oficina_id?: string
          tipo?: string
          valor?: number
        }
        Relationships: []
      }
      oficinas: {
        Row: {
          auth_user_id: string | null
          created_at: string
          google_review_url: string | null
          id: string
          nome: string
          plano: string
          telefone: string | null
          trial_expires_at: string | null
        }
        Insert: {
          auth_user_id?: string | null
          created_at?: string
          google_review_url?: string | null
          id?: string
          nome: string
          plano?: string
          telefone?: string | null
          trial_expires_at?: string | null
        }
        Update: {
          auth_user_id?: string | null
          created_at?: string
          google_review_url?: string | null
          id?: string
          nome?: string
          plano?: string
          telefone?: string | null
          trial_expires_at?: string | null
        }
        Relationships: []
      }
      ordens_servico: {
        Row: {
          cliente_id: string
          cliente_notificado_entrega: boolean | null
          colaborador_id: string | null
          comprovante_pagamento: string | null
          created_at: string
          fotos_entrada: Json | null
          fotos_saida: Json | null
          id: string
          motivo_recusa: string | null
          observacoes: string | null
          oficina_id: string
          pagamento_confirmado: boolean | null
          pagamento_confirmado_em: string | null
          pagamento_forma: string | null
          prazo_estimado: string | null
          prazo_horas_calculado: number | null
          stage: string
          token_cliente: string
          updated_at: string
          valor_total: number
          veiculo_id: string
        }
        Insert: {
          cliente_id: string
          cliente_notificado_entrega?: boolean | null
          colaborador_id?: string | null
          comprovante_pagamento?: string | null
          created_at?: string
          fotos_entrada?: Json | null
          fotos_saida?: Json | null
          id?: string
          motivo_recusa?: string | null
          observacoes?: string | null
          oficina_id: string
          pagamento_confirmado?: boolean | null
          pagamento_confirmado_em?: string | null
          pagamento_forma?: string | null
          prazo_estimado?: string | null
          prazo_horas_calculado?: number | null
          stage?: string
          token_cliente?: string
          updated_at?: string
          valor_total?: number
          veiculo_id: string
        }
        Update: {
          cliente_id?: string
          cliente_notificado_entrega?: boolean | null
          colaborador_id?: string | null
          comprovante_pagamento?: string | null
          created_at?: string
          fotos_entrada?: Json | null
          fotos_saida?: Json | null
          id?: string
          motivo_recusa?: string | null
          observacoes?: string | null
          oficina_id?: string
          pagamento_confirmado?: boolean | null
          pagamento_confirmado_em?: string | null
          pagamento_forma?: string | null
          prazo_estimado?: string | null
          prazo_horas_calculado?: number | null
          stage?: string
          token_cliente?: string
          updated_at?: string
          valor_total?: number
          veiculo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ordens_servico_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ordens_servico_veiculo_id_fkey"
            columns: ["veiculo_id"]
            isOneToOne: false
            referencedRelation: "veiculos"
            referencedColumns: ["id"]
          },
        ]
      }
      os_movimentacoes: {
        Row: {
          created_at: string | null
          descricao: string
          id: string
          os_id: string
          stage_anterior: string | null
          stage_novo: string | null
          valor_anterior: number | null
          valor_novo: number | null
        }
        Insert: {
          created_at?: string | null
          descricao: string
          id?: string
          os_id: string
          stage_anterior?: string | null
          stage_novo?: string | null
          valor_anterior?: number | null
          valor_novo?: number | null
        }
        Update: {
          created_at?: string | null
          descricao?: string
          id?: string
          os_id?: string
          stage_anterior?: string | null
          stage_novo?: string | null
          valor_anterior?: number | null
          valor_novo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "os_movimentacoes_os_id_fkey"
            columns: ["os_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
        ]
      }
      os_servicos: {
        Row: {
          concluido_em: string | null
          created_at: string | null
          etapa_atual: number
          etapas_snapshot: Json | null
          id: string
          iniciado_em: string | null
          nome_servico: string
          os_id: string
          servico_id: string
          status: string
          valor: number
        }
        Insert: {
          concluido_em?: string | null
          created_at?: string | null
          etapa_atual?: number
          etapas_snapshot?: Json | null
          id?: string
          iniciado_em?: string | null
          nome_servico?: string
          os_id: string
          servico_id: string
          status?: string
          valor?: number
        }
        Update: {
          concluido_em?: string | null
          created_at?: string | null
          etapa_atual?: number
          etapas_snapshot?: Json | null
          id?: string
          iniciado_em?: string | null
          nome_servico?: string
          os_id?: string
          servico_id?: string
          status?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "os_servicos_os_id_fkey"
            columns: ["os_id"]
            isOneToOne: false
            referencedRelation: "ordens_servico"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "os_servicos_servico_id_fkey"
            columns: ["servico_id"]
            isOneToOne: false
            referencedRelation: "servicos_catalogo"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos_catalogo: {
        Row: {
          created_at: string
          descricao: string | null
          etapas: Json | null
          id: string
          nome: string
          oficina_id: string
          preco_base: number
          tempo_medio_horas: number | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          etapas?: Json | null
          id?: string
          nome: string
          oficina_id: string
          preco_base?: number
          tempo_medio_horas?: number | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          etapas?: Json | null
          id?: string
          nome?: string
          oficina_id?: string
          preco_base?: number
          tempo_medio_horas?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "servicos_catalogo_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas"
            referencedColumns: ["id"]
          },
        ]
      }
      veiculos: {
        Row: {
          ano: number | null
          cliente_id: string
          cor: string | null
          created_at: string
          id: string
          marca: string | null
          modelo: string | null
          oficina_id: string
          placa: string
        }
        Insert: {
          ano?: number | null
          cliente_id: string
          cor?: string | null
          created_at?: string
          id?: string
          marca?: string | null
          modelo?: string | null
          oficina_id: string
          placa: string
        }
        Update: {
          ano?: number | null
          cliente_id?: string
          cor?: string | null
          created_at?: string
          id?: string
          marca?: string | null
          modelo?: string | null
          oficina_id?: string
          placa?: string
        }
        Relationships: [
          {
            foreignKeyName: "veiculos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "veiculos_oficina_id_fkey"
            columns: ["oficina_id"]
            isOneToOne: false
            referencedRelation: "oficinas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_oficina_for_user: {
        Args: { _nome: string; _telefone?: string }
        Returns: string
      }
      get_user_oficina_id: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
