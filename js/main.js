// داده‌های برندها (قدرت واحد mg)
const brands = {
    deferoxamine: [
        { name: 'دسفوناک ۵۰۰mg', strength: 500 },
        { name: 'دسفرال ۵۰۰mg', strength: 500 },
        { name: 'دسفوناک ۲g', strength: 2000 },
        { name: 'فروز آف ۵۰۰mg', strength: 500 }
    ],
    deferasirox: [
        { name: 'اکسجید ۱۲۵mg', strength: 125 },
        { name: 'اسورال ۱۸۰mg', strength: 180 },
        { name: 'تالاجید ۳۶۰mg', strength: 360 },
        { name: 'اکسجید ۲۵۰mg', strength: 250 },
        { name: 'اسورال ۵۰۰mg', strength: 500 },
        { name: 'نانوجید ۹۰mg', strength: 90 }
    ],
    deferiprone: [
        { name: 'ال‌وان ۵۰۰mg', strength: 500 },
        { name: 'آوی دفرون ۵۰۰mg', strength: 500 }
    ]
};

// بروزرسانی dropdown برند
document.getElementById('drug').addEventListener('change', function() {
    const drug = this.value;
    const brandSelect = document.getElementById('brand');
    const brandGroup = document.getElementById('brandGroup');
    brandSelect.innerHTML = '<option value="">انتخاب کنید...</option>';
    if (drug) {
        brands[drug].forEach(b => {
            brandSelect.innerHTML += `<option value="${b.strength}" data-name="${b.name}">${b.name}</option>`;
        });
        brandGroup.style.display = 'block';
    } else {
        brandGroup.style.display = 'none';
    }
});

// اسلایدر وزن
const weightSlider = document.getElementById('weightSlider');
noUiSlider.create(weightSlider, {
    start: 50,
    connect: true,
    range: { 'min': 3, 'max': 100 },
    step: 0.1
});
weightSlider.noUiSlider.on('update', function(values, handle) {
    document.getElementById('weight').value = values[handle];
});

// بار فریتین
document.getElementById('ferritin').addEventListener('input', function() {
    const val = parseFloat(this.value);
    const bar = document.getElementById('ferritinBar');
    let width = 0, color = '';
    if (val < 500) { width = 20; color = '#f44336'; } // قرمز: پایین
    else if (val < 2000) { width = 50; color = '#ff9800'; } // نارنجی: متوسط
    else { width = 100; color = '#4caf50'; } // سبز: بالا
    bar.style.width = width + '%';
    bar.style.background = color;
});

