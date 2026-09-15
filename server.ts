import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI client securely on server side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper to generate content with automatic model fallback for high-demand spikes
async function generateContentWithFallback(prompt: string, requestedModel: string = "gemini-2.5-flash") {
  const fallbackModels = [
    requestedModel,
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash"
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);

  let lastError: any = null;

  for (const model of fallbackModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });
      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      const isTransient = errMsg.includes("503") || errMsg.includes("429") || errMsg.includes("high demand") || errMsg.includes("UNAVAILABLE");
      
      if (isTransient) {
        // Fast failover to next model in list
        continue;
      } else {
        // Non-transient error, try next model as safety
        continue;
      }
    }
  }

  throw lastError || new Error("Failed to generate content across available models.");
}

// Helper to send chat message with fallback
async function sendChatMessageWithFallback(
  selectedModel: string,
  systemInstruction: string,
  chatHistory: any[],
  messageParts: any[]
) {
  const fallbackModels = [
    selectedModel,
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash"
  ].filter((m, idx, arr) => arr.indexOf(m) === idx);

  let lastError: any = null;

  for (const model of fallbackModels) {
    try {
      const chat = ai.chats.create({
        model,
        config: {
          systemInstruction: systemInstruction || "You are a helpful AI assistant.",
        },
        history: chatHistory
      });
      const response = await chat.sendMessage({ message: messageParts });
      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err: any) {
      lastError = err;
      const errMsg = err?.message || String(err);
      const isTransient = errMsg.includes("503") || errMsg.includes("429") || errMsg.includes("high demand") || errMsg.includes("UNAVAILABLE");
      
      if (isTransient) {
        // Fast failover to next model in list
        continue;
      } else {
        continue;
      }
    }
  }

  throw lastError || new Error("Failed to generate chat response across available models.");
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Refine / generate system prompt using Gemini or OpenRouter
app.post("/api/refine-prompt", async (req, res) => {
  try {
    const { title, description, rawInstructions, goal, provider, openRouterModel, openRouterApiKey } = req.body;
    
    const prompt = `You are an expert prompt engineer and AI architect. 
A user wants to create a custom AI assistant with the following details:
- Title: ${title || "Custom AI Assistant"}
- Short Description: ${description || "General purpose assistant"}
- User Goal / Context: ${goal || "Help users effectively"}
- User's Notes / Draft Instructions: ${rawInstructions || "(Empty - please generate complete, high quality instructions based on the title and description)"}

Please write a comprehensive, robust, professional system instruction for this AI Bot. 
The system instruction should define its persona, tone, formatting preferences, constraints, and instructions on how to handle queries. 
Return ONLY the refined system instruction text without extra conversational filler or markdown code blocks unless requested.`;

    if (provider === 'openrouter' && (openRouterApiKey || process.env.OPENROUTER_API_KEY)) {
      const apiKey = openRouterApiKey || process.env.OPENROUTER_API_KEY;
      const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": req.headers.referer || "https://ais-dev.run.app",
          "X-Title": "PromptBots for GitHub"
        },
        body: JSON.stringify({
          model: openRouterModel || "deepseek/deepseek-r1:free",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const orData = await orRes.json();
      if (!orRes.ok) {
        throw new Error(orData.error?.message || `OpenRouter API error: ${orRes.statusText}`);
      }

      const refined = orData.choices?.[0]?.message?.content || rawInstructions;
      return res.json({ refinedPrompt: refined.trim() });
    }

    // Default to free Google Gemini API tier with multi-model fallback
    const refinedText = await generateContentWithFallback(prompt, "gemini-2.5-flash");
    res.json({ refinedPrompt: refinedText || rawInstructions });
  } catch (error: any) {
    console.error("Error refining prompt:", error);
    const msg = error?.message || "Failed to refine prompt";
    const userFriendlyMessage = msg.includes("503") || msg.includes("high demand") || msg.includes("UNAVAILABLE")
      ? "The AI service is experiencing temporary peak demand. Please retry in a few seconds."
      : msg;
    res.status(500).json({ error: userFriendlyMessage });
  }
});

// Generate or enhance welcome greeting message
app.post("/api/generate-greeting", async (req, res) => {
  try {
    const { title, description, systemInstruction, currentGreeting } = req.body;
    
    const prompt = `You are designing a custom AI bot.
Bot Name: ${title || "AI Assistant"}
Bot Description: ${description || "Helpful assistant"}
System Instructions / Persona: ${systemInstruction || "General assistant"}
Current Greeting (if any): ${currentGreeting || "(Empty)"}

Write an engaging, welcoming, role-appropriate 1-2 sentence opening greeting message for this bot to greet the user when the chat starts.
Do not include quotation marks or meta commentary. Return ONLY the greeting message text.`;

    const greetingText = await generateContentWithFallback(prompt, "gemini-2.5-flash");
    res.json({ greeting: greetingText?.replace(/^["']|["']$/g, '').trim() || "Hello! How can I assist you today?" });
  } catch (error: any) {
    console.error("Error generating greeting:", error);
    res.status(500).json({ error: error.message || "Failed to generate greeting" });
  }
});

// Generate starter prompt suggestion chips
app.post("/api/generate-starter-chips", async (req, res) => {
  try {
    const { title, description, systemInstruction } = req.body;
    
    const prompt = `You are designing starter suggestion prompt chips for an AI assistant.
Bot Name: ${title || "AI Assistant"}
Bot Description: ${description || "Helpful assistant"}
System Instructions: ${systemInstruction || "General assistant"}

Generate exactly 4 distinct, highly relevant, short starter prompts (maximum 8-12 words each) that users can click to ask this bot.
Return your response as a valid JSON array of strings ONLY.
Example format:
["Draft a product launch email", "Explain async/await in Python", "Audit my codebase for security vulnerabilities", "Help me prepare for an interview"]`;

    const rawResponse = await generateContentWithFallback(prompt, "gemini-2.5-flash");
    let chips: string[] = [];
    try {
      const cleaned = rawResponse.replace(/```json\n?|```/g, '').trim();
      chips = JSON.parse(cleaned);
      if (!Array.isArray(chips)) throw new Error("Parsed content is not an array");
    } catch {
      // Fallback regex extraction if model returns markdown
      const matches = rawResponse.match(/["']([^"']{5,80})["']/g);
      if (matches && matches.length > 0) {
        chips = matches.slice(0, 4).map(s => s.replace(/^["']|["']$/g, '').trim());
      } else {
        chips = [
          `Tell me how ${title || "you"} can help me`,
          `What are your top capabilities?`,
          `Give me a practical example of your work`,
          `Help me with a task right now`
        ];
      }
    }

    res.json({ starterPrompts: chips.filter(c => typeof c === 'string' && c.trim().length > 0) });
  } catch (error: any) {
    console.error("Error generating starter chips:", error);
    res.status(500).json({ error: error.message || "Failed to generate starter chips" });
  }
});

// Enhance all fields (instructions, greeting, and chips) in a single unified AI call
app.post("/api/enhance-all", async (req, res) => {
  try {
    const { title, description, rawInstructions, currentGreeting } = req.body;

    const botTitle = title?.trim() || "Specialized AI Assistant";
    const botDesc = description?.trim() || "An expert assistant crafted for precision and productivity";

    const prompt = `You are an elite prompt architect and AI bot builder.
The user is building a custom bot with:
- Title: ${botTitle}
- Description: ${botDesc}
- Draft Instructions (if any): ${rawInstructions || "(Empty)"}
- Draft Greeting (if any): ${currentGreeting || "(Empty)"}

Create a complete configuration package for this bot. Return a valid JSON object ONLY matching this schema:
{
  "systemInstruction": "Comprehensive multi-paragraph system instruction defining persona, tone, rules, formatting, and behavior",
  "welcomeMessage": "A friendly, role-appropriate 1-2 sentence welcome message",
  "starterPrompts": ["Short starter prompt 1", "Short starter prompt 2", "Short starter prompt 3", "Short starter prompt 4"]
}`;

    const rawResponse = await generateContentWithFallback(prompt, "gemini-2.5-flash");
    try {
      const cleaned = rawResponse.replace(/```json\n?|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      res.json({
        systemInstruction: parsed.systemInstruction || rawInstructions,
        welcomeMessage: parsed.welcomeMessage || currentGreeting || "Hello! How can I help you today?",
        starterPrompts: Array.isArray(parsed.starterPrompts) && parsed.starterPrompts.length > 0 ? parsed.starterPrompts : [
          `How can you help me with ${botTitle}?`,
          `Show me your primary features`,
          `Walk me through a step-by-step example`,
          `Give me your best recommendation`
        ]
      });
    } catch {
      // Fallback
      res.json({
        systemInstruction: rawResponse,
        welcomeMessage: `Hello! I'm ${botTitle}. How can I assist you today?`,
        starterPrompts: [
          `How can you help me with ${botTitle}?`,
          `Show me your top capabilities`,
          `Give me a practical example`,
          `Help me get started`
        ]
      });
    }
  } catch (error: any) {
    console.error("Error in enhance-all:", error);
    res.status(500).json({ error: error.message || "Failed to enhance bot" });
  }
});

// Live preview chat endpoint for testing inside the generator
app.post("/api/chat-preview", async (req, res) => {
  try {
    const { systemInstruction, messages, model, attachment, provider, openRouterModel, openRouterApiKey } = req.body;

    if (provider === 'openrouter' && (openRouterApiKey || process.env.OPENROUTER_API_KEY)) {
      const apiKey = openRouterApiKey || process.env.OPENROUTER_API_KEY;
      const orModel = openRouterModel || "deepseek/deepseek-r1:free";
      const formattedMessages = [
        { role: "system", content: systemInstruction || "You are a helpful AI assistant." },
        ...(messages || []).map((m: any) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content + (m.attachment ? `\n[Attachment: ${m.attachment.mimeType}]` : "")
        }))
      ];

      const orRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
          "HTTP-Referer": req.headers.referer || "https://ais-dev.run.app",
          "X-Title": "PromptBots for GitHub"
        },
        body: JSON.stringify({
          model: orModel,
          messages: formattedMessages
        })
      });

      const orData = await orRes.json();
      if (!orRes.ok) {
        throw new Error(orData.error?.message || `OpenRouter API error: ${orRes.statusText}`);
      }

      const reply = orData.choices?.[0]?.message?.content || "I'm here to help!";
      return res.json({ reply });
    }

    const selectedModel = model || "gemini-2.5-flash";

    // Format chat history for Gemini
    const chatHistory = (messages || []).slice(0, -1).map((m: any) => {
      const parts: any[] = [{ text: m.content || " " }];
      if (m.attachment) {
        parts.push({
          inlineData: {
            mimeType: m.attachment.mimeType,
            data: m.attachment.data
          }
        });
      }
      return {
        role: m.role === "user" ? "user" : "model",
        parts
      };
    });

    const lastMsgObj = messages[messages.length - 1];
    const lastMessageText = lastMsgObj?.content || (attachment ? "Analyze this file" : "Hello");

    const messageParts: any[] = [{ text: lastMessageText }];
    if (attachment && attachment.data) {
      messageParts.push({
        inlineData: {
          mimeType: attachment.mimeType,
          data: attachment.data
        }
      });
    }

    const reply = await sendChatMessageWithFallback(selectedModel, systemInstruction, chatHistory, messageParts);
    res.json({ reply: reply || "I'm here to help!" });
  } catch (error: any) {
    console.error("Error in chat preview:", error);
    const msg = error?.message || "Failed to generate response";
    const userFriendlyMessage = msg.includes("503") || msg.includes("high demand") || msg.includes("UNAVAILABLE")
      ? "AI model is experiencing momentary high demand. Please try sending your message again in a few moments."
      : msg;
    res.status(500).json({ error: userFriendlyMessage });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
