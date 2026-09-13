import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchX, FlaskConical } from 'lucide-react';
import { SearchFilters, type SearchFormValues } from '../components/business/SearchFilters';
import { BusinessCard } from '../components/business/BusinessCard';
import { BusinessDetails } from '../components/business/BusinessDetails';
import { EmptyState } from '../components/ui/EmptyState';
import { Loading } from '../components/ui/Loading';
import { searchBusinesses } from '../lib/api';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import type { Business } from '../types';

const DEFAULT_VALUES: SearchFormValues = {
  city: '',
  state: '',
  category: 'restaurantes',
  keyword: '',
  onlyWithoutWebsite: true
};

export default function SearchPage() {
  const navigate = useNavigate();
  const { businesses, searchInfo, setSearchResults } = useAppData();
  const toast = useToast();

  const [values, setValues] = useState<SearchFormValues>(DEFAULT_VALUES);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Business | null>(null);
  const [hasSearched, setHasSearched] = useState(businesses.length > 0);

  const visibleResults = useMemo(
    () => (values.onlyWithoutWebsite ? businesses.filter((b) => !b.hasWebsite) : businesses),
    [businesses, values.onlyWithoutWebsite]
  );

  async function handleSearch() {
    if (!values.city.trim()) {
      toast.show('Informe uma cidade para buscar.', 'error');
      return;
    }
    if (values.category === 'outros' && !values.keyword.trim()) {
      toast.show('Para a categoria "Outros", informe uma palavra-chave.', 'error');
      return;
    }
    setLoading(true);
    setHasSearched(true);
    try {
      const resp = await searchBusinesses({
        city: values.city.trim(),
        state: values.state || undefined,
        category: values.category,
        keyword: values.keyword.trim() || undefined
      });
      setSearchResults(resp.results, {
        demo: resp.demo,
        reason: resp.reason,
        total: resp.total,
        geocodedAs: resp.geocodedAs,
        city: values.city,
        state: values.state,
        category: values.category,
        keyword: values.keyword
      });
      if (resp.demo) {
        toast.show('Busca real indisponível agora — mostrando dados de demonstração.', 'info');
      } else {
        toast.show(`${resp.total} empresas encontradas.`, 'success');
      }
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Erro ao buscar empresas.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function handleCreateSite(business: Business) {
    navigate('/gerador', { state: { business, categoryValue: values.category } });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Encontrar empresas</h1>
        <p className="text-sm text-gray-500">Busque por cidade e categoria para encontrar comércios sem site cadastrado.</p>
      </div>

      <SearchFilters values={values} onChange={setValues} onSubmit={handleSearch} loading={loading} />

      {searchInfo?.demo && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <FlaskConical size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">DEMONSTRAÇÃO</p>
            <p className="text-xs">
              Não foi possível concluir a busca real agora{searchInfo.reason ? ` (${searchInfo.reason})` : ''}. Os resultados abaixo
              são dados de exemplo, não empresas reais.
            </p>
          </div>
        </div>
      )}

      {loading && <Loading label="Buscando empresas no OpenStreetMap…" />}

      {!loading && hasSearched && (
        <p className="text-sm font-medium text-gray-600">
          {visibleResults.length} {visibleResults.length === 1 ? 'empresa encontrada' : 'empresas encontradas'}
        </p>
      )}

      {!loading && hasSearched && visibleResults.length === 0 && (
        <EmptyState icon={SearchX} title="Nenhuma empresa encontrada para esses filtros." description="Tente outra cidade, categoria ou desmarque o filtro de somente sem site." />
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleResults.map((b) => (
          <BusinessCard key={b.id} business={b} onViewDetails={setSelected} onCreateSite={handleCreateSite} />
        ))}
      </div>

      <BusinessDetails business={selected} onClose={() => setSelected(null)} onCreateSite={handleCreateSite} />
    </div>
  );
}
