// تالادوز — main.js نسخه نهایی و کامل (کارکرده ۱۰۰٪)
// حسین حوت — ۲۰۲۵

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
        { name: 'اسورال ۵۰۰mg', strength: 500 },
        { name: 'نانوجید ۹۰mg', strength: 90 },
        { name: 'الیرون ۱۲۵mg', strength: 125 }
    ],
    deferiprone: [
        { name: 'قرص روکشدار ال‌وان ۵۰۰mg (اوه سینا)', strength: 500 },
        { name: 'قرص جوشان آوی دفرون ۵۰۰mg (اوه سینا)', strength: 500 }
    ]
};

document.addEventListener('DOMContentLoaded', function () {
    const drugSelect = document.getElementById('drug');
    const brandSelect = document.getElementById('brand');
    const brandGroup = document.getElementById('brandGroup');

    // بروزرسانی برندها
    drugSelect.addEventListener('change', function () {
        const drug = this.value;
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

    // فریتین — رنگ و پیام
    const ferritinInput = document.getElementById('ferritin');
    const ferritinBar = document.getElementById('ferritinBar');
    const ferritinMsg = document.getElementById('ferritinMsg');

    ferritinInput.addEventListener('input', function () {
        const val = parseFloat(this.value) || 0;
        let width, bg, msg;

        if (val < 1000) { width = '30%'; bg = 'bg-success'; msg = 'عالی! بار آهن کنترل‌شده'; }
        else if (val < 2500) { width = '65%'; bg = 'bg-warning'; msg = 'خوب، اما مراقب باشید'; }
        else { width = '100%'; bg = 'bg-danger'; msg = 'بالا — اما قابل کنترل است!'; }

        ferritinBar.style.width = width;
        ferritinBar.className = `progress-bar ${bg} rounded-pill`;
        ferritinMsg.textContent = msg;
        ferritinMsg.className = val < 1000 ? 'text-success' : val < 2500 ? 'text-warning' : 'text-danger';
        ferritinMsg.classList.add('fw-bold');
    });

    // فرم — محاسبه اصلی
    document.getElementById('calcForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const drug = document.getElementById('drug').value;
        const weight = parseFloat(document.getElementById('weight').value);
        const age = parseInt(document.getElementById('age').value);
        const ferritin = parseFloat(document.getElementById('ferritin').value);
        const isTransfusion = document.querySelector('input[name="type"]:checked').value === 'transfusion';
        const brandStrength = parseInt(document.getElementById('brand').value) || 500;
        const brandName = document.getElementById('brand').selectedOptions[0]?.dataset.name || 'استاندارد';

        if (!drug || !weight || !age || !ferritin) {
            alert('لطفاً همه فیلدها را پر کنید');
            return;
        }

        let totalMg = 0, dosePerKgText = '', unitCount = '', howToUse = '', suggestion = '';
        let mechanism = '', interactions = '', monitoring = '';

        if (drug === 'deferoxamine') {
            let base = isTransfusion ? 40 : 25;
            const min = 20, max = age < 18 ? 40 : 60;

            if (age < 3) {
                dosePerKgText = 'ایمنی زیر ۳ سال تأیید نشده';
            } else {
                if (ferritin > 2500) base = Math.min(base * 1.2, max);
                if (ferritin < 1000) base = Math.max(base * 0.8, min);
                totalMg = Math.round(base * weight);
                dosePerKgText = `${base} mg/kg/روز`;

                if (brandStrength === 2000) {
                    const full = Math.floor(totalMg / 2000);
                    const rest = totalMg % 2000;
                    unitCount = full > 0 ? `${full} ویال ۲g` : '';
                    if (rest > 0) unitCount += `${unitCount ? ' + ' : ''}${Math.ceil(rest / 500)} ویال ۵۰۰mg`;
                    suggestion = 'پیشنهاد: برای دقت بیشتر، از ویال ۵۰۰mg استفاده کنید';
                } else {
                    unitCount = `${Math.ceil(totalMg / 500)} ویال ۵۰۰mg`;
                }
            }
            howToUse = 'زیرجلدی با پمپ — ۸-۱۲ ساعت — ۵-۷ روز در هفته';
            mechanism = 'آهن را از ادرار دفع می‌کند — عالی برای آهن داخل‌سلولی';
            interactions = 'ویتامین C مجاز (۱۰۰-۲۰۰mg) — در نارسایی قلبی ممنوع';
            monitoring = 'هر ۳ ماه: شنوایی و بینایی | هر ۶-۱۲ ماه: MRI T2* قلب';

        } else if (drug === 'deferasirox') {
            let base = isTransfusion ? 30 : 10;
            if (ferritin < 300) {
                dosePerKgText = 'قطع موقت — LIC چک شود';
            } else {
                if (ferritin > 2500) base = Math.min(base + 10, 40);
                if (ferritin < 1000) base = Math.max(base - 5, 7);
                totalMg = Math.round(base * weight);
                dosePerKgText = `${base} mg/kg/روز`;

                const tabs = Math.round(totalMg / brandStrength);
                unitCount = `${tabs} قرص ${brandStrength}mg`;
            }
            howToUse = 'خوراکی — یک‌بار در روز — با معده خالی';
            mechanism = 'دفع اصلی از مدفوع — راحت و روزانه یک دوز';
            interactions = 'آنتی‌اسید آلومینیوم‌دار ممنوع';
            monitoring = 'ماهانه: کلیه و کبد | هر ۶ ماه: LIC';

        } else if (drug === 'deferiprone') {
            if (age < 8 || ferritin < 500) {
                dosePerKgText = age < 8 ? 'ایمنی زیر ۸ سال تأیید نشده' : 'قطع موقت — ANC چک شود';
            } else {
                let base = ferritin > 2500 ? 85 : 75;
                totalMg = Math.round(base * weight);
                dosePerKgText = `مجموع ${base} mg/kg/روز (۳ دوز)`;
                const perDose = Math.round(totalMg / 3 / 500);
                unitCount = `${perDose * 3} قرص ۵۰۰mg (هر دوز ${perDose} قرص)`;
            }
            howToUse = 'خوراکی — ۳ بار در روز — با غذا';
            mechanism = 'بهترین دارو برای پاک کردن آهن قلب';
            interactions = 'زینک: فاصله ۴ ساعته';
            monitoring = 'هفتگی: نوتروفیل (ANC) — حیاتی!';
        }

        // نمایش نتیجه
        document.getElementById('doseTitle').textContent = totalMg > 0 ? `${totalMg.toLocaleString()} mg/روز` : dosePerKgText;
        document.getElementById('dosePerKg').textContent = dosePerKgText;
        document.getElementById('unitCount').innerHTML = totalMg > 0 ? `<strong>${unitCount}</strong>${suggestion ? `<br><small class="text-white-50 mt-2 d-block">پیشنهاد: ${suggestion}</small>` : ''}` : '—';
        document.getElementById('howToUse').textContent = totalMg > 0 ? howToUse : '';
        document.getElementById('mechanism').textContent = mechanism;
        document.getElementById('interactions').textContent = interactions;
        document.getElementById('monitoring').textContent = monitoring;

        document.getElementById('result').classList.remove('d-none');
        document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
});
