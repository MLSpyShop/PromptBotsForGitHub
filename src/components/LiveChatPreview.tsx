import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RotateCcw, Sparkles, Terminal, GraduationCap, Database, Code, ShieldCheck, Paperclip, X, Download, Share2, Check, FileText } from 'lucide-react';
import { GemConfig } from '../types';

interface LiveChatPreviewProps {
  config: GemConfig;
}

interface AttachedFile {
  name: string;
  mimeType: string;
  data: string;
  isImage: boolean;
}

interface Message {
  role: 'user' | 'model';
  content: string;
  attachment?: {
    name: string;
    mimeType: string;
  };
}

export function LiveChatPreview({ config }: LiveChatPreviewProps) {
  const getInitialGreeting = () => config.welcomeMessage?.trim() || "Hello! What can I assist you with today?";

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: getInitialGreeting() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState<AttachedFile | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length <= 1) {
      setMessages([{ role: 'model', content: getInitialGreeting() }]);
    }
  }, [config.welcomeMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setAttachedFile({
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          data: result.split(',')[1],
          isImage: file.type.startsWith('image/')
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if ((!text.trim() && !attachedFile) || isLoading) return;

    const currentAttachment = attachedFile;
    setAttachedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    const newMessages: Message[] = [
      ...messages,
      {
        role: 'user',
        content: text || (currentAttachment ? `Analyze ${currentAttachment.name}` : ''),
        attachment: currentAttachment ? { name: currentAttachment.name, mimeType: currentAttachment.mimeType } : undefined
      }
    ];

    setMessages(newMessages);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      let replyText = '';
      try {
        const res = await fetch('/api/chat-preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: config.systemInstruction,
            messages: newMessages,
            model: config.model,
            provider: config.provider,
            openRouterModel: config.openRouterModel,
            openRouterApiKey: localStorage.getItem('openrouter_api_key'),
            attachment: currentAttachment
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          replyText = data.reply;
        } else {
          throw new Error(`API server returned ${res.status}`);
        }
      } catch (serverErr) {
        // Fallback for static hosting (e.g. GitHub Pages without Express backend)
        const clientApiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
        if (clientApiKey) {
          const contents = newMessages.map(m => {
            const parts: any[] = [{ text: m.content || " " }];
            return {
              role: m.role === 'user' ? 'user' : 'model',
              parts
            };
          });

          const directRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-3.8-flash'}:generateContent?key=${clientApiKey}`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                system_instruction: { parts: [{ text: config.systemInstruction }] },
                contents
              })
            }
          );

          if (!directRes.ok) {
            const errJson = await directRes.json();
            throw new Error(errJson.error?.message || `Gemini API returned ${directRes.status}`);
          }
          const directData = await directRes.json();
          replyText = directData.candidates?.[0]?.content?.parts?.[0]?.text || "I am ready to help!";
        } else {
          throw serverErr;
        }
      }

      setMessages([...newMessages, { role: 'model', content: replyText }]);
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages([...newMessages, { role: 'model', content: '⚠️ Error: ' + (error.message || 'Failed to generate response') }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([{ role: 'model', content: config.welcomeMessage }]);
    setAttachedFile(null);
  };

  const handleExportChat = () => {
    if (messages.length <= 1) return;
    let markdown = `# ${config.name} - Chat Transcript\nDate: ${new Date().toLocaleString()}\n\n`;
    messages.slice(1).forEach((m, idx) => {
      if (m.role === 'user') {
        markdown += `### Turn ${Math.floor(idx / 2) + 1}\n**User:** ${m.content}\n`;
        if (m.attachment) markdown += `*[Attached: ${m.attachment.name}]*\n`;
      } else {
        markdown += `\n**${config.name}:**\n${m.content}\n\n---\n\n`;
      }
    });

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-preview.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShareLink = async () => {
    const payload = {
      name: config.name,
      description: config.description,
      systemPrompt: config.systemInstruction,
      model: config.model
    };
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(payload)))));
    const shareUrl = `${window.location.origin}${window.location.pathname}#gem=${encoded}`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const renderBotAvatar = (sizeClasses = "w-5 h-5") => {
    if (config.logoUrl) {
      return <img src={config.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />;
    }
    switch (config.icon) {
      case 'Terminal': return <Terminal className={`${sizeClasses} text-white`} />;
      case 'GraduationCap': return <GraduationCap className={`${sizeClasses} text-white`} />;
      case 'Sparkles': return <Sparkles className={`${sizeClasses} text-white`} />;
      case 'Database': return <Database className={`${sizeClasses} text-white`} />;
      case 'Code': return <Code className={`${sizeClasses} text-white`} />;
      default: return <Bot className={`${sizeClasses} text-white`} />;
    }
  };

  const themeBg = {
    indigo: 'from-indigo-600 to-indigo-700',
    emerald: 'from-emerald-600 to-emerald-700',
    violet: 'from-violet-600 to-violet-700',
    amber: 'from-amber-600 to-amber-700',
    rose: 'from-rose-600 to-rose-700',
    cyan: 'from-cyan-600 to-cyan-700',
    slate: 'from-slate-700 to-slate-800'
  }[config.themeColor] || 'from-indigo-600 to-indigo-700';

  const themeText = {
    indigo: 'text-indigo-600',
    emerald: 'text-emerald-600',
    violet: 'text-violet-600',
    amber: 'text-amber-600',
    rose: 'text-rose-600',
    cyan: 'text-cyan-600',
    slate: 'text-slate-700'
  }[config.themeColor] || 'text-indigo-600';

  return (
    <div className="max-w-3xl mx-auto space-y-4 pb-12">
      
      {/* Simulation Notice & Action Bar */}
      <div className="bg-indigo-50/90 border border-indigo-100 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-indigo-900">Multi-Turn Sandbox & File Preview</h4>
            <p className="text-[11px] text-indigo-700">Test attachments, streaming responses, and shareability.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={handleShareLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 transition shadow-xs"
            title="Copy Shareable Persona Link"
          >
            {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copiedShare ? 'Copied!' : 'Share Bot'}</span>
          </button>
          <button
            onClick={handleExportChat}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-indigo-50 text-slate-700 border border-slate-200 transition shadow-xs"
            title="Download Chat Transcript"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Export</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-red-50 text-red-600 border border-red-200 transition shadow-xs"
            title="Reset Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Chat Frame */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden flex flex-col h-[650px]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${themeBg} flex items-center justify-center shadow-md overflow-hidden`}>
              {renderBotAvatar("w-5 h-5")}
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                {config.name || 'Untitled Bot'}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal border border-slate-700">
                  {config.provider === 'openrouter' ? (config.openRouterModel?.split('/')?.[1] || config.openRouterModel) : config.model}
                </span>
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">{config.description || 'No description provided'}</p>
            </div>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/50">
          {messages.map((m, i) => {
            const isUser = m.role === 'user';
            return (
              <div key={i} className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden ${
                  isUser ? 'bg-slate-800 text-white' : `bg-gradient-to-tr ${themeBg} text-white`
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : renderBotAvatar("w-4 h-4")}
                </div>
                <div className={`rounded-2xl px-4 py-3 max-w-[85%] text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-800'
                }`}>
                  {m.attachment && (
                    <div className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-xs font-mono border border-white/20">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>{m.attachment.name}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{m.content}</div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${themeBg} text-white flex items-center justify-center shadow-sm animate-pulse overflow-hidden`}>
                {renderBotAvatar("w-4 h-4")}
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Starter Chips */}
        {config.starterPrompts && config.starterPrompts.length > 0 && messages.length <= 1 && (
          <div className="px-4 sm:px-6 py-2 bg-white border-t border-slate-100 flex flex-wrap gap-2">
            {config.starterPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition flex items-center gap-1.5 font-medium border border-slate-200/80"
              >
                <Sparkles className={`w-3 h-3 ${themeText}`} />
                <span>{prompt}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input Footer */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 space-y-2">
          {/* File attachment preview */}
          {attachedFile && (
            <div className="flex items-center justify-between bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-700">
              <div className="flex items-center space-x-2 truncate">
                <FileText className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <span className="truncate font-medium">{attachedFile.name}</span>
                <span className="text-[10px] text-slate-400">({attachedFile.mimeType})</span>
              </div>
              <button
                onClick={() => {
                  setAttachedFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="p-1 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-red-500 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf,.txt,.csv,.json,.md"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 transition"
              title="Attach File or Image"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message ${config.name || 'Gem'}...`}
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
            />
            <button
              type="submit"
              disabled={isLoading || (!input.trim() && !attachedFile)}
              className={`px-4 sm:px-5 py-3 rounded-xl bg-gradient-to-tr ${themeBg} text-white font-semibold text-sm shadow-md hover:opacity-90 transition disabled:opacity-50 flex items-center space-x-1.5`}
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
