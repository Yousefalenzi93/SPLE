'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createUser, getUser, updateUserLastLogin } from '@/lib/firestore'
import type { User } from '@/types'

interface AuthContextType {
  currentUser: User | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, userData: RegisterData) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (displayName: string) => Promise<void>
  sendVerificationEmail: () => Promise<void>
}

interface RegisterData {
  displayName: string
  university: string
  graduationYear: number
  role?: 'student' | 'admin'
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      if (result.user) {
        await updateUserLastLogin(result.user.uid)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(getAuthErrorMessage(error.code))
    }
  }

  const register = async (email: string, password: string, userData: RegisterData) => {
    try {
      console.log('Starting registration process for:', email)

      const result = await createUserWithEmailAndPassword(auth, email, password)

      if (result.user) {
        console.log('Firebase Auth user created:', result.user.uid)

        // Update Firebase Auth profile
        await updateProfile(result.user, {
          displayName: userData.displayName
        })
        console.log('Firebase Auth profile updated')

        // Create user document in Firestore
        await createUser({
          uid: result.user.uid,
          email: result.user.email!,
          displayName: userData.displayName,
          role: userData.role || 'student',
          university: userData.university,
          graduationYear: userData.graduationYear
        })
        console.log('Firestore user document created')

        // Send email verification
        await sendEmailVerification(result.user)
        console.log('Email verification sent')
      }
    } catch (error: any) {
      console.error('Registration error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      })

      // More specific error handling
      if (error.message === 'فشل في إنشاء بيانات المستخدم') {
        throw new Error('فشل في حفظ بيانات المستخدم. يرجى المحاولة مرة أخرى.')
      }

      throw new Error(getAuthErrorMessage(error.code))
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      setCurrentUser(null)
      setFirebaseUser(null)
    } catch (error: any) {
      console.error('Logout error:', error)
      throw new Error('فشل في تسجيل الخروج')
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error('Password reset error:', error)
      throw new Error(getAuthErrorMessage(error.code))
    }
  }

  const updateUserProfile = async (displayName: string) => {
    if (!firebaseUser) throw new Error('لا يوجد مستخدم مسجل دخول')
    
    try {
      await updateProfile(firebaseUser, { displayName })
      
      // Update user document in Firestore
      if (currentUser) {
        await createUser({
          ...currentUser,
          displayName
        })
      }
    } catch (error: any) {
      console.error('Profile update error:', error)
      throw new Error('فشل في تحديث الملف الشخصي')
    }
  }

  const sendVerificationEmail = async () => {
    if (!firebaseUser) throw new Error('لا يوجد مستخدم مسجل دخول')
    
    try {
      await sendEmailVerification(firebaseUser)
    } catch (error: any) {
      console.error('Email verification error:', error)
      throw new Error('فشل في إرسال رسالة التحقق')
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user)
      
      if (user) {
        try {
          // Get user data from Firestore
          const userData = await getUser(user.uid)
          setCurrentUser(userData)
        } catch (error) {
          console.error('Error fetching user data:', error)
          setCurrentUser(null)
        }
      } else {
        setCurrentUser(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    sendVerificationEmail
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Helper function to translate Firebase auth error codes to Arabic
const getAuthErrorMessage = (errorCode: string): string => {
  console.log('Error code received:', errorCode)

  switch (errorCode) {
    case 'auth/user-not-found':
      return 'لا يوجد حساب مرتبط بهذا البريد الإلكتروني'
    case 'auth/wrong-password':
      return 'كلمة المرور غير صحيحة'
    case 'auth/email-already-in-use':
      return 'هذا البريد الإلكتروني مستخدم بالفعل'
    case 'auth/weak-password':
      return 'كلمة المرور ضعيفة. يجب أن تكون 6 أحرف على الأقل'
    case 'auth/invalid-email':
      return 'البريد الإلكتروني غير صحيح'
    case 'auth/user-disabled':
      return 'تم تعطيل هذا الحساب'
    case 'auth/too-many-requests':
      return 'تم تجاوز عدد المحاولات المسموح. حاول مرة أخرى لاحقاً'
    case 'auth/network-request-failed':
      return 'خطأ في الاتصال بالإنترنت'
    case 'auth/operation-not-allowed':
      return 'تسجيل الحسابات الجديدة غير مفعل. يرجى التواصل مع المدير'
    case 'auth/requires-recent-login':
      return 'يرجى تسجيل الدخول مرة أخرى لإتمام هذه العملية'
    case 'permission-denied':
      return 'ليس لديك صلاحية لتنفيذ هذه العملية'
    case 'unavailable':
      return 'الخدمة غير متاحة حالياً. يرجى المحاولة لاحقاً'
    default:
      console.log('Unknown error code:', errorCode)
      return `حدث خطأ غير متوقع (${errorCode || 'unknown'}). يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني`
  }
}
