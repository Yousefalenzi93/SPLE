'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { 
  Shield, 
  Download, 
  Upload,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Activity,
  Database,
  Lock,
  Eye,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface SecurityLog {
  id: string
  type: 'login' | 'logout' | 'failed_login' | 'admin_action' | 'data_export'
  userId: string
  userEmail: string
  action: string
  ipAddress: string
  timestamp: Date
  details?: string
}

interface BackupInfo {
  id: string
  type: 'manual' | 'automatic'
  size: string
  createdAt: Date
  status: 'completed' | 'in_progress' | 'failed'
}

export default function AdminSecurityPage() {
  const { currentUser } = useAuth()
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    {
      id: '1',
      type: 'login',
      userId: 'user1',
      userEmail: 'student@example.com',
      action: 'تسجيل دخول ناجح',
      ipAddress: '192.168.1.100',
      timestamp: new Date(),
      details: 'تسجيل دخول من متصفح Chrome'
    },
    {
      id: '2',
      type: 'failed_login',
      userId: 'unknown',
      userEmail: 'hacker@example.com',
      action: 'محاولة تسجيل دخول فاشلة',
      ipAddress: '10.0.0.1',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      details: 'كلمة مرور خاطئة - 3 محاولات'
    },
    {
      id: '3',
      type: 'admin_action',
      userId: currentUser?.uid || 'admin1',
      userEmail: currentUser?.email || 'admin@example.com',
      action: 'تعديل إعدادات النظام',
      ipAddress: '192.168.1.50',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      details: 'تغيير مدة الامتحان'
    }
  ])

  const [backups, setBackups] = useState<BackupInfo[]>([
    {
      id: '1',
      type: 'automatic',
      size: '2.5 MB',
      createdAt: new Date(),
      status: 'completed'
    },
    {
      id: '2',
      type: 'manual',
      size: '2.3 MB',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'completed'
    },
    {
      id: '3',
      type: 'automatic',
      size: '2.1 MB',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'completed'
    }
  ])

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleCreateBackup = async () => {
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
      // Simulate backup creation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const newBackup: BackupInfo = {
        id: Date.now().toString(),
        type: 'manual',
        size: '2.6 MB',
        createdAt: new Date(),
        status: 'completed'
      }
      
      setBackups(prev => [newBackup, ...prev])
      setSuccess('تم إنشاء النسخة الاحتياطية بنجاح')
    } catch (error) {
      setError('فشل في إنشاء النسخة الاحتياطية')
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadBackup = (backupId: string) => {
    // Simulate backup download
    setSuccess(`تم بدء تحميل النسخة الاحتياطية ${backupId}`)
  }

  const getLogTypeColor = (type: string) => {
    const colors = {
      login: 'text-green-600 bg-green-50',
      logout: 'text-blue-600 bg-blue-50',
      failed_login: 'text-red-600 bg-red-50',
      admin_action: 'text-purple-600 bg-purple-50',
      data_export: 'text-orange-600 bg-orange-50'
    }
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  const getLogTypeIcon = (type: string) => {
    const icons = {
      login: CheckCircle,
      logout: Users,
      failed_login: AlertTriangle,
      admin_action: Shield,
      data_export: Download
    }
    const IconComponent = icons[type as keyof typeof icons] || Activity
    return <IconComponent className="h-4 w-4" />
  }

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'text-green-600 bg-green-50',
      in_progress: 'text-yellow-600 bg-yellow-50',
      failed: 'text-red-600 bg-red-50'
    }
    return colors[status as keyof typeof colors] || 'text-gray-600 bg-gray-50'
  }

  const getStatusText = (status: string) => {
    const texts = {
      completed: 'مكتمل',
      in_progress: 'جاري التنفيذ',
      failed: 'فشل'
    }
    return texts[status as keyof typeof texts] || status
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
                  الأمان والنسخ الاحتياطية
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            
            {/* Success/Error Messages */}
            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="mr-3">
                    <p className="text-sm text-green-800">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="mr-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Security Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">حالة الأمان</p>
                    <p className="text-lg font-semibold text-green-600">آمن</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">محاولات فاشلة اليوم</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {securityLogs.filter(log => 
                        log.type === 'failed_login' && 
                        log.timestamp.toDateString() === new Date().toDateString()
                      ).length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Database className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">النسخ الاحتياطية</p>
                    <p className="text-2xl font-semibold text-gray-900">{backups.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">آخر نسخة احتياطية</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {backups[0]?.createdAt.toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Backup Management */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Database className="h-5 w-5 ml-2" />
                  إدارة النسخ الاحتياطية
                </h3>
                <button
                  onClick={handleCreateBackup}
                  disabled={loading}
                  className="flex items-center px-4 py-2 bg-saudi-green text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                      جاري الإنشاء...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 ml-2" />
                      إنشاء نسخة احتياطية
                    </>
                  )}
                </button>
              </div>
              
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          النوع
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الحجم
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          تاريخ الإنشاء
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الحالة
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">إجراءات</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {backups.map((backup) => (
                        <tr key={backup.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              backup.type === 'manual' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {backup.type === 'manual' ? 'يدوي' : 'تلقائي'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {backup.size}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {backup.createdAt.toLocaleDateString('ar-SA')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(backup.status)}`}>
                              {getStatusText(backup.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                            <button
                              onClick={() => handleDownloadBackup(backup.id)}
                              className="text-saudi-green hover:text-green-700"
                              title="تحميل"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Security Logs */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 ml-2" />
                  سجل الأمان
                </h3>
                <button className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900">
                  <RefreshCw className="h-4 w-4 ml-1" />
                  تحديث
                </button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {securityLogs.map((log) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className={`p-2 rounded-full ${getLogTypeColor(log.type)} mr-3`}>
                            {getLogTypeIcon(log.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{log.action}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              المستخدم: {log.userEmail} | IP: {log.ipAddress}
                            </p>
                            {log.details && (
                              <p className="text-sm text-gray-500 mt-1">{log.details}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          {log.timestamp.toLocaleString('ar-SA')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
