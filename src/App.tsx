/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { BuilderView } from './components/BuilderView';
import { LiveChatPreview } from './components/LiveChatPreview';
import { ExportView } from './components/ExportView';
import { PresetModal } from './components/PresetModal';
import { ActiveTab, GemConfig } from './types';
import { INITIAL_EMPTY_BOT } from './data/presets';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('builder');
  const [config, setConfig] = useState<GemConfig>(INITIAL_EMPTY_BOT);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPresets={() => setIsPresetModalOpen(true)}
        config={config}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'builder' && (
          <BuilderView
            config={config}
            onChange={setConfig}
            onPreview={() => setActiveTab('preview')}
            onOpenPresetsModal={() => setIsPresetModalOpen(true)}
          />
        )}

        {activeTab === 'preview' && (
          <LiveChatPreview config={config} />
        )}

        {activeTab === 'export' && (
          <ExportView config={config} />
        )}
      </main>

      <PresetModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectPreset={(preset) => setConfig(preset)}
      />
    </div>
  );
}

