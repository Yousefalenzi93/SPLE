import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ExamProvider } from '@/contexts/ExamContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'نظام امتحانات الصيدلة - الهيئة السعودية للتخصصات الصحية',
  description: 'منصة تحضير شاملة لامتحان ترخيص الصيدلة للهيئة السعودية للتخصصات الصحية',
  keywords: 'صيدلة، امتحان، SCFHS، الهيئة السعودية، تخصصات صحية، ترخيص',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${inter.className} rtl`}>
        <AuthProvider>
          <ExamProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
          </ExamProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
