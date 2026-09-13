import { buildWhatsappLink } from './whatsapp.js';

function esc(str) {
  return String(str == null ? '' : str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[c]));
}

// Cada estilo define tokens visuais (cor de fundo, texto, tipografia,
// raio de borda) e um "heroMode" que muda a composição do hero. As
// demais seções (sobre/serviços/benefícios/galeria/depoimentos/faq/
// contato/rodapé) reaproveitam os mesmos tokens, então os 7 estilos
// pedidos ficam visualmente distintos sem precisar de 7 templates
// completamente separados.
const STYLE_PRESETS = {
  moderno: { theme: 'light', heroMode: 'photo-overlay', headFont: "'Helvetica Neue',Arial,sans-serif", radius: 16 },
  premium: { theme: 'light', heroMode: 'circle-split', heroDark: true, headFont: "'Helvetica Neue',Arial,sans-serif", radius: 26 },
  minimalista: { theme: 'light', heroMode: 'plain-text', headFont: "Arial,Helvetica,sans-serif", radius: 2 },
  corporativo: { theme: 'light', heroMode: 'color-block', headFont: "'Segoe UI',Arial,sans-serif", radius: 6 },
  elegante: { theme: 'cream', heroMode: 'photo-overlay', headFont: "Georgia,'Times New Roman',serif", radius: 0, serifItalic: true },
  dark: { theme: 'dark', heroMode: 'circle-split', heroDark: true, headFont: "'Helvetica Neue',Arial,sans-serif", radius: 18 },
  vibrante: { theme: 'light', heroMode: 'photo-overlay', headFont: "'Helvetica Neue',Arial,sans-serif", radius: 28, vivid: true }
};

const THEME_TOKENS = {
  light: { bg: '#ffffff', surface: '#f7f5f2', text: '#17140f', muted: '#5c5954', border: '#eae5dc' },
  dark: { bg: '#121212', surface: '#1c1c1c', text: '#f5f3f0', muted: '#b7b2ab', border: '#2c2c2c' },
  cream: { bg: '#faf6ef', surface: '#f1e9d8', text: '#2a2318', muted: '#75695a', border: '#e6dcc7' }
};

function getPreset(styleKey) {
  return STYLE_PRESETS[styleKey] || STYLE_PRESETS.moderno;
}

// Placeholder embutido (sem depender de rede) usado quando uma imagem
// falha ao carregar, para nunca deixar texto alternativo "vazando"
// visualmente por cima do layout.
const FALLBACK_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect width="100%" height="100%" fill="#e5e1d8"/><text x="50%" y="52%" font-family="Arial" font-size="28" fill="#8a8477" text-anchor="middle">Imagem indisponível</text></svg>'
  );

function imgTag(src, alt, cls, extraAttrs = '') {
  return `<img class="${cls}" src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.onerror=null;this.src='${FALLBACK_IMG}'" ${extraAttrs}>`;
}

