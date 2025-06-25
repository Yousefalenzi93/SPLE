import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from './firebase'
import { sampleQuestions } from '@/data/sampleQuestions'

export const seedQuestionsToFirestore = async () => {
  try {
    console.log('Starting to seed questions to Firestore...')
    
    // Check if questions already exist
    const questionsRef = collection(db, 'questions')
    const existingQuestions = await getDocs(questionsRef)
    
    if (existingQuestions.size > 0) {
      console.log(`Found ${existingQuestions.size} existing questions. Skipping seed.`)
      return { success: true, message: 'Questions already exist', count: existingQuestions.size }
    }

    // Add sample questions to Firestore
    let addedCount = 0
    const errors: string[] = []

    for (const questionData of sampleQuestions) {
      try {
        await addDoc(questionsRef, {
          ...questionData,
          createdAt: new Date(),
          approved: true // Auto-approve sample questions
        })
        addedCount++
        console.log(`Added question ${addedCount}/${sampleQuestions.length}`)
      } catch (error) {
        console.error('Error adding question:', error)
        errors.push(`Failed to add question: ${questionData.content.substring(0, 50)}...`)
      }
    }

    console.log(`Successfully added ${addedCount} questions to Firestore`)
    
    return {
      success: true,
      message: `Successfully added ${addedCount} questions`,
      count: addedCount,
      errors: errors.length > 0 ? errors : undefined
    }
  } catch (error) {
    console.error('Error seeding questions:', error)
    return {
      success: false,
      message: 'Failed to seed questions',
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

export const getQuestionsCount = async () => {
  try {
    const questionsRef = collection(db, 'questions')
    const snapshot = await getDocs(questionsRef)
    return snapshot.size
  } catch (error) {
    console.error('Error getting questions count:', error)
    return 0
  }
}

export const getQuestionsByDomainCount = async () => {
  try {
    const questionsRef = collection(db, 'questions')
    const snapshot = await getDocs(questionsRef)
    
    const counts = {
      biomedical: 0,
      pharmaceutical: 0,
      social: 0,
      clinical: 0
    }

    snapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.domain && counts.hasOwnProperty(data.domain)) {
        counts[data.domain as keyof typeof counts]++
      }
    })

    return counts
  } catch (error) {
    console.error('Error getting questions by domain count:', error)
    return {
      biomedical: 0,
      pharmaceutical: 0,
      social: 0,
      clinical: 0
    }
  }
}
