/**
 * تحسينات الأداء وسرعة التحميل لموقع منصة وسّط
 * هذا الملف يحتوي على تحسينات لزيادة سرعة تحميل الموقع وتحسين تجربة المستخدم
 */

// تحميل الصور بشكل كسول (Lazy Loading)
document.addEventListener('DOMContentLoaded', function() {
    // تطبيق التحميل الكسول على جميع الصور
    const lazyImages = document.querySelectorAll('img');
    
    if ('loading' in HTMLImageElement.prototype) {
        // استخدام خاصية loading المدمجة في المتصفحات الحديثة
        lazyImages.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // استخدام Intersection Observer للمتصفحات القديمة
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    if (image.dataset.src) {
                        image.src = image.dataset.src;
                        image.removeAttribute('data-src');
                    }
                    image.classList.add('loaded');
                    observer.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(img => {
            if (!img.hasAttribute('loading')) {
                if (img.src) {
                    img.dataset.src = img.src;
                    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNlZWVlZWUiLz48L3N2Zz4=';
                }
                img.classList.add('lazy-load');
                imageObserver.observe(img);
            }
        });
    }
    
    // تحسين تحميل الخطوط
    if ('fonts' in document) {
        // تحميل الخطوط بشكل استباقي
        Promise.all([
            document.fonts.load('300 1em Tajawal'),
            document.fonts.load('400 1em Tajawal'),
            document.fonts.load('500 1em Tajawal'),
            document.fonts.load('700 1em Tajawal'),
            document.fonts.load('800 1em Tajawal')
        ]).then(() => {
            document.documentElement.classList.add('fonts-loaded');
        });
    }
    
    // تحسين التمرير السلس
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // تحسين تحميل العناصر المرئية
    const animateElements = document.querySelectorAll('.animate');
    
    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animateElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            animationObserver.observe(element);
        });
    } else {
        // للمتصفحات التي لا تدعم IntersectionObserver
        animateElements.forEach(element => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }
    
    // تحسين أداء زر العودة إلى الأعلى
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        const toggleBackToTop = () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        };
        
        // استخدام requestAnimationFrame لتحسين الأداء
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    toggleBackToTop();
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // تحسين أداء التبديل بين علامات التبويب
    const tabButtons = document.querySelectorAll('[data-tab]');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const targetTab = this.getAttribute('data-tab');
                const tabContents = document.querySelectorAll('.tab-content');
                const tabButtons = document.querySelectorAll('[data-tab]');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                
                tabButtons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                document.getElementById(targetTab).classList.add('active');
                this.classList.add('active');
            });
        });
    }
    
    // تحسين أداء النماذج
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        // منع إرسال النموذج الفارغ
        form.addEventListener('submit', function(e) {
            const requiredFields = this.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                e.preventDefault();
            }
        });
        
        // إزالة فئة الخطأ عند الكتابة
        const inputFields = form.querySelectorAll('input, textarea, select');
        inputFields.forEach(field => {
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('error');
                }
            });
        });
    });
    
    // تحسين أداء القوائم المنسدلة
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            
            // إغلاق جميع القوائم المنسدلة الأخرى
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== this) {
                    otherToggle.nextElementSibling.classList.remove('show');
                }
            });
            
            dropdown.classList.toggle('show');
        });
    });
    
    // إغلاق القوائم المنسدلة عند النقر خارجها
    document.addEventListener('click', function(e) {
        dropdownToggles.forEach(toggle => {
            const dropdown = toggle.nextElementSibling;
            if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    });
    
    // تحسين أداء المحتوى المتغير
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target.classList.contains('dynamic-height')) {
                entry.target.style.height = 'auto';
                entry.target.style.height = entry.target.scrollHeight + 'px';
            }
        }
    });
    
    const dynamicHeightElements = document.querySelectorAll('.dynamic-height');
    dynamicHeightElements.forEach(element => {
        resizeObserver.observe(element);
    });
    
    // تحسين أداء الصور المتحركة
    const animatedImages = document.querySelectorAll('.animated-image');
    animatedImages.forEach(image => {
        image.addEventListener('mouseenter', function() {
            this.style.willChange = 'transform';
        });
        
        image.addEventListener('mouseleave', function() {
            this.style.willChange = 'auto';
        });
    });
    
    // تحسين أداء التمرير
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        document.body.classList.add('is-scrolling');
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            document.body.classList.remove('is-scrolling');
        }, 100);
    });
    
    // تحسين أداء النوافذ المنبثقة
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('show');
                document.body.classList.add('modal-open');
            }
        });
    });
    
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('show');
                document.body.classList.remove('modal-open');
            });
        }
        
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('show');
                document.body.classList.remove('modal-open');
            }
        });
    });
    
    // تحسين أداء التبديل بين الوضع الفاتح والداكن
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // حفظ تفضيل المستخدم
            const isDarkMode = document.body.classList.contains('dark-mode');
            localStorage.setItem('dark-mode', isDarkMode);
        });
        
        // استرجاع تفضيل المستخدم
        const savedDarkMode = localStorage.getItem('dark-mode');
        if (savedDarkMode === 'true') {
            document.body.classList.add('dark-mode');
        }
    }
    
    // تحسين أداء الصور المتغيرة
    const responsiveImages = document.querySelectorAll('img[data-src-mobile], img[data-src-tablet], img[data-src-desktop]');
    
    function updateResponsiveImages() {
        const width = window.innerWidth;
        
        responsiveImages.forEach(img => {
            let newSrc;
            
            if (width <= 767 && img.dataset.srcMobile) {
                newSrc = img.dataset.srcMobile;
            } else if (width <= 991 && img.dataset.srcTablet) {
                newSrc = img.dataset.srcTablet;
            } else if (img.dataset.srcDesktop) {
                newSrc = img.dataset.srcDesktop;
            }
            
            if (newSrc && img.src !== newSrc) {
                img.src = newSrc;
            }
        });
    }
    
    // تحديث الصور المتغيرة عند تغيير حجم النافذة
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateResponsiveImages, 100);
    });
    
    // تحديث الصور المتغيرة عند تحميل الصفحة
    updateResponsiveImages();
    
    // تحسين أداء التنقل بين الصفحات
    const pageLinks = document.querySelectorAll('a[data-page]');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetPage = this.getAttribute('data-page');
            if (targetPage) {
                e.preventDefault();
                
                // إظهار مؤشر التحميل
                document.body.classList.add('page-loading');
                
                // تأخير قصير لإظهار مؤشر التحميل
                setTimeout(() => {
                    window.location.href = targetPage;
                }, 300);
            }
        });
    });
    
    // تحسين أداء الصور المتحركة عند التمرير
    const parallaxElements = document.querySelectorAll('.parallax');
    
    function updateParallax() {
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementPosition = element.offsetTop;
            const distance = scrollPosition - elementPosition;
            const speed = element.getAttribute('data-parallax-speed') || 0.5;
            
            if (Math.abs(distance) < window.innerHeight) {
                element.style.transform = `translateY(${distance * speed}px)`;
            }
        });
    }
    
    // تحديث عناصر التأثير المتوازي عند التمرير
    let parallaxTimeout;
    window.addEventListener('scroll', function() {
        if (parallaxElements.length > 0) {
            clearTimeout(parallaxTimeout);
            parallaxTimeout = setTimeout(updateParallax, 10);
        }
    });
    
    // تحسين أداء الصور المتحركة عند التمرير
    updateParallax();
    
    // تحسين أداء الأزرار المتحركة
    const hoverButtons = document.querySelectorAll('.hover-effect');
    hoverButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.willChange = 'transform, box-shadow';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.willChange = 'auto';
        });
    });
    
    // تحسين أداء التحقق من صحة النماذج
    const validateInputs = document.querySelectorAll('[data-validate]');
    validateInputs.forEach(input => {
        input.addEventListener('blur', function() {
            const validateType = this.getAttribute('data-validate');
            const value = this.value.trim();
            let isValid = true;
            
            switch (validateType) {
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    break;
                case 'phone':
                    isValid = /^[0-9]{10,15}$/.test(value.replace(/[^0-9]/g, ''));
                    break;
                case 'number':
                    isValid = !isNaN(value) && value !== '';
                    break;
                case 'required':
                    isValid = value !== '';
                    break;
            }
            
            if (!isValid) {
                this.classList.add('error');
                
                const errorMessage = this.getAttribute('data-error-message');
                if (errorMessage) {
                    const errorElement = document.createElement('div');
                    errorElement.className = 'error-message';
                    errorElement.textContent = errorMessage;
                    
                    const existingError = this.nextElementSibling;
                    if (existingError && existingError.classList.contains('error-message')) {
                        existingError.remove();
                    }
                    
                    this.parentNode.insertBefore(errorElement, this.nextSibling);
                }
            } else {
                this.classList.remove('error');
           
(Content truncated due to size limit. Use line ranges to read in chunks)