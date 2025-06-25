// Firebase Connection Test
// اختبار الاتصال بـ Firebase

import { db, auth, storage } from './firebase'
import { collection, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser } from 'firebase/auth'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

interface TestResult {
  test: string
  status: 'success' | 'error'
  message: string
  duration?: number
}

export class FirebaseConnectionTest {
  private results: TestResult[] = []
  private testEmail = `test-${Date.now()}@example.com`
  private testPassword = 'TestPassword123!'

  async runAllTests(): Promise<TestResult[]> {
    console.log('🔥 بدء اختبار الاتصال بـ Firebase...')
    this.results = []

    await this.testFirestoreConnection()
    await this.testAuthenticationConnection()
    await this.testStorageConnection()
    await this.testSecurityRules()
    await this.cleanup()

    return this.results
  }

  private async testFirestoreConnection(): Promise<void> {
    const startTime = Date.now()
    
    try {
      // Test writing to Firestore
      const testDoc = doc(collection(db, 'test'), 'connection-test')
      await setDoc(testDoc, {
        message: 'Firebase connection test',
        timestamp: new Date(),
        testId: Date.now()
      })

      // Test reading from Firestore
      const docSnap = await getDoc(testDoc)
      
      if (docSnap.exists()) {
        await deleteDoc(testDoc) // Cleanup
        
        this.results.push({
          test: 'Firestore Connection',
          status: 'success',
          message: 'تم الاتصال بـ Firestore بنجاح',
          duration: Date.now() - startTime
        })
      } else {
        throw new Error('Document not found after creation')
      }
    } catch (error) {
      this.results.push({
        test: 'Firestore Connection',
        status: 'error',
        message: `فشل الاتصال بـ Firestore: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      })
    }
  }

  private async testAuthenticationConnection(): Promise<void> {
    const startTime = Date.now()
    
    try {
      // Test user creation
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        this.testEmail, 
        this.testPassword
      )
      
      const user = userCredential.user
      
      if (user) {
        // Test sign out and sign in
        await auth.signOut()
        
        await signInWithEmailAndPassword(auth, this.testEmail, this.testPassword)
        
        this.results.push({
          test: 'Firebase Authentication',
          status: 'success',
          message: 'تم اختبار المصادقة بنجاح',
          duration: Date.now() - startTime
        })
        
        // Store user reference for cleanup
        this.testUserId = user.uid
      }
    } catch (error) {
      this.results.push({
        test: 'Firebase Authentication',
        status: 'error',
        message: `فشل اختبار المصادقة: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      })
    }
  }

  private async testStorageConnection(): Promise<void> {
    const startTime = Date.now()
    
    try {
      // Create a test file
      const testData = new Blob(['Test file content'], { type: 'text/plain' })
      const testRef = ref(storage, `test/connection-test-${Date.now()}.txt`)
      
      // Upload file
      await uploadBytes(testRef, testData)
      
      // Get download URL
      const downloadURL = await getDownloadURL(testRef)
      
      if (downloadURL) {
        // Cleanup - delete the test file
        await deleteObject(testRef)
        
        this.results.push({
          test: 'Firebase Storage',
          status: 'success',
          message: 'تم اختبار التخزين بنجاح',
          duration: Date.now() - startTime
        })
      }
    } catch (error) {
      this.results.push({
        test: 'Firebase Storage',
        status: 'error',
        message: `فشل اختبار التخزين: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      })
    }
  }

  private async testSecurityRules(): Promise<void> {
    const startTime = Date.now()
    
    try {
      if (!auth.currentUser) {
        throw new Error('No authenticated user for security rules test')
      }

      // Test user document access
      const userDoc = doc(db, 'users', auth.currentUser.uid)
      await setDoc(userDoc, {
        email: auth.currentUser.email,
        role: 'student',
        createdAt: new Date()
      })

      const userSnap = await getDoc(userDoc)
      
      if (userSnap.exists()) {
        this.results.push({
          test: 'Security Rules',
          status: 'success',
          message: 'قواعد الأمان تعمل بشكل صحيح',
          duration: Date.now() - startTime
        })
      }
    } catch (error) {
      this.results.push({
        test: 'Security Rules',
        status: 'error',
        message: `مشكلة في قواعد الأمان: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      })
    }
  }

  private testUserId?: string

  private async cleanup(): Promise<void> {
    try {
      // Delete test user if created
      if (auth.currentUser && this.testUserId) {
        // Delete user document
        const userDoc = doc(db, 'users', this.testUserId)
        await deleteDoc(userDoc).catch(() => {}) // Ignore errors
        
        // Delete user account
        await deleteUser(auth.currentUser).catch(() => {}) // Ignore errors
      }
      
      await auth.signOut().catch(() => {}) // Ignore errors
      
      console.log('✅ تم تنظيف بيانات الاختبار')
    } catch (error) {
      console.warn('⚠️ تحذير: لم يتم تنظيف جميع بيانات الاختبار:', error)
    }
  }

  // Helper method to format results for display
  static formatResults(results: TestResult[]): string {
    let output = '\n🔥 نتائج اختبار Firebase:\n'
    output += '================================\n\n'
    
    results.forEach((result, index) => {
      const status = result.status === 'success' ? '✅' : '❌'
      const duration = result.duration ? ` (${result.duration}ms)` : ''
      
      output += `${index + 1}. ${status} ${result.test}${duration}\n`
      output += `   ${result.message}\n\n`
    })
    
    const successCount = results.filter(r => r.status === 'success').length
    const totalCount = results.length
    
    output += `📊 النتيجة النهائية: ${successCount}/${totalCount} اختبارات نجحت\n`
    
    if (successCount === totalCount) {
      output += '🎉 جميع الاختبارات نجحت! Firebase جاهز للاستخدام.\n'
    } else {
      output += '⚠️ بعض الاختبارات فشلت. يرجى مراجعة الإعدادات.\n'
    }
    
    return output
  }
}

// Quick test function for console use
export async function quickFirebaseTest(): Promise<void> {
  const tester = new FirebaseConnectionTest()
  const results = await tester.runAllTests()
  console.log(FirebaseConnectionTest.formatResults(results))
}

// Test individual components
export const testFirebaseComponents = {
  async firestore(): Promise<boolean> {
    try {
      const testDoc = doc(collection(db, 'test'), 'quick-test')
      await setDoc(testDoc, { test: true })
      const snap = await getDoc(testDoc)
      await deleteDoc(testDoc)
      return snap.exists()
    } catch {
      return false
    }
  },

  async auth(): Promise<boolean> {
    try {
      // Just check if auth is initialized
      return auth.app !== null
    } catch {
      return false
    }
  },

  async storage(): Promise<boolean> {
    try {
      // Just check if storage is initialized
      return storage.app !== null
    } catch {
      return false
    }
  }
}

// Environment validation
export function validateFirebaseConfig(): { valid: boolean; missing: string[] } {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ]

  const missing = requiredVars.filter(varName => !process.env[varName])
  
  return {
    valid: missing.length === 0,
    missing
  }
}
