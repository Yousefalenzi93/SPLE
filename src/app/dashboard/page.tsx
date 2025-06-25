'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import StatsCard, { ScoreCard, ProgressCard } from '@/components/dashboard/StatsCard'
import ProgressChart, { DomainChart } from '@/components/charts/ProgressChart'
import { getUserExamSessions, getUserProgress } from '@/lib/firestore'
import { DOMAIN_INFO } from '@/types'
import type { ExamSession, UserProgress } from '@/types'
import { BookOpen, BarChart3, Clock, Trophy, LogOut, User, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const { currentUser, logout } = useAuth()
  const [examSessions, setExamSessions] = useState<ExamSession[]>([])
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (currentUser) {
      fetchUserData()
    }
  }, [currentUser])

  const fetchUserData = async () => {
    if (!currentUser) return

    try {
      setLoading(true)
      const [sessions, progress] = await Promise.all([
        getUserExamSessions(currentUser.uid, undefined, 20),
        getUserProgress(currentUser.uid)
      ])

      setExamSessions(sessions)
      setUserProgress(progress)
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Calculate statistics
  const completedExams = examSessions.filter(s => s.completed)
  const totalExams = completedExams.length
  const averageScore = totalExams > 0
    ? Math.round(completedExams.reduce((sum, s) => sum + (s.score || 0), 0) / totalExams)
    : 0
  const totalStudyTime = completedExams.reduce((sum, s) => sum + (s.timeSpent || 0), 0)
  const bestScore = totalExams > 0 ? Math.max(...completedExams.map(s => s.score || 0)) : 0

  // Mock domain scores for chart
  const domainScores = Object.keys(DOMAIN_INFO).reduce((acc, domain) => {
    acc[domain as keyof typeof DOMAIN_INFO] = Math.floor(Math.random() * 40) + 60
    return acc
  }, {} as Record<keyof typeof DOMAIN_INFO, number>)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">
                  لوحة التحكم
                </h1>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="flex items-center text-sm text-gray-600">
                  <User className="h-4 w-4 ml-1" />
                  {currentUser?.displayName}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 ml-1" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-saudi-green to-green-600 rounded-lg shadow-lg p-6 text-white mb-8">
              <h2 className="text-3xl font-bold mb-2">
                مرحباً، {currentUser?.displayName}!
              </h2>
              <p className="text-green-100 mb-4">
                جامعة: {currentUser?.university} | سنة التخرج: {currentUser?.graduationYear}
              </p>
              <p className="text-lg">
                استعد لامتحان ترخيص الصيدلة مع منصتنا الشاملة
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="الامتحانات المكتملة"
                value={totalExams}
                icon={BookOpen}
                color="blue"
                trend={totalExams > 0 ? { value: 12, label: 'هذا الشهر' } : undefined}
              />

              <ScoreCard
                title="متوسط النتائج"
                score={averageScore}
                subtitle={totalExams > 0 ? `من ${totalExams} امتحان` : 'لا توجد امتحانات'}
              />

              <StatsCard
                title="ساعات الدراسة"
                value={Math.round(totalStudyTime / 3600)}
                subtitle="ساعة"
                icon={Clock}
                color="orange"
              />

              <StatsCard
                title="أفضل نتيجة"
                value={`${bestScore}%`}
                icon={Trophy}
                color="purple"
              />
            </div>

            {/* Charts Section */}
            {!loading && totalExams > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <ProgressChart examSessions={examSessions} />
                <DomainChart domainScores={domainScores} />
              </div>
            )}

            {/* Recent Activity */}
            {!loading && totalExams > 0 && (
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Clock className="h-5 w-5 ml-2" />
                    النشاط الأخير
                  </h3>
                </div>

                <div className="p-6">
                  <div className="space-y-4">
                    {completedExams.slice(0, 5).map((exam) => (
                      <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {exam.examType === 'mock' ? 'امتحان تجريبي' :
                             exam.examType === 'practice' ? 'تدريب' : 'مخصص'} - القسم {exam.section}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {exam.startTime.toLocaleDateString('ar-SA')}
                          </div>
                        </div>

                        <div className="text-left">
                          <div className={`text-lg font-bold ${
                            (exam.score || 0) >= 80 ? 'text-green-600' :
                            (exam.score || 0) >= 60 ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {exam.score || 0}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {exam.timeSpent ? Math.round(exam.timeSpent / 60) : 0} دقيقة
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 text-center">
                    <Link
                      href="/analytics"
                      className="text-sm text-saudi-green hover:text-green-700 font-medium"
                    >
                      عرض جميع التحليلات ←
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Mock Exam */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-saudi-green" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">امتحان تجريبي</h3>
                      <p className="text-sm text-gray-600">محاكاة كاملة للامتحان الفعلي</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    قسمين بـ 110 سؤال لكل قسم مع مؤقت زمني واقعي
                  </p>
                  <Link
                    href="/exam/mock"
                    className="w-full bg-saudi-green text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors inline-block text-center"
                  >
                    بدء امتحان تجريبي
                  </Link>
                </div>
              </div>

              {/* Practice Mode */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">وضع التدريب</h3>
                      <p className="text-sm text-gray-600">تدرب مع ملاحظات فورية</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    أسئلة مع شروحات مفصلة وإمكانية المراجعة
                  </p>
                  <Link
                    href="/exam/practice"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
                  >
                    بدء التدريب
                  </Link>
                </div>
              </div>

              {/* Custom Quiz */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <Clock className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">اختبار مخصص</h3>
                      <p className="text-sm text-gray-600">اختر المجال والصعوبة</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    إنشاء اختبار حسب احتياجاتك الدراسية
                  </p>
                  <Link
                    href="/exam/custom"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors inline-block text-center"
                  >
                    إنشاء اختبار
                  </Link>
                </div>
              </div>

              {/* Progress Analytics */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">تحليل الأداء</h3>
                      <p className="text-sm text-gray-600">تقارير مفصلة عن تقدمك</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    اعرف نقاط قوتك وضعفك في كل مجال
                  </p>
                  <Link
                    href="/analytics"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors inline-block text-center"
                  >
                    عرض التحليلات
                  </Link>
                </div>
              </div>

              {/* Question Bank */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">بنك الأسئلة</h3>
                      <p className="text-sm text-gray-600">تصفح الأسئلة حسب المجال</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    أكثر من 2000 سؤال مصنف ومراجع
                  </p>
                  <Link
                    href="/questions"
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors inline-block text-center"
                  >
                    تصفح الأسئلة
                  </Link>
                </div>
              </div>

              {/* Profile Settings */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">الملف الشخصي</h3>
                      <p className="text-sm text-gray-600">إدارة بياناتك الشخصية</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    تحديث معلوماتك وإعدادات الحساب
                  </p>
                  <Link
                    href="/profile"
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors inline-block text-center"
                  >
                    إدارة الملف الشخصي
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
