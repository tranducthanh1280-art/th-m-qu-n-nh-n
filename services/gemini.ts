
import { GoogleGenAI } from "@google/genai";
import { VisitRequest, UnitSchedule } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY}); strictly as required.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSmartAdvice = async (request: VisitRequest, schedules: UnitSchedule[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        Dựa trên lịch công tác đơn vị: ${JSON.stringify(schedules)}
        Và yêu cầu thăm của: ${request.visitorName} thăm quân nhân ${request.soldierName} vào ${request.visitDate} (${request.timeSlot}).
        
        Hãy đưa ra lời khuyên ngắn gọn cho cán bộ:
        1. Có trùng lịch huấn luyện/trực chiến không?
        2. Nếu trùng, gợi ý khung giờ khác phù hợp trong cùng tuần.
        3. Lưu ý về kỷ luật (ví dụ: cần mang CCCD, không mang chất cấm).
        
        Phản hồi bằng tiếng Việt, súc tích dưới 100 từ.
      `,
    });
    // Use .text property directly to access the extracted string.
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Không thể lấy tư vấn từ AI vào lúc này.";
  }
};
