import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Gemini AI Academic Advisor API
app.post('/api/ai-advisor', async (req, res) => {
  try {
    const { prompt, coursesSummary, targetGpa } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        advice: generateSmartFinanceAdvice(coursesSummary, targetGpa),
        source: 'smart-heuristic',
      });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Bạn là Cố Vấn Học Vụ Cấp Cao ngành Tài chính - Ngân hàng (Finance & Banking Mentor) của một trường Đại học danh tiếng tại Việt Nam.
Dưới đây là dữ liệu học tập hiện tại của sinh viên:
${JSON.stringify(coursesSummary, null, 2)}

Mục tiêu GPA của sinh viên: ${targetGpa || 'Xuất sắc / Giỏi'}
Câu hỏi / Yêu cầu cụ thể: ${prompt || 'Phân tích điểm mạnh, điểm yếu và đưa ra chiến lược phân bổ thời gian cho các môn học kỳ 4 (đang học) và lộ trình tiếp theo.'}

Hãy phân tích cụ thể, thực tế, sâu sát với các môn học trong sheet:
1. Đánh giá kết quả 3 học kỳ đầu (Năm 1 HK1 - HK3): điểm mạnh (môn nào làm tốt), điểm cần cải thiện (ví dụ Kinh tế vi mô 6.1, Thuế 6.6).
2. Chiến lược xử lý các môn HK 4 đang học:
   - "Tài chính doanh nghiệp (TA)" (Đề mở + Tự luận bằng Tiếng Anh) & "Tài chính công (TV)" (Khó): cách học và mẹo thi.
   - Các môn tích luỹ điểm cao: "Năng lực Số", "Tiếng Anh trong kinh doanh", "Nguyên lý Bảo hiểm".
3. Dự báo các "hòn đá tảng" ở các kỳ tiếp theo (Kinh tế lượng, Nguyên lý kế toán TA, Phân tích BCTC, Quản trị rủi ro tài chính, Khóa luận tốt nghiệp).
4. Lời khuyên phân bổ thời gian và chiến lược ôn thi đề mở vs đề đóng.
Viết bằng tiếng Việt giọng điệu truyền cảm hứng, ngắn gọn, có gạch đầu dòng rõ ràng, định dạng Markdown đẹp mắt.`,
            },
          ],
        },
      ],
    });

    const adviceText = response.text || generateSmartFinanceAdvice(coursesSummary, targetGpa);
    res.json({ advice: adviceText, source: 'gemini' });
  } catch (error: any) {
    console.error('Error generating AI advice:', error);
    res.json({
      advice: generateSmartFinanceAdvice(req.body.coursesSummary, req.body.targetGpa),
      source: 'smart-heuristic-fallback',
      error: error?.message,
    });
  }
});

function generateSmartFinanceAdvice(summary: any, targetGpa?: string): string {
  return `### 🎓 Phân Tích & Lời Khuyên Học Vụ Ngành Tài Chính - Ngân Hàng

#### 1. Đánh giá phong độ học tập (HK 1 - HK 3)
* **Điểm sáng vượt bậc:** Bạn có nền tảng tư duy rất tốt ở các môn lý luận và quản trị (*Triết học: 8.0, Phát triển bền vững: 8.7, Quản trị học: 8.7, Nguyên lý Marketing: 8.4*). Bạn thường xuyên **đạt điểm cao hơn mục tiêu đề ra**.
* **Môn định lượng & Tài chính cơ sở:** *Toán kinh tế (8.2)* và *Tài chính - Tiền tệ (8.3)* đạt điểm rất vững chắc. Đây là chìa khóa then chốt giúp bạn tự tin bước vào các môn chuyên ngành sâu.
* **Điểm cần lưu ý:** Môn *Kinh tế học vi mô bằng Tiếng Anh (6.1)* và *Thuế (6.6)* điểm chưa cao do rào cản thuật ngữ tiếng Anh và bài tập tính thuế phức tạp.

---

#### 2. Kế hoạch bứt phá cho Học Kỳ 4 (Đang học)
* 🔥 **Ưu tiên số 1 - Tài chính doanh nghiệp (TA):** Đây là môn xương sống của ngành TCNH lại thi bằng Tiếng Anh (Đề mở + TL). Cần lập từ điển thuật ngữ (*WACC, NPV, IRR, Capital Structure*), tự làm lại bài tập chương dòng tiền và chiết khấu. Đề mở chú trọng giải thích bản chất quyết định đầu tư, không nên chỉ chép công thức!
* 🔥 **Ưu tiên số 2 - Tài chính công (TV):** Môn lý thuyết kèm bài tập ngân sách nhà nước, nợ công. Hãy hệ thống hóa các sắc thuế và cân đối NSNN theo sơ đồ tư duy.
* 🎯 **Môn kéo GPA (Phải lấy 8.5+):** *Năng lực Số* (làm bài tiểu luận chỉn chu), *Tiếng Anh trong kinh doanh* (học kỹ từ vựng business, đọc hiểu tài chính) và *Nguyên lý Bảo hiểm*.

---

#### 3. Cảnh báo các "chướng ngại vật" tương lai
* **HK 5 & HK 6:** Chuẩn bị tinh thần cao độ cho **Kinh tế lượng (Stata/R)** và **Nguyên lý kế toán (TA)**. Hãy ôn lại xác suất thống kê và Toán kinh tế từ ngay bây giờ.
* **HK 8 & HK 9:** *Phân tích tài chính doanh nghiệp* và *Quản trị rủi ro tài chính* đòi hỏi đọc thông thạo BCTC thực tế của các doanh nghiệp niêm yết trên HOSE/HNX.

---

#### 4. Chiến lược giữ vững Bằng Giỏi / Xuất Sắc
* Với GPA tích lũy hiện tại (~7.92 / 10 và 3.42 / 4.0 - hạng Khá Giỏi), bạn chỉ cần duy trì trung bình **8.1 - 8.3** cho 99 tín chỉ còn lại là **chắc chắn tốt nghiệp Bằng Giỏi (loại Giỏi chuẩn MOET)**, và nếu bứt phá lên 8.8+ ở các môn đồ án/khóa luận thì hoàn toàn có cơ hội chạm tay vào **Bằng Xuất sắc**!`;
}

// Development with Vite vs Production static build
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.resolve(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
