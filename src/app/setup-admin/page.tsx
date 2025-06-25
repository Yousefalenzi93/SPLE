'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createAdminUser, defaultAdminUsers, validateAdminData, generateSecurePassword } from '@/lib/create-admin'
import { 
  UserPlus, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Shield,
  AlertTriangle,
  Copy
} from 'lucide-react'

interface AdminUserData {
  email: string
  password: string
  displayName: string
  university?: string
  phoneNumber?: string
}

export default function SetupAdminPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<AdminUserData>({
    email: '',
    password: '',
    displayName: '',
    university: '',
    phoneNumber: ''
  })
  
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; uid?: string } | null>(null)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([])
    }
  }

  const generatePassword = () => {
    const newPassword = generateSecurePassword(12)
    setFormData(prev => ({
      ...prev,
      password: newPassword
    }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const useDefaultAdmin = () => {
    const defaultAdmin = defaultAdminUsers[0]
    setFormData({
      email: defaultAdmin.email,
      password: defaultAdmin.password,
      displayName: defaultAdmin.displayName,
      university: defaultAdmin.university || '',
      phoneNumber: defaultAdmin.phoneNumber || ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data
    const validation = validateAdminData(formData)
    if (!validation.valid) {
      setValidationErrors(validation.errors)
      return
    }

    setLoading(true)
    setResult(null)
    
    try {
      const createResult = await createAdminUser(formData)
      setResult(createResult)
      
      if (createResult.success) {
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login')
        }, 3000)
      }
    } catch (error) {
      setResult({
        success: false,
        message: `خطأ في إنشاء المستخدم: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Shield className="h-12 w-12 text-saudi-green" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          إعداد المسؤول الأولي
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          إنشاء أول مستخدم مسؤول للنظام
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          
          {/* Warning Message */}
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="mr-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  تحذير أمني
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>هذه الصفحة لإعداد النظام فقط. احذفها بعد إنشاء المسؤول الأولي.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Setup Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={useDefaultAdmin}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              استخدام الإعدادات الافتراضية
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-saudi-green focus:border-saudi-green"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                الاسم الكامل
              </label>
              <div className="mt-1">
                <input
                  id="displayName"
                  name="displayName"
                  type="text"
                  required
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-saudi-green focus:border-saudi-green"
                  placeholder="مدير النظام"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-saudi-green focus:border-saudi-green"
                  placeholder="كلمة مرور قوية"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="mt-2 flex space-x-2 space-x-reverse">
                <button
                  type="button"
                  onClick={generatePassword}
                  className="text-xs text-saudi-green hover:text-green-700"
                >
                  توليد كلمة مرور قوية
                </button>
                {formData.password && (
                  <button
                    type="button"
                    onClick={() => copyToClipboard(formData.password)}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <Copy className="h-3 w-3 ml-1" />
                    نسخ
                  </button>
                )}
              </div>
            </div>

            {/* University */}
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                الجامعة (اختياري)
              </label>
              <div className="mt-1">
                <input
                  id="university"
                  name="university"
                  type="text"
                  value={formData.university}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-saudi-green focus:border-saudi-green"
                  placeholder="إدارة النظام"
                />
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                رقم الهاتف (اختياري)
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-saudi-green focus:border-saudi-green"
                  placeholder="+966500000000"
                />
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <XCircle className="h-5 w-5 text-red-400" />
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-red-800">
                      يرجى تصحيح الأخطاء التالية:
                    </h3>
                    <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Result Message */}
            {result && (
              <div className={`border rounded-md p-4 ${
                result.success 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex">
                  {result.success 
                    ? <CheckCircle className="h-5 w-5 text-green-400" />
                    : <XCircle className="h-5 w-5 text-red-400" />
                  }
                  <div className="mr-3">
                    <p className={`text-sm ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.message}
                    </p>
                    {result.success && (
                      <p className="text-xs text-green-700 mt-1">
                        سيتم توجيهك لصفحة تسجيل الدخول خلال 3 ثوانٍ...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-saudi-green hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saudi-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin h-4 w-4 ml-2" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 ml-2" />
                    إنشاء المسؤول
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Instructions */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              بعد إنشاء المسؤول الأولي، احذف هذه الصفحة لأسباب أمنية
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
