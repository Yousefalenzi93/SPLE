'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { collection, getDocs, query, orderBy, where, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { DOMAIN_INFO } from '@/types'
import type { User, ExamSession, QuestionDomain } from '@/types'
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  TrendingUp,
  ArrowRight,
  Calendar,
  Award,
  Clock,
  Target,
  Download,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface SystemStats {
  totalUsers: number
  totalStudents: number
  totalAdmins: number
  totalQuestions: number
  totalExams: number
  averageScore: number
  activeUsers: number
}

export default function AdminAnalyticsPage() {
  const { currentUser } = useAuth()
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalStudents: 0,
    totalAdmins: 0,
    totalQuestions: 0,
    totalExams: 0,
    averageScore: 0,
    activeUsers: 0
  })
  const [recentExams, setRecentExams] = useState<ExamSession[]>([])
  const [topPerformers, setTopPerformers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month')

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Fetch users
      const usersRef = collection(db, 'users')
      const usersSnapshot = await getDocs(usersRef)
      const users = usersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() })) as User[]
      
      // Fetch questions
      const questionsRef = collection(db, 'questions')
      const questionsSnapshot = await getDocs(questionsRef)
      
      // Fetch exam sessions
      const examsRef = collection(db, 'examSessions')
      const examsQuery = query(examsRef, orderBy('startTime', 'desc'), limit(100))
      const examsSnapshot = await getDocs(examsQuery)
      const examSessions = examsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime?.toDate() || new Date(),
        endTime: doc.data().endTime?.toDate() || undefined
      })) as ExamSession[]

      // Calculate period filter
      const now = new Date()
      const periodStart = new Date()
      if (selectedPeriod === 'week') {
        periodStart.setDate(now.getDate() - 7)
      } else if (selectedPeriod === 'month') {
        periodStart.setMonth(now.getMonth() - 1)
      } else {
        periodStart.setMonth(now.getMonth() - 3)
      }

      const periodExams = examSessions.filter(exam => exam.startTime >= periodStart)
      const completedExams = periodExams.filter(exam => exam.completed)
      
      // Calculate stats
      const totalStudents = users.filter(u => u.role === 'student').length
      const totalAdmins = users.filter(u => u.role === 'admin').length
      const averageScore = completedExams.length > 0 
        ? Math.round(completedExams.reduce((sum, exam) => sum + (exam.score || 0), 0) / completedExams.length)
        : 0

      // Active users (users who took exams in the period)
      const activeUserIds = new Set(periodExams.map(exam => exam.userId))
      
      setStats({
        totalUsers: users.length,
        totalStudents,
        totalAdmins,
        totalQuestions: questionsSnapshot.size,
        totalExams: completedExams.length,
        averageScore,
        activeUsers: activeUserIds.size
      })

      // Recent exams
      setRecentExams(examSessions.slice(0, 10))

      // Top performers (mock data for now)
      const mockTopPerformers = users
        .filter(u => u.role === 'student')
        .slice(0, 5)
        .map(user => ({
          ...user,
          averageScore: Math.floor(Math.random() * 40) + 60,
          totalExams: Math.floor(Math.random() * 10) + 1,
          lastExam: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
        }))
        .sort((a, b) => b.averageScore - a.averageScore)
      
      setTopPerformers(mockTopPerformers)

    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatExamType = (type: string) => {
    const types = {
      mock: 'تجريبي',
      practice: 'تدريب',
      custom: 'مخصص'
    }
    return types[type as keyof typeof types] || type
  }

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
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
                  تحليلات النظام
                </h1>
              </div>
              
              <div className="flex items-center space-x-3 space-x-reverse">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value as any)}
                  className="text-sm border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="week">آخر أسبوع</option>
                  <option value="month">آخر شهر</option>
                  <option value="quarter">آخر 3 أشهر</option>
                </select>
                
                <button
                  onClick={fetchAnalyticsData}
                  className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  <RefreshCw className="h-4 w-4 ml-1" />
                  تحديث
                </button>
                
                <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <Download className="h-4 w-4 ml-1" />
                  تصدير
                </button>
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
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</p>
                    <p className="text-xs text-gray-500">
                      {stats.totalStudents} طالب، {stats.totalAdmins} مسؤول
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BookOpen className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">بنك الأسئلة</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalQuestions}</p>
                    <p className="text-xs text-gray-500">سؤال معتمد</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <BarChart3 className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">الامتحانات المكتملة</p>
                    <p className="text-2xl font-semibold text-gray-900">{stats.totalExams}</p>
                    <p className="text-xs text-gray-500">في الفترة المحددة</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Target className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">متوسط النتائج</p>
                    <p className={`text-2xl font-semibold ${getScoreColor(stats.averageScore)}`}>
                      {stats.averageScore}%
                    </p>
                    <p className="text-xs text-gray-500">عام</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">المستخدمين النشطين</h3>
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stats.activeUsers}</div>
                <div className="text-sm text-gray-600">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% من إجمالي المستخدمين
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">معدل النجاح</h3>
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stats.totalExams > 0 
                    ? Math.round((recentExams.filter(e => (e.score || 0) >= 60).length / stats.totalExams) * 100)
                    : 0}%
                </div>
                <div className="text-sm text-gray-600">من الامتحانات المكتملة</div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">متوسط وقت الامتحان</h3>
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {recentExams.length > 0 
                    ? Math.round(recentExams.reduce((sum, e) => sum + (e.timeSpent || 0), 0) / recentExams.length / 60)
                    : 0}
                </div>
                <div className="text-sm text-gray-600">دقيقة</div>
              </div>
            </div>

            {/* Domain Performance */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">الأداء حسب المجال</h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(DOMAIN_INFO).map(([key, info]) => {
                    // Mock data for domain performance
                    const averageScore = Math.floor(Math.random() * 30) + 60
                    const totalAttempts = Math.floor(Math.random() * 100) + 50
                    
                    return (
                      <div key={key} className="border rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          <span 
                            className="inline-block w-4 h-4 rounded-full ml-2"
                            style={{ backgroundColor: info.color }}
                          />
                          <h4 className="font-medium text-gray-900 text-sm">{info.name}</h4>
                        </div>
                        
                        <div className="mb-3">
                          <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
                            {averageScore}%
                          </div>
                          <div className="text-sm text-gray-600">{totalAttempts} محاولة</div>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${averageScore}%`,
                              backgroundColor: info.color
                            }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Recent Activity & Top Performers */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Recent Exams */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">الامتحانات الأخيرة</h3>
                </div>
                
                <div className="p-6">
                  {recentExams.length > 0 ? (
                    <div className="space-y-4">
                      {recentExams.slice(0, 8).map((exam) => (
                        <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatExamType(exam.examType)} - القسم {exam.section}
                            </div>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Calendar className="h-3 w-3 ml-1" />
                              {exam.startTime.toLocaleDateString('ar-SA')}
                            </div>
                          </div>
                          
                          <div className="text-left">
                            <div className={`text-sm font-bold ${getScoreColor(exam.score || 0)}`}>
                              {exam.score || 0}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {exam.timeSpent ? Math.round(exam.timeSpent / 60) : 0} دقيقة
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">لا توجد امتحانات حديثة</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Performers */}
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">أفضل الطلاب</h3>
                </div>
                
                <div className="p-6">
                  {topPerformers.length > 0 ? (
                    <div className="space-y-4">
                      {topPerformers.map((student, index) => (
                        <div key={student.uid} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ml-3 ${
                              index === 0 ? 'bg-yellow-500' : 
                              index === 1 ? 'bg-gray-400' : 
                              index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.displayName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {student.university}
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-left">
                            <div className={`text-sm font-bold ${getScoreColor(student.averageScore)}`}>
                              {student.averageScore}%
                            </div>
                            <div className="text-xs text-gray-500">
                              {student.totalExams} امتحان
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">لا توجد بيانات كافية</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/admin/users"
                className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Users className="h-4 w-4 ml-2" />
                إدارة المستخدمين
              </Link>
              
              <Link
                href="/admin/questions"
                className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <BookOpen className="h-4 w-4 ml-2" />
                إدارة الأسئلة
              </Link>
              
              <Link
                href="/admin/seed"
                className="flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                <BarChart3 className="h-4 w-4 ml-2" />
                إدارة البيانات
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
