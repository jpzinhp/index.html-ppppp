import { getCategory } from './categories.js';

function escolher(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function capitalizar(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

function primeiraPalavra(texto, fallback) {
  const t = (texto || '').trim().split(/\s+/)[0];
  return capitalizar((t || fallback).toLowerCase());
}

/**
 * Gera o conteúdo de copywriting do site inteiramente em templates locais
 * — nunca depende de nenhuma API externa de IA. É o modo usado sempre que
 * AI_API_KEY não está configurada, e também o fallback se a chamada de IA
 * real falhar por qualquer motivo (a geração NUNCA quebra por causa disso).
 */
export function gerarConteudoLocal(business, prefs = {}) {
  const nome = business.name || 'Sua empresa';
  const categoria = getCategory(prefs.categoryValue || '');
  // Prioriza a forma singular da categoria (evita erros de concordância
  // como "Barbearias que transforma") sobre o rótulo plural do filtro.
  const segmento = (prefs.segment || '').trim() || categoria?.singular || business.category || 'negócio';
  const cidade = business.city || '';
  const local = cidade ? ` em ${cidade}` : '';
  const kind = categoria?.kind || 'padrao';
  const segmentoLower = segmento.toLowerCase();

  const verbos = {
    comida: ['conecta', 'encanta', 'surpreende', 'alimenta com carinho'],
    agenda: ['cuida de você', 'transforma', 'inspira confiança', 'acolhe'],
    padrao: ['conecta', 'transforma', 'surpreende', 'aproxima']
  };
  const headline = `${primeiraPalavra(segmento, 'Negócio')} que ${escolher(verbos[kind])}`;

  const subheadline = escolher(
    {
      comida: ['Mais que uma refeição, uma experiência.', 'Sabor de verdade, em cada prato.', 'Feito com cuidado, do preparo à mesa.'],
      agenda: ['Mais que um atendimento, um cuidado.', 'Sua confiança em primeiro lugar.', 'Atenção de verdade, em cada visita.'],
      padrao: ['Mais que um serviço, uma experiência.', 'Qualidade que você sente na hora.', 'Cuidado de verdade, do início ao fim.']
    }[kind]
  );

  const diferenciais = (prefs.differentiators || '').trim();
  const extra = diferenciais ? ` ${diferenciais}.` : '';
  const about =
    `A ${nome} construiu${local} uma reputação sólida em ${segmentoLower}, unindo profissionais experientes, ` +
    `atenção a cada detalhe e um atendimento verdadeiramente próximo do cliente.${extra}`;

  const servicosBase = (prefs.services || '')
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
  const services = servicosBase.length
    ? servicosBase.slice(0, 6)
    : [`Atendimento em ${segmentoLower}`, 'Profissionais experientes', 'Compromisso com qualidade'];

  const bancoBenefits = [
    'Atendimento ágil',
    'Profissionais qualificados',
    'Preço justo',
    'Localização estratégica',
    'Anos de experiência',
    'Clientes satisfeitos',
    'Equipe capacitada',
    'Horário flexível',
    'Atendimento humanizado',
    'Estrutura completa'
  ];
  const benefits = [...bancoBenefits].sort(() => Math.random() - 0.5).slice(0, 4);

  const ctaPorCategoria = {
    comida: ['Fazer pedido', 'Ver cardápio', 'Peça já'],
    agenda: ['Agendar horário', 'Marcar consulta', 'Reservar horário'],
    padrao: ['Fale conosco', 'Solicitar orçamento', 'Entre em contato']
  };
  const cta = escolher(ctaPorCategoria[kind]);

  const faq = [
    {
      question: `A ${nome} atende${local}?`,
      answer: cidade
        ? `Sim, a ${nome} atende clientes${local} e região.`
        : `Sim, entre em contato para saber a área de atendimento da ${nome}.`
    },
    {
      question: 'Como faço para agendar ou solicitar um orçamento?',
      answer: 'Use os botões de contato desta página — WhatsApp, telefone ou o formulário de contato.'
    },
    {
      question: 'Quais formas de contato estão disponíveis?',
      answer: 'Telefone e WhatsApp (quando informados) e as redes sociais listadas nesta página.'
    }
  ];

  const seoTitle = `${nome}${cidade ? ' em ' + cidade : ''} | ${segmento}`;
  const seoDescription = `${nome} — ${segmento}${local}. ${subheadline}`.slice(0, 160);

  return { headline, subheadline, about, services, benefits, cta, faq, seoTitle, seoDescription };
}
