'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from '@/lib/firestore'
import { DOMAIN_INFO } from '@/types'
import type { Question, QuestionDomain, QuestionDifficulty } from '@/types'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Check, 
  X,
  ArrowRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import Link from 'next/link'

export default function AdminQuestionsPage() {
  const { currentUser } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [domainFilter, setDomainFilter] = useState<QuestionDomain | 'all'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<QuestionDifficulty | 'all'>('all')
  const [approvalFilter, setApprovalFilter] = useState<'all' | 'approved' | 'pending'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      // For admin, fetch all questions including unapproved ones
      const questionsData = await getQuestions(undefined, undefined, false, 100)
      setQuestions(questionsData)
    } catch (error) {
      console.error('Error fetching questions:', error)
      setError('فشل في تحميل الأسئلة')
    } finally {
      setLoading(false)
    }
  }

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDomain = domainFilter === 'all' || question.domain === domainFilter
    const matchesDifficulty = difficultyFilter === 'all' || question.difficulty === difficultyFilter
    const matchesApproval = approvalFilter === 'all' || 
      (approvalFilter === 'approved' && question.approved) ||
      (approvalFilter === 'pending' && !question.approved)
    
    return matchesSearch && matchesDomain && matchesDifficulty && matchesApproval
  })

  const handleApproveQuestion = async (questionId: string, approved: boolean) => {
    try {
      await updateQuestion(questionId, { approved })
      setQuestions(prev => prev.map(q => 
        q.id === questionId ? { ...q, approved } : q
      ))
      setSuccess(`تم ${approved ? 'الموافقة على' : 'رفض'} السؤال بنجاح`)
    } catch (error) {
      setError('فشل في تحديث حالة الموافقة')
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا السؤال؟')) return
    
    try {
      await deleteQuestion(questionId)
      setQuestions(prev => prev.filter(q => q.id !== questionId))
      setSuccess('تم حذف السؤال بنجاح')
    } catch (error) {
      setError('فشل في حذف السؤال')
    }
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
                  إدارة الأسئلة
                </h1>
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center px-4 py-2 bg-saudi-green text-white rounded-md hover:bg-green-700"
              >
                <Plus className="h-4 w-4 ml-2" />
                إضافة سؤال جديد
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="mr-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="mr-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي الأسئلة</p>
                    <p className="text-2xl font-semibold text-gray-900">{questions.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">أسئلة معتمدة</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {questions.filter(q => q.approved).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">في انتظار الموافقة</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {questions.filter(q => !q.approved).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Filter className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">أسئلة مفلترة</p>
                    <p className="text-2xl font-semibold text-gray-900">{filteredQuestions.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        placeholder="البحث في محتوى الأسئلة"
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

                  {/* Approval Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      حالة الموافقة
                    </label>
                    <select
                      className="form-input"
                      value={approvalFilter}
                      onChange={(e) => setApprovalFilter(e.target.value as any)}
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="approved">معتمد</option>
                      <option value="pending">في انتظار الموافقة</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Questions List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  قائمة الأسئلة ({filteredQuestions.length})
                </h3>
              </div>

              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saudi-green mx-auto"></div>
                  <p className="mt-2 text-gray-600">جاري تحميل الأسئلة...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredQuestions.map((question) => (
                    <div key={question.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <span 
                              className="inline-block w-3 h-3 rounded-full ml-2"
                              style={{ backgroundColor: getDomainColor(question.domain) }}
                            />
                            <span className="text-sm font-medium text-gray-900">
                              {DOMAIN_INFO[question.domain].name}
                            </span>
                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                              {getDifficultyName(question.difficulty)}
                            </span>
                            {question.approved ? (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Check className="h-3 w-3 ml-1" />
                                معتمد
                              </span>
                            ) : (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                <AlertCircle className="h-3 w-3 ml-1" />
                                في انتظار الموافقة
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-900 mb-3 font-medium">
                            {question.content}
                          </p>
                          
                          <div className="space-y-1 mb-3">
                            {question.options.map((option, index) => (
                              <div 
                                key={index} 
                                className={`text-sm p-2 rounded ${
                                  index === question.correctAnswer 
                                    ? 'bg-green-50 text-green-800 border border-green-200' 
                                    : 'bg-gray-50 text-gray-700'
                                }`}
                              >
                                {String.fromCharCode(65 + index)}. {option}
                                {index === question.correctAnswer && (
                                  <Check className="inline h-4 w-4 mr-1 text-green-600" />
                                )}
                              </div>
                            ))}
                          </div>
                          
                          {question.explanation && (
                            <div className="bg-blue-50 p-3 rounded-md mb-3">
                              <p className="text-sm text-blue-800">
                                <strong>الشرح:</strong> {question.explanation}
                              </p>
                            </div>
                          )}
                          
                          <div className="text-xs text-gray-500">
                            أنشئ بواسطة: {question.createdBy} | 
                            تاريخ الإنشاء: {question.createdAt.toLocaleDateString('ar-SA')}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 space-x-reverse mr-4">
                          {!question.approved && (
                            <button
                              onClick={() => handleApproveQuestion(question.id, true)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                              title="الموافقة على السؤال"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          )}
                          
                          {question.approved && (
                            <button
                              onClick={() => handleApproveQuestion(question.id, false)}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-md"
                              title="إلغاء الموافقة"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => setEditingQuestion(question)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                            title="تعديل السؤال"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                            title="حذف السؤال"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredQuestions.length === 0 && (
                    <div className="p-8 text-center">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">لا توجد أسئلة مطابقة للبحث</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
