/**
 * نظام البحث الشامل والروبوت الذكي لمنصة وسّط
 * يدعم البحث في جميع محتويات الموقع والإجابة على الأسئلة الشائعة
 */

class WassetSearchBot {
    constructor() {
        this.searchIndex = {};
        this.faqDatabase = {};
        this.searchHistory = [];
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        // تهيئة عناصر واجهة البحث والروبوت
        this.searchForm = document.getElementById('global-search-form');
        this.searchInput = document.getElementById('global-search-input');
        this.searchResults = document.getElementById('global-search-results');
        this.searchToggle = document.getElementById('search-toggle');
        this.chatbotToggle = document.getElementById('chatbot-toggle');
        this.chatbotPanel = document.getElementById('chatbot-panel');
        this.chatbotMessages = document.getElementById('chatbot-messages');
        this.chatbotForm = document.getElementById('chatbot-form');
        this.chatbotInput = document.getElementById('chatbot-input');
        
        // تحميل بيانات البحث والأسئلة الشائعة
        await this.loadSearchData();
        await this.loadFAQData();
        
        // تفعيل الأحداث
        this.setupEventListeners();
        
        this.isInitialized = true;
        
        // إضافة رسالة ترحيبية للروبوت
        if (this.chatbotMessages) {
            this.addBotMessage("مرحباً بك في منصة وسّط! أنا هنا لمساعدتك في الإجابة على استفساراتك حول الوساطة العقارية. كيف يمكنني مساعدتك اليوم؟");
        }
    }
    
