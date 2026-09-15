import { X, Sparkles, ArrowRight, Terminal, GraduationCap, Database, Bot } from 'lucide-react';
import { GemConfig } from '../types';
import { PRESET_GEMS } from '../data/presets';

interface PresetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (preset: GemConfig) => void;
}

export function PresetModal({ isOpen, onClose, onSelectPreset }: PresetModalProps) {
  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal': return <Terminal className="w-5 h-5" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Database': return <Database className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-bold text-lg text-slate-900">Choose a Preset Prompt Bot Template</h2>
            <p className="text-xs text-slate-500">Start instantly with pre-configured expert AI assistants</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
          {PRESET_GEMS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onSelectPreset(preset);
                onClose();
              }}
              className="group p-4 rounded-2xl border border-slate-200 hover:border-indigo-500 hover:shadow-md cursor-pointer transition bg-slate-50/50 hover:bg-white flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition">
                    {getIcon(preset.icon)}
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-200 text-slate-700">
                    {preset.model}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">{preset.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{preset.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-100 text-xs font-semibold text-indigo-600">
                <span>Load Template</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
