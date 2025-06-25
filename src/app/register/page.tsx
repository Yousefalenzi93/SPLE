'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { SAUDI_UNIVERSITIES } from '@/types'
import { Eye, EyeOff, Mail, Lock, User, GraduationCap, Building, AlertCircle, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    university: '',
    graduationYear: new Date().getFullYear()
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { register } = useAuth()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'graduationYear' ? parseInt(value) : value
    }))
  }

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('كلمات المرور غير متطابقة')
      return false
    }
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return false
    }
    if (!formData.university) {
      setError('يرجى اختيار الجامعة')
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!validateForm()) {
      setLoading(false)
      return
    }

    try {
      await register(formData.email, formData.password, {
        displayName: formData.displayName,
        university: formData.university,
        graduationYear: formData.graduationYear
      })
      
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saudi-green to-green-700 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              تم إنشاء الحساب بنجاح!
            </h2>
            <p className="text-gray-600 mb-6">
              تم إرسال رسالة تحقق إلى بريدك الإلكتروني. يرجى التحقق من بريدك الإلكتروني قبل تسجيل الدخول.
            </p>
            <p className="text-sm text-gray-500">
              سيتم توجيهك إلى صفحة تسجيل الدخول خلال 3 ثوانٍ...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-saudi-green to-green-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              إنشاء حساب جديد
            </h2>
            <p className="text-gray-600">
              انضم إلى منصة امتحانات الصيدلة وابدأ رحلة التحضير
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="mr-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Registration Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Full Name */}
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

              {/* Email */}
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
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="form-input pr-10"
                    placeholder="أدخل بريدك الإلكتروني"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
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

              {/* Password */}
              <div>
                <label htmlFor="password" className="form-label">
                  كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="form-input pr-10 pl-10"
                    placeholder="أدخل كلمة المرور"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="form-label">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    className="form-input pr-10 pl-10"
                    placeholder="أعد إدخال كلمة المرور"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 left-0 pl-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-saudi-green focus:ring-saudi-green border-gray-300 rounded"
              />
              <label htmlFor="terms" className="mr-2 block text-sm text-gray-900">
                أوافق على{' '}
                <Link href="/terms" className="text-saudi-green hover:text-green-700">
                  شروط الاستخدام
                </Link>
                {' '}و{' '}
                <Link href="/privacy" className="text-saudi-green hover:text-green-700">
                  سياسة الخصوصية
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-saudi-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saudi-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري إنشاء الحساب...
                  </div>
                ) : (
                  'إنشاء الحساب'
                )}
              </button>
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Link
                  href="/login"
                  className="font-medium text-saudi-green hover:text-green-700"
                >
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-white hover:text-gray-200 text-sm font-medium"
          >
            ← العودة إلى الصفحة الرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
