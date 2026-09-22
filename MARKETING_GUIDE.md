# 🚀 Cẩm Nang Marketing & Tăng Trưởng Người Dùng Cho Extension LangSave

Tài liệu này được biên soạn độc quyền cho **LangSave**, tổng hợp toàn bộ chiến lược, kịch bản nội dung (copywriting templates), và lộ trình từng bước để đưa extension của bạn tiếp cận hàng nghìn người dùng thật trên **Chrome Web Store**, mạng xã hội và các cộng đồng học ngôn ngữ.

---

## 🎯 Chân Dung Khách Hàng Mục Tiêu (Target Audience)

Trước khi promote, cần hiểu rõ 3 nhóm người dùng có tỷ lệ cài đặt và gắn bó cao nhất với LangSave:

1. **Người dùng Anki & Spaced Repetition (Tỷ lệ chuyển đổi cao nhất ⭐⭐⭐)**:
   - *Đặc điểm*: Thường xuyên đọc sách báo tiếng Anh, có thói quen ôn từ qua flashcard hàng ngày. Cực kỳ ghét việc phải gõ thủ công từng từ vựng vào Anki.
   - *Điểm chạm*: Tính năng **1-click Export Anki CSV (UTF-8 BOM)**.
2. **Học sinh / Sinh viên luyện thi IELTS / TOEFL / TOEIC**:
   - *Đặc điểm*: Cần đọc rất nhiều bài báo học thuật (The Economist, National Geographic, BBC) và tài liệu PDF Cambridge. Cần tra nhanh phiên âm và nghĩa Anh-Anh mà không bị ngắt mạch đọc.
   - *Điểm chạm*: Phím tắt **`Alt + S`** và khả năng lưu từ trực tiếp trong **file PDF**.
3. **Lập trình viên / Dân văn phòng đọc tài liệu tiếng Anh hàng ngày**:
   - *Đặc điểm*: Đọc technical docs, Medium, GitHub. Muốn một công cụ nhẹ, không quảng cáo, tôn trọng quyền riêng tư (Offline-first).
   - *Điểm chạm*: **Manifest V3, 100% riêng tư, không cần đăng nhập**.

---

## 🏬 Phần 1: Tối Ưu Cửa Hàng Chrome Web Store (ASO - App Store Optimization)

Để extension tự động xuất hiện khi người dùng tìm kiếm từ khóa trên Chrome Web Store:

### 1. Đặt Tên Extension Chứa Từ Khóa
- ❌ *Không nên đặt*: `LangSave` (quá ngắn, thuật toán không hiểu tiện ích làm gì).
-  *Nên đặt*: `LangSave - Vocabulary Builder & Anki Exporter` hoặc `LangSave: Save Words & Export to Anki`.

### 2. Mô Tả Ngắn (Short Description - Dưới 132 ký tự)
> *"Save English words with definitions while reading articles & PDFs. One-click export to Anki flashcards & Excel."*

### 3. Bộ Ảnh Chụp Màn Hình (Screenshots 1280x800px)
Bạn nên thiết kế 4-5 ảnh slide bằng Canva hoặc Figma theo bố cục sau:
- **Slide 1**: Ảnh giao diện đang đọc một bài báo tiếng Anh $\rightarrow$ Bôi đen từ $\rightarrow$ Mũi tên chỉ phím tắt `Alt + S` $\rightarrow$ Thông báo *"Word saved successfully!"*.
- **Slide 2**: Ảnh chụp tính năng đặc biệt: Lưu từ ngay trong **Chrome PDF Viewer**.
- **Slide 3**: Popup giao diện mở ra: hiển thị danh sách từ, phiên âm IPA, định nghĩa, và ô ghi chú cá nhân (Custom notes).
- **Slide 4**: Nút bấm `Export Selected (CSV)` $\rightarrow$ Màn hình ứng dụng **Anki** đã nạp toàn bộ thẻ từ vựng.
- **Slide 5**: Huy hiệu cam kết: *100% Free • Offline-First • Zero Tracking • No Sign-Up*.

### 4. Chiến Thuật Kích Hoạt 20 Đánh Giá 5 Sao Đầu Tiên
- Thuật toán Chrome Web Store chỉ bắt đầu đề xuất extension lên top tìm kiếm khi tiện ích có **ít nhất 5-10 lượt đánh giá 5 sao**.
- **Hành động**: Ngay khi extension được Google duyệt, hãy gửi link cho bạn bè, người thân, đồng nghiệp nhờ họ cài đặt, bấm dùng thử 1 từ và để lại đánh giá kèm bình luận tích cực.

---

