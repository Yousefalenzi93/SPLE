#!/usr/bin/env node

/**
 * Deployment Readiness Check Script
 * سكريبت فحص جاهزية النشر
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 فحص جاهزية المشروع للنشر...\n');

const checks = [];

// Check 1: Package.json dependencies
function checkPackageJson() {
  try {
    const packagePath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredDeps = ['next', 'react', 'react-dom', 'firebase', 'tailwindcss'];
    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
    );
    
    if (missingDeps.length === 0) {
      checks.push({ name: 'Package Dependencies', status: '✅', message: 'جميع التبعيات موجودة' });
    } else {
      checks.push({ 
        name: 'Package Dependencies', 
        status: '❌', 
        message: `التبعيات المفقودة: ${missingDeps.join(', ')}` 
      });
    }
  } catch (error) {
    checks.push({ name: 'Package Dependencies', status: '❌', message: 'خطأ في قراءة package.json' });
  }
}

// Check 2: Next.js configuration
function checkNextConfig() {
  try {
    const configPath = path.join(process.cwd(), 'next.config.js');
    if (fs.existsSync(configPath)) {
      const configContent = fs.readFileSync(configPath, 'utf8');
      
      if (configContent.includes('output: \'export\'')) {
        checks.push({ name: 'Next.js Config', status: '✅', message: 'إعدادات Next.js صحيحة للنشر الثابت' });
      } else {
        checks.push({ name: 'Next.js Config', status: '⚠️', message: 'تحقق من إعدادات output في next.config.js' });
      }
    } else {
      checks.push({ name: 'Next.js Config', status: '❌', message: 'ملف next.config.js غير موجود' });
    }
  } catch (error) {
    checks.push({ name: 'Next.js Config', status: '❌', message: 'خطأ في قراءة next.config.js' });
  }
}

// Check 3: Environment variables
function checkEnvVariables() {
  const requiredEnvVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
    'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
    'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
    'NEXT_PUBLIC_FIREBASE_APP_ID'
  ];

  // Check if running in production environment (Vercel/Netlify)
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.NETLIFY;

  if (isProduction) {
    // In production, check environment variables directly
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

    if (missingVars.length === 0) {
      checks.push({ name: 'Environment Variables', status: '✅', message: 'جميع متغيرات البيئة موجودة في بيئة الإنتاج' });
    } else {
      checks.push({
        name: 'Environment Variables',
        status: '❌',
        message: `المتغيرات المفقودة في بيئة الإنتاج: ${missingVars.join(', ')}`
      });
    }
  } else {
    // In development, check .env.local file
    const envPath = path.join(process.cwd(), '.env.local');

    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const missingVars = requiredEnvVars.filter(varName =>
        !envContent.includes(varName)
      );

      if (missingVars.length === 0) {
        checks.push({ name: 'Environment Variables', status: '✅', message: 'جميع متغيرات البيئة موجودة في .env.local' });
      } else {
        checks.push({
          name: 'Environment Variables',
          status: '❌',
          message: `المتغيرات المفقودة في .env.local: ${missingVars.join(', ')}`
        });
      }
    } else {
      checks.push({ name: 'Environment Variables', status: '⚠️', message: 'ملف .env.local غير موجود (مطلوب للتطوير المحلي فقط)' });
    }
  }
}

// Check 4: Tailwind configuration
function checkTailwindConfig() {
  const tailwindPath = path.join(process.cwd(), 'tailwind.config.js');
  const postcssPath = path.join(process.cwd(), 'postcss.config.js');
  
  if (fs.existsSync(tailwindPath) && fs.existsSync(postcssPath)) {
    checks.push({ name: 'Tailwind CSS', status: '✅', message: 'إعدادات Tailwind CSS موجودة' });
  } else {
    checks.push({ name: 'Tailwind CSS', status: '❌', message: 'ملفات إعدادات Tailwind مفقودة' });
  }
}

// Check 5: TypeScript configuration
function checkTypeScriptConfig() {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
      
      if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths && tsconfig.compilerOptions.paths['@/*']) {
        checks.push({ name: 'TypeScript Config', status: '✅', message: 'إعدادات TypeScript صحيحة' });
      } else {
        checks.push({ name: 'TypeScript Config', status: '⚠️', message: 'تحقق من إعدادات المسارات في tsconfig.json' });
      }
    } catch (error) {
      checks.push({ name: 'TypeScript Config', status: '❌', message: 'خطأ في قراءة tsconfig.json' });
    }
  } else {
    checks.push({ name: 'TypeScript Config', status: '❌', message: 'ملف tsconfig.json غير موجود' });
  }
}

// Check 6: Netlify configuration
function checkNetlifyConfig() {
  const netlifyPath = path.join(process.cwd(), 'netlify.toml');
  
  if (fs.existsSync(netlifyPath)) {
    const netlifyContent = fs.readFileSync(netlifyPath, 'utf8');
    
    if (netlifyContent.includes('publish = "out"') && netlifyContent.includes('npm run build')) {
      checks.push({ name: 'Netlify Config', status: '✅', message: 'إعدادات Netlify صحيحة' });
    } else {
      checks.push({ name: 'Netlify Config', status: '⚠️', message: 'تحقق من إعدادات البناء في netlify.toml' });
    }
  } else {
    checks.push({ name: 'Netlify Config', status: '❌', message: 'ملف netlify.toml غير موجود' });
  }
}

// Check 7: Required source files
function checkSourceFiles() {
  const requiredFiles = [
    'src/lib/firebase.ts',
    'src/contexts/AuthContext.tsx',
    'src/types/index.ts',
    'src/app/layout.tsx',
    'src/app/page.tsx'
  ];
  
  const missingFiles = requiredFiles.filter(file => 
    !fs.existsSync(path.join(process.cwd(), file))
  );
  
  if (missingFiles.length === 0) {
    checks.push({ name: 'Source Files', status: '✅', message: 'جميع الملفات المطلوبة موجودة' });
  } else {
    checks.push({ 
      name: 'Source Files', 
      status: '❌', 
      message: `الملفات المفقودة: ${missingFiles.join(', ')}` 
    });
  }
}

// Run all checks
function runAllChecks() {
  checkPackageJson();
  checkNextConfig();
  checkEnvVariables();
  checkTailwindConfig();
  checkTypeScriptConfig();
  checkNetlifyConfig();
  checkSourceFiles();
  
  // Display results
  console.log('📋 نتائج الفحص:\n');
  
  checks.forEach((check, index) => {
    console.log(`${index + 1}. ${check.status} ${check.name}`);
    console.log(`   ${check.message}\n`);
  });
  
  // Summary
  const passed = checks.filter(c => c.status === '✅').length;
  const warnings = checks.filter(c => c.status === '⚠️').length;
  const failed = checks.filter(c => c.status === '❌').length;
  
  console.log('📊 الملخص:');
  console.log(`✅ نجح: ${passed}`);
  console.log(`⚠️ تحذيرات: ${warnings}`);
  console.log(`❌ فشل: ${failed}\n`);
  
  // Check if we're in production environment
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL || process.env.NETLIFY;

  if (failed === 0 && warnings === 0) {
    console.log('🎉 المشروع جاهز للنشر!');
    console.log('\nالخطوات التالية:');
    console.log('1. تشغيل: npm run build');
    console.log('2. رفع الكود إلى GitHub');
    console.log('3. نشر على Netlify/Vercel');
    console.log('4. إضافة متغيرات البيئة في منصة النشر');
    console.log('5. إعداد Firebase Console');
  } else if (failed === 0 || (failed === 1 && warnings === 0 && isProduction)) {
    console.log('⚠️ المشروع جاهز للنشر.');
    if (isProduction) {
      console.log('تشغيل في بيئة الإنتاج - التحذيرات مقبولة.');
    } else {
      console.log('راجع التحذيرات أعلاه قبل النشر.');
    }
  } else {
    console.log('❌ المشروع غير جاهز للنشر.');
    console.log('يرجى إصلاح المشاكل أعلاه أولاً.');
    if (!isProduction) {
      process.exit(1);
    }
  }
}

// Run the checks
runAllChecks();
