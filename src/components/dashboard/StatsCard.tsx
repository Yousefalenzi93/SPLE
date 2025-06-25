import { ReactNode } from 'react'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray'
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  trend,
  className = ''
}: StatsCardProps) {
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  }

  const trendColorClasses = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  }

  const getTrendColor = () => {
    if (!trend) return 'neutral'
    if (trend.isPositive === undefined) {
      return trend.value > 0 ? 'positive' : trend.value < 0 ? 'negative' : 'neutral'
    }
    return trend.isPositive ? 'positive' : 'negative'
  }

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className={`h-8 w-8 ${colorClasses[color]}`} />
        </div>
        <div className="mr-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
      
      {trend && (
        <div className="mt-4">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${trendColorClasses[getTrendColor()]}`}>
            <span className="ml-1">
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
            <span>{trend.label}</span>
          </div>
        </div>
      )}
    </div>
  )
}

// Specialized stats cards for common use cases
interface ScoreCardProps {
  score: number
  title: string
  subtitle?: string
  className?: string
}

export function ScoreCard({ score, title, subtitle, className = '' }: ScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200'
    if (score >= 60) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className={`rounded-lg border-2 p-6 ${getScoreBackground(score)} ${className}`}>
      <div className="text-center">
        <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
        <p className={`text-4xl font-bold ${getScoreColor(score)} mb-2`}>
          {score}%
        </p>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

interface ProgressCardProps {
  title: string
  current: number
  total: number
  color?: string
  className?: string
}

export function ProgressCard({ 
  title, 
  current, 
  total, 
  color = '#006C35', 
  className = '' 
}: ProgressCardProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-900">{title}</h3>
        <span className="text-sm text-gray-600">{current}/{total}</span>
      </div>
      
      <div className="mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${percentage}%`,
              backgroundColor: color
            }}
          />
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>{percentage}% مكتمل</span>
        <span>{total - current} متبقي</span>
      </div>
    </div>
  )
}

interface ComparisonCardProps {
  title: string
  currentValue: number
  previousValue: number
  unit?: string
  className?: string
}

export function ComparisonCard({
  title,
  currentValue,
  previousValue,
  unit = '',
  className = ''
}: ComparisonCardProps) {
  const difference = currentValue - previousValue
  const percentageChange = previousValue > 0 ? Math.round((difference / previousValue) * 100) : 0
  const isPositive = difference > 0
  const isNeutral = difference === 0

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-2xl font-semibold text-gray-900">
            {currentValue}{unit}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            الفترة الحالية
          </p>
        </div>
        
        <div className="text-left">
          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isNeutral 
              ? 'text-gray-600 bg-gray-50'
              : isPositive 
              ? 'text-green-600 bg-green-50' 
              : 'text-red-600 bg-red-50'
          }`}>
            {!isNeutral && (
              <span className="ml-1">
                {isPositive ? '↗' : '↘'}
              </span>
            )}
            <span>
              {isNeutral ? 'لا تغيير' : `${Math.abs(percentageChange)}%`}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            مقارنة بـ {previousValue}{unit}
          </p>
        </div>
      </div>
    </div>
  )
}
