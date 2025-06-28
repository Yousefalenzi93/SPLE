import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore'
import { db } from './firebase'
import type {
  User,
  Question,
  ExamSession,
  UserProgress,
  QuestionDomain,
  QuestionDifficulty,
  ExamType
} from '@/types'

// Collection references
export const usersCollection = collection(db, 'users')
export const questionsCollection = collection(db, 'questions')
export const examSessionsCollection = collection(db, 'examSessions')
export const userProgressCollection = collection(db, 'userProgress')

// User operations
export const createUser = async (userData: Omit<User, 'uid' | 'createdAt' | 'lastLogin'> & { uid: string }) => {
  try {
    const userDoc = doc(usersCollection, userData.uid)
    await setDoc(userDoc, {
      ...userData,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    })
    console.log('User created successfully:', userData.uid)
  } catch (error) {
    console.error('Error creating user:', error)
    throw new Error('فشل في إنشاء بيانات المستخدم')
  }
}

export const getUser = async (uid: string): Promise<User | null> => {
  const userDoc = doc(usersCollection, uid)
  const userSnap = await getDoc(userDoc)
  
  if (userSnap.exists()) {
    const data = userSnap.data()
    return {
      uid: userSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate() || new Date()
    } as User
  }
  
  return null
}

export const updateUserLastLogin = async (uid: string) => {
  const userDoc = doc(usersCollection, uid)
  await updateDoc(userDoc, {
    lastLogin: serverTimestamp()
  })
}

// Question operations
export const createQuestion = async (questionData: Omit<Question, 'id' | 'createdAt'>) => {
  const docRef = await addDoc(questionsCollection, {
    ...questionData,
    createdAt: serverTimestamp()
  })
  return docRef.id
}

export const getQuestion = async (id: string): Promise<Question | null> => {
  const questionDoc = doc(questionsCollection, id)
  const questionSnap = await getDoc(questionDoc)
  
  if (questionSnap.exists()) {
    const data = questionSnap.data()
    return {
      id: questionSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date()
    } as Question
  }
  
  return null
}

export const getQuestions = async (
  domain?: QuestionDomain,
  difficulty?: QuestionDifficulty,
  approved: boolean = true,
  limitCount: number = 50
): Promise<Question[]> => {
  const constraints: QueryConstraint[] = [
    where('approved', '==', approved),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  ]
  
  if (domain) {
    constraints.splice(1, 0, where('domain', '==', domain))
  }
  
  if (difficulty) {
    constraints.splice(domain ? 2 : 1, 0, where('difficulty', '==', difficulty))
  }
  
  const q = query(questionsCollection, ...constraints)
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate() || new Date()
  })) as Question[]
}

export const getRandomQuestions = async (
  count: number,
  domain?: QuestionDomain,
  difficulty?: QuestionDifficulty
): Promise<Question[]> => {
  // Get a larger set first, then randomly select
  const questions = await getQuestions(domain, difficulty, true, count * 3)
  
  // Shuffle and take the required count
  const shuffled = questions.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, Math.min(count, shuffled.length))
}

export const updateQuestion = async (id: string, updates: Partial<Question>) => {
  const questionDoc = doc(questionsCollection, id)
  await updateDoc(questionDoc, updates)
}

export const deleteQuestion = async (id: string) => {
  const questionDoc = doc(questionsCollection, id)
  await deleteDoc(questionDoc)
}

// Exam session operations
export const createExamSession = async (sessionData: Omit<ExamSession, 'id'>) => {
  const docRef = await addDoc(examSessionsCollection, {
    ...sessionData,
    startTime: sessionData.startTime || serverTimestamp(),
    endTime: sessionData.endTime || null
  })
  return docRef.id
}

export const getExamSession = async (id: string): Promise<ExamSession | null> => {
  const sessionDoc = doc(examSessionsCollection, id)
  const sessionSnap = await getDoc(sessionDoc)
  
  if (sessionSnap.exists()) {
    const data = sessionSnap.data()
    return {
      id: sessionSnap.id,
      ...data,
      startTime: data.startTime?.toDate() || new Date(),
      endTime: data.endTime?.toDate() || undefined
    } as ExamSession
  }
  
  return null
}

export const getUserExamSessions = async (
  userId: string,
  examType?: ExamType,
  limitCount: number = 20
): Promise<ExamSession[]> => {
  const constraints: QueryConstraint[] = [
    where('userId', '==', userId),
    orderBy('startTime', 'desc'),
    limit(limitCount)
  ]
  
  if (examType) {
    constraints.splice(1, 0, where('examType', '==', examType))
  }
  
  const q = query(examSessionsCollection, ...constraints)
  const querySnapshot = await getDocs(q)
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startTime: doc.data().startTime?.toDate() || new Date(),
    endTime: doc.data().endTime?.toDate() || undefined
  })) as ExamSession[]
}

export const updateExamSession = async (id: string, updates: Partial<ExamSession>) => {
  const sessionDoc = doc(examSessionsCollection, id)
  const updateData = { ...updates }
  
  if (updates.endTime) {
    updateData.endTime = Timestamp.fromDate(updates.endTime)
  }
  
  await updateDoc(sessionDoc, updateData)
}

// User progress operations
export const getUserProgress = async (userId: string): Promise<UserProgress | null> => {
  const progressDoc = doc(userProgressCollection, userId)
  const progressSnap = await getDoc(progressDoc)
  
  if (progressSnap.exists()) {
    const data = progressSnap.data()
    return {
      userId,
      ...data,
      lastUpdated: data.lastUpdated?.toDate() || new Date()
    } as UserProgress
  }
  
  return null
}

export const updateUserProgress = async (userId: string, progress: Partial<UserProgress>) => {
  const progressDoc = doc(userProgressCollection, userId)
  await updateDoc(progressDoc, {
    ...progress,
    lastUpdated: serverTimestamp()
  })
}

export const createUserProgress = async (userId: string, initialProgress: Omit<UserProgress, 'userId' | 'lastUpdated'>) => {
  const progressDoc = doc(userProgressCollection, userId)
  await updateDoc(progressDoc, {
    userId,
    ...initialProgress,
    lastUpdated: serverTimestamp()
  })
}

// Utility functions
export const convertTimestamp = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate()
  }
  return new Date(timestamp)
}
