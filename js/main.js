document.getElementById('calcForm').addEventListener('submit', function(e) {
    e.preventDefault();

    e.preventDefault();

    const drug = document.getElementById('drug').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const age = parseInt(document.getElementById('age').value);
    const ferritin = parseFloat(document.getElementById('ferritin').value);
    const isTransfusion = document.getElementById('transfusion').checked;

    let dose = '', mechanism = '', interactions = '', warnings = '';

    if (drug === 'deferoxamine') {
        if (age < 3) {
            dose = 'ایمنی در کودکان زیر ۳ سال تأیید نشده';
        } else {
            const base = isTransfusion ? 40 : 25;
            const max = age < 18 ? 40 : 60;
            dose = `${(base * weight).toFixed(0)} میلی‌گرم روزانه زیرجلدی یا وریدی<br>حداکثر: ${max} mg/kg/روز`;
        }
        mechanism = 'اتصال قوی به آهن و دفع از ادرار — دسترسی عالی به آهن داخل‌سلولی';
        interactions = 'ویتامین C (۱۰۰-۲۰۰ mg) دفع را ↑ می‌کند ولی در نارسایی قلبی ممنوع';
        warnings = 'نظارت شنوایی و بینایی — دمای نگهداری ۱۵-۲۵°C';

    } else if (drug === 'deferasirox') {
        const base = isTransfusion ? 30 : 10;
        dose = `${(base * weight).toFixed(0)} میلی‌گرم روزانه خوراکی<br>حداکثر ۴۰ mg/kg — چک ماهانه کلیه و کبد ضروری`;
        mechanism = 'اتصال سه‌دندانه‌ای — دفع اصلی از مدفوع';
        interactions = 'آنتی‌اسید آلومینیوم‌دار ممنوع — ریفامپین دوز را ۵۰٪ ↑ می‌کند';
        warnings = 'خطر نارسایی حاد کلیه و کبد — خونریزی گوارشی';

    } else if (drug === 'deferiprone') {
        if (age < 8) {
            dose = 'ایمنی در زیر ۸ سال تأیید نشده';
        } else {
            dose = `${(75 * weight).toFixed(0)} میلی‌گرم روزانه (۲۵ mg/kg × ۳ بار)<br>حداکثر ۹۹ mg/kg/روز`;
        }
        mechanism = 'بهترین شلاتور برای رسوب آهن در قلب — کاهش چشمگیر آهن میوکارد';
        interactions = 'زینک و آلومینیوم جذب را ↓ می‌دهند — فاصله ۴ ساعته';
        warnings = 'چک هفتگی نوتروفیل (ANC) اجباری — خطر آگرانولوسیتوز';
    }

    document.getElementById('doseOutput').innerHTML = `<strong>دوز پیشنهادی:</strong><br>${dose}`;
    document.getElementById('mechanism').textContent = mechanism;
    document.getElementById('interactions').textContent = interactions;
    document.getElementById('warnings').textContent = warnings;

    document.getElementById('result').classList.remove('d-none');
    window.scrollTo({ top: document.getElementById('result').offsetTop - 100, behavior: 'smooth' });
});
