'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { seedQuestionsToFirestore, getQuestionsCount, getQuestionsByDomainCount } from '@/lib/seedQuestions'
import { DOMAIN_INFO } from '@/types'
import { 
  Database, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  RefreshCw,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default function AdminSeedPage() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [questionsCount, setQuestionsCount] = useState<number | null>(null)
  const [domainCounts, setDomainCounts] = useState<any>(null)

  const handleSeedQuestions = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const seedResult = await seedQuestionsToFirestore()
      setResult(seedResult)
      
      // Refresh counts after seeding
      if (seedResult.success) {
        await refreshCounts()
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'حدث خطأ أثناء إضافة الأسئلة',
        error: error instanceof Error ? error.message : 'خطأ غير معروف'
      })
    } finally {
      setLoading(false)
    }
  }

  const refreshCounts = async () => {
    try {
      const [totalCount, domainCount] = await Promise.all([
        getQuestionsCount(),
        getQuestionsByDomainCount()
      ])
      
      setQuestionsCount(totalCount)
      setDomainCounts(domainCount)
    } catch (error) {
      console.error('Error refreshing counts:', error)
    }
  }

  const handleRefreshCounts = async () => {
    setLoading(true)
    await refreshCounts()
    setLoading(false)
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
                  إدارة البيانات النموذجية
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Warning Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div className="mr-3">
                  <h3 className="text-sm font-medium text-yellow-800">
                    تحذير مهم
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      هذه الصفحة مخصصة لإضافة البيانات النموذجية إلى قاعدة البيانات. 
                      يُنصح بتشغيل هذه العملية مرة واحدة فقط عند إعداد النظام لأول مرة.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Statistics */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  إحصائيات قاعدة البيانات الحالية
                </h3>
                <button
                  onClick={handleRefreshCounts}
                  disabled={loading}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
                >
                  <RefreshCw className={`h-4 w-4 ml-1 ${loading ? 'animate-spin' : ''}`} />
                  تحديث
                </button>
              </div>
              
              <div className="p-6">
                {questionsCount !== null ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Total Questions */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center">
                        <Database className="h-8 w-8 text-blue-600" />
                        <div className="mr-4">
                          <p className="text-sm font-medium text-blue-600">إجمالي الأسئلة</p>
                          <p className="text-2xl font-semibold text-blue-900">{questionsCount}</p>
                        </div>
                      </div>
                    </div>

                    {/* Domain Breakdown */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <BarChart3 className="h-6 w-6 text-green-600" />
                        <p className="text-sm font-medium text-green-600 mr-2">توزيع الأسئلة حسب المجال</p>
                      </div>
                      {domainCounts && (
                        <div className="space-y-2">
                          {Object.entries(DOMAIN_INFO).map(([key, info]) => (
                            <div key={key} className="flex justify-between items-center">
                              <span className="text-sm text-green-800">{info.name}</span>
                              <span className="text-sm font-medium text-green-900">
                                {domainCounts[key] || 0}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-2 text-sm text-gray-600">جاري تحميل الإحصائيات...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Seed Questions Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  إضافة الأسئلة النموذجية
                </h3>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-md font-medium text-gray-900 mb-2">
                    ما سيتم إضافته:
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>أسئلة متنوعة في المجالات الأربعة للصيدلة</li>
                    <li>أسئلة بمستويات صعوبة مختلفة (سهل، متوسط، صعب)</li>
                    <li>شروحات مفصلة لكل سؤال</li>
                    <li>مراجع أكاديمية معتمدة</li>
                    <li>محتوى متوافق مع المنهج السعودي</li>
                  </ul>
                </div>

                {/* Result Display */}
                {result && (
                  <div className={`mb-6 p-4 rounded-md ${
                    result.success 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      )}
                      <div className="mr-3">
                        <h4 className={`text-sm font-medium ${
                          result.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {result.success ? 'نجحت العملية!' : 'فشلت العملية!'}
                        </h4>
                        <p className={`mt-1 text-sm ${
                          result.success ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {result.message}
                        </p>
                        {result.count && (
                          <p className={`mt-1 text-sm ${
                            result.success ? 'text-green-700' : 'text-red-700'
                          }`}>
                            تم إضافة {result.count} سؤال
                          </p>
                        )}
                        {result.errors && result.errors.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-red-700 font-medium">أخطاء:</p>
                            <ul className="list-disc list-inside text-sm text-red-600 mt-1">
                              {result.errors.map((error: string, index: number) => (
                                <li key={index}>{error}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    onClick={handleSeedQuestions}
                    disabled={loading}
                    className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-saudi-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saudi-green disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                        جاري إضافة الأسئلة...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 ml-2" />
                        إضافة الأسئلة النموذجية
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-500">
                    هذه العملية قد تستغرق بضع دقائق حسب سرعة الاتصال
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link
                href="/admin/questions"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Database className="h-4 w-4 ml-2" />
                إدارة الأسئلة
              </Link>
              
              <Link
                href="/admin/analytics"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <BarChart3 className="h-4 w-4 ml-2" />
                عرض التحليلات
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