function heroSection(business, content, preset, color, images) {
  const heroImg = images.photos[0];

  if (preset.heroMode === 'circle-split') {
    return `
    <section class="hero hero--circle" style="--accent:${color}">
      <div class="hero-watermark">${esc((content.headline || '').split(' ')[0] || '')}</div>
      <div class="hero-flex">
        <div class="hero-left">
          <p class="eyebrow">${esc(business.category || '')}${business.city ? ' · ' + esc(business.city) : ''}</p>
          <h1 class="hero-title">${esc(content.headline)}</h1>
          <p class="hero-tagline">${esc(content.subheadline)}</p>
          <div class="hero-actions">
            <button class="btn btn-accent">${esc(content.cta)}</button>
          </div>
        </div>
        <div class="hero-right">
          <div class="hero-blob"></div>
          ${imgTag(heroImg, `Imagem ilustrativa de ${business.category || 'negócio'}`, 'hero-photo')}
        </div>
      </div>
    </section>`;
  }

  if (preset.heroMode === 'plain-text') {
    return `
    <section class="hero hero--plain" style="--accent:${color}">
      <p class="eyebrow">${esc(business.category || '')}${business.city ? ' · ' + esc(business.city) : ''}</p>
      <h1 class="hero-title">${esc(content.headline)}</h1>
      <p class="hero-tagline">${esc(content.subheadline)}</p>
      <div class="hero-actions"><button class="btn btn-accent">${esc(content.cta)}</button></div>
    </section>`;
  }

  if (preset.heroMode === 'color-block') {
    return `
    <section class="hero hero--block" style="--accent:${color};background:${color}">
      <div class="hero--block-inner">
        <p class="eyebrow" style="color:rgba(255,255,255,.85)">${esc(business.category || '')}${business.city ? ' · ' + esc(business.city) : ''}</p>
        <h1 class="hero-title" style="color:#fff">${esc(content.headline)}</h1>
        <p class="hero-tagline" style="color:rgba(255,255,255,.85)">${esc(content.subheadline)}</p>
        <div class="hero-actions"><button class="btn" style="background:#fff;color:${color}">${esc(content.cta)}</button></div>
      </div>
    </section>`;
  }

  // photo-overlay (padrão): imagem de fundo cheia com overlay escuro.
  return `
    <section class="hero hero--photo" style="--accent:${color}">
      ${imgTag(heroImg, `Imagem ilustrativa de ${business.category || 'negócio'}`, 'hero-bg')}
      <div class="hero-overlay">
        <p class="eyebrow" style="color:rgba(255,255,255,.85)">${esc(business.category || '')}${business.city ? ' · ' + esc(business.city) : ''}</p>
        <h1 class="hero-title" style="color:#fff">${esc(content.headline)}</h1>
        <p class="hero-tagline" style="color:rgba(255,255,255,.85)">${esc(content.subheadline)}</p>
        <div class="hero-actions"><button class="btn btn-accent">${esc(content.cta)}</button></div>
      </div>
    </section>`;
}

function contactButtons(business, color) {
  const wa = buildWhatsappLink(business.phone, business.name);
  const buttons = [];
  if (wa) {
    buttons.push(`<a class="btn btn-accent" href="${esc(wa)}" target="_blank" rel="noopener">Falar no WhatsApp</a>`);
  }
  if (business.phone) {
    buttons.push(`<a class="btn btn-outline" href="tel:${esc(String(business.phone).replace(/\D/g, ''))}">Ligar</a>`);
  }
  if (business.lat && business.lon) {
    buttons.push(
      `<a class="btn btn-outline" href="https://www.openstreetmap.org/?mlat=${business.lat}&mlon=${business.lon}#map=17/${business.lat}/${business.lon}" target="_blank" rel="noopener">Ver localização</a>`
    );
  }
  return buttons.join('\n');
}

function mapEmbed(business) {
  if (!business.lat || !business.lon) return '';
  const d = 0.01;
  const bbox = [business.lon - d, business.lat - d, business.lon + d, business.lat + d].join(',');
  return `
    <section class="section section--map">
      <h2>Localização</h2>
      <div class="map-frame">
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${business.lat},${business.lon}"
          loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="Mapa de localização"></iframe>
      </div>
    </section>`;
}

/**
 * Monta o HTML completo e independente do site (sem depender do React do
 * aplicativo principal). Recebe os dados do negócio, o conteúdo já
 * gerado (IA ou local), as imagens e as preferências visuais.
 */
export function buildSiteHtml({ business, content, images, style = 'moderno', color = '#E5241E' }) {
  const preset = getPreset(style);
  const tokens = THEME_TOKENS[preset.theme] || THEME_TOKENS.light;
  const nome = esc(business.name);
  const galeria = images.photos.slice(1, 5);
  const imagemAviso = images.isPlaceholder
    ? 'Imagens de placeholder (nenhum banco de imagens configurado)'
    : 'Imagens ilustrativas do segmento — não são fotos reais da empresa';

  const servicosHtml = content.services.map((s) => `<div class="card">${esc(s)}</div>`).join('');
  const beneficiosHtml = content.benefits.map((b) => `<span class="chip">${esc(b)}</span>`).join('');
  const galeriaHtml = galeria
    .map((g) => imgTag(g, `Imagem ilustrativa do segmento — ${business.category || ''}`, ''))
    .join('');
  const faqHtml = content.faq
    .map(
      (f) => `<details class="faq-item"><summary>${esc(f.question)}</summary><p>${esc(f.answer)}</p></details>`
    )
    .join('');
  const contatoHtml = contactButtons(business, color);
  const enderecoLinha = [business.address, business.city, business.state].filter(Boolean).join(' — ');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(content.seoTitle || nome)}</title>
