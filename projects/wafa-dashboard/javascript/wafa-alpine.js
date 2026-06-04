// Translations dictionary used by Alpine AND by the chart scripts.
const I18N = {
    fa: {
        brand: "WebProg.io",
        sidebarTitle: "WebProg.io",
        nav: {
            dashboard: "داشبورد",
            shop: "فروشگاه",
            products: "محصولات",
            orders: "سفارشات",
            discounts: "تخفیف ها",
            tickets: "تیکت",
            comments: "کامنت ها"
        },
        submenu: ["آیتم های فروشگاه", "گالری فروشگاه", "بخش فروشگاه", "به زودی"],
        statsSeeProfile: "بازدید پروفایل",
        statsNewUsers: "کاربران جدید",
        statsSubscribers: "مشترکین",
        statsCompleted: "تکمیل شده",
        chartHeader: "نمودار درآمد",
        progressTitle: "لورم ایپسوم",
        progressDesc: "لورم ایپسوم متن ساختگی با تولید سادگی.",
        lastComments: "آخرین کامنت ها",
        thPhoto: "تصویر",
        thUser: "نام کاربری",
        thComment: "کامنت",
        commentText: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت.",
        profileName: "وفا",
        profileHandle: "@wafa",
        showUsers: "نمایش کاربران",
        usersPart: "کاربران",
        userName: "وفا",
        userEmail: "wafa@webprog.io",
        donutTitle: "لورم ایپسوم متن",
        donutSuccess: "پرداختی موفق",
        donutFailed: "پرداختی ناموفق",
        role: "طراح",
        designer: "وفا",
        langToggle: "EN",
        months: ["فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور", "مهر", "آبان"]
    },
    en: {
        brand: "WebProg.io",
        sidebarTitle: "WebProg.io",
        nav: {
            dashboard: "Dashboard",
            shop: "Shop",
            products: "Products",
            orders: "Orders",
            discounts: "Discounts",
            tickets: "Ticket",
            comments: "Comments"
        },
        submenu: ["Shop Items", "Shop Gallery", "Shop Part", "Coming Soon"],
        statsSeeProfile: "Profile Views",
        statsNewUsers: "New Users",
        statsSubscribers: "Subscribers",
        statsCompleted: "Completed",
        chartHeader: "Revenue Chart",
        progressTitle: "Lorem Ipsum",
        progressDesc: "Lorem ipsum dolor sit amet, consectetur.",
        lastComments: "Last Comments",
        thPhoto: "Photo",
        thUser: "User Name",
        thComment: "Comment",
        commentText: "Lorem ipsum dolor sit amet, aperiam dignissimos.",
        profileName: "Wafa",
        profileHandle: "@wafa",
        showUsers: "Show Users",
        usersPart: "Users",
        userName: "Wafa",
        userEmail: "wafa@webprog.io",
        donutTitle: "Lorem Ipsum Text",
        donutSuccess: "Successful Payments",
        donutFailed: "Failed Payments",
        role: "Designer",
        designer: "Wafa",
        langToggle: "فا",
        months: ["Farvardin", "Ordibehesht", "Khordad", "Tir", "Mordad", "Shahrivar", "Mehr", "Aban"]
    }
};

// Global getter so chart scripts (loaded before Alpine init) can resolve labels.
window.__lang = localStorage.getItem("dash_lang") || "fa";
window.__t = function (key) {
    var dict = I18N[window.__lang] || I18N.fa;
    return dict[key];
};

document.addEventListener('alpine:init', () => {
    Alpine.data('dashboard', () => ({
        open: true,
        lang: window.__lang,

        init() {
            this.applyDir();
            this.$watch('lang', () => {
                window.__lang = this.lang;
                localStorage.setItem('dash_lang', this.lang);
                this.applyDir();
                this.refreshCharts();
            });
        },

        applyDir() {
            const html = document.documentElement;
            html.setAttribute('lang', this.lang);
            html.setAttribute('dir', this.lang === 'fa' ? 'rtl' : 'ltr');
        },

        toggleLang() {
            this.lang = this.lang === 'fa' ? 'en' : 'fa';
        },

        t(key) {
            const dict = I18N[this.lang] || I18N.fa;
            return key.split('.').reduce((acc, k) => (acc ? acc[k] : undefined), dict);
        },

        refreshCharts() {
            if (window.__barChart && window.__barChart.rebuild) {
                window.__barChart.rebuild();
            }
            if (window.__donutChart && window.__donutChart.series) {
                const s = window.__donutChart.series;
                s.data.setAll([
                    { category: this.t('donutSuccess'), value: 75.2 },
                    { category: this.t('donutFailed'), value: 24.8 }
                ]);
                if (window.__donutChart.legend) {
                    window.__donutChart.legend.data.setAll(s.dataItems);
                }
            }
        }
    }));
});
