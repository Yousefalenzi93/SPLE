'use client'

import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import {
  Users,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  FileText,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  LogOut,
  Database
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { currentUser, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <Shield className="h-8 w-8 text-saudi-green ml-3" />
                <h1 className="text-2xl font-bold text-gray-900">
                  لوحة الإدارة
                </h1>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Link
                  href="/dashboard"
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <ArrowRight className="h-4 w-4 ml-1" />
                  العودة إلى لوحة التحكم
                </Link>
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 ml-1" />
                  {currentUser?.displayName} (مسؤول)
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
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg shadow-lg p-6 text-white mb-8">
              <h2 className="text-3xl font-bold mb-2">
                مرحباً في لوحة الإدارة
              </h2>
              <p className="text-purple-100 mb-4">
                إدارة شاملة لنظام امتحانات الصيدلة
              </p>
              <p className="text-lg">
                تحكم في المستخدمين، الأسئلة، والتحليلات من مكان واحد
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">إجمالي المستخدمين</p>
                    <p className="text-2xl font-semibold text-gray-900">0</p>
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
                    <p className="text-2xl font-semibold text-gray-900">0</p>
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
                    <p className="text-2xl font-semibold text-gray-900">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">متوسط النجاح</p>
                    <p className="text-2xl font-semibold text-gray-900">-%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Management Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              
              {/* User Management */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">إدارة المستخدمين</h3>
                      <p className="text-sm text-gray-600">عرض وإدارة حسابات الطلاب والمسؤولين</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    إدارة شاملة للمستخدمين مع إمكانية البحث والتصفية
                  </p>
                  <Link
                    href="/admin/users"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
                  >
                    إدارة المستخدمين
                  </Link>
                </div>
              </div>

              {/* Question Management */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <BookOpen className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">إدارة الأسئلة</h3>
                      <p className="text-sm text-gray-600">إضافة وتعديل وموافقة الأسئلة</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    إدارة بنك الأسئلة مع التصنيف حسب المجالات
                  </p>
                  <Link
                    href="/admin/questions"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors inline-block text-center"
                  >
                    إدارة الأسئلة
                  </Link>
                </div>
              </div>

              {/* Analytics */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <BarChart3 className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">التحليلات والتقارير</h3>
                      <p className="text-sm text-gray-600">إحصائيات شاملة عن النظام</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    تقارير مفصلة عن أداء المستخدمين والأسئلة
                  </p>
                  <Link
                    href="/admin/analytics"
                    className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors inline-block text-center"
                  >
                    عرض التحليلات
                  </Link>
                </div>
              </div>

              {/* System Settings */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <Settings className="h-8 w-8 text-gray-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">إعدادات النظام</h3>
                      <p className="text-sm text-gray-600">تكوين إعدادات المنصة</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    إدارة إعدادات الامتحانات والنظام العام
                  </p>
                  <Link
                    href="/admin/settings"
                    className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors inline-block text-center"
                  >
                    الإعدادات
                  </Link>
                </div>
              </div>

              {/* Content Management */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">إدارة المحتوى</h3>
                      <p className="text-sm text-gray-600">الإعلانات والصفحات الثابتة</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    إدارة محتوى الموقع والإعلانات للمستخدمين
                  </p>
                  <Link
                    href="/admin/content"
                    className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 transition-colors inline-block text-center"
                  >
                    إدارة المحتوى
                  </Link>
                </div>
              </div>

              {/* Backup & Security */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <Shield className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">الأمان والنسخ الاحتياطية</h3>
                      <p className="text-sm text-gray-600">إدارة أمان النظام</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    مراقبة الأمان وإدارة النسخ الاحتياطية
                  </p>
                  <Link
                    href="/admin/security"
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors inline-block text-center"
                  >
                    الأمان والنسخ
                  </Link>
                </div>
              </div>

              {/* Firebase Test */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0">
                      <Database className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="mr-4">
                      <h3 className="text-lg font-semibold text-gray-900">اختبار Firebase</h3>
                      <p className="text-sm text-gray-600">فحص الاتصال بقاعدة البيانات</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-4">
                    اختبار شامل لجميع خدمات Firebase والتأكد من عملها
                  </p>
                  <Link
                    href="/admin/test-firebase"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors inline-block text-center"
                  >
                    اختبار Firebase
                  </Link>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">النشاط الأخير</h3>
              </div>
              <div className="p-6">
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">لا توجد أنشطة حديثة</p>
                  <p className="text-sm text-gray-400 mt-2">
                    ستظهر هنا آخر الأنشطة في النظام
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
