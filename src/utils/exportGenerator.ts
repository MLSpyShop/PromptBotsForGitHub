import { GemConfig } from '../types';

export function generateStaticHtmlGem(config: GemConfig): string {
  const accentColors: Record<string, { accent: string; hover: string; rgb: string }> = {
    indigo: { accent: '#6366f1', hover: '#4f46e5', rgb: '99, 102, 241' },
    emerald: { accent: '#10b981', hover: '#059669', rgb: '16, 185, 129' },
    violet: { accent: '#8b5cf6', hover: '#7c3aed', rgb: '139, 92, 246' },
    amber: { accent: '#f59e0b', hover: '#d97706', rgb: '245, 158, 11' },
    rose: { accent: '#f43f5e', hover: '#e11d48', rgb: '244, 63, 94' },
    cyan: { accent: '#06b6d4', hover: '#0891b2', rgb: '6, 182, 212' },
    slate: { accent: '#64748b', hover: '#475569', rgb: '100, 116, 139' }
  };

  const selectedTheme = accentColors[config.themeColor] || accentColors.indigo;

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>${escapeHtml(config.name)} - Mobile AI Gem</title>
    <meta name="description" content="${escapeHtml(config.description)}">
    <!-- Marked for Markdown Rendering -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        :root {
            --bg-color: #0b0f19;
            --panel-bg: #1e293b;
            --card-bg: #111827;
            --text-color: #f8fafc;
            --text-muted: #94a3b8;
            --accent-color: ${selectedTheme.accent};
            --accent-hover: ${selectedTheme.hover};
            --accent-rgb: ${selectedTheme.rgb};
            --border-color: #334155;
            --error-color: #ef4444;
            --success-color: #10b981;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            -webkit-tap-highlight-color: transparent;
        }

        body {
            background-color: var(--bg-color);
            color: var(--text-color);
            display: flex;
            flex-direction: column;
            height: 100vh;
            height: 100dvh;
            overflow: hidden;
        }

        /* Header */
        header {
            background-color: var(--panel-bg);
            border-bottom: 1px solid var(--border-color);
            padding: 10px 16px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            z-index: 20;
        }

        .header-brand {
            display: flex;
            align-items: center;
            gap: 10px;
            min-width: 0;
        }

        .brand-avatar {
            width: 38px;
            height: 38px;
            border-radius: 10px;
            background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            flex-shrink: 0;
            font-size: 1.2rem;
            color: white;
            box-shadow: 0 4px 12px rgba(var(--accent-rgb), 0.3);
        }

        .brand-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .brand-info {
            display: flex;
            flex-direction: column;
            min-width: 0;
        }

        .brand-title {
            font-size: 0.95rem;
            font-weight: 700;
            color: var(--text-color);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .model-badge {
            font-size: 0.65rem;
            padding: 2px 6px;
            border-radius: 9999px;
            background: rgba(255,255,255,0.08);
            border: 1px solid var(--border-color);
            color: var(--text-muted);
            font-weight: 500;
        }

        .brand-desc {
            font-size: 0.72rem;
            color: var(--text-muted);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .header-actions {
            display: flex;
            gap: 4px;
            align-items: center;
            flex-shrink: 0;
        }

        .icon-btn {
            background: none;
            border: none;
            color: var(--text-muted);
            font-size: 1.15rem;
            cursor: pointer;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.2s;
        }

        .icon-btn:hover {
            color: var(--text-color);
            background: rgba(255,255,255,0.06);
        }

        .icon-btn.active {
            color: var(--accent-color);
        }

        /* Settings Drawer */
        .settings-drawer {
            background-color: var(--panel-bg);
            border-bottom: 1px solid var(--border-color);
            padding: 0 16px;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s;
            z-index: 15;
        }

        .settings-drawer.open {
            max-height: 480px;
            padding: 16px;
            overflow-y: auto;
        }

        .form-group {
            margin-bottom: 12px;
        }

        label {
            display: block;
            font-size: 0.75rem;
            color: var(--text-muted);
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-weight: 600;
        }

        input, select, textarea {
            width: 100%;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            color: var(--text-color);
            padding: 10px 12px;
            font-size: 14px;
            font-family: inherit;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: var(--accent-color);
        }

        .btn-primary {
            background: var(--accent-color);
            color: white;
            border: none;
            border-radius: 8px;
            padding: 12px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            width: 100%;
            text-align: center;
            transition: background 0.2s;
        }

        .btn-primary:hover, .btn-primary:active {
            background: var(--accent-hover);
        }

        .btn-secondary {
            background: rgba(255,255,255,0.06);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 10px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            margin-top: 8px;
        }

        .status-banner {
            background: rgba(239, 68, 68, 0.15);
            border: 1px solid var(--error-color);
            color: #fca5a5;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 0.8rem;
            margin-bottom: 12px;
            display: none;
        }

        .status-banner.success {
            background: rgba(16, 185, 129, 0.15);
            border-color: var(--success-color);
            color: #6ee7b7;
        }

        /* Toast notifications */
        .toast {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(17, 24, 39, 0.95);
            border: 1px solid var(--border-color);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            z-index: 50;
            pointer-events: none;
            box-shadow: 0 8px 24px rgba(0,0,0,0.5);
            opacity: 0;
            transition: opacity 0.2s, transform 0.2s;
        }
        .toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(-5px);
        }

        /* Main Chat */
        main {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }

        .chat-messages {
            flex: 1;
            padding: 16px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
            -webkit-overflow-scrolling: touch;
        }

        .message-row {
            display: flex;
            gap: 10px;
            max-width: 88%;
            align-items: flex-end;
        }

        .message-row.user {
            align-self: flex-end;
            flex-direction: row-reverse;
        }

        .message-row.bot {
            align-self: flex-start;
        }

        .msg-avatar {
            width: 28px;
            height: 28px;
            border-radius: 8px;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.85rem;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            overflow: hidden;
        }

        .msg-avatar img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .message-row.bot .msg-avatar {
            background: linear-gradient(135deg, var(--accent-color), var(--accent-hover));
            color: white;
            border: none;
        }

        .message {
            padding: 10px 14px;
            border-radius: 14px;
            line-height: 1.45;
            font-size: 0.92rem;
            word-break: break-word;
            position: relative;
        }

        .message.user {
            background-color: var(--accent-color);
            color: white;
            border-bottom-right-radius: 3px;
        }

        .message.bot {
            background-color: var(--panel-bg);
            border: 1px solid var(--border-color);
            color: var(--text-color);
            border-bottom-left-radius: 3px;
        }

        /* Markdown Styling inside Bot Messages */
        .markdown-body p { margin-bottom: 0.6rem; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body ul, .markdown-body ol { padding-left: 1.4rem; margin-bottom: 0.6rem; }
        .markdown-body code {
            background: rgba(0,0,0,0.3);
            padding: 2px 5px;
            border-radius: 4px;
            font-size: 0.85em;
            font-family: monospace;
        }
        .markdown-body pre {
            background: #0d1117;
            padding: 10px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 6px 0;
            border: 1px solid var(--border-color);
        }
        .markdown-body pre code { background: transparent; padding: 0; }
        .markdown-body blockquote {
            border-left: 3px solid var(--accent-color);
            padding-left: 8px;
            opacity: 0.85;
            margin: 6px 0;
        }

        /* Attachment pill */
        .attachment-pill {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.15);
            padding: 4px 8px;
            border-radius: 6px;
            font-size: 0.75rem;
            margin-bottom: 6px;
        }

        .attachment-thumbnail {
            width: 32px;
            height: 32px;
            border-radius: 4px;
            object-fit: cover;
        }

        /* Starter Chips */
        .starter-chips-container {
            display: flex;
            gap: 8px;
            overflow-x: auto;
            padding: 6px 16px 10px;
            scrollbar-width: none;
            -webkit-overflow-scrolling: touch;
        }
        .starter-chips-container::-webkit-scrollbar { display: none; }

        .starter-chip {
            background: rgba(30, 41, 59, 0.8);
            border: 1px solid var(--border-color);
            color: var(--text-muted);
            padding: 6px 12px;
            border-radius: 9999px;
            font-size: 0.78rem;
            white-space: nowrap;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        .starter-chip:hover {
            border-color: var(--accent-color);
            color: var(--text-color);
            background: var(--panel-bg);
        }

        /* Input Area */
        .chat-input-area {
            padding: 8px 12px;
            background-color: var(--panel-bg);
            border-top: 1px solid var(--border-color);
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding-bottom: calc(8px + env(safe-area-inset-bottom));
        }

        .file-preview-bar {
            display: none;
            align-items: center;
            justify-content: space-between;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 0.75rem;
            color: var(--text-color);
        }

        .file-preview-bar.active {
            display: flex;
        }

        .input-row {
            display: flex;
            gap: 6px;
            align-items: flex-end;
        }

        .chat-input-area textarea {
            resize: none;
            height: 44px;
            max-height: 120px;
            line-height: 1.35;
            flex: 1;
            padding: 11px 12px;
            font-size: 15px;
        }

        .icon-action-btn {
            width: 44px;
            height: 44px;
            flex-shrink: 0;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            color: var(--text-color);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.15rem;
            cursor: pointer;
            transition: border-color 0.2s;
        }

        .icon-action-btn:hover {
            border-color: var(--accent-color);
        }

        .chat-input-area button.send-btn {
            width: 52px;
            height: 44px;
            flex-shrink: 0;
            background: var(--accent-color);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 0.9rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .chat-input-area button.send-btn:active {
            background: var(--accent-hover);
        }

        #fileInput { display: none; }

        /* Typing dots animation */
        .typing-indicator {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
        }
        .typing-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--accent-color);
            animation: bounce 1.4s infinite ease-in-out both;
        }
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    </style>
</head>
<body>

    <!-- Header with quick mobile actions -->
    <header>
        <div class="header-brand">
            <div class="brand-avatar" id="headerAvatar">
                ${config.logoUrl ? `<img src="${config.logoUrl}" alt="Logo">` : (config.icon === 'Terminal' ? '💻' : config.icon === 'GraduationCap' ? '🎓' : config.icon === 'Sparkles' ? '✨' : config.icon === 'Database' ? '🗄️' : config.icon === 'Briefcase' ? '💼' : config.icon === 'ShieldAlert' ? '🛡️' : '🤖')}
            </div>
            <div class="brand-info">
                <div class="brand-title">
                    <span id="displayBotName">${escapeHtml(config.name)}</span>
                    <span class="model-badge" id="displayModelBadge">${escapeHtml(config.model)}</span>
                </div>
                <div class="brand-desc" id="displayBotDesc">${escapeHtml(config.description)}</div>
            </div>
        </div>

        <div class="header-actions">
            <button class="icon-btn" id="shareBtn" title="Share Bot or Link">🔗</button>
            <button class="icon-btn" id="exportChatBtn" title="Export Conversation">📥</button>
            <button class="icon-btn" id="clearChatBtn" title="Clear History">🗑️</button>
            <button class="icon-btn" id="toggleSettings" title="Settings">⚙️</button>
        </div>
    </header>

    <!-- Slide-down Settings Drawer -->
    <div class="settings-drawer" id="settingsDrawer">
        <div id="statusBanner" class="status-banner"></div>

        <div class="form-group">
            <label for="inputProvider">AI Provider & Engine</label>
            <select id="inputProvider" onchange="handleProviderChange()">
                <option value="openrouter" ${config.provider === 'openrouter' ? 'selected' : ''}>OpenRouter (Free Open-Source Models)</option>
                <option value="gemini" ${config.provider !== 'openrouter' ? 'selected' : ''}>Google Gemini API</option>
            </select>
        </div>

        <div class="form-group" id="geminiKeyGroup">
            <label for="inputApiKey">Gemini API Key</label>
            <input type="password" id="inputApiKey" placeholder="AIzaSy..." autocomplete="off">
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; display: flex; justify-content: space-between;">
                <span>Saved locally in browser</span>
                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener" style="color: var(--accent-color); text-decoration: none;">Get Free Key ↗</a>
            </div>
        </div>

        <div class="form-group" id="openRouterKeyGroup" style="display: none;">
            <label for="inputOpenRouterKey">OpenRouter API Key</label>
            <input type="password" id="inputOpenRouterKey" placeholder="sk-or-v1-..." autocomplete="off">
            <div style="font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; display: flex; justify-content: space-between;">
                <span>Saved locally in browser</span>
                <a href="https://openrouter.ai/keys" target="_blank" rel="noopener" style="color: var(--accent-color); text-decoration: none;">Get OpenRouter Key ↗</a>
            </div>
        </div>

        <div class="form-group" id="geminiModelGroup">
            <label for="inputModel">Gemini Model</label>
            <select id="inputModel">
                <option value="gemini-2.5-flash" selected>gemini-2.5-flash (Free Tier & Fast)</option>
                <option value="gemini-3.8-flash">gemini-3.8-flash (Latest Intelligence)</option>
                <option value="gemini-3.1-flash-lite">gemini-3.1-flash-lite (Lightweight & Quick)</option>
                <option value="gemini-3.1-pro-preview">gemini-3.1-pro-preview (Advanced Reasoning)</option>
            </select>
        </div>

        <div class="form-group" id="openRouterModelGroup" style="display: none;">
            <label for="inputOpenRouterModel">OpenRouter Free Model</label>
            <select id="inputOpenRouterModel">
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

        <div class="form-group">
            <label for="inputPrompt">System Instructions (Prompt)</label>
            <textarea id="inputPrompt" rows="4">${escapeHtml(config.systemInstruction)}</textarea>
        </div>

        <button class="btn-primary" id="saveConfigBtn">Save Configuration</button>
        <button class="btn-secondary" id="copyShareableUrlBtn">🔗 Copy Shareable URL with this Persona</button>
    </div>

    <!-- Main Chat Workspace -->
    <main>
        <div class="chat-messages" id="chatMessages"></div>

        <!-- Quick Starter Chips -->
        ${config.starterPrompts && config.starterPrompts.length > 0 ? `
        <div class="starter-chips-container" id="starterChips">
            ${config.starterPrompts.map(prompt => `
                <div class="starter-chip" onclick="sendStarter('${escapeAttribute(prompt)}')">
                    <span>✨</span>
                    <span>${escapeHtml(prompt)}</span>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Chat Input Bar -->
        <div class="chat-input-area">
            <div id="filePreviewBar" class="file-preview-bar">
                <div style="display: flex; align-items: center; gap: 6px;">
                    <span id="fileIcon">📎</span>
                    <span id="fileName" style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
                </div>
                <span style="cursor: pointer; padding: 2px 6px; color: #ef4444; font-weight: bold;" onclick="removeAttachment()">✕</span>
            </div>

            <div class="input-row">
                <input type="file" id="fileInput" accept="image/*,.pdf,.txt,.csv,.json,.md">
                <button class="icon-action-btn" id="attachBtn" title="Attach image or document">📎</button>
                <textarea id="userMessage" rows="1" placeholder="Message ${escapeHtml(config.name)}..." onkeydown="handleInputKeydown(event)" oninput="autoGrow(this)"></textarea>
                <button class="send-btn" id="sendBtn">➤</button>
            </div>
        </div>
    </main>

    <div class="toast" id="toastNotice"></div>

    <script>
        const GEM_DEFAULTS = {
            id: ${JSON.stringify(config.id || 'custom-gem')},
            name: ${JSON.stringify(config.name)},
            description: ${JSON.stringify(config.description)},
            systemPrompt: ${JSON.stringify(config.systemInstruction)},
            provider: ${JSON.stringify(config.provider || 'gemini')},
            model: ${JSON.stringify(config.model || 'gemini-3.8-flash')},
            openRouterModel: ${JSON.stringify(config.openRouterModel || 'deepseek/deepseek-r1:free')},
            welcomeMessage: ${JSON.stringify(config.welcomeMessage || 'Hello! How can I assist you today?')}
        };

        const STORAGE_KEYS = {
            API_KEY: 'gemini_api_key',
            OPENROUTER_API_KEY: 'openrouter_api_key',
            CONFIG: 'gem_config_' + GEM_DEFAULTS.id,
            HISTORY: 'gem_history_' + GEM_DEFAULTS.id
        };

        // Check if URL hash contains a shared configuration
        function checkUrlHashConfig() {
            if (window.location.hash.startsWith('#gem=')) {
                try {
                    const encoded = window.location.hash.substring(5);
                    const decoded = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(encoded)))));
                    if (decoded && decoded.name) {
                        return decoded;
                    }
                } catch (e) {
                    console.warn('Could not parse shared gem hash', e);
                }
            }
            return null;
        }

        const sharedConfig = checkUrlHashConfig();

        let botConfig = {
            provider: (sharedConfig && sharedConfig.provider) || localStorage.getItem(STORAGE_KEYS.CONFIG + '_provider') || GEM_DEFAULTS.provider,
            apiKey: localStorage.getItem(STORAGE_KEYS.API_KEY) || "",
            openRouterApiKey: localStorage.getItem(STORAGE_KEYS.OPENROUTER_API_KEY) || "",
            model: (sharedConfig && sharedConfig.model) || localStorage.getItem(STORAGE_KEYS.CONFIG + '_model') || GEM_DEFAULTS.model,
            openRouterModel: (sharedConfig && sharedConfig.openRouterModel) || localStorage.getItem(STORAGE_KEYS.CONFIG + '_or_model') || GEM_DEFAULTS.openRouterModel,
            systemPrompt: (sharedConfig && sharedConfig.systemPrompt) || localStorage.getItem(STORAGE_KEYS.CONFIG + '_prompt') || GEM_DEFAULTS.systemPrompt,
            name: (sharedConfig && sharedConfig.name) || GEM_DEFAULTS.name,
            description: (sharedConfig && sharedConfig.description) || GEM_DEFAULTS.description
        };

        function handleProviderChange() {
            const provider = document.getElementById('inputProvider').value;
            const isOR = provider === 'openrouter';
            document.getElementById('geminiKeyGroup').style.display = isOR ? 'none' : 'block';
            document.getElementById('openRouterKeyGroup').style.display = isOR ? 'block' : 'none';
            document.getElementById('geminiModelGroup').style.display = isOR ? 'none' : 'block';
            document.getElementById('openRouterModelGroup').style.display = isOR ? 'block' : 'none';
        }

        // Multi-turn conversation memory
        let conversationHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.HISTORY)) || [];
        let attachedFile = null;

        // Dom Elements
        const drawer = document.getElementById('settingsDrawer');
        const chatContainer = document.getElementById('chatMessages');
        const fileInput = document.getElementById('fileInput');
        const previewBar = document.getElementById('filePreviewBar');

        // Init UI inputs
        document.getElementById('inputProvider').value = botConfig.provider;
        document.getElementById('inputApiKey').value = botConfig.apiKey;
        document.getElementById('inputOpenRouterKey').value = botConfig.openRouterApiKey;
        document.getElementById('inputModel').value = botConfig.model;
        document.getElementById('inputOpenRouterModel').value = botConfig.openRouterModel;
        document.getElementById('inputPrompt').value = botConfig.systemPrompt;
        document.getElementById('displayBotName').textContent = botConfig.name;
        document.getElementById('displayBotDesc').textContent = botConfig.description;
        document.getElementById('displayModelBadge').textContent = botConfig.provider === 'openrouter' ? botConfig.openRouterModel : botConfig.model;

        handleProviderChange();

        // Render Conversation History
        function renderHistory() {
            chatContainer.innerHTML = '';
            
            // If no history, show welcome message
            if (conversationHistory.length === 0) {
                appendBotBubble(GEM_DEFAULTS.welcomeMessage);
                return;
            }

            conversationHistory.forEach(turn => {
                appendUserBubble(turn.userText, turn.attachment);
                appendBotBubble(turn.botText);
            });
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        renderHistory();

        // Check if API key is missing on boot
        const currentKey = botConfig.provider === 'openrouter' ? botConfig.openRouterApiKey : botConfig.apiKey;
        if (!currentKey) {
            setTimeout(() => {
                drawer.classList.add('open');
                showStatus("Please enter your " + (botConfig.provider === 'openrouter' ? "OpenRouter" : "Gemini") + " API Key to begin.", false);
            }, 400);
        }

        // Toggle Drawer
        document.getElementById('toggleSettings').addEventListener('click', () => {
            drawer.classList.toggle('open');
        });

        // Save Configuration
        document.getElementById('saveConfigBtn').addEventListener('click', () => {
            botConfig.provider = document.getElementById('inputProvider').value;
            botConfig.apiKey = document.getElementById('inputApiKey').value.trim();
            botConfig.openRouterApiKey = document.getElementById('inputOpenRouterKey').value.trim();
            botConfig.model = document.getElementById('inputModel').value;
            botConfig.openRouterModel = document.getElementById('inputOpenRouterModel').value;
            botConfig.systemPrompt = document.getElementById('inputPrompt').value.trim();

            localStorage.setItem(STORAGE_KEYS.API_KEY, botConfig.apiKey);
            localStorage.setItem(STORAGE_KEYS.OPENROUTER_API_KEY, botConfig.openRouterApiKey);
            localStorage.setItem(STORAGE_KEYS.CONFIG + '_provider', botConfig.provider);
            localStorage.setItem(STORAGE_KEYS.CONFIG + '_model', botConfig.model);
            localStorage.setItem(STORAGE_KEYS.CONFIG + '_or_model', botConfig.openRouterModel);
            localStorage.setItem(STORAGE_KEYS.CONFIG + '_prompt', botConfig.systemPrompt);

            document.getElementById('displayModelBadge').textContent = botConfig.provider === 'openrouter' ? botConfig.openRouterModel : botConfig.model;

            showStatus("Configuration saved successfully!", true);
            setTimeout(() => { drawer.classList.remove('open'); }, 700);
        });

        // Clear Chat History
        document.getElementById('clearChatBtn').addEventListener('click', () => {
            if (confirm("Clear all conversation history?")) {
                conversationHistory = [];
                localStorage.removeItem(STORAGE_KEYS.HISTORY);
                renderHistory();
                showToast("Chat history cleared");
            }
        });

        // Export Conversation Transcript
        document.getElementById('exportChatBtn').addEventListener('click', () => {
            if (conversationHistory.length === 0) {
                showToast("No conversation to export yet!");
                return;
            }

            let markdown = \`# \${botConfig.name} - Chat Transcript\\nDate: \${new Date().toLocaleString()}\\n\\n\`;
            conversationHistory.forEach((turn, idx) => {
                markdown += \`### Turn \${idx + 1}\\n**User:** \${turn.userText}\\n\`;
                if (turn.attachment) {
                    markdown += \`*[Attached: \${turn.attachment.name}]*\\n\`;
                }
                markdown += \`\\n**\${botConfig.name}:**\\n\${turn.botText}\\n\\n---\\n\\n\`;
            });

            const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`\${botConfig.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-chat.md\`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast("Conversation exported as Markdown");
        });

        // Shareability: Share Gem Link / Web Share API
        async function shareGem() {
            const payload = {
                name: botConfig.name,
                description: botConfig.description,
                systemPrompt: botConfig.systemPrompt,
                model: botConfig.model
            };
            const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
            const shareUrl = window.location.origin + window.location.pathname + '#gem=' + encoded;

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: botConfig.name,
                        text: \`Chat with \${botConfig.name} on GeminiForge\`,
                        url: shareUrl
                    });
                    return;
                } catch (e) {
                    // fall through to clipboard copy
                }
            }

            navigator.clipboard.writeText(shareUrl);
            showToast("🔗 Shareable Gem link copied to clipboard!");
        }

        document.getElementById('shareBtn').addEventListener('click', shareGem);
        document.getElementById('copyShareableUrlBtn').addEventListener('click', shareGem);

        // File attachment handling
        document.getElementById('attachBtn').addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(uploadEvent) {
                attachedFile = {
                    name: file.name,
                    mimeType: file.type || 'application/octet-stream',
                    data: uploadEvent.target.result.split(',')[1],
                    isImage: file.type.startsWith('image/')
                };

                document.getElementById('fileName').textContent = file.name;
                document.getElementById('fileIcon').textContent = attachedFile.isImage ? '🖼️' : '📄';
                previewBar.classList.add('active');
            };
            reader.readAsDataURL(file);
        });

        window.removeAttachment = function() {
            attachedFile = null;
            fileInput.value = '';
            previewBar.classList.remove('active');
        };

        // Send message event handlers
        document.getElementById('sendBtn').addEventListener('click', () => sendMessage());

        function handleInputKeydown(event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        }

        function sendStarter(text) {
            document.getElementById('userMessage').value = text;
            sendMessage();
        }

        function autoGrow(textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }

        // Multi-turn Gemini API interaction
        async function sendMessage() {
            const textInput = document.getElementById('userMessage');
            const text = textInput.value.trim();
            if (!text && !attachedFile) return;

            const isOR = botConfig.provider === 'openrouter';
            const activeKey = isOR ? botConfig.openRouterApiKey : botConfig.apiKey;

            if (!activeKey) {
                drawer.classList.add('open');
                showStatus("Please enter your " + (isOR ? "OpenRouter" : "Gemini") + " API Key first.", false);
                return;
            }

            // Hide starter chips after first prompt
            const chips = document.getElementById('starterChips');
            if (chips) chips.style.display = 'none';

            const userText = text;
            const fileToSend = attachedFile;

            // Clear input & preview
            textInput.value = '';
            textInput.style.height = '44px';
            removeAttachment();

            // Append user bubble to UI
            appendUserBubble(userText, fileToSend);

            // Append placeholder bot bubble with typing indicator
            const botMsgId = 'bot-msg-' + Date.now();
            appendBotBubble('', botMsgId, true);
            const botElement = document.getElementById(botMsgId);

            try {
                let fullResponse = '';

                if (isOR) {
                    // OpenRouter Chat Completion payload
                    const messages = [];
                    if (botConfig.systemPrompt) {
                        messages.push({ role: 'system', content: botConfig.systemPrompt });
                    }
                    conversationHistory.forEach(turn => {
                        messages.push({ role: 'user', content: turn.userText || '' });
                        messages.push({ role: 'assistant', content: turn.botText || '' });
                    });
                    
                    let userMsgContent = userText;
                    if (fileToSend && fileToSend.isImage && fileToSend.data) {
                        userMsgContent = [
                            { type: 'text', text: userText || 'Analyze this image.' },
                            { type: 'image_url', image_url: { url: 'data:' + fileToSend.mimeType + ';base64,' + fileToSend.data } }
                        ];
                    }
                    messages.push({ role: 'user', content: userMsgContent });

                    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + botConfig.openRouterApiKey,
                            'HTTP-Referer': window.location.origin || 'https://openrouter.ai',
                            'X-Title': 'PromptBots for GitHub'
                        },
                        body: JSON.stringify({
                            model: botConfig.openRouterModel,
                            messages: messages,
                            stream: true
                        })
                    });

                    if (!response.ok) {
                        const errData = await response.json().catch(() => ({}));
                        throw new Error(errData.error?.message || 'OpenRouter returned status ' + response.status);
                    }

                    botElement.innerHTML = '';
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let buffer = '';

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\\n');
                        buffer = lines.pop();

                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (!trimmed || trimmed.startsWith(':')) continue;
                            if (trimmed.startsWith('data:')) {
                                const dataStr = trimmed.substring(5).trim();
                                if (dataStr === '[DONE]') continue;
                                try {
                                    const parsed = JSON.parse(dataStr);
                                    const chunkText = parsed.choices?.[0]?.delta?.content || '';
                                    fullResponse += chunkText;
                                    botElement.innerHTML = marked.parse(fullResponse);
                                    chatContainer.scrollTop = chatContainer.scrollHeight;
                                } catch (e) {}
                            }
                        }
                    }

                } else {
                    // Google Gemini API payload
                    const contents = [];
                    conversationHistory.forEach(turn => {
                        const userParts = [{ text: turn.userText || " " }];
                        if (turn.attachment && turn.attachment.data) {
                            userParts.push({
                                inline_data: {
                                    mime_type: turn.attachment.mimeType,
                                    data: turn.attachment.data
                                }
                            });
                        }
                        contents.push({ role: 'user', parts: userParts });
                        contents.push({ role: 'model', parts: [{ text: turn.botText || " " }] });
                    });

                    const currentParts = [{ text: userText || "Analyze this attached file." }];
                    if (fileToSend && fileToSend.data) {
                        currentParts.push({
                            inline_data: {
                                mime_type: fileToSend.mimeType,
                                data: fileToSend.data
                            }
                        });
                    }
                    contents.push({ role: 'user', parts: currentParts });

                    const endpoint = \`https://generativelanguage.googleapis.com/v1beta/models/\${botConfig.model}:streamGenerateContent?key=\${botConfig.apiKey}&alt=sse\`;

                    const response = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            system_instruction: { parts: [{ text: botConfig.systemPrompt }] },
                            contents: contents,
                            generationConfig: {
                                temperature: 0.7
                            }
                        })
                    });

                    if (!response.ok) {
                        const errData = await response.json();
                        throw new Error(errData.error?.message || \`API returned status \${response.status}\`);
                    }

                    botElement.innerHTML = ''; // clear typing indicator
                    let fullResponse = '';

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
                    let buffer = '';

                    while (true) {
                        const { value, done } = await reader.read();
                        if (done) break;

                        buffer += decoder.decode(value, { stream: true });
                        const lines = buffer.split('\\n');
                        buffer = lines.pop(); // save incomplete line

                        for (const line of lines) {
                            const trimmed = line.trim();
                            if (!trimmed || trimmed.startsWith(':')) continue;
                            if (trimmed.startsWith('data:')) {
                                const jsonStr = trimmed.substring(5).trim();
                                try {
                                    const parsed = JSON.parse(jsonStr);
                                    const chunkText = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
                                    fullResponse += chunkText;
                                    botElement.innerHTML = marked.parse(fullResponse);
                                    chatContainer.scrollTop = chatContainer.scrollHeight;
                                } catch (e) {}
                            }
                        }
                    }
                }

                if (!fullResponse) {
                    botElement.innerHTML = "<em>(Empty response received)</em>";
                } else {
                    // Record in persistent history
                    conversationHistory.push({
                        userText: userText,
                        attachment: fileToSend ? { name: fileToSend.name, mimeType: fileToSend.mimeType } : null,
                        botText: fullResponse
                    });
                    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(conversationHistory));
                }

            } catch (err) {
                botElement.innerHTML = \`<span style="color: var(--error-color);">⚠️ <strong>Error:</strong> \${escapeHtml(err.message)}</span>\`;
            }

            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function appendUserBubble(text, attachment) {
            const row = document.createElement('div');
            row.className = 'message-row user';

            let contentHtml = '';
            if (attachment) {
                contentHtml += \`<div class="attachment-pill">📎 \${escapeHtml(attachment.name)}</div>\`;
            }
            if (text) {
                contentHtml += \`<div>\${escapeHtml(text)}</div>\`;
            }

            row.innerHTML = \`
                <div class="msg-avatar">👤</div>
                <div class="message user">\${contentHtml}</div>
            \`;
            chatContainer.appendChild(row);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function appendBotBubble(markdownText, customId = null, isTyping = false) {
            const row = document.createElement('div');
            row.className = 'message-row bot';

            const avatarHtml = document.getElementById('headerAvatar').innerHTML;
            const innerContent = isTyping
                ? \`<div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div>\`
                : marked.parse(markdownText || '');

            row.innerHTML = \`
                <div class="msg-avatar">\${avatarHtml}</div>
                <div class="message bot markdown-body" \${customId ? \`id="\${customId}"\` : ''}>\${innerContent}</div>
            \`;
            chatContainer.appendChild(row);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function showStatus(msg, isSuccess = false) {
            const banner = document.getElementById('statusBanner');
            banner.textContent = msg;
            banner.className = isSuccess ? 'status-banner success' : 'status-banner';
            banner.style.display = 'block';
            setTimeout(() => { banner.style.display = 'none'; }, 4000);
        }

        function showToast(msg) {
            const toast = document.getElementById('toastNotice');
            toast.textContent = msg;
            toast.classList.add('show');
            setTimeout(() => { toast.classList.remove('show'); }, 2500);
        }

        function escapeHtml(str) {
            return String(str || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }

        function escapeAttribute(str) {
            return String(str || '').replace(/"/g, '&quot;');
        }
    </script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttribute(str: string): string {
  return String(str || '').replace(/"/g, '&quot;');
}
