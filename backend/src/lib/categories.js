// Categorias de negócio suportadas pela busca — o "value" é o que trafega
// entre frontend e backend; "label" é o texto exibido no filtro (plural,
// como pedido); "singular" é usado ao gerar o conteúdo do site (evita
// erros de concordância como "Barbearias que transforma"); "tags" mapeia
// para tags do OpenStreetMap (formato "chave=valor", ou só "chave" para
// "qualquer valor dessa chave"); "kind" ajuda o gerador de conteúdo a
// escolher um CTA e um vocabulário coerentes.
export const CATEGORIES = [
  { value: 'restaurantes', label: 'Restaurantes', singular: 'restaurante', tags: ['amenity=restaurant'], kind: 'comida' },
  { value: 'padarias', label: 'Padarias', singular: 'padaria', tags: ['shop=bakery'], kind: 'comida' },
  { value: 'hamburguerias', label: 'Hamburguerias', singular: 'hamburgueria', tags: ['amenity=fast_food'], kind: 'comida' },
  { value: 'pizzarias', label: 'Pizzarias', singular: 'pizzaria', tags: ['amenity=fast_food', 'amenity=restaurant'], kind: 'comida' },
  { value: 'barbearias', label: 'Barbearias', singular: 'barbearia', tags: ['shop=hairdresser'], kind: 'agenda' },
  { value: 'saloes', label: 'Salões', singular: 'salão de beleza', tags: ['shop=beauty', 'shop=hairdresser'], kind: 'agenda' },
  { value: 'clinicas', label: 'Clínicas', singular: 'clínica', tags: ['amenity=clinic', 'amenity=doctors'], kind: 'agenda' },
  { value: 'clinicas_odontologicas', label: 'Clínicas odontológicas', singular: 'clínica odontológica', tags: ['amenity=dentist'], kind: 'agenda' },
  { value: 'academias', label: 'Academias', singular: 'academia', tags: ['leisure=fitness_centre'], kind: 'agenda' },
  { value: 'pet_shops', label: 'Pet shops', singular: 'pet shop', tags: ['shop=pet'], kind: 'agenda' },
  { value: 'veterinarias', label: 'Veterinárias', singular: 'clínica veterinária', tags: ['amenity=veterinary'], kind: 'agenda' },
  { value: 'oficinas', label: 'Oficinas', singular: 'oficina mecânica', tags: ['shop=car_repair'], kind: 'padrao' },
  { value: 'construtoras', label: 'Construtoras', singular: 'construtora', tags: ['office=construction_company', 'craft=builder'], kind: 'padrao' },
  { value: 'marcenarias', label: 'Marcenarias', singular: 'marcenaria', tags: ['craft=carpenter'], kind: 'padrao' },
  { value: 'advogados', label: 'Advogados', singular: 'escritório de advocacia', tags: ['office=lawyer'], kind: 'padrao' },
  { value: 'contadores', label: 'Contadores', singular: 'escritório de contabilidade', tags: ['office=accountant'], kind: 'padrao' },
  { value: 'imobiliarias', label: 'Imobiliárias', singular: 'imobiliária', tags: ['office=estate_agent'], kind: 'padrao' },
  { value: 'hoteis', label: 'Hotéis', singular: 'hotel', tags: ['tourism=hotel'], kind: 'agenda' },
  { value: 'pousadas', label: 'Pousadas', singular: 'pousada', tags: ['tourism=guest_house'], kind: 'agenda' },
  { value: 'lojas', label: 'Lojas', singular: 'loja', tags: ['shop'], kind: 'padrao' },
  { value: 'floriculturas', label: 'Floriculturas', singular: 'floricultura', tags: ['shop=florist'], kind: 'padrao' },
  { value: 'escolas', label: 'Escolas', singular: 'escola', tags: ['amenity=school', 'office=educational_institution'], kind: 'padrao' },
  { value: 'agencias', label: 'Agências', singular: 'agência', tags: ['office=advertising_agency'], kind: 'padrao' },
  { value: 'fotografos', label: 'Fotógrafos', singular: 'estúdio de fotografia', tags: ['craft=photographer', 'shop=photo'], kind: 'padrao' },
  { value: 'eletricistas', label: 'Eletricistas', singular: 'serviço de elétrica', tags: ['craft=electrician'], kind: 'padrao' },
  { value: 'encanadores', label: 'Encanadores', singular: 'serviço de encanamento', tags: ['craft=plumber'], kind: 'padrao' },
  { value: 'outros', label: 'Outros', singular: 'negócio', tags: [], kind: 'padrao' }
];

export const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.value, c]));

export function getCategory(value) {
  return CATEGORY_MAP.get(value) || CATEGORY_MAP.get('outros');
}
