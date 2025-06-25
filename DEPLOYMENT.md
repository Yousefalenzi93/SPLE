# دليل النشر - نظام امتحانات الصيدلة

هذا الدليل يوضح كيفية نشر المشروع على Netlify مع Firebase.

## 📋 المتطلبات المسبقة

- حساب Firebase مع مشروع مُعد
- حساب Netlify
- Git repository للمشروع

## 🔧 إعداد Firebase

### 1. إنشاء مشروع Firebase

1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. انقر "Create a project"
3. اتبع الخطوات لإنشاء المشروع

### 2. تفعيل الخدمات المطلوبة

#### Authentication
1. اذهب إلى Authentication > Sign-in method
2. فعل "Email/Password"
3. أضف domains المسموحة (localhost, netlify domain)

#### Firestore Database
1. اذهب إلى Firestore Database
2. انقر "Create database"
3. اختر "Start in test mode" (سنغير القواعد لاحقاً)
4. اختر المنطقة الأقرب

#### Storage
1. اذهب إلى Storage
2. انقر "Get started"
3. اتبع الخطوات

### 3. إعداد قواعد الأمان

#### Firestore Rules
انسخ المحتوى من `firestore.rules` إلى قواعد Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Questions - read for authenticated users, write for admins
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Exam sessions - users can read/write their own
    match /examSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Admin can read all
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 4. الحصول على إعدادات Firebase

1. اذهب إلى Project Settings
2. انقر "Add app" واختر Web
3. سجل التطبيق واحصل على config object

## 🌐 إعداد Netlify

### 1. ربط Repository

1. اذهب إلى [Netlify](https://netlify.com)
2. انقر "New site from Git"
3. اختر Git provider وربط repository
4. اختر branch (عادة main أو master)

### 2. إعدادات البناء

```
Build command: npm run build
Publish directory: out
```

### 3. متغيرات البيئة

أضف المتغيرات التالية في Site settings > Environment variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. إعدادات النطاق

1. اذهب إلى Site settings > Domain management
2. أضف custom domain إذا كان لديك
3. تأكد من إعداد HTTPS

## 🚀 عملية النشر

### النشر التلقائي

بمجرد ربط repository، سيتم النشر تلقائياً عند:
- Push إلى main branch
- Merge pull request

### النشر اليدوي

```bash
# بناء المشروع محلياً
npm run build

# نشر باستخدام Netlify CLI
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

## 🔍 اختبار النشر

### 1. اختبار الوظائف الأساسية

- [ ] تحميل الصفحة الرئيسية
- [ ] تسجيل مستخدم جديد
- [ ] تسجيل الدخول
- [ ] الوصول لصفحات محمية
- [ ] أداء امتحان تجريبي
- [ ] عرض النتائج

### 2. اختبار الأداء

```bash
# تشغيل Lighthouse audit
npm install -g lighthouse
lighthouse https://your-site.netlify.app --output html
```

### 3. اختبار الأمان

- تحقق من HTTPS
- اختبار قواعد Firebase
- فحص headers الأمان

## 🛠 استكشاف الأخطاء

### مشاكل شائعة

#### 1. خطأ في Firebase config
```
Error: Firebase configuration is invalid
```
**الحل**: تحقق من متغيرات البيئة في Netlify

#### 2. مشاكل في الـ routing
```
404 - Page not found
```
**الحل**: تأكد من وجود `netlify.toml` مع redirects

#### 3. مشاكل في البناء
```
Build failed
```
**الحل**: تحقق من:
- Node.js version (18+)
- Dependencies في package.json
- TypeScript errors

### سجلات النشر

1. اذهب إلى Netlify dashboard
2. انقر على site name
3. اذهب إلى "Deploys" tab
4. انقر على deploy للتفاصيل

## 📊 مراقبة الأداء

### Netlify Analytics

1. فعل Netlify Analytics في dashboard
2. راقب:
   - Page views
   - Unique visitors
   - Top pages
   - Bandwidth usage

### Firebase Analytics

1. فعل Google Analytics في Firebase
2. أضف tracking code للمشروع
3. راقب user behavior

## 🔄 التحديثات والصيانة

### تحديث التبعيات

```bash
# فحص التحديثات
npm outdated

# تحديث التبعيات
npm update

# تحديث major versions
npm install package@latest
```

### النسخ الاحتياطية

1. **قاعدة البيانات**: استخدم Firebase export
```bash
firebase firestore:export gs://your-bucket/backups/$(date +%Y%m%d)
```

2. **الكود**: Git repository يعتبر backup

### مراقبة الأخطاء

استخدم خدمات مثل:
- Sentry للـ error tracking
- LogRocket للـ session replay
- Firebase Crashlytics

## 📞 الدعم

للمساعدة في النشر:

1. **Netlify Support**: [support.netlify.com](https://support.netlify.com)
2. **Firebase Support**: [firebase.google.com/support](https://firebase.google.com/support)
3. **Community**: Stack Overflow مع tags `netlify` و `firebase`

## ✅ Checklist النشر

- [ ] إعداد Firebase project
- [ ] تطبيق Security rules
- [ ] إعداد متغيرات البيئة
- [ ] اختبار البناء محلياً
- [ ] ربط repository مع Netlify
- [ ] تكوين build settings
- [ ] اختبار النشر
- [ ] إعداد custom domain (اختياري)
- [ ] تفعيل HTTPS
- [ ] اختبار جميع الوظائف
- [ ] إعداد monitoring
- [ ] توثيق العملية

---

**ملاحظة**: احتفظ بنسخة من إعدادات Firebase في مكان آمن للطوارئ.
