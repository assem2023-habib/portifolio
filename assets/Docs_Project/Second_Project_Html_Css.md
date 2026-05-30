<div align="center">

# Kasper | قالب HTML/CSS الثاني

<p align="center">
  <img src="image/logo.png" alt="Kasper Logo" width="100" height="100"/>
</p>

**قالب موقع وكالة إبداعية احترافي بـ HTML و CSS فقط - من دروس Elzero Web School**

<p align="center">
  <img src="https://assem2023-habib.github.io/KasperPro/" alt="Kasper Live Demo" width="90%"/>
</p>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white)](https://fontawesome.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[العربية](#) | [English](#english-version)

---

</div>

## نظرة عامة

**Kasper (Template Two)** هو قالب موقع وكالة إبداعية متكامل مطوّر باستخدام HTML و CSS فقط. القالب مبني على سلسلة دروس Elzero Web School ويتميز بتصميم عصري ونظيف مناسب للوكالات الإبداعية، والمصممين، ومواقع المحافظ الفنية.

### أقسام الموقع

| القسم | الوصف |
|-------|-------|
| **Header** | شعار + قائمة تنقل + أيقونة بحث |
| **Landing** | صفحة ترحيب مع خلفية كاملة وتأثير overlay ونصوص دعوة للعمل |
| **Services** | عرض 4 خدمات أيقونية (Desktop, Settings, Design, Photography) |
| **Design** | تصميم جانبي مع صورة موبايل وقائمة مميزات التصميم |
| **Portfolio** | معرض صور قابل للتصفيف مع 8 أعمال وعناوين |
| **Video** | مقطع فيديو خلفية مع نص دعوي وزر |
| **About** | صورة توضيحية عن الشركة |
| **Stats** | إحصائيات (Coffee, Projects, Mail, Awards) |
| **Testimonials & Skills** | آراء العملاء + شريط تقدم المهارات (Adobe, HTML/CSS, JS, PHP) |
| **Quote** | اقتباس تحفيزي مع خلفية |
| **Pricing** | 4 خطط (Basic, Premium, Pro, Platinum) مع جدول مميزات |
| **Subscribe** | نموذج اشتراك بريدي |
| **Contact** | نموذج اتصال + معلومات العنوان |
| **Footer** | حقوق النشر وروابط التواصل الاجتماعي |

---

## المعاينة الحية

🌐 **المعاينة الحية:** [https://assem2023-habib.github.io/KasperPro/](https://assem2023-habib.github.io/KasperPro/)

📂 **مستودع الكود:** [https://github.com/assem2023-habib/KasperPro](https://github.com/assem2023-habib/KasperPro)

---

## المميزات

- **تصميم متجاوب بالكامل** يدعم جميع أحجام الشاشات (Mobile, Tablet, Desktop)
- **كود نظيف ومنظم** مع تعليقات بالعربية
- **أيقونات Font Awesome 6** مجانية
- **خط Open Sans** من Google Fonts
- **تأثيرات Hover** وتفاعلات انسيابية
- **Flexbox و Grid** في تطبيقات عملية
- **سهولة التخصيص** عبر متغيرات CSS

---

## هيكل المشروع

```
KasperPro/
├── index.html                    # الصفحة الرئيسية (جميع الأقسام)
├── css/
│   ├── normalize.css             # إعادة تعيين الأنماط
│   └── kasper.css                # التنسيقات الرئيسية (991 سطر)
├── image/                        # الصور والفيديو
│   ├── logo.png                  # شعار الموقع
│   ├── landing.jpg               # خلفية القسم الترحيبي
│   ├── shuffle-01~08.jpg         # صور المعرض
│   ├── skills-01~02.jpg          # صور الشهادات
│   ├── about.png                 # صورة قسم عن الشركة
│   ├── mobile.png                # صورة الهاتف
│   ├── design-features.jpg       # خلفية قسم التصميم
│   ├── stats.png                 # خلفية الإحصائيات
│   ├── quote.jpg                 # خلفية الاقتباس
│   ├── subscribe.jpg             # خلفية الاشتراك
│   └── awesome-video.mp4         # فيديو خلفية
├── fontawesome-free-6.4.0-web/   # مكتبة Font Awesome
└── README.md                     # هذا الملف
```

---

## النظام اللوني

```css
:root {
  --main-color: #19c8fa;            /* اللون الأساسي (أزرق فاتح) */
  --transparent-color: rgb(15 116 143 / 70%);  /* طبقة شفافة */
  --section-padding: 100px;         /* المسافة القياسية للفواصل */
}
```

---

## التقنيات المستخدمة

- **HTML5** – هيكل دلالي متقدم
- **CSS3** – تنسيقات حديثة (Flexbox, Grid, Media Queries, Variables)
- **Font Awesome 6.4.0** – أيقونات متجهة
- **Normalize.css** – توحيد الأنماط عبر المتصفحات
- **Google Fonts (Open Sans)** – خط احترافي

---

## كيفية التشغيل

### المتطلبات الأساسية

- متصفح ويب حديث (Chrome, Firefox, Edge, Safari)
- أي محرر نصوص (VS Code, Sublime, Atom)

### التشغيل المحلي

```bash
# استنساخ المشروع
git clone https://github.com/assem2023-habib/KasperPro.git

# الدخول إلى المجلد
cd KasperPro

# فتح الملف في المتصفح
start index.html
```

### باستخدام VS Code Live Server

```bash
# تثبيت extension Live Server
# ثم الضغط على Go Live من شريط الحالة
```

---

## التخصيص

- **تغيير الألوان**: عدّل المتغيرات في `:root` داخل ملف `css/kasper.css`
- **تغيير المحتوى**: عدّل النصوص والروابط في ملف `index.html`
- **تغيير الصور**: استبدل الصور في مجلد `image/` مع الحفاظ على نفس الأسماء
- **إضافة أيقونات**: استخدم كلاسات Font Awesome من [موقع Font Awesome](https://fontawesome.com)

---

## روابط مهمة

- 🌐 **المعاينة الحية:** [assem2023-habib.github.io/KasperPro](https://assem2023-habib.github.io/KasperPro/)
- 📂 **مستودع الكود:** [github.com/assem2023-habib/KasperPro](https://github.com/assem2023-habib/KasperPro)
- 📖 **قائمة تشغيل الكورس الأصلي:** [YouTube Playlist](https://www.youtube.com/watch?v=4OGWPn-Q__I&list=PLDoPjvoNmBAyGaRGzPVZCkYx5L7Mo9Tbh)
- 🏫 **قناة Elzero Web School:** [YouTube](https://www.youtube.com/@ElzeroWebSchool)
- 👨‍🏫 **موقع الأستاذ أسامة الزيرو:** [Elzero.org](https://elzero.org)

---

<div align="center">

**تم التطوير بواسطة Osama Elzero | قناة Elzero Web School**

⭐ إذا أعجبك القالب، لا تنسى وضع نجمة على GitHub!

</div>

---

# English Version

<div align="center">

## Kasper - HTML/CSS Template Two

**Professional Creative Agency Template built with pure HTML & CSS**

</div>

### Overview

**Kasper** is a complete creative agency website template built with pure HTML and CSS as part of the Elzero Web School tutorial series. It features a modern, clean design suitable for creative agencies, designers, and portfolio websites.

### Sections

| Section | Description |
|---------|-------------|
| **Header** | Logo, navigation menu, search icon |
| **Landing** | Full-screen hero with overlay and CTA text |
| **Services** | 4 icon-based services (Desktop, Settings, Design, Photography) |
| **Design** | Side design showcase with mobile image and feature list |
| **Portfolio** | Filterable image gallery with 8 items |
| **Video** | Background video with overlay text and button |
| **About** | Company illustration |
| **Stats** | Statistics counters (Coffee, Projects, Mail, Awards) |
| **Testimonials & Skills** | Client reviews + skill progress bars |
| **Quote** | Motivational quote with background |
| **Pricing** | 4 pricing plans (Basic, Premium, Pro, Platinum) |
| **Subscribe** | Email subscription form |
| **Contact** | Contact form with address info |
| **Footer** | Copyright and social media links |

### Live Demo

🌐 **Live Preview:** [https://assem2023-habib.github.io/KasperPro/](https://assem2023-habib.github.io/KasperPro/)

📂 **Source Code:** [https://github.com/assem2023-habib/KasperPro](https://github.com/assem2023-habib/KasperPro)

### Features

- Fully responsive design (mobile, tablet, desktop)
- Clean, organized code with comments
- Font Awesome 6 icons
- Open Sans font from Google Fonts
- Smooth hover effects and transitions
- Flexbox and Grid layout
- Easy customization via CSS variables

### Project Structure

```
KasperPro/
├── index.html                    # Main HTML file (all sections)
├── css/
│   ├── normalize.css             # CSS reset
│   └── kasper.css                # Main stylesheet (991 lines)
├── image/                        # Images and video
├── fontawesome-free-6.4.0-web/   # Font Awesome library
└── README.md                     # This file
```

### Quick Start

```bash
git clone https://github.com/assem2023-habib/KasperPro.git
cd KasperPro
# Open index.html in your browser
```

### Color System

```css
:root {
  --main-color: #19c8fa;
  --transparent-color: rgb(15 116 143 / 70%);
  --section-padding: 100px;
}
```

### Technologies

- HTML5
- CSS3 (Flexbox, Grid, Media Queries, Variables)
- Font Awesome 6.4.0
- Normalize.css
- Google Fonts (Open Sans)

### Tutorial

Watch the full tutorial series on YouTube: [Playlist Link](https://www.youtube.com/watch?v=4OGWPn-Q__I&list=PLDoPjvoNmBAyGaRGzPVZCkYx5L7Mo9Tbh)

---

<div align="center">

**Built by Osama Elzero | Elzero Web School**

</div>
