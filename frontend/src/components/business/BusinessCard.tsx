import { Heart, MapPin, Phone, Globe, AtSign, Link2, Sparkles, Eye } from 'lucide-react';
import type { Business } from '../../types';
import { Badge } from '../ui/Badge';
import { useAppData } from '../../context/AppDataContext';

interface BusinessCardProps {
  business: Business;
  onViewDetails: (business: Business) => void;
  onCreateSite: (business: Business) => void;
}

export function BusinessCard({ business, onViewDetails, onCreateSite }: BusinessCardProps) {
  const { isFavorite, toggleFavorite } = useAppData();
  const favorited = isFavorite(business.id);

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-gray-900">{business.name}</h3>
            {business.source === 'demo' && <Badge tone="gray">DEMONSTRAÇÃO</Badge>}
          </div>
          <p className="mt-0.5 text-xs text-gray-500">{business.category}</p>
        </div>
        <button
          onClick={() => toggleFavorite(business)}
          aria-label={favorited ? 'Remover dos favoritos' : 'Favoritar'}
          className={`shrink-0 rounded-full p-2 transition-colors ${favorited ? 'text-red-500' : 'text-gray-300 hover:text-red-400'}`}
        >
          <Heart size={18} fill={favorited ? 'currentColor' : 'none'} />
        </button>
      </div>

      <div>
        {business.hasWebsite ? (
          <Badge tone="green">🟢 SITE ENCONTRADO</Badge>
        ) : (
          <Badge tone="orange">🟠 SEM SITE</Badge>
        )}
      </div>

      <div className="space-y-1.5 text-xs text-gray-600">
        <p className="flex items-center gap-1.5">
          <MapPin size={13} className="shrink-0 text-gray-400" />
          <span className="truncate">
            {[business.address, business.city, business.state].filter(Boolean).join(' — ') || 'Endereço não informado'}
          </span>
        </p>
        {business.phone && (
          <p className="flex items-center gap-1.5">
            <Phone size={13} className="shrink-0 text-gray-400" />
            {business.phone}
          </p>
        )}
        {business.website && (
          <p className="flex items-center gap-1.5 truncate">
            <Globe size={13} className="shrink-0 text-gray-400" />
            <span className="truncate">{business.website}</span>
          </p>
        )}
        {business.instagram && (
          <p className="flex items-center gap-1.5 truncate">
            <AtSign size={13} className="shrink-0 text-gray-400" />
            <span className="truncate">{business.instagram}</span>
          </p>
        )}
        {business.facebook && (
          <p className="flex items-center gap-1.5 truncate">
            <Link2 size={13} className="shrink-0 text-gray-400" />
            <span className="truncate">{business.facebook}</span>
          </p>
        )}
      </div>

      <div className="mt-1 flex flex-wrap gap-2">
        {!business.hasWebsite && (
          <button
            onClick={() => onCreateSite(business)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
          >
            <Sparkles size={14} />
            Criar site com IA
          </button>
        )}
        <button
          onClick={() => onViewDetails(business)}
          className={`flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 ${
            business.hasWebsite ? 'flex-1' : ''
          }`}
        >
          <Eye size={14} />
          Ver detalhes
        </button>
      </div>
    </div>
  );
}
