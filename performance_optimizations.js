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
                
                const existingError = this.nextElementSibling;
                if (existingError && existingError.classList.contains('error-message')) {
                    existingError.remove();
                }
            }
        });
    });
    
    // تحسين أداء التبديل بين اللغات
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            const currentLang = document.documentElement.getAttribute('lang');
            const newLang = currentLang === 'ar' ? 'en' : 'ar';
            const newDir = newLang === 'ar' ? 'rtl' : 'ltr';
            
            document.documentElement.setAttribute('lang', newLang);
            document.documentElement.setAttribute('dir', newDir);
            
            // حفظ تفضيل المستخدم
            localStorage.setItem('language', newLang);
        });
        
        // استرجاع تفضيل المستخدم
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage) {
            document.documentElement.setAttribute('lang', savedLanguage);
            document.documentElement.setAttribute('dir', savedLanguage === 'ar' ? 'rtl' : 'ltr');
        }
    }
    
    // تحسين أداء التبديل بين الأقسام
    const sectionLinks = document.querySelectorAll('[data-section]');
    sectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-section');
            const sections = document.querySelectorAll('.dynamic-section');
            
            sections.forEach(section => {
                section.classList.remove('active');
            });
            
            sectionLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            document.getElementById(targetSection).classList.add('active');
            this.classList.add('active');
        });
    });
    
    // تحسين أداء العد التنازلي
    const countdownElements = document.querySelectorAll('[data-countdown]');
    
    function updateCountdowns() {
        countdownElements.forEach(element => {
            const targetDate = new Date(element.getAttribute('data-countdown')).getTime();
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                element.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            } else {
                element.innerHTML = 'انتهى العد التنازلي';
            }
        });
    }
    
    // تحديث العد التنازلي كل ثانية
    if (countdownElements.length > 0) {
        updateCountdowns();
        setInterval(updateCountdowns, 1000);
    }
    
    // تحسين أداء التبديل بين العناصر
    const toggleElements = document.querySelectorAll('[data-toggle]');
    toggleElements.forEach(element => {
        element.addEventListener('click', function() {
            const targetId = this.getAttribute('data-toggle');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.classList.toggle('show');
                this.classList.toggle('active');
            }
        });
    });
    
    // تحسين أداء الشريط العلوي الثابت
    const header = document.querySelector('header');
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
                
                if (scrollTop > lastScrollTop) {
                    // التمرير لأسفل
                    header.classList.add('header-hidden');
                } else {
                    // التمرير لأعلى
                    header.classList.remove('header-hidden');
                }
            } else {
                header.classList.remove('scrolled');
                header.classList.remove('header-hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }
    
    // تحسين أداء الصور المتحركة عند التمرير
    const fadeElements = document.querySelectorAll('.fade-in');
    
    if ('IntersectionObserver' in window) {
        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        fadeElements.forEach(element => {
            fadeObserver.observe(element);
        });
    } else {
        // للمتصفحات التي لا تدعم IntersectionObserver
        fadeElements.forEach(element => {
            element.classList.add('visible');
        });
    }
    
    // تحسين أداء التبديل بين الصور
    const imageSliders = document.querySelectorAll('.image-slider');
    imageSliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const prevBtn = slider.querySelector('.prev');
        const nextBtn = slider.querySelector('.next');
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? 'block' : 'none';
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(currentSlide);
        }
        
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        
        // عرض الشريحة الأولى
        showSlide(currentSlide);
        
        // تبديل تلقائي للشرائح
        if (slider.hasAttribute('data-auto-slide')) {
            const interval = parseInt(slider.getAttribute('data-auto-slide')) || 5000;
            setInterval(nextSlide, interval);
        }
    });
    
    // تحسين أداء التبديل بين الأقسام المتعددة
    const multiSectionLinks = document.querySelectorAll('[data-multi-section]');
    multiSectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = this.getAttribute('data-multi-section');
            const parentContainer = this.closest('[data-multi-container]');
            
            if (parentContainer) {
                const sections = parentContainer.querySelectorAll('[data-section-id]');
                const links = parentContainer.querySelectorAll('[data-multi-section]');
                
                sections.forEach(section => {
                    section.classList.remove('active');
                });
                
                links.forEach(link => {
                    link.classList.remove('active');
                });
                
                parentContainer.querySelector(`[data-section-id="${targetSection}"]`).classList.add('active');
                this.classList.add('active');
            }
        });
    });
    
    // تحسين أداء التبديل بين الأقسام المتعددة
    const multiContainers = document.querySelectorAll('[data-multi-container]');
    multiContainers.forEach(container => {
        // تنشيط القسم الأول افتراضياً
        const firstLink = container.querySelector('[data-multi-section]');
        const firstSection = container.querySelector('[data-section-id]');
        
        if (firstLink && firstSection) {
            firstLink.classList.add('active');
            firstSection.classList.add('active');
        }
    });
    
    // تحسين أداء التبديل بين الأقسام المتعددة
    const accordionToggles = document.querySelectorAll('.accordion-toggle');
    accordionToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            
            this.classList.toggle('active');
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
    
    // تحسين أداء التبديل بين الأقسام المتعددة
    const filterButtons = document.querySelectorAll('[data-filter]');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            const filterContainer = this.closest('[data-filter-container]');
            
            if (filterContainer) {
                const items = filterContainer.querySelectorAll('[data-category]');
                const buttons = filterContainer.querySelectorAll('[data-filter]');
                
                buttons.forEach(btn => {
                    btn.classList.remove('active');
                });
                
                this.classList.add('active');
                
                items.forEach(item => {
                    if (filter === 'all') {
                        item.style.display = 'block';
                    } else {
                        const categories = item.getAttribute('data-category').split(' ');
                        if (categories.includes(filter)) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
            }
        });
    });
    
    // تحسين أداء التبديل بين الأقسام المتعددة
    const filterContainers = document.querySelectorAll('[data-filter-container]');
    filterContainers.forEach(container => {
        // تنشيط زر "الكل" افتراضياً
        const allButton = container.querySelector('[data-filter="all"]');
        if (allButton) {
            allButton.classList.add('active');
        }
    });
    
    // تحسين أداء التبديل بين الأقسام المتعددة
    const searchInputs = document.querySelectorAll('[data-search]');
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const searchContainer = document.querySelector(this.getAttribute('data-search'));
            
            if (searchContainer) {
                const items = searchContainer.querySelectorAll('[data-search-item]');
                
                items.forEach(item => {
                    const text = item.textContent.toLowerCase();
                    if (text.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // تحسين أداء التبديل بين الأقسام المتعددة
    const sortButtons = document.querySelectorAll('[data-sort]');
    sortButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sortType = this.getAttribute('data-sort');
            const sortContainer = document.querySelector(this.getAttribute('data-sort-container'));
            
            if (sortContainer) {
                const items = Array.from(sortContainer.querySelectorAll('[data-sort-value]'));
                
                items.sort((a, b) => {
                    const aValue = a.getAttribute('data-sort-value');
                    const bValue = b.getAttribute('data-sort-value');
                    
                    if (sortType === 'asc') {
                        return aValue.localeCompare(bValue);
                    } else {
                        return bValue.localeCompare(aValue);
                    }
                });
                
                items.forEach(item => {
                    sortContainer.appendChild(item);
                });
            }
        });
    });
    
    // تحسين أداء التبديل بين الأقسام المتعددة
    const rangeInputs = document.querySelectorAll('input[type="range"]');
    rangeInputs.forEach(input => {
        const output = document.querySelector(`output[for="${input.id}"]`);
        
        if (output) {
            output.textContent = input.value;
            
            input.addEventListener('input', function() {
                output.textContent = this.value;
            });
        }
    });
    
    // تحسين أداء التبديل بين الأقسام المتعددة
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            
            setTimeout(() => {
                tooltip.classList.add('show');
            }, 10);
            
            this.addEventListener('mouseleave', function onMouseLeave() {
                tooltip.classList.remove('show');
                
                setTimeout(() => {
                    document.body.removeChild(tooltip);
                }, 300);
                
                this.removeEventListener('mouseleave', onMouseLeave);
            });
        });
    });
});

