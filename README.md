# نظام امتحانات الصيدلة للهيئة السعودية للتخصصات الصحية

منصة تحضير شاملة لامتحان ترخيص الصيدلة للهيئة السعودية للتخصصات الصحية (SCFHS).

## 🚀 المميزات

- **امتحانات تجريبية كاملة**: قسمين بـ 110 سؤال لكل قسم
- **بنك أسئلة شامل**: مصنف حسب المجالات الأربعة
- **تحليلات مفصلة**: تقارير الأداء ونقاط القوة والضعف
- **محتوى سعودي متخصص**: أسئلة تتماشى مع اللوائح المحلية
- **واجهة عربية**: دعم كامل للغة العربية مع RTL

## 🛠 التقنيات المستخدمة

- **Frontend**: Next.js 14 مع TypeScript
- **التصميم**: Tailwind CSS
- **قاعدة البيانات**: Firebase Firestore
- **المصادقة**: Firebase Authentication
- **التخزين**: Firebase Storage
- **النشر**: Netlify

## 📋 متطلبات النظام

- Node.js 18+ 
- npm أو yarn
- حساب Firebase

## ⚙️ الإعداد والتثبيت

### 1. استنساخ المشروع

```bash
git clone https://github.com/your-username/sple-exam-system.git
cd sple-exam-system
```

### 2. تثبيت التبعيات

```bash
npm install
# أو
yarn install
```

### 3. إعداد Firebase

1. إنشاء مشروع جديد في [Firebase Console](https://console.firebase.google.com/)
2. تفعيل Authentication و Firestore Database و Storage
3. نسخ إعدادات Firebase

### 4. متغيرات البيئة

انسخ ملف `.env.local.example` إلى `.env.local` وأضف إعدادات Firebase:

```bash
cp .env.local.example .env.local
```

املأ المتغيرات في `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 5. تشغيل المشروع

```bash
npm run dev
# أو
yarn dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح.

### 6. إعداد Firebase (مطلوب)

📖 **اتبع الدليل التفصيلي في `FIREBASE_SETUP.md`** أو:

1. إنشاء مشروع Firebase جديد
2. تفعيل Authentication و Firestore و Storage
3. تطبيق قواعد الأمان
4. إضافة إعدادات Firebase لملف `.env.local`

### 7. إنشاء المسؤول الأولي

```bash
# اذهب إلى صفحة إعداد المسؤول
http://localhost:3000/setup-admin
```

أو استخدم `/admin/test-firebase` لاختبار الاتصال بـ Firebase.

## 🗄️ هيكل قاعدة البيانات

### مجموعات Firestore:

- **users**: معلومات المستخدمين والملفات الشخصية
- **questions**: بنك الأسئلة مع التصنيفات
- **examSessions**: جلسات الامتحانات والنتائج
- **userProgress**: تتبع تقدم المستخدمين

## 🔒 Firebase Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Questions are read-only for students, write for admins
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Exam sessions belong to users
    match /examSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // User progress belongs to users
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 النشر على Netlify

### 1. إعداد متغيرات البيئة في Netlify

في لوحة تحكم Netlify، أضف متغيرات البيئة نفسها الموجودة في `.env.local`.

### 2. إعدادات البناء

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## 🧪 الاختبار

```bash
# تشغيل الاختبارات
npm test

# تشغيل Firebase Emulator للتطوير
firebase emulators:start
```

## 📚 المجالات الأكاديمية

1. **العلوم الطبية الحيوية الأساسية (10%)**
   - علم التشريح والفسيولوجيا
   - علم الأدوية والسموم
   - علم الأحياء الدقيقة والمناعة

2. **العلوم الصيدلانية (35%)**
   - الكيمياء الصيدلانية
   - علم الأدوية الصيدلاني
   - تقنية الصيدلة

3. **العلوم الاجتماعية/السلوكية/الإدارية (20%)**
   - أخلاقيات المهنة
   - إدارة الصيدلية
   - التواصل مع المرضى

4. **العلوم السريرية (35%)**
   - العلاج الدوائي
   - الرعاية الصيدلانية
   - مراقبة الأدوية

## 🔧 استكشاف الأخطاء

إذا واجهت مشاكل، راجع `TROUBLESHOOTING.md` للحلول الشائعة أو:

### مشاكل شائعة:
- **Firebase configuration is invalid**: تحقق من ملف `.env.local`
- **Missing permissions**: راجع قواعد Firestore
- **Network errors**: تحقق من اتصال الإنترنت وإعدادات Firebase

### أدوات التشخيص:
- `/admin/test-firebase` - اختبار شامل لـ Firebase
- Browser Console - للأخطاء التفصيلية
- Firebase Console - لمراقبة الاستخدام

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة [دليل المساهمة](CONTRIBUTING.md) قبل البدء.

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

## 📞 الدعم

للدعم الفني والاستفسارات:
- البريد الإلكتروني: support@sple-exam.com
- GitHub Issues: [إنشاء مشكلة جديدة](https://github.com/your-username/sple-exam-system/issues)

---

**ملاحظة**: هذا المشروع مخصص للأغراض التعليمية ولا يحل محل الدراسة الرسمية أو المراجع المعتمدة.
