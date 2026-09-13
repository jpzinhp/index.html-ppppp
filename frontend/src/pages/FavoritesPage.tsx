import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { BusinessCard } from '../components/business/BusinessCard';
import { BusinessDetails } from '../components/business/BusinessDetails';
import { EmptyState } from '../components/ui/EmptyState';
import type { Business } from '../types';
import { categoryValueFromLabel } from '../lib/categories';

export default function FavoritesPage() {
  const { favorites } = useAppData();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Business | null>(null);

  function handleCreateSite(business: Business) {
    navigate('/gerador', { state: { business, categoryValue: categoryValueFromLabel(business.category) } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Favoritos</h1>
        <p className="text-sm text-gray-500">Empresas que você favoritou durante as buscas.</p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState icon={Heart} title="Nenhum favorito ainda" description='Clique no coração de uma empresa em "Encontrar empresas" para salvá-la aqui.' />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {favorites.map((b) => (
            <BusinessCard key={b.id} business={b} onViewDetails={setSelected} onCreateSite={handleCreateSite} />
          ))}
        </div>
      )}

      <BusinessDetails business={selected} onClose={() => setSelected(null)} onCreateSite={handleCreateSite} />
    </div>
  );
}
