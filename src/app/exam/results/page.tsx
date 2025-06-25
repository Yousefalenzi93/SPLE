'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useExam } from '@/contexts/ExamContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { DOMAIN_INFO, EXAM_CONFIG } from '@/types'
import type { QuestionDomain } from '@/types'
import { 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  BarChart3,
  Home,
  RotateCcw,
  Eye,
  Download,
  Share2
} from 'lucide-react'
import Link from 'next/link'

export default function ExamResultsPage() {
  const { currentUser } = useAuth()
  const { currentSession, questions, answers, examConfig } = useExam()
  const router = useRouter()
  const [showDetailedResults, setShowDetailedResults] = useState(false)

  // Redirect if no completed exam
  useEffect(() => {
    if (!currentSession || !currentSession.completed || !questions.length) {
      router.push('/dashboard')
    }
  }, [currentSession, questions, router])

  if (!currentSession || !currentSession.completed || !questions.length) {
    return null
  }

  // Calculate results
  const totalQuestions = questions.length
  const correctAnswers = questions.filter((question, index) => 
    answers[index] === question.correctAnswer
  ).length
  const incorrectAnswers = totalQuestions - correctAnswers
  const score = currentSession.score || Math.round((correctAnswers / totalQuestions) * 100)
  const timeSpent = currentSession.timeSpent || 0
  const passed = score >= EXAM_CONFIG.PASSING_SCORE

  // Domain-wise analysis
  const domainAnalysis = Object.keys(DOMAIN_INFO).reduce((acc, domain) => {
    const domainQuestions = questions.filter(q => q.domain === domain)
    const domainCorrect = domainQuestions.filter((q, index) => {
      const questionIndex = questions.findIndex(question => question.id === q.id)
      return answers[questionIndex] === q.correctAnswer
    }).length
    
    acc[domain as QuestionDomain] = {
      total: domainQuestions.length,
      correct: domainCorrect,
      percentage: domainQuestions.length > 0 ? Math.round((domainCorrect / domainQuestions.length) * 100) : 0
    }
    return acc
  }, {} as Record<QuestionDomain, { total: number; correct: number; percentage: number }>)

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours} ساعة ${minutes} دقيقة`
    }
    return `${minutes} دقيقة ${secs} ثانية`
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <h1 className="text-2xl font-bold text-gray-900">
                نتائج الامتحان
              </h1>
              <div className="flex items-center space-x-3 space-x-reverse">
                <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Download className="h-4 w-4 ml-1" />
                  تحميل التقرير
                </button>
                <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Share2 className="h-4 w-4 ml-1" />
                  مشاركة
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Overall Results Card */}
            <div className={`rounded-lg border-2 p-8 mb-8 ${getScoreBackground(score)}`}>
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  {passed ? (
                    <Trophy className="h-16 w-16 text-yellow-500" />
                  ) : (
                    <XCircle className="h-16 w-16 text-red-500" />
                  )}
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {passed ? 'مبروك! لقد نجحت' : 'للأسف، لم تحقق الدرجة المطلوبة'}
                </h2>
                
                <div className={`text-6xl font-bold mb-4 ${getScoreColor(score)}`}>
                  {score}%
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CheckCircle className="h-6 w-6 text-green-600 ml-2" />
                      <span className="text-lg font-semibold text-gray-900">إجابات صحيحة</span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <XCircle className="h-6 w-6 text-red-600 ml-2" />
                      <span className="text-lg font-semibold text-gray-900">إجابات خاطئة</span>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="h-6 w-6 text-blue-600 ml-2" />
                      <span className="text-lg font-semibold text-gray-900">الوقت المستغرق</span>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{formatTime(timeSpent)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Domain Analysis */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 ml-2" />
                  تحليل الأداء حسب المجال
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(DOMAIN_INFO).map(([key, info]) => {
                    const analysis = domainAnalysis[key as QuestionDomain]
                    if (!analysis || analysis.total === 0) return null
                    
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-medium text-gray-900">{info.name}</h4>
                          <span className={`text-lg font-bold ${getScoreColor(analysis.percentage)}`}>
                            {analysis.percentage}%
                          </span>
                        </div>
                        
                        <div className="mb-3">
                          <div className="flex justify-between text-sm text-gray-600 mb-1">
                            <span>{analysis.correct} من {analysis.total}</span>
                            <span>{info.percentage}% من الامتحان</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${analysis.percentage}%`,
                                backgroundColor: info.color
                              }}
                            />
                          </div>
                        </div>
                        
                        <p className="text-xs text-gray-500">{info.description}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Results */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    مراجعة تفصيلية للأسئلة
                  </h3>
                  <button
                    onClick={() => setShowDetailedResults(!showDetailedResults)}
                    className="flex items-center px-3 py-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    <Eye className="h-4 w-4 ml-1" />
                    {showDetailedResults ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                  </button>
                </div>
              </div>
              
              {showDetailedResults && (
                <div className="p-6">
                  <div className="space-y-6">
                    {questions.map((question, index) => {
                      const userAnswer = answers[index]
                      const isCorrect = userAnswer === question.correctAnswer
                      
                      return (
                        <div key={question.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center">
                              <span className="bg-gray-100 text-gray-800 text-sm font-medium px-2 py-1 rounded mr-3">
                                {index + 1}
                              </span>
                              <span 
                                className="inline-block w-3 h-3 rounded-full ml-2"
                                style={{ backgroundColor: DOMAIN_INFO[question.domain].color }}
                              />
                              <span className="text-sm text-gray-600">
                                {DOMAIN_INFO[question.domain].name}
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                          </div>
                          
                          <p className="text-gray-900 mb-3 font-medium">{question.content}</p>
                          
                          <div className="space-y-2 mb-3">
                            {question.options.map((option, optionIndex) => (
                              <div 
                                key={optionIndex}
                                className={`p-2 rounded text-sm ${
                                  optionIndex === question.correctAnswer
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : optionIndex === userAnswer && !isCorrect
                                    ? 'bg-red-50 text-red-800 border border-red-200'
                                    : 'bg-gray-50 text-gray-700'
                                }`}
                              >
                                <span className="font-medium ml-2">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                {option}
                                {optionIndex === question.correctAnswer && (
                                  <CheckCircle className="inline h-4 w-4 mr-1 text-green-600" />
                                )}
                                {optionIndex === userAnswer && !isCorrect && (
                                  <XCircle className="inline h-4 w-4 mr-1 text-red-600" />
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {question.explanation && (
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="text-sm text-blue-800">
                                <strong>الشرح:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="flex items-center justify-center px-6 py-3 bg-saudi-green text-white rounded-md hover:bg-green-700"
              >
                <Home className="h-4 w-4 ml-2" />
                العودة إلى لوحة التحكم
              </Link>
              
              <Link
                href="/exam/mock"
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <RotateCcw className="h-4 w-4 ml-2" />
                إعادة الامتحان
              </Link>
              
              <Link
                href="/analytics"
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <BarChart3 className="h-4 w-4 ml-2" />
                عرض التحليلات التفصيلية
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
