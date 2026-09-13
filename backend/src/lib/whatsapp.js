export function buildWhatsappLink(phone, businessName) {
  if (!phone) return null;
  const digits = String(phone).replace(/\D/g, '');
  if (!digits) return null;
  const withCountry = digits.startsWith('55') ? digits : '55' + digits;
  const msg = encodeURIComponent(`Olá! Vi o site da ${businessName} e gostaria de mais informações.`);
  return `https://wa.me/${withCountry}?text=${msg}`;
}
