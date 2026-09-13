import { useNavigate } from 'react-router-dom';
import { Globe, ExternalLink, PencilLine, Download, Trash2 } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { EmptyState } from '../components/ui/EmptyState';
import { categoryValueFromLabel } from '../lib/categories';

export default function GeneratedSitesPage() {
  const { savedSites, removeSavedSite } = useAppData();
  const navigate = useNavigate();
  const toast = useToast();

  function openSite(html: string) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener');
  }

  function downloadSite(html: string, name: string) {
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function editSite(site: (typeof savedSites)[number]) {
    navigate('/gerador', {
      state: {
        business: site.business,
        categoryValue: categoryValueFromLabel(site.business.category),
        editSite: site
      }
    });
  }

  function deleteSite(id: string) {
    if (confirm('Excluir este site salvo? Essa ação não pode ser desfeita.')) {
      removeSavedSite(id);
      toast.show('Site excluído.', 'success');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Sites gerados</h1>
        <p className="text-sm text-gray-500">Sites salvos nesta sessão, guardados no seu navegador (localStorage).</p>
      </div>

      {savedSites.length === 0 ? (
        <EmptyState
          icon={Globe}
          title="Nenhum site salvo ainda"
          description='Gere um site em "Encontrar empresas" e clique em "Salvar site" para vê-lo aqui.'
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {savedSites.map((s) => (
            <div key={s.id} className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">{s.business.name}</h3>
                <p className="text-xs text-gray-500">
                  {s.business.category} · {s.business.city}
                </p>
              </div>
              <p className="text-xs text-gray-400">Salvo em {new Date(s.createdAt).toLocaleDateString('pt-BR')}</p>
              <span className="w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
                {s.mode === 'ai' ? 'Gerado com IA' : 'Gerado (demonstração)'}
              </span>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <ActionBtn icon={ExternalLink} label="Abrir" onClick={() => openSite(s.html)} />
                <ActionBtn icon={PencilLine} label="Editar" onClick={() => editSite(s)} />
                <ActionBtn icon={Download} label="Baixar" onClick={() => downloadSite(s.html, s.business.name)} />
                <ActionBtn icon={Trash2} label="Excluir" onClick={() => deleteSite(s.id)} danger />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  danger
}: {
  icon: typeof ExternalLink;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium ${
        danger ? 'border-red-100 text-red-600 hover:bg-red-50' : 'border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