// تحسين أداء تحميل الصفحة
window.addEventListener('load', function() {
    // إزالة مؤشر التحميل
    document.body.classList.remove('page-loading');
    
    // تحسين أداء الصور
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZWVlZWVlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OTk5OSI+2LXZiNix2Kkg2LrZitixINmF2KrZiNmB2LHYqTwvdGV4dD48L3N2Zz4=';
            this.alt = 'صورة غير متوفرة';
        });
    });
    
    // تحسين أداء الروابط الخارجية
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('rel')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
});

// تحسين أداء الصفحة عند إعادة التحميل
window.addEventListener('beforeunload', function() {
    // إظهار مؤشر التحميل
    document.body.classList.add('page-loading');
});

// تحسين أداء الصفحة عند تغيير حجم النافذة
let resizeTimer;
window.addEventListener('resize', function() {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});

// تحسين أداء الصفحة عند تغيير اتجاه الجهاز
window.addEventListener('orientationchange', function() {
    // إعادة تعيين حجم العناصر المتغيرة
    const dynamicHeightElements = document.querySelectorAll('.dynamic-height');
    dynamicHeightElements.forEach(element => {
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
    });
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('reduced-motion');
    } else {
        document.body.classList.remove('reduced-motion');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-reduced-data: reduce)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('reduced-data');
    } else {
        document.body.classList.remove('reduced-data');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-contrast: more)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-contrast: less)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('low-contrast');
    } else {
        document.body.classList.remove('low-contrast');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-reduced-transparency: reduce)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('reduced-transparency');
    } else {
        document.body.classList.remove('reduced-transparency');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('reduced-motion');
    } else {
        document.body.classList.remove('reduced-motion');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-reduced-data: reduce)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('reduced-data');
    } else {
        document.body.classList.remove('reduced-data');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-contrast: more)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-contrast: less)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('low-contrast');
    } else {
        document.body.classList.remove('low-contrast');
    }
});

// تحسين أداء الصفحة عند تغيير وضع الجهاز
window.matchMedia('(prefers-reduced-transparency: reduce)').addEventListener('change', function(e) {
    if (e.matches) {
        document.body.classList.add('reduced-transparency');
    } else {
        document.body.classList.remove('reduced-transparency');
    }
});
