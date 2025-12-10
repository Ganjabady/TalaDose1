// داده‌های برندها (قدرت واحد mg) — بروز ۲۰۲۵
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
        { name: 'اسورال ۱۸۰mg (اسوه)', strength: 180 },
        { name: 'تالاجید ۳۶۰mg (روناک دارو)', strength: 360 },
        { name: 'اکسجید ۲۵۰mg (نوارتیس)', strength: 250 },
        { name: 'اسورال ۵۰۰mg (اسوه)', strength: 500 },
        { name: 'نانوجید ۹۰mg (زیست اروند)', strength: 90 },
        { name: 'جیدنیو ۱۸۰mg (نوارتیس)', strength: 180 },
        { name: 'جیدنیو ۳۶۰mg (نوارتیس)', strength: 360 },
        { name: 'الیرون ۱۲۵mg (ابوریحان)', strength: 125 }
    ],
    deferiprone: [
        { name: 'ال‌وان ۵۰۰mg (اوه سینا)', strength: 500 },
        { name: 'آوی دفرون ۵۰۰mg (زیست اروند)', strength: 500 },
        { name: 'Ferriprox ۵۰۰mg (ژنریک)', strength: 500 },
        { name: 'Ferriprox ۱۰۰۰mg (ژنریک)', strength: 1000 }
    ]
};

// بروزرسانی dropdown برند
document.addEventListener('DOMContentLoaded', function() {
    const drugSelect = document.getElementById('drug');
    const brandSelect = document.getElementById('brand');
    const brandGroup = document.getElementById('brandGroup');

    drugSelect.addEventListener('change', function() {
        const drug = this.value;
        brandSelect.innerHTML = '<option value="">انتخاب کنید...</option>';
        if (drug) {
            brands[drug].forEach(b => {
                const option = document.createElement('option');
                option.value = b.strength;
                option.dataset.name = b.name;
                option.textContent = b.name;
                brandSelect.appendChild(option);
            });
            brandGroup.style.display = 'block';
        } else {
            brandGroup.style.display = 'none';
        }
    });
});

// اسلایدر وزن native
const weightInput = document.getElementById('weight');
const weightSlider = document.getElementById('weightSlider');
weightSlider.addEventListener('input', function() {
    weightInput.value = this.value;
});
weightInput.addEventListener('input', function() {
    weightSlider.value = this.value;
});

// فریتین داینامیک (رنگ + پیام)
const ferritinInput = document.getElementById('ferritin');
const ferritinBar = document.getElementById('ferritinBar');
const ferritinMsg = document.getElementById('ferritinMsg');
ferritinInput.addEventListener('input', function() {
    const val = parseFloat(this.value) || 0;
    let width = 0, colorClass = '', msg = '';
    if (val < 1000) { 
        width = 30; 
        colorClass = 'ferritin-low'; 
        msg = 'عالی! بار آهن شما کنترل‌شده است — ادامه بدید تا سالم بمونید 😊'; 
    } else if (val < 2500) { 
        width = 60; 
        colorClass = 'ferritin-mid'; 
        msg = 'خوب، اما مراقب باشید — با درمان منظم، می‌تونید پایین‌تر بیارید.'; 
    } else { 
        width = 100; 
        colorClass = 'ferritin-high'; 
        msg = 'بالا رفته، اما نگران نباشید! با درمان سریع و دقیق، کاملاً قابل کنترل است — قلب و کبدتون رو نجات بدید 💪'; 
    }
    ferritinBar.style.width = width + '%';
    ferritinBar.className = `progress-bar ferritin-${colorClass}`;
    ferritinMsg.textContent = msg;
    ferritinMsg.className = colorClass.includes('high') ? 'text-danger fw-bold' : colorClass.includes('low') ? 'text-success fw-bold' : 'text-warning fw-bold';
});

