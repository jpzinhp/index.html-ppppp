import { MapPin, Phone, Globe, AtSign, Link2, Clock, Sparkles, MessageCircle, Heart } from 'lucide-react';
import type { Business } from '../../types';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';
import { buildWhatsappLink } from '../../lib/whatsapp';
import { useAppData } from '../../context/AppDataContext';

interface BusinessDetailsProps {
  business: Business | null;
  onClose: () => void;
  onCreateSite: (business: Business) => void;
}

export function BusinessDetails({ business, onClose, onCreateSite }: BusinessDetailsProps) {
  const { isFavorite, toggleFavorite } = useAppData();
  if (!business) return null;

  const wa = buildWhatsappLink(business.phone, business.name);
  const hasCoords = business.lat != null && business.lon != null;
  const mapSrc = hasCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${business.lon! - 0.01}%2C${business.lat! - 0.01}%2C${business.lon! + 0.01}%2C${business.lat! + 0.01}&layer=mapnik&marker=${business.lat}%2C${business.lon}`
    : null;

  return (
    <Modal open={!!business} onClose={onClose} title={business.name}>
      <div className="space-y-5 p-6">
        {business.source === 'demo' && <Badge tone="gray">DEMONSTRAÇÃO — dado de exemplo, não é uma empresa real</Badge>}

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Status do site</p>
          {business.hasWebsite ? (
            <Badge tone="green">🟢 Website informado</Badge>
          ) : (
            <Badge tone="orange">🟠 Nenhum website informado</Badge>
          )}
          {!business.hasWebsite && (
            <p className="mt-1.5 text-xs text-gray-500">Sem website informado na fonte consultada (OpenStreetMap).</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 text-sm text-gray-700 sm:grid-cols-2">
          <p className="flex items-start gap-2">
            <MapPin size={16} className="mt-0.5 shrink-0 text-gray-400" />
            {[business.address, business.city, business.state].filter(Boolean).join(' — ') || 'Endereço não informado'}
          </p>
          <p className="flex items-start gap-2">
            <Phone size={16} className="mt-0.5 shrink-0 text-gray-400" />
            {business.phone || 'Telefone não informado'}
          </p>
          <p className="flex items-start gap-2">
            <Globe size={16} className="mt-0.5 shrink-0 text-gray-400" />
            {business.website || 'Website não informado'}
          </p>
          <p className="flex items-start gap-2">
            <Clock size={16} className="mt-0.5 shrink-0 text-gray-400" />
            {business.openingHours || 'Horário não informado'}
          </p>
          {business.instagram && (
            <p className="flex items-start gap-2">
              <AtSign size={16} className="mt-0.5 shrink-0 text-gray-400" />
              {business.instagram}
            </p>
          )}
          {business.facebook && (
            <p className="flex items-start gap-2">
              <Link2 size={16} className="mt-0.5 shrink-0 text-gray-400" />
              {business.facebook}
            </p>
          )}
        </div>

        {mapSrc && (
          <div className="overflow-hidden rounded-xl border border-gray-200">
            <iframe src={mapSrc} title="Mapa de localização" className="h-56 w-full" loading="lazy" />
          </div>
        )}

        <div className="flex flex-wrap gap-2 pt-1">
          {!business.hasWebsite && (
            <button
              onClick={() => onCreateSite(business)}
              className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              <Sparkles size={16} />
              Criar site com IA
            </button>
          )}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          )}
          <button
            onClick={() => toggleFavorite(business)}
            className="flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Heart size={16} fill={isFavorite(business.id) ? 'currentColor' : 'none'} className={isFavorite(business.id) ? 'text-red-500' : ''} />
            {isFavorite(business.id) ? 'Favoritado' : 'Favoritar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
