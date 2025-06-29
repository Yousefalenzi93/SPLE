'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { createUser } from '@/lib/firestore'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function DebugRegistrationPage() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('TestPassword123!')
  const [displayName, setDisplayName] = useState('Test User')
  const [university, setUniversity] = useState('جامعة الملك سعود')
  const [graduationYear, setGraduationYear] = useState(2024)
  const [logs, setLogs] = useState<string[]>([])
  const [testing, setTesting] = useState(false)

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(message)
  }

  const clearLogs = () => {
    setLogs([])
  }

  const testFirebaseConfig = () => {
    addLog('🔍 فحص إعدادات Firebase...')
    
    const config = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    }
    
    Object.entries(config).forEach(([key, value]) => {
      if (value) {
        addLog(`✅ ${key}: ${value.substring(0, 20)}...`)
      } else {
        addLog(`❌ ${key}: مفقود!`)
      }
    })
    
    if (auth) {
      addLog('✅ Firebase Auth مُهيأ')
    } else {
      addLog('❌ Firebase Auth غير مُهيأ')
    }
    
    if (db) {
      addLog('✅ Firestore مُهيأ')
    } else {
      addLog('❌ Firestore غير مُهيأ')
    }
  }

  const testDirectFirestore = async () => {
    addLog('🔍 اختبار Firestore مباشرة...')
    
    try {
      const testDoc = doc(db, 'test', 'direct-test')
      await setDoc(testDoc, {
        message: 'Test direct Firestore access',
        timestamp: serverTimestamp(),
        testId: Date.now()
      })
      addLog('✅ Firestore يعمل - تم إنشاء document تجريبي')
    } catch (error: any) {
      addLog(`❌ خطأ في Firestore: ${error.message}`)
      addLog(`❌ كود الخطأ: ${error.code}`)
    }
  }

  const testAuthOnly = async () => {
    addLog('🔍 اختبار Firebase Auth فقط...')
    
    try {
      const testEmail = `test-${Date.now()}@example.com`
      const result = await createUserWithEmailAndPassword(auth, testEmail, 'TestPassword123!')
      addLog(`✅ Firebase Auth يعمل - تم إنشاء مستخدم: ${result.user.uid}`)
      
      // حذف المستخدم التجريبي
      await result.user.delete()
      addLog('✅ تم حذف المستخدم التجريبي')
    } catch (error: any) {
      addLog(`❌ خطأ في Firebase Auth: ${error.message}`)
      addLog(`❌ كود الخطأ: ${error.code}`)
    }
  }

  const testFullRegistration = async () => {
    if (testing) return
    
    setTesting(true)
    addLog('🚀 بدء اختبار التسجيل الكامل...')
    
    try {
      const testEmail = `test-${Date.now()}@example.com`
      
      // خطوة 1: إنشاء مستخدم في Firebase Auth
      addLog('1️⃣ إنشاء مستخدم في Firebase Auth...')
      const result = await createUserWithEmailAndPassword(auth, testEmail, password)
      addLog(`✅ تم إنشاء مستخدم: ${result.user.uid}`)
      
      // خطوة 2: تحديث الملف الشخصي
      addLog('2️⃣ تحديث الملف الشخصي...')
      await updateProfile(result.user, { displayName })
      addLog('✅ تم تحديث الملف الشخصي')
      
      // خطوة 3: إنشاء document في Firestore
      addLog('3️⃣ إنشاء document في Firestore...')
      await createUser({
        uid: result.user.uid,
        email: result.user.email!,
        displayName,
        role: 'student',
        university,
        graduationYear
      })
      addLog('✅ تم إنشاء document في Firestore')
      
      // خطوة 4: إرسال email verification
      addLog('4️⃣ إرسال email verification...')
      await sendEmailVerification(result.user)
      addLog('✅ تم إرسال email verification')
      
      addLog('🎉 التسجيل الكامل نجح!')
      
    } catch (error: any) {
      addLog(`❌ فشل التسجيل: ${error.message}`)
      addLog(`❌ كود الخطأ: ${error.code}`)
      addLog(`❌ Stack: ${error.stack}`)
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🔧 تشخيص مشكلة التسجيل
          </h1>
          <p className="text-gray-600 mb-4">
            هذه الصفحة تساعد في تشخيص مشكلة "حدث خطأ غير متوقع" في التسجيل
          </p>
          
          {/* Test Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button
              onClick={testFirebaseConfig}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              فحص إعدادات Firebase
            </button>
            
            <button
              onClick={testDirectFirestore}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              اختبار Firestore
            </button>
            
            <button
              onClick={testAuthOnly}
              className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
            >
              اختبار Auth فقط
            </button>
            
            <button
              onClick={testFullRegistration}
              disabled={testing}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {testing ? 'جاري الاختبار...' : 'اختبار كامل'}
            </button>
          </div>
          
          <button
            onClick={clearLogs}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 mb-4"
          >
            مسح السجل
          </button>
        </div>

        {/* Test Data */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">بيانات الاختبار</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الاسم الكامل
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الجامعة
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Logs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">سجل التشخيص</h2>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500">انقر على أحد أزرار الاختبار لبدء التشخيص...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
