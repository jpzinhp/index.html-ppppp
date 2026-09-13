import type { CategoryOption } from '../types';

// Mesma lista (valores e rótulos) usada no backend em
// backend/src/lib/categories.js — mantida em sincronia manualmente, já
// que frontend e backend são projetos npm independentes. "singular" evita
// erros de concordância no conteúdo gerado (ex.: "Barbearias que
// transforma" → usamos "barbearia" ao invés do rótulo plural do filtro).
const CATEGORY_DATA: (CategoryOption & { singular: string })[] = [
  { value: 'restaurantes', label: 'Restaurantes', singular: 'restaurante' },
  { value: 'padarias', label: 'Padarias', singular: 'padaria' },
  { value: 'hamburguerias', label: 'Hamburguerias', singular: 'hamburgueria' },
  { value: 'pizzarias', label: 'Pizzarias', singular: 'pizzaria' },
  { value: 'barbearias', label: 'Barbearias', singular: 'barbearia' },
  { value: 'saloes', label: 'Salões', singular: 'salão de beleza' },
  { value: 'clinicas', label: 'Clínicas', singular: 'clínica' },
  { value: 'clinicas_odontologicas', label: 'Clínicas odontológicas', singular: 'clínica odontológica' },
  { value: 'academias', label: 'Academias', singular: 'academia' },
  { value: 'pet_shops', label: 'Pet shops', singular: 'pet shop' },
  { value: 'veterinarias', label: 'Veterinárias', singular: 'clínica veterinária' },
  { value: 'oficinas', label: 'Oficinas', singular: 'oficina mecânica' },
  { value: 'construtoras', label: 'Construtoras', singular: 'construtora' },
  { value: 'marcenarias', label: 'Marcenarias', singular: 'marcenaria' },
  { value: 'advogados', label: 'Advogados', singular: 'escritório de advocacia' },
  { value: 'contadores', label: 'Contadores', singular: 'escritório de contabilidade' },
  { value: 'imobiliarias', label: 'Imobiliárias', singular: 'imobiliária' },
  { value: 'hoteis', label: 'Hotéis', singular: 'hotel' },
  { value: 'pousadas', label: 'Pousadas', singular: 'pousada' },
  { value: 'lojas', label: 'Lojas', singular: 'loja' },
  { value: 'floriculturas', label: 'Floriculturas', singular: 'floricultura' },
  { value: 'escolas', label: 'Escolas', singular: 'escola' },
  { value: 'agencias', label: 'Agências', singular: 'agência' },
  { value: 'fotografos', label: 'Fotógrafos', singular: 'estúdio de fotografia' },
  { value: 'eletricistas', label: 'Eletricistas', singular: 'serviço de elétrica' },
  { value: 'encanadores', label: 'Encanadores', singular: 'serviço de encanamento' },
  { value: 'outros', label: 'Outros', singular: 'negócio' }
];

export const CATEGORIES: CategoryOption[] = CATEGORY_DATA.map(({ value, label }) => ({ value, label }));

export function categoryLabel(value: string): string {
  return CATEGORY_DATA.find((c) => c.value === value)?.label || value;
}

export function categorySingular(value: string): string {
  return CATEGORY_DATA.find((c) => c.value === value)?.singular || value;
}

export function categoryValueFromLabel(label: string): string {
  return CATEGORY_DATA.find((c) => c.label === label)?.value || 'outros';
}
