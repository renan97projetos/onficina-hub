import { z } from "zod";

/**
 * Placa Mercosul: AAA0A00 (3 letras, 1 dígito, 1 letra, 2 dígitos)
 * Placa antiga BR:  AAA0000 (3 letras, 4 dígitos)
 */
export const placaSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/,
    "Placa inválida. Use formato Mercosul (AAA0A00) ou antigo (AAA0000)",
  );

/** Telefone BR: 10 ou 11 dígitos numéricos (com DDD) */
export const telefoneSchema = z
  .string()
  .trim()
  .refine(
    (v) => {
      const onlyDigits = v.replace(/\D/g, "");
      return onlyDigits.length === 10 || onlyDigits.length === 11;
    },
    { message: "Telefone deve ter 10 ou 11 dígitos com DDD" },
  );

/** Telefone opcional (vazio passa) */
export const telefoneOpcionalSchema = z
  .string()
  .trim()
  .refine(
    (v) => {
      if (!v) return true;
      const onlyDigits = v.replace(/\D/g, "");
      return onlyDigits.length === 10 || onlyDigits.length === 11;
    },
    { message: "Telefone deve ter 10 ou 11 dígitos com DDD" },
  );

export const nomeClienteSchema = z
  .string()
  .trim()
  .min(2, "Nome deve ter pelo menos 2 caracteres")
  .max(120, "Nome muito longo");

export const nomeOficinaSchema = z
  .string()
  .trim()
  .min(2, "Nome da oficina deve ter pelo menos 2 caracteres")
  .max(120, "Nome muito longo");

export const emailSchema = z
  .string()
  .trim()
  .email("E-mail inválido")
  .max(255, "E-mail muito longo");

export const senhaSchema = z
  .string()
  .min(8, "Senha deve ter pelo menos 8 caracteres")
  .max(72, "Senha muito longa");

export const cadastroSchema = z.object({
  nomeOficina: nomeOficinaSchema,
  email: emailSchema,
  telefone: telefoneOpcionalSchema,
  senha: senhaSchema,
});

export type CadastroInput = z.infer<typeof cadastroSchema>;
