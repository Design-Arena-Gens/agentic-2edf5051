import { PLATFORM_CONFIG, type PlatformKey } from "@/lib/platforms-config";
import { cn } from "@/lib/utils";

interface PlatformCardProps {
  platform: PlatformKey;
  selected: boolean;
  onToggle: (platform: PlatformKey) => void;
}

export function PlatformCard({ platform, selected, onToggle }: PlatformCardProps) {
  const config = PLATFORM_CONFIG[platform];

  return (
    <button
      type="button"
      onClick={() => onToggle(platform)}
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-slate-700 bg-slate-900/60 p-4 text-left transition-all duration-200 hover:border-brand-light hover:shadow-glass",
        selected && "border-brand bg-slate-900/90 shadow-glass"
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-base font-semibold">{config.label}</span>
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: config.brandColor }}
        />
      </div>
      <p className="text-sm text-slate-300">{config.description}</p>
      <div className="mt-auto text-xs text-slate-500">
        Env: {config.envVars.join(", ")}
      </div>
    </button>
  );
}
