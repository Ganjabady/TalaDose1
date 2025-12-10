// تالادوز — main.js نسخه نهایی (۲۰۲۵.۵)
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
        { name: 'اکسجید ۱۲۵mg (نوارتیس)', strength: 125 },
        { name: 'جیدنیو ۹۰mg (نوارتیس)', strength: 90 },
        { name: 'جیدنیو ۱۸۰mg (نوارتیس)', strength: 180 },
        { name: 'جیدنیو ۳۶۰mg (نوارتیس)', strength: 360 },
        { name: 'اسورال ۱۸۰mg (اسوه)', strength: 180 },
        { name: 'تالاجید ۳۶۰mg (روناک دارو)', strength: 360 },
        { name: 'اکسجید ۲۵۰mg (نوارتیس)', strength: 250 },
        { name: 'اسورال ۵۰۰mg (اسوه)', strength: 500 },
        { name: 'نانوجید ۹۰mg (زیست اروند)', strength: 90 },
        { name: 'الیرون ۱۲۵mg (ابوریحان)', strength: 125 }
    ],
    deferiprone: [
        { name: 'قرص روکشدار ال‌وان ۵۰۰mg (اوه سینا)', strength: 500 },
        { name: 'قرص جوشان آوی دفرون ۵۰۰mg (اوه سینا)', strength: 500 }
    ]
};

