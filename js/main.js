// تالادوز — main.js نسخه نهایی و طلایی (۲۰۲۵.۱۰)
// طراحی و توسعه: حسین حوت

const brands = {
    deferoxamine: [
        { name: 'دسفوناک ۵۰۰mg (روناک دارو)', strength: 500 },
        { name: 'دسفرال ۵۰۰mg (نوارتیس)', strength: 500 },
        { name: 'Hospira 2g (فایزر)', strength: 2000 },
        { name: 'فروز آف ۵۰۰mg (آفا شیمی)', strength: 500 },
        { name: 'دفروکسامین دانا ۵۰۰mg', strength: 500 },
        { name: 'دسفوناک 2g (روناک دارو)', strength: 2000 }
    ],
    deferasirox: [
        { name: 'اکسجید ۱۲۵mg', strength: 125 },
        { name: 'جیدنیو ۹۰mg', strength: 90 },
        { name: 'جیدنیو ۱۸۰mg', strength: 180 },
        { name: 'جیدنیو ۳۶۰mg', strength: 360 },
        { name: 'اسورال ۱۸۰mg', strength: 180 },
        { name: 'تالاجید ۳۶۰mg', strength: 360 },
        { name: 'اکسجید ۲۵۰mg', strength: 250 },
        { name: 'اسورال ۵۰۰mg', strength: 500 }
    ],
    deferiprone: [
        { name: 'قرص روکشدار ال‌وان ۵۰۰mg (اوه سینا)', strength: 500 },
        { name: 'قرص جوشان آوی دفرون ۵۰۰mg (اوه سینا)', strength: 500 }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const drugSelect = document.getElementById('drug');
    const brandSelect = document.getElementById('brand');
    const brandGroup = document.getElementById('brandGroup');

    // برندها
    drugSelect.addEventListener('change', (e) => {
        const drug = e.target.value;
        brandSelect.innerHTML = '<option value="">اختیاری — برند موجود</option>';
        if (drug && brands[drug]) {
            brands[drug].forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.strength;
                opt.dataset.name = b.name;
                opt.textContent = b.name;
                brandSelect.appendChild(opt);
            });
            brandGroup.style.display = 'block';
        } else {
            brandGroup.style.display = 'none';
        }
    });

    // فریتین
    document.getElementById('ferritin').addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 0;
        const bar = document.getElementById('ferritinBar');
        const msg = document.getElementById('ferritinMsg');
        let width, color, text;
        if (val < 1000) { width = '35%'; color = 'bg-success'; text = 'عالی! بار آهن کنترل‌شده است'; }
        else if (val < 2500) { width = '70%'; color = 'bg-warning'; text = 'خوب است، اما مراقب باشید'; }
        else { width = '100%'; color = 'bg-danger'; text = 'بالا رفته — اما قابل کنترل است!'; }

        bar.style.width = width;
        bar.className = `progress-bar ${color} rounded-pill`;
        msg.textContent = text;
        msg.className = color === 'bg-success' ? 'text-success' : color === 'bg-warning' ? 'text-warning' : 'text-danger';
        msg.classList.add('fw-bold');
    });

    // دارک مود — حالا کامل کار می‌کنه
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = document.querySelector('#themeToggle i');
        if (document.body.classList.contains('dark-theme')) {
            icon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        } else {
            icon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
        }
    });

    // محاسبه دوز
    document.getElementById('calcForm').addEventListener('submit', (e) => {
        e.preventDefault();

        const drug = document.getElementById('drug').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const age = parseInt(document.getElementById('age').value);
        const ferritin = parseFloat(document.getElementById('ferritin').value);
        const isTransfusion = document.getElementById('transfusion').checked;
        const brandStrength = parseInt(document.getElementById('brand').value) || 500;

        if (!drug || isNaN(weight) || isNaN(age) || isNaN(ferritin)) {
            alert('لطفاً همه فیلدها را پر کنید!');
            return;
        }

        let totalMg = 0, dosePerKg = '', unitCount = '', howToUse = '', mechanism = '', interactions = '', monitoring = '';

        if (drug === 'deferoxamine') {
            let base = isTransfusion ? 40 : 25;
            if (age < 3) {
                dosePerKg = 'زیر ۳ سال: فقط با نظر پزشک';
            } else {
                if (ferritin > 2500) base = Math.min(base * 1.2, 60);
                if (ferritin < 1000) base = Math.max(base * 0.8, 20);
                totalMg = Math.round(base * weight);
                dosePerKg = `${base.toFixed(0)} mg/kg/روز`;

                if (brandStrength === 2000) {
                    const full = Math.floor(totalMg / 2000);
                    const rest = totalMg % 2000;
                    unitCount = full > 0 ? `${full} ویال ۲g` : '';
                    if (rest > 0) unitCount += `${unitCount ? ' + ' : ''}${Math.ceil(rest / 500)} ویال ۵۰۰mg`;
                    unitCount += `<br><small class="text-white-50">پیشنهاد: ${Math.ceil(totalMg / 500) ویال ۵۰۰mg برای دقت بیشتر</small>`;
                } else {
                    unitCount = `${Math.ceil(totalMg / 500)} ویال ۵۰۰mg`;
                }
            }
            howToUse = 'زیرجلدی با پمپ — ۸-۱۲ ساعت — ۵-۷ روز در هفته';
            mechanism = 'دفع آهن از ادرار — دسترسی عالی به سلول‌ها';
            interactions = 'ویتامین C (۱۰۰-۲۰۰mg) مجاز — در مشکلات قلبی ممنوع';
            monitoring = 'هر ۳ ماه: شنوایی و بینایی | هر ۶-۱۲ ماه: MRI T2* قلب';

        } else if (drug === 'deferasirox') {
            let base = isTransfusion ? 30 : 10;
            if (ferritin < 300) {
                dosePerKg = 'قطع موقت — LIC چک شود';
            } else {
                if (ferritin > 2500) base = Math.min(base + 10, 40);
                totalMg = Math.round(base * weight);
                dosePerKg = `${base.toFixed(0)} mg/kg/روز`;
                unitCount = `${Math.round(totalMg / brandStrength)} قرص ${brandStrength}mg`;
            }
            howToUse = 'خوراکی — یک‌بار در روز — معده خالی';
            mechanism = 'دفع اصلی از مدفوع — راحت و ساده';
            interactions = 'آنتی‌اسید آلومینیوم‌دار ممنوع';
            monitoring = 'ماهانه: کراتینین و آنزیم کبدی';

        } else if (drug === 'deferiprone') {
            if (age < 8 || ferritin < 500) {
                dosePerKg = age < 8 ? 'زیر ۸ سال: فقط با نظر پزشک' : 'قطع موقت — ANC چک شود';
            } else {
                let base = ferritin > 2500 ? 85 : 75;
                totalMg = Math.round(base * weight);
                dosePerKg = `مجموع ${base} mg/kg/روز (۳ دوز)`;
                const perDose = Math.round(totalMg / 3 / 500);
                unitCount = `${perDose * 3} قرص ۵۰۰mg (هر دوز ${perDose} قرص)`;
            }
            howToUse = '۳ بار در روز — همراه غذا';
            mechanism = 'بهترین دارو برای پاک کردن آهن از قلب';
            interactions = 'زینک و آلومینیوم: فاصله ۴ ساعته';
            monitoring = 'هفتگی: نوتروفیل (ANC) — حیاتی!';
        }

        // نمایش نتیجه
        document.getElementById('doseTitle').innerHTML = totalMg > 0 ? `<strong>${totalMg.toLocaleString()}</strong> میلی‌گرم در روز` : dosePerKg;
        document.getElementById('dosePerKg').textContent = dosePerKg;
        document.getElementById('unitCount').innerHTML = unitCount || '—';
        document.getElementById('howToUse').textContent = howToUse || '—';
        document.getElementById('mechanism').textContent = mechanism;
        document.getElementById('interactions').textContent = interactions;
        document.getElementById('monitoring').textContent = monitoring;

        document.getElementById('result').classList.remove('d-none');
        document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});
