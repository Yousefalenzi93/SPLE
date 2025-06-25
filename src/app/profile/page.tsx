'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { SAUDI_UNIVERSITIES } from '@/types'
import { createUser } from '@/lib/firestore'
import { 
  User, 
  Mail, 
  Building, 
  GraduationCap, 
  Save, 
  AlertCircle, 
  CheckCircle,
  ArrowRight,
  Shield,
  Calendar
} from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { currentUser, updateUserProfile, sendVerificationEmail, firebaseUser } = useAuth()
  const [formData, setFormData] = useState({
    displayName: '',
    university: '',
    graduationYear: new Date().getFullYear()
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)

  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        university: currentUser.university || '',
        graduationYear: currentUser.graduationYear || new Date().getFullYear()
      })
    }
  }, [currentUser])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'graduationYear' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Update Firebase Auth profile
      await updateUserProfile(formData.displayName)

      // Update Firestore user document
      if (currentUser) {
        await createUser({
          ...currentUser,
          displayName: formData.displayName,
          university: formData.university,
          graduationYear: formData.graduationYear
        })
      }

      setSuccess('تم تحديث الملف الشخصي بنجاح')
    } catch (error: any) {
      setError(error.message || 'حدث خطأ أثناء تحديث الملف الشخصي')
    } finally {
      setLoading(false)
    }
  }

  const handleSendVerification = async () => {
    try {
      await sendVerificationEmail()
      setEmailVerificationSent(true)
    } catch (error: any) {
      setError(error.message || 'فشل في إرسال رسالة التحقق')
    }
  }

  if (!currentUser) {
    return null
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
                  الملف الشخصي
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Profile Overview */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-saudi-green rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {currentUser.displayName}
                    </h2>
                    <p className="text-gray-600 mb-4">{currentUser.email}</p>
                    
                    {/* Email Verification Status */}
                    <div className="mb-4">
                      {firebaseUser?.emailVerified ? (
                        <div className="flex items-center justify-center text-green-600">
                          <CheckCircle className="h-4 w-4 ml-1" />
                          <span className="text-sm">البريد الإلكتروني مُحقق</span>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="flex items-center justify-center text-orange-600 mb-2">
                            <AlertCircle className="h-4 w-4 ml-1" />
                            <span className="text-sm">البريد الإلكتروني غير مُحقق</span>
                          </div>
                          {!emailVerificationSent ? (
                            <button
                              onClick={handleSendVerification}
                              className="text-sm text-saudi-green hover:text-green-700 underline"
                            >
                              إرسال رسالة التحقق
                            </button>
                          ) : (
                            <p className="text-sm text-green-600">تم إرسال رسالة التحقق</p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Role Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      <Shield className="h-4 w-4 ml-1" />
                      {currentUser.role === 'admin' ? 'مسؤول' : 'طالب'}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-semibold text-gray-900">0</p>
                        <p className="text-sm text-gray-600">امتحانات مكتملة</p>
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-gray-900">-</p>
                        <p className="text-sm text-gray-600">متوسط النتائج</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      تحديث المعلومات الشخصية
                    </h3>
                  </div>

                  <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Success Message */}
                    {success && (
                      <div className="bg-green-50 border border-green-200 rounded-md p-4">
                        <div className="flex">
                          <CheckCircle className="h-5 w-5 text-green-400" />
                          <div className="mr-3">
                            <p className="text-sm text-green-800">{success}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-md p-4">
                        <div className="flex">
                          <AlertCircle className="h-5 w-5 text-red-400" />
                          <div className="mr-3">
                            <p className="text-sm text-red-800">{error}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Display Name */}
                      <div>
                        <label htmlFor="displayName" className="form-label">
                          الاسم الكامل
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="displayName"
                            name="displayName"
                            type="text"
                            required
                            className="form-input pr-10"
                            placeholder="أدخل اسمك الكامل"
                            value={formData.displayName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      {/* Email (Read-only) */}
                      <div>
                        <label htmlFor="email" className="form-label">
                          البريد الإلكتروني
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="email"
                            type="email"
                            disabled
                            className="form-input pr-10 bg-gray-50 text-gray-500"
                            value={currentUser.email}
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          لا يمكن تغيير البريد الإلكتروني
                        </p>
                      </div>

                      {/* University */}
                      <div>
                        <label htmlFor="university" className="form-label">
                          الجامعة
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <Building className="h-5 w-5 text-gray-400" />
                          </div>
                          <select
                            id="university"
                            name="university"
                            required
                            className="form-input pr-10 appearance-none"
                            value={formData.university}
                            onChange={handleChange}
                          >
                            <option value="">اختر الجامعة</option>
                            {SAUDI_UNIVERSITIES.map((university) => (
                              <option key={university} value={university}>
                                {university}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Graduation Year */}
                      <div>
                        <label htmlFor="graduationYear" className="form-label">
                          سنة التخرج
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <GraduationCap className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            id="graduationYear"
                            name="graduationYear"
                            type="number"
                            min="2000"
                            max="2030"
                            required
                            className="form-input pr-10"
                            placeholder="سنة التخرج"
                            value={formData.graduationYear}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div className="pt-6 border-t border-gray-200">
                      <h4 className="text-md font-medium text-gray-900 mb-4">معلومات الحساب</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 ml-2" />
                          <span>تاريخ الانضمام: {currentUser.createdAt?.toLocaleDateString('ar-SA')}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="h-4 w-4 ml-2" />
                          <span>آخر تسجيل دخول: {currentUser.lastLogin?.toLocaleDateString('ar-SA')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-saudi-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saudi-green disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                            جاري الحفظ...
                          </div>
                        ) : (
                          <>
                            <Save className="h-4 w-4 ml-2" />
                            حفظ التغييرات
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
