import { Sparkles, LayoutTemplate, Play, DownloadCloud, Code2, Flame } from 'lucide-react';
import { ActiveTab, GemConfig } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenPresets: () => void;
  config: GemConfig;
}

export function Navbar({ activeTab, setActiveTab, onOpenPresets, config }: NavbarProps) {
  const handleTryPresetsClick = () => {
    if (activeTab !== 'builder') {
      setActiveTab('builder');
      setTimeout(() => {
        const el = document.getElementById('try-presets-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    } else {
      const el = document.getElementById('try-presets-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        onOpenPresets();
      }
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-bold text-slate-900 text-base sm:text-lg tracking-tight">PromptBots for GitHub</h1>
              <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200/60 hidden xs:inline-block">Open & Multi-Model</span>
            </div>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('builder')}
            className={`flex items-center space-x-1 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'builder'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Configurator"
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Config</span>
          </button>
          
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center space-x-1 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'preview'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Live Preview"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('export')}
            className={`flex items-center space-x-1 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'export'
                ? 'bg-white text-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Export & Deploy"
          >
            <DownloadCloud className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTryPresetsClick}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 transition"
            title="Scroll to Try Presets"
          >
            <LayoutTemplate className="w-4 h-4 text-indigo-600" />
            <span className="hidden xs:inline">Try Presets</span>
          </button>
        </div>

      </div>
    </header>
  );
}

