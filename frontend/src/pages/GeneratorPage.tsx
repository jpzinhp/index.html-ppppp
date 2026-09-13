import { useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Copy, ExternalLink, RefreshCw, Save, PencilLine, Wand2 } from 'lucide-react';
import type { Business, GeneratedSite, GeneratorPreferences } from '../types';
import { generateHtml, generateSiteContent, searchImages } from '../lib/api';
import { categorySingular, categoryValueFromLabel } from '../lib/categories';
import { GeneratorForm } from '../components/generator/GeneratorForm';
import { SitePreview } from '../components/generator/SitePreview';
import { DevicePreviewSwitch } from '../components/generator/DevicePreview';
import { EmptyState } from '../components/ui/EmptyState';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import type { DeviceMode } from '../types';

interface LocationState {
  business?: Business;
  categoryValue?: string;
  editSite?: GeneratedSite;
}

function newPreferences(business: Business, categoryValue: string): GeneratorPreferences {
  return {
    segment: categorySingular(categoryValue),
    differentiators: '',
    services: '',
    phone: business.phone || '',
    whatsapp: business.phone || '',
    instagram: business.instagram || '',
    facebook: business.facebook || '',
    address: business.address || '',
    style: 'moderno',
    color: '#E5241E'
  };
}

export default function GeneratorPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { registerSiteGenerated, saveSite, updateSavedSite } = useAppData();
  const toast = useToast();
  const formRef = useRef<HTMLDivElement>(null);

  const state = (location.state as LocationState) || {};
  const [business] = useState<Business | null>(state.business || null);
  const categoryValue = useMemo(
    () => state.categoryValue || (business ? categoryValueFromLabel(business.category) : 'outros'),
    [state.categoryValue, business]
  );

  const editSite = state.editSite;
  const [prefs, setPrefs] = useState<GeneratorPreferences>(() =>
    editSite ? editSite.preferences : business ? newPreferences(business, categoryValue) : ({} as GeneratorPreferences)
  );
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedSite | null>(editSite || null);
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [error, setError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(editSite?.id || null);

  if (!business) {
    return (
      <EmptyState
        icon={Wand2}
        title="Nenhuma empresa selecionada"
        description='Escolha uma empresa em "Encontrar empresas" e clique em "Criar site com IA" para abrir o gerador.'
        action={
          <button
            onClick={() => navigate('/buscar')}
            className="mt-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Ir para a busca
          </button>
        }
      />
    );
  }

  async function handleGenerate() {
    if (!business) return;
    setGenerating(true);
    setError(null);
    try {
      const effectiveBusiness: Business = {
        ...business,
        phone: prefs.phone || business.phone,
        instagram: prefs.instagram || business.instagram,
        facebook: prefs.facebook || business.facebook,
        address: prefs.address || business.address
      };

      const { content, mode } = await generateSiteContent(effectiveBusiness, { ...prefs, categoryValue });
      const images = await searchImages(prefs.segment || business.category, 5);
      const { html } = await generateHtml({
        business: effectiveBusiness,
        content,
        images,
        style: prefs.style,
        color: prefs.color
      });

      const site: GeneratedSite = {
        id: savedId || `site-${Date.now()}`,
        business: effectiveBusiness,
        preferences: prefs,
        content,
        images,
        html,
        mode,
        createdAt: result?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setResult(site);
      registerSiteGenerated();
      if (savedId) {
        // Já era um site salvo — mantém a lista de "Sites gerados" em dia.
        updateSavedSite(savedId, site);
      }
      toast.show(mode === 'demo' ? 'Site gerado (modo demonstração).' : 'Site gerado com IA!', 'success');
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro inesperado ao gerar o site.';
      setError(message);
      toast.show(message, 'error');
    } finally {
      setGenerating(false);
    }
  }

  function handleDownload() {
    if (!result) return;
    const blob = new Blob([result.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const slug = business!.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'site-gerado';
    a.download = `${slug}.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.show('HTML baixado.', 'success');
  }

  async function handleCopy() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.html);
      toast.show('Código copiado para a área de transferência.', 'success');
    } catch {
      toast.show('Não foi possível copiar automaticamente. Selecione e copie manualmente.', 'error');
    }
  }

  function handleOpenNewTab() {
    if (!result) return;
    const blob = new Blob([result.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank', 'noopener');
  }

  function handleSave() {
    if (!result) return;
    if (savedId) {
      updateSavedSite(savedId, result);
      toast.show('Alterações salvas.', 'success');
    } else {
      saveSite(result);
      setSavedId(result.id);
      toast.show('Site salvo em "Sites gerados".', 'success');
    }
  }

  function handleEdit() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Gerador de sites</h1>
        <p className="text-sm text-gray-500">Preencha os dados e gere um site profissional em segundos — 100% gratuito.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <div ref={formRef}>
          <GeneratorForm
            values={prefs}
            businessName={business.name}
            onChange={setPrefs}
            onGenerate={handleGenerate}
            generating={generating}
          />
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <DevicePreviewSwitch value={device} onChange={setDevice} />
            {result && (
              <div className="flex flex-wrap gap-2">
                <ActionButton icon={Download} label="Baixar HTML" onClick={handleDownload} />
                <ActionButton icon={Copy} label="Copiar código" onClick={handleCopy} />
                <ActionButton icon={ExternalLink} label="Abrir em nova aba" onClick={handleOpenNewTab} />
                <ActionButton icon={PencilLine} label="Editar" onClick={handleEdit} />
                <ActionButton icon={RefreshCw} label="Gerar novamente" onClick={handleGenerate} disabled={generating} />
                <ActionButton icon={Save} label="Salvar site" onClick={handleSave} primary />
              </div>
            )}
          </div>

          {result ? (
            <SitePreview html={result.html} device={device} />
          ) : (
            <EmptyState
              icon={Wand2}
              title="Nenhum site gerado ainda"
              description='Preencha o formulário ao lado e clique em "Gerar site com IA" para ver a prévia aqui.'
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  primary
}: {
  icon: typeof Download;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium disabled:opacity-60 ${
        primary ? 'bg-red-600 text-white hover:bg-red-700' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon size={14} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
