'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await resetPassword(email)
      setSuccess(true)
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
              تم إرسال الرسالة!
            </h2>
            <p className="text-gray-600 mb-6">
              تم إرسال رسالة إعادة تعيين كلمة المرور إلى بريدك الإلكتروني. يرجى التحقق من صندوق الوارد ومجلد الرسائل غير المرغوب فيها.
            </p>
            <div className="space-y-4">
              <Link
                href="/login"
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-saudi-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saudi-green"
              >
                <ArrowRight className="h-4 w-4 ml-2" />
                العودة إلى تسجيل الدخول
              </Link>
              <button
                onClick={() => {
                  setSuccess(false)
                  setEmail('')
                }}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saudi-green"
              >
                إرسال رسالة أخرى
              </button>
            </div>
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
              نسيت كلمة المرور؟
            </h2>
            <p className="text-gray-600">
              أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور
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

          {/* Reset Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-saudi-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saudi-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                    جاري الإرسال...
                  </div>
                ) : (
                  'إرسال رابط إعادة التعيين'
                )}
              </button>
            </div>

            <div className="text-center space-y-2">
              <Link
                href="/login"
                className="text-sm font-medium text-saudi-green hover:text-green-700"
              >
                تذكرت كلمة المرور؟ تسجيل الدخول
              </Link>
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
