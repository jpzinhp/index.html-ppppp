import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Search, Globe, Heart, Settings, Radar, X } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/buscar', label: 'Encontrar empresas', icon: Search },
  { to: '/sites-gerados', label: 'Sites gerados', icon: Globe },
  { to: '/favoritos', label: 'Favoritos', icon: Heart },
  { to: '/configuracoes', label: 'Configurações', icon: Settings }
];

function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <item.icon size={18} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function SidebarDesktop() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white lg:flex">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
          <Radar size={18} />
        </div>
        <div>
          <p className="text-sm font-bold leading-tight text-gray-900">AI Website</p>
          <p className="text-sm font-bold leading-tight text-gray-900">Hunter</p>
        </div>
      </div>
      <NavItems />
      <div className="m-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
        <p className="font-semibold text-gray-700">Uso gratuito</p>
        <p className="mt-1">Sem cobrança, sem cartão. Todos os recursos liberados.</p>
      </div>
    </aside>
  );
}

export function SidebarDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <aside className="relative flex w-72 max-w-[85%] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between px-5 py-5">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white">
              <Radar size={18} />
            </div>
            <p className="text-sm font-bold text-gray-900">AI Website Hunter</p>
          </div>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100" aria-label="Fechar menu">
            <X size={20} />
          </button>
        </div>
        <NavItems onNavigate={onClose} />
        <div className="m-3 rounded-xl bg-gray-50 p-3 text-xs text-gray-500">
          <p className="font-semibold text-gray-700">Uso gratuito</p>
          <p className="mt-1">Sem cobrança, sem cartão. Todos os recursos liberados.</p>
        </div>
      </aside>
    </div>
  );
}
