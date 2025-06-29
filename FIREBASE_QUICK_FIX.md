# 🚨 إصلاح سريع لمشكلة التسجيل

## 🔍 المشاكل المحتملة والحلول:

### 1. **مشكلة Firebase Authentication غير مفعل**

#### الحل:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروع `sple-exam-system`
3. Authentication > Sign-in method
4. فعل **Email/Password**
5. احفظ التغييرات

### 2. **مشكلة Firestore Rules**

#### الحل:
1. Firebase Console > Firestore Database > Rules
2. استبدل القواعد بهذا:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Allow authenticated users to read questions
    match /questions/{questionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Allow users to manage their exam sessions
    match /examSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
    
    // Allow users to manage their progress
    match /userProgress/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Test collection for debugging
    match /test/{document} {
      allow read, write: if true;
    }
  }
}
```

### 3. **مشكلة Authorized Domains**

#### الحل:
1. Firebase Console > Authentication > Settings
2. Authorized domains
3. أضف: `sple-exam.netlify.app`
4. أضف: `localhost` (للتطوير)

### 4. **مشكلة Environment Variables**

#### تحقق من وجود هذه المتغيرات في Netlify:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBVPwdXDXdGJzH4bdEJTmGO6CLdwJcFvp0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=sple-exam-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=sple-exam-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=sple-exam-system.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=684476565122
NEXT_PUBLIC_FIREBASE_APP_ID=1:684476565122:web:65f005113e5e29e421569b
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-JM2SWJY950
```

## 🚀 خطوات الإصلاح السريع:

### الخطوة 1: رفع صفحة التشخيص
```bash
git add .
git commit -m "Add: Debug registration page for troubleshooting"
git push origin main
```

### الخطوة 2: إعادة النشر
1. اذهب إلى Netlify Dashboard
2. انقر "Trigger deploy"
3. انتظر انتهاء البناء

### الخطوة 3: تشغيل التشخيص
اذهب إلى: https://sple-exam.netlify.app/debug-registration

### الخطوة 4: تطبيق الإصلاحات حسب النتائج

## 🔧 إصلاحات إضافية:

### إصلاح 1: تحديث AuthContext مع معالجة أفضل

في `src/contexts/AuthContext.tsx`، تأكد من وجود:

```typescript
const register = async (email: string, password: string, userData: RegisterData) => {
  try {
    console.log('🚀 بدء عملية التسجيل:', email)
    
    // تحقق من Firebase config
    if (!auth) {
      throw new Error('Firebase Auth غير مُهيأ')
    }
    
    const result = await createUserWithEmailAndPassword(auth, email, password)
    console.log('✅ تم إنشاء مستخدم Firebase Auth:', result.user.uid)
    
    if (result.user) {
      // تحديث الملف الشخصي
      await updateProfile(result.user, {
        displayName: userData.displayName
      })
      console.log('✅ تم تحديث الملف الشخصي')

      // إنشاء document في Firestore
      await createUser({
        uid: result.user.uid,
        email: result.user.email!,
        displayName: userData.displayName,
        role: userData.role || 'student',
        university: userData.university,
        graduationYear: userData.graduationYear
      })
      console.log('✅ تم إنشاء document في Firestore')

      // إرسال email verification
      await sendEmailVerification(result.user)
      console.log('✅ تم إرسال email verification')
    }
  } catch (error: any) {
    console.error('❌ خطأ في التسجيل:', {
      code: error.code,
      message: error.message,
      stack: error.stack
    })
    
    // رسائل خطأ محددة
    if (error.code === 'auth/email-already-in-use') {
      throw new Error('هذا البريد الإلكتروني مستخدم بالفعل')
    } else if (error.code === 'auth/weak-password') {
      throw new Error('كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل')
    } else if (error.code === 'auth/invalid-email') {
      throw new Error('البريد الإلكتروني غير صحيح')
    } else if (error.code === 'auth/operation-not-allowed') {
      throw new Error('تسجيل الحسابات الجديدة غير مفعل')
    } else if (error.message.includes('فشل في إنشاء بيانات المستخدم')) {
      throw new Error('فشل في حفظ بيانات المستخدم في قاعدة البيانات')
    } else {
      throw new Error(`خطأ في التسجيل: ${error.message}`)
    }
  }
}
```

### إصلاح 2: تحديث createUser مع معالجة أفضل

في `src/lib/firestore.ts`:

```typescript
export const createUser = async (userData: Omit<User, 'uid' | 'createdAt' | 'lastLogin'> & { uid: string }) => {
  try {
    console.log('🔥 إنشاء مستخدم في Firestore:', userData.uid)
    
    if (!db) {
      throw new Error('Firestore غير مُهيأ')
    }
    
    const userDoc = doc(usersCollection, userData.uid)
    await setDoc(userDoc, {
      ...userData,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    })
    
    console.log('✅ تم إنشاء مستخدم في Firestore بنجاح:', userData.uid)
  } catch (error: any) {
    console.error('❌ خطأ في إنشاء مستخدم Firestore:', {
      code: error.code,
      message: error.message,
      uid: userData.uid
    })
    
    if (error.code === 'permission-denied') {
      throw new Error('ليس لديك صلاحية لإنشاء حساب')
    } else if (error.code === 'unavailable') {
      throw new Error('قاعدة البيانات غير متاحة حالياً')
    } else {
      throw new Error('فشل في إنشاء بيانات المستخدم')
    }
  }
}
```

## 📞 خطوات التشخيص:

### 1. استخدم صفحة التشخيص:
https://sple-exam.netlify.app/debug-registration

### 2. افحص Browser Console:
- اضغط F12
- اذهب إلى Console tab
- جرب التسجيل وراقب الرسائل

### 3. تحقق من Firebase Console:
- Authentication > Users (هل يتم إنشاء المستخدم؟)
- Firestore > Data (هل يتم حفظ البيانات؟)

### 4. تحقق من Netlify Environment Variables:
- Site Settings > Environment Variables
- تأكد من وجود جميع متغيرات Firebase

## 🎯 النتيجة المتوقعة:

بعد تطبيق هذه الإصلاحات:
- ✅ التسجيل سيعمل بدون أخطاء
- ✅ رسائل خطأ واضحة ومفيدة
- ✅ تشخيص سهل للمشاكل المستقبلية
- ✅ logging مفصل لكل خطوة

🚀 **ابدأ بصفحة التشخيص أولاً لتحديد المشكلة بدقة!**
