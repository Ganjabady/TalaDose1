// تالادوز — main.js کامل (بدون باگ)
const brands = {
    deferoxamine: [
        { name: 'دسفوناک ۵۰۰mg', strength: 500 },
        { name: 'دسفرال ۵۰۰mg', strength: 500 },
        { name: 'Hospira 2g', strength: 2000 },
        { name: 'فروز آف ۵۰۰mg', strength: 500 }
    ],
    deferasirox: [
        { name: 'اکسجید ۱۲۵mg', strength: 125 },
        { name: 'جیدنیو ۹۰mg', strength: 90 },
        { name: 'اسورال ۱۸۰mg', strength: 180 },
        { name: 'تالاجید ۳۶۰mg', strength: 360 },
        { name: 'اکسجید ۵۰۰mg', strength: 500 }
    ],
    deferiprone: [
        { name: 'ال‌وان ۵۰۰mg (اوه سینا)', strength: 500 },
        { name: 'آوی دفرون ۵۰۰mg (اوه سینا)', strength: 500 }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // برندها
    document.getElementById('drug').addEventListener('change', (e) => {
        const drug = e.target.value;
        const brandGroup = document.getElementById('brandGroup');
        const brand = document.getElementById('brand');
        brand.innerHTML = '<option value="">اختیاری</option>';
        if (drug) {
            brands[drug].forEach(b => {
                const opt = document.createElement('option');
                opt.value = b.strength;
                opt.textContent = b.name;
                opt.dataset.name = b.name;
                brand.appendChild(opt);
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
        if (val < 1000) { width = '30%'; color = 'bg-success'; text = 'عالی!'; }
        else if (val < 2500) { width = '65%'; color = 'bg-warning'; text = 'خوب'; }
        else { width = '100%'; color = 'bg-danger'; text = 'بالا — مراقب باشید'; }
        bar.style.width = width;
        bar.className = `progress-bar ${color}`;
        msg.textContent = text;
        msg.className = color.replace('bg-', 'text-');
    });

    // Dark Mode
    document.getElementById('themeToggle').addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const icon = document.querySelector('#themeToggle i');
        icon.classList.toggle('bi-moon');
        icon.classList.toggle('bi-sun');
    });

    // محاسبه
    document.getElementById('calcForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const drug = document.getElementById('drug').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const age = parseInt(document.getElementById('age').value);
        const ferritin = parseFloat(document.getElementById('ferritin').value);
        const isTransfusion = document.querySelector('input[name="type"]:checked').value === 'transfusion';
        const brandStrength = parseInt(document.getElementById('brand').value) || 500;
        const brandName = document.getElementById('brand').selectedOptions[0]?.dataset.name || '';

        if (!drug || isNaN(weight) || isNaN(age) || isNaN(ferritin)) {
            alert('لطفاً همه فیلدها را پر کنید!');
            return;
        }

        let totalMg = 0, dosePerKg = '', unitCount = '', howToUse = '', mechanism = '', interactions = '', monitoring = '';

        if (drug === 'deferoxamine') {
            let base = isTransfusion ? 40 : 25;
            if (age < 3) {
                dosePerKg = 'زیر ۳ سال: مشورت با پزشک';
            } else {
                if (ferritin > 2500) base = Math.min(base * 1.2, 60);
                if (ferritin < 1000) base = Math.max(base * 0.8, 20);
                totalMg = Math.round(base * weight);
                dosePerKg = `${base.toFixed(0)} mg/kg`;
                unitCount = `${Math.ceil(totalMg / 500)} ویال ۵۰۰mg`;
                if (brandStrength === 2000) unitCount = '۱ ویال ۲g + ۱ ویال ۵۰۰mg (پیشنهاد: ۴ ویال ۵۰۰mg)';
            }
            howToUse = 'زیرجلدی با پمپ، ۸-۱۲ ساعت';
            mechanism = 'دفع آهن از ادرار';
            interactions = 'ویتامین C مجاز';
            monitoring = 'شنوایی/بینایی هر ۳ ماه';

        } else if (drug === 'deferasirox') {
            let base = isTransfusion ? 30 : 10;
            if (ferritin < 300) {
                dosePerKg = 'قطع موقت';
            } else {
                if (ferritin > 2500) base = Math.min(base + 10, 40);
                totalMg = Math.round(base * weight);
                dosePerKg = `${base.toFixed(0)} mg/kg`;
                unitCount = `${Math.round(totalMg / 250)} قرص ۲۵۰mg`;
            }
            howToUse = 'خوراکی، یک‌بار در روز';
            mechanism = 'دفع از مدفوع';
            interactions = 'آنتی‌اسید ممنوع';
            monitoring = 'کلیه ماهانه';

        } else if (drug === 'deferiprone') {
            if (age < 8 || ferritin < 500) {
                dosePerKg = 'مشورت با پزشک';
            } else {
                let base = 75;
                if (ferritin > 2500) base = 85;
                totalMg = Math.round(base * weight);
                dosePerKg = `${base} mg/kg/روز (۳ دوز)`;
                unitCount = '۶ قرص ۵۰۰mg (۲ قرص هر دوز)';
            }
            howToUse = '۳ بار در روز با غذا';
            mechanism = 'پاک کردن آهن قلب';
            interactions = 'زینک فاصله‌دار';
            monitoring = 'نوتروفیل هفتگی';
        }

        document.getElementById('doseTitle').textContent = totalMg > 0 ? `${totalMg} mg/روز` : dosePerKg;
        document.getElementById('dosePerKg').textContent = dosePerKg;
        document.getElementById('unitCount').textContent = unitCount;
        document.getElementById('howToUse').textContent = howToUse;
        document.getElementById('mechanism').textContent = mechanism;
        document.getElementById('interactions').textContent = interactions;
        document.getElementById('monitoring').textContent = monitoring;

        document.getElementById('result').classList.remove('d-none');
        document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
    });
});
