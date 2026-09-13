import { useNavigate } from 'react-router-dom';
import { Menu, Search, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getHealth, type HealthResponse } from '../../lib/api';

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const navigate = useNavigate();
  const [health, setHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    let active = true;
    getHealth()
      .then((h) => {
        if (active) setHealth(h);
      })
      .catch(() => {
        if (active) setHealth(null);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
      <button
        onClick={onOpenMenu}
        className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1" />

      {health && (
        <span className="hidden rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 sm:inline-block">
          {health.mode.ai === 'ai' ? 'IA conectada' : 'Modo demonstração'}
        </span>
      )}

      <button
        onClick={() => navigate('/buscar')}
        className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:px-4"
      >
        <Search size={16} />
        <span className="hidden sm:inline">Buscar empresas</span>
      </button>
      <button
        onClick={() => navigate('/buscar')}
        className="flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 sm:px-4"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Criar site</span>
      </button>
    </header>
  );
}