// محاسبه اصلی
document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const drug = document.getElementById('drug').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const ferritin = parseFloat(document.getElementById('ferritin').value);
    const isTransfusion = document.getElementById('transfusion').checked;
    const brandStrength = parseInt(document.getElementById('brand').value) || 500;
    const brandName = document.getElementById('brand').selectedOptions[0]?.dataset.name || 'استاندارد';

    if (!drug || !weight || !age || !ferritin) {
        alert('لطفاً همه فیلدها را پر کنید!');
        return;
    }

    let dose = '', mechanism = '', interactions = '', warnings = '', monitoring = '', unitCount = '', suggestion = '', dosePerKg = '';

    if (drug === 'deferoxamine') {
        let baseDose = isTransfusion ? 40 : 25;
        const minDose = 20, maxDose = age < 18 ? 40 : 60;
        if (age < 3) { dose = 'برای کودکان زیر ۳ سال، با پزشک مشورت کنید — ایمنی کامل تأیید نشده.'; }
        else {
            baseDose = ferritin > 2500 ? Math.min(baseDose * 1.2, maxDose) : ferritin < 1000 ? Math.max(baseDose * 0.8, minDose) : baseDose;
            const totalMg = Math.round(baseDose * weight);
            dosePerKg = `${baseDose.toFixed(0)} mg/kg`;
            unitCount = calculateVialCombo(totalMg, brandStrength, brandName);
            suggestion = brandStrength === 2000 ? ` (برای دقت بیشتر، می‌تونید ۷ ویال ۵۰۰mg از برند استاندارد مثل دسفرال استفاده کنید — دوز دقیق‌تر می‌شه)` : '';
            dose = `دوز روزانه: ${totalMg} mg (یعنی ${dosePerKg} به ازای هر کیلو وزن — در محدوده ایمن ${minDose}-${maxDose} mg/kg). روش: زیرجلدی با پمپ انفوزیون طی ۸ تا ۱۲ ساعت، ۵-۷ روز در هفته.<br><strong>تعداد ویال: ${unitCount}</strong>${suggestion}`;
        }
        mechanism = 'آهن اضافی رو به دام می‌ندازه و از ادرار خارج می‌کنه — عالی برای آهن داخل سلول‌ها.';
        interactions = 'ویتامین C (۱۰۰-۲۰۰ mg در روز) دفع آهن رو بیشتر می‌کنه، اما اگر مشکل قلبی دارید، ممنوعه.';
        warnings = 'درد محل تزریق شایع — اگر فریتین زیر ۵۰۰، دوز رو کم کنید تا مسمومیت پیش نیاد.';
        monitoring = 'هر ۳ ماه: تست شنوایی و بینایی (ممکنه تغییر کنه). ماهانه: فریتین و LIC (آهن کبد). هر ۳ ماه: کلیه و کبد. اگر تب یا درد شکم داشتید، فوری به پزشک بگید.';

    } else if (drug === 'deferasirox') {
        let baseDose = isTransfusion ? 30 : 10;
        const minDose = 7, maxDose = 40;
        if (ferritin < 300) { dose = 'در حال حاضر، درمان رو موقتاً قطع کنید و LIC (آهن کبد) چک بشه.'; }
        else {
            baseDose = ferritin > 2500 ? Math.min(baseDose + 10, maxDose) : ferritin < 1000 ? Math.max(baseDose - 5, minDose) : baseDose;
            const totalMg = Math.round(baseDose * weight);
            dosePerKg = `${baseDose.toFixed(0)} mg/kg`;
            const tablets = calculateTabletCombo(totalMg, brandStrength);
            unitCount = `${tablets.num} قرص ${brandStrength}mg (${brandName})`;
            if (tablets.remainder > 0) unitCount += ` + ${Math.ceil(tablets.remainder / 90)} قرص ۹۰mg`;
            dose = `دوز روزانه: ${totalMg} mg (یعنی ${dosePerKg} — در محدوده ${minDose}-${maxDose} mg/kg). روش: خوراکی، یک‌بار در روز با معده خالی (یا وعده سبک).<br><strong>تعداد قرص: ${unitCount}</strong>`;
        }
        mechanism = 'به آهن می‌چسبه و بیشتر از مدفوع خارج می‌کنه — راحت و روزانه یک دونه.';
        interactions = 'از آنتی‌اسیدهای حاوی آلومینیوم دوری کنید. اگر ریفامپین می‌خورید، دوز رو ۵۰% بیشتر کنید.';
        warnings = 'اگر کراتینین کلیه بالا رفت، فوری قطع کنید. خونریزی معده ممکنه پیش بیاد.';
        monitoring = 'ماهانه: کراتینین کلیه و فریتین. هر ۶ ماه: LIC و تست قلب (MRI T2*). هر ۳-۴ هفته: کبد. اگر راش پوستی یا تهوع شدید، به پزشک اطلاع بدید.';

    } else if (drug === 'deferiprone') {
        if (age < 8) { dose = 'برای زیر ۸ سال، با پزشک مشورت کنید — ایمنی کامل تأیید نشده.'; }
        else if (ferritin < 500) { dose = 'موقتاً قطع کنید و نوتروفیل (ANC) چک بشه.'; }
        else {
            let baseDose = 75;
            const minDose = 75, maxDose = 99;
            baseDose = ferritin > 2500 ? Math.min(baseDose + 10, maxDose) : ferritin < 1000 ? Math.max(baseDose - 10, minDose) : baseDose;
            const totalMg = Math.round(baseDose * weight);
            dosePerKg = `${(baseDose / 3).toFixed(0)} mg/kg هر دوز (مجموع ${baseDose.toFixed(0)} mg/kg در روز)`;
            const perDose = totalMg / 3;
            const tabletsPerDose = Math.round(perDose / brandStrength);
            unitCount = `${tabletsPerDose * 3} قرص ${brandStrength}mg در روز (هر دوز ${tabletsPerDose} قرص، ${brandName})`;
            dose = `دوز روزانه: ${totalMg} mg (یعنی ${dosePerKg} — در محدوده ${minDose}-${maxDose} mg/kg). روش: خوراکی، ۳ بار در روز با غذا.<br><strong>تعداد قرص: ${unitCount}</strong>`;
        }
        mechanism = 'آهن رو از قلب پاک می‌کنه — بهترین برای جلوگیری از مشکلات قلبی.';
        interactions = 'از زینک یا آلومینیوم ۴ ساعت فاصله بدید. والپروئیک اسید: نظارت بیشتر لازم.';
        warnings = 'درد مفاصل یا تغییر رنگ ادرار (قهوه‌ای) شایع — اگر تب یا گلودرد، فوری چک کنید.';
        monitoring = 'هفتگی: شمارش نوتروفیل (ANC) — خطر عفونت. هر ۲-۳ ماه: فریتین. هر ۳ ماه: کبد و قلب (MRI T2*). اگر ANC پایین، موقتاً قطع. ترکیب با دفراسیروکس برای موارد شدید عالیه.';
    }

    document.getElementById('doseOutput').innerHTML = `<i class="bi bi-check-circle"></i> <strong>دوز پیشنهادی (تنظیم‌شده با فریتین ${ferritin}):</strong><br>${dose}`;
    document.getElementById('mechanism').textContent = mechanism;
    document.getElementById('interactions').textContent = interactions;
    document.getElementById('warnings').textContent = warnings;
    document.getElementById('monitoring').textContent = monitoring;
    document.getElementById('result').classList.remove('d-none');
    window.scrollTo({ top: document.getElementById('result').offsetTop - 100, behavior: 'smooth' });
});

// توابع کمکی
function calculateVialCombo(totalMg, strength, brandName) {
    let unitCount = '';
    if (strength === 2000) {
        const num2g = Math.floor(totalMg / 2000);
        const remainder = totalMg % 2000;
        unitCount = `${num2g} ویال ۲۰۰۰mg (${brandName})`;
        if (remainder > 0) unitCount += ` + ${Math.ceil(remainder / 500)} ویال ۵۰۰mg`;
    } else {
        const num500 = Math.ceil(totalMg / 500);
        unitCount = `${num500} ویال ۵۰۰mg (${brandName})`;
    }
    return unitCount;
}

function calculateTabletCombo(totalMg, strength) {
    const num = Math.floor(totalMg / strength);
    const remainder = totalMg % strength;
    return { num: num, remainder: remainder };
}
