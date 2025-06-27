'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { FirebaseConnectionTest, validateFirebaseConfig, testFirebaseComponents } from '@/lib/firebase-test'
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowRight,
  Database,
  Shield,
  Cloud,
  Settings,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface TestResult {
  test: string
  status: 'success' | 'error'
  message: string
  duration?: number
}

export default function TestFirebasePage() {
  const { currentUser } = useAuth()
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [configValid, setConfigValid] = useState<{ valid: boolean; missing: string[] } | null>(null)

  const runFullTest = async () => {
    setTesting(true)
    setResults([])
    
    try {
      const tester = new FirebaseConnectionTest()
      const testResults = await tester.runAllTests()
      setResults(testResults)
    } catch (error) {
      setResults([{
        test: 'General Error',
        status: 'error',
        message: `خطأ عام في الاختبار: ${error instanceof Error ? error.message : 'Unknown error'}`
      }])
    } finally {
      setTesting(false)
    }
  }

  const runQuickTests = async () => {
    setTesting(true)
    const quickResults: TestResult[] = []
    
    try {
      // Test Firestore
      const firestoreOk = await testFirebaseComponents.firestore()
      quickResults.push({
        test: 'Firestore Quick Test',
        status: firestoreOk ? 'success' : 'error',
        message: firestoreOk ? 'Firestore متاح' : 'Firestore غير متاح'
      })

      // Test Auth
      const authOk = await testFirebaseComponents.auth()
      quickResults.push({
        test: 'Auth Quick Test',
        status: authOk ? 'success' : 'error',
        message: authOk ? 'Authentication متاح' : 'Authentication غير متاح'
      })

      // Test Storage
      const storageOk = await testFirebaseComponents.storage()
      quickResults.push({
        test: 'Storage Quick Test',
        status: storageOk ? 'success' : 'error',
        message: storageOk ? 'Storage متاح' : 'Storage غير متاح'
      })

      setResults(quickResults)
    } catch (error) {
      setResults([{
        test: 'Quick Test Error',
        status: 'error',
        message: `خطأ في الاختبار السريع: ${error instanceof Error ? error.message : 'Unknown error'}`
      }])
    } finally {
      setTesting(false)
    }
  }

  const checkConfig = () => {
    const validation = validateFirebaseConfig()
    setConfigValid(validation)
  }

  const getStatusIcon = (status: 'success' | 'error') => {
    return status === 'success' 
      ? <CheckCircle className="h-5 w-5 text-green-600" />
      : <XCircle className="h-5 w-5 text-red-600" />
  }

  const getStatusColor = (status: 'success' | 'error') => {
    return status === 'success' 
      ? 'bg-green-50 border-green-200' 
      : 'bg-red-50 border-red-200'
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <Link
                  href="/admin"
                  className="flex items-center text-gray-600 hover:text-gray-900 ml-4"
                >
                  <ArrowRight className="h-5 w-5 ml-1" />
                  العودة إلى لوحة الإدارة
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                  اختبار Firebase
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Configuration Check */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Settings className="h-5 w-5 ml-2" />
                  فحص إعدادات Firebase
                </h3>
              </div>
              
              <div className="p-6">
                <button
                  onClick={checkConfig}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mb-4"
                >
                  <Settings className="h-4 w-4 ml-2" />
                  فحص الإعدادات
                </button>

                {configValid && (
                  <div className={`border rounded-lg p-4 ${
                    configValid.valid 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center mb-2">
                      {configValid.valid 
                        ? <CheckCircle className="h-5 w-5 text-green-600 ml-2" />
                        : <XCircle className="h-5 w-5 text-red-600 ml-2" />
                      }
                      <span className={`font-medium ${
                        configValid.valid ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {configValid.valid 
                          ? 'جميع الإعدادات موجودة' 
                          : 'إعدادات مفقودة'
                        }
                      </span>
                    </div>
                    
                    {!configValid.valid && (
                      <div className="text-red-700 text-sm">
                        <p className="mb-2">المتغيرات المفقودة:</p>
                        <ul className="list-disc list-inside">
                          {configValid.missing.map(varName => (
                            <li key={varName}>{varName}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Test Controls */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Play className="h-5 w-5 ml-2" />
                  اختبارات Firebase
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={runQuickTests}
                    disabled={testing}
                    className="flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                        جاري الاختبار...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4 ml-2" />
                        اختبار سريع
                      </>
                    )}
                  </button>

                  <button
                    onClick={runFullTest}
                    disabled={testing}
                    className="flex items-center justify-center px-6 py-3 bg-saudi-green text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {testing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                        جاري الاختبار...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 ml-2" />
                        اختبار شامل
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>الاختبار السريع:</strong> فحص سريع لتوفر الخدمات</p>
                  <p><strong>الاختبار الشامل:</strong> اختبار كامل للقراءة والكتابة والمصادقة</p>
                </div>
              </div>
            </div>

            {/* Test Results */}
            {results.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Database className="h-5 w-5 ml-2" />
                    نتائج الاختبار
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {results.map((result, index) => (
                      <div key={index} className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            {getStatusIcon(result.status)}
                            <div className="mr-3">
                              <h4 className={`font-medium ${
                                result.status === 'success' ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {result.test}
                              </h4>
                              <p className={`text-sm mt-1 ${
                                result.status === 'success' ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {result.message}
                              </p>
                            </div>
                          </div>
                          
                          {result.duration && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 ml-1" />
                              {result.duration}ms
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">ملخص النتائج</h4>
                        <p className="text-sm text-gray-600">
                          {results.filter(r => r.status === 'success').length} من {results.length} اختبارات نجحت
                        </p>
                      </div>
                      
                      <div className="text-2xl">
                        {results.filter(r => r.status === 'success').length === results.length 
                          ? '🎉' 
                          : '⚠️'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-blue-600 ml-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">نصائح لحل المشاكل</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• تأكد من وجود ملف <code>.env.local</code> مع جميع إعدادات Firebase</li>
                    <li>• تحقق من قواعد الأمان في Firestore Console</li>
                    <li>• تأكد من تفعيل Authentication و Storage في Firebase Console</li>
                    <li>• راجع سجلات المتصفح (Console) للأخطاء التفصيلية</li>
                    <li>• تأكد من إضافة النطاق المحلي في Authorized domains</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
