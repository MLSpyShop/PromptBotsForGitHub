import React, { useState } from 'react';
import { Download, Copy, Check, Terminal, ExternalLink, Globe, Shield, Code, Sparkles, HelpCircle, ArrowRight, Laptop, FolderGit2, CheckCircle2, AlertTriangle, Key } from 'lucide-react';
import { GemConfig } from '../types';
import { generateStaticHtmlGem } from '../utils/exportGenerator';

interface ExportViewProps {
  config: GemConfig;
}

export function ExportView({ config }: ExportViewProps) {
  const [copied, setCopied] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedLiveUrl, setCopiedLiveUrl] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'download' | 'guide' | 'code'>('guide');
  const [guideMethod, setGuideMethod] = useState<'web' | 'terminal' | 'gh-cli'>('web');
  const [githubUser, setGithubUser] = useState('');

  const htmlContent = generateStaticHtmlGem(config);
  const repoName = (config.name ? config.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'my-prompt-bot').replace(/-+/g, '-').replace(/^-|-$/g, '') || 'my-prompt-bot';
  const liveUrl = `https://${githubUser ? githubUser.trim() : '<your-github-username>'}.github.io/${repoName}/`;

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'index.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyLiveUrl = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopiedLiveUrl(true);
    setTimeout(() => setCopiedLiveUrl(false), 2500);
  };

  const terminalScript = `# 1. Create a unique folder for your bot
mkdir ${repoName} && cd ${repoName}

# 2. Move your downloaded index.html here (or save the file in this folder)
# 3. Create .nojekyll to ensure GitHub Pages serves static files correctly
touch .nojekyll

# 4. Initialize git and commit
git init
git add index.html .nojekyll
git commit -m "Deploy ${config.name || 'PromptBot'} to GitHub Pages"
git branch -M main

# 5. Connect to your unique GitHub repository & push
git remote add origin https://github.com/${githubUser ? githubUser.trim() : '<your-github-username>'}/${repoName}.git
git push -u origin main`;

  const handleCopyScript = () => {
    navigator.clipboard.writeText(terminalScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <Globe className="w-3.5 h-3.5" />
            <span>Standalone index.html • Free GitHub Pages Hosting</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Export & Deploy to GitHub Pages</h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
            Export your prompt bot as a standalone <code className="text-emerald-300 font-mono">index.html</code>. Upload it to a unique GitHub repository for 100% free, permanent public hosting.
          </p>
        </div>
        
        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={handleDownload}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Download index.html</span>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-center shadow-xs space-y-1">
          <div className="text-xl">🌐</div>
          <div className="font-bold text-xs text-slate-800">100% Free Hosting</div>
          <div className="text-[11px] text-slate-500">Live on github.io forever</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-center shadow-xs space-y-1">
          <div className="text-xl">🔒</div>
          <div className="font-bold text-xs text-slate-800">Secure API Storage</div>
          <div className="text-[11px] text-slate-500">Keys stay in user's browser</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-center shadow-xs space-y-1">
          <div className="text-xl">📱</div>
          <div className="font-bold text-xs text-slate-800">Mobile-First UI</div>
          <div className="text-[11px] text-slate-500">Responsive iOS & Android design</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-3.5 text-center shadow-xs space-y-1">
          <div className="text-xl">⚡</div>
          <div className="font-bold text-xs text-slate-800">Zero Server Cost</div>
          <div className="text-[11px] text-slate-500">Pure client-side streaming</div>
        </div>
      </div>

      {/* Sub-navigation tabs */}
      <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 w-fit overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('guide')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeSubTab === 'guide'
              ? 'bg-white text-indigo-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderGit2 className="w-4 h-4 text-indigo-600" />
          <span>GitHub Pages Step-by-Step Guide</span>
        </button>
        <button
          onClick={() => setActiveSubTab('download')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeSubTab === 'download'
              ? 'bg-white text-emerald-600 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Download className="w-4 h-4 text-emerald-600" />
          <span>Download & Local Run</span>
        </button>
        <button
          onClick={() => setActiveSubTab('code')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
            activeSubTab === 'code'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code className="w-4 h-4 text-indigo-600" />
          <span>View Source HTML ({Math.round(htmlContent.length / 1024)} KB)</span>
        </button>
      </div>

      {/* Tab 1: Comprehensive GitHub Pages Guide */}
      {activeSubTab === 'guide' && (
        <div className="space-y-6">
          
          {/* Personalization Box */}
          <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Personalize Your GitHub Deployment Link</span>
                </h3>
                <p className="text-xs text-slate-600">
                  Enter your GitHub username to customize all copy-paste commands and preview your final live URL.
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="e.g. octocat"
                  value={githubUser}
                  onChange={(e) => setGithubUser(e.target.value)}
                  className="bg-white border border-indigo-200 rounded-xl px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 w-44 font-mono shadow-inner"
                />
              </div>
            </div>

            {/* Target Repo & Live URL Bar */}
            <div className="bg-white rounded-xl p-3 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Suggested Repository Name</div>
                <div className="font-mono font-bold text-slate-800">{repoName}</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Your Live Bot URL</div>
                <div className="font-mono text-indigo-600 font-semibold flex items-center gap-1.5">
                  <span>{liveUrl}</span>
                  <button onClick={handleCopyLiveUrl} className="text-slate-400 hover:text-indigo-600" title="Copy Live URL">
                    {copiedLiveUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
              <a
                href={`https://github.com/new?name=${encodeURIComponent(repoName)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-lg inline-flex items-center justify-center space-x-1 transition flex-shrink-0"
              >
                <span>Create Repo on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Deployment Method Switcher */}
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
            <span className="text-xs font-semibold text-slate-500 mr-2">Choose Upload Method:</span>
            <button
              onClick={() => setGuideMethod('web')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                guideMethod === 'web'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              🌐 Browser Drag & Drop (No Terminal)
            </button>
            <button
              onClick={() => setGuideMethod('terminal')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                guideMethod === 'terminal'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              💻 Git Terminal / CLI
            </button>
          </div>

          {/* Method 1: Web UI Drag & Drop */}
          {guideMethod === 'web' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-8">
              
              <div className="border-b border-slate-100 pb-4">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <span>How to Upload index.html to GitHub (100% in your Web Browser)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Follow these 5 simple steps. You do not need any coding tools or command line installed.
                </p>
              </div>

              <div className="space-y-8">
                
                {/* Step 1 */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                    1
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">Download your bot file as <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">index.html</code></h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Make sure your file is saved with the exact name <code className="font-mono font-semibold text-slate-800 bg-slate-100 px-1 py-0.5 rounded">index.html</code> (lowercase). GitHub Pages looks for this exact filename as the homepage.
                    </p>
                    <button
                      onClick={handleDownload}
                      className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold transition inline-flex items-center space-x-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download index.html Now</span>
                    </button>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                    2
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">Create a New Unique Repository on GitHub</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-3 h-3" /></a>.
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      <li><strong>Repository name:</strong> Enter <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-800">{repoName}</code></li>
                      <li><strong>Visibility:</strong> Select <strong className="text-emerald-700">Public</strong> (Required for free GitHub Pages).</li>
                      <li>Leave "Add a README file" unchecked (or checked, either works).</li>
                      <li>Click the green <strong>"Create repository"</strong> button.</li>
                    </ul>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                    3
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">Upload <code className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">index.html</code></h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      On your new repository page:
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      <li>Click the <strong>"uploading an existing file"</strong> link (or click <strong>"Add file" &gt; "Upload files"</strong>).</li>
                      <li>Drag and drop your downloaded <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">index.html</code> into the upload area.</li>
                      <li>Scroll to the bottom and click the green <strong>"Commit changes"</strong> button.</li>
                    </ul>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                    4
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-slate-900 text-sm">Add the <code className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">.nojekyll</code> file (Essential)</h4>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Prevents Blank Screen</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      GitHub Pages automatically runs a Jekyll engine that can block single-file web apps with inline template variables. Disabling it takes 10 seconds:
                    </p>
                    <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4">
                      <li>Click <strong>"Add file" &gt; "Create new file"</strong>.</li>
                      <li>Name the file exactly <code className="font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-bold">.nojekyll</code></li>
                      <li>Leave the file content completely empty.</li>
                      <li>Click the green <strong>"Commit changes"</strong> button.</li>
                    </ul>
                  </div>
                </div>

                {/* Step 5 */}
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0 shadow-sm">
                    5
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm">Turn on GitHub Pages</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Now activate free static hosting:
                    </p>
                    <ol className="text-xs text-slate-600 space-y-1.5 list-decimal pl-4">
                      <li>In your repository, click the top <strong>⚙️ Settings</strong> tab.</li>
                      <li>In the left sidebar, click <strong>Pages</strong>.</li>
                      <li>Under <strong>Build and deployment &gt; Branch</strong>:
                        <ul className="list-disc pl-4 mt-1 space-y-0.5">
                          <li>Select <code className="font-mono bg-slate-100 px-1 py-0.5 rounded font-bold">main</code> from the branch dropdown.</li>
                          <li>Ensure the folder is set to <code className="font-mono bg-slate-100 px-1 py-0.5 rounded">/(root)</code>.</li>
                          <li>Click <strong>Save</strong>.</li>
                        </ul>
                      </li>
                      <li>Wait ~30–60 seconds for GitHub's green build to complete.</li>
                      <li>Your prompt bot is now live at: <strong className="text-indigo-600 font-mono">{liveUrl}</strong> 🎉</li>
                    </ol>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Method 2: Git Terminal / CLI */}
          {guideMethod === 'terminal' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-base sm:text-lg text-slate-900">Git Terminal Instructions</h3>
                  <p className="text-xs text-slate-500">Run this script in your terminal to initialize and push in seconds.</p>
                </div>
                <button
                  onClick={handleCopyScript}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition shadow-sm"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Copied Commands!' : 'Copy All Commands'}</span>
                </button>
              </div>

              <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto text-slate-200 font-mono text-xs leading-relaxed border border-slate-800">
                <pre>{terminalScript}</pre>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-700 space-y-2">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>After pushing:</span>
                </div>
                <p>
                  Visit <a href={`https://github.com/${githubUser ? githubUser.trim() : '<username>'}/${repoName}/settings/pages`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline font-semibold">Repository Settings &gt; Pages</a> and select the <code className="bg-slate-200 px-1 py-0.5 rounded font-mono">main</code> branch to enable the live deployment.
                </p>
              </div>
            </div>
          )}

          {/* Security & FAQ Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>How API Keys Work on GitHub Pages</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The exported <code className="font-mono text-slate-800 bg-slate-100 px-1 py-0.5 rounded">index.html</code> runs completely client-side in the visitor's browser. When someone opens your bot, they enter their own free OpenRouter or Gemini API key in the slide-down settings drawer.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1">
                <div className="font-semibold text-slate-800">🔑 Zero Hardcoded Secrets</div>
                <p className="text-[11px] text-slate-500">Your personal keys are never embedded in the public repository HTML.</p>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-1">
                <div className="font-semibold text-slate-800">🔄 Instant Updates</div>
                <p className="text-[11px] text-slate-500">To update prompt instructions or styling, simply replace <code className="font-mono">index.html</code> on GitHub.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Download & Local Run */}
      {activeSubTab === 'download' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              1
            </div>
            <h3 className="font-bold text-slate-900 text-base">Download index.html</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Click the download button to save your fully configured prompt bot as <code className="font-mono text-slate-800 font-semibold">index.html</code>. It embeds all Tailwind styles, Lucide icons, Markdown support, custom avatars, and system instructions.
            </p>
            <button
              onClick={handleDownload}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download index.html</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              💻
            </div>
            <h3 className="font-bold text-slate-900 text-base">Run on Your Local Machine</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Because your AI bot is a fully self-contained static HTML file, you can run it locally instantly:
            </p>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
              <li>Double-click <code className="bg-slate-100 px-1 py-0.5 rounded">index.html</code> to open it in Chrome, Safari, Firefox, or Edge.</li>
              <li>Or run a quick local server: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">npx serve</code> or <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-slate-800">python3 -m http.server</code>.</li>
              <li>Enter your free OpenRouter or Gemini API key on first load (stored securely in browser localStorage).</li>
            </ul>
          </div>

        </div>
      )}

      {/* Tab 3: Code Viewer */}
      {activeSubTab === 'code' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden space-y-2">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-800/80 border-b border-slate-700">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
              <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
              <span className="ml-2">index.html</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <div className="p-4 max-h-[500px] overflow-y-auto">
            <pre className="text-xs font-mono text-slate-300 leading-relaxed">
              <code>{htmlContent}</code>
            </pre>
          </div>
        </div>
      )}

    </div>
  );
}