    setupEventListeners() {
        // تفعيل نموذج البحث
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch(this.searchInput.value);
            });
        }
        
        // تفعيل زر تبديل البحث
        if (this.searchToggle) {
            this.searchToggle.addEventListener('click', () => {
                document.body.classList.toggle('search-active');
                if (document.body.classList.contains('search-active')) {
                    this.searchInput.focus();
                }
            });
        }
        
        // تفعيل زر تبديل الروبوت
        if (this.chatbotToggle) {
            this.chatbotToggle.addEventListener('click', () => {
                this.toggleChatbot();
            });
        }
        
        // تفعيل نموذج الروبوت
        if (this.chatbotForm) {
            this.chatbotForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleUserMessage();
            });
        }
        
        // إغلاق البحث عند النقر خارجه
        document.addEventListener('click', (e) => {
            if (document.body.classList.contains('search-active') && 
                !this.searchForm.contains(e.target) && 
                !this.searchToggle.contains(e.target)) {
                document.body.classList.remove('search-active');
            }
        });
        
        // البحث التلقائي أثناء الكتابة
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                if (this.searchInput.value.length > 2) {
                    this.performSearch(this.searchInput.value);
                } else if (this.searchInput.value.length === 0) {
                    this.clearSearchResults();
                }
            });
        }
    }
    
    toggleChatbot() {
        if (this.chatbotPanel) {
            this.chatbotPanel.classList.toggle('active');
            
            if (this.chatbotPanel.classList.contains('active') && this.chatbotInput) {
                this.chatbotInput.focus();
            }
        }
    }
    
    async loadSearchData() {
        try {
            // في بيئة الإنتاج، يمكن تحميل بيانات البحث من الخادم
            // هنا نقوم بإنشاء بيانات تجريبية
            
            this.searchIndex = {
                pages: [
                    {
                        id: 'home',
                        title: 'الصفحة الرئيسية',
                        url: 'index.html',
                        content: 'منصة وسّط للوسطاء العقاريين المرخصين. منصة متخصصة للوسطاء العقاريين في المملكة العربية السعودية.',
                        tags: ['الرئيسية', 'وسّط', 'منصة', 'عقارات']
                    },
                    {
                        id: 'broker-dashboard',
                        title: 'لوحة تحكم الوسيط',
                        url: 'broker-dashboard.html',
                        content: 'لوحة تحكم الوسيط العقاري في منصة وسّط. إدارة العقارات والعروض والطلبات والعملاء.',
                        tags: ['لوحة تحكم', 'وسيط', 'إدارة', 'عقارات']
                    },
                    {
                        id: 'smart-offers',
                        title: 'العروض الذكية',
                        url: 'smart-offers.html',
                        content: 'العروض العقارية الذكية في منصة وسّط. تصفية العروض حسب المنطقة والمدينة والحي ونوع العقار والميزانية والتصنيف والحالة.',
                        tags: ['عروض', 'ذكية', 'تصفية', 'عقارات']
                    },
                    {
                        id: 'property-request',
                        title: 'طلب عقاري',
                        url: 'property-request.html',
                        content: 'نموذج طلب عقاري في منصة وسّط. إنشاء طلب عقاري جديد وتحديد المتطلبات والمواصفات.',
                        tags: ['طلب', 'عقاري', 'نموذج', 'متطلبات']
                    },
                    {
                        id: 'early-adopter',
                        title: 'برنامج الانتشار المبكر',
                        url: 'early-adopter.html',
                        content: 'برنامج الانتشار المبكر في منصة وسّط. كن من الرواد واحصل على مزايا حصرية.',
                        tags: ['انتشار', 'مبكر', 'رواد', 'مزايا']
                    },
                    {
                        id: 'vision',
                        title: 'رؤيتنا',
                        url: 'vision.html',
                        content: 'رؤية منصة وسّط للوساطة العقارية. نحو قطاع عقاري متطور ومستدام يتماشى مع رؤية المملكة 2030.',
                        tags: ['رؤية', 'قطاع عقاري', 'رؤية 2030', 'ولي العهد']
                    },
                    {
                        id: 'articles',
                        title: 'المقالات',
                        url: 'articles.html',
                        content: 'مقالات متخصصة في مجال الوساطة العقارية. خدمة العملاء، الذكاء الاصطناعي، التفاوض، قوة الإقناع.',
                        tags: ['مقالات', 'خدمة العملاء', 'ذكاء اصطناعي', 'تفاوض', 'إقناع']
                    }
                ],
                articles: [
                    {
                        id: 'customer-service',
                        title: 'فن خدمة العملاء في القطاع العقاري',
                        url: 'article-customer-service.html',
                        content: 'تعرف على أهم استراتيجيات خدمة العملاء التي تميز الوسيط العقاري الناجح وتساعده على بناء قاعدة عملاء مخلصة.',
                        author: 'محمد العتيبي',
                        date: '15 مايو 2025',
                        category: 'خدمة العملاء',
                        tags: ['خدمة العملاء', 'وسيط عقاري', 'استراتيجيات', 'عملاء']
                    },
                    {
                        id: 'ai',
                        title: 'كيف يغير الذكاء الاصطناعي مستقبل الوساطة العقارية',
                        url: 'article-ai.html',
                        content: 'استكشف كيف يمكن للوسطاء العقاريين الاستفادة من تقنيات الذكاء الاصطناعي لتحسين خدماتهم وزيادة كفاءتهم.',
                        author: 'محمد العتيبي',
                        date: '10 مايو 2025',
                        category: 'الذكاء الاصطناعي',
                        tags: ['ذكاء اصطناعي', 'تقنيات', 'مستقبل', 'وساطة عقارية']
                    },
                    {
                        id: 'negotiation',
                        title: 'فنون التفاوض الناجح في الصفقات العقارية',
                        url: 'article-negotiation.html',
                        content: 'تعلم أهم استراتيجيات وتكتيكات التفاوض التي تمكنك من إتمام الصفقات العقارية بنجاح وتحقيق أفضل النتائج لعملائك.',
                        author: 'محمد العتيبي',
                        date: '5 مايو 2025',
                        category: 'التفاوض',
                        tags: ['تفاوض', 'صفقات', 'استراتيجيات', 'تكتيكات']
                    },
                    {
                        id: 'persuasion',
                        title: 'قوة الإقناع: كيف تؤثر في قرارات العملاء العقارية',
                        url: 'article-persuasion.html',
                        content: 'اكتشف الأساليب النفسية والاستراتيجيات المؤثرة التي تساعدك على إقناع العملاء واتخاذ القرارات العقارية المناسبة.',
                        author: 'محمد العتيبي',
                        date: '1 مايو 2025',
                        category: 'قوة الإقناع',
                        tags: ['إقناع', 'تأثير', 'قرارات', 'عملاء']
                    },
                    {
                        id: 'premium-service',
                        title: 'استراتيجيات خدمة العملاء المتميزة للوسطاء العقاريين',
                        url: 'article-premium-service.html',
                        content: 'تعرف على كيفية تقديم تجربة عملاء استثنائية تميزك عن منافسيك وتبني سمعة قوية في سوق العقارات.',
                        author: 'محمد العتيبي',
                        date: '25 أبريل 2025',
                        category: 'خدمة العملاء',
                        tags: ['خدمة متميزة', 'تجربة عملاء', 'سمعة', 'منافسة']
                    },
                    {
                        id: 'ai-applications',
                        title: 'تطبيقات الذكاء الاصطناعي العملية في القطاع العقاري',
                        url: 'article-ai-applications.html',
                        content: 'استعراض لأهم تطبيقات الذكاء الاصطناعي التي يمكن للوسطاء العقاريين استخدامها لتحسين أدائهم وزيادة مبيعاتهم.',
                        author: 'محمد العتيبي',
                        date: '20 أبريل 2025',
                        category: 'الذكاء الاصطناعي',
                        tags: ['تطبيقات', 'ذكاء اصطناعي', 'أداء', 'مبيعات']
                    },
                    {
                        id: 'advanced-negotiation',
                        title: 'استراتيجيات التفاوض المتقدمة للصفقات العقارية الكبرى',
                        url: 'article-advanced-negotiation.html',
                        content: 'تعمق في فنون التفاوض المتقدمة التي تحتاجها لإتمام الصفقات العقارية الكبرى والتعامل مع المستثمرين المحترفين.',
                        author: 'محمد العتيبي',
                        date: '15 أبريل 2025',
                        category: 'التفاوض',
                        tags: ['تفاوض متقدم', 'صفقات كبرى', 'مستثمرين', 'احتراف']
                    },
                    {
                        id: 'psychology-sales',
                        title: 'علم النفس في البيع العقاري: فهم دوافع العملاء',
                        url: 'article-psychology-sales.html',
                        content: 'اكتشف كيف يمكنك فهم الدوافع النفسية للعملاء واستخدامها لتحسين عملية البيع وتقديم الحلول العقارية المناسبة.',
                        author: 'محمد العتيبي',
                        date: '10 أبريل 2025',
                        category: 'قوة الإقناع',
                        tags: ['علم النفس', 'دوافع', 'بيع', 'حلول عقارية']
                    }
                ],
                properties: [
                    {
                        id: 'prop1001',
                        title: 'فيلا فاخرة في حي النرجس',
                        url: 'property-details.html?id=prop1001',
                        content: 'فيلا فاخرة حديثة البناء في حي النرجس شمال الرياض، تتميز بموقعها الاستراتيجي وتصميمها العصري الفريد.',
                        price: '2,500,000 ريال',
                        location: 'الرياض، حي النرجس',
                        type: 'فيلا',
                        tags: ['فيلا', 'الرياض', 'النرجس', 'فاخرة', 'حديثة']
                    },
                    {
                        id: 'prop1002',
                        title: 'شقة في حي الملقا',
                        url: 'property-details.html?id=prop1002',
                        content: 'شقة فاخرة في حي الملقا بالرياض، مكونة من 3 غرف نوم وصالة واسعة ومطبخ مجهز بالكامل.',
                        price: '1,200,000 ريال',
                        location: 'الرياض، حي الملقا',
                        type: 'شقة',
                        tags: ['شقة', 'الرياض', 'الملقا', '3 غرف']
                    }
                ]
            };
            
            console.log('تم تحميل بيانات البحث بنجاح');
        } catch (error) {
            console.error('خطأ في تحميل بيانات البحث:', error);
        }
    }
    
    async loadFAQData() {
        try {
            // في بيئة الإنتاج، يمكن تحميل بيانات الأسئلة الشائعة من الخادم
            // هنا نقوم بإنشاء بيانات تجريبية
            
            this.faqDatabase = {
                general: [
                    {
                        question: "ما هي منصة وسّط؟",
                        answer: "منصة وسّط هي منصة متخصصة للوسطاء العقاريين المرخصين في المملكة العربية السعودية، تهدف إلى تمكين الوسطاء من خلال توفير أدوات ذكية تساعدهم على أداء مهامهم بكفاءة عالية وتحقيق أقصى استفادة من الفرص المتاحة في السوق."
                    },
                    {
                        question: "كيف يمكنني التسجيل في منصة وسّط؟",
                        answer: "يمكنك التسجيل في منصة وسّط من خلال زيارة صفحة التسجيل وإدخال بياناتك الشخصية ورقم ترخيص الوساطة العقارية الخاص بك. بعد التحقق من صحة البيانات، سيتم تفعيل حسابك وستتمكن من الاستفادة من جميع خدمات المنصة."
                    },
                    {
                        question: "هل يمكن استخدام المنصة بدون ترخيص وساطة عقارية؟",
                        answer: "لا، منصة وسّط مخصصة للوسطاء العقاريين المرخصين فقط. يجب أن يكون لديك ترخيص ساري المفعول من الهيئة العامة للعقار للتسجيل واستخدام المنصة."
                    },
                    {
                        question: "ما هي تكلفة استخدام منصة وسّط؟",
                        answer: "تقدم منصة وسّط باقات مختلفة تناسب احتياجات الوسطاء العقاريين. هناك باقة مجانية تتيح الوصول إلى الخدمات الأساسية، وباقات مدفوعة توفر ميزات إضافية متقدمة. يمكنك الاطلاع على تفاصيل الباقات وأسعارها من خلال زيارة صفحة الباقات."
                    },
                    {
                        question: "كيف يمكنني التواصل مع فريق دعم منصة وسّط؟",
                        answer: "يمكنك التواصل مع فريق دعم منصة وسّط من خلال عدة قنوات: البريد الإلكتروني support@wasset.com، رقم الواتساب 966534394757، أو من خلال نموذج التواصل في صفحة 'اتصل بنا'."
                    }
                ],
                broker: [
                    {
                        question: "ما هي ميزات لوحة تحكم الوسيط في منصة وسّط؟",
                        answer: "توفر لوحة تحكم الوسيط في منصة وسّط العديد من الميزات، منها: إدارة العقارات والعروض، متابعة الطلبات العقارية، إدارة العملاء والمالكين، تلقي التنبيهات الذكية، الوصول إلى تقارير وإحصائيات الأداء، وغيرها من الأدوات التي تساعد الوسيط على إدارة أعماله بكفاءة."
                    },
                    {
                        question: "كيف يمكنني إضافة عقار جديد في المنصة؟",
                        answer: "يمكنك إضافة عقار جديد من خلال لوحة تحكم الوسيط، بالنقر على زر 'إضافة عقار جديد' وتعبئة النموذج بالمعلومات المطلوبة مثل نوع العقار، الموقع، المساحة، السعر، المواصفات، وإرفاق الصور والمستندات اللازمة. بعد مراجعة المعلومات والتأكد من صحتها، يمكنك نشر العقار ليظهر في قوائم البحث."
                    },
                    {
                        question: "كيف تعمل ميزة العروض الذكية في منصة وسّط؟",
                        answer: "ميزة العروض الذكية تتيح للوسيط تحديد العروض التي يرغب باستلامها وفقاً لمعايير محددة مثل المنطقة، المدينة، الحي، نوع العقار، الميزانية، التصنيف، والحالة. يقوم نظام الذكاء الاصطناعي بتحليل هذه المعايير وتوفير عروض مطابقة، مع إرسال تنبيهات فورية عند توفر عروض جدي
(Content truncated due to size limit. Use line ranges to read in chunks)