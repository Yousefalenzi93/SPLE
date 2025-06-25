'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useExam } from '@/contexts/ExamContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { EXAM_CONFIG } from '@/types'
import { 
  Clock, 
  BookOpen, 
  AlertTriangle, 
  Play, 
  ArrowRight,
  CheckCircle,
  Info
} from 'lucide-react'
import Link from 'next/link'

export default function MockExamPage() {
  const { currentUser } = useAuth()
  const { startExam, loading, error } = useExam()
  const router = useRouter()
  const [selectedSection, setSelectedSection] = useState<1 | 2>(1)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showInstructions, setShowInstructions] = useState(true)

  const handleStartExam = async () => {
    if (!agreedToTerms) {
      alert('يجب الموافقة على شروط الامتحان قبل البدء')
      return
    }

    try {
      await startExam('mock', selectedSection)
      router.push('/exam/interface')
    } catch (error) {
      console.error('Error starting exam:', error)
    }
  }

  if (showInstructions) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center">
                  <Link
                    href="/dashboard"
                    className="flex items-center text-gray-600 hover:text-gray-900 ml-4"
                  >
                    <ArrowRight className="h-5 w-5 ml-1" />
                    العودة إلى لوحة التحكم
                  </Link>
                  <h1 className="text-2xl font-bold text-gray-900">
                    الامتحان التجريبي
                  </h1>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              
              {/* Instructions Card */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-saudi-green text-white px-6 py-4">
                  <h2 className="text-xl font-bold flex items-center">
                    <BookOpen className="h-6 w-6 ml-2" />
                    تعليمات الامتحان التجريبي
                  </h2>
                </div>

                <div className="p-6">
                  {/* Exam Overview */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">نظرة عامة على الامتحان</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <Clock className="h-5 w-5 text-blue-600 ml-2" />
                          <span className="font-medium text-blue-900">المدة الزمنية</span>
                        </div>
                        <p className="text-blue-800">{EXAM_CONFIG.SECTION_TIME_MINUTES} دقيقة لكل قسم</p>
                      </div>
                      
                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center mb-2">
                          <BookOpen className="h-5 w-5 text-green-600 ml-2" />
                          <span className="font-medium text-green-900">عدد الأسئلة</span>
                        </div>
                        <p className="text-green-800">{EXAM_CONFIG.SECTION_1_QUESTIONS} سؤال لكل قسم</p>
                      </div>
                    </div>
                  </div>

                  {/* Important Instructions */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">تعليمات مهمة</h3>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 ml-2 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900 mb-2">تحذيرات مهمة:</h4>
                          <ul className="text-yellow-800 text-sm space-y-1">
                            <li>• لا يمكن العودة إلى القسم السابق بعد الانتهاء منه</li>
                            <li>• سيتم حفظ إجاباتك تلقائياً</li>
                            <li>• سيتم إنهاء الامتحان تلقائياً عند انتهاء الوقت</li>
                            <li>• تأكد من استقرار اتصال الإنترنت</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 text-gray-700">
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 ml-2 mt-0.5" />
                        <p>اقرأ كل سؤال بعناية قبل اختيار الإجابة</p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 ml-2 mt-0.5" />
                        <p>يمكنك تغيير إجابتك في أي وقت خلال القسم الحالي</p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 ml-2 mt-0.5" />
                        <p>استخدم زر "مراجعة" للتنقل بين الأسئلة</p>
                      </div>
                      <div className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 ml-2 mt-0.5" />
                        <p>تأكد من الإجابة على جميع الأسئلة قبل إنهاء القسم</p>
                      </div>
                    </div>
                  </div>

                  {/* Section Selection */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">اختيار القسم</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedSection === 1 
                            ? 'border-saudi-green bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedSection(1)}
                      >
                        <div className="flex items-center mb-2">
                          <input
                            type="radio"
                            name="section"
                            value="1"
                            checked={selectedSection === 1}
                            onChange={() => setSelectedSection(1)}
                            className="h-4 w-4 text-saudi-green focus:ring-saudi-green"
                          />
                          <span className="mr-2 font-medium text-gray-900">القسم الأول</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {EXAM_CONFIG.SECTION_1_QUESTIONS} سؤال - {EXAM_CONFIG.SECTION_TIME_MINUTES} دقيقة
                        </p>
                      </div>

                      <div 
                        className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                          selectedSection === 2 
                            ? 'border-saudi-green bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedSection(2)}
                      >
                        <div className="flex items-center mb-2">
                          <input
                            type="radio"
                            name="section"
                            value="2"
                            checked={selectedSection === 2}
                            onChange={() => setSelectedSection(2)}
                            className="h-4 w-4 text-saudi-green focus:ring-saudi-green"
                          />
                          <span className="mr-2 font-medium text-gray-900">القسم الثاني</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {EXAM_CONFIG.SECTION_2_QUESTIONS} سؤال - {EXAM_CONFIG.SECTION_TIME_MINUTES} دقيقة
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="terms" className="mr-3 text-sm text-gray-700">
                          أوافق على شروط الامتحان وأؤكد أنني سأقوم بأداء الامتحان بنزاهة وأمانة. 
                          أفهم أن هذا امتحان تجريبي لأغراض التدريب فقط ولا يحل محل الامتحان الرسمي.
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Error Display */}
                  {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                      <div className="flex">
                        <AlertTriangle className="h-5 w-5 text-red-400" />
                        <div className="mr-3">
                          <p className="text-sm text-red-800">{error}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setShowInstructions(false)}
                      className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      إعداد مخصص
                    </button>
                    
                    <button
                      onClick={handleStartExam}
                      disabled={!agreedToTerms || loading}
                      className="flex items-center px-8 py-3 bg-saudi-green text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                          جاري التحضير...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 ml-2" />
                          بدء الامتحان
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    )
  }

  // Custom Configuration View (placeholder for now)
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Info className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              الإعداد المخصص
            </h2>
            <p className="text-gray-600 mb-6">
              هذه الميزة ستكون متاحة قريباً. يمكنك العودة لبدء الامتحان التجريبي بالإعدادات الافتراضية.
            </p>
            <button
              onClick={() => setShowInstructions(true)}
              className="px-6 py-3 bg-saudi-green text-white rounded-md hover:bg-green-700"
            >
              العودة للتعليمات
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
