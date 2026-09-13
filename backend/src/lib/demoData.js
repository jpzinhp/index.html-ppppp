// Dados de DEMONSTRAÇÃO — usados apenas quando a busca real no
// OpenStreetMap falha (ex.: sem internet, servidores fora do ar) ou
// quando o cliente pede explicitamente o modo demo. Nunca são
// apresentados como dados reais: todo item carrega source:'demo' e o
// frontend é obrigado a rotular isso como "DEMONSTRAÇÃO".
import { getCategory } from './categories.js';

const NOMES_POR_CATEGORIA = {
  restaurantes: ['Restaurante Sabor Caseiro', 'Cantina Bella Vista'],
  padarias: ['Padaria Bom Pão', 'Padaria Suifong'],
  hamburguerias: ['Burger Station', 'Hamburgueria do Zé'],
  pizzarias: ['Pizzaria Forno a Lenha', "Pizza D'Itália"],
  barbearias: ['Barbearia Navalha de Ouro', 'Barbearia do Formiga'],
  saloes: ['Studio Hair Elegance', 'Espaço Beleza Pura'],
  clinicas: ['Clínica São Lucas', 'Clínica Vida Nova'],
  clinicas_odontologicas: ['Rede Odonto Sorriso', 'Clínica OdontoVida'],
  academias: ['Academia Corpo Ativo', 'Studio de Treino Fit'],
  pet_shops: ['Pet Center Amigo Fiel', 'Petshop Mundo Animal'],
  veterinarias: ['Clínica Veterinária VidaPet', 'Veterinária Bicho Feliz'],
  oficinas: ['Oficina Motor Forte', 'Auto Mecânica Central'],
  construtoras: ['Construtora Alicerce Forte', 'Engenharia Base Sólida'],
  marcenarias: ['Marcenaria MadeiraViva', 'Marcenaria Arte em Madeira'],
  advogados: ['Escritório Justiça & Lei', 'Advocacia Souza & Associados'],
  contadores: ['Contabilidade Exata Assessoria', 'Contadoria Certa'],
  imobiliarias: ['Imobiliária Casa Nova', 'Imóveis Bela Vista'],
  hoteis: ['Hotel Central Plaza', 'Hotel Recanto do Sol'],
  pousadas: ['Pousada Recanto Tranquilo', 'Pousada Mar Azul'],
  lojas: ['Loja Estilo Urbano', 'Casa & Estilo'],
  floriculturas: ['Floricultura Flor de Lis', 'Floricultura Jardim Encantado'],
  escolas: ['Escola Saber Novo', 'Colégio Caminho do Futuro'],
  agencias: ['Agência Marketing Alcance', 'Agência Criativa Nova Ideia'],
  fotografos: ['Estúdio Foto & Filme', 'Fotografia Momento Único'],
  eletricistas: ['Elétrica Instala Bem', 'Serviços Elétricos JR'],
  encanadores: ['Encanador Rápido Hidráulica', 'Hidráulica Fluxo Certo'],
  outros: ['Comércio Local']
};

const RUAS = ['R. das Flores, 120', 'Av. Central, 480', 'R. Sete de Setembro, 55', 'R. Barão do Rio Branco, 210'];

export function gerarNegociosDemo({ city, state, category }) {
  const cat = getCategory(category);
  const nomes = NOMES_POR_CATEGORIA[cat.value] || NOMES_POR_CATEGORIA.outros;

  return nomes.map((nome, i) => ({
    id: `demo-${cat.value}-${i}`,
    name: nome,
    category: cat.label,
    city: city || 'Cidade de exemplo',
    state: state || null,
    address: RUAS[i % RUAS.length],
    phone: i === 0 ? '(11) 90000-0000' : null,
    website: null,
    instagram: null,
    facebook: null,
    openingHours: 'Seg–Sex: 09:00–18:00',
    lat: null,
    lon: null,
    hasWebsite: false,
    source: 'demo'
  }));
}
