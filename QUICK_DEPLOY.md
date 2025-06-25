# 🚀 دليل النشر السريع

## ⚡ خطوات النشر السريعة (5 دقائق)

### 1. فحص جاهزية المشروع
```bash
npm run check-deployment
```

### 2. اختبار البناء محلياً
```bash
npm run build
```

### 3. رفع الكود إلى GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 4. نشر على Netlify
1. اذهب إلى [Netlify](https://netlify.com)
2. انقر "New site from Git"
3. اختر GitHub repository
4. إعدادات البناء:
   - **Build command:** `npm run build`
   - **Publish directory:** `out`

### 5. إضافة متغيرات البيئة في Netlify
في Site settings > Environment variables، أضف:

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBVPwdXDXdGJzH4bdEJTmGO6CLdwJcFvp0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sple-exam-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sple-exam-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sple-exam-system.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=684476565122
NEXT_PUBLIC_FIREBASE_APP_ID=1:684476565122:web:65f005113e5e29e421569b
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-JM2SWJY950
NODE_ENV=production
```

### 6. إعداد Firebase Console
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروع `sple-exam-system`
3. **Authentication > Settings > Authorized domains**
   - أضف: `your-site-name.netlify.app`
4. **Firestore Database > Rules** - تطبيق القواعد من `NETLIFY_FIX.md`
5. **Storage > Rules** - تطبيق القواعد من `NETLIFY_FIX.md`

---

## 🔥 إعداد Firebase (مطلوب مرة واحدة)

### تفعيل الخدمات:
- ✅ **Authentication** > Sign-in method > Email/Password
- ✅ **Firestore Database** > Create database (production mode)
- ✅ **Storage** > Get started

### تطبيق قواعد الأمان:
انسخ القواعد من `NETLIFY_FIX.md` وطبقها في:
- Firestore Database > Rules
- Storage > Rules

---

## 🧪 اختبار الموقع بعد النشر

### 1. الوظائف الأساسية:
- [ ] فتح الموقع
- [ ] تسجيل مستخدم جديد
- [ ] تسجيل الدخول

### 2. إنشاء المسؤول الأولي:
```
https://your-site.netlify.app/setup-admin
```

### 3. إضافة البيانات النموذجية:
1. سجل دخول كمسؤول
2. اذهب إلى `/admin/seed`
3. انقر "إضافة الأسئلة النموذجية"

### 4. اختبار الوظائف:
- [ ] تصفح الأسئلة
- [ ] بدء امتحان تجريبي
- [ ] عرض النتائج
- [ ] لوحة الإدارة

---

## 🔧 استكشاف الأخطاء السريع

### إذا فشل البناء:
```bash
# تحقق من الأخطاء
npm run build

# إذا كانت مشكلة في التبعيات
npm install

# إذا كانت مشكلة في TypeScript
npm run type-check
```

### إذا لم يعمل Firebase:
1. تحقق من متغيرات البيئة في Netlify
2. تحقق من Authorized domains في Firebase
3. تحقق من قواعد الأمان

### إذا ظهرت أخطاء 404:
1. تحقق من `netlify.toml` redirects
2. تحقق من publish directory = `out`

---

## 📞 الدعم السريع

### أخطاء شائعة:
- **Build failed**: راجع `NETLIFY_FIX.md`
- **Firebase errors**: راجع `TROUBLESHOOTING.md`
- **404 errors**: تحقق من redirects

### أدوات مفيدة:
- `npm run check-deployment` - فحص جاهزية النشر
- `/admin/test-firebase` - اختبار Firebase
- Browser Console - للأخطاء التفصيلية

---

## ✅ قائمة فحص سريعة

قبل النشر:
- [ ] `npm run check-deployment` ينجح
- [ ] `npm run build` ينجح
- [ ] متغيرات البيئة جاهزة
- [ ] Firebase Console معد

بعد النشر:
- [ ] الموقع يفتح
- [ ] تسجيل المستخدمين يعمل
- [ ] المسؤول الأولي منشأ
- [ ] البيانات النموذجية مضافة

🎉 **الموقع جاهز للاستخدام!**

---

## 🔗 روابط مفيدة

- [Netlify Dashboard](https://app.netlify.com/)
- [Firebase Console](https://console.firebase.google.com/)
- [GitHub Repository](https://github.com/Yousefalenzi93/SPLE)

**وقت النشر المتوقع: 5-10 دقائق** ⏱️
