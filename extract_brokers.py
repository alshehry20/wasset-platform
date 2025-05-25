import pandas as pd
import json
import os

# قراءة ملف الإكسل
excel_path = "/home/ubuntu/upload/داتا الوسطاء العقاريين بالمملكة .xlsx"
output_path = "/home/ubuntu/wasset_website/brokers_data.js"

try:
    # قراءة ملف الإكسل
    df = pd.read_excel(excel_path)
    
    # طباعة أسماء الأعمدة للتحقق
    print("أسماء الأعمدة في الملف:")
    print(df.columns.tolist())
    
    # طباعة عدد الصفوف
    print(f"عدد الوسطاء في الملف: {len(df)}")
    
    # طباعة بعض البيانات للتحقق
    print("\nعينة من البيانات:")
    print(df.head())
    
    # تحضير قائمة الوسطاء
    brokers = []
    
    # استخراج البيانات من كل صف
    for index, row in df.iterrows():
        broker = {}
        
        # محاولة استخراج البيانات الأساسية
        try:
            # التحقق من نوع الوسيط (فرد أو منشأة)
            broker_type = None
            broker_name = None
            phone = None
            
            # محاولة استخراج الاسم
            for col in df.columns:
                if 'اسم' in col.lower() and pd.notna(row[col]):
                    broker_name = str(row[col]).strip()
                    break
            
            # محاولة استخراج رقم الجوال
            for col in df.columns:
                if 'جوال' in col.lower() or 'هاتف' in col.lower() or 'رقم' in col.lower():
                    if pd.notna(row[col]):
                        phone = str(row[col]).strip()
                        # تنظيف رقم الهاتف
                        phone = ''.join(filter(str.isdigit, phone))
                        break
            
            # محاولة تحديد نوع الوسيط
            for col in df.columns:
                if 'نوع' in col.lower() and pd.notna(row[col]):
                    type_value = str(row[col]).strip().lower()
                    if 'فرد' in type_value or 'شخص' in type_value:
                        broker_type = 'individual'
                    elif 'منشأة' in type_value or 'شركة' in type_value or 'مؤسسة' in type_value:
                        broker_type = 'company'
                    break
            
            # إذا لم يتم تحديد النوع، نحاول تخمينه من الاسم
            if broker_type is None and broker_name:
                if ' ' in broker_name and len(broker_name.split()) <= 4:
                    broker_type = 'individual'  # نفترض أنه فرد إذا كان الاسم يتكون من كلمتين إلى أربع كلمات
                else:
                    broker_type = 'company'  # نفترض أنه منشأة في الحالات الأخرى
            
            # إذا تم العثور على الاسم ورقم الهاتف
            if broker_name and phone:
                broker['name'] = broker_name
                broker['phone'] = phone
                broker['type'] = broker_type
                
                # تحديد اسم المستخدم وكلمة المرور حسب النوع
                if broker_type == 'individual':
                    # للأفراد: الاسم الأول والأخير
                    name_parts = broker_name.split()
                    if len(name_parts) >= 2:
                        broker['username'] = name_parts[0] + ' ' + name_parts[-1]
                    else:
                        broker['username'] = broker_name
                else:
                    # للمنشآت: اسم المنشأة كاملاً
                    broker['username'] = broker_name
                
                # كلمة المرور هي رقم الجوال في كلتا الحالتين
                broker['password'] = phone
                
                # إضافة الوسيط إلى القائمة
                brokers.append(broker)
        
        except Exception as e:
            print(f"خطأ في معالجة الصف {index}: {e}")
    
    # طباعة عدد الوسطاء المستخرجين
    print(f"\nتم استخراج بيانات {len(brokers)} وسيط بنجاح")
    
    # تحويل البيانات إلى تنسيق JavaScript
    js_content = f"const brokersData = {json.dumps(brokers, ensure_ascii=False, indent=2)};"
    
    # إنشاء مجلد الموقع إذا لم يكن موجوداً
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # حفظ البيانات في ملف JavaScript
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    
    print(f"\nتم حفظ بيانات الوسطاء في الملف: {output_path}")
    
except Exception as e:
    print(f"حدث خطأ أثناء معالجة ملف الإكسل: {e}")
