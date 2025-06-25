'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { getUserExamSessions, getUserProgress } from '@/lib/firestore'
import { DOMAIN_INFO, EXAM_CONFIG } from '@/types'
import type { ExamSession, UserProgress, QuestionDomain } from '@/types'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Clock,
  ArrowRight,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Users
} from 'lucide-react'
import Link from 'next/link'

export default function AnalyticsPage() {
  const { currentUser } = useAuth()
  const [examSessions, setExamSessions] = useState<ExamSession[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('month')

  useEffect(() => {
    if (currentUser) {
      fetchAnalyticsData()
    }
  }, [currentUser])

  const fetchAnalyticsData = async () => {
    if (!currentUser) return
    
    try {
      setLoading(true)
      const [sessions, progress] = await Promise.all([
        getUserExamSessions(currentUser.uid, undefined, 50),
        getUserProgress(currentUser.uid)
      ])
      
      setExamSessions(sessions)
      setUserProgress(progress)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter sessions based on time range
  const filteredSessions = examSessions.filter(session => {
    if (selectedTimeRange === 'all') return true
    
    const sessionDate = session.startTime
    const now = new Date()
    const cutoffDate = new Date()
    
    if (selectedTimeRange === 'week') {
      cutoffDate.setDate(now.getDate() - 7)
    } else if (selectedTimeRange === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1)
    }
    
    return sessionDate >= cutoffDate
  })

  // Calculate statistics
  const completedSessions = filteredSessions.filter(s => s.completed)
  const totalExams = completedSessions.length
  const averageScore = totalExams > 0 
    ? Math.round(completedSessions.reduce((sum, s) => sum + (s.score || 0), 0) / totalExams)
    : 0
  
  const passedExams = completedSessions.filter(s => (s.score || 0) >= EXAM_CONFIG.PASSING_SCORE).length
  const passRate = totalExams > 0 ? Math.round((passedExams / totalExams) * 100) : 0

  // Domain performance
  const domainPerformance = Object.keys(DOMAIN_INFO).reduce((acc, domain) => {
    const domainSessions = completedSessions.filter(s => 
      // This would need to be calculated based on question domains in the session
      // For now, we'll use mock data
      true
    )
    
    acc[domain as QuestionDomain] = {
      averageScore: Math.floor(Math.random() * 40) + 60, // Mock data
      totalAttempts: domainSessions.length,
      improvement: Math.floor(Math.random() * 20) - 10 // Mock data
    }
    return acc
  }, {} as Record<QuestionDomain, { averageScore: number; totalAttempts: number; improvement: number }>)

  // Recent performance trend
  const recentSessions = completedSessions
    .sort((a, b) => b.startTime.getTime() - a.startTime.getTime())
    .slice(0, 10)

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

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (improvement < 0) return <TrendingUp className="h-4 w-4 text-red-600 transform rotate-180" />
    return <div className="h-4 w-4" />
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saudi-green mx-auto"></div>
            <p className="mt-4 text-gray-600">جاري تحميل التحليلات...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
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
                  تحليل الأداء
                </h1>
              </div>
              
              {/* Time Range Filter */}
              <div className="flex items-center space-x-2 space-x-reverse">
                <span className="text-sm text-gray-600">الفترة الزمنية:</span>
                <select
                  value={selectedTimeRange}
                  onChange={(e) => setSelectedTimeRange(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1"
                >
                  <option value="week">آخر أسبوع</option>
                  <option value="month">آخر شهر</option>
                  <option value="all">جميع الفترات</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي الامتحانات</p>
                    <p className="text-2xl font-semibold text-gray-900">{totalExams}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">متوسط النتائج</p>
                    <p className={`text-2xl font-semibold ${getScoreColor(averageScore)}`}>
                      {averageScore}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">معدل النجاح</p>
                    <p className={`text-2xl font-semibold ${getScoreColor(passRate)}`}>
                      {passRate}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Award className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">أعلى نتيجة</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {completedSessions.length > 0 
                        ? Math.max(...completedSessions.map(s => s.score || 0))
                        : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Domain Performance */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <BarChart3 className="h-5 w-5 ml-2" />
                  الأداء حسب المجال الأكاديمي
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(DOMAIN_INFO).map(([key, info]) => {
                    const performance = domainPerformance[key as QuestionDomain]
                    
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <span 
                              className="inline-block w-4 h-4 rounded-full ml-2"
                              style={{ backgroundColor: info.color }}
                            />
                            <h4 className="font-medium text-gray-900">{info.name}</h4>
                          </div>
                          <div className="flex items-center">
                            {getImprovementIcon(performance.improvement)}
                            <span className={`text-lg font-bold mr-2 ${getScoreColor(performance.averageScore)}`}>
                              {performance.averageScore}%
                            </span>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${performance.averageScore}%`,
                                backgroundColor: info.color
                              }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{info.percentage}% من الامتحان</span>
                          <span>{performance.totalAttempts} محاولة</span>
                        </div>
                        
                        {performance.improvement !== 0 && (
                          <div className="mt-2 text-xs">
                            <span className={performance.improvement > 0 ? 'text-green-600' : 'text-red-600'}>
                              {performance.improvement > 0 ? '+' : ''}{performance.improvement}% 
                              {performance.improvement > 0 ? 'تحسن' : 'انخفاض'} مقارنة بالفترة السابقة
                            </span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Recent Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Exams */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 ml-2" />
                    الامتحانات الأخيرة
                  </h3>
                </div>
                
                <div className="p-6">
                  {recentSessions.length > 0 ? (
                    <div className="space-y-4">
                      {recentSessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="flex items-center">
                              <span className="text-sm font-medium text-gray-900">
                                {session.examType === 'mock' ? 'امتحان تجريبي' : 
                                 session.examType === 'practice' ? 'تدريب' : 'مخصص'}
                              </span>
                              <span className="text-xs text-gray-500 mr-2">
                                القسم {session.section}
                              </span>
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Calendar className="h-3 w-3 ml-1" />
                              {session.startTime.toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                          
                          <div className="text-left">
                            <div className={`text-lg font-bold ${getScoreColor(session.score || 0)}`}>
                              {session.score || 0}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {session.timeSpent ? Math.round(session.timeSpent / 60) : 0} دقيقة
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">لا توجد امتحانات مكتملة</p>
                      <p className="text-sm text-gray-400 mt-2">
                        ابدأ أول امتحان لك لرؤية التحليلات
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Target className="h-5 w-5 ml-2" />
                    توصيات للتحسين
                  </h3>
                </div>
                
                <div className="p-6">
                  <div className="space-y-4">
                    {/* Weak Areas */}
                    {Object.entries(domainPerformance)
                      .filter(([_, perf]) => perf.averageScore < 70)
                      .slice(0, 2)
                      .map(([domain, perf]) => (
                        <div key={domain} className="flex items-start p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <AlertTriangle className="h-5 w-5 text-orange-600 ml-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-orange-900">
                              تحسين {DOMAIN_INFO[domain as QuestionDomain].name}
                            </h4>
                            <p className="text-sm text-orange-800 mt-1">
                              متوسط نتائجك {perf.averageScore}%. ننصح بالتركيز على هذا المجال.
                            </p>
                          </div>
                        </div>
                      ))}

                    {/* Strong Areas */}
                    {Object.entries(domainPerformance)
                      .filter(([_, perf]) => perf.averageScore >= 80)
                      .slice(0, 1)
                      .map(([domain, perf]) => (
                        <div key={domain} className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="h-5 w-5 text-green-600 ml-2 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-green-900">
                              ممتاز في {DOMAIN_INFO[domain as QuestionDomain].name}
                            </h4>
                            <p className="text-sm text-green-800 mt-1">
                              متوسط نتائجك {perf.averageScore}%. استمر في هذا المستوى الممتاز!
                            </p>
                          </div>
                        </div>
                      ))}

                    {/* General Recommendations */}
                    <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <BookOpen className="h-5 w-5 text-blue-600 ml-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-900">نصيحة عامة</h4>
                        <p className="text-sm text-blue-800 mt-1">
                          {totalExams < 5 
                            ? 'قم بأداء المزيد من الامتحانات التجريبية لتحسين أدائك'
                            : averageScore < 60
                            ? 'ركز على وضع التدريب مع الملاحظات الفورية'
                            : 'استمر في التدريب المنتظم للحفاظ على مستواك'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/exam/mock"
                className="flex items-center justify-center px-6 py-3 bg-saudi-green text-white rounded-md hover:bg-green-700"
              >
                <BookOpen className="h-4 w-4 ml-2" />
                بدء امتحان تجريبي
              </Link>
              
              <Link
                href="/exam/practice"
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <Target className="h-4 w-4 ml-2" />
                وضع التدريب
              </Link>
              
              <Link
                href="/questions"
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <BookOpen className="h-4 w-4 ml-2" />
                تصفح الأسئلة
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