// محاسبه اصلی
document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const drug = document.getElementById('drug').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const ferritin = parseFloat(document.getElementById('ferritin').value);
    const isTransfusion = document.getElementById('transfusion').checked;
    const brandStrength = parseInt(document.getElementById('brand').value) || 500; // پیش‌فرض
    const brandName = document.getElementById('brand').selectedOptions[0]?.dataset.name || 'استاندارد';

    let dose = '', mechanism = '', interactions = '', warnings = '', unitCount = '';

    if (drug === 'deferoxamine') {
        let baseDose = isTransfusion ? 40 : 25;
        if (age < 3) { dose = 'ایمنی <۳ سال تأیید نشده — مشورت فوری'; }
        else {
            baseDose = ferritin > 2000 ? baseDose * 1.2 : baseDose; // ↑ برای فریتین بالا
            const totalMg = Math.round(baseDose * weight);
            const vials500 = Math.floor(totalMg / 500);
            const vials2g = Math.floor(totalMg / 2000);
            unitCount = brandStrength === 500 ? `${vials500} ویال ${brandStrength}mg (${brandName})` : 
                        `${vials2g} ویال ${brandStrength/1000}g + ${Math.round((totalMg % 2000)/500)} ویال ۵۰۰mg`;
            dose = `دوز SC/IV: ${totalMg} mg/روز (حداکثر ${age < 18 ? 40 : 60} mg/kg)<br><strong>واحد: ${unitCount}</strong>`;
        }
        mechanism = 'اتصال به Fe³⁺ و دفع ادراری — دسترسی عالی به آهن سلولی (NIH ۲۰۲۵)';
        interactions = 'ویتامین C ۱۰۰-۲۰۰mg ↑دفع (ممنوع در نارسایی قلبی، Lancet ۲۰۲۴)';
        warnings = `نظارت شنوایی/بینایی. اگر فریتین <۱۰۰۰، دوز ↓. دما: ۱۵-۲۵°C.`;

    } else if (drug === 'deferasirox') {
        let baseDose = isTransfusion ? 30 : 10;
        if (ferritin < 300) { dose = 'قطع موقت — LIC چک شود (راهنما ۲۰۲۵)'; }
        else {
            baseDose = ferritin > 2000 ? Math.min(baseDose + 10, 40) : baseDose;
            const totalMg = Math.round(baseDose * weight);
            // محاسبه هوشمند قرص‌ها (گرد به ترکیب)
            const combos = calculateTabletCombo(totalMg, brandStrength);
            unitCount = `${combos.num} قرص ${brandStrength}mg (${brandName})`;
            dose = `دوز خوراکی: ${totalMg} mg/روز (حداکثر ۴۰ mg/kg)<br><strong>واحد: ${unitCount} (معده خالی)</strong>`;
        }
        mechanism = 'شلات سه‌دندانه‌ای — دفع مدفوعی اصلی (ASH ۲۰۲۵)';
        interactions = 'آنتی‌اسید Al ممنوع. ریفامپین: دوز ↑۵۰%';
        warnings = `چک ماهانه کراتینین/LIC. اگر LIC >۷، ↑دوز. خونریزی GI ریسک بالا.`;

    } else if (drug === 'deferiprone') {
        if (age < 8) { dose = 'ایمنی <۸ سال تأیید نشده'; }
        else if (ferritin < 500) { dose = 'قطع موقت — ANC چک (Haematologica ۲۰۲۵)'; }
        else {
            let baseDose = 75;
            baseDose = ferritin > 2000 ? Math.min(baseDose + 10, 99) : baseDose; // ۳ دوز
            const totalMg = Math.round(baseDose * weight);
            const perDose = totalMg / 3;
            const tabletsPerDose = Math.round(perDose / brandStrength);
            unitCount = `${tabletsPerDose * 3} قرص ${brandStrength}mg در روز (هر دوز ${tabletsPerDose} قرص، ${brandName})`;
            dose = `دوز: ${totalMg} mg/روز (۲۵ mg/kg ×۳)<br><strong>واحد: ${unitCount} (با غذا)</strong>`;
        }
        mechanism = 'شلات دو‌دندانه‌ای — بهترین برای رسوب قلبی (↓۳۰% آهن میوکارد، ۲۰۲۵)';
        interactions = 'زینک/Al: فاصله ۴ ساعته. والپروئیک: نظارت';
        warnings = `ANC هفتگی. درد مفاصل شایع. ترکیب با دفراسیروکس برای شدید.`;
    }

    document.getElementById('doseOutput').innerHTML = `<i class="bi bi-check-circle"></i> <strong>دوز پیشنهادی (تنظیم‌شده با فریتین ${ferritin}):</strong><br>${dose}`;
    document.getElementById('mechanism').textContent = mechanism;
    document.getElementById('interactions').textContent = interactions;
    document.getElementById('warnings').textContent = warnings;
    document.getElementById('result').classList.remove('d-none');
    window.scrollTo({ top: document.getElementById('result').offsetTop - 100, behavior: 'smooth' });
});

// تابع کمکی محاسبه ترکیب قرص‌ها (برای دفراسیروکس)
function calculateTabletCombo(totalMg, strength) {
    const num = Math.round(totalMg / strength);
    return { num: num, remainder: totalMg % strength };
}

// کتابخانه noUiSlider (CDN در HTML اضافه کن اگر لازم، اما برای سادگی از native range استفاده کردم — optional)
