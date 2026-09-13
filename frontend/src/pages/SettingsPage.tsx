import { useEffect, useState } from 'react';
import { ShieldCheck, DatabaseZap, Trash2 } from 'lucide-react';
import { getHealth, type HealthResponse } from '../lib/api';
import { useToast } from '../context/ToastContext';

export default function SettingsPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getHealth()
      .then(setHealth)
      .catch(() => setHealthError(true));
  }, []);

  function clearLocalData() {
    if (!confirm('Isso apaga favoritos, sites salvos e estatísticas guardados neste navegador. Continuar?')) return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith('ai-website-hunter:'))
      .forEach((k) => localStorage.removeItem(k));
    toast.show('Dados locais apagados. Recarregue a página.', 'success');
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Configurações</h1>
        <p className="text-sm text-gray-500">Status do sistema e dados guardados neste navegador.</p>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <ShieldCheck size={16} /> Status da API
        </h2>
        {healthError && <p className="text-sm text-red-600">Não foi possível conectar ao backend agora.</p>}
        {!healthError && !health && <p className="text-sm text-gray-500">Verificando…</p>}
        {health && (
          <ul className="space-y-1.5 text-sm text-gray-600">
            <li>
              Geração de conteúdo: <b>{health.mode.ai === 'ai' ? 'IA configurada' : 'Modo demonstração (templates locais)'}</b>
            </li>
            <li>
              Banco de imagens: <b>{health.mode.images === 'pexels' ? 'Pexels configurado' : 'Placeholder local'}</b>
            </li>
          </ul>
        )}
        <p className="mt-3 text-xs text-gray-400">
          O aplicativo é 100% gratuito e funciona mesmo sem essas integrações configuradas — nesse caso, ele usa geração local
          por templates e imagens de placeholder, sempre deixando isso identificado.
        </p>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
          <DatabaseZap size={16} /> Dados locais
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          Favoritos, sites salvos e estatísticas ficam guardados apenas no seu navegador (localStorage) — nenhum dado é
          enviado para um servidor além das buscas e gerações que você pede.
        </p>
        <button
          onClick={clearLocalData}
          className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
        >
          <Trash2 size={16} />
          Limpar dados locais
        </button>
      </section>
    </div>
  );
}
