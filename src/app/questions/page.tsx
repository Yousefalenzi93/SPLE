'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { getQuestions } from '@/lib/firestore'
import { DOMAIN_INFO } from '@/types'
import type { Question, QuestionDomain, QuestionDifficulty } from '@/types'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Check,
  ArrowRight,
  Eye,
  EyeOff,
  Lightbulb
} from 'lucide-react'
import Link from 'next/link'

export default function QuestionsPage() {
  const { currentUser } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [domainFilter, setDomainFilter] = useState<QuestionDomain | 'all'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<QuestionDifficulty | 'all'>('all')
  const [showAnswers, setShowAnswers] = useState<{ [key: string]: boolean }>({})
  const [showExplanations, setShowExplanations] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    fetchQuestions()
  }, [domainFilter, difficultyFilter])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const questionsData = await getQuestions(
        domainFilter === 'all' ? undefined : domainFilter,
        difficultyFilter === 'all' ? undefined : difficultyFilter,
        true, // Only approved questions for students
        50
      )
      setQuestions(questionsData)
    } catch (error) {
      console.error('Error fetching questions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.explanation.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const toggleAnswer = (questionId: string) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  const toggleExplanation = (questionId: string) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }))
  }

  const getDomainColor = (domain: QuestionDomain) => {
    return DOMAIN_INFO[domain].color
  }

  const getDifficultyColor = (difficulty: QuestionDifficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    }
    return colors[difficulty]
  }

  const getDifficultyName = (difficulty: QuestionDifficulty) => {
    const names = {
      easy: 'سهل',
      medium: 'متوسط',
      hard: 'صعب'
    }
    return names[difficulty]
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  بنك الأسئلة
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Domain Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {Object.entries(DOMAIN_INFO).map(([key, info]) => {
                const domainQuestions = questions.filter(q => q.domain === key)
                return (
                  <div key={key} className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center">
                      <div 
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: info.color }}
                      >
                        <BookOpen className="h-4 w-4 text-white" />
                      </div>
                      <div className="mr-4">
                        <p className="text-sm font-medium text-gray-600">{info.name}</p>
                        <p className="text-2xl font-semibold text-gray-900">{domainQuestions.length}</p>
                        <p className="text-xs text-gray-500">{info.percentage}% من الامتحان</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      البحث
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="form-input pr-10"
                        placeholder="البحث في الأسئلة والشروحات"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Domain Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المجال
                    </label>
                    <select
                      className="form-input"
                      value={domainFilter}
                      onChange={(e) => setDomainFilter(e.target.value as any)}
                    >
                      <option value="all">جميع المجالات</option>
                      {Object.entries(DOMAIN_INFO).map(([key, info]) => (
                        <option key={key} value={key}>
                          {info.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الصعوبة
                    </label>
                    <select
                      className="form-input"
                      value={difficultyFilter}
                      onChange={(e) => setDifficultyFilter(e.target.value as any)}
                    >
                      <option value="all">جميع المستويات</option>
                      <option value="easy">سهل</option>
                      <option value="medium">متوسط</option>
                      <option value="hard">صعب</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {loading ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saudi-green mx-auto"></div>
                  <p className="mt-2 text-gray-600">جاري تحميل الأسئلة...</p>
                </div>
              ) : (
                filteredQuestions.map((question, index) => (
                  <div key={question.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      {/* Question Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="bg-saudi-green text-white text-sm font-medium px-3 py-1 rounded-full ml-3">
                            سؤال {index + 1}
                          </span>
                          <span 
                            className="inline-block w-3 h-3 rounded-full ml-2"
                            style={{ backgroundColor: getDomainColor(question.domain) }}
                          />
                          <span className="text-sm font-medium text-gray-700">
                            {DOMAIN_INFO[question.domain].name}
                          </span>
                          <span className={`mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                            {getDifficultyName(question.difficulty)}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() => toggleAnswer(question.id)}
                            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                          >
                            {showAnswers[question.id] ? (
                              <>
                                <EyeOff className="h-4 w-4 ml-1" />
                                إخفاء الإجابة
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 ml-1" />
                                عرض الإجابة
                              </>
                            )}
                          </button>
                          
                          <button
                            onClick={() => toggleExplanation(question.id)}
                            className="flex items-center text-sm text-green-600 hover:text-green-800"
                          >
                            <Lightbulb className="h-4 w-4 ml-1" />
                            {showExplanations[question.id] ? 'إخفاء الشرح' : 'عرض الشرح'}
                          </button>
                        </div>
                      </div>

                      {/* Question Content */}
                      <div className="mb-4">
                        <p className="text-lg font-medium text-gray-900 mb-4">
                          {question.content}
                        </p>
                        
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex} 
                              className={`p-3 rounded-md border ${
                                showAnswers[question.id] && optionIndex === question.correctAnswer
                                  ? 'bg-green-50 border-green-200 text-green-800'
                                  : 'bg-gray-50 border-gray-200 text-gray-700'
                              }`}
                            >
                              <div className="flex items-center">
                                <span className="font-medium ml-2">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span>{option}</span>
                                {showAnswers[question.id] && optionIndex === question.correctAnswer && (
                                  <Check className="h-4 w-4 mr-2 text-green-600" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Explanation */}
                      {showExplanations[question.id] && question.explanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                          <div className="flex items-start">
                            <Lightbulb className="h-5 w-5 text-blue-600 ml-2 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-blue-900 mb-2">الشرح:</h4>
                              <p className="text-blue-800">{question.explanation}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* References */}
                      {question.references && question.references.length > 0 && (
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">المراجع:</h4>
                          <div className="flex flex-wrap gap-2">
                            {question.references.map((reference, refIndex) => (
                              <span 
                                key={refIndex}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {reference}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}

              {filteredQuestions.length === 0 && !loading && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد أسئلة مطابقة للبحث</p>
                  <p className="text-sm text-gray-400 mt-2">
                    جرب تغيير معايير البحث أو الفلاتر
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
