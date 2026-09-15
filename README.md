# 🤖 PromptBots for GitHub

**Mobile-first builder & exporter for custom open-source and multi-model AI prompt bots deployable directly to GitHub Pages.**

A powerful tool to design, configure, and deploy AI-powered chatbots without code. Built with React, TypeScript, Vite, and Google Gemini API with fallback support.

---

## 📌 Quick Links

| Link | Purpose |
|------|---------|
| 🔗 [Repository](https://github.com/MLSpyShop/PromptBotsForGitHub) | Source code |
| 🌐 [Live Application](https://mlspyshop.github.io/PromptBotsForGitHub/) | Access the builder |
| 📖 [Official Documentation](https://mlspyshop.github.io/PromptBotsForGitHub/index.html) | Full guide |

---

## ✨ Features

### 🎨 Visual Bot Builder
- **Drag-and-drop interface** for configuring AI bot behavior
- **Mobile-first responsive design** for building on any device
- **Real-time customization** of bot name, description, personality, and appearance

### 🧠 AI-Powered Enhancements
- **Auto-generate system prompts** using Google Gemini AI
- **Smart greeting message generator** creates contextual welcome messages
- **Starter prompt suggestions** - AI generates relevant conversation starters
- **Intelligent prompt refinement** - Improve your instructions with one click

### 💬 Live Chat Preview
- **Test your bot in real-time** before deployment
- **Multi-turn conversations** to validate bot behavior
- **File attachment support** for multimodal AI interactions
- **Real-time model fallback** - Automatic retry on API overload

### 📦 Multi-Model Support
- **Google Gemini API** (primary, free tier available):
  - gemini-2.5-flash
  - gemini-flash-latest
  - gemini-3.1-flash-lite
  - gemini-3.8-flash
- **OpenRouter API** (optional, 100+ models available)
  - DeepSeek R1
  - Meta Llama
  - And many more...

### 🎯 Customization Options
- **Theme colors** - Choose from 7 professional color schemes
- **Custom logos** - Upload or paste image URLs
- **Temperature control** - Adjust AI creativity/accuracy (0.0 - 2.0)
- **Multiple icons** - Select from Lucide icon library or use emojis
- **Author branding** - Add your name to bot deployment

### 📤 Export & Deploy
- **One-click export** - Generate a standalone HTML file
- **GitHub Pages ready** - Deploy directly to `gh-pages` branch
- **Self-contained** - No external dependencies needed
- **Open-source** - Full control over your bot's code
- **API key options**:
  - Embed API key in exported bot (if needed)
  - User provides their own API key
  - Require authentication per interaction

---

## 🚀 Quick Start (30 seconds)

### Step 1: Open the Builder
👉 **[Open PromptBots for GitHub](https://mlspyshop.github.io/PromptBotsForGitHub/)**

### Step 2: Fill Out Your Bot Configuration
1. **Enter Bot Details**:
   - Bot Name (e.g., "Code Review Assistant")
   - Description (one-line summary)
   - Author Name (your name)

2. **Add Bot Instructions**:
   - Write what you want your bot to do in the "Raw Instructions" field
   - Click **"Enhance All"** to let AI generate:
     - Complete system instructions
     - Welcome greeting
     - Starter prompt suggestions
   - Or customize each field individually

3. **Customize Appearance**:
   - Select theme color (7 options available)
   - Choose icon (Lucide icon library or emoji)
   - Upload custom logo (optional)
   - Adjust temperature for creativity level

### Step 3: Test Your Bot
1. Switch to the **Preview** tab
2. Chat with your bot in real-time
3. Refine instructions if needed
4. Upload files to test multimodal features

### Step 4: Export Your Bot
1. Go to the **Export** tab
2. Click **"Download as HTML"** to get a standalone bot file
3. This creates a single `.html` file ready to deploy

### Step 5: Deploy to GitHub Pages (2 minutes)
1. **Create a new GitHub repository** named `my-ai-bot` (or any name)
2. **Upload the exported HTML file**:
   - Go to your repository
   - Click "Add file" → "Upload files"
   - Drag & drop the exported `.html` file
   - Commit the changes

3. **Enable GitHub Pages**:
   - Go to repository **Settings** → **Pages**
   - Select branch: **main**
   - Select folder: **root**
   - Click **Save**

4. **Your bot is live!** 🎉
   - Visit: `https://yourusername.github.io/my-ai-bot/`
   - Share the link with anyone

---

## 📖 Detailed Usage Guide

### Complete Setup Instructions (Local Development)

#### Prerequisites
- **Node.js** 16+ and **npm** or **yarn**
- **Git** for version control
- **Google Gemini API key** (free at [aistudio.google.com](https://aistudio.google.com))
- *(Optional)* **OpenRouter API key** for advanced model access

#### Installation

##### 1. Clone the Repository
```bash
git clone https://github.com/MLSpyShop/PromptBotsForGitHub.git
cd PromptBotsForGitHub
```

##### 2. Install Dependencies
```bash
npm install
```

##### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here  # Optional
APP_URL=http://localhost:3000
```

**Get your API keys:**
- **Gemini API**: Visit [aistudio.google.com](https://aistudio.google.com), create a new API key
- **OpenRouter**: Visit [openrouter.ai](https://openrouter.ai), sign up and create an API key

##### 4. Start Development Server
```bash
npm run dev
```

Server runs at `http://localhost:3000`

##### 5. Build for Production
```bash
npm run build
```

Compiled files appear in the `dist/` directory.

---

## 🎯 Workflow: Builder → Preview → Export → Deploy

### 1. Builder Tab - Configure Your Bot
The builder is your main workspace:

- **Bot Details Section**
  - `Bot Name` - Your bot's title
  - `Description` - Short description of capabilities
  - `Author Name` - Your name for attribution

- **AI Configuration Section**
  - `Raw Instructions/Notes` - Your initial thoughts on bot behavior
  - **Buttons**:
    - "Enhance All" - AI generates complete configuration
    - "Refine Prompt" - Improve system instructions only
    - "Generate Greeting" - Create welcome message
    - "Generate Starter Prompts" - Suggest conversation starters

- **System Instruction** - The core rules/personality of your bot
- **Welcome Message** - Greeting users see first
- **Starter Prompts** - 4 pre-suggested questions users can click

- **Appearance Customization**
  - `Theme Color` - 7 professional color schemes
  - `Icon` - Lucide icon or emoji for bot avatar
  - `Logo URL` - Custom image for bot
  - `Temperature` - AI creativity (0 = factual, 2 = creative)

- **Model & Provider Selection**
  - `Model` - Choose Gemini model version
  - `Provider` - Gemini (default) or OpenRouter
  - `OpenRouter Model` - If using OpenRouter
  - `Require API Key` - Checkbox if deployed bot needs user's API key

### 2. Preview Tab - Test Your Bot Live
Real-time testing environment:

- **Chat Interface** - Type messages to test responses
- **File Upload** - Test multimodal interactions
- **Model Fallback** - Automatic retry on API overload
- **Response Quality** - See exactly how bot responds to queries

### 3. Export Tab - Generate Deployment Package
Two export options:

**Option A: Download as HTML** (Recommended)
- Single standalone `.html` file
- Works offline
- Ready to upload to GitHub Pages
- No build process needed

**Option B: Copy GitHub Pages Deployment Code**
- Full setup instructions
- Code snippets for GitHub Actions
- Advanced configuration options

### 4. Deploy to GitHub Pages - Make It Live

#### Quick Deployment (Recommended)
```bash
# 1. Create new GitHub repository
# 2. Upload your exported .html file
# 3. Go to Settings → Pages
# 4. Select "main" branch, "root" folder
# 5. Your bot is live at: https://yourusername.github.io/repo-name/
```

#### Automated Deployment (GitHub Actions)
1. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

2. Push changes to `main` - workflow deploys automatically

---

## 🛠️ Development

### Project Structure
```
PromptBotsForGitHub/
├── src/
│   ├── components/          # React components
│   │   ├── Navbar.tsx      # Top navigation
│   │   ├── BuilderView.tsx # Bot configuration interface
│   │   ├── LiveChatPreview.tsx  # Real-time chat testing
│   │   ├── ExportView.tsx  # Deployment options
│   │   └── PresetModal.tsx # Bot template selection
│   ├── data/               # Presets and constants
│   ├── utils/              # Helper functions
│   ├── types.ts            # TypeScript interfaces
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── server.ts               # Express backend for AI API calls
├── dist/                   # Compiled production build
├── package.json            # Dependencies & scripts
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite bundler config
├── .env.example            # Environment variables template
└── index.html              # HTML entry point
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type check without emitting
npm run lint

# Clean build artifacts
npm run clean

# Preview production build locally
npm preview
```

### Technology Stack
- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS + Motion animations
- **Build**: Vite 6
- **Backend**: Express.js
- **AI APIs**: Google Gemini API + OpenRouter
- **Icons**: Lucide React
- **Bundler**: esbuild

---

## 🔐 API Configuration

### Server-Side Endpoints

The app includes a Node.js/Express backend that handles secure AI API calls:

#### `POST /api/refine-prompt`
Generates polished system instructions from raw notes.

**Request:**
```json
{
  "title": "Code Review Bot",
  "description": "Reviews pull requests",
  "rawInstructions": "Focus on security",
  "goal": "Improve code quality",
  "provider": "gemini"
}
```

#### `POST /api/generate-greeting`
Creates a contextual welcome message.

#### `POST /api/generate-starter-chips`
Generates 4 relevant starter prompt suggestions.

#### `POST /api/enhance-all`
One-call enhancement - generates system instruction, greeting, and starter prompts.

#### `POST /api/chat-preview`
Live chat preview endpoint for testing bots.

**Request:**
```json
{
  "systemInstruction": "You are...",
  "messages": [{"role": "user", "content": "Hi!"}],
  "model": "gemini-2.5-flash",
  "provider": "gemini"
}
```

### Automatic Model Fallback

The backend automatically switches between Gemini models if one reaches capacity:
1. Tries your requested model
2. Falls back to `gemini-2.5-flash`
3. Then `gemini-flash-latest`
4. Then `gemini-3.1-flash-lite`
5. Finally `gemini-3.8-flash`

---

## 🐛 Troubleshooting

### "API Key not found"
- ✅ Check `.env` file has `GEMINI_API_KEY=...`
- ✅ Restart dev server after changing `.env`
- ✅ Ensure API key has no trailing spaces

### "Model response failed"
- ✅ Verify Google Gemini quota at [aistudio.google.com](https://aistudio.google.com)
- ✅ App auto-retries with fallback models
- ✅ Try again in 30 seconds if high demand

### "Bot not responding in preview"
- ✅ Check browser console for error messages (F12)
- ✅ Ensure system instruction is not empty
- ✅ Verify server is running (`npm run dev`)

### "Deployed bot not loading"
- ✅ Confirm `gh-pages` branch exists
- ✅ Check GitHub Pages settings point to `gh-pages` branch
- ✅ Ensure `dist/` folder was built and pushed
- ✅ Clear browser cache (Ctrl+Shift+Del)

### "OpenRouter API errors"
- ✅ Verify OpenRouter API key is valid
- ✅ Check account has remaining credits
- ✅ Confirm model exists in OpenRouter catalog
- ✅ Check network/firewall not blocking requests

---

## 📚 Example Bot Configurations

### Code Review Assistant
```
Name: Code Review Bot
Description: Reviews code for quality and security
System Instruction: "You are an expert code reviewer. Analyze pull requests for bugs, security issues, and best practices. Be constructive and educational."
```

### Product Manager Assistant
```
Name: PM Helper
Description: Helps craft product strategies and specs
System Instruction: "You are a seasoned product manager. Help users define product requirements, user stories, and go-to-market strategies..."
```

### Learning Tutor
```
Name: Python Tutor
Description: Teaches Python programming concepts
System Instruction: "You are a patient coding instructor. Explain Python concepts clearly, provide examples, and suggest practice problems..."
```

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open Pull Request** with description

### Development Guidelines
- Use TypeScript for type safety
- Follow existing code style (Prettier formatting)
- Test bot generation before submitting PR
- Update README if adding new features

---

## 📄 License

This project is provided as-is. Check repository for license details.

---

## 🔗 Resources

- **Google Gemini API**: [aistudio.google.com](https://aistudio.google.com)
- **OpenRouter**: [openrouter.ai](https://openrouter.ai)
- **React Documentation**: [react.dev](https://react.dev)
- **TypeScript Handbook**: [typescriptlang.org](https://www.typescriptlang.org/)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)

---

## 📞 Support & Feedback

- **Report bugs**: [Create an issue](https://github.com/MLSpyShop/PromptBotsForGitHub/issues)
- **Ask questions**: [Start a discussion](https://github.com/MLSpyShop/PromptBotsForGitHub/discussions)
- **Request features**: [GitHub issues](https://github.com/MLSpyShop/PromptBotsForGitHub/issues)

---

<div align="center">

**Made with ❤️ by [MLSpyShop](https://github.com/MLSpyShop)**

[⬆ Back to top](#-promptbots-for-github)

</div>
