// سكريبت معالجة بيانات الوسطاء العقاريين من ملفات Excel إلى JSON

const fs = require('fs');
const xlsx = require('xlsx');
const path = require('path');

// تحديد مسارات الملفات
const excelFilePath = path.join(__dirname, 'الوسطاء العقاريين بالمملكة.xlsx');
const outputJsonPath = path.join(__dirname, 'brokers_data.json');
const outputJsPath = path.join(__dirname, 'brokers_data.js');

// دالة لتحويل ملف Excel إلى JSON
function convertExcelToJson() {
    try {
        console.log('بدء معالجة ملف Excel...');
        
        // قراءة ملف Excel
        const workbook = xlsx.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // تحويل ورقة العمل إلى مصفوفة من الكائنات
        const rawData = xlsx.utils.sheet_to_json(worksheet);
        
        console.log(`تم قراءة ${rawData.length} سجل من ملف Excel.`);
        
        // معالجة البيانات وتنظيفها
        const brokers = processData(rawData);
        
        // حفظ البيانات كملف JSON
        fs.writeFileSync(outputJsonPath, JSON.stringify(brokers, null, 2), 'utf8');
        console.log(`تم حفظ البيانات في ${outputJsonPath}`);
        
        // إنشاء ملف JavaScript
        const jsContent = `// بيانات الوسطاء العقاريين المرخصين
const brokersData = ${JSON.stringify(brokers, null, 2)};

// دالة للبحث عن وسيط باستخدام اسم المستخدم وكلمة المرور
function validateBroker(username, password) {
    return brokersData.find(broker => {
        // للوسيط الفرد: اسم المستخدم هو الاسم الأول والأخير، وكلمة المرور هي رقم الجوال
        if (broker.type === 'individual') {
            return (broker.fullName === username && broker.mobile === password);
        }
        // للمنشأة العقارية: اسم المستخدم هو اسم المنشأة، وكلمة المرور هي رقم الجوال
        else if (broker.type === 'company') {
            return (broker.companyName === username && broker.mobile === password);
        }
        return false;
    });
}

// دالة للحصول على جميع الوسطاء في منطقة معينة
function getBrokersByRegion(region) {
    return brokersData.filter(broker => broker.region === region);
}

// دالة للحصول على الوسطاء حسب نوعهم (فرد أو منشأة)
function getBrokersByType(type) {
    return brokersData.filter(broker => broker.type === type);
}

// دالة للبحث عن الوسطاء باستخدام كلمة مفتاحية
function searchBrokers(keyword) {
    const searchTerm = keyword.toLowerCase();
    return brokersData.filter(broker => {
        return (
            (broker.fullName && broker.fullName.toLowerCase().includes(searchTerm)) ||
            (broker.companyName && broker.companyName.toLowerCase().includes(searchTerm)) ||
            (broker.region && broker.region.toLowerCase().includes(searchTerm)) ||
            (broker.city && broker.city.toLowerCase().includes(searchTerm))
        );
    });
}`;
        
        fs.writeFileSync(outputJsPath, jsContent, 'utf8');
        console.log(`تم إنشاء ملف JavaScript في ${outputJsPath}`);
        
        return {
            success: true,
            message: 'تم معالجة البيانات بنجاح',
            count: brokers.length
        };
    } catch (error) {
        console.error('حدث خطأ أثناء معالجة الملف:', error);
        return {
            success: false,
            message: `حدث خطأ أثناء المعالجة: ${error.message}`
        };
    }
}

// دالة لمعالجة وتنظيف البيانات
function processData(rawData) {
    console.log('بدء معالجة وتنظيف البيانات...');
    
    // تحويل أسماء الحقول إلى تنسيق موحد
    const brokers = rawData.map((record, index) => {
        // تحديد نوع الوسيط (فرد أو منشأة)
        const isCompany = record['نوع الوسيط'] === 'منشأة عقارية' || 
                         record['نوع الترخيص'] === 'منشأة' ||
                         record['اسم المنشأة'] !== undefined;
        
        // إنشاء كائن موحد لكل وسيط
        const broker = {
            id: index + 1,
            type: isCompany ? 'company' : 'individual',
            licenseNumber: record['رقم الترخيص'] || record['رقم رخصة فال'] || '',
            licenseDate: record['تاريخ الترخيص'] || '',
            licenseExpiry: record['تاريخ انتهاء الترخيص'] || '',
            region: record['المنطقة'] || '',
            city: record['المدينة'] || '',
            mobile: record['رقم الجوال'] || record['الجوال'] || '',
            email: record['البريد الإلكتروني'] || '',
            status: record['حالة الترخيص'] || 'نشط',
            points: Math.floor(Math.random() * 1000), // نقاط عشوائية للتجربة
            deals: Math.floor(Math.random() * 50), // عدد الصفقات عشوائي للتجربة
            rating: (Math.random() * 2 + 3).toFixed(1), // تقييم عشوائي بين 3 و 5
            joinDate: generateRandomDate(2020, 2023)
        };
        
        // إضافة حقول خاصة بالوسيط الفرد
        if (!isCompany) {
            broker.fullName = record['اسم الوسيط'] || record['الاسم'] || '';
            broker.firstName = broker.fullName.split(' ')[0] || '';
            broker.lastName = broker.fullName.split(' ').slice(-1)[0] || '';
            broker.idNumber = record['رقم الهوية'] || '';
        } 
        // إضافة حقول خاصة بالمنشأة العقارية
        else {
            broker.companyName = record['اسم المنشأة'] || record['اسم الشركة'] || '';
            broker.commercialRegister = record['رقم السجل التجاري'] || '';
            broker.managerName = record['اسم المدير'] || '';
        }
        
        return broker;
    });
    
    console.log(`تم معالجة ${brokers.length} سجل.`);
    
    // إزالة السجلات المكررة
    const uniqueBrokers = removeDuplicates(brokers);
    console.log(`تم إزالة السجلات المكررة. العدد النهائي: ${uniqueBrokers.length}`);
    
    return uniqueBrokers;
}

// دالة لإزالة السجلات المكررة
function removeDuplicates(brokers) {
    const uniqueMap = new Map();
    
    brokers.forEach(broker => {
        const key = broker.licenseNumber || broker.mobile;
        if (!uniqueMap.has(key) || broker.licenseNumber) {
            uniqueMap.set(key, broker);
        }
    });
    
    return Array.from(uniqueMap.values());
}

// دالة لإنشاء تاريخ عشوائي
function generateRandomDate(startYear, endYear) {
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

// تنفيذ التحويل
const result = convertExcelToJson();
console.log(result);

module.exports = {
    convertExcelToJson
};
