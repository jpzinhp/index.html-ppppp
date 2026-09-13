import { Loader2 } from 'lucide-react';

export function Loading({ label = 'Carregando…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-gray-500">
      <Loader2 className="animate-spin" size={28} />
      <p className="text-sm">{label}</p>
    </div>
  );
}

export function InlineSpinner({ size = 16 }: { size?: number }) {
  return <Loader2 className="animate-spin" size={size} />;
}
