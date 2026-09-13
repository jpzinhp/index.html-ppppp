import type { ReactNode } from 'react';

type Tone = 'green' | 'orange' | 'gray' | 'red';

const TONE_CLASSES: Record<Tone, string> = {
  green: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  orange: 'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  gray: 'bg-gray-100 text-gray-600 ring-1 ring-gray-200',
  red: 'bg-red-50 text-red-700 ring-1 ring-red-200'
};

export function Badge({ tone = 'gray', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]}`}>
      {children}
    </span>
  );
}
