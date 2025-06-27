'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  ArrowRight,
  AlertCircle,
  CheckCircle,
  Megaphone,
  Info
} from 'lucide-react'
import Link from 'next/link'

interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'error'
  active: boolean
  createdAt: Date
  expiresAt?: Date
}

interface StaticPage {
  id: string
  title: string
  slug: string
  content: string
  published: boolean
  lastModified: Date
}

export default function AdminContentPage() {
  const { currentUser } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      id: '1',
      title: 'تحديث النظام',
      content: 'سيتم إجراء تحديث على النظام يوم الجمعة من الساعة 2:00 إلى 4:00 صباحاً',
      type: 'info',
      active: true,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'إضافة أسئلة جديدة',
      content: 'تم إضافة 50 سؤال جديد في مجال العلوم السريرية',
      type: 'success',
      active: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  ])
  
  const [staticPages, setStaticPages] = useState<StaticPage[]>([
    {
      id: '1',
      title: 'شروط الاستخدام',
      slug: 'terms',
      content: 'محتوى شروط الاستخدام...',
      published: true,
      lastModified: new Date()
    },
    {
      id: '2',
      title: 'سياسة الخصوصية',
      slug: 'privacy',
      content: 'محتوى سياسة الخصوصية...',
      published: true,
      lastModified: new Date()
    },
    {
      id: '3',
      title: 'الأسئلة الشائعة',
      slug: 'faq',
      content: 'الأسئلة الشائعة وإجاباتها...',
      published: false,
      lastModified: new Date()
    }
  ])

  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
  const [showPageForm, setShowPageForm] = useState(false)
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null)
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null)

  const getAnnouncementTypeColor = (type: string) => {
    const colors = {
      info: 'bg-blue-50 border-blue-200 text-blue-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      error: 'bg-red-50 border-red-200 text-red-800'
    }
    return colors[type as keyof typeof colors] || colors.info
  }

  const getAnnouncementTypeIcon = (type: string) => {
    const icons = {
      info: Info,
      warning: AlertCircle,
      success: CheckCircle,
      error: AlertCircle
    }
    const IconComponent = icons[type as keyof typeof icons] || Info
    return <IconComponent className="h-4 w-4" />
  }

  const handleDeleteAnnouncement = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      setAnnouncements(prev => prev.filter(a => a.id !== id))
    }
  }

  const handleDeletePage = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الصفحة؟')) {
      setStaticPages(prev => prev.filter(p => p.id !== id))
    }
  }

  const toggleAnnouncementStatus = (id: string) => {
    setAnnouncements(prev => prev.map(a => 
      a.id === id ? { ...a, active: !a.active } : a
    ))
  }

  const togglePageStatus = (id: string) => {
    setStaticPages(prev => prev.map(p => 
      p.id === id ? { ...p, published: !p.published } : p
    ))
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
                  إدارة المحتوى
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Announcements Section */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Megaphone className="h-5 w-5 ml-2" />
                  الإعلانات
                </h3>
                <button
                  onClick={() => setShowAnnouncementForm(true)}
                  className="flex items-center px-4 py-2 bg-saudi-green text-white rounded-md hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة إعلان
                </button>
              </div>
              
              <div className="p-6">
                {announcements.length > 0 ? (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className={`border rounded-lg p-4 ${getAnnouncementTypeColor(announcement.type)}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              {getAnnouncementTypeIcon(announcement.type)}
                              <h4 className="font-medium mr-2">{announcement.title}</h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                announcement.active 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {announcement.active ? 'نشط' : 'غير نشط'}
                              </span>
                            </div>
                            <p className="text-sm mb-2">{announcement.content}</p>
                            <div className="text-xs opacity-75">
                              تاريخ الإنشاء: {announcement.createdAt.toLocaleDateString('ar-SA')}
                              {announcement.expiresAt && (
                                <span className="mr-4">
                                  ينتهي في: {announcement.expiresAt.toLocaleDateString('ar-SA')}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2 space-x-reverse mr-4">
                            <button
                              onClick={() => toggleAnnouncementStatus(announcement.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                              title={announcement.active ? 'إلغاء التفعيل' : 'تفعيل'}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => setEditingAnnouncement(announcement)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-md"
                              title="تعديل"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            
                            <button
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                              title="حذف"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Megaphone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد إعلانات</p>
                  </div>
                )}
              </div>
            </div>

            {/* Static Pages Section */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileText className="h-5 w-5 ml-2" />
                  الصفحات الثابتة
                </h3>
                <button
                  onClick={() => setShowPageForm(true)}
                  className="flex items-center px-4 py-2 bg-saudi-green text-white rounded-md hover:bg-green-700"
                >
                  <Plus className="h-4 w-4 ml-2" />
                  إضافة صفحة
                </button>
              </div>
              
              <div className="p-6">
                {staticPages.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            العنوان
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            الرابط
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            الحالة
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            آخر تعديل
                          </th>
                          <th className="relative px-6 py-3">
                            <span className="sr-only">إجراءات</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {staticPages.map((page) => (
                          <tr key={page.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {page.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-600">
                                /{page.slug}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                page.published 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {page.published ? 'منشور' : 'مسودة'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {page.lastModified.toLocaleDateString('ar-SA')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                              <div className="flex items-center space-x-2 space-x-reverse">
                                <button
                                  onClick={() => togglePageStatus(page.id)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title={page.published ? 'إلغاء النشر' : 'نشر'}
                                >
                                  <Eye className="h-4 w-4" />
                                </button>
                                
                                <button
                                  onClick={() => setEditingPage(page)}
                                  className="text-green-600 hover:text-green-900"
                                  title="تعديل"
                                >
                                  <Edit className="h-4 w-4" />
                                </button>
                                
                                <button
                                  onClick={() => handleDeletePage(page.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="حذف"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">لا توجد صفحات</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">الإعلانات النشطة</h4>
                <p className="text-2xl font-bold text-blue-600">
                  {announcements.filter(a => a.active).length}
                </p>
                <p className="text-sm text-blue-700">من أصل {announcements.length}</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-900 mb-2">الصفحات المنشورة</h4>
                <p className="text-2xl font-bold text-green-600">
                  {staticPages.filter(p => p.published).length}
                </p>
                <p className="text-sm text-green-700">من أصل {staticPages.length}</p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h4 className="font-medium text-orange-900 mb-2">المسودات</h4>
                <p className="text-2xl font-bold text-orange-600">
                  {staticPages.filter(p => !p.published).length}
                </p>
                <p className="text-sm text-orange-700">تحتاج مراجعة</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
