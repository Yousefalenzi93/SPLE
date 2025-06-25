# دليل استكشاف الأخطاء - نظام امتحانات الصيدلة

## 🔧 المشاكل الشائعة وحلولها

### 1. مشاكل Firebase Configuration

#### ❌ خطأ: `Firebase configuration is invalid`
```
Error: Firebase: Error (app/invalid-api-key)
```

**الأسباب المحتملة:**
- ملف `.env.local` غير موجود
- قيم Firebase غير صحيحة
- متغيرات البيئة لا تبدأ بـ `NEXT_PUBLIC_`

**الحلول:**
1. تأكد من وجود ملف `.env.local` في جذر المشروع
2. انسخ الإعدادات من Firebase Console بدقة
3. تأكد من أن جميع المتغيرات تبدأ بـ `NEXT_PUBLIC_`
4. أعد تشغيل الخادم بعد تعديل `.env.local`

```bash
# إعادة تشغيل الخادم
npm run dev
```

---

### 2. مشاكل Firebase Authentication

#### ❌ خطأ: `auth/configuration-not-found`
```
FirebaseError: Firebase: Error (auth/configuration-not-found)
```

**الحلول:**
1. تأكد من تفعيل Authentication في Firebase Console
2. فعل طريقة Email/Password في Sign-in methods
3. أضف النطاق المحلي في Authorized domains:
   - `localhost`
   - `127.0.0.1`

#### ❌ خطأ: `auth/unauthorized-domain`
```
FirebaseError: Firebase: Error (auth/unauthorized-domain)
```

**الحل:**
1. اذهب إلى Firebase Console > Authentication > Settings
2. في تبويب "Authorized domains"
3. أضف النطاقات التالية:
   - `localhost`
   - `your-netlify-domain.netlify.app`

---

### 3. مشاكل Firestore Database

#### ❌ خطأ: `Missing or insufficient permissions`
```
FirebaseError: Missing or insufficient permissions
```

**الأسباب:**
- قواعد الأمان صارمة جداً
- المستخدم غير مصادق عليه
- دور المستخدم غير صحيح

**الحلول:**
1. تحقق من قواعد Firestore:
```javascript
// قواعد مؤقتة للاختبار (غير آمنة للإنتاج)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

2. تأكد من تسجيل دخول المستخدم
3. تحقق من دور المستخدم في مجموعة `users`

#### ❌ خطأ: `The query requires an index`
```
FirebaseError: The query requires an index
```

**الحل:**
1. انقر على الرابط في رسالة الخطأ
2. سيفتح Firebase Console لإنشاء الفهرس تلقائياً
3. انتظر حتى اكتمال بناء الفهرس

---

### 4. مشاكل Firebase Storage

#### ❌ خطأ: `storage/unauthorized`
```
FirebaseError: Firebase Storage: User does not have permission
```

**الحل:**
1. تحقق من قواعد Storage:
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

---

### 5. مشاكل Next.js Build

#### ❌ خطأ: `Module not found`
```
Error: Module not found: Can't resolve '@/lib/firebase'
```

**الحلول:**
1. تحقق من ملف `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

2. تأكد من وجود الملفات في المسارات الصحيحة

#### ❌ خطأ: `TypeError: Cannot read properties of undefined`
```
TypeError: Cannot read properties of undefined (reading 'auth')
```

**الحل:**
تأكد من تهيئة Firebase قبل الاستخدام:
```typescript
// في src/lib/firebase.ts
import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  // ... your config
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
```

---

### 6. مشاكل الشبكة والاتصال

#### ❌ خطأ: `Network request failed`
```
FirebaseError: Firebase: Error (network-request-failed)
```

**الحلول:**
1. تحقق من اتصال الإنترنت
2. تحقق من إعدادات Firewall
3. جرب VPN إذا كان هناك حجب للخدمة
4. تحقق من حالة خدمات Firebase: [status.firebase.google.com](https://status.firebase.google.com)

---

### 7. مشاكل التطوير المحلي

#### ❌ خطأ: `CORS policy`
```
Access to fetch blocked by CORS policy
```

**الحل:**
هذا طبيعي في التطوير المحلي. تأكد من:
1. استخدام `http://localhost:3000` وليس `127.0.0.1`
2. إضافة localhost في Authorized domains

#### ❌ خطأ: `Hydration failed`
```
Error: Hydration failed because the initial UI does not match
```

**الحل:**
```typescript
// استخدم useEffect للكود الذي يعتمد على المتصفح
useEffect(() => {
  // كود يعتمد على المتصفح هنا
}, [])
```

---

### 8. مشاكل النشر على Netlify

#### ❌ خطأ: `Build failed`
```
Build script returned non-zero exit code: 1
```

**الحلول:**
1. تحقق من متغيرات البيئة في Netlify
2. تأكد من وجود جميع التبعيات في `package.json`
3. تحقق من إعدادات البناء:
   - Build command: `npm run build`
   - Publish directory: `out`

#### ❌ خطأ: `Page not found` بعد النشر
**الحل:**
تأكد من وجود ملف `netlify.toml` مع redirects:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## 🛠 أدوات التشخيص

### 1. فحص إعدادات Firebase
```bash
# في المتصفح Console
console.log(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID)
```

### 2. اختبار الاتصال
استخدم صفحة `/admin/test-firebase` لاختبار شامل

### 3. فحص قواعد الأمان
استخدم Firebase Rules Simulator في Console

### 4. مراقبة الشبكة
افتح Developer Tools > Network لمراقبة الطلبات

---

## 📞 الحصول على المساعدة

### 1. سجلات الأخطاء
```javascript
// في المتصفح Console
console.error('Error details:', error)
```

### 2. Firebase Console
- تحقق من Usage tab للحدود
- راجع سجلات Functions إذا كنت تستخدمها
- تحقق من Monitoring للأخطاء

### 3. مصادر المساعدة
- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
- [Firebase Community](https://firebase.google.com/community)

---

## ✅ قائمة فحص سريعة

عند مواجهة مشكلة، تحقق من:

- [ ] ملف `.env.local` موجود ومحدث
- [ ] إعادة تشغيل الخادم بعد تعديل متغيرات البيئة
- [ ] تفعيل الخدمات المطلوبة في Firebase Console
- [ ] قواعد الأمان تسمح بالعمليات المطلوبة
- [ ] المستخدم مسجل دخول ولديه الصلاحيات المناسبة
- [ ] الفهارس المطلوبة موجودة في Firestore
- [ ] النطاقات مضافة في Authorized domains
- [ ] اتصال الإنترنت يعمل بشكل صحيح

---

## 🔄 إعادة تعيين النظام

إذا فشل كل شيء، جرب إعادة تعيين كاملة:

```bash
# 1. حذف node_modules
rm -rf node_modules
rm package-lock.json

# 2. إعادة تثبيت التبعيات
npm install

# 3. إعادة تشغيل الخادم
npm run dev
```

وتأكد من إعدادات Firebase من جديد.