<meta name="description" content="${esc(content.seoDescription || '')}">
<meta property="og:title" content="${esc(content.seoTitle || nome)}">
<meta property="og:description" content="${esc(content.seoDescription || '')}">
<meta property="og:type" content="business.business">
${images.photos[0] ? `<meta property="og:image" content="${esc(images.photos[0])}">` : ''}
<style>
  :root{
    --bg:${tokens.bg}; --surface:${tokens.surface}; --text:${tokens.text}; --muted:${tokens.muted};
    --border:${tokens.border}; --accent:${color}; --radius:${preset.radius}px;
    --font-head:${preset.headFont}; --font-body:-apple-system,'Helvetica Neue',Arial,sans-serif;
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--text);font-family:var(--font-body);line-height:1.6}
  h1,h2,h3{font-family:var(--font-head);margin:0 0 .5em;font-weight:700;${preset.serifItalic ? 'font-style:italic;' : ''}}
  img{max-width:100%}
  header.site-header{display:flex;align-items:center;justify-content:space-between;padding:20px 32px;border-bottom:1px solid var(--border);flex-wrap:wrap;gap:12px}
  header.site-header .brand{font-weight:800;font-size:18px;letter-spacing:.02em}
  header.site-header nav{display:flex;gap:22px;font-size:14px;color:var(--muted);flex-wrap:wrap}
  header.site-header nav a{color:inherit;text-decoration:none;cursor:pointer}
  .btn{display:inline-block;border:none;padding:13px 24px;border-radius:var(--radius);font-weight:700;font-size:14px;cursor:pointer;text-decoration:none;text-align:center}
  .btn-accent{background:var(--accent);color:#fff}
  .btn-outline{background:transparent;color:var(--text);border:1px solid var(--border)}
  .eyebrow{font-size:12px;letter-spacing:.12em;text-transform:uppercase;opacity:.8;margin-bottom:14px}
  .hero-title{font-size:clamp(30px,5vw,52px);line-height:1.1}
  .hero-tagline{font-size:15px;max-width:520px;margin-bottom:26px}
  .hero-actions{display:flex;gap:12px;flex-wrap:wrap}
  .hero--photo{position:relative;min-height:520px;display:flex;align-items:flex-end;overflow:hidden}
  .hero--photo .hero-bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(${preset.vivid ? '.6' : '.55'})${preset.vivid ? ` saturate(1.3) hue-rotate(-6deg)` : ''}}
  .hero--photo .hero-overlay{position:relative;z-index:1;padding:60px 40px;max-width:640px;background:${preset.vivid ? `linear-gradient(0deg, ${color}55, transparent 70%)` : 'transparent'}}
  .hero--plain{padding:90px 40px;max-width:760px}
  .hero--block{padding:90px 40px;width:100%}
  .hero--block-inner{max-width:760px}
  .hero--circle{position:relative;background:#0e0e0e;color:#fff;overflow:hidden;padding:0}
  .hero--circle .hero-watermark{position:absolute;top:50%;left:50%;transform:translate(-50%,-52%) rotate(-6deg);font-size:min(20vw,220px);font-weight:800;color:rgba(255,255,255,.045);white-space:nowrap;text-transform:uppercase;pointer-events:none}
  .hero--circle .hero-flex{position:relative;z-index:1;display:flex;align-items:center;gap:36px;padding:70px 40px;flex-wrap:wrap;min-height:520px}
  .hero--circle .hero-left{flex:1 1 340px;max-width:560px}
  .hero--circle .hero-right{flex:1 1 260px;position:relative;display:flex;align-items:center;justify-content:center;min-height:300px}
  .hero-blob{position:absolute;width:80%;aspect-ratio:1/1;border-radius:50%;background:radial-gradient(circle at 34% 28%, var(--accent), color-mix(in srgb, var(--accent) 30%, black) 78%)}
  .hero-photo{position:relative;width:68%;aspect-ratio:1/1;object-fit:cover;border-radius:50%;box-shadow:0 30px 60px rgba(0,0,0,.5);z-index:1;background:var(--surface)}
  section.section{padding:60px 40px;border-top:1px solid var(--border)}
  section.section h2{font-size:24px}
  .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-top:20px}
  .card{background:var(--surface);border:1px solid var(--border);padding:18px;border-radius:var(--radius);font-size:14px;font-weight:600}
  .chips{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px}
  .chip{background:var(--surface);border:1px solid var(--border);padding:8px 16px;border-radius:999px;font-size:12.5px}
  .gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;margin-top:20px}
  .gallery img{width:100%;height:160px;object-fit:cover;border-radius:var(--radius);display:block;background:var(--surface)}
  .img-note{font-size:11.5px;color:var(--muted);margin-top:10px}
  .testimonial{background:var(--surface);padding:50px 40px;border-top:1px solid var(--border)}
  .testimonial p{font-size:19px;font-style:italic;max-width:640px}
  .faq-item{border:1px solid var(--border);border-radius:var(--radius);padding:16px 20px;margin-bottom:12px;background:var(--surface)}
  .faq-item summary{cursor:pointer;font-weight:700;font-size:14.5px}
  .faq-item p{color:var(--muted);margin:10px 0 0;font-size:14px}
  .contact-actions{display:flex;gap:12px;flex-wrap:wrap;margin-top:20px}
  .map-frame{border-radius:var(--radius);overflow:hidden;border:1px solid var(--border);margin-top:16px}
  .map-frame iframe{width:100%;height:320px;border:0;display:block}
  footer.site-footer{padding:26px 40px;border-top:1px solid var(--border);display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:12.5px;color:var(--muted)}
  @media(max-width:760px){
    header.site-header nav{display:none}
    .hero--circle .hero-flex{flex-direction:column;text-align:center}
  }
