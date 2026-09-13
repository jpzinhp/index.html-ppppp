import { Search } from 'lucide-react';
import { CATEGORIES } from '../../lib/categories';
import { BRAZIL_STATES } from '../../lib/states';
import { InlineSpinner } from '../ui/Loading';

export interface SearchFormValues {
  city: string;
  state: string;
  category: string;
  keyword: string;
  onlyWithoutWebsite: boolean;
}

interface SearchFiltersProps {
  values: SearchFormValues;
  onChange: (values: SearchFormValues) => void;
  onSubmit: () => void;
  loading?: boolean;
}

export function SearchFilters({ values, onChange, onSubmit, loading }: SearchFiltersProps) {
  const set = <K extends keyof SearchFormValues>(key: K, value: SearchFormValues[K]) =>
    onChange({ ...values, [key]: value });

  const isOutros = values.category === 'outros';

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4"
    >
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">Cidade</label>
        <input
          value={values.city}
          onChange={(e) => set('city', e.target.value)}
          placeholder="Ex: Fortaleza"
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">Estado</label>
        <select
          value={values.state}
          onChange={(e) => set('state', e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        >
          {BRAZIL_STATES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">Categoria</label>
        <select
          value={values.category}
          onChange={(e) => set('category', e.target.value)}
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">
          Palavra-chave {isOutros ? '(obrigatória para "Outros")' : '(opcional)'}
        </label>
        <input
          value={values.keyword}
          onChange={(e) => set('keyword', e.target.value)}
          placeholder="Ex: estúdio, lavanderia..."
          className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />
      </div>

      <label className="flex items-center gap-2.5 sm:col-span-2 lg:col-span-2">
        <input
          type="checkbox"
          checked={values.onlyWithoutWebsite}
          onChange={(e) => set('onlyWithoutWebsite', e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-400"
        />
        <span className="text-sm text-gray-700">Mostrar somente empresas sem site</span>
      </label>

      <div className="flex items-end sm:col-span-2 lg:col-span-2 lg:justify-end">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 lg:w-auto"
        >
          {loading ? <InlineSpinner /> : <Search size={16} />}
          {loading ? 'Buscando…' : 'Encontrar empresas'}
        </button>
      </div>
    </form>
  );
}