## 💬 Phần 2: Kịch Bản Đăng Bài Trên Các Cộng Đồng (Community Outreaches)

### Kênh 1: Reddit (Cực kỳ hiệu quả cho Anki & Language Learning)
Đăng vào các subreddit: **`r/Anki`** (150k+ thành viên), **`r/languagelearning`** (1.5M+ thành viên), **`r/EnglishLearning`**, **`r/chrome_extensions`**.

#### 📝 Mẫu bài đăng Reddit (Tiếng Anh tự nhiên, không mang tính chèo kéo bán hàng):

> **Title**: *I got tired of manually creating Anki cards while reading articles & PDFs, so I built a lightweight, privacy-friendly Chrome extension to automate it.*
>
> **Content**:
> 
> Hi everyone,
> 
> Whenever I read English articles or research papers in PDF format, I always run into the same friction: I encounter a new word, open a new tab to Google its definition, and lose my reading flow. By the weekend, I've forgotten all those words because manually copy-pasting them into Anki takes too much time.
> 
> To solve this, I built **LangSave** — a completely free, open-source Manifest V3 Chrome extension:
> 
> **How it works:**
> - Highlight any word on any webpage or **Chrome PDF Viewer** and hit **`Alt + S`**.
> - It automatically fetches the IPA phonetic transcription and clean English definition via the Free Dictionary API in the background.
> - You can add your own custom notes/examples inside the popup.
> - Click **Export Selected**, and it generates an Anki-compatible CSV file (with UTF-8 BOM encoding so it opens cleanly without font issues).
> 
> **Why I kept it privacy-first:**
> - No sign-up required.
> - Zero tracking or analytics. All words are saved locally in your browser (`chrome.storage.local`).
> 
> It's 100% free and open-source on GitHub: [Link GitHub của bạn]  
> Chrome Web Store link: [Link CWS của bạn]
> 
> Would love to hear your thoughts or feature requests to make it even better for the Anki community!

---

### Kênh 2: Facebook Groups (Cộng đồng tự học tiếng Anh / IELTS tại Việt Nam)
Đăng vào các nhóm: *Tự học IELTS 8.0, Nghiện Học Tiếng Anh, Tự Học Anki Việt Nam, Gen Z Luyện Tiếng Anh*.

#### 📝 Mẫu bài đăng Facebook (Gần gũi, chia sẻ kinh nghiệm học tập):

> 💡 **Tip tăng 500 từ vựng mỗi tháng khi đọc báo tiếng Anh & tài liệu PDF mà không bị "ngắt mạch đọc"**
> 
> Chào mọi người, ngày trước mỗi lần mình đọc báo (BBC, The Guardian) hoặc tài liệu PDF Cambridge, cứ gặp từ mới là lại phải: bôi đen $\rightarrow$ mở tab mới $\rightarrow$ Google Translate $\rightarrow$ quay lại đọc tiếp. Đọc xong 1 bài báo mà tab nhảy loạn xạ, vừa mất tập trung mà đến cuối tuần cũng quên sạch từ vựng.
> 
> Để khắc phục, mình đã tự lập trình một tiện ích mở rộng nhỏ gọn trên Chrome tên là **LangSave** để phục vụ việc học từ vựng nhanh hơn:
> 
> ✨ **Những tính năng mình làm riêng cho người học:**
> 1. Gặp từ mới chỉ cần bôi đen và bấm **`Alt + S`** (hoặc chuột phải): Extension tự động tra phiên âm IPA và định nghĩa Anh-Anh ngay lập tức.
> 2. **Đọc file PDF trên Chrome vẫn dùng được bình thường** (nhiều extension khác bị lỗi khi đọc PDF).
> 3. Cuối tuần bấm 1 nút **Export CSV**: Quăng thẳng file này vào ứng dụng **Anki** hoặc Quizlet để ôn tập theo phương pháp lặp lại ngắt quãng (Spaced Repetition).
> 4. Hoàn toàn miễn phí, không quảng cáo, không cần đăng nhập tài khoản.
> 
> Mình để link tải và mã nguồn mở cho các bạn trải nghiệm ở comment bên dưới nhé! Mọi người dùng thử và góp ý thêm để mình nâng cấp các bản sau nhé ❤️

---

## 🎬 Phần 3: Kịch Bản Video Ngắn (TikTok / Reels / YouTube Shorts)

Video ngắn là kênh mang lại lượng cài đặt bùng nổ nhanh nhất hiện nay cho các công cụ học tập.

