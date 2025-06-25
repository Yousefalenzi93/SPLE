'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { 
  createExamSession, 
  updateExamSession, 
  getRandomQuestions 
} from '@/lib/firestore'
import type { 
  Question, 
  ExamSession, 
  ExamType, 
  ExamSection, 
  QuestionDomain,
  QuestionDifficulty 
} from '@/types'

interface ExamContextType {
  // Current exam state
  currentSession: ExamSession | null
  questions: Question[]
  currentQuestionIndex: number
  answers: (number | null)[]
  timeRemaining: number
  isExamActive: boolean
  
  // Exam actions
  startExam: (type: ExamType, section: ExamSection, config?: ExamConfig) => Promise<void>
  submitAnswer: (questionIndex: number, answerIndex: number) => void
  navigateToQuestion: (index: number) => void
  submitExam: () => Promise<void>
  pauseExam: () => void
  resumeExam: () => void
  
  // Exam configuration
  examConfig: ExamConfig | null
  setExamConfig: (config: ExamConfig) => void
  
  // Loading states
  loading: boolean
  error: string | null
}

interface ExamConfig {
  domain?: QuestionDomain
  difficulty?: QuestionDifficulty
  questionCount?: number
  timeLimit?: number // in minutes
  showFeedback?: boolean
  allowReview?: boolean
}

const ExamContext = createContext<ExamContextType | undefined>(undefined)

export const useExam = () => {
  const context = useContext(ExamContext)
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider')
  }
  return context
}

export const ExamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth()
  
  // Exam state
  const [currentSession, setCurrentSession] = useState<ExamSession | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isExamActive, setIsExamActive] = useState(false)
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isExamActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Auto-submit when time runs out
            submitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isExamActive, timeRemaining])

  const startExam = async (type: ExamType, section: ExamSection, config?: ExamConfig) => {
    if (!currentUser) {
      setError('يجب تسجيل الدخول لبدء الامتحان')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Set default configuration based on exam type
      let finalConfig: ExamConfig
      
      if (type === 'mock') {
        finalConfig = {
          questionCount: 110,
          timeLimit: 120, // 2 hours
          showFeedback: false,
          allowReview: false
        }
      } else if (type === 'practice') {
        finalConfig = {
          questionCount: config?.questionCount || 20,
          domain: config?.domain,
          difficulty: config?.difficulty,
          showFeedback: true,
          allowReview: true,
          timeLimit: 0 // No time limit for practice
        }
      } else { // custom
        finalConfig = config || {
          questionCount: 20,
          timeLimit: 30,
          showFeedback: false,
          allowReview: true
        }
      }

      setExamConfig(finalConfig)

      // Fetch questions
      const examQuestions = await getRandomQuestions(
        finalConfig.questionCount!,
        finalConfig.domain,
        finalConfig.difficulty
      )

      if (examQuestions.length === 0) {
        throw new Error('لا توجد أسئلة متاحة للمعايير المحددة')
      }

      // Create exam session
      const sessionData: Omit<ExamSession, 'id'> = {
        userId: currentUser.uid,
        examType: type,
        section: section,
        questions: examQuestions.map(q => q.id),
        answers: new Array(examQuestions.length).fill(null),
        startTime: new Date(),
        completed: false,
        timeSpent: 0
      }

      const sessionId = await createExamSession(sessionData)
      
      // Set up exam state
      setCurrentSession({ ...sessionData, id: sessionId })
      setQuestions(examQuestions)
      setAnswers(new Array(examQuestions.length).fill(null))
      setCurrentQuestionIndex(0)
      setTimeRemaining(finalConfig.timeLimit ? finalConfig.timeLimit * 60 : 0)
      setIsExamActive(true)

    } catch (error: any) {
      setError(error.message || 'فشل في بدء الامتحان')
    } finally {
      setLoading(false)
    }
  }

  const submitAnswer = (questionIndex: number, answerIndex: number) => {
    setAnswers(prev => {
      const newAnswers = [...prev]
      newAnswers[questionIndex] = answerIndex
      return newAnswers
    })
  }

  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  const submitExam = async () => {
    if (!currentSession) return

    try {
      setLoading(true)
      setIsExamActive(false)

      // Calculate score
      let correctAnswers = 0
      questions.forEach((question, index) => {
        if (answers[index] === question.correctAnswer) {
          correctAnswers++
        }
      })

      const score = Math.round((correctAnswers / questions.length) * 100)
      const timeSpent = examConfig?.timeLimit 
        ? (examConfig.timeLimit * 60) - timeRemaining 
        : 0

      // Update session in database
      await updateExamSession(currentSession.id, {
        answers,
        endTime: new Date(),
        score,
        completed: true,
        timeSpent
      })

      // Update local session
      setCurrentSession(prev => prev ? {
        ...prev,
        answers,
        endTime: new Date(),
        score,
        completed: true,
        timeSpent
      } : null)

    } catch (error: any) {
      setError(error.message || 'فشل في حفظ نتائج الامتحان')
    } finally {
      setLoading(false)
    }
  }

  const pauseExam = () => {
    setIsExamActive(false)
  }

  const resumeExam = () => {
    setIsExamActive(true)
  }

  // Reset exam state when user changes
  useEffect(() => {
    if (!currentUser) {
      setCurrentSession(null)
      setQuestions([])
      setAnswers([])
      setCurrentQuestionIndex(0)
      setTimeRemaining(0)
      setIsExamActive(false)
      setExamConfig(null)
    }
  }, [currentUser])

  const value: ExamContextType = {
    currentSession,
    questions,
    currentQuestionIndex,
    answers,
    timeRemaining,
    isExamActive,
    startExam,
    submitAnswer,
    navigateToQuestion,
    submitExam,
    pauseExam,
    resumeExam,
    examConfig,
    setExamConfig,
    loading,
    error
  }

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  )
}
