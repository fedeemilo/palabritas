/**
 * Normaliza texto removiendo acentos y convirtiendo a minúsculas
 * Permite que el niño escriba "arbol" para "árbol"
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Compara dos strings de forma case-insensitive y sin acentos
 */
export function compareWords(input: string, target: string): boolean {
  return normalizeText(input) === normalizeText(target);
}

/**
 * Verifica si el input actual es el comienzo correcto de la palabra objetivo
 */
export function isValidPartialInput(input: string, target: string): boolean {
  const normalizedInput = normalizeText(input);
  const normalizedTarget = normalizeText(target);
  return normalizedTarget.startsWith(normalizedInput);
}
