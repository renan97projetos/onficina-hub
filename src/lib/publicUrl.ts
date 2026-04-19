/**
 * Domínio público oficial do sistema. Todos os links que vão para o cliente
 * (acompanhamento de OS, aprovação de orçamento, agenda pública, site da
 * oficina, avaliação, link do técnico) precisam usar este domínio em vez de
 * URLs internas do preview/Lovable.
 */
export const PUBLIC_BASE_URL = "https://onficina.com";

/**
 * Retorna a base URL para links públicos enviados ao cliente final.
 * Sempre usa o domínio oficial onficina.com, independentemente de onde o
 * sistema está rodando (preview, lovable.app, localhost, etc.).
 */
export function getPublicBaseUrl(): string {
  return PUBLIC_BASE_URL;
}

/**
 * Monta uma URL pública absoluta a partir de um path relativo.
 * Ex: publicUrl("/aprovar/abc") -> "https://onficina.com/aprovar/abc"
 */
export function publicUrl(path: string): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${PUBLIC_BASE_URL}${cleanPath}`;
}
