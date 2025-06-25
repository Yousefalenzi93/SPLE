// User Types
export interface User {
  uid: string
  email: string
  displayName: string
  role: 'student' | 'admin'
  university: string
  graduationYear: number
  createdAt: Date
  lastLogin: Date
}

// Question Types
export type QuestionDomain = 'biomedical' | 'pharmaceutical' | 'social' | 'clinical'
export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

export interface Question {
  id: string
  content: string
  options: string[]
  correctAnswer: number
  explanation: string
  domain: QuestionDomain
  difficulty: QuestionDifficulty
  references: string[]
  createdBy: string
  approved: boolean
  createdAt: Date
}

// Exam Types
export type ExamType = 'practice' | 'mock' | 'custom'
export type ExamSection = 1 | 2

export interface ExamSession {
  id: string
  userId: string
  examType: ExamType
  section: ExamSection
  questions: string[] // Question IDs
  answers: (number | null)[] // User answers
  startTime: Date
  endTime?: Date
  score?: number
  completed: boolean
  timeSpent: number // in seconds
}

// User Progress Types
export interface DomainScore {
  biomedical: number
  pharmaceutical: number
  social: number
  clinical: number
}

export interface UserProgress {
  userId: string
  totalExams: number
  averageScore: number
  domainScores: DomainScore
  weakAreas: QuestionDomain[]
  strongAreas: QuestionDomain[]
  lastUpdated: Date
  examHistory: ExamSession[]
}

// Analytics Types
export interface ExamAnalytics {
  totalQuestions: number
  correctAnswers: number
  incorrectAnswers: number
  unanswered: number
  timePerQuestion: number
  domainBreakdown: DomainScore
  difficultyBreakdown: {
    easy: number
    medium: number
    hard: number
  }
}

// Saudi Universities
export const SAUDI_UNIVERSITIES = [
  'جامعة الملك سعود',
  'جامعة الملك عبدالعزيز',
  'جامعة الملك فهد للبترول والمعادن',
  'جامعة الملك فيصل',
  'جامعة الملك خالد',
  'جامعة الإمام محمد بن سعود الإسلامية',
  'جامعة أم القرى',
  'الجامعة الإسلامية بالمدينة المنورة',
  'جامعة القصيم',
  'جامعة طيبة',
  'جامعة الطائف',
  'جامعة جازان',
  'جامعة الباحة',
  'جامعة تبوك',
  'جامعة الحدود الشمالية',
  'جامعة الجوف',
  'جامعة حائل',
  'جامعة الأميرة نورة بنت عبدالرحمن',
  'جامعة الملك سعود بن عبدالعزيز للعلوم الصحية',
  'جامعة الملك عبدالله للعلوم والتقنية',
  'جامعة دار العلوم',
  'كليات الريان الأهلية',
  'جامعة الأمير سلطان',
  'جامعة عفت',
  'أخرى'
] as const

export type SaudiUniversity = typeof SAUDI_UNIVERSITIES[number]

// Domain Information
export const DOMAIN_INFO = {
  biomedical: {
    name: 'العلوم الطبية الحيوية الأساسية',
    percentage: 10,
    color: '#3B82F6',
    description: 'علم التشريح والفسيولوجيا، علم الأدوية والسموم، علم الأحياء الدقيقة والمناعة'
  },
  pharmaceutical: {
    name: 'العلوم الصيدلانية',
    percentage: 35,
    color: '#10B981',
    description: 'الكيمياء الصيدلانية، علم الأدوية الصيدلاني، تقنية الصيدلة'
  },
  social: {
    name: 'العلوم الاجتماعية/السلوكية/الإدارية',
    percentage: 20,
    color: '#F59E0B',
    description: 'أخلاقيات المهنة، إدارة الصيدلية، التواصل مع المرضى'
  },
  clinical: {
    name: 'العلوم السريرية',
    percentage: 35,
    color: '#EF4444',
    description: 'العلاج الدوائي، الرعاية الصيدلانية، مراقبة الأدوية'
  }
} as const

// Exam Configuration
export const EXAM_CONFIG = {
  SECTION_1_QUESTIONS: 110,
  SECTION_2_QUESTIONS: 110,
  SECTION_TIME_MINUTES: 120,
  TOTAL_QUESTIONS: 220,
  TOTAL_TIME_MINUTES: 240,
  PASSING_SCORE: 60
} as const
