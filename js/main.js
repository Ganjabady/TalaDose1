// داده‌های برندها (قدرت واحد mg) — بروز ۲۰۲۵ با جیدنیو و Hospira
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

// اسلایدر وزن native (بدون noUiSlider)
const weightInput = document.getElementById('weight');
const weightSlider = document.getElementById('weightSlider');
weightSlider.addEventListener('input', function() {
    weightInput.value = this.value;
});
weightInput.addEventListener('input', function() {
    weightSlider.value = this.value;
});

// بار فریتین
document.getElementById('ferritin').addEventListener('input', function() {
    const val = parseFloat(this.value) || 0;
    const bar = document.getElementById('ferritinBar');
    let width = 0, color = '';
    if (val < 500) { width = 20; color = '#f44336'; }
    else if (val < 2000) { width = 50; color = '#ff9800'; }
    else { width = 100; color = '#4caf50'; }
    bar.style.width = width + '%';
    bar.style.background = color;
});

// محاسبه اصلی (event listener ایمن)
document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault(); // جلوگیری از reload
    console.log('فرم سابمیت شد!'); // برای دیباگ — حذف کن بعد تست

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

    let dose = '', mechanism = '', interactions = '', warnings = '', unitCount = '';

    if (drug === 'deferoxamine') {
        let baseDose = isTransfusion ? 40 : 25;
        if (age < 3) { dose = 'ایمنی <۳ سال تأیید نشده — مشورت فوری'; }
        else {
            baseDose = ferritin > 2000 ? baseDose * 1.2 : baseDose;
            const totalMg = Math.round(baseDose * weight);
            const vials = calculateVialCombo(totalMg, brandStrength);
            unitCount = `${vials.num} ${vials.type} ${brandStrength}mg (${brandName})`;
            if (vials.remainder > 0) unitCount += ` + ${Math.ceil(vials.remainder / 500)} ویال ۵۰۰mg`;
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
            const tablets = calculateTabletCombo(totalMg, brandStrength);
            unitCount = `${tablets.num} قرص ${brandStrength}mg (${brandName})`;
            if (tablets.remainder > 0) unitCount += ` + ${Math.ceil(tablets.remainder / 90)} قرص ۹۰mg`;
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
            baseDose = ferritin > 2000 ? Math.min(baseDose + 10, 99) : baseDose;
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

// توابع کمکی
function calculateVialCombo(totalMg, strength) {
    if (strength === 2000) {
        const num2g = Math.floor(totalMg / 2000);
        const remainder = totalMg % 2000;
        return { num: num2g, type: 'ویال', remainder: remainder };
    } else {
        const num500 = Math.ceil(totalMg / 500);
        return { num: num500, type: 'ویال', remainder: 0 };
    }
}

function calculateTabletCombo(totalMg, strength) {
    const num = Math.floor(totalMg / strength);
    const remainder = totalMg % strength;
    return { num: num, remainder: remainder };
}
