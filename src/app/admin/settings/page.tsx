'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { EXAM_CONFIG } from '@/types'
import { 
  Settings, 
  Save, 
  ArrowRight,
  Clock,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react'
import Link from 'next/link'

interface SystemSettings {
  examSettings: {
    sectionTimeMinutes: number
    sectionQuestions: number
    passingScore: number
    allowPause: boolean
    showTimer: boolean
    autoSubmit: boolean
  }
  systemSettings: {
    maintenanceMode: boolean
    registrationEnabled: boolean
    maxUsersPerDay: number
    sessionTimeout: number
  }
  emailSettings: {
    smtpEnabled: boolean
    fromEmail: string
    supportEmail: string
  }
}

export default function AdminSettingsPage() {
  const { currentUser } = useAuth()
  const [settings, setSettings] = useState<SystemSettings>({
    examSettings: {
      sectionTimeMinutes: EXAM_CONFIG.SECTION_TIME_MINUTES,
      sectionQuestions: EXAM_CONFIG.SECTION_1_QUESTIONS,
      passingScore: EXAM_CONFIG.PASSING_SCORE,
      allowPause: true,
      showTimer: true,
      autoSubmit: true
    },
    systemSettings: {
      maintenanceMode: false,
      registrationEnabled: true,
      maxUsersPerDay: 100,
      sessionTimeout: 30
    },
    emailSettings: {
      smtpEnabled: false,
      fromEmail: 'noreply@sple-exam.com',
      supportEmail: 'support@sple-exam.com'
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')
    
    try {
      // Here you would save to Firestore or your backend
      // For now, we'll simulate a save operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess('تم حفظ الإعدادات بنجاح')
    } catch (error) {
      setError('فشل في حفظ الإعدادات')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      examSettings: {
        sectionTimeMinutes: EXAM_CONFIG.SECTION_TIME_MINUTES,
        sectionQuestions: EXAM_CONFIG.SECTION_1_QUESTIONS,
        passingScore: EXAM_CONFIG.PASSING_SCORE,
        allowPause: true,
        showTimer: true,
        autoSubmit: true
      },
      systemSettings: {
        maintenanceMode: false,
        registrationEnabled: true,
        maxUsersPerDay: 100,
        sessionTimeout: 30
      },
      emailSettings: {
        smtpEnabled: false,
        fromEmail: 'noreply@sple-exam.com',
        supportEmail: 'support@sple-exam.com'
      }
    })
    setSuccess('تم إعادة تعيين الإعدادات للقيم الافتراضية')
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
                  إعدادات النظام
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
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
                  <AlertCircle className="h-5 w-5 text-red-400" />
                  <div className="mr-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Exam Settings */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <BookOpen className="h-5 w-5 ml-2" />
                  إعدادات الامتحان
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      مدة القسم (بالدقائق)
                    </label>
                    <input
                      type="number"
                      min="60"
                      max="300"
                      className="form-input"
                      value={settings.examSettings.sectionTimeMinutes}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        examSettings: {
                          ...prev.examSettings,
                          sectionTimeMinutes: parseInt(e.target.value)
                        }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عدد الأسئلة لكل قسم
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="200"
                      className="form-input"
                      value={settings.examSettings.sectionQuestions}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        examSettings: {
                          ...prev.examSettings,
                          sectionQuestions: parseInt(e.target.value)
                        }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      درجة النجاح (%)
                    </label>
                    <input
                      type="number"
                      min="50"
                      max="80"
                      className="form-input"
                      value={settings.examSettings.passingScore}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        examSettings: {
                          ...prev.examSettings,
                          passingScore: parseInt(e.target.value)
                        }
                      }))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="allowPause"
                        checked={settings.examSettings.allowPause}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          examSettings: {
                            ...prev.examSettings,
                            allowPause: e.target.checked
                          }
                        }))}
                        className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded"
                      />
                      <label htmlFor="allowPause" className="mr-2 text-sm text-gray-700">
                        السماح بإيقاف الامتحان مؤقتاً
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="showTimer"
                        checked={settings.examSettings.showTimer}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          examSettings: {
                            ...prev.examSettings,
                            showTimer: e.target.checked
                          }
                        }))}
                        className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded"
                      />
                      <label htmlFor="showTimer" className="mr-2 text-sm text-gray-700">
                        عرض المؤقت للطلاب
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="autoSubmit"
                        checked={settings.examSettings.autoSubmit}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          examSettings: {
                            ...prev.examSettings,
                            autoSubmit: e.target.checked
                          }
                        }))}
                        className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded"
                      />
                      <label htmlFor="autoSubmit" className="mr-2 text-sm text-gray-700">
                        إرسال تلقائي عند انتهاء الوقت
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <Settings className="h-5 w-5 ml-2" />
                  إعدادات النظام
                </h3>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الحد الأقصى للمستخدمين الجدد يومياً
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="1000"
                      className="form-input"
                      value={settings.systemSettings.maxUsersPerDay}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        systemSettings: {
                          ...prev.systemSettings,
                          maxUsersPerDay: parseInt(e.target.value)
                        }
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      انتهاء الجلسة (بالدقائق)
                    </label>
                    <input
                      type="number"
                      min="15"
                      max="120"
                      className="form-input"
                      value={settings.systemSettings.sessionTimeout}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        systemSettings: {
                          ...prev.systemSettings,
                          sessionTimeout: parseInt(e.target.value)
                        }
                      }))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="maintenanceMode"
                        checked={settings.systemSettings.maintenanceMode}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          systemSettings: {
                            ...prev.systemSettings,
                            maintenanceMode: e.target.checked
                          }
                        }))}
                        className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded"
                      />
                      <label htmlFor="maintenanceMode" className="mr-2 text-sm text-gray-700">
                        وضع الصيانة
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="registrationEnabled"
                        checked={settings.systemSettings.registrationEnabled}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          systemSettings: {
                            ...prev.systemSettings,
                            registrationEnabled: e.target.checked
                          }
                        }))}
                        className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded"
                      />
                      <label htmlFor="registrationEnabled" className="mr-2 text-sm text-gray-700">
                        تفعيل التسجيل الجديد
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleReset}
                className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                <RefreshCw className="h-4 w-4 ml-2" />
                إعادة تعيين
              </button>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center px-6 py-2 bg-saudi-green text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 ml-2" />
                    حفظ الإعدادات
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
