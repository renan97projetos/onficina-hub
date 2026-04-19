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

/**
 * Valida CNPJ pelos dígitos verificadores (algoritmo oficial).
 * Aceita com ou sem máscara.
 */
export function isCnpjValido(cnpj: string): boolean {
  const digits = (cnpj || "").replace(/\D/g, "");
  if (digits.length !== 14) return false;
  // Rejeita sequências repetidas (ex: 00000000000000)
  if (/^(\d)\1{13}$/.test(digits)) return false;

  const calcDV = (base: string, pesos: number[]) => {
    const soma = base
      .split("")
      .reduce((acc, d, i) => acc + parseInt(d, 10) * pesos[i], 0);
    const resto = soma % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const dv1 = calcDV(digits.substring(0, 12), pesos1);
  if (dv1 !== parseInt(digits[12], 10)) return false;
  const dv2 = calcDV(digits.substring(0, 13), pesos2);
  if (dv2 !== parseInt(digits[13], 10)) return false;

  return true;
}

/** Formata CNPJ adicionando máscara XX.XXX.XXX/XXXX-XX enquanto digita */
export function formatCnpj(value: string): string {
  const d = (value || "").replace(/\D/g, "").slice(0, 14);
  if (d.length <= 2) return d;
  if (d.length <= 5) return `${d.slice(0, 2)}.${d.slice(2)}`;
  if (d.length <= 8) return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5)}`;
  if (d.length <= 12)
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8)}`;
  return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

export const cnpjSchema = z
  .string()
  .trim()
  .refine((v) => isCnpjValido(v), { message: "CNPJ inválido" });

/** CEP brasileiro: 8 dígitos */
export const cepSchema = z
  .string()
  .trim()
  .refine((v) => v.replace(/\D/g, "").length === 8, { message: "CEP deve ter 8 dígitos" });

export function formatCep(value: string): string {
  const d = (value || "").replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export const cadastroSchema = z.object({
  nomeOficina: nomeOficinaSchema,
  email: emailSchema,
  telefone: telefoneOpcionalSchema,
  senha: senhaSchema,
  cnpj: cnpjSchema,
  cep: cepSchema,
  estado: z.string().trim().length(2, "Selecione um estado"),
  cidade: z.string().trim().min(2, "Selecione uma cidade"),
  endereco: z.string().trim().min(3, "Informe o endereço").max(200, "Endereço muito longo"),
  numero: z.string().trim().min(1, "Informe o número").max(20, "Número inválido"),
  bairro: z.string().trim().min(2, "Informe o bairro").max(100, "Bairro muito longo"),
  complemento: z.string().trim().max(100, "Complemento muito longo").optional().or(z.literal("")),
});

export type CadastroInput = z.infer<typeof cadastroSchema>;