// بروزرسانی لیست برندها
document.addEventListener('DOMContentLoaded', function () {
    const drugSelect = document.getElementById('drug');
    const brandSelect = document.getElementById('brand');
    const brandGroup = document.getElementById('brandGroup');

    drugSelect.addEventListener('change', function () {
        const drug = this.value;
        brandSelect.innerHTML = '<option value="">انتخاب کنید (اختیاری)</option>';
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
});

// فریتین — رنگ + پیام هوشمند
const ferritinInput = document.getElementById('ferritin');
const ferritinBar = document.getElementById('ferritinBar');
const ferritinMsg = document.getElementById('ferritinMsg');

ferritinInput.addEventListener('input', function () {
    const val = parseFloat(this.value) || 0;
    let width, bgClass, message;

    if (val < 1000) {
        width = '30%';
        bgClass = 'bg-success';
        message = 'عالی! بار آهن کنترل‌شده است — ادامه بدید';
    } else if (val < 2500) {
        width = '65%';
        bgClass = 'bg-warning';
        message = 'خوب است، اما با درمان منظم می‌تونید بهتر هم بشه';
    } else {
        width = '100%';
        bgClass = 'bg-danger';
        message = 'بالا رفته — اما با درمان دقیق، کاملاً قابل کنترل است. ناامید نشید!';
    }

    ferritinBar.style.width = width;
    ferritinBar.className = `progress-bar ${bgClass}`;
    ferritinMsg.textContent = message;
    ferritinMsg.className = val < 1000 ? 'text-success' : val < 2500 ? 'text-warning' : 'text-danger';
    ferritinMsg.classList.add('fw-bold');
});

// محاسبه اصلی
document.getElementById('calcForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const drug = document.getElementById('drug').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const ferritin = parseFloat(document.getElementById('ferritin').value);
    const isTransfusion = document.querySelector('input[name="type"]:checked').value === 'transfusion';
    const brandStrength = parseInt(document.getElementById('brand').value) || 500;
    const brandName = document.getElementById('brand').selectedOptions[0]?.dataset.name || 'استاندارد';

    if (!drug || isNaN(weight) || isNaN(age) || isNaN(ferritin)) {
        alert('لطفاً همه اطلاعات را وارد کنید');
        return;
    }

    let totalMg, dosePerKgText, unitCount = '', howToUse = '', suggestion = '';
    let mechanism = '', interactions = '', monitoring = '';

    // دفروکسامین
    if (drug === 'deferoxamine') {
        let base = isTransfusion ? 40 : 25;
        const min = 20, max = age < 18 ? 40 : 60;

        if (age < 3) {
            totalMg = 0;
            dosePerKgText = 'ایمنی زیر ۳ سال تأیید نشده';
        } else {
            if (ferritin > 2500) base = Math.min(base * 1.2, max);
            if (ferritin < 1000) base = Math.max(base * 0.8, min);
            totalMg = Math.round(base * weight);
            dosePerKgText = `${base} mg/kg/روز`;

            // محاسبه ویال
            if (brandStrength === 2000) {
                const full2g = Math.floor(totalMg / 2000);
                const rest = totalMg % 2000;
                unitCount = full2g > 0 ? `${full2g} ویال ۲ گرمی` : '';
                if (rest > 0) unitCount += `${unitCount ? ' + ' : ''}${Math.ceil(rest / 500)} ویال ۵۰۰mg`;
                suggestion = '<br><small class="text-light opacity-75">پیشنهاد: برای دقت بیشتر، از ویال‌های ۵۰۰mg استفاده کنید</small>';
            } else {
                unitCount = `${Math.ceil(totalMg / 500)} ویال ۵۰۰mg`;
            }
        }

        howToUse = 'زیرجلدی با پمپ انفوزیون — ۸ تا ۱۲ ساعت — ۵ تا ۷ روز در هفته';
        mechanism = 'آهن اضافی را به دام می‌اندازد و از ادرار دفع می‌کند — دسترسی عالی به آهن داخل‌سلولی';
        interactions = 'ویتامین C (۱۰۰-۲۰۰ mg روزانه) دفع را افزایش می‌دهد — در مشکلات قلبی ممنوع';
        monitoring = 'هر ۳ ماه: شنوایی و بینایی | ماهانه: فریتین | هر ۶-۱۲ ماه: MRI T2* قلب (TIF ۲۰۲۵)';

    // دفراسیروکس
    } else if (drug === 'deferasirox') {
        let base = isTransfusion ? 30 : 10;
        const min = 7, max = 40;

        if (ferritin < 300) {
            totalMg = 0;
            dosePerKgText = 'قطع موقت درمان — LIC چک شود';
        } else {
            if (ferritin > 2500) base = Math.min(base + 10, max);
            if (ferritin < 1000) base = Math.max(base - 5, min);
            totalMg = Math.round(base * weight);
            dosePerKgText = `${base} mg/kg/روز`;

            const tablets = Math.round(totalMg / brandStrength);
            const remainder = totalMg % brandStrength;
            unitCount = `${tablets} قرص ${brandStrength}mg`;
            if (remainder > 90) unitCount += ` + ۱ قرص ۹۰mg`;
        }

        howToUse = 'خوراکی — یک‌بار در روز — با معده خالی یا وعده سبک';
        mechanism = 'اتصال قوی به آهن — دفع اصلی از مدفوع';
        interactions = 'آنتی‌اسید آلومینیوم‌دار ممنوع — ریفامپین: دوز ↑۵۰%';
        monitoring = 'ماهانه: کراتینین و فریتین | هر ۶ ماه: LIC | هر ۶-۱۲ ماه: MRI T2* قلب';

    // دفریپرون
    } else if (drug === 'deferiprone') {
        if (age < 8) {
            totalMg = 0;
            dosePerKgText = 'ایمنی زیر ۸ سال تأیید نشده';
        } else if (ferritin < 500) {
            totalMg = 0;
            dosePerKgText = 'قطع موقت — ANC چک شود';
        } else {
            let base = 75;
            const max = 99;
            if (ferritin > 2500) base = Math.min(base + 10, max);
            totalMg = Math.round(base * weight);
            dosePerKgText = `${Math.round(base/3)} mg/kg هر دوز — مجموع ${base} mg/kg/روز`;

            const perDose = totalMg / 3;
            const tabsPerDose = Math.round(perDose / brandStrength);
            unitCount = `${tabsPerDose * 3} قرص ۵۰۰mg در روز (هر دوز ${tabsPerDose} قرص)`;
        }

        howToUse = 'خوراکی — ۳ بار در روز — همراه غذا';
        mechanism = 'بهترین شلاتور برای پاک کردن آهن از قلب — کاهش ۳۰٪ آهن میوکارد';
        interactions = 'زینک و آلومینیوم: فاصله ۴ ساعته';
        monitoring = 'هفتگی: نوتروفیل (ANC) | هر ۲-۳ ماه: فریتین | هر ۶-۱۲ ماه: MRI T2* قلب';
    }

    // نمایش نهایی — شاهکار UX
    document.getElementById('doseTitle').textContent = totalMg > 0 ? `${totalMg.toLocaleString()} میلی‌گرم در روز` : dosePerKgText;
    document.getElementById('dosePerKg').textContent = totalMg > 0 ? dosePerKgText : '—';
    document.getElementById('unitCount').innerHTML = totalMg > 0 ? `<strong>${unitCount}</strong>${suggestion || ''}` : '—';
    document.getElementById('howToUse').textContent = totalMg > 0 ? howToUse : '';

    document.getElementById('mechanism').textContent = mechanism;
    document.getElementById('interactions').textContent = interactions;
    document.getElementById('monitoring').textContent = monitoring;

    document.getElementById('result').classList.remove('d-none');
    document.getElementById('consultAlert').classList.remove('d-none');

    // اسکرول نرم به نتیجه
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'center' });
});
