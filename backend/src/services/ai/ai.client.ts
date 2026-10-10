import fs from "fs";
import path from "path";
import { config } from "../../config/env";
import { logger } from "../../utils/logger";

export class AiClient {
  private apiKey: string;
  private promptsDir: string;

  constructor() {
    this.apiKey = config.aiApiKey;
    this.promptsDir = path.resolve(__dirname, "../../../../prompts");
  }

  loadPrompt(templateName: string): string {
    const filePath = path.join(this.promptsDir, templateName);
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
    return "";
  }

  interpolatePrompt(template: string, vars: Record<string, string | number>): string {
    let result = template;
    for (const [key, val] of Object.entries(vars)) {
      result = result.replace(new RegExp(`{{${key}}}`, "g"), String(val));
    }
    return result;
  }

  async generateText(prompt: string, fallbackGenerator: () => string): Promise<string> {
    if (!this.apiKey) {
      logger.debug("AI API key not set; using pedagogical Socratic engine fallback");
      return fallbackGenerator();
    }

    try {
      // Direct call to Gemini REST API (or OpenAI compatible)
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.aiModel}:generateContent?key=${this.apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024
          }
        })
      });

      if (!response.ok) {
        throw new Error(`AI API responded with status ${response.status}`);
      }

      const json: any = await response.json();
      const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      return text || fallbackGenerator();
    } catch (err: any) {
      logger.warn(`AI API call failed (${err.message}); utilizing intelligent Socratic fallback`);
      return fallbackGenerator();
    }
  }
}

export const aiClient = new AiClient();
