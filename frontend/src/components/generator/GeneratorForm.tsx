import type { GeneratorPreferences, SiteStyle } from '../../types';
import { InlineSpinner } from '../ui/Loading';
import { Sparkles } from 'lucide-react';

const STYLES: { value: SiteStyle; label: string }[] = [
  { value: 'moderno', label: 'Moderno' },
  { value: 'premium', label: 'Premium' },
  { value: 'minimalista', label: 'Minimalista' },
  { value: 'corporativo', label: 'Corporativo' },
  { value: 'elegante', label: 'Elegante' },
  { value: 'dark', label: 'Dark' },
  { value: 'vibrante', label: 'Vibrante' }
];

const COLORS = ['#E5241E', '#2563EB', '#059669', '#D97706', '#7C3AED', '#DB2777', '#0F172A'];

interface GeneratorFormProps {
  values: GeneratorPreferences;
  businessName: string;
  onChange: (values: GeneratorPreferences) => void;
  onGenerate: () => void;
  generating: boolean;
}

export function GeneratorForm({ values, businessName, onChange, onGenerate, generating }: GeneratorFormProps) {
  const set = <K extends keyof GeneratorPreferences>(key: K, v: GeneratorPreferences[K]) =>
    onChange({ ...values, [key]: v });

  const field = (label: string, key: keyof GeneratorPreferences, placeholder = '') => (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        value={values[key] as string}
        onChange={(e) => set(key, e.target.value as never)}
        placeholder={placeholder}
        className="rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold text-gray-900">Dados para {businessName}</h2>
        <p className="text-xs text-gray-500">Ajuste o que quiser antes de gerar — os campos já vêm preenchidos com o que encontramos.</p>
      </div>

      {field('Segmento', 'segment', 'Ex: barbearia, clínica odontológica...')}

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">Diferenciais (opcional)</label>
        <textarea
          value={values.differentiators}
          onChange={(e) => set('differentiators', e.target.value)}
          rows={2}
          placeholder="Ex: 20 anos de mercado, atendimento 24h..."
          className="resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-600">Serviços (separados por vírgula ou linha)</label>
        <textarea
          value={values.services}
          onChange={(e) => set('services', e.target.value)}
          rows={2}
          placeholder="Ex: Corte, Barba, Sobrancelha"
          className="resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {field('Telefone', 'phone', '(00) 00000-0000')}
        {field('WhatsApp', 'whatsapp', '(00) 00000-0000')}
        {field('Instagram', 'instagram', '@perfil')}
        {field('Facebook', 'facebook', 'facebook.com/pagina')}
      </div>
      {field('Endereço', 'address', 'Rua, número, bairro')}

      <div>
        <label className="mb-2 block text-xs font-medium text-gray-600">Estilo</label>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => set('style', s.value)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                values.style === s.value ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium text-gray-600">Cor principal</label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => set('color', c)}
              aria-label={`Cor ${c}`}
              className={`h-7 w-7 rounded-full ring-2 ring-offset-2 ${
                values.color === c ? 'ring-gray-800' : 'ring-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={generating}
        className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
      >
        {generating ? <InlineSpinner /> : <Sparkles size={16} />}
        {generating ? 'Gerando site…' : 'Gerar site com IA'}
      </button>
      <p className="text-center text-xs text-gray-400">Uso gratuito — sem limites, sem cartão.</p>
    </div>
  );
}
