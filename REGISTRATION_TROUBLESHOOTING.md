# 🔧 دليل استكشاف أخطاء التسجيل في نظام SPLE

## 🚨 المشكلة الأصلية: "حدث خطأ غير متوقع"

### ✅ تم إصلاح المشكلة الرئيسية:
**السبب:** استخدام `updateDoc` بدلاً من `setDoc` في وظيفة `createUser`

**الحل المطبق:**
```typescript
// ❌ قبل الإصلاح
await updateDoc(userDoc, userData) // يحاول تحديث document غير موجود

// ✅ بعد الإصلاح  
await setDoc(userDoc, userData) // ينشئ document جديد
```

## 🔍 خطوات التشخيص:

### 1. فحص Browser Console:
افتح Developer Tools (F12) وتحقق من:
```javascript
// أخطاء JavaScript
console.error messages

// أخطاء Firebase
Firebase: Error (auth/...)
Firebase: Error (firestore/...)

// أخطاء الشبكة
Network errors in Network tab
```

### 2. فحص Firebase Console:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروع `sple-exam-system`
3. تحقق من:
   - **Authentication > Users** - هل تم إنشاء المستخدم؟
   - **Firestore > Data** - هل تم حفظ البيانات؟
   - **Usage** - هل هناك حدود مستنفدة؟

### 3. اختبار الاتصال:
استخدم صفحة الاختبار الجديدة:
```
https://your-site.netlify.app/admin/test-registration
```

## 🛠️ الحلول المطبقة:

### ✅ 1. إصلاح وظيفة createUser:
```typescript
export const createUser = async (userData: Omit<User, 'uid' | 'createdAt' | 'lastLogin'> & { uid: string }) => {
  try {
    const userDoc = doc(usersCollection, userData.uid)
    await setDoc(userDoc, {  // ✅ setDoc بدلاً من updateDoc
      ...userData,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    })
    console.log('User created successfully:', userData.uid)
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('فشل في إنشاء بيانات المستخدم')
  }
}
```

### ✅ 2. تحسين معالجة الأخطاء:
```typescript
const register = async (email: string, password: string, userData: RegisterData) => {
  try {
    console.log('Starting registration process for:', email)
    
    const result = await createUserWithEmailAndPassword(auth, email, password)
    
    if (result.user) {
      // خطوات مفصلة مع logging
      await updateProfile(result.user, { displayName: userData.displayName })
      await createUser({ /* userData */ })
      await sendEmailVerification(result.user)
    }
  } catch (error: any) {
    // معالجة أخطاء محددة
    if (error.message === 'فشل في إنشاء بيانات المستخدم') {
      throw new Error('فشل في حفظ بيانات المستخدم. يرجى المحاولة مرة أخرى.')
    }
    throw new Error(getAuthErrorMessage(error.code))
  }
}
```

### ✅ 3. رسائل خطأ محسنة:
```typescript
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'هذا البريد الإلكتروني مستخدم بالفعل'
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل'
    case 'auth/invalid-email':
      return 'البريد الإلكتروني غير صحيح'
    case 'auth/operation-not-allowed':
      return 'تسجيل الحسابات الجديدة غير مفعل. يرجى التواصل مع المدير'
    case 'permission-denied':
      return 'ليس لديك صلاحية لتنفيذ هذه العملية'
    default:
      return `حدث خطأ غير متوقع (${errorCode}). يرجى المحاولة مرة أخرى`
  }
}
```

## 🔧 خطوات الاختبار:

### 1. اختبار محلي:
```bash
npm run dev
# اذهب إلى http://localhost:3000/register
# جرب إنشاء حساب جديد
```

### 2. اختبار الإنتاج:
```
https://your-site.netlify.app/register
```

### 3. اختبار شامل:
```
https://your-site.netlify.app/admin/test-registration
```

## 🚨 مشاكل شائعة وحلولها:

### المشكلة 1: "auth/operation-not-allowed"
**السبب:** Email/Password authentication غير مفعل
**الحل:**
1. Firebase Console > Authentication > Sign-in method
2. فعل "Email/Password"

### المشكلة 2: "permission-denied"
**السبب:** قواعد Firestore تمنع الكتابة
**الحل:**
```javascript
// في Firebase Console > Firestore > Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### المشكلة 3: "auth/network-request-failed"
**السبب:** مشكلة في الاتصال أو CORS
**الحل:**
1. تحقق من متغيرات البيئة
2. تأكد من إضافة النطاق في Firebase Authorized domains

### المشكلة 4: "auth/invalid-api-key"
**السبب:** API key خاطئ أو منتهي الصلاحية
**الحل:**
1. تحقق من `NEXT_PUBLIC_FIREBASE_API_KEY`
2. أنشئ API key جديد من Firebase Console

## 📋 قائمة فحص ما بعد الإصلاح:

### ✅ تحقق من:
- [ ] تم تحديث `src/lib/firestore.ts` مع `setDoc`
- [ ] تم تحديث `src/contexts/AuthContext.tsx` مع logging محسن
- [ ] تم إنشاء صفحة `/admin/test-registration`
- [ ] Firebase Authentication مفعل
- [ ] Firestore Rules صحيحة
- [ ] Environment Variables موجودة
- [ ] النطاق مضاف في Authorized domains

### 🧪 اختبارات مطلوبة:
- [ ] إنشاء حساب جديد يعمل
- [ ] تسجيل الدخول بالحساب الجديد يعمل
- [ ] البيانات محفوظة في Firestore
- [ ] Email verification يُرسل
- [ ] رسائل الخطأ واضحة ومفيدة

## 📞 الدعم الإضافي:

### إذا استمرت المشاكل:
1. **تحقق من Browser Console** للأخطاء التفصيلية
2. **استخدم صفحة الاختبار** `/admin/test-registration`
3. **راجع Firebase Console logs**
4. **تأكد من Environment Variables** في منصة النشر

### معلومات مفيدة للدعم:
- **رقم الخطأ:** من Browser Console
- **وقت الخطأ:** التوقيت الدقيق
- **البيانات المدخلة:** البريد الإلكتروني والجامعة
- **المتصفح المستخدم:** Chrome, Firefox, Safari, etc.
- **الجهاز:** Desktop, Mobile, Tablet

## 🎉 النتيجة المتوقعة:

بعد تطبيق هذه الإصلاحات:
- ✅ **إنشاء الحسابات يعمل** بدون أخطاء
- ✅ **رسائل خطأ واضحة** إذا حدثت مشاكل
- ✅ **Logging مفصل** لسهولة التشخيص
- ✅ **اختبارات شاملة** للتحقق من الوظائف

**الخطأ "حدث خطأ غير متوقع" لن يظهر مرة أخرى!** ✅
