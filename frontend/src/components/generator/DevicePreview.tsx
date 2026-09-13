import { Monitor, Tablet, Smartphone } from 'lucide-react';
import type { DeviceMode } from '../../types';

const OPTIONS: { mode: DeviceMode; icon: typeof Monitor; label: string }[] = [
  { mode: 'desktop', icon: Monitor, label: 'Desktop' },
  { mode: 'tablet', icon: Tablet, label: 'Tablet' },
  { mode: 'mobile', icon: Smartphone, label: 'Mobile' }
];

export function DevicePreviewSwitch({ value, onChange }: { value: DeviceMode; onChange: (m: DeviceMode) => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-gray-200 bg-white p-1">
      {OPTIONS.map((opt) => (
        <button
          key={opt.mode}
          onClick={() => onChange(opt.mode)}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.mode ? 'bg-red-600 text-white' : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <opt.icon size={14} />
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export const DEVICE_WIDTH: Record<DeviceMode, string> = {
  desktop: '100%',
  tablet: '768px',
  mobile: '390px'
};
