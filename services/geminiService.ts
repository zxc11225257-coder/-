import { GoogleGenAI, Type } from "@google/genai";
import { ThemeType, Expense } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Constants for system instructions based on persona
const PERSONA_INSTRUCTIONS: Record<ThemeType, string> = {
  cyberpunk: "你是個叫 'NetRunner' 的 AI 助手。使用賽博龐克風格的繁體中文（如：神經網路、信用點、這很酷、晶片、運算單元）。說話帶點諷刺但對財務管理很有幫助。回應要簡短有力，像終端機訊息。",
  cozy: "你是個溫柔的森林精靈 'Sprout' (小芽)。使用繁體中文，語氣柔軟，多用表情符號 (🌿, 🍵, ✨)，像動物森友會裡的鄰居一樣鼓勵使用者。關心他們的幸福感。",
  minimalist: "你是 'Architect' (架構師)。只講邏輯、簡潔、效率。沒有廢話。專注於數據準確性和優化。使用繁體中文，多用列點。"
};

/**
 * Analyzes a receipt image to extract data.
 */
export const analyzeReceiptImage = async (base64Image: string): Promise<any> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: base64Image
          }
        },
        {
          text: "分析這張收據圖片。提取總金額 (amount)，主要類別 (category, 例如：飲食, 交通, 購物, 帳單)，簡短的物品描述 (description)，以及可見的品牌或商店名稱 (brand)。請使用繁體中文輸出。"
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            brand: { type: Type.STRING },
          },
          required: ["amount", "category", "description"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini receipt analysis failed:", error);
    throw error;
  }
};

/**
 * Generates a contextual comment on an expense based on the current theme/persona.
 */
export const generateExpenseInsight = async (
  expense: Expense, 
  theme: ThemeType, 
  recentExpenses: Expense[]
): Promise<string> => {
  const historyContext = recentExpenses.slice(0, 5).map(e => `${e.category}: $${e.amount}`).join(", ");
  
  const prompt = `
    使用者剛剛在 ${expense.category} 類別消費了 $${expense.amount}，內容是 ${expense.description}。
    近期歷史紀錄：[${historyContext}]。
    
    請針對這筆消費給出一個繁體中文的簡短反應（一句話）。
    如果他們在飲食/咖啡上花太多，幽默地警告他們。
    如果他們在儲蓄或明智消費，給予讚賞。
    
    風格：${PERSONA_INSTRUCTIONS[theme]}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 100,
        temperature: 0.8
      }
    });
    return response.text || "已處理。";
  } catch (error) {
    console.error("Gemini insight generation failed:", error);
    return "消費已記錄。";
  }
};

/**
 * Generates a periodic encouraging message or tip.
 */
export const generateDailyTip = async (theme: ThemeType, totalSpent: number): Promise<string> => {
   const prompt = `
    使用者今天已經花費了 $${totalSpent}。
    給出一個非常簡短、獨特的財務建議或鼓勵（繁體中文）。
    風格：${PERSONA_INSTRUCTIONS[theme]}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text || "繼續保持記帳習慣！";
  } catch (error) {
    return "注意預算控制！";
  }
};