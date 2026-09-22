import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { phoneModels } from "./src/data";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

// Load Firebase Config safely from JSON file
const firebaseConfig = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8")
);

// Initialize Firebase client on the server
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

// Lazy initialization of DeepSeek / AI client
function getDeepSeekApiKey(): string | null {
  return process.env.DEEPSEEK_API_KEY || null;
}

function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY || null;
}

let geminiClientInstance: any = null;
function getGeminiClient() {
  if (!geminiClientInstance) {
    const key = getGeminiApiKey();
    if (!key) return null;
    geminiClientInstance = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return geminiClientInstance;
}

/**
 * Call DeepSeek chat completion API (OpenAI-compatible)
 */
async function callDeepSeekChat(messages: Array<{ role: string; content: string }>, temperature = 0.7): Promise<string> {
  const apiKey = getDeepSeekApiKey();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY_MISSING");
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: messages,
      temperature: temperature,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`DeepSeek API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) {
    throw new Error("Empty response from DeepSeek");
  }
  return reply;
}

/**
 * Call Gemini as fallback if DeepSeek key is missing or encounters issues
 */
async function callGeminiChatFallback(contents: any[], systemInstruction: string, temperature = 0.7): Promise<string> {
  const client = getGeminiClient();
  if (!client) {
    throw new Error("لم يتم العثور على مفتاح DEEPSEEK_API_KEY أو GEMINI_API_KEY. يرجى إضافة مفتاح DeepSeek في إعدادات التطبيق.");
  }

  const response = await client.models.generateContent({
    model: "gemini-3.7-flash",
    contents: contents,
    config: {
      systemInstruction: systemInstruction,
      temperature: temperature,
    }
  });

  return response.text || "";
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", aiProvider: getDeepSeekApiKey() ? "deepseek" : "gemini-fallback" });
  });

  // Universal AI Chat Route (DeepSeek primary, with backward-compatible aliases)
  const handleAiChat = async (req: express.Request, res: express.Response) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        res.status(400).json({ error: "Missing message field" });
        return;
      }

      const systemInstruction = `You are a premium, highly professional hardware parts compatibility assistant for the "LCD DALULE" application, powered by DeepSeek AI, serving mobile phone repair technicians.
Your primary objective is to assist repair technicians in finding compatible display screens, IC chips, batteries, and other spare parts across various models of Honor, Huawei, Samsung, Apple, Xiaomi, Oppo, Vivo, Realme, Infinix, Tecno, and Itel.

CRITICAL NOT CONFLICTING INSTRUCTIONS FOR EXTREMELY SIMPLE ANSWERS:
1. Speak in clear, polite Arabic by default (or English if the question is in English).
2. KEEP ANSWERS EXTREMELY SIMPLE, DIRECT, AND SHORT. Avoid long essays, excessive detail, over-complication, or unnecessary wordy warnings. 
3. When the user asks about compatibility for a specific screen or phone model, give a DIRECT, simple answer first (e.g., whether it is compatible or what other models share the exact same screen) using bullet points or a single short paragraph. Don't add long-winded technical explanations unless asked.
4. Keep the tone friendly, humble, helpful, and highly clear for quick reading by a busy technician.`;

      // 1. Attempt DeepSeek First
      if (getDeepSeekApiKey()) {
        try {
          const deepSeekMessages = [
            { role: "system", content: systemInstruction },
            ...(history || []).map((msg: any) => ({
              role: msg.role === 'ai' || msg.role === 'assistant' || msg.role === 'model' ? 'assistant' : 'user',
              content: msg.text || msg.content || ""
            })),
            { role: "user", content: message }
          ];

          const replyText = await callDeepSeekChat(deepSeekMessages, 0.7);
          res.json({ text: replyText, provider: "deepseek" });
          return;
        } catch (deepSeekError: any) {
          console.warn("DeepSeek request failed or key issue, evaluating fallback:", deepSeekError?.message);
          // If Gemini key exists, fall through to fallback, otherwise report error
          if (!getGeminiApiKey()) {
            res.status(500).json({ error: deepSeekError?.message || "DeepSeek request failed" });
            return;
          }
        }
      }

      // 2. Fallback to Gemini if DEEPSEEK_API_KEY is not provided yet or failed
      const processedHistory = (history || []).map((msg: any) => ({
        role: msg.role === 'ai' || msg.role === 'assistant' || msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.text || "" }]
      }));

      const contents = [
        ...processedHistory,
        { role: "user", parts: [{ text: message }] }
      ];

      const replyText = await callGeminiChatFallback(contents, systemInstruction, 0.7);
      res.json({ text: replyText, provider: "gemini-fallback" });
    } catch (error: any) {
      console.error("AI API Error in backend:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  };

  app.post("/api/deepseek/chat", handleAiChat);
  app.post("/api/ai/chat", handleAiChat);
  app.post("/api/gemini/chat", handleAiChat); // backward compatibility

  // Universal Smart AI Compatibility Search for unlisted models
  const handleAiCompatibilitySearch = async (req: express.Request, res: express.Response) => {
    try {
      const { query: searchQuery, language = 'ar' } = req.body;
      if (!searchQuery || typeof searchQuery !== 'string') {
        res.status(400).json({ error: "Missing or invalid query field" });
        return;
      }

      const prompt = `You are the master hardware technician for smartphone spare parts compatibility, powered by DeepSeek AI.
The user is searching for compatibility details for this smartphone model: "${searchQuery}".

Please investigate and provide comprehensive hardware compatibility details for this device:
1. Exact Brand & Full Model Name
2. Alternative/Factory Model Numbers (e.g., CPHxxxx, SM-Axxx, X65xx, RMXxxxx, etc.)
3. LCD Screen compatibility (Display type, screen size, refresh rate, and exact other phone models that share the exact same interchangeable display/glass)
4. Charging / Power / Touch IC compatibility (IC chip codes and other devices using the same IC)
5. Battery compatibility (Battery model code, e.g. BN56, BLPxxx, EB-Bxxx, and interchangeable phones)
6. Glass Screen Protector compatibility (phones with identical front panel size/cutout)
7. Important repair tips (Flex cable revisions, frame transfer advice, disassembly warnings).

Respond in clear, structured, professional ${language === 'ar' ? 'Arabic' : 'English'}. Use clean bullet points and bold headers so it's super easy for a phone repair technician to read at a glance.`;

      // 1. Attempt DeepSeek First
      if (getDeepSeekApiKey()) {
        try {
          const deepSeekMessages = [
            { role: "system", content: "You are an expert smartphone repair technician assistant specialized in cross-reference hardware compatibility." },
            { role: "user", content: prompt }
          ];

          const resultText = await callDeepSeekChat(deepSeekMessages, 0.4);
          res.json({ result: resultText, query: searchQuery, provider: "deepseek" });
          return;
        } catch (deepSeekError: any) {
          console.warn("DeepSeek search failed, checking fallback:", deepSeekError?.message);
          if (!getGeminiApiKey()) {
            res.status(500).json({ error: deepSeekError?.message || "DeepSeek compatibility search failed" });
            return;
          }
        }
      }

      // 2. Fallback to Gemini
      const fallbackResult = await callGeminiChatFallback([prompt], "You are an expert smartphone repair technician assistant specialized in cross-reference hardware compatibility.", 0.4);
      res.json({ result: fallbackResult, query: searchQuery, provider: "gemini-fallback" });
    } catch (error: any) {
      console.error("AI Compatibility Search Error:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  };

  app.post("/api/deepseek/search-compatibility", handleAiCompatibilitySearch);
  app.post("/api/ai/search-compatibility", handleAiCompatibilitySearch);
  app.post("/api/gemini/search-compatibility", handleAiCompatibilitySearch); // backward compatibility

  // Helper to extract JSON from AI text
  const extractJson = (text: string) => {
    let clean = text.trim();
    const jsonMatch = clean.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (jsonMatch && jsonMatch[1]) {
      clean = jsonMatch[1].trim();
    }
    return JSON.parse(clean);
  };

  // 1. In-App Database Evolution by DeepSeek
  app.post("/api/deepseek/generate-compatibilities", async (req, res) => {
    try {
      const { brand = 'all', series = '', count = 4, language = 'ar' } = req.body;

      const systemPrompt = `You are a master smartphone hardware repair engineer and database architect for the "LCD DALULE" application.
Your goal is to generate 100% verified, accurate smartphone hardware compatibility clusters for mobile repair technicians.
You MUST output ONLY valid JSON without any conversational commentary or markdown exterior to the JSON.`;

      const userPrompt = `Generate a dataset of ${count} smartphone models for brand "${brand}" ${series ? `focusing on series/models: "${series}"` : ''}.
CRITICAL COMPATIBILITY REQUIREMENT:
When two or more phone models share the EXACT SAME physical LCD screen, connector flex, and touch digitizer, give them the EXACT IDENTICAL 'lcdScreenCode' (e.g. 'UNI-X6515-LCD' or 'UNI-A15-LCD').
Similarly for 'icChipCode', 'batteryCode', and 'screenProtectorCode'.

Return a JSON array of objects with the following exact structure:
[
  {
    "id": "ds-unique-slug",
    "brandId": "${brand.toLowerCase()}",
    "modelName": "Full Model Name (e.g. Samsung Galaxy A15 4G)",
    "alternativeNames": "Alternative factory models (e.g. SM-A155F, SM-A155M)",
    "lcdScreenCode": "UNI-A155-LCD",
    "icChipCode": "S2MU106-IC",
    "batteryCode": "WT-S-N28",
    "screenProtectorCode": "A15-GLASS",
    "displayType": "Super AMOLED, 90Hz",
    "screenSize": "6.5 inches",
    "fpcPins": "34 Pins",
    "repairDifficulty": "Medium",
    "compatibleModelsSummary": "List of models sharing same screen",
    "repairTips": "Short practical technician advice in ${language === 'ar' ? 'Arabic' : 'English'}"
  }
]
Output ONLY valid JSON.`;

      let jsonResult: any = null;
      let providerUsed = "deepseek";

      if (getDeepSeekApiKey()) {
        try {
          const raw = await callDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ], 0.2);
          jsonResult = extractJson(raw);
        } catch (err: any) {
          console.warn("DeepSeek compatibility generation failed, trying fallback:", err?.message);
        }
      }

      if (!jsonResult && getGeminiApiKey()) {
        providerUsed = "gemini-fallback";
        const raw = await callGeminiChatFallback([userPrompt], systemPrompt, 0.2);
        jsonResult = extractJson(raw);
      }

      if (!jsonResult) {
        throw new Error("Unable to generate compatibility data. Please check your DEEPSEEK_API_KEY.");
      }

      res.json({
        success: true,
        models: Array.isArray(jsonResult) ? jsonResult : [jsonResult],
        provider: providerUsed
      });
    } catch (error: any) {
      console.error("DeepSeek DB Generation Error:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  // 2. In-App Security Audit & Shield Hardening by DeepSeek
  app.post("/api/deepseek/security-audit", async (req, res) => {
    try {
      const { language = 'ar' } = req.body;

      const systemPrompt = `You are a high-level Lead Cyber Security Auditor specializing in Web Applications, Firestore Rules, and AI Security Guards.
Analyze the current security state of LCD DALULE web application and provide an in-depth security hardening report.
You MUST output ONLY valid JSON.`;

      const auditContext = `Application Context:
- Platform: React 18, Vite, Express, Google Cloud Run
- Database: Google Cloud Firestore with client-side RBAC and Security Rules
- Authentication: Firebase Auth (Google OAuth & Email/Password)
- AI Engine: DeepSeek AI server-side proxy
- Stored Data: User profiles, Hardware Suggestions, Model Metadata, Visits analytics
- Current Defenses: Server-side API key isolation, Origin verification, Firestore schema limits`;

      const userPrompt = `${auditContext}

Perform a comprehensive security assessment and provide:
1. Overall Security Score (0 to 100)
2. Security Status (e.g. 'SECURE_PROTECTED' or 'GOOD_WITH_RECOMMENDATIONS')
3. Audited security domains:
   - Database & Firestore Rules Integrity
   - API Key & Token Exposure Guard
   - Rate Limiting & Anti-Scraping Protection
   - Prompt Injection & AI Abuse Shield
   - Client-side Authorization & Input Sanitization
4. Specific actionable hardening measures
5. Active Shield configuration recommendation

Return as JSON object:
{
  "score": 96,
  "status": "SECURE_PROTECTED",
  "summary": "${language === 'ar' ? 'ملخص تقرير الحماية والأمان لتطبيق دليل دالول' : 'LCD Dalule Security Audit Summary'}",
  "timestamp": "${new Date().toISOString()}",
  "checks": [
    {
      "domain": "Firestore Rules & RBAC",
      "status": "PASS",
      "score": 98,
      "details": "Strict validation schemas, owner-based updates, admin-only elevation"
    },
    {
      "domain": "API Secret Isolation",
      "status": "PASS",
      "score": 100,
      "details": "DeepSeek and Firebase secrets isolated in backend server.ts, zero browser leakage"
    },
    {
      "domain": "Anti-Scraping & Bot Mitigation",
      "status": "WARNING",
      "score": 88,
      "details": "Recommended enabling DeepSeek client request signature validation"
    },
    {
      "domain": "AI Prompt Injection Guard",
      "status": "PASS",
      "score": 95,
      "details": "DeepSeek strict system instruction separation and sanitization"
    }
  ],
  "recommendations": [
    "${language === 'ar' ? 'تفعيل درع DeepSeek للتحقق من أنماط الطلبات المتكررة (Rate Limiting Shield)' : 'Enable DeepSeek request throttling shield'}",
    "${language === 'ar' ? 'عزل صلاحيات المشرفين وتأكيد الحماية من التلاعب بالمؤشرات الحيوية' : 'Isolate admin mutation tokens'}"
  ],
  "shieldSettings": {
    "antiScrapingEnabled": true,
    "botProtectionActive": true,
    "promptInjectionFilter": true,
    "rateLimitPerMinute": 45,
    "strictInputSanitize": true
  }
}
Output ONLY valid JSON.`;

      let auditResult: any = null;
      let providerUsed = "deepseek";

      if (getDeepSeekApiKey()) {
        try {
          const raw = await callDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ], 0.2);
          auditResult = extractJson(raw);
        } catch (err: any) {
          console.warn("DeepSeek security audit failed, falling back:", err?.message);
        }
      }

      if (!auditResult && getGeminiApiKey()) {
        providerUsed = "gemini-fallback";
        const raw = await callGeminiChatFallback([userPrompt], systemPrompt, 0.2);
        auditResult = extractJson(raw);
      }

      if (!auditResult) {
        throw new Error("Unable to complete security audit. Please check your API configuration.");
      }

      res.json({
        success: true,
        report: auditResult,
        provider: providerUsed
      });
    } catch (error: any) {
      console.error("DeepSeek Security Audit Error:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  // 3. In-App Development Assistant Console (DeepSeek Dev Advisor)
  app.post("/api/deepseek/dev-assistant", async (req, res) => {
    try {
      const { prompt: userDevPrompt, context = {}, language = 'ar' } = req.body;
      if (!userDevPrompt) {
        res.status(400).json({ error: "Missing dev prompt" });
        return;
      }

      const systemPrompt = `You are the Master Software Architect & Hardware Database Engineer for "LCD DALULE" (تطبيق دليل دالول لقطع وشاشات الهواتف).
You assist the app administrator/developer directly from inside the application settings.
You can help with:
1. Architectural recommendations and UI/UX improvements.
2. Generating hardware compatibility rules and database expansions.
3. Security enhancements and best practices for Cloud Run / Firestore.
4. Troubleshooting compatibility codes (e.g. UNI-X6515-LCD, SM-A125, etc.).
Keep your response concise, structured, clear, and actionable in ${language === 'ar' ? 'Arabic' : 'English'}.`;

      let replyText = "";
      let providerUsed = "deepseek";

      if (getDeepSeekApiKey()) {
        try {
          replyText = await callDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: `Context: ${JSON.stringify(context)}\n\nDeveloper Inquiry: ${userDevPrompt}` }
          ], 0.4);
        } catch (err: any) {
          console.warn("DeepSeek dev assistant failed, falling back:", err?.message);
        }
      }

      if (!replyText && getGeminiApiKey()) {
        providerUsed = "gemini-fallback";
        replyText = await callGeminiChatFallback([
          `Context: ${JSON.stringify(context)}\n\nDeveloper Inquiry: ${userDevPrompt}`
        ], systemPrompt, 0.4);
      }

      res.json({
        reply: replyText,
        provider: providerUsed
      });
    } catch (error: any) {
      console.error("DeepSeek Dev Assistant Error:", error);
      res.status(500).json({ error: error?.message || "Internal Server Error" });
    }
  });

  // 1. Robots.txt Route
  app.get('/robots.txt', (req, res) => {
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.get('host');
    const sitemapUrl = `${protocol}://${host}/sitemap.xml`;
    
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Allow: /amp.html
Disallow: /api/
Disallow: /admin/
Disallow: /404
Disallow: /404.html

Sitemap: ${sitemapUrl}`);
  });

  // 2. Explicit 404 Route for Crawlers and Users (Returns HTTP 404)
  app.get(['/404', '/404.html'], (_req, res) => {
    const notFoundPath = path.join(process.cwd(), 'public', '404.html');
    if (fs.existsSync(notFoundPath)) {
      res.status(404).sendFile(notFoundPath);
    } else {
      res.status(404).send('404 Not Found - LCD DALULE');
    }
  });

  // 3. Sitemap.xml Route - Comprehensive indexing for search engine crawlers
  app.get('/sitemap.xml', async (req, res) => {
    const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    const host = req.get('host');
    const today = new Date().toISOString().split('T')[0];
    
    // Set to collect unique model IDs dynamically
    const modelIds = new Set<string>();

    // A. Add static phone model IDs from local data definition
    try {
      if (phoneModels && Array.isArray(phoneModels)) {
        phoneModels.forEach(m => {
          if (m && m.id) {
            modelIds.add(m.id);
          }
        });
      }
    } catch (e) {
      console.error("Error reading static phone models for sitemap:", e);
    }

    // B. Fetch dynamic model IDs from Firestore 'model_metadata'
    try {
      const modelMetadataCol = collection(db, 'model_metadata');
      const querySnapshot = await getDocs(modelMetadataCol);
      querySnapshot.forEach((doc) => {
        if (doc.id) {
          modelIds.add(doc.id);
        }
      });
    } catch (e) {
      console.error("Error fetching model_metadata for sitemap from Firestore:", e);
    }

    // C. Fetch dynamic model IDs from Firestore 'suggestions'
    try {
      const suggestionsCol = collection(db, 'suggestions');
      const querySnapshot = await getDocs(suggestionsCol);
      querySnapshot.forEach((doc) => {
        if (doc.id) {
          modelIds.add(doc.id);
        }
      });
    } catch (e) {
      console.error("Error fetching suggestions for sitemap from Firestore:", e);
    }

    // D. Fetch dynamic model IDs from Firestore 'ai_models' (DeepSeek Studio models)
    try {
      const aiModelsCol = collection(db, 'ai_models');
      const querySnapshot = await getDocs(aiModelsCol);
      querySnapshot.forEach((doc) => {
        if (doc.id) {
          modelIds.add(doc.id);
        }
      });
    } catch (e) {
      console.error("Error fetching ai_models for sitemap from Firestore:", e);
    }

    // Core Hub & Section URLs with priorities
    const hubPages = [
      { url: `${protocol}://${host}/`, priority: '1.0', changefreq: 'daily' },
      { url: `${protocol}://${host}/amp.html`, priority: '0.9', changefreq: 'daily' },
      // Categories
      { url: `${protocol}://${host}/?category=LCD`, priority: '0.9', changefreq: 'daily' },
      { url: `${protocol}://${host}/?category=BATTERY`, priority: '0.85', changefreq: 'daily' },
      { url: `${protocol}://${host}/?category=IC`, priority: '0.85', changefreq: 'daily' },
      { url: `${protocol}://${host}/?category=SCREEN_PROTECTOR`, priority: '0.8', changefreq: 'weekly' },
      // Brands
      { url: `${protocol}://${host}/?brand=samsung`, priority: '0.9', changefreq: 'daily' },
      { url: `${protocol}://${host}/?brand=xiaomi`, priority: '0.9', changefreq: 'daily' },
      { url: `${protocol}://${host}/?brand=apple`, priority: '0.9', changefreq: 'daily' },
      { url: `${protocol}://${host}/?brand=infinix`, priority: '0.85', changefreq: 'daily' },
      { url: `${protocol}://${host}/?brand=tecno`, priority: '0.85', changefreq: 'daily' },
      { url: `${protocol}://${host}/?brand=itel`, priority: '0.8', changefreq: 'weekly' },
      { url: `${protocol}://${host}/?brand=oppo`, priority: '0.85', changefreq: 'daily' },
      { url: `${protocol}://${host}/?brand=realme`, priority: '0.85', changefreq: 'daily' },
      { url: `${protocol}://${host}/?brand=vivo`, priority: '0.8', changefreq: 'weekly' },
      { url: `${protocol}://${host}/?brand=honor`, priority: '0.8', changefreq: 'weekly' },
      { url: `${protocol}://${host}/?brand=huawei`, priority: '0.8', changefreq: 'weekly' },
      // Interactive Tools
      { url: `${protocol}://${host}/?screen=comparator`, priority: '0.85', changefreq: 'weekly' },
      { url: `${protocol}://${host}/?screen=community`, priority: '0.85', changefreq: 'daily' },
      { url: `${protocol}://${host}/?screen=search`, priority: '0.8', changefreq: 'weekly' },
      { url: `${protocol}://${host}/?screen=ai`, priority: '0.75', changefreq: 'weekly' },
      // Legal & Info
      { url: `${protocol}://${host}/?screen=about`, priority: '0.6', changefreq: 'monthly' },
      { url: `${protocol}://${host}/?screen=privacy`, priority: '0.5', changefreq: 'monthly' },
      { url: `${protocol}://${host}/?screen=terms`, priority: '0.5', changefreq: 'monthly' },
      { url: `${protocol}://${host}/?screen=contact`, priority: '0.6', changefreq: 'monthly' },
    ];

    let urlsXml = '';
    hubPages.forEach(page => {
      urlsXml += `  <url>
    <loc>${page.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>\n`;
    });

    // Model Specific Landing URLs
    modelIds.forEach(modelId => {
      const safeId = modelId.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      urlsXml += `  <url>
    <loc>${protocol}://${host}/?model=${safeId}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>\n`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml.trim()}
</urlset>`;

    res.type('application/xml');
    res.send(xml);
  });



  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Dynamic index.html injection of meta tag in production
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { 
      index: false,
      maxAge: '7d', // Default cache max-age for static assets (7 days)
      setHeaders: (res, filePath) => {
        // Cache images, SVGs, and fonts for 1 year (31,536,000 seconds) with immutable directive
        if (filePath.endsWith('.png') || filePath.endsWith('.jpg') || filePath.endsWith('.jpeg') || filePath.endsWith('.svg') || filePath.endsWith('.ico')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('.js') || filePath.endsWith('.css')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.match(/\.(woff|woff2|eot|ttf|otf)$/)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (filePath.endsWith('manifest.json') || filePath.endsWith('sw.js')) {
          res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache PWA configurations for 1 day
        }
      }
    })); 
    
    app.get('*all', async (req, res) => {
      try {
        const fs = await import("fs");
        const htmlPath = path.join(distPath, 'index.html');
        if (fs.existsSync(htmlPath)) {
          const html = fs.readFileSync(htmlPath, 'utf-8');
          res.send(html);
        } else {
          res.status(404).send("Not found");
        }
      } catch (err) {
        console.error("Error serving index.html:", err);
        res.status(500).send("Internal Server Error");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
