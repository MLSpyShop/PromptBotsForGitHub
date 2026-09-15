import React, { useState } from 'react';
import { Sparkles, Bot, Terminal, GraduationCap, Database, Code, Check, RefreshCw, Upload, Image as ImageIcon, Trash2, AlertCircle, CheckCircle2, Wand2, MessageSquare, Lightbulb, Zap, Briefcase, ShieldAlert, ArrowRight, LayoutTemplate, ChevronDown, ChevronUp, Info, HelpCircle } from 'lucide-react';
import { GemConfig } from '../types';
import { PRESET_GEMS } from '../data/presets';

interface BuilderViewProps {
  config: GemConfig;
  onChange: (newConfig: GemConfig) => void;
  onPreview: () => void;
  onOpenPresetsModal?: () => void;
}

export function BuilderView({ config, onChange, onPreview, onOpenPresetsModal }: BuilderViewProps) {
  const [showIntroGuide, setShowIntroGuide] = useState(true);
  const [isEnhancingInstructions, setIsEnhancingInstructions] = useState(false);
  const [isGeneratingGreeting, setIsGeneratingGreeting] = useState(false);
  const [isGeneratingChips, setIsGeneratingChips] = useState(false);
  const [isEnhancingAll, setIsEnhancingAll] = useState(false);
  const [enhanceStatus, setEnhanceStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const [newPromptInput, setNewPromptInput] = useState('');

  const handleInputChange = (field: keyof GemConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleSelectPreset = (preset: GemConfig) => {
    onChange(preset);
    setEnhanceStatus({ type: 'success', message: `✨ Loaded "${preset.name}" preset template!` });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setEnhanceStatus(null), 4000);
  };

  const getPresetIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-5 h-5 text-indigo-600" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-600" />;
      case 'Terminal': return <Terminal className="w-5 h-5 text-indigo-600" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-emerald-600" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-violet-600" />;
      case 'Database': return <Database className="w-5 h-5 text-amber-600" />;
      default: return <Bot className="w-5 h-5 text-indigo-600" />;
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        handleInputChange('logoUrl', result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddStarterPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromptInput.trim()) return;
    onChange({
      ...config,
      starterPrompts: [...(config.starterPrompts || []), newPromptInput.trim()]
    });
    setNewPromptInput('');
  };

  const handleRemoveStarterPrompt = (index: number) => {
    const updated = (config.starterPrompts || []).filter((_, i) => i !== index);
    onChange({ ...config, starterPrompts: updated });
  };

  const applyStructuredTemplate = () => {
    const title = config.name?.trim() || "Specialized AI Assistant";
    const desc = config.description?.trim() || "Helpful assistant for tasks and workflows";
    const existing = config.systemInstruction?.trim();
    
    const structured = `You are ${title}, a high-precision, knowledgeable AI assistant.
Description: ${desc}

## CORE ROLE & OBJECTIVES
- Provide accurate, concise, and structured answers.
- Adapt tone to be professional, engaging, and solution-focused.
${existing ? `\n## SPECIFIC INSTRUCTIONS\n${existing}\n` : ''}
## OUTPUT FORMAT & CONSTRAINTS
- Use clear markdown with bold headers and bullet points for readability.
- If unsure or if information is ambiguous, clarify before answering.
- Prioritize practical, actionable guidance.`;

    handleInputChange('systemInstruction', structured);
    setEnhanceStatus({ type: 'success', message: 'Applied structured prompt template.' });
    setTimeout(() => setEnhanceStatus(null), 4000);
  };

  const handleAiEnhanceInstructions = async () => {
    setIsEnhancingInstructions(true);
    setEnhanceStatus(null);
    try {
      const res = await fetch('/api/refine-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: config.name,
          description: config.description,
          rawInstructions: config.systemInstruction,
          goal: config.welcomeMessage,
          provider: config.provider,
          openRouterModel: config.openRouterModel,
          openRouterApiKey: localStorage.getItem('openrouter_api_key')
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to refine instructions');
      }
      if (data.refinedPrompt) {
        handleInputChange('systemInstruction', data.refinedPrompt);
        setEnhanceStatus({ type: 'success', message: '✨ System instructions enhanced by AI!' });
        setTimeout(() => setEnhanceStatus(null), 4000);
      }
    } catch (error: any) {
      console.warn('AI enhancement notice:', error);
      const isDemandError = error.message?.includes('demand') || error.message?.includes('503') || error.message?.includes('busy');
      setEnhanceStatus({
        type: 'error',
        message: isDemandError
          ? 'AI model is momentarily busy. You can retry in a few seconds or use the structured template.'
          : (error.message || 'Could not connect to AI service.')
      });
    } finally {
      setIsEnhancingInstructions(false);
    }
  };

  const handleAiGenerateGreeting = async () => {
    setIsGeneratingGreeting(true);
    setEnhanceStatus(null);
    try {
      const res = await fetch('/api/generate-greeting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: config.name,
          description: config.description,
          systemInstruction: config.systemInstruction,
          currentGreeting: config.welcomeMessage
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate greeting');
      }
      if (data.greeting) {
        handleInputChange('welcomeMessage', data.greeting);
        setEnhanceStatus({ type: 'success', message: '✨ Custom welcome greeting generated by AI!' });
        setTimeout(() => setEnhanceStatus(null), 4000);
      }
    } catch (error: any) {
      console.warn('AI greeting generation notice:', error);
      setEnhanceStatus({
        type: 'error',
        message: error.message || 'Could not generate greeting.'
      });
    } finally {
      setIsGeneratingGreeting(false);
    }
  };

  const handleAiGenerateStarterChips = async () => {
    setIsGeneratingChips(true);
    setEnhanceStatus(null);
    try {
      const res = await fetch('/api/generate-starter-chips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: config.name,
          description: config.description,
          systemInstruction: config.systemInstruction
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to generate starter chips');
      }
      if (Array.isArray(data.starterPrompts) && data.starterPrompts.length > 0) {
        handleInputChange('starterPrompts', data.starterPrompts);
        setEnhanceStatus({ type: 'success', message: `✨ Generated ${data.starterPrompts.length} starter prompt chips!` });
        setTimeout(() => setEnhanceStatus(null), 4000);
      }
    } catch (error: any) {
      console.warn('AI chips generation notice:', error);
      setEnhanceStatus({
        type: 'error',
        message: error.message || 'Could not generate starter chips.'
      });
    } finally {
      setIsGeneratingChips(false);
    }
  };

  const handleAiEnhanceAll = async () => {
    setIsEnhancingAll(true);
    setEnhanceStatus(null);
    try {
      const res = await fetch('/api/enhance-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: config.name,
          description: config.description,
          rawInstructions: config.systemInstruction,
          currentGreeting: config.welcomeMessage
        })
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to enhance all fields');
      }
      
      onChange({
        ...config,
        systemInstruction: data.systemInstruction || config.systemInstruction,
        welcomeMessage: data.welcomeMessage || config.welcomeMessage,
        starterPrompts: Array.isArray(data.starterPrompts) ? data.starterPrompts : config.starterPrompts
      });

      setEnhanceStatus({ type: 'success', message: '✨ All bot fields (Instructions, Greeting & Starter Chips) enhanced with AI!' });
      setTimeout(() => setEnhanceStatus(null), 4000);
    } catch (error: any) {
      console.warn('AI Enhance All notice:', error);
      setEnhanceStatus({
        type: 'error',
        message: error.message || 'Could not complete AI enhancement.'
      });
    } finally {
      setIsEnhancingAll(false);
    }
  };

  const icons = ['Bot', 'Terminal', 'GraduationCap', 'Sparkles', 'Database', 'Code'];
  const colors: Array<GemConfig['themeColor']> = ['indigo', 'emerald', 'violet', 'amber', 'rose', 'cyan'];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PromptBots for GitHub</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Configure Your Custom Prompt Bot</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Enter your bot name and description, then click <strong>Auto-Fill & Enhance All</strong> to instantly generate system instructions, custom greeting, and starter prompt chips.
          </p>
        </div>
        <button
          onClick={onPreview}
          className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 transition flex items-center space-x-2 flex-shrink-0"
        >
          <span>Test in Live Preview</span>
          <Bot className="w-4 h-4" />
        </button>
      </div>

      {/* Short, Concise & Detailed Intro Guide */}
      <div className="bg-white border border-indigo-100/90 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
              <Zap className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight">Quick Start Guide: 3-Step Creation Flow</h3>
              <p className="text-xs text-slate-500">How to create, customize, test, and deploy standalone AI prompt bots for free.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowIntroGuide(!showIntroGuide)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 px-2.5 py-1 rounded-lg hover:bg-indigo-50 transition"
          >
            <span>{showIntroGuide ? 'Hide Guide' : 'Show Guide'}</span>
            {showIntroGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {showIntroGuide && (
          <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                <span className="text-xs font-bold text-slate-900">Define Role & Persona</span>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Enter your bot name and role concept, or choose a pre-made template under <strong>Try Presets</strong> lower on this page.
              </p>
              <div className="text-[10px] text-indigo-700 bg-indigo-50/70 border border-indigo-100/80 rounded-md px-2 py-1 font-medium">
                💡 Tip: Choose free Gemini or OpenRouter models.
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                <span className="text-xs font-bold text-slate-900">AI Auto-Fill & Refine</span>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Click <strong>✨ Auto-Fill & Enhance All</strong> to generate comprehensive system instructions, a custom greeting, and 4 starter chips.
              </p>
              <div className="text-[10px] text-indigo-700 bg-indigo-50/70 border border-indigo-100/80 rounded-md px-2 py-1 font-medium">
                ⚡ Use individual AI buttons to fine-tune any field.
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                <span className="text-xs font-bold text-slate-900">Preview & Free Export</span>
              </div>
              <p className="text-[12px] text-slate-600 leading-relaxed">
                Test in <strong>Live Preview</strong>, then download your standalone <code className="text-indigo-600 font-mono text-[11px]">index.html</code> in <strong>Export & Deploy</strong> for free GitHub Pages hosting.
              </p>
              <div className="text-[10px] text-emerald-700 bg-emerald-50/70 border border-emerald-100/80 rounded-md px-2 py-1 font-medium">
                🚀 Zero server costs • 100% Client-side privacy.
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* General Details Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <span>General Information</span>
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Bot Name</label>
                <input
                  type="text"
                  value={config.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g. Code Review Mentor, Research Assistant, Writing Coach..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Short Description</label>
                <input
                  type="text"
                  value={config.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief summary of what this bot helps with..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">AI Engine & Provider</label>
                  <select
                    value={config.provider || 'openrouter'}
                    onChange={(e) => handleInputChange('provider', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-medium"
                  >
                    <option value="openrouter">OpenRouter (Free Open-Source Models)</option>
                    <option value="gemini">Google Gemini API</option>
                  </select>
                </div>

                {config.provider !== 'gemini' ? (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Open-Source Free Model</label>
                    <select
                      value={config.openRouterModel || 'deepseek/deepseek-r1:free'}
                      onChange={(e) => handleInputChange('openRouterModel', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition font-medium"
                    >
                      <option value="deepseek/deepseek-r1:free">DeepSeek R1 (Free Reasoning)</option>
                      <option value="deepseek/deepseek-chat:free">DeepSeek V3 (Free Chat)</option>
                      <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (Free)</option>
                      <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B (Free)</option>
                      <option value="qwen/qwen-2.5-72b-instruct:free">Qwen 2.5 72B (Free)</option>
                      <option value="mistralai/mistral-7b-instruct:free">Mistral 7B (Free)</option>
                      <option value="google/gemma-2-9b-it:free">Gemma 2 9B (Free)</option>
                      <option value="microsoft/phi-3-medium-128k-instruct:free">Phi-3 Medium 128k (Free)</option>
                      <option value="meta-llama/llama-3.1-8b-instruct:free">Llama 3.1 8B (Free)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Gemini Model</label>
                    <select
                      value={config.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                    >
                      <option value="gemini-2.5-flash">gemini-2.5-flash (Fast & Reliable)</option>
                      <option value="gemini-3.8-flash">gemini-3.8-flash (Recommended)</option>
                      <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Advanced Reasoning)</option>
                      <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Fast & Lightweight)</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Author / Creator Name</label>
                  <input
                    type="text"
                    value={config.authorName}
                    onChange={(e) => handleInputChange('authorName', e.target.value)}
                    placeholder="Your Name or GitHub Org"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Auto-Fill & Enhance All Action Banner (Above Instructions) */}
          <div className="bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 border border-indigo-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-bold text-indigo-950">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Auto-Fill & Enhance All Persona Fields</span>
              </div>
              <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                Generates tailored system instructions, custom opening greeting, and 4 starter prompt chips all at once.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAiEnhanceAll}
              disabled={isEnhancingAll}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-md shadow-indigo-600/20 transition flex items-center space-x-2 flex-shrink-0 disabled:opacity-50 cursor-pointer self-stretch sm:self-auto justify-center"
              title="Auto-fill instructions, greeting, and starter chips with AI"
            >
              {isEnhancingAll ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-300" />}
              <span>{isEnhancingAll ? 'Auto-Enhancing All...' : '✨ Auto-Fill & Enhance All'}</span>
            </button>
          </div>

          {/* System Instructions Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">System Instructions</h3>
                <p className="text-xs text-slate-500">Defines the core personality, rules, constraints, and behavior.</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={applyStructuredTemplate}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                  title="Apply Structured System Instruction Template"
                >
                  <Wand2 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Template</span>
                </button>
                <button
                  type="button"
                  onClick={handleAiEnhanceInstructions}
                  disabled={isEnhancingInstructions}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition disabled:opacity-50"
                  title="Enhance or auto-generate instructions with AI"
                >
                  {isEnhancingInstructions ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-600" />}
                  <span>{isEnhancingInstructions ? 'Enhancing...' : '✨ AI Enhance'}</span>
                </button>
              </div>
            </div>

            {enhanceStatus && (
              <div className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 transition ${
                enhanceStatus.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}>
                <div className="flex items-center gap-2">
                  {enhanceStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  )}
                  <span>{enhanceStatus.message}</span>
                </div>
                {enhanceStatus.type === 'error' && (
                  <button
                    type="button"
                    onClick={applyStructuredTemplate}
                    className="font-semibold underline hover:text-amber-950 flex-shrink-0 text-[11px]"
                  >
                    Use Template Instead
                  </button>
                )}
              </div>
            )}

            <textarea
              value={config.systemInstruction}
              onChange={(e) => handleInputChange('systemInstruction', e.target.value)}
              rows={8}
              placeholder="Enter system prompt instructions, or type rough notes and click '✨ AI Enhance'..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-900 font-mono focus:outline-none focus:border-indigo-500 focus:bg-white transition leading-relaxed"
            ></textarea>
          </div>

          {/* Welcome Message & Starter Prompts */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
            <h3 className="font-bold text-slate-900 text-base">Greeting & Starter Chips</h3>

            {/* Welcome Greeting Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-700">Welcome Greeting Message</label>
                <button
                  type="button"
                  onClick={handleAiGenerateGreeting}
                  disabled={isGeneratingGreeting}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition border border-indigo-200 disabled:opacity-50"
                  title="Generate a personalized greeting message with AI"
                >
                  {isGeneratingGreeting ? <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" /> : <MessageSquare className="w-3 h-3 text-indigo-600" />}
                  <span>{isGeneratingGreeting ? 'Generating...' : '✨ AI Greeting'}</span>
                </button>
              </div>
              <input
                type="text"
                value={config.welcomeMessage}
                onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                placeholder="e.g. Welcome! What can I analyze, build, or draft for you today?"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
              />
            </div>

            {/* Starter Prompt Chips */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">Starter Prompt Chips</label>
                  <p className="text-[11px] text-slate-400">One-click suggested questions displayed when a user begins chat.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAiGenerateStarterChips}
                  disabled={isGeneratingChips}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition border border-indigo-200 disabled:opacity-50"
                  title="Generate 4 tailored starter prompt chips with AI"
                >
                  {isGeneratingChips ? <RefreshCw className="w-3 h-3 animate-spin text-indigo-600" /> : <Lightbulb className="w-3 h-3 text-indigo-600" />}
                  <span>{isGeneratingChips ? 'Generating...' : '✨ AI Chips'}</span>
                </button>
              </div>

              {/* Chips list or Empty State */}
              {(!config.starterPrompts || config.starterPrompts.length === 0) ? (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-4 text-center space-y-2">
                  <p className="text-xs text-slate-500">No starter prompt chips yet. Add custom prompts below or let AI generate them.</p>
                  <button
                    type="button"
                    onClick={handleAiGenerateStarterChips}
                    disabled={isGeneratingChips}
                    className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-xs disabled:opacity-50"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate 4 Starter Chips with AI</span>
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 mb-2">
                  {config.starterPrompts.map((prompt, index) => (
                    <div key={index} className="inline-flex items-center space-x-2 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700">
                      <span>{prompt}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveStarterPrompt(index)}
                        className="text-slate-400 hover:text-red-600 font-bold"
                        title="Remove chip"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={handleAddStarterPrompt} className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newPromptInput}
                  onChange={(e) => setNewPromptInput(e.target.value)}
                  placeholder="Add a custom starter suggestion prompt..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-semibold transition"
                >
                  Add Chip
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Right Col: Branding & Visuals */}
        <div className="space-y-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base">Visual Identity</h3>

            {/* Logo Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Custom Logo / Avatar Image</label>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                  {config.logoUrl ? (
                    <img src={config.logoUrl} alt="Logo Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-slate-400" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    <label className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-semibold transition inline-flex items-center space-x-1.5 shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Logo</span>
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    {config.logoUrl && (
                      <button
                        type="button"
                        onClick={() => handleInputChange('logoUrl', undefined)}
                        className="p-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition"
                        title="Remove Logo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">PNG, JPG, or SVG (Recommended 128x128px)</p>
                </div>
              </div>
            </div>

            {/* Icon Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Avatar Icon</label>
              <div className="grid grid-cols-3 gap-3">
                {icons.map((iconName) => {
                  const isSelected = config.icon === iconName;
                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => handleInputChange('icon', iconName)}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center space-y-1.5 transition ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-600 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {iconName === 'Terminal' && <Terminal className="w-5 h-5" />}
                      {iconName === 'GraduationCap' && <GraduationCap className="w-5 h-5" />}
                      {iconName === 'Sparkles' && <Sparkles className="w-5 h-5" />}
                      {iconName === 'Database' && <Database className="w-5 h-5" />}
                      {iconName === 'Code' && <Code className="w-5 h-5" />}
                      {iconName === 'Bot' && <Bot className="w-5 h-5" />}
                      <span className="text-[10px] font-medium">{iconName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Color Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">Theme Accent Color</label>
              <div className="grid grid-cols-3 gap-3">
                {colors.map((color) => {
                  const isSelected = config.themeColor === color;
                  const bgClass = {
                    indigo: 'bg-indigo-600',
                    emerald: 'bg-emerald-600',
                    violet: 'bg-violet-600',
                    amber: 'bg-amber-600',
                    rose: 'bg-rose-600',
                    cyan: 'bg-cyan-600',
                    slate: 'bg-slate-700'
                  }[color];

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleInputChange('themeColor', color)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between px-3 transition ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 shadow-xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`w-4 h-4 rounded-full ${bgClass}`}></div>
                        <span className="text-xs capitalize font-medium text-slate-700">{color}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl space-y-4">
            <h4 className="font-bold text-sm text-slate-200">🚀 Ready to Deploy</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your prompt bot exports as a clean, self-contained HTML file. Run it instantly on your computer or host for free on GitHub Pages.
            </p>
            <button
              onClick={onPreview}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-semibold transition shadow-md"
            >
              Test Live Chat Now
            </button>
          </div>

        </div>

      </div>

      {/* Lower Section: Try Presets */}
      <section id="try-presets-section" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                <LayoutTemplate className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">Try Presets</h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100">
                Instant Templates
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Want inspiration? Click any pre-configured expert prompt bot to load its system prompt, greeting, and chips.
            </p>
          </div>

          {onOpenPresetsModal && (
            <button
              type="button"
              onClick={onOpenPresetsModal}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition border border-slate-200/80 self-start sm:self-auto"
            >
              <span>Browse All 100+ Presets</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Featured Presets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PRESET_GEMS.slice(0, 6).map((preset) => (
            <div
              key={preset.id}
              className="group bg-slate-50/70 hover:bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md rounded-2xl p-5 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center group-hover:scale-105 transition flex-shrink-0">
                    {getPresetIcon(preset.icon)}
                  </div>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                    {preset.model}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                    {preset.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                {/* Quick starter chips preview */}
                {preset.starterPrompts && preset.starterPrompts.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-1">
                    {preset.starterPrompts.slice(0, 2).map((chip, i) => (
                      <span key={i} className="text-[10px] bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[200px]">
                        "{chip}"
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Ready to customize</span>
                <button
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 group-hover:translate-x-0.5 transition"
                >
                  <span>Load Preset</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

