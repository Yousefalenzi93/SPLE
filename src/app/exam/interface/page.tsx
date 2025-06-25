'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useExam } from '@/contexts/ExamContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Flag, 
  CheckCircle,
  AlertTriangle,
  Pause,
  Play,
  Send
} from 'lucide-react'

export default function ExamInterfacePage() {
  const { currentUser } = useAuth()
  const { 
    currentSession,
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isExamActive,
    submitAnswer,
    navigateToQuestion,
    submitExam,
    pauseExam,
    resumeExam,
    examConfig
  } = useExam()
  
  const router = useRouter()
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set())

  // Redirect if no active exam
  useEffect(() => {
    if (!currentSession || !questions.length) {
      router.push('/dashboard')
    }
  }, [currentSession, questions, router])

  // Set selected answer when question changes
  useEffect(() => {
    setSelectedAnswer(answers[currentQuestionIndex] ?? null)
  }, [currentQuestionIndex, answers])

  // Auto-submit when time runs out
  useEffect(() => {
    if (timeRemaining === 0 && isExamActive) {
      handleSubmitExam()
    }
  }, [timeRemaining, isExamActive])

  if (!currentSession || !questions.length) {
    return null
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const answeredCount = answers.filter(answer => answer !== null).length

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    submitAnswer(currentQuestionIndex, answerIndex)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      navigateToQuestion(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      navigateToQuestion(currentQuestionIndex - 1)
    }
  }

  const toggleFlag = () => {
    const newFlagged = new Set(flaggedQuestions)
    if (newFlagged.has(currentQuestionIndex)) {
      newFlagged.delete(currentQuestionIndex)
    } else {
      newFlagged.add(currentQuestionIndex)
    }
    setFlaggedQuestions(newFlagged)
  }

  const handleSubmitExam = async () => {
    if (!showSubmitConfirm) {
      setShowSubmitConfirm(true)
      return
    }
    
    await submitExam()
    router.push('/exam/results')
  }

  const getTimeColor = () => {
    if (timeRemaining <= 300) return 'text-red-600' // Last 5 minutes
    if (timeRemaining <= 900) return 'text-orange-600' // Last 15 minutes
    return 'text-gray-900'
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">
                  {currentSession.examType === 'mock' ? 'امتحان تجريبي' : 
                   currentSession.examType === 'practice' ? 'وضع التدريب' : 'اختبار مخصص'}
                  - القسم {currentSession.section}
                </h1>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse">
                {/* Timer */}
                {examConfig?.timeLimit && examConfig.timeLimit > 0 && (
                  <div className={`flex items-center ${getTimeColor()}`}>
                    <Clock className="h-5 w-5 ml-2" />
                    <span className="font-mono text-lg font-semibold">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}
                
                {/* Pause/Resume */}
                <button
                  onClick={isExamActive ? pauseExam : resumeExam}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  {isExamActive ? (
                    <>
                      <Pause className="h-4 w-4 ml-1" />
                      إيقاف مؤقت
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 ml-1" />
                      استئناف
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="pb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>السؤال {currentQuestionIndex + 1} من {questions.length}</span>
                <span>تم الإجابة على {answeredCount} من {questions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-saudi-green h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Question Panel */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6">
                    {/* Question Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center">
                        <span className="bg-saudi-green text-white text-sm font-medium px-3 py-1 rounded-full ml-3">
                          سؤال {currentQuestionIndex + 1}
                        </span>
                        {flaggedQuestions.has(currentQuestionIndex) && (
                          <Flag className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                      
                      <button
                        onClick={toggleFlag}
                        className={`flex items-center text-sm px-3 py-1 rounded-md ${
                          flaggedQuestions.has(currentQuestionIndex)
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Flag className="h-4 w-4 ml-1" />
                        {flaggedQuestions.has(currentQuestionIndex) ? 'إلغاء العلامة' : 'وضع علامة'}
                      </button>
                    </div>

                    {/* Question Content */}
                    <div className="mb-6">
                      <p className="text-lg font-medium text-gray-900 mb-6 leading-relaxed">
                        {currentQuestion.content}
                      </p>
                      
                      {/* Answer Options */}
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <div 
                            key={index}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                              selectedAnswer === index
                                ? 'border-saudi-green bg-green-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handleAnswerSelect(index)}
                          >
                            <div className="flex items-center">
                              <input
                                type="radio"
                                name="answer"
                                value={index}
                                checked={selectedAnswer === index}
                                onChange={() => handleAnswerSelect(index)}
                                className="h-4 w-4 text-saudi-green focus:ring-saudi-green"
                              />
                              <span className="mr-3 font-medium text-gray-700">
                                {String.fromCharCode(65 + index)}.
                              </span>
                              <span className="text-gray-900">{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between">
                      <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="h-5 w-5 ml-1" />
                        السؤال السابق
                      </button>
                      
                      <div className="flex items-center space-x-3 space-x-reverse">
                        {currentQuestionIndex === questions.length - 1 ? (
                          <button
                            onClick={handleSubmitExam}
                            className="flex items-center px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                          >
                            <Send className="h-4 w-4 ml-2" />
                            إنهاء الامتحان
                          </button>
                        ) : (
                          <button
                            onClick={handleNextQuestion}
                            className="flex items-center px-6 py-3 bg-saudi-green text-white rounded-md hover:bg-green-700"
                          >
                            السؤال التالي
                            <ChevronLeft className="h-5 w-5 mr-1" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Question Navigator */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-4 sticky top-24">
                  <h3 className="font-semibold text-gray-900 mb-4">خريطة الأسئلة</h3>
                  
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {questions.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => navigateToQuestion(index)}
                        className={`w-8 h-8 text-xs font-medium rounded ${
                          index === currentQuestionIndex
                            ? 'bg-saudi-green text-white'
                            : answers[index] !== null
                            ? 'bg-green-100 text-green-800'
                            : flaggedQuestions.has(index)
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                  </div>
                  
                  {/* Legend */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-saudi-green rounded ml-2"></div>
                      <span>السؤال الحالي</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded ml-2"></div>
                      <span>تم الإجابة</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-orange-100 border border-orange-300 rounded ml-2"></div>
                      <span>معلم بعلامة</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded ml-2"></div>
                      <span>لم تتم الإجابة</span>
                    </div>
                  </div>
                  
                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>تم الإجابة:</span>
                        <span className="font-medium">{answeredCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>لم تتم الإجابة:</span>
                        <span className="font-medium">{questions.length - answeredCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>معلم:</span>
                        <span className="font-medium">{flaggedQuestions.size}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Submit Confirmation Modal */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-orange-600 ml-2" />
                <h3 className="text-lg font-semibold text-gray-900">تأكيد إنهاء الامتحان</h3>
              </div>
              
              <p className="text-gray-700 mb-4">
                هل أنت متأكد من إنهاء الامتحان؟ لن تتمكن من العودة بعد الإنهاء.
              </p>
              
              <div className="mb-4 p-3 bg-gray-50 rounded-md">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span>الأسئلة المجابة:</span>
                    <span className="font-medium">{answeredCount} من {questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>الأسئلة المتبقية:</span>
                    <span className="font-medium">{questions.length - answeredCount}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 space-x-reverse">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  إنهاء الامتحان
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
