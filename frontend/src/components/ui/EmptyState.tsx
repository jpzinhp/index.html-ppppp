import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center">
      <div className="rounded-full bg-gray-50 p-3 text-gray-400">
        <Icon size={26} />
      </div>
      <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      {description && <p className="max-w-sm text-sm text-gray-500">{description}</p>}
      {action}
    </div>
  );
}
