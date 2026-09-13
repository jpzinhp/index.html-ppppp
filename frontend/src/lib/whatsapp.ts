export function buildWhatsappLink(phone: string | null | undefined, businessName: string): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  const withCountry = digits.startsWith('55') ? digits : '55' + digits;
  const msg = encodeURIComponent(`Olá! Vi a ${businessName} no AI Website Hunter e gostaria de mais informações.`);
  return `https://wa.me/${withCountry}?text=${msg}`;
}
