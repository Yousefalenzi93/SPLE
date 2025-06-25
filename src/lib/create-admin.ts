// Create Admin User Script
// سكريبت إنشاء مستخدم مسؤول

import { auth, db } from './firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

interface AdminUserData {
  email: string
  password: string
  displayName: string
  university?: string
  phoneNumber?: string
}

export async function createAdminUser(userData: AdminUserData): Promise<{ success: boolean; message: string; uid?: string }> {
  try {
    // Create user with Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    )

    const user = userCredential.user

    // Update user profile
    await updateProfile(user, {
      displayName: userData.displayName
    })

    // Create user document in Firestore with admin role
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: userData.email,
      displayName: userData.displayName,
      role: 'admin', // This is the key part - setting admin role
      university: userData.university || 'إدارة النظام',
      phoneNumber: userData.phoneNumber || '',
      createdAt: new Date(),
      lastLoginAt: new Date(),
      isActive: true,
      emailVerified: user.emailVerified,
      metadata: {
        createdBy: 'system',
        isInitialAdmin: true
      }
    })

    return {
      success: true,
      message: `تم إنشاء المستخدم المسؤول بنجاح: ${userData.email}`,
      uid: user.uid
    }

  } catch (error) {
    console.error('Error creating admin user:', error)
    
    let errorMessage = 'خطأ غير معروف'
    
    if (error instanceof Error) {
      switch (error.message) {
        case 'auth/email-already-in-use':
          errorMessage = 'البريد الإلكتروني مستخدم بالفعل'
          break
        case 'auth/weak-password':
          errorMessage = 'كلمة المرور ضعيفة (يجب أن تكون 6 أحرف على الأقل)'
          break
        case 'auth/invalid-email':
          errorMessage = 'البريد الإلكتروني غير صحيح'
          break
        default:
          errorMessage = error.message
      }
    }

    return {
      success: false,
      message: `فشل في إنشاء المستخدم المسؤول: ${errorMessage}`
    }
  }
}

// Predefined admin users for quick setup
export const defaultAdminUsers: AdminUserData[] = [
  {
    email: 'admin@sple-exam.com',
    password: 'Admin123!',
    displayName: 'مدير النظام',
    university: 'إدارة النظام',
    phoneNumber: '+966500000000'
  },
  {
    email: 'supervisor@sple-exam.com',
    password: 'Supervisor123!',
    displayName: 'المشرف العام',
    university: 'إدارة النظام',
    phoneNumber: '+966500000001'
  }
]

// Function to create multiple admin users
export async function createMultipleAdmins(users: AdminUserData[]): Promise<Array<{ email: string; success: boolean; message: string; uid?: string }>> {
  const results = []
  
  for (const userData of users) {
    const result = await createAdminUser(userData)
    results.push({
      email: userData.email,
      ...result
    })
    
    // Wait a bit between creations to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return results
}

// Function to check if any admin users exist
export async function checkAdminExists(): Promise<boolean> {
  try {
    // This would require a more complex query in a real implementation
    // For now, we'll just return false to allow admin creation
    return false
  } catch (error) {
    console.error('Error checking admin existence:', error)
    return false
  }
}

// Function to promote existing user to admin
export async function promoteUserToAdmin(userId: string): Promise<{ success: boolean; message: string }> {
  try {
    await setDoc(doc(db, 'users', userId), {
      role: 'admin',
      promotedAt: new Date(),
      promotedBy: auth.currentUser?.uid || 'system'
    }, { merge: true })

    return {
      success: true,
      message: 'تم ترقية المستخدم إلى مسؤول بنجاح'
    }
  } catch (error) {
    return {
      success: false,
      message: `فشل في ترقية المستخدم: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`
    }
  }
}

// Validation functions
export function validateAdminData(userData: AdminUserData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(userData.email)) {
    errors.push('البريد الإلكتروني غير صحيح')
  }

  // Password validation
  if (userData.password.length < 6) {
    errors.push('كلمة المرور يجب أن تكون 6 أحرف على الأقل')
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم')
  }

  // Display name validation
  if (!userData.displayName || userData.displayName.trim().length < 2) {
    errors.push('الاسم يجب أن يكون حرفين على الأقل')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Helper function to generate secure password
export function generateSecurePassword(length: number = 12): string {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure at least one of each required character type
  password += 'A' // Uppercase
  password += 'a' // Lowercase  
  password += '1' // Number
  password += '!' // Special character
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

// Usage example:
/*
import { createAdminUser, defaultAdminUsers, validateAdminData } from '@/lib/create-admin'

// Create a single admin
const adminData = {
  email: 'admin@example.com',
  password: 'SecurePassword123!',
  displayName: 'مدير النظام',
  university: 'جامعة الملك سعود'
}

const validation = validateAdminData(adminData)
if (validation.valid) {
  const result = await createAdminUser(adminData)
  console.log(result.message)
} else {
  console.log('Validation errors:', validation.errors)
}

// Or create default admins
const results = await createMultipleAdmins(defaultAdminUsers)
results.forEach(result => {
  console.log(`${result.email}: ${result.message}`)
})
*/
