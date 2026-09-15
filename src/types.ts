export interface GemConfig {
  id: string;
  name: string;
  description: string;
  systemInstruction: string;
  welcomeMessage: string;
  starterPrompts: string[];
  icon: string; // Lucide icon name or emoji
  logoUrl?: string; // Custom uploaded logo base64 or URL
  themeColor: 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan' | 'slate';
  model: string;
  provider?: 'gemini' | 'openrouter';
  openRouterModel?: string;
  temperature: number;
  authorName: string;
  requireApiKey: boolean;
}

export type ActiveTab = 'builder' | 'preview' | 'export';
