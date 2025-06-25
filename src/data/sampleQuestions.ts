import type { Question, QuestionDomain, QuestionDifficulty } from '@/types'

// Sample questions for the Saudi pharmacy exam system
export const sampleQuestions: Omit<Question, 'id' | 'createdAt'>[] = [
  // Biomedical Sciences (10%)
  {
    content: 'ما هو الإنزيم المسؤول عن تحويل الأنجيوتنسين I إلى الأنجيوتنسين II؟',
    options: [
      'إنزيم الرينين (Renin)',
      'إنزيم محول الأنجيوتنسين (ACE)',
      'إنزيم الأنجيوتنسيناز (Angiotensinase)',
      'إنزيم الكايمز (Chymase)'
    ],
    correctAnswer: 1,
    explanation: 'إنزيم محول الأنجيوتنسين (ACE) هو المسؤول عن تحويل الأنجيوتنسين I إلى الأنجيوتنسين II النشط، والذي يلعب دوراً مهماً في تنظيم ضغط الدم.',
    domain: 'biomedical' as QuestionDomain,
    difficulty: 'medium' as QuestionDifficulty,
    references: ['Goodman & Gilman\'s Pharmacology', 'Katzung Basic & Clinical Pharmacology'],
    createdBy: 'admin',
    approved: true
  },
  {
    content: 'أي من البكتيريا التالية تعتبر من البكتيريا موجبة الجرام؟',
    options: [
      'الإشريكية القولونية (E. coli)',
      'المكورات العنقودية الذهبية (S. aureus)',
      'الزائفة الزنجارية (P. aeruginosa)',
      'السالمونيلا (Salmonella)'
    ],
    correctAnswer: 1,
    explanation: 'المكورات العنقودية الذهبية (Staphylococcus aureus) هي من البكتيريا موجبة الجرام، بينما الباقي من البكتيريا سالبة الجرام.',
    domain: 'biomedical' as QuestionDomain,
    difficulty: 'easy' as QuestionDifficulty,
    references: ['Medical Microbiology', 'Jawetz Medical Microbiology'],
    createdBy: 'admin',
    approved: true
  },

  // Pharmaceutical Sciences (35%)
  {
    content: 'ما هو الهدف الرئيسي من إضافة مواد مساعدة (Excipients) في تركيب الأقراص؟',
    options: [
      'زيادة الفعالية الدوائية',
      'تحسين الطعم والرائحة فقط',
      'تسهيل عملية التصنيع وتحسين خصائص القرص',
      'تقليل التكلفة فقط'
    ],
    correctAnswer: 2,
    explanation: 'المواد المساعدة تُضاف لتسهيل عملية التصنيع، تحسين التدفق، الربط، التفكك، وضمان استقرار وجودة المنتج النهائي.',
    domain: 'pharmaceutical' as QuestionDomain,
    difficulty: 'medium' as QuestionDifficulty,
    references: ['Pharmaceutics: The Science of Dosage Form Design', 'Remington\'s Pharmaceutical Sciences'],
    createdBy: 'admin',
    approved: true
  },
  {
    content: 'أي من الطرق التالية تُستخدم لتحسين ذوبانية الأدوية ضعيفة الذوبان؟',
    options: [
      'تقليل حجم الجسيمات (Micronization)',
      'تكوين المعقدات (Complexation)',
      'استخدام المذيبات المشتركة (Co-solvency)',
      'جميع ما سبق'
    ],
    correctAnswer: 3,
    explanation: 'جميع الطرق المذكورة تُستخدم لتحسين ذوبانية الأدوية: تقليل حجم الجسيمات يزيد المساحة السطحية، والمعقدات والمذيبات المشتركة تحسن الذوبانية.',
    domain: 'pharmaceutical' as QuestionDomain,
    difficulty: 'hard' as QuestionDifficulty,
    references: ['Physical Pharmacy', 'Pharmaceutical Preformulation and Formulation'],
    createdBy: 'admin',
    approved: true
  },
  {
    content: 'ما هو الفرق الرئيسي بين الأدوية الجنيسة (Generic) والأدوية المرجعية (Brand)?',
    options: [
      'الأدوية الجنيسة أقل فعالية',
      'الأدوية الجنيسة تحتوي على مواد فعالة مختلفة',
      'الأدوية الجنيسة لها نفس المادة الفعالة ولكن قد تختلف في المواد المساعدة',
      'لا يوجد فرق بينهما'
    ],
    correctAnswer: 2,
    explanation: 'الأدوية الجنيسة تحتوي على نفس المادة الفعالة بنفس الكمية والشكل الصيدلاني، ولكن قد تختلف في المواد المساعدة والشركة المصنعة.',
    domain: 'pharmaceutical' as QuestionDomain,
    difficulty: 'easy' as QuestionDifficulty,
    references: ['FDA Guidelines', 'SFDA Regulations'],
    createdBy: 'admin',
    approved: true
  },

  // Social/Behavioral/Administrative Sciences (20%)
  {
    content: 'حسب لوائح الهيئة العامة للغذاء والدواء السعودية، ما هي المدة القصوى لصرف الوصفة الطبية للأدوية المخدرة؟',
    options: [
      '7 أيام',
      '14 يوم',
      '30 يوم',
      '90 يوم'
    ],
    correctAnswer: 0,
    explanation: 'حسب لوائح الهيئة العامة للغذاء والدواء السعودية، يجب صرف الأدوية المخدرة خلال 7 أيام من تاريخ كتابة الوصفة الطبية.',
    domain: 'social' as QuestionDomain,
    difficulty: 'medium' as QuestionDifficulty,
    references: ['SFDA Regulations', 'Saudi Pharmacy Practice Guidelines'],
    createdBy: 'admin',
    approved: true
  },
  {
    content: 'ما هو المبدأ الأخلاقي الذي يتطلب من الصيدلي عدم إلحاق الضرر بالمريض؟',
    options: [
      'مبدأ الاستقلالية (Autonomy)',
      'مبدأ عدم الإضرار (Non-maleficence)',
      'مبدأ العدالة (Justice)',
      'مبدأ الإحسان (Beneficence)'
    ],
    correctAnswer: 1,
    explanation: 'مبدأ عدم الإضرار (Non-maleficence) هو المبدأ الأخلاقي الذي يتطلب من مقدمي الرعاية الصحية عدم إلحاق الضرر بالمرضى.',
    domain: 'social' as QuestionDomain,
    difficulty: 'easy' as QuestionDifficulty,
    references: ['Pharmacy Ethics', 'Principles of Biomedical Ethics'],
    createdBy: 'admin',
    approved: true
  },

  // Clinical Sciences (35%)
  {
    content: 'مريض يتناول الوارفارين (Warfarin) ويحتاج لبدء علاج بالمضاد الحيوي. أي من المضادات الحيوية التالية يتطلب مراقبة دقيقة لـ INR؟',
    options: [
      'الأموكسيسيلين (Amoxicillin)',
      'السيفالكسين (Cephalexin)',
      'السيبروفلوكساسين (Ciprofloxacin)',
      'الكلينداميسين (Clindamycin)'
    ],
    correctAnswer: 2,
    explanation: 'السيبروفلوكساسين يثبط إنزيمات الكبد CYP450 مما يزيد من تأثير الوارفارين ويتطلب مراقبة دقيقة لـ INR لتجنب النزيف.',
    domain: 'clinical' as QuestionDomain,
    difficulty: 'hard' as QuestionDifficulty,
    references: ['Clinical Pharmacology', 'Drug Interactions Handbook'],
    createdBy: 'admin',
    approved: true
  },
  {
    content: 'ما هي الجرعة الأولية الموصى بها من الأسبرين للوقاية الثانوية من أمراض القلب والأوعية الدموية؟',
    options: [
      '81 ملغ يومياً',
      '325 ملغ يومياً',
      '650 ملغ يومياً',
      '1000 ملغ يومياً'
    ],
    correctAnswer: 0,
    explanation: 'الجرعة الموصى بها من الأسبرين للوقاية الثانوية من أمراض القلب والأوعية الدموية هي 75-100 ملغ يومياً، وعادة ما تُستخدم جرعة 81 ملغ.',
    domain: 'clinical' as QuestionDomain,
    difficulty: 'medium' as QuestionDifficulty,
    references: ['ACC/AHA Guidelines', 'Clinical Cardiology Guidelines'],
    createdBy: 'admin',
    approved: true
  },
  {
    content: 'مريضة حامل في الشهر الثالث تعاني من التهاب المسالك البولية. أي من المضادات الحيوية التالية يُعتبر الأكثر أماناً؟',
    options: [
      'التتراسايكلين (Tetracycline)',
      'السيبروفلوكساسين (Ciprofloxacin)',
      'الأموكسيسيلين (Amoxicillin)',
      'الكلورامفينيكول (Chloramphenicol)'
    ],
    correctAnswer: 2,
    explanation: 'الأموكسيسيلين من فئة B في الحمل ويُعتبر آمناً، بينما الخيارات الأخرى قد تسبب مضاعفات للجنين.',
    domain: 'clinical' as QuestionDomain,
    difficulty: 'medium' as QuestionDifficulty,
    references: ['Pregnancy Drug Safety', 'Clinical Obstetrics Guidelines'],
    createdBy: 'admin',
    approved: true
  },
  {
    content: 'مريض مصاب بداء السكري النوع الثاني ومستوى HbA1c = 8.5%. أي من الأدوية التالية يُفضل إضافته للميتفورمين؟',
    options: [
      'السلفونيل يوريا (Sulfonylurea)',
      'مثبطات DPP-4',
      'مثبطات SGLT-2',
      'جميع ما سبق خيارات مناسبة'
    ],
    correctAnswer: 3,
    explanation: 'جميع الخيارات المذكورة تُعتبر خيارات مناسبة لإضافتها للميتفورمين حسب الإرشادات الحديثة، ويعتمد الاختيار على حالة المريض الفردية.',
    domain: 'clinical' as QuestionDomain,
    difficulty: 'hard' as QuestionDifficulty,
    references: ['ADA Diabetes Guidelines', 'Clinical Diabetes Management'],
    createdBy: 'admin',
    approved: true
  }
]

// Function to get questions by domain
export const getQuestionsByDomain = (domain: QuestionDomain) => {
  return sampleQuestions.filter(q => q.domain === domain)
}

// Function to get questions by difficulty
export const getQuestionsByDifficulty = (difficulty: QuestionDifficulty) => {
  return sampleQuestions.filter(q => q.difficulty === difficulty)
}

// Function to get random questions
export const getRandomSampleQuestions = (count: number, domain?: QuestionDomain) => {
  let questions = domain ? getQuestionsByDomain(domain) : sampleQuestions
  
  // Shuffle array
  questions = questions.sort(() => 0.5 - Math.random())
  
  return questions.slice(0, Math.min(count, questions.length))
}