</style>
</head>
<body>
  <header class="site-header">
    <div class="brand">${nome.toUpperCase()}</div>
    <nav>
      <a href="#sobre">Sobre</a>
      <a href="#servicos">Serviços</a>
      <a href="#contato">Contato</a>
    </nav>
    ${business.phone ? `<a class="btn btn-accent" href="tel:${esc(String(business.phone).replace(/\D/g, ''))}">Ligar agora</a>` : ''}
  </header>

  ${heroSection(business, content, preset, color, images)}

  <section class="section" id="sobre">
    <h2>Sobre ${nome}</h2>
    <p>${esc(content.about)}</p>
  </section>

  <section class="section" id="servicos">
    <h2>Serviços</h2>
    <div class="grid">${servicosHtml}</div>
  </section>

  <section class="section">
    <h2>Por que escolher a ${nome}</h2>
    <div class="chips">${beneficiosHtml}</div>
  </section>

  <section class="section">
    <h2>Galeria</h2>
    <div class="gallery">${galeriaHtml}</div>
    <p class="img-note">${esc(imagemAviso)}</p>
  </section>

  <section class="testimonial">
    <p>"Atendimento excelente, recomendo a todos que buscam qualidade e confiança."</p>
    <span style="font-size:12.5px;color:var(--muted);display:block;margin-top:12px">Depoimento ilustrativo</span>
  </section>

  <section class="section">
    <h2>Perguntas frequentes</h2>
    ${faqHtml}
  </section>

  ${mapEmbed(business)}

  <section class="section" id="contato">
    <h2>Vamos conversar?</h2>
    <p style="color:var(--muted)">${enderecoLinha ? esc(enderecoLinha) : 'Entre em contato pelos canais abaixo.'}</p>
    <div class="contact-actions">${contatoHtml || '<span style="color:var(--muted);font-size:13px">Nenhum contato informado.</span>'}</div>
  </section>

  <footer class="site-footer">
    <span>${nome}</span>
    <span>Todos os direitos reservados</span>
  </footer>
</body>
</html>`;
}
