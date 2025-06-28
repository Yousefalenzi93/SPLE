'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { createUser } from '@/lib/firestore'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowRight,
  UserPlus,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface TestResult {
  test: string
  status: 'success' | 'error' | 'testing'
  message: string
  duration?: number
}

export default function TestRegistrationPage() {
  const { currentUser, register } = useAuth()
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])

  const testFirestoreUserCreation = async () => {
    const startTime = Date.now()
    
    try {
      const testUserData = {
        uid: 'test-user-' + Date.now(),
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'student' as const,
        university: 'جامعة الملك سعود',
        graduationYear: 2024
      }
      
      await createUser(testUserData)
      
      return {
        test: 'Firestore User Creation',
        status: 'success' as const,
        message: '✅ تم إنشاء مستخدم تجريبي في Firestore بنجاح',
        duration: Date.now() - startTime
      }
    } catch (error: any) {
      return {
        test: 'Firestore User Creation',
        status: 'error' as const,
        message: `❌ فشل في إنشاء مستخدم في Firestore: ${error.message}`,
        duration: Date.now() - startTime
      }
    }
  }

  const testFullRegistration = async () => {
    const startTime = Date.now()
    
    try {
      const testEmail = `test-${Date.now()}@example.com`
      const testPassword = 'TestPassword123!'
      const testUserData = {
        displayName: 'Test User Full',
        university: 'جامعة الملك سعود',
        graduationYear: 2024,
        role: 'student' as const
      }
      
      await register(testEmail, testPassword, testUserData)
      
      return {
        test: 'Full Registration Process',
        status: 'success' as const,
        message: '✅ تم إنشاء حساب كامل بنجاح (Firebase Auth + Firestore)',
        duration: Date.now() - startTime
      }
    } catch (error: any) {
      return {
        test: 'Full Registration Process',
        status: 'error' as const,
        message: `❌ فشل في التسجيل الكامل: ${error.message}`,
        duration: Date.now() - startTime
      }
    }
  }

  const runAllTests = async () => {
    setTesting(true)
    setResults([])
    
    const tests = [
      testFirestoreUserCreation,
      testFullRegistration
    ]
    
    const testResults: TestResult[] = []
    
    for (const test of tests) {
      const result = await test()
      testResults.push(result)
      setResults([...testResults])
    }
    
    setTesting(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'testing':
        return <Clock className="w-5 h-5 text-yellow-500 animate-spin" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      case 'testing':
        return 'border-yellow-200 bg-yellow-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  اختبار نظام التسجيل
                </h1>
                <p className="text-gray-600">
                  اختبار شامل لوظائف إنشاء الحسابات والتسجيل
                </p>
              </div>
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Test Controls */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                تشغيل الاختبارات
              </h2>
              <button
                onClick={runAllTests}
                disabled={testing}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {testing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
                {testing ? 'جاري الاختبار...' : 'تشغيل جميع الاختبارات'}
              </button>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>• اختبار إنشاء مستخدم في Firestore</p>
              <p>• اختبار عملية التسجيل الكاملة</p>
            </div>
          </div>

          {/* Test Results */}
          {results.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                نتائج الاختبارات
              </h2>
              
              <div className="space-y-4">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getStatusIcon(result.status)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">
                            {result.test}
                          </h3>
                          {result.duration && (
                            <span className="text-sm text-gray-500">
                              {result.duration}ms
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">
                          {result.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              أدوات إضافية
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/test-firebase"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">اختبار Firebase</h3>
                  <p className="text-sm text-gray-600">اختبار شامل لجميع خدمات Firebase</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
              
              <Link
                href="/admin"
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">لوحة الإدارة</h3>
                  <p className="text-sm text-gray-600">العودة إلى لوحة الإدارة الرئيسية</p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
