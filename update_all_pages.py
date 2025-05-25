import os
import re

# قائمة بجميع ملفات HTML في المجلد
html_files = [
    '/home/ubuntu/wasset_website_final/login.html',
    '/home/ubuntu/wasset_website_final/index.html',
    '/home/ubuntu/wasset_website_final/articles.html',
    '/home/ubuntu/wasset_website_final/vision.html',
    '/home/ubuntu/wasset_website_final/ai-assistant.html'
]

# إضافة ملفات CSS و JavaScript الجديدة إلى جميع الصفحات
for html_file in html_files:
    if os.path.exists(html_file):
        with open(html_file, 'r', encoding='utf-8') as file:
            content = file.read()
            
        # التحقق مما إذا كانت الملفات مضافة بالفعل
        responsive_css_exists = 'responsive_fixes.css' in content
        performance_js_exists = 'performance_optimizations.js' in content
        
        # إضافة ملف CSS للاستجابة إذا لم يكن موجوداً
        if not responsive_css_exists:
            head_end_tag = '</head>'
            css_link = '<link rel="stylesheet" href="responsive_fixes.css">\n    '
            content = content.replace(head_end_tag, css_link + head_end_tag)
        
        # إضافة ملف JavaScript لتحسين الأداء إذا لم يكن موجوداً
        if not performance_js_exists:
            body_end_tag = '</body>'
            js_script = '<script src="performance_optimizations.js"></script>\n    '
            content = content.replace(body_end_tag, js_script + body_end_tag)
        
        # إضافة فئات CSS للعناصر الرئيسية لتحسين الاستجابة
        # إضافة فئة container للحاويات الرئيسية
        content = re.sub(r'<div class="([^"]*main-container[^"]*)"', r'<div class="\1 container"', content)
        content = re.sub(r'<section class="([^"]*)"', r'<section class="\1 section"', content)
        
        # إضافة فئات للصور لتحسين الاستجابة
        content = re.sub(r'<img ([^>]*)>', r'<img class="img-fluid" \1>', content)
        
        # إضافة فئات للأزرار لتحسين التفاعل
        content = re.sub(r'<button ([^>]*)>', r'<button class="btn interactive" \1>', content)
        
        # إضافة فئات للبطاقات لتحسين الاستجابة
        content = re.sub(r'<div class="([^"]*card[^"]*)"', r'<div class="\1 card"', content)
        
        # إضافة فئات للعناصر المتحركة
        content = re.sub(r'<div class="([^"]*feature[^"]*)"', r'<div class="\1 animate fade-in"', content)
        
        # إضافة meta tag للتوافق مع الأجهزة المحمولة إذا لم يكن موجوداً
        if '<meta name="viewport"' not in content:
            head_tag = '<head>'
            viewport_meta = '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">\n    '
            content = content.replace(head_tag, head_tag + viewport_meta)
        
        # إضافة meta tag للتوافق مع المتصفحات القديمة إذا لم يكن موجوداً
        if '<meta http-equiv="X-UA-Compatible"' not in content:
            head_tag = '<head>'
            compat_meta = '<meta http-equiv="X-UA-Compatible" content="IE=edge">\n    '
            content = content.replace(head_tag, head_tag + compat_meta)
        
        # إضافة meta tag للتوافق مع الأجهزة المحمولة Apple إذا لم يكن موجوداً
        if '<meta name="apple-mobile-web-app-capable"' not in content:
            head_tag = '<head>'
            apple_meta = '<meta name="apple-mobile-web-app-capable" content="yes">\n    '
            content = content.replace(head_tag, head_tag + apple_meta)
        
        # إضافة meta tag للتوافق مع الأجهزة المحمولة Microsoft إذا لم يكن موجوداً
        if '<meta name="msapplication-TileColor"' not in content:
            head_tag = '<head>'
            ms_meta = '<meta name="msapplication-TileColor" content="#1e5f74">\n    '
            content = content.replace(head_tag, head_tag + ms_meta)
        
        # إضافة meta tag للتوافق مع الأجهزة المحمولة Apple إذا لم يكن موجوداً
        if '<meta name="theme-color"' not in content:
            head_tag = '<head>'
            theme_meta = '<meta name="theme-color" content="#1e5f74">\n    '
            content = content.replace(head_tag, head_tag + theme_meta)
        
        # إضافة فئة للجسم لتحسين التحميل
        if '<body>' in content:
            content = content.replace('<body>', '<body class="page-loading">')
        
        # إضافة زر العودة إلى الأعلى إذا لم يكن موجوداً
        if 'id="back-to-top"' not in content:
            body_end_tag = '</body>'
            back_to_top = '<button id="back-to-top" class="back-to-top" aria-label="العودة إلى الأعلى"><i class="fas fa-arrow-up"></i></button>\n    '
            content = content.replace(body_end_tag, back_to_top + body_end_tag)
        
        # حفظ التغييرات
        with open(html_file, 'w', encoding='utf-8') as file:
            file.write(content)
        
        print(f"تم تحديث الملف: {html_file}")

print("تم تحديث جميع الصفحات بنجاح!")
