/* سكريبت جافاسكريبت لتحسين أداء منصة "وسّط" للوسطاء العقاريين المرخصين */

// تهيئة المتغيرات العامة
const wasset = {
    init: function() {
        this.setupEventListeners();
        this.setupAnimations();
        this.setupForms();
        this.setupTabs();
        this.setupMobileMenu();
        this.setupLazyLoading();
        this.setupBrokerFeatures();
    },

    // إعداد مستمعي الأحداث
    setupEventListeners: function() {
        document.addEventListener('DOMContentLoaded', function() {
            console.log('منصة وسّط جاهزة!');
            
            // تفعيل التمرير السلس للروابط الداخلية
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        window.scrollTo({
                            top: target.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // تفعيل أزرار المشاركة
            const shareButtons = document.querySelectorAll('.share-button');
            if (shareButtons.length > 0) {
                shareButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const url = this.dataset.url || window.location.href;
                        const title = this.dataset.title || document.title;
                        
                        if (navigator.share) {
                            navigator.share({
                                title: title,
                                url: url
                            }).catch(console.error);
                        } else {
                            // نسخ الرابط إلى الحافظة
                            const tempInput = document.createElement('input');
                            document.body.appendChild(tempInput);
                            tempInput.value = url;
                            tempInput.select();
                            document.execCommand('copy');
                            document.body.removeChild(tempInput);
                            
                            // إظهار رسالة تأكيد
                            const notification = document.createElement('div');
                            notification.className = 'notification';
                            notification.textContent = 'تم نسخ الرابط!';
                            document.body.appendChild(notification);
                            
                            setTimeout(() => {
                                notification.classList.add('show');
                            }, 10);
                            
                            setTimeout(() => {
                                notification.classList.remove('show');
                                setTimeout(() => {
                                    document.body.removeChild(notification);
                                }, 300);
                            }, 2000);
                        }
                    });
                });
            }
        });

        // تفعيل التمرير للأعلى
        const scrollTopButton = document.querySelector('.scroll-top');
        if (scrollTopButton) {
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 300) {
                    scrollTopButton.classList.add('show');
                } else {
                    scrollTopButton.classList.remove('show');
                }
            });
            
            scrollTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    },

    // إعداد الرسوم المتحركة
    setupAnimations: function() {
        // تفعيل الرسوم المتحركة عند التمرير
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        if (animatedElements.length > 0) {
            const animateOnScroll = function() {
                animatedElements.forEach(element => {
                    const elementTop = element.getBoundingClientRect().top;
                    const elementVisible = 150;
                    
                    if (elementTop < window.innerHeight - elementVisible) {
                        element.classList.add('animated');
                    }
                });
            };
            
            window.addEventListener('scroll', animateOnScroll);
            animateOnScroll(); // تشغيل مرة واحدة عند التحميل
        }
        
        // تفعيل العدادات
        const counters = document.querySelectorAll('.counter');
        
        if (counters.length > 0) {
            const countUp = function() {
                counters.forEach(counter => {
                    const elementTop = counter.getBoundingClientRect().top;
                    const elementVisible = 150;
                    
                    if (elementTop < window.innerHeight - elementVisible && !counter.classList.contains('counted')) {
                        counter.classList.add('counted');
                        
                        const target = parseInt(counter.getAttribute('data-target'));
                        const duration = 2000; // مدة العد بالمللي ثانية
                        const step = target / (duration / 16); // 16ms لكل إطار
                        
                        let current = 0;
                        const updateCounter = function() {
                            current += step;
                            if (current < target) {
                                counter.textContent = Math.floor(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.textContent = target;
                            }
                        };
                        
                        updateCounter();
                    }
                });
            };
            
            window.addEventListener('scroll', countUp);
            countUp(); // تشغيل مرة واحدة عند التحميل
        }
    },

    // إعداد النماذج
    setupForms: function() {
        const forms = document.querySelectorAll('form');
        
        if (forms.length > 0) {
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    const requiredFields = form.querySelectorAll('[required]');
                    let isValid = true;
                    
                    requiredFields.forEach(field => {
                        if (!field.value.trim()) {
                            isValid = false;
                            field.classList.add('error');
                            
                            // إنشاء رسالة خطأ إذا لم تكن موجودة
                            let errorMessage = field.nextElementSibling;
                            if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                                errorMessage = document.createElement('div');
                                errorMessage.className = 'error-message';
                                errorMessage.textContent = 'هذا الحقل مطلوب';
                                field.parentNode.insertBefore(errorMessage, field.nextSibling);
                            }
                        } else {
                            field.classList.remove('error');
                            
                            // إزالة رسالة الخطأ إذا كانت موجودة
                            const errorMessage = field.nextElementSibling;
                            if (errorMessage && errorMessage.classList.contains('error-message')) {
                                errorMessage.remove();
                            }
                        }
                    });
                    
                    if (!isValid) {
                        e.preventDefault();
                    }
                });
                
                // إزالة تنسيق الخطأ عند الكتابة
                const inputFields = form.querySelectorAll('input, textarea, select');
                inputFields.forEach(field => {
                    field.addEventListener('input', function() {
                        if (field.value.trim()) {
                            field.classList.remove('error');
                            
                            // إزالة رسالة الخطأ إذا كانت موجودة
                            const errorMessage = field.nextElementSibling;
                            if (errorMessage && errorMessage.classList.contains('error-message')) {
                                errorMessage.remove();
                            }
                        }
                    });
                });
            });
        }
        
        // تفعيل نموذج تسجيل الدخول
        const loginForm = document.querySelector('#login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const username = document.querySelector('#username').value.trim();
                const password = document.querySelector('#password').value.trim();
                
                if (username && password) {
                    // محاكاة عملية تسجيل الدخول
                    const loginButton = loginForm.querySelector('button[type="submit"]');
                    const originalText = loginButton.textContent;
                    
                    loginButton.disabled = true;
                    loginButton.innerHTML = '<span class="spinner"></span> جاري تسجيل الدخول...';
                    
                    setTimeout(() => {
                        // التحقق من صحة بيانات الدخول (يجب استبدالها بطلب API حقيقي)
                        if (validateBrokerCredentials(username, password)) {
                            window.location.href = 'index.html';
                        } else {
                            const errorMessage = document.createElement('div');
                            errorMessage.className = 'error-message text-center mb-20';
                            errorMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة';
                            
                            const existingError = loginForm.querySelector('.error-message');
                            if (existingError) {
                                existingError.remove();
                            }
                            
                            loginForm.insertBefore(errorMessage, loginForm.firstChild);
                            
                            loginButton.disabled = false;
                            loginButton.textContent = originalText;
                        }
                    }, 1500);
                }
            });
        }
    },

    // إعداد علامات التبويب
    setupTabs: function() {
        const tabContainers = document.querySelectorAll('.tabs-container');
        
        if (tabContainers.length > 0) {
            tabContainers.forEach(container => {
                const tabs = container.querySelectorAll('.tab');
                const tabPanels = container.querySelectorAll('.tab-panel');
                
                tabs.forEach(tab => {
                    tab.addEventListener('click', function() {
                        const target = this.getAttribute('data-target');
                        
                        // إزالة الفئة النشطة من جميع علامات التبويب
                        tabs.forEach(t => t.classList.remove('active'));
                        
                        // إضافة الفئة النشطة إلى علامة التبويب المحددة
                        this.classList.add('active');
                        
                        // إخفاء جميع لوحات علامات التبويب
                        tabPanels.forEach(panel => panel.classList.remove('active'));
                        
                        // إظهار لوحة علامة التبويب المحددة
                        const targetPanel = container.querySelector(`.tab-panel[data-id="${target}"]`);
                        if (targetPanel) {
                            targetPanel.classList.add('active');
                        }
                    });
                });
            });
        }
        
        // تفعيل علامات تبويب واجهات المستخدم
        const interfaceTabs = document.querySelectorAll('.interface-tab');
        if (interfaceTabs.length > 0) {
            interfaceTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    const target = this.getAttribute('data-target');
                    
                    // إزالة الفئة النشطة من جميع علامات التبويب
                    interfaceTabs.forEach(t => t.classList.remove('active'));
                    
                    // إضافة الفئة النشطة إلى علامة التبويب المحددة
                    this.classList.add('active');
                    
                    // إخفاء جميع لوحات علامات التبويب
                    document.querySelectorAll('.interface-panel').forEach(panel => panel.classList.remove('active'));
                    
                    // إظهار لوحة علامة التبويب المحددة
                    const targetPanel = document.querySelector(`.interface-panel[data-id="${target}"]`);
                    if (targetPanel) {
                        targetPanel.classList.add('active');
                    }
                });
            });
        }
        
        // تفعيل علامات تبويب تسجيل الدخول
        const loginTabs = document.querySelectorAll('.login-tab');
        if (loginTabs.length > 0) {
            loginTabs.forEach(tab => {
                tab.addEventListener('click', function() {
                    // إزالة الفئة النشطة من جميع علامات التبويب
                    loginTabs.forEach(t => t.classList.remove('active'));
                    
                    // إضافة الفئة النشطة إلى علامة التبويب المحددة
                    this.classList.add('active');
                    
                    // تحديث نص الزر وحقول النموذج بناءً على نوع المستخدم
                    const loginButton = document.querySelector('#login-form button[type="submit"]');
                    const usernameLabel = document.querySelector('label[for="username"]');
                    
                    if (this.textContent.includes('وسيط فرد')) {
                        loginButton.textContent = 'تسجيل دخول كوسيط فرد';
                        usernameLabel.textContent = 'الاسم الأول والأخير';
                    } else {
                        loginButton.textContent = 'تسجيل دخول كمنشأة عقارية';
                        usernameLabel.textContent = 'اسم المنشأة';
                    }
                });
            });
        }
    },

    // إعداد القائمة للأجهزة المحمولة
    setupMobileMenu: function() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', function() {
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                document.body.classList.toggle('menu-open');
            });
            
            // إغلاق القائمة عند النقر على الروابط
            const mobileLinks = mobileMenu.querySelectorAll('a');
            mobileLinks.forEach(link => {
                link.addEventListener('click', function() {
                    menuToggle.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.classList.remove('menu-open');
          
(Content truncated due to size limit. Use line ranges to read in chunks)