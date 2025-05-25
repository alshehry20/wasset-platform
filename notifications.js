/**
 * نظام التنبيهات الذكي لمنصة وسّط
 * يدعم التنبيهات داخل المنصة، عبر الواتساب، والبريد الإلكتروني
 */

class WassetNotifications {
    constructor() {
        this.whatsappNumber = "966534394757"; // رقم الواتساب الرسمي للمنصة
        this.notificationCount = 0;
        this.unreadNotifications = [];
        this.notificationSettings = {
            platform: true,
            whatsapp: true,
            email: false
        };
        
        this.init();
    }
    
    init() {
        // تهيئة عناصر واجهة التنبيهات
        this.notificationBell = document.querySelector('.notification-bell');
        this.notificationCount = document.querySelector('.notification-count');
        this.notificationPanel = document.querySelector('.notification-panel');
        this.notificationList = document.querySelector('.notification-list');
        this.markAllReadButton = document.querySelector('.mark-all-read');
        
        // تحميل التنبيهات من التخزين المحلي إن وجدت
        this.loadNotifications();
        
        // تحميل إعدادات التنبيهات من التخزين المحلي إن وجدت
        this.loadNotificationSettings();
        
        // تفعيل الأحداث
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // فتح/إغلاق لوحة التنبيهات عند النقر على الجرس
        if (this.notificationBell) {
            this.notificationBell.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleNotificationPanel();
            });
        }
        
        // إغلاق لوحة التنبيهات عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (this.notificationPanel && 
                this.notificationPanel.classList.contains('active') && 
                !this.notificationPanel.contains(e.target) && 
                !this.notificationBell.contains(e.target)) {
                this.notificationPanel.classList.remove('active');
            }
        });
        
        // تعيين جميع التنبيهات كمقروءة
        if (this.markAllReadButton) {
            this.markAllReadButton.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }
    }
    
    toggleNotificationPanel() {
        if (this.notificationPanel) {
            this.notificationPanel.classList.toggle('active');
            
            // تعيين التنبيهات كمقروءة عند فتح اللوحة
            if (this.notificationPanel.classList.contains('active')) {
                this.updateUnreadCount();
            }
        }
    }
    
    // إضافة تنبيه جديد
    addNotification(notification) {
        // إضافة التنبيه إلى القائمة
        this.unreadNotifications.push({
            id: Date.now(),
            ...notification,
            read: false,
            timestamp: new Date().toISOString()
        });
        
        // تحديث عدد التنبيهات غير المقروءة
        this.updateUnreadCount();
        
        // حفظ التنبيهات في التخزين المحلي
        this.saveNotifications();
        
        // عرض التنبيه في الواجهة
        this.renderNotifications();
        
        // إرسال التنبيه عبر الواتساب إذا كان مفعلاً
        if (this.notificationSettings.whatsapp && notification.sendWhatsapp !== false) {
            this.sendWhatsappNotification(notification);
        }
        
        // إرسال التنبيه عبر البريد الإلكتروني إذا كان مفعلاً
        if (this.notificationSettings.email && notification.sendEmail !== false) {
            this.sendEmailNotification(notification);
        }
        
        return notification.id;
    }
    
    // إضافة تنبيه للعروض العقارية الجديدة
    addPropertyNotification(property) {
        return this.addNotification({
            type: 'property',
            icon: 'home',
            title: `عقار جديد يطابق معاييرك: ${property.title}`,
            message: `تم إضافة عقار جديد يطابق معاييرك في ${property.location}`,
            link: `property-details.html?id=${property.id}&ref=notification`,
            property: property
        });
    }
    
    // إضافة تنبيه للعملاء المهتمين
    addClientNotification(client, property) {
        return this.addNotification({
            type: 'client',
            icon: 'user',
            title: `عميل جديد مهتم بعقارك: ${property.title}`,
            message: `${client.name} مهتم بعقارك في ${property.location}`,
            link: `client-details.html?id=${client.id}&property=${property.id}&ref=notification`,
            client: client,
            property: property
        });
    }
    
    // إضافة تنبيه لتحديثات السوق
    addMarketNotification(market) {
        return this.addNotification({
            type: 'market',
            icon: 'chart-line',
            title: `تحديث في أسعار العقارات: ${market.title}`,
            message: market.message,
            link: `market-insights.html?id=${market.id}&ref=notification`,
            market: market
        });
    }
    
    // إضافة تنبيه للطلبات العقارية
    addRequestNotification(request) {
        return this.addNotification({
            type: 'request',
            icon: 'clipboard-list',
            title: `طلب عقاري جديد: ${request.title}`,
            message: `تم إضافة طلب عقاري جديد يطابق عقاراتك`,
            link: `request-details.html?id=${request.id}&ref=notification`,
            request: request
        });
    }
    
    // إضافة تنبيه للصفقات المكتملة
    addDealNotification(deal) {
        return this.addNotification({
            type: 'deal',
            icon: 'handshake',
            title: `تم إكمال صفقة: ${deal.title}`,
            message: `تم إكمال صفقة بقيمة ${deal.value} ريال`,
            link: `deal-details.html?id=${deal.id}&ref=notification`,
            deal: deal
        });
    }
    
    // تعيين تنبيه كمقروء
    markAsRead(notificationId) {
        const notification = this.unreadNotifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateUnreadCount();
            this.saveNotifications();
            this.renderNotifications();
        }
    }
    
    // تعيين جميع التنبيهات كمقروءة
    markAllAsRead() {
        this.unreadNotifications.forEach(notification => {
            notification.read = true;
        });
        
        this.updateUnreadCount();
        this.saveNotifications();
        this.renderNotifications();
    }
    
    // تحديث عدد التنبيهات غير المقروءة
    updateUnreadCount() {
        const unreadCount = this.unreadNotifications.filter(n => !n.read).length;
        
        if (this.notificationCount) {
            this.notificationCount.textContent = unreadCount;
            
            if (unreadCount > 0) {
                this.notificationBell.classList.add('has-notifications');
            } else {
                this.notificationBell.classList.remove('has-notifications');
            }
        }
    }
    
    // عرض التنبيهات في الواجهة
    renderNotifications() {
        if (!this.notificationList) return;
        
        // تفريغ قائمة التنبيهات
        this.notificationList.innerHTML = '';
        
        // ترتيب التنبيهات بحسب التاريخ (الأحدث أولاً)
        const sortedNotifications = [...this.unreadNotifications].sort((a, b) => {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        
        // عرض أحدث 10 تنبيهات فقط
        const recentNotifications = sortedNotifications.slice(0, 10);
        
        if (recentNotifications.length === 0) {
            // عرض رسالة إذا لم تكن هناك تنبيهات
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'notification-empty';
            emptyMessage.innerHTML = '<p>لا توجد تنبيهات جديدة</p>';
            this.notificationList.appendChild(emptyMessage);
        } else {
            // عرض التنبيهات
            recentNotifications.forEach(notification => {
                const notificationItem = document.createElement('div');
                notificationItem.className = `notification-item ${notification.read ? '' : 'unread'}`;
                notificationItem.setAttribute('data-id', notification.id);
                
                // حساب الوقت المنقضي
                const timeAgo = this.getTimeAgo(notification.timestamp);
                
                notificationItem.innerHTML = `
                    <div class="notification-icon">
                        <i class="fas fa-${notification.icon || 'bell'}"></i>
                    </div>
                    <div class="notification-content">
                        <p>${notification.message}</p>
                        <span class="notification-time">${timeAgo}</span>
                    </div>
                `;
                
                // إضافة حدث النقر لفتح الرابط وتعيين التنبيه كمقروء
                notificationItem.addEventListener('click', () => {
                    this.markAsRead(notification.id);
                    if (notification.link) {
                        window.location.href = notification.link;
                    }
                });
                
                this.notificationList.appendChild(notificationItem);
            });
        }
    }
    
    // حساب الوقت المنقضي منذ التنبيه
    getTimeAgo(timestamp) {
        const now = new Date();
        const notificationDate = new Date(timestamp);
        const diffInSeconds = Math.floor((now - notificationDate) / 1000);
        
        if (diffInSeconds < 60) {
            return 'منذ لحظات';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `منذ ${minutes} ${minutes === 1 ? 'دقيقة' : 'دقائق'}`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `منذ ${hours} ${hours === 1 ? 'ساعة' : 'ساعات'}`;
        } else if (diffInSeconds < 604800) {
            const days = Math.floor(diffInSeconds / 86400);
            return `منذ ${days} ${days === 1 ? 'يوم' : 'أيام'}`;
        } else {
            // تنسيق التاريخ إذا كان قديماً
            return notificationDate.toLocaleDateString('ar-SA');
        }
    }
    
    // إرسال تنبيه عبر الواتساب
    sendWhatsappNotification(notification) {
        // تحضير نص الرسالة
        let message = `*منصة وسّط* - ${notification.title}\n\n`;
        message += `${notification.message}\n\n`;
        
        if (notification.link) {
            // إضافة رابط مختصر للتنبيه
            const baseUrl = window.location.origin || 'https://wasset.com';
            const fullLink = `${baseUrl}/${notification.link}`;
            message += `للاطلاع: ${fullLink}`;
        }
        
        // فتح رابط الواتساب في نافذة جديدة
        const whatsappUrl = `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // في بيئة الإنتاج، يمكن استخدام API الواتساب للأعمال بدلاً من هذا
        // هنا نقوم فقط بتسجيل الرسالة في وحدة التحكم للتطوير
        console.log('إرسال تنبيه واتساب:', whatsappUrl);
        
        // في بيئة الإنتاج، يمكن استخدام طلب AJAX لإرسال التنبيه عبر خادم الباك إند
        /*
        fetch('/api/notifications/whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: this.whatsappNumber,
                message: message,
                notification: notification
            })
        });
        */
    }
    
    // إرسال تنبيه عبر البريد الإلكتروني
    sendEmailNotification(notification) {
        // في بيئة الإنتاج، يمكن استخدام طلب AJAX لإرسال التنبيه عبر خادم الباك إند
        console.log('إرسال تنبيه بريد إلكتروني:', notification);
        
        /*
        fetch('/api/notifications/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                notification: notification
            })
        });
        */
    }
    
    // حفظ التنبيهات في التخزين المحلي
    saveNotifications() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('wasset_notifications', JSON.stringify(this.unreadNotifications));
        }
    }
    
    // تحميل التنبيهات من التخزين المحلي
    loadNotifications() {
        if (typeof localStorage !== 'undefined') {
            const savedNotifications = localStorage.getItem('wasset_notifications');
            if (savedNotifications) {
                try {
                    this.unreadNotifications = JSON.parse(savedNotifications);
                    this.updateUnreadCount();
                    this.renderNotifications();
                } catch (e) {
                    console.error('خطأ في تحميل التنبيهات:', e);
                    this.unreadNotifications = [];
                }
            }
        }
    }
    
    // حفظ إعدادات التنبيهات في التخزين المحلي
    saveNotificationSettings() {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('wasset_notification_settings', JSON.stringify(this.notificationSettings));
        }
    }
    
    // تحميل إعدادات التنبيهات من التخزين المحلي
    loadNotificationSettings() {
        if (typeof localStorage !== 'undefined') {
            const savedSettings = localStorage.getItem('wasset_notification_settings');
            if (savedSettings) {
                try {
                    this.notificationSettings = JSON.parse(savedSettings);
                } catch (e) {
                    console.error('خطأ في تحميل إعدادات التنبيهات:', e);
                }
            }
        }
    }
    
    // تحديث إعدادات التنبيهات
    updateNotificationSettings(settings) {
        this.notificationSettings = {
            ...this.notificationSettings,
            ...settings
        };
        
        this.saveNotificationSettings();
    }
    
    // إضافة تنبيهات تجريبية للاختبار
    addDemoNotifications() {
        // تنبيه عقار جديد
        this.addPropertyNotification({
            id: 'prop1001',
            title: 'فيلا فاخرة في حي النرجس',
            location: 'الرياض، النرجس'
        });
        
        // تنبيه عميل مهتم
        this.addClientNotification(
            { id: 'client1001', name: 'محمد العتيبي' },
            { id: 'prop1002', title: 'شقة في حي الملقا', location: 'الرياض، الملقا' }
        );
        
        // تنبيه تحديث السوق
        this.addMarketNotification({
            id: 'market1001',
            title: 'انخفاض بنسبة 5% في حي الياسمين',
            message: 'تحديث في أسعار العقارات: انخفاض بنسبة 5% في حي الياسمين'
        });
        
        // تنبيه طلب عقاري
        this.addRequestNotification({
            id: 'req1001',
            title: 'طلب فيلا في شمال الرياض'
        });
        
        // تنبيه صفقة مكتملة
        this.addDealNotification({
            id: 'deal1001',
            title: 'بيع أرض في حي العليا',
            value: '1,200,000'
        });
    }
}

// إنشاء كائن التنبيهات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نظام التنبيهات
    window.wassetNotifications = new WassetNotifications();
    
    // إضافة تنبيهات تجريبية للعرض (يمكن إزالتها في الإنتاج)
    // window.wassetNotifications.addDemoNotifications();
});
