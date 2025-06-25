# دليل إعداد Firebase للمشروع

## 🔥 الخطوة 1: إنشاء مشروع Firebase جديد

### 1.1 الذهاب إلى Firebase Console
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. سجل الدخول بحساب Google الخاص بك
3. انقر على "Create a project" أو "إنشاء مشروع"

### 1.2 إعداد المشروع
1. **اسم المشروع**: `sple-exam-system` (أو أي اسم تفضله)
2. **معرف المشروع**: سيتم إنشاؤه تلقائياً (مثل: `sple-exam-system-12345`)
3. **الموقع الجغرافي**: اختر `asia-southeast1` (سنغافورة) للمنطقة العربية
4. انقر "Continue" ثم "Create project"

---

## 🗄️ الخطوة 2: تفعيل Firestore Database

### 2.1 إنشاء قاعدة البيانات
1. من القائمة الجانبية، انقر على "Firestore Database"
2. انقر "Create database"
3. اختر "Start in production mode" (سنضيف القواعد لاحقاً)
4. اختر الموقع: `asia-southeast1 (Singapore)`
5. انقر "Done"

### 2.2 إعداد المجموعات الأساسية
قاعدة البيانات ستكون فارغة في البداية. المجموعات ستُنشأ تلقائياً عند إضافة البيانات.

---

## 🔒 الخطوة 3: تطبيق قواعد الأمان

### 3.1 نسخ قواعد الأمان
1. في Firestore Database، انقر على تبويب "Rules"
2. احذف المحتوى الموجود واستبدله بالقواعد التالية:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Questions collection - read for authenticated users, write for admins only
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow create: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Exam sessions - users can only access their own sessions
    match /examSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // User progress - users can only access their own progress
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin access to all documents
    match /{document=**} {
      allow read, write: if request.auth != null && 
        exists(/databases/$(database)/documents/users/$(request.auth.uid)) &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

3. انقر "Publish" لحفظ القواعد

---

## 📊 الخطوة 4: إنشاء الفهارس المطلوبة

### 4.1 الفهارس التلقائية
معظم الفهارس ستُنشأ تلقائياً عند الحاجة. إذا ظهرت رسائل خطأ حول الفهارس المفقودة، ستحتوي على روابط لإنشائها.

### 4.2 الفهارس المخصصة المطلوبة
انتقل إلى تبويب "Indexes" وأضف الفهارس التالية:

**فهرس للأسئلة:**
- Collection: `questions`
- Fields: `domain` (Ascending), `difficulty` (Ascending), `approved` (Ascending)

**فهرس لجلسات الامتحان:**
- Collection: `examSessions`
- Fields: `userId` (Ascending), `startTime` (Descending)

---

## 🔐 الخطوة 5: تفعيل Firebase Authentication

### 5.1 إعداد Authentication
1. من القائمة الجانبية، انقر على "Authentication"
2. انقر "Get started"
3. انتقل إلى تبويب "Sign-in method"

### 5.2 تفعيل Email/Password
1. انقر على "Email/Password"
2. فعل "Enable" للخيار الأول
3. اتركه الخيار الثاني (Email link) معطلاً
4. انقر "Save"

### 5.3 إعداد Authorized domains
1. في نفس الصفحة، انتقل إلى "Authorized domains"
2. أضف النطاقات التالية:
   - `localhost` (للتطوير المحلي)
   - `your-netlify-domain.netlify.app` (عند النشر)

---

## 💾 الخطوة 6: إعداد Firebase Storage

### 6.1 تفعيل Storage
1. من القائمة الجانبية، انقر على "Storage"
2. انقر "Get started"
3. اختر "Start in production mode"
4. اختر نفس الموقع: `asia-southeast1`

### 6.2 قواعد أمان Storage
1. انتقل إلى تبويب "Rules"
2. استبدل القواعد بالتالي:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload/download files
    match /{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    // Specific rules for user avatars
    match /avatars/{userId}/{fileName} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin can access all files
    match /{allPaths=**} {
      allow read, write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

3. انقر "Publish"

---

## ⚙️ الخطوة 7: الحصول على إعدادات Firebase

### 7.1 إضافة تطبيق ويب
1. في الصفحة الرئيسية للمشروع، انقر على أيقونة الويب `</>`
2. اسم التطبيق: `SPLE Exam System`
3. فعل "Also set up Firebase Hosting" (اختياري)
4. انقر "Register app"

### 7.2 نسخ إعدادات Firebase
ستظهر لك إعدادات مثل هذه:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "sple-exam-system.firebaseapp.com",
  projectId: "sple-exam-system",
  storageBucket: "sple-exam-system.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};
```

### 7.3 إنشاء ملف .env.local
1. في جذر المشروع، أنشئ ملف `.env.local`
2. أضف الإعدادات:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sple-exam-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sple-exam-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sple-exam-system.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdefghijklmnop
```

---

## 🧪 الخطوة 8: اختبار الاتصال

### 8.1 تشغيل المشروع
```bash
npm install
npm run dev
```

### 8.2 اختبار الصفحات
1. اذهب إلى `http://localhost:3000`
2. جرب تسجيل مستخدم جديد
3. تحقق من إنشاء المستخدم في Firebase Console

---

## 📚 الخطوة 9: إضافة البيانات النموذجية

### 9.1 إنشاء مستخدم مسؤول
1. سجل مستخدم جديد من الواجهة
2. في Firebase Console > Authentication، انسخ UID المستخدم
3. في Firestore، اذهب إلى مجموعة `users`
4. عدل وثيقة المستخدم وأضف: `"role": "admin"`

### 9.2 إضافة الأسئلة النموذجية
1. سجل دخول كمسؤول
2. اذهب إلى `/admin/seed`
3. انقر "إضافة الأسئلة النموذجية"
4. انتظر حتى اكتمال العملية

---

## ✅ الخطوة 10: التحقق النهائي

### 10.1 اختبار العمليات الأساسية
- [ ] تسجيل مستخدم جديد
- [ ] تسجيل الدخول
- [ ] عرض الملف الشخصي
- [ ] تصفح الأسئلة
- [ ] بدء امتحان تجريبي
- [ ] حفظ النتائج

### 10.2 اختبار صلاحيات المسؤول
- [ ] الوصول لصفحات الإدارة
- [ ] عرض قائمة المستخدمين
- [ ] إدارة الأسئلة
- [ ] عرض التحليلات

---

## 🔐 نصائح الأمان

1. **احتفظ بنسخة آمنة** من إعدادات Firebase
2. **لا تشارك** ملف `.env.local` في Git
3. **راجع قواعد الأمان** بانتظام
4. **فعل التنبيهات** في Firebase Console
5. **استخدم Firebase Security Rules Simulator** للاختبار

---

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

**خطأ في الاتصال:**
```
Firebase: Error (auth/configuration-not-found)
```
**الحل:** تحقق من ملف `.env.local` والإعدادات

**خطأ في الصلاحيات:**
```
FirebaseError: Missing or insufficient permissions
```
**الحل:** تحقق من قواعد Firestore والمصادقة

**خطأ في الفهارس:**
```
The query requires an index
```
**الحل:** انقر على الرابط في رسالة الخطأ لإنشاء الفهرس

---

## 📞 الدعم

إذا واجهت أي مشاكل:
1. تحقق من [Firebase Documentation](https://firebase.google.com/docs)
2. راجع [Firebase Console](https://console.firebase.google.com/)
3. تحقق من سجلات المتصفح (Console)
4. راجع قواعد الأمان والفهارس

---

**✅ بعد إكمال جميع الخطوات، ستكون قاعدة البيانات جاهزة للاستخدام!**
