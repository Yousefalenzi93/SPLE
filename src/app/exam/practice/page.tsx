'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useExam } from '@/contexts/ExamContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { DOMAIN_INFO } from '@/types'
import type { QuestionDomain, QuestionDifficulty } from '@/types'
import { 
  BookOpen, 
  Play, 
  Settings, 
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'

export default function PracticeExamPage() {
  const { currentUser } = useAuth()
  const { startExam, loading, error } = useExam()
  const router = useRouter()
  
  const [config, setConfig] = useState({
    domain: 'all' as QuestionDomain | 'all',
    difficulty: 'all' as QuestionDifficulty | 'all',
    questionCount: 20,
    showFeedback: true,
    allowReview: true
  })

  const handleStartPractice = async () => {
    try {
      const examConfig = {
        domain: config.domain === 'all' ? undefined : config.domain,
        difficulty: config.difficulty === 'all' ? undefined : config.difficulty,
        questionCount: config.questionCount,
        showFeedback: config.showFeedback,
        allowReview: config.allowReview,
        timeLimit: 0 // No time limit for practice
      }
      
      await startExam('practice', 1, examConfig)
      router.push('/exam/interface')
    } catch (error) {
      console.error('Error starting practice exam:', error)
    }
  }

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
                  وضع التدريب
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Practice Mode Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <div className="flex items-start">
                <Lightbulb className="h-6 w-6 text-blue-600 ml-3 mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-blue-900 mb-2">
                    ما هو وضع التدريب؟
                  </h2>
                  <div className="text-blue-800 space-y-2">
                    <p>
                      وضع التدريب مصمم لمساعدتك على التعلم والتحسن من خلال:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mr-4">
                      <li>عرض الإجابة الصحيحة فور الإجابة على السؤال</li>
                      <li>شروحات مفصلة لكل سؤال</li>
                      <li>إمكانية مراجعة الأسئلة والعودة إليها</li>
                      <li>بدون قيود زمنية للتركيز على التعلم</li>
                      <li>اختيار المجال والصعوبة حسب احتياجاتك</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Configuration Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-saudi-green text-white px-6 py-4">
                <h2 className="text-xl font-bold flex items-center">
                  <Settings className="h-6 w-6 ml-2" />
                  إعدادات التدريب
                </h2>
              </div>

              <div className="p-6">
                {/* Error Display */}
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                      <AlertCircle className="h-5 w-5 text-red-400" />
                      <div className="mr-3">
                        <p className="text-sm text-red-800">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Domain Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      المجال الأكاديمي
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="domain-all"
                          name="domain"
                          value="all"
                          checked={config.domain === 'all'}
                          onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value as any }))}
                          className="h-4 w-4 text-saudi-green focus:ring-saudi-green"
                        />
                        <label htmlFor="domain-all" className="mr-2 text-sm text-gray-700">
                          جميع المجالات
                        </label>
                      </div>
                      
                      {Object.entries(DOMAIN_INFO).map(([key, info]) => (
                        <div key={key} className="flex items-center">
                          <input
                            type="radio"
                            id={`domain-${key}`}
                            name="domain"
                            value={key}
                            checked={config.domain === key}
                            onChange={(e) => setConfig(prev => ({ ...prev, domain: e.target.value as any }))}
                            className="h-4 w-4 text-saudi-green focus:ring-saudi-green"
                          />
                          <label htmlFor={`domain-${key}`} className="mr-2 text-sm text-gray-700">
                            <span 
                              className="inline-block w-3 h-3 rounded-full ml-2"
                              style={{ backgroundColor: info.color }}
                            />
                            {info.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      مستوى الصعوبة
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="difficulty-all"
                          name="difficulty"
                          value="all"
                          checked={config.difficulty === 'all'}
                          onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value as any }))}
                          className="h-4 w-4 text-saudi-green focus:ring-saudi-green"
                        />
                        <label htmlFor="difficulty-all" className="mr-2 text-sm text-gray-700">
                          جميع المستويات
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="difficulty-easy"
                          name="difficulty"
                          value="easy"
                          checked={config.difficulty === 'easy'}
                          onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value as any }))}
                          className="h-4 w-4 text-saudi-green focus:ring-saudi-green"
                        />
                        <label htmlFor="difficulty-easy" className="mr-2 text-sm text-gray-700">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 ml-2">
                            سهل
                          </span>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="difficulty-medium"
                          name="difficulty"
                          value="medium"
                          checked={config.difficulty === 'medium'}
                          onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value as any }))}
                          className="h-4 w-4 text-saudi-green focus:ring-saudi-green"
                        />
                        <label htmlFor="difficulty-medium" className="mr-2 text-sm text-gray-700">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 ml-2">
                            متوسط
                          </span>
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="radio"
                          id="difficulty-hard"
                          name="difficulty"
                          value="hard"
                          checked={config.difficulty === 'hard'}
                          onChange={(e) => setConfig(prev => ({ ...prev, difficulty: e.target.value as any }))}
                          className="h-4 w-4 text-saudi-green focus:ring-saudi-green"
                        />
                        <label htmlFor="difficulty-hard" className="mr-2 text-sm text-gray-700">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 ml-2">
                            صعب
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Question Count */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    عدد الأسئلة
                  </label>
                  <div className="grid grid-cols-4 gap-3">
                    {[10, 20, 30, 50].map((count) => (
                      <button
                        key={count}
                        onClick={() => setConfig(prev => ({ ...prev, questionCount: count }))}
                        className={`py-2 px-4 text-sm font-medium rounded-md border ${
                          config.questionCount === count
                            ? 'bg-saudi-green text-white border-saudi-green'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {count} سؤال
                      </button>
                    ))}
                  </div>
                </div>

                {/* Practice Options */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    خيارات التدريب
                  </label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showFeedback"
                        checked={config.showFeedback}
                        onChange={(e) => setConfig(prev => ({ ...prev, showFeedback: e.target.checked }))}
                        className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded"
                      />
                      <label htmlFor="showFeedback" className="mr-3 text-sm text-gray-700">
                        عرض الملاحظات الفورية والشروحات
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowReview"
                        checked={config.allowReview}
                        onChange={(e) => setConfig(prev => ({ ...prev, allowReview: e.target.checked }))}
                        className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded"
                      />
                      <label htmlFor="allowReview" className="mr-3 text-sm text-gray-700">
                        السماح بمراجعة الأسئلة والعودة إليها
                      </label>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">ملخص الإعدادات:</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>
                      <strong>المجال:</strong> {
                        config.domain === 'all' 
                          ? 'جميع المجالات' 
                          : DOMAIN_INFO[config.domain as QuestionDomain]?.name
                      }
                    </p>
                    <p>
                      <strong>الصعوبة:</strong> {
                        config.difficulty === 'all' 
                          ? 'جميع المستويات' 
                          : config.difficulty === 'easy' 
                          ? 'سهل' 
                          : config.difficulty === 'medium' 
                          ? 'متوسط' 
                          : 'صعب'
                      }
                    </p>
                    <p><strong>عدد الأسئلة:</strong> {config.questionCount}</p>
                    <p><strong>الملاحظات الفورية:</strong> {config.showFeedback ? 'مفعل' : 'معطل'}</p>
                    <p><strong>مراجعة الأسئلة:</strong> {config.allowReview ? 'مسموح' : 'غير مسموح'}</p>
                  </div>
                </div>

                {/* Start Button */}
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={handleStartPractice}
                    disabled={loading}
                    className="flex items-center px-8 py-3 bg-saudi-green text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-medium"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                        جاري التحضير...
                      </>
                    ) : (
                      <>
                        <Play className="h-5 w-5 ml-2" />
                        بدء التدريب
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-green-600 ml-3 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    نصائح للاستفادة القصوى من وضع التدريب
                  </h3>
                  <div className="text-green-800 space-y-2">
                    <ul className="list-disc list-inside space-y-1 mr-4">
                      <li>ابدأ بالأسئلة السهلة لبناء الثقة</li>
                      <li>اقرأ الشروحات بعناية لفهم المفاهيم</li>
                      <li>ركز على المجالات التي تحتاج تحسين فيها</li>
                      <li>استخدم المراجع المذكورة للدراسة الإضافية</li>
                      <li>كرر التدريب على الأسئلة الصعبة</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
