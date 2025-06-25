'use client'

import { useState, useEffect } from 'react'
import { DOMAIN_INFO } from '@/types'
import type { ExamSession, QuestionDomain } from '@/types'

interface ProgressChartProps {
  examSessions: ExamSession[]
  className?: string
}

export default function ProgressChart({ examSessions, className = '' }: ProgressChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (examSessions.length === 0) return

    // Sort sessions by date
    const sortedSessions = examSessions
      .filter(session => session.completed && session.score !== undefined)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

    // Group by date and calculate average score per day
    const dailyScores = sortedSessions.reduce((acc, session) => {
      const dateKey = session.startTime.toDateString()
      if (!acc[dateKey]) {
        acc[dateKey] = { scores: [], date: session.startTime }
      }
      acc[dateKey].scores.push(session.score!)
      return acc
    }, {} as Record<string, { scores: number[]; date: Date }>)

    // Calculate daily averages
    const data = Object.values(dailyScores).map(day => ({
      date: day.date.toLocaleDateString('ar-SA'),
      score: Math.round(day.scores.reduce((sum, score) => sum + score, 0) / day.scores.length),
      exams: day.scores.length
    }))

    setChartData(data.slice(-10)) // Last 10 data points
  }, [examSessions])

  if (chartData.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">تطور الأداء</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد بيانات كافية لعرض الرسم البياني</p>
        </div>
      </div>
    )
  }

  const maxScore = Math.max(...chartData.map(d => d.score))
  const minScore = Math.min(...chartData.map(d => d.score))

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">تطور الأداء</h3>
      
      <div className="relative">
        {/* Chart Area */}
        <div className="h-64 relative">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500">
            <span>100%</span>
            <span>75%</span>
            <span>50%</span>
            <span>25%</span>
            <span>0%</span>
          </div>
          
          {/* Grid lines */}
          <div className="absolute inset-0 mr-8">
            {[0, 25, 50, 75, 100].map(value => (
              <div
                key={value}
                className="absolute w-full border-t border-gray-200"
                style={{ bottom: `${value}%` }}
              />
            ))}
          </div>
          
          {/* Chart content */}
          <div className="absolute inset-0 mr-8 flex items-end justify-between px-2">
            {chartData.map((point, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Bar */}
                <div
                  className="w-8 bg-saudi-green rounded-t transition-all duration-300 hover:bg-green-600 relative group"
                  style={{ height: `${point.score}%` }}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {point.score}% ({point.exams} امتحان)
                  </div>
                </div>
                
                {/* Date label */}
                <div className="mt-2 text-xs text-gray-600 transform -rotate-45 origin-top-left">
                  {point.date}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-6 flex items-center justify-center">
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-3 h-3 bg-saudi-green rounded ml-2"></div>
            <span>متوسط النتائج اليومية</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Domain Performance Pie Chart Component
interface DomainChartProps {
  domainScores: Record<QuestionDomain, number>
  className?: string
}

export function DomainChart({ domainScores, className = '' }: DomainChartProps) {
  const total = Object.values(domainScores).reduce((sum, score) => sum + score, 0)
  
  if (total === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h3 className="text-lg font-medium text-gray-900 mb-4">الأداء حسب المجال</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">لا توجد بيانات كافية</p>
        </div>
      </div>
    )
  }

  let currentAngle = 0
  const radius = 80
  const centerX = 100
  const centerY = 100

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-lg font-medium text-gray-900 mb-4">الأداء حسب المجال</h3>
      
      <div className="flex items-center justify-center">
        <div className="relative">
          {/* SVG Pie Chart */}
          <svg width="200" height="200" className="transform -rotate-90">
            {Object.entries(DOMAIN_INFO).map(([domain, info]) => {
              const score = domainScores[domain as QuestionDomain] || 0
              const percentage = (score / total) * 100
              const angle = (percentage / 100) * 360
              
              if (percentage === 0) return null
              
              const startAngle = currentAngle
              const endAngle = currentAngle + angle
              currentAngle += angle
              
              const startX = centerX + radius * Math.cos((startAngle * Math.PI) / 180)
              const startY = centerY + radius * Math.sin((startAngle * Math.PI) / 180)
              const endX = centerX + radius * Math.cos((endAngle * Math.PI) / 180)
              const endY = centerY + radius * Math.sin((endAngle * Math.PI) / 180)
              
              const largeArcFlag = angle > 180 ? 1 : 0
              
              const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                'Z'
              ].join(' ')
              
              return (
                <path
                  key={domain}
                  d={pathData}
                  fill={info.color}
                  className="hover:opacity-80 transition-opacity"
                />
              )
            })}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round(total / Object.keys(domainScores).length)}%
              </div>
              <div className="text-xs text-gray-500">متوسط عام</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-6 space-y-2">
        {Object.entries(DOMAIN_INFO).map(([domain, info]) => {
          const score = domainScores[domain as QuestionDomain] || 0
          const percentage = total > 0 ? (score / total) * 100 : 0
          
          return (
            <div key={domain} className="flex items-center justify-between">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full ml-2"
                  style={{ backgroundColor: info.color }}
                />
                <span className="text-sm text-gray-700">{info.name}</span>
              </div>
              <div className="text-sm font-medium text-gray-900">
                {score}% ({percentage.toFixed(1)}%)
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
