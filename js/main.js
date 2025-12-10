// تالادوز — main.js نسخه ۲۰۲۵.۸ (تک و استاندارد)
// حسین حوت

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('calcForm');
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Dark Mode Toggle
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        themeToggle.querySelector('i').classList.toggle('bi-moon-stars-fill');
        themeToggle.querySelector('i').classList.toggle('bi-sun-fill');
    });

    // Bootstrap Validation
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Loading Animation
        const btn = form.querySelector('button[type="submit"]');
        const btnText = btn.querySelector('.btn-text');
        const spinner = btn.querySelector('.spinner-border');
        btnText.classList.add('d-none');
        spinner.classList.remove('d-none');

        // محاسبه (همون کد قبلی — فقط این بخش رو کپی کن از main.js قبلی، یا کاملش رو از پیام قبل بگیر)
        setTimeout(() => {
            // ... (کد محاسبه از پیام قبلی)
            btnText.classList.remove('d-none');
            spinner.classList.add('d-none');
        }, 1500); // شبیه‌سازی loading
    });
});