### Kịch bản Video 20 giây: "Giải pháp cho người lười tra từ vựng"
- **0:00 - 0:03 (Hook)**:
  - *Hình ảnh*: Quay màn hình trình duyệt đang mở 15-20 tab Google Translate lộn xộn.
  - *Giọng lồng tiếng / Chữ trên màn hình*: *"Dừng ngay việc vừa đọc báo tiếng Anh vừa mở thêm cả chục tab Google Dịch làm đứt mạch đọc!"*
- **0:04 - 0:12 (Demo cách làm mới)**:
  - *Hình ảnh*: Đang đọc bài báo tiếng Anh $\rightarrow$ Bôi đen từ `serendipity` $\rightarrow$ Nhấn tổ hợp phím `Alt + S` $\rightarrow$ Góc màn hình hiện Toast báo đã lưu kèm phiên âm.
  - *Giọng lồng tiếng*: *"Chỉ cần bôi đen bấm Alt + S, tiện ích tự động lấy phiên âm IPA và định nghĩa chuẩn từ điển ngay trong nền."*
- **0:13 - 0:18 (Tính năng killer - Anki Export)**:
  - *Hình ảnh*: Bấm vào biểu tượng LangSave $\rightarrow$ Click `Export Selected` $\rightarrow$ Kéo file thả vào ứng dụng Anki $\rightarrow$ Mở ra một bộ thẻ Flashcard đẹp mắt.
  - *Giọng lồng tiếng*: *"Đặc biệt, cuối tuần bạn chỉ cần 1 click là xuất thẳng ra file để nhập vào Anki học lặp lại ngắt quãng."*
- **0:19 - 0:22 (Call To Action - Kêu gọi hành động)**:
  - *Hình ảnh*: Logo LangSave và link bio.
  - *Giọng lồng tiếng*: *"Tiện ích tên là LangSave, miễn phí 100% trên Chrome Web Store. Link mình để ở bio nhé!"*

---

## 🚀 Phần 4: Ra Mắt Trên Kênh Công Nghệ (Tech Launch)

### 1. Product Hunt
- Tạo bài đăng Product Hunt vào khung giờ **00:01 PST (khoảng 14:00 - 15:00 giờ Việt Nam)**:
  - **Tagline**: *Save vocabulary seamlessly while reading web articles & PDFs, export to Anki.*
  - **Categories**: Education, Chrome Extensions, Productivity.
  - Kêu gọi mạng lưới bạn bè trên LinkedIn/Facebook vào Upvote và để lại bình luận để lọt top Product of the Day.

### 2. Viết bài chia sẻ kỹ thuật trên Dev.to / Viblo / Medium
Viết một bài blog kỹ thuật không chỉ kéo người dùng mà còn là điểm cộng khổng lồ cho CV của bạn:
- **Tiêu đề gợi ý**:
  - *Tiếng Việt*: *"Cách tôi xây dựng Chrome Extension Manifest V3 xử lý trích xuất văn bản trên Chrome PDF Viewer và xuất thẻ Anki."*
  - *Tiếng Anh*: *"How I Built a Manifest V3 Chrome Extension to Bridge Web Reading and Anki Spaced Repetition."*
- **Nội dung tập trung**: Chia sẻ bài toán xử lý Service Worker trong Manifest V3, cách can thiệp vào `PDFViewerApplication` và `textLayer` của PDF.js, và cách tạo file CSV có UTF-8 BOM để Excel không lỗi font.

---

## 💼 Phần 5: Cách Đưa LangSave Vào CV / Portfolio Tuyển Dụng

Khi phỏng vấn ứng tuyển vị trí Frontend / Full-stack / Software Engineer, bạn hãy trình bày LangSave như một sản phẩm thực tế (Production-ready product):

```markdown
### Chrome Extension: LangSave — Seamless Vocabulary Acquisition (Creator & Lead Developer)
- Architected and published a Manifest V3 browser extension enabling real-time English vocabulary capture and automated Anki flashcard generation.
- Implemented robust DOM extraction algorithms overcoming sandboxed PDF.js TextLayers in Chrome PDF Viewer with intelligent clipboard fallbacks.
- Integrated Free Dictionary RESTful API to automatically query phonetics and lexical definitions with client-side caching in `chrome.storage.local`.
- Engineered an offline-first data management workflow featuring real-time fuzzy search, bulk editing, and UTF-8 BOM compliant CSV exporter.
- Successfully published to Chrome Web Store and engaged with online language learning communities (Reddit r/Anki).
```

---

<p align="center">
  <i>Hành động ngay: Bắt đầu từ việc gửi link cho 10 người bạn đầu tiên để nhận những đánh giá 5 sao khởi động!</i>
</p>
