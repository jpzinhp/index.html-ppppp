import type { DeviceMode } from '../../types';
import { DEVICE_WIDTH } from './DevicePreview';

export function SitePreview({ html, device }: { html: string; device: DeviceMode }) {
  return (
    <div className="flex justify-center overflow-auto rounded-2xl border border-gray-200 bg-gray-100 p-3 thin-scroll">
      <div
        className="h-[70vh] overflow-hidden rounded-xl bg-white shadow-inner transition-[width] duration-200"
        style={{ width: DEVICE_WIDTH[device], maxWidth: '100%' }}
      >
        <iframe title="Preview do site gerado" srcDoc={html} className="h-full w-full border-0" sandbox="allow-scripts" />
      </div>
    </div>
  );
}
