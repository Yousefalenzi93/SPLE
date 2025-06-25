import Link from 'next/link'
import { BookOpen, Users, BarChart3, Shield } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="bg-saudi-green text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">نظام امتحانات الصيدلة</h1>
            <div className="flex gap-4">
              <Link href="/login" className="btn-secondary text-saudi-green">
                تسجيل الدخول
              </Link>
              <Link href="/register" className="bg-white text-saudi-green px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-saudi-green to-green-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            استعد لامتحان ترخيص الصيدلة
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            منصة تحضير شاملة لامتحان الهيئة السعودية للتخصصات الصحية مع أسئلة متخصصة وتحليلات مفصلة
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="bg-white text-saudi-green px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              ابدأ التحضير الآن
            </Link>
            <Link href="/demo" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-saudi-green transition-colors">
              جرب النظام
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">
            ميزات المنصة
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-saudi-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">بنك أسئلة شامل</h4>
              <p className="text-gray-600">
                أكثر من 2000 سؤال مصنف حسب المجالات الأربعة للهيئة السعودية
              </p>
            </div>
            <div className="text-center">
              <div className="bg-saudi-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">امتحانات تجريبية</h4>
              <p className="text-gray-600">
                محاكاة كاملة للامتحان الفعلي بقسمين 110 سؤال لكل قسم
              </p>
            </div>
            <div className="text-center">
              <div className="bg-saudi-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">تحليلات مفصلة</h4>
              <p className="text-gray-600">
                تقارير شاملة عن الأداء ونقاط القوة والضعف
              </p>
            </div>
            <div className="text-center">
              <div className="bg-saudi-green text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield size={32} />
              </div>
              <h4 className="text-xl font-bold mb-2">محتوى سعودي</h4>
              <p className="text-gray-600">
                أسئلة متخصصة في اللوائح والبروتوكولات السعودية
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-saudi-green mb-2">2000+</div>
              <div className="text-gray-600">سؤال متخصص</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-saudi-green mb-2">95%</div>
              <div className="text-gray-600">معدل نجاح المستخدمين</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-saudi-green mb-2">500+</div>
              <div className="text-gray-600">طالب مسجل</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h5 className="text-xl font-bold mb-4">نظام امتحانات الصيدلة</h5>
              <p className="text-gray-400">
                منصة تحضير متخصصة لامتحان ترخيص الصيدلة للهيئة السعودية للتخصصات الصحية
              </p>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">روابط مهمة</h5>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/about" className="hover:text-white">عن المنصة</Link></li>
                <li><Link href="/contact" className="hover:text-white">اتصل بنا</Link></li>
                <li><Link href="/privacy" className="hover:text-white">سياسة الخصوصية</Link></li>
                <li><Link href="/terms" className="hover:text-white">شروط الاستخدام</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-xl font-bold mb-4">تواصل معنا</h5>
              <p className="text-gray-400">
                للدعم الفني والاستفسارات
              </p>
              <p className="text-gray-400 mt-2">
                support@sple-exam.com
              </p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 نظام امتحانات الصيدلة. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
