import { useNavigate } from 'react-router-dom';
import { Search, Building2, AlertTriangle, Globe, Save, ArrowRight } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { stats, savedSites } = useAppData();

  const cards = [
    { label: 'Empresas encontradas', value: stats.found, icon: Building2, tone: 'text-gray-900' },
    { label: 'Sem website informado', value: stats.withoutWebsite, icon: AlertTriangle, tone: 'text-orange-600' },
    { label: 'Sites gerados', value: stats.generated, icon: Globe, tone: 'text-red-600' },
    { label: 'Sites salvos', value: stats.saved, icon: Save, tone: 'text-emerald-600' }
  ];

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Encontre empresas que precisam de um site.</h1>
        <p className="mt-2 max-w-xl text-sm text-gray-500">
          Pesquise uma cidade, escolha um segmento e encontre empresas para criar sites profissionais.
        </p>
        <button
          onClick={() => navigate('/buscar')}
          className="mt-5 flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700"
        >
          <Search size={16} />
          Encontrar empresas
          <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <c.icon className={`mb-3 ${c.tone}`} size={20} />
            <p className={`text-2xl font-bold ${c.tone}`}>{c.value.toLocaleString('pt-BR')}</p>
            <p className="mt-1 text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Sites gerados recentemente</h2>
          <button onClick={() => navigate('/sites-gerados')} className="text-xs font-medium text-red-600 hover:underline">
            Ver todos
          </button>
        </div>
        {savedSites.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum site salvo ainda. Gere o primeiro em "Encontrar empresas".</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {savedSites.slice(0, 5).map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium text-gray-800">{s.business.name}</p>
                  <p className="text-xs text-gray-500">
                    {s.business.category} · {s.business.city}
                  </p>
                </div>
                <span className="text-xs text-gray-400">{new Date(s.createdAt).toLocaleDateString('pt-BR')}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
