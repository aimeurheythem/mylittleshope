document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');
    const body = document.querySelector('body');
    const orderButtons = document.querySelectorAll('.order');
    const formBoxes = document.querySelectorAll('.form-box');
    const togglePanels = document.querySelectorAll('.toggle-panel');

    // Check if dark mode is enabled
    if (localStorage.getItem("darkMode") === "enabled") {
        body.classList.add("dark");
    }

    // Dynamic Pricing Configuration
    const pricingConfig = {
        shorts: {
            productPrice: 2200,
            productName: "شورتات"
        },
        shoes: {
            productPrice: 1600,
            productName: "أحذية"
        }
    };

    // Wilaya-specific delivery and home fee pricing
    const wilayaPricing = {
        "02 - الشلف": {delivery: 400, home: 700},
        "01 - أدرار": {delivery: 400, home: 700},
        "18 - جيجل": {delivery: 400, home: 700},
        "09 - البليدة": {delivery: 450, home: 700},
        "10 - البويرة": {delivery: 450, home: 700},
        "23 - عنابة": {delivery: 450, home: 700},
        "19 - سطيف": {delivery: 450, home: 700},
        "25 - قسنطينة": {delivery: 450, home: 700},
        "06 - بجاية": {delivery: 450, home: 700},
        "31 - وهران": {delivery: 450, home: 700},
        "34 - برج بوعريريج": {delivery: 450, home: 700},
        "21 - سكيكدة": {delivery: 450, home: 700},
        "42 - تيبازة": {delivery: 450, home: 700},
        "44 - عين الدفلى": {delivery: 450, home: 700},
        "04 - أم البواقي": {delivery: 550, home: 750},
        "05 - باتنة": {delivery: 550, home: 750},
        "07 - بسكرة": {delivery: 550, home: 750},
        "13 - تلمسان": {delivery: 550, home: 750},
        "14 - تيارت": {delivery: 550, home: 750},
        "12 - تبسة": {delivery: 550, home: 750},
        "20 - سعيدة": {delivery: 550, home: 750},
        "22 - سيدي بلعباس": {delivery: 550, home: 750},
        "24 - قالمة": {delivery: 550, home: 750},
        "27 - مستغانم": {delivery: 550, home: 750},
        "28 - المسيلة": {delivery: 550, home: 750},
        "29 - معسكر": {delivery: 550, home: 750},
        "43 - ميلة": {delivery: 550, home: 750},
        "35 - بومرداس": {delivery: 550, home: 750},
        "17 - الجلفة": {delivery: 600, home: 800},
        "20 - سعيدة": {delivery: 600, home: 800},
        "47 - غرداية": {delivery: 600, home: 800},
        "29 - معسكر": {delivery: 600, home: 800},
        "40 - خنشلة": {delivery: 650, home: 800},
        "41 - سوق أهراس": {delivery: 650, home: 800},
        "46 - عين تموشنت": {delivery: 650, home: 800},
        "05 - باتنة": {delivery: 700, home: 850},
        "12 - تبسة": {delivery: 700, home: 850},
        "36 - الطارف": {delivery: 700, home: 850},
        "03 - الأغواط": {delivery: 700, home: 850},
        "51 - أولاد جلال": {delivery: 800, home: 900},
        "30 - ورقلة": {delivery: 900, home: 1000},
        "32 - البيض": {delivery: 900, home: 1000},
        "55 - توغرت": {delivery: 900, home: 1000},
        "45 - النعامة": {delivery: 900, home: 1000},
        "47 - غرداية": {delivery: 900, home: 1000},
        "55 - توغرت": {delivery: 900, home: 1000},
        "57 - المغير": {delivery: 900, home: 1000},
        "52 - بني عباس": {delivery: 1000, home: 1100},
        "01 - أدرار": {delivery: 1200, home: 1400},
        "08 - بشار": {delivery: 1200, home: 1400},
        "11 - تمنراست": {delivery: 1200, home: 1400},
        "52 - بني عباس": {delivery: 1200, home: 1400},
        "49 - تيميمون": {delivery: 1200, home: 1400},
        "53 - بني عباس": {delivery: 1200, home: 1400},
        "11 - تمنراست": {delivery: 1600, home: 1800},
        "37 - تندوف": {delivery: 1600, home: 1800},
        "33 - إليزي": {delivery: 2000, home: 2000},
        "50 - برج باجي مختار": {delivery: 2000, home: 2000},
        "54 - عين صالح": {delivery: 2000, home: 2000},
        "56 - جانت": {delivery: 2000, home: 2000},
        "16 - الجزائر": {delivery: 500, home: 700}
    };

    // Function to get delivery and home fee based on wilaya
    function getWilayaFees(wilaya) {
        return wilayaPricing[wilaya] || {delivery: 0, home: 0};
    }

    // Function to update order summary
    function updateOrderSummary(formType) {
        const form = document.querySelector(`#${formType}Form`);
        if (!form) return;

        const quantityInput = form.querySelector(`#quantity${formType === 'shoes' ? '-shoes' : ''}`);
        const quantity = parseInt(quantityInput.value) || 1;
        
        const config = pricingConfig[formType];
        const productTotal = config.productPrice * quantity;
        
        // Get delivery and home fee based on selected wilaya
        const wilayaSelect = form.querySelector('.Wilaya');
        const selectedWilaya = wilayaSelect.value;
        const {delivery: deliveryCost, home: homeFee} = selectedWilaya ? getWilayaFees(selectedWilaya) : {delivery: 0, home: 0};
        
        // Get delivery type
        const deliveryTypeRadios = form.querySelectorAll('input[name="مكان التوصيل"]');
        let isHomeDelivery = false;
        deliveryTypeRadios.forEach(radio => {
            if (radio.checked && radio.value === "المنزل") {
                isHomeDelivery = true;
            }
        });
        
        // Calculate total based on delivery type
        let total = productTotal;
        let usedFee = 0;
        let usedLabel = '';
        if (selectedWilaya) {
            if (isHomeDelivery) {
                usedFee = homeFee;
                usedLabel = 'رسوم التوصيل للمنزل:';
                total += homeFee;
            } else {
                usedFee = deliveryCost;
                usedLabel = 'سعر التوصيل:';
                total += deliveryCost;
            }
        }

        // Update summary elements
        const summaryItems = form.querySelectorAll('.summary-item');
        const summaryTotal = form.querySelector('.summary-total');
        
        // Update product name
        if (summaryItems[0]) {
            const productSpan = summaryItems[0].querySelector('span:last-child');
            if (productSpan) {
                productSpan.textContent = config.productName;
            }
        }
        
        // Update product price
        if (summaryItems[1]) {
            const priceSpan = summaryItems[1].querySelector('span:last-child');
            if (priceSpan) {
                priceSpan.textContent = `${productTotal} دج`;
            }
        }
        
        // Update delivery/home fee (third summary item)
        if (summaryItems[2]) {
            const labelSpan = summaryItems[2].querySelector('.label');
            const valueSpan = summaryItems[2].querySelector('span:last-child');
            if (labelSpan && valueSpan) {
                if (selectedWilaya) {
                    labelSpan.textContent = usedLabel;
                    valueSpan.textContent = `${usedFee} دج`;
                } else {
                    labelSpan.textContent = 'التوصيل:';
                    valueSpan.textContent = 'اختر الولاية';
                }
            }
        }
        
        // Remove any home delivery fee extra line if it exists
        let homeDeliveryItem = form.querySelector('.summary-item.home-delivery-fee');
        if (homeDeliveryItem) {
            homeDeliveryItem.remove();
        }
        
        // Update total
        if (summaryTotal) {
            const totalSpan = summaryTotal.querySelector('span:last-child');
            if (totalSpan) {
                totalSpan.textContent = selectedWilaya ? `${total} دج` : "اختر الولاية";
            }
        }
    }

    // Function to handle quantity changes
    function handleQuantityChange(event) {
        const input = event.target;
        const form = input.closest('form');
        const formType = form.id === 'shoesForm' ? 'shoes' : 'shorts';
        
        // Ensure minimum quantity of 1
        if (input.value < 1) {
            input.value = 1;
        }
        
        updateOrderSummary(formType);
    }

    // Function to handle wilaya selection
    function handleWilayaChange(event) {
        const select = event.target;
        const form = select.closest('form');
        const formType = form.id === 'shoesForm' ? 'shoes' : 'shorts';
        
        updateOrderSummary(formType);
    }

    // Function to handle delivery type changes
    function handleDeliveryTypeChange(event) {
        const radio = event.target;
        const form = radio.closest('form');
        const formType = form.id === 'shoesForm' ? 'shoes' : 'shorts';
        
        updateOrderSummary(formType);
    }

    // Initialize quantity event listeners
    const quantityInputs = document.querySelectorAll('input[type="number"]');
    quantityInputs.forEach(input => {
        input.addEventListener('input', handleQuantityChange);
        input.addEventListener('change', handleQuantityChange);
    });

    // Initialize wilaya event listeners
    const wilayaSelects = document.querySelectorAll('.Wilaya');
    wilayaSelects.forEach((select, index) => {
        select.addEventListener('change', function() {
            const selectedWilaya = this.value;
            const municipalityContainer = municipalityContainers[index];
            const municipalitySelect = municipalitySelects[index];
            
            // Clear current options
            municipalitySelect.innerHTML = '<option value="" disabled selected>اختر البلدية</option>';
            
            // For all wilayas, show the municipality dropdown
            municipalityContainer.style.display = 'block';
            
            // If we have municipalities for this wilaya
            if (municipalities[selectedWilaya]) {
                // Add new options
                municipalities[selectedWilaya].forEach(municipality => {
                    const option = document.createElement('option');
                    option.value = municipality;
                    option.textContent = municipality;
                    municipalitySelect.appendChild(option);
                });
                
                municipalitySelect.disabled = false;
            } else {
                // If no data, add a default option
                const option = document.createElement('option');
                option.value = "بلدية";
                option.textContent = "بلدية";
                municipalitySelect.appendChild(option);
                municipalitySelect.disabled = false;
            }
            
            // Update order summary when wilaya is selected
            const form = this.closest('form');
            const formType = form.id === 'shoesForm' ? 'shoes' : 'shorts';
            updateOrderSummary(formType);
            
            // On mobile, scroll to reveal municipality field
            if (window.innerWidth <= 650) {
                setTimeout(() => {
                    municipalityContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });

    // Initialize delivery type event listeners
    const deliveryTypeRadios = document.querySelectorAll('input[name="مكان التوصيل"]');
    deliveryTypeRadios.forEach(radio => {
        radio.addEventListener('change', handleDeliveryTypeChange);
    });

    // Initialize order summaries on page load
    updateOrderSummary('shorts');
    updateOrderSummary('shoes');

    // Municipality handling for both forms
    const municipalityContainers = document.querySelectorAll('.municipality-container');
    const municipalitySelects = document.querySelectorAll('.municipality');

    // Municipality data for Algeria
    const municipalities = {
        "01 - أدرار": [
        "أدرار", "تامست", "شروين", "رقان", "إن زغمير", "تيط", "قصر قدور", "تسابيت",
        "تيميمون", "أولاد السعيد", "زاوية كنتة", "أولف", "تمقطن", "تمنطيط", "فنوغيل",
        "تنركوك", "دلدول", "سالي", "أقبلي", "المطارفة", "أولاد أحمد تيمي", "بودة",
        "أوقروت", "طالمين", "برج باجي مختار", "السبع", "أولاد عيسى", "تيمياوين"
        ],
        "02 - الشلف": [
        "الشلف", "أولاد فارس", "أولاد بن عبد القادر", "بني حواء", "بوزغاية", "بريرة",
        "بني راشد", "بوقادير", "الحجاج", "الزبوجة", "المرسى", "الهرانفة", "الولجة",
        "البيضية", "تاجنة", "تلعصة", "تنس", "وادي الفضة", "وادي قوسين", "عين أمران",
        "أبو الحسن", "عين مران", "سنجاس", "سيدي عكاشة", "سيدي عبد الرحمن", "الظهرة",
        "تاوقريت", "العامرية", "السبع بيار", "العيشون"
        ],
        "03 - الأغواط": [
        "الأغواط", "أفلو", "قصر الحيران", "حاسي الدلاعة", "حاسي الرمل", "القلتة", "بن ناصر بن شهرة",
        "الغيشة", "سبقاق", "تاويالة", "العسافية", "الخنق", "وادي مرة", "وادي مزي", "سيدي بوزيد",
        "عين ماضي", "عين ساهي", "أولاد سيدي عبد الله", "براكة", "الحويطة", "أولاد العيساوي", "أولاد زيد",
        "سيدي مخلوف"
        ],
        "04 - أم البواقي": [
        "أم البواقي", "عين البيضاء", "عين مليلة", "عين فكرون", "أولاد حملة", "سيقوس", "مسكيانة",
        "الضلعة", "بريش", "العامرية", "الزرق", "الفجوج", "فكيرينة", "بئر الشهداء", "سوق نعمان",
        "الحرملية", "هنشير تومغني", "وادي نيني", "وادي الشارف", "أولاد زواي", "أولاد قاسم",
        "عين الزيتون", "الهنشير تومغني", "الرحية", "الربيعية", "بئر الشهداء"
        ],
        "05 - باتنة": [
        "باتنة", "أريس", "ثنية العابد", "تكوت", "إشمول", "فم الطوب", "بوزينة", "تيغانمين",
        "إينوغيسن", "عين التوتة", "عين جاسر", "عين ياقوت", "أولاد عمار", "أولاد سلام", 
        "بريكة", "زانة البيضاء", "بيطام", "بومقر", "الحاسي", "المعذر", "تيمقاد", "تازولت",
        "الشمرة", "عزيل عبد القادر", "سقانة", "حيدوسة", "وادي الشعبة", "وادي الطاقة",
        "سريانة", "القصبات", "بريش", "أولاد فاضل", "الرحبات", "تاكسلانت", "عيون العصافير",
        "لمسان", "كيمل", "معافة"
        ],
        "06 - بجاية": [
        "بجاية", "أميزور", "أوقاس", "تازمالت", "صدوق", "سوق الإثنين", "خراطة", "سيدي عيش",
        "أدكار", "بوخليفة", "تيشي", "الشميني", "فناية الماثن", "تالة حمزة", "بني معوش",
        "إيفرحونن", "درقينة", "توجة", "أكفادو", "ملبو", "بوحمزة", "بني جليل", "بني كسيلة",
        "أقبو", "تيزي نبربر", "تيفرة", "تازغرت", "تيفراه", "أيت سماعيل", "سوق أوفلا",
        "وادي غير", "تامريجت", "لقصر"
        ],
        "07 - بسكرة": [
        "بسكرة", "أورلال", "جمورة", "القنطرة", "زريبة الوادي", "زريبة منصور", "لوطاية",
        "طولقة", "ليوة", "مشونش", "أولاد جلال", "الدوسن", "سيدي خالد", "سيدي عقبة",
        "مزيرعة", "الحوش", "أوماش", "عين الناقة", "برج بن عزوز", "بوشقرون", "الفيض",
        "الغروس", "فوغالة", "بني مراد", "أولاد رحمة", "شتمة", "عين زعطوط", "خنقة سيدي ناجي"
        ],
        "08 - بشار": [
        "بشار", "العبادلة", "تامترت", "بني ونيف", "كنفة", "بني عباس", "القصابي", "إقلي",
        "تامزورة", "تاغيت", "تبلبالة", "العبادلة الشمالية", "أولاد خضير", "بني قشة"
        ],
        "09 - البليدة": [
            "البليدة", "الشبلي", "بوعرفة", "الشفة", "الأربعاء", "موزاية", "مفتاح", "أولاد سلامة",
            "بني تامو", "بوقرة", "بوعينان", "الشريعة", "وادي العلايق", "بني مراد", "صومعة",
            "حمام ملوان", "أولاد يعيش", "الصومعة", "قرواو", "بوفاريك", "الأفرون", "العفرون"
        ],
        "10 - البويرة": [
        "البويرة", "الأخضرية", "العجيبة", "عين بسام", "آث منصور", "آث لعزيز", "آث تيزي",
        "آث سي حماد", "بئر غبالو", "بشلول", "بئر غبالو", "بئر قاصد علي",
        "بودربالة", "بوقطب", "الجباحية", "الهاشمية", "الحجرة الزرقاء", "سور الغزلان",
        "دراع الميزان", "القادرية", "الروراوة", "العناصر", "سوق الخميس", "تاغزوت",
        "تيكجدة", "تيزي النيث", "تيزي القايد", "الهاشمية", "حربيل", "الجباحية"
        ],
        "11 - تمنراست": [
        "تمنراست", "عين صالح", "عين قزام", "تازروك", "أباله", "إنغر", "تيت", "فينوغيل", "إدلس"
        ],
        "12 - تبسة": [
        "تبسة", "الشريعة", "العوينات", "الونزة", "بكارية", "بولحاف الدير", "بئر العاتر",
        "بئر مقدم", "بئر الذهب", "بجن", "بكارية", "صفصاف الوسرى", "سطح قنتيس", "مرسط",
        "نقرين", "الماء الأبيض", "العقلة المالحة", "فركان", "الحمامات", "المريج",
        "المزرعة", "بئر لحلو", "عين الزرقاء"
        ],
        "13 - تلمسان": [
            "تلمسان", "أولاد ميمون", "الرمشي", "المنصورة", "المرسى بن مهيدي", "هنين", "باب العسة",
            "السواحلية", "ندروما", "عين تالوت", "سبدو", "عين غرابة", "الفحول", "الغزوات",
            "بني سنوس", "بني وارسوس", "بني بوسعيد", "عين فزة", "عين يسر", "الزوية",
            "عين الكبيرة", "العريشة", "تيرني", "أموري", "شتوان", "دار يغمراسن", "الحناية",
            "مرين", "مقلع الطين", "صبحة", "سيدي الجيلالي", "سيدي العنتري", "سيدي بوحجة",
            "سيدي مجاهد", "تلمزوغة", "تيانت", "واد تافنة"
        ],
        "14 - تيارت": [
            "تيارت", "مدروسة", "سيق", "حمادية", "فرندة", "مهدية", "عين الذهب", "دحموني", 
            "مغيلة", "قصر الشلالة", "توسنينة", "عين كرمس", "رحوية", "الناظورة", "مشروحة", 
            "السبعين", "زمالة الأمير عبد القادر", "الفايجة", "سيدي علي ملال", "سيدي عبد الغني", 
            "سيدي بختي", "سيدي الحسني", "سيدي العنتري", "جبيلات الرصفة", "بوقرة", "قرطوفة", 
            "شهايم", "تاقدمت", "فجاج", "مدريسة", "نعيمة", "بني شعيب", "سرغين"
        ],
        "15 - تيزي وزو": [
            "تيزي وزو", "أزفون", "أدكار", "أقبيل", "آيت شافع", "آيت يحيى", "آيت عيسى ميمون",
            "آيت عبد المومن", "آيت بوعدو", "آيت تودرت", "آيت خليلي", "آيت مجدوب", "آيت بومهدي",
            "بوزقن", "بني زمنزر", "بني دوالة", "بني عيسي", "بوغني", "بوإقنون", "بوزقان",
            "إفليسن", "إغيل علي", "إفنعونن", "إبكيرن", "إيرجن", "إمعمرن", "إعكوران", "إبودرارن",
            "إيرجنن", "إيجر", "إفرحونن", "إيتوامن", "إعكوران", "ذراع بن خدة", "فريحة", "ماكودة",
            "ميساتة", "ميزرانة", "نقوش", "واقنون", "تيقزيرت", "تيميزار", "تادمايت", "تخلالت",
            "تمنغولت", "تيزي راشد", "تيزي نتلاثة", "تيزي غنيف", "تيقزيرت", "واسيف", "ياث واڭنين"
        ],
        "16 - الجزائر": [
            "باب الوادي", "بولوغين", "القصبة", "وادي قريش", "باش جراح", "المدنية", 
            "سيدي امحمد", "المرادية", "بئر مراد رايس", "الأبيار", "بوزريعة", "بئر خادم", 
            "الحراش", "براقي", "وادي السمار", "بوروبة", "حسين داي", "القبة", "الدار البيضاء", 
            "باب الزوار", "برج الكيفان", "المحمدية", "برج البحري", "الدرارية", "بئر توتة", 
            "حيدرة", "الرحمانية", "السحاولة", "المعالمة", "عين البنيان", "زرالدة", "المحالمة"
        ],
        "17 - الجلفة": [
    "الجلفة", "عين وسارة", "حاسي بحبح", "دار الشيوخ", "البيرين", "مسعد", 
    "سيدي لعجال", "فيض البطمة", "حد الصحاري", "سلمانة", "زكار", "بني ياجيس", 
    "تعظميت", "المجبارة", "بن يعقوب", "بويرة الأحداب", "دلدول", "عمورة", 
    "سد رحال", "القديد", "عين الإبل", "الشقفة", "سيدي بايزيد", "الدويس", 
    "حاسي العش", "حاسي فدول"
    ],
    "18 - جيجل": [
    "جيجل", "السطارة", "الطاهير", "الميلية", "العوانة", "الجمعة بني حبيبي", 
    "بني بلعيد", "بني ياجيس", "بوراوي بلهادف", "الشقفة", "تاكسنة", "قاوس", 
    "زيامة منصورية", "أولاد رابح", "سيدي معروف", "وجانة", "إيراقن", "بودريعة بن ياجيس"
  ],"19 - سطيف": [
    "سطيف", "عين أرنات", "عين عباسة", "عين الكبيرة", "عين ولمان", "عموشة", "بابور", 
    "بئر العرش", "بني عزيز", "بني فودة", "بني ورتيلان", "بوعنداس", "بوقاعة", "بوسلام", 
    "بوطالب", "الدهامشة", "جميلة", "قلال", "قنزات", "قلتة زرقاء", "الحامة", "حمام السخنة", 
    "حمام قرقور", "حربيل", "ماوكلان", "معاوية", "مزلوق", "واد البارد", "أولاد عدوان", 
    "أولاد صابر", "أولاد سي أحمد", "أولاد تبان", "الرصفة", "صالح باي", "سرج الغول", 
    "تاشودة", "تالة إيفاسن", "تيزي نبشار"
  ],
  "20 - سعيدة": [
    "سعيدة", "عين الحجر", "الحساسنة", "مولاي العربي", "سيدي أحمد", "سيدي بوبكر", 
    "سيدي أعمر", "أولاد خالد", "دوي ثابت", "تيرسين", "يوب", "أولا إبراهيم"
  ],
  "21 - سكيكدة": [
    "سكيكدة", "الحروش", "رمضان جمال", "عزابة", "المرسى", "عين شرشار", "بين الويدان",
    "الزويت", "القل", "أولاد عطية", "كركرة", "تازة", "بني بشير", "بني زيد", "تمالوس",
    "الولجة بوالبلوط", "زردازة", "بكوش لخضر", "عين قشرة", "سيدي مزغيش", "حمادي كرومة",
    "الشرايع", "الحدائق", "عين بوزيان", "أمجاز الدشيش", "قنواع"
  ],
  "22 - سيدي بلعباس": [
    "سيدي بلعباس", "تلموني", "سيدي لحسن", "بن باديس", "عين البرد", "عين تمر", 
    "المرحوم", "مستغانم الصغير", "رجم دموش", "مولاي سليسن", "تلاغ", "مرين", 
    "رأس الماء", "وادي السبع", "سفيزف", "بوحنيفية", "عين عدان", "الضاية", 
    "مكدرة", "المرين", "عين تندامين", "سيدي شعيب", "أولاد إبراهيم", "سيدي علي بوسيدي", 
    "سيدي دحو الزرزور", "سيدي يخلف", "زروالة", "مزاورو", "مرين", "بوخنفيس", 
    "سيد الهواري", "الشيخ", "تفسور", "مشراق"
  ],
  "23 - عنابة": [
    "عنابة", "الحجار", "سرايدي", "برحال", "عين الباردة", "الشرفة", 
    "البوني", "واد العنب", "التريعات", "العلمة"
  ],
  "24 - قالمة": [
    "قالمة", "بوشقوف", "وادي الزناتي", "عين مخلوف", "هيليوبوليس", "بني مزلين", 
    "بوصواف", "حمام دباغ", "حمام النبائل", "بلخير", "عين صندل", "عين رقادة", 
    "بومهرة أحمد", "واد الشحم", "الركنية", "هواري بومدين", "الفجوج", "مجاز عمار", 
    "وادي فراغة", "سلاوة عنونة", "عين العربي", "قلعة بوصبع", "دراوش"
  ],
  "25 - قسنطينة": [
    "قسنطينة", "الخروب", "عين عبيد", "ديدوش مراد", "ابن باديس", 
    "أولاد رحمون", "حامة بوزيان", "زيغود يوسف", "مسعود بوجريو", "عين سمارة"
  ],
  "26 - المدية": [
    "المدية", "وزرة", "عين بوسيف", "البرواقية", "شلالة العذاورة", "قصر البخاري",
    "بوغزول", "العمارية", "السواقي", "تمزقيدة", "الكاف الأخضر", "أولاد إبراهيم",
    "عين القصير", "بني سليمان", "سغوان", "بوسكن", "بوغار", "سيدي نعمان", 
    "مجبر", "الزوبيرية", "أولاد امبارك", "أولاد هلال", "ثنية الحد", "الكاف الأخضر", 
    "بن شكاو", "حناشة", "تابلاط", "العمارية", "حناشة", "دراقة", "مزغنة", "وادي حربيل"
  ],
  "27 - مستغانم": [
    "مستغانم", "عين تادلس", "عشعاشة", "حاسي ماماش", "سيرات", "مزغران", 
    "نكمارية", "فرناكة", "خضرة", "سيدي علي", "الصور", "سيدي لخضر", 
    "بوقيراط", "عين النويصي", "ستيديا", "الحسيان", "صفصاف", "حجاج", 
    "الطواهرية", "أولاد بوغالم", "الصفصافة"
  ],
  "28 - المسيلة": [
    "المسيلة", "بوسعادة", "سيدي عيسى", "عين الحجل", "عين الملح", "أولاد دراج",
    "حمام الضلعة", "مقرة", "برهوم", "سيدي أمحمد", "أولاد ماضي", "أولاد سيدي إبراهيم",
    "المعاريف", "بن سرور", "الحوامد", "محمد بوضياف", "سيدي عامر", "ثنية الحد", 
    "تارمونت", "بني يلمان", "مناعة", "المطارفة", "ونوغة", "أولاد منصور", 
    "أولاد عدي لقبالة", "بلعايبة", "الخبانة", "شلال"
  ],
  "29 - معسكر": [
    "معسكر", "غريس", "تيغنيف", "سيق", "الزبوجة", "عين فارس", "وادي الأبطال",
    "القرطوفة", "ماوسة", "بوحنيفية", "المحمدية", "سجرارة", "زهانة", "الكنانيط",
    "الكرط", "عين فراح", "عين يحيى", "خلوية", "تسالة", "عوف", "الحشم", 
    "الخيثر", "المطمر", "البرج", "البرج الجديد", "سيدي عبد المؤمن", 
    "رأس العين عميروش", "سيدي قادة", "سيدي بوسعيد"
  ],
  "30 - ورقلة": [
    "ورقلة", "تقرت", "تماسين", "الطيبات", "البرمة", "أنقوسة", 
    "الحجيرة", "النقوسة", "بلدة عمر", "سيدي سليمان", "العالية", 
    "سيدي خويلد", "نزلة", "حاسي بن عبد الله", "رويسات", "الرويبة"
  ],
        "31 - وهران": [
            "وهران", "قديل", "بئر الجير", "حاسي بونيف", "السانية", "بطيوة", "مرسى الحجاج", 
            "عين الترك", "العنصر", "وادي تليلات", "طفراوي", "سيدي الشحمي", "بوفاتيس", 
            "المرسى الكبير", "بوسفر", "الكرمة", "البراية"
        ],
        "32 - البيض": [
            "البيض", "بوقطب", "الأبيض سيدي الشيخ", "بريزينة", "الكاف لحمر", 
            "الغاسول", "عين العراك", "الأرباص", "المحبس", "الخيثر", 
            "سيدي الطيب", "ستيتن", "تامدة", "سيدي عمر", "استيتن", 
            "سيدي سليمان", "شلالة", "البويهي"
        ],
        "33 - إليزي": [
    "إليزي", "عين أميناس", "جانت", "برج الحواس", "برج عمر إدريس", 
    "دبداب", "إهرير", "إليزي المدينة"
  ],
  "34 - برج بوعريريج": [
    "برج بوعريريج", "رأس الوادي", "المنصورة", "عين تاغروت", "الجعافرة", 
    "بئر قاصد علي", "العناصر", "أولاد براهم", "الحمادية", "المهير", 
    "أولاد سيدي إبراهيم", "القصير", "تسامرت", "تكستار", "بن داود", 
    "المنصورة العليا", "غولام", "برج زمورة", "الزمورة", "خليل", 
    "الياشير", "البلدوزة", "العش", "المهير", "الحامة", 
    "الجعافرة الغربية", "سيدي امبارك", "تقلعيت", "الماين"
]
,
"35 - بومرداس": [
    "بومرداس", "تيجلابين", "قورصو", "أولاد موسى", "الثنية", 
    "يسر", "الاربعطاش", "برج منايل", "دلس", "بن شود", 
    "اعفير", "زموري", "سيدي داود", "بغلية", "تاورقة", 
    "سوق الحد", "الخروبة", "الناصرية", "شعبة العامر", 
    "بودواو", "بودواو البحري", "تيجلابين"
],
"36 - الطارف": [
    "الطارف", "البسباس", "بن مهيدي", "بوثلجة", "الذرعان", 
    "بوقوس", "الشط", "الشافية", "زريزر", "حام بوزيان", 
    "عصفور", "عين العسل", "السوارخ", "رمل السوق"
],
"37 - تندوف": [
    "تندوف", "أم العسل"
],
"38 - تسمسيلت": [
    "تسمسيلت", "ثنية الأحد", "الأزهرية", "العيون", "بني شعيب", 
    "برج بونعامة", "خميستي", "لرجام", "الملعب", "مولاي العربي", 
    "اليوسفية", "سيدي سليمان", "سيدي العنتري", "تملاحت"
],
"39 - الوادي": [
    "الوادي", "قمار", "الدبيلة", "الرقيبة", "الطريفاوي", 
    "البياضة", "ورماس", "الرباح", "الحمراية", "أميه ونسة", 
    "النخلة", "الطالب العربي", "المقرن", "حساني عبد الكريم", 
    "سيدي عون", "مرارة", "الدوار", "العرقوب", "طويل", 
    "بن قشة", "تماسين", "جامعة", "الطيبات", "المقرن الجديدة"
],
"40 - خنشلة": [
    "خنشلة", "الحامة", "الولجة", "بابار", "طامزة", 
    "أولاد رشاش", "ششار", "متوسة", "بغاي", "المحمل", 
    "قايس", "أنسيغة", "سيسوف", "بوحمامة"
],
"41 - سوق أهراس": [
    "سوق أهراس", "سدراتة", "تاورة", "أولاد إدريس", "بئر بوحوش", 
    "الزعرورية", "عين الزانة", "المراهنة", "الحنانشة", "المشروحة", 
    "المهاذن", "ويلان", "الرحبات", "بوشقوف", "مداوروش", 
    "تيفاش", "الخضارة", "وادي الكبريت", "الزعرور", "عين سلطان"
],
"42 - تيبازة": [
    "تيبازة", "حجوط", "بوسماعيل", "شرشال", "القليعة", 
    "فوكة", "دواودة", "مراد", "سيدي راشد", "أحمر العين", 
    "سيدي غيلاس", "حجرة النص", "عين تاقورايت", "الحطاطبة", 
    "سيدي سميان", "نزلة", "بوهارون", "بوراوي بلهادف", 
    "الناصرية", "قوراية"
],
"43 - ميلة": [
    "ميلة", "فرجيوة", "شلغوم العيد", "تاجنانت", "ترعي باينان",
    "عين البيضاء احريش", "القرارم قوقة", "وادي النجاء", "الرواشد", "أحمد راشدي",
    "التلاغمة", "وادي سقان", "وادي العثمانية", "عين الملوك", "سيدي خليفة",
    "مشيرة", "زغاية", "أولاد اخلوف", "مينار زارزة", "سيدي مروان",
    "حمالة", "عين كرشة", "تسالة المطاعي"
],
"44 - عين الدفلى": [
    "عين الدفلى", "خميس مليانة", "جندل", "بومدفع", "العامرة", 
    "العطاف", "العبادية", "الروينة", "عين سلطان", "طارق بن زياد", 
    "برج الأمير خالد", "البويرات", "بربوش", "بطحية", "تاشتة زقاغة", 
    "الحسينية", "المخاطرية", "الجمعة أولاد الشيخ", "واد الشرفاء", 
    "عين الاشياخ", "الحطاطبة", "حمام ريغة", "بوشراحيل", 
    "وادي الفضة", "واد الجمعة", "زدين"
],
"45 - النعامة": [
    "النعامة", "عين الصفراء", "مشرية", "مكمن بن عمار", "صفيصيفة",
    "تيوت", "عين بن خليل", "البيوض", "القصدير", "عسلة"
],
"46 - عين تموشنت": [
    "عين تموشنت", "حمام بوحجر", "بني صاف", "أولاد الكيحل", "شعبة اللحم", 
    "سيدي بن عدة", "سيدي بومدين", "أحفير", "وادي الصباح", "تارقة", 
    "المقطع", "تلموني", "تمزوغة", "العامرية", "عقب الليل", 
    "عين الكيحل", "بوزجار"
],
"47 - غرداية": [
    "غرداية", "متليلي", "القرارة", "بريان", "المنيعة", 
    "العطف", "ضاية بن ضحوة", "سبسب", "بونورة", "زلفانة", 
    "منصورة"
],
"48 - غليزان": [
    "غليزان", "وادي ارهيو", "عمي موسى", "يلل", "مازونة", 
    "منداس", "الولجة", "بن داود", "سيدي امحمد بن علي", "الرمكة", 
    "المرجة سيدي عابد", "جديوية", "الحاسي", "واد الجمعة", "سيدي لزرق", 
    "سيدي امحمد بن عودة", "عين طارق", "بورماداس", "الحمادنة", 
    "الصفصاف", "مرجة", "سيدي خطاب", "مداد", "الزبوجة"
],
"49 - تيميمون": [
    "تيميمون", "أولاد سعيد", "تبلبالة", "الدبداب", 
    "تمقطن", "أقبلي", "طلمين", "بني مهدي"
],
"50 - برج باجي مختار": [
    "برج باجي مختار", "عين قزام", "عين سليمان", "عين التمر", 
    "أولاد موحلي", "بني وليد"
],
"51 - أولاد جلال": [
    "أولاد جلال", "دراق", "العالية", "النخلة", "رأس العقبة",
    "الواد", "بريكة", "الصلبة", "قصر الحيران", "الشمرة"
],
"52 - بني عباس": [
    "بني عباس", "عين العراك", "عين الجعافرة", "عين بلعباس", 
    "تامظوت", "عين تندرارة", "تاغيت", "عين الصفراء"
],
"57 - عين صالح": [
    "عين صالح", "عين قزام", "تيميمون", "أوكار", "القطارة"
],
"58 - عين قزام": [
    "عين قزام", "تينركوك", "بني وليد", "العش", "بئر قاصد علي"
],
"55 - توغرت": [
    "توغرت", "الصرار", "القرارة", "تمنطيط", "الرباح", "العبادلة", "العقلة"
],
"56 - جانت": [
    "جانت", "عين بن بيضاء", "عين الغزال", "عين إنيس", "تينزرات"
],
"57 - المغير": [
    "المغير", "تيميمون", "القصور", "عين سليت", "البرج"
],
"58 - المنيعة": [
    "المنيعة", "عين صالح", "القرارة", "تامنطيط", "أم الطوب"
]
    };

    // Improve visibility of toggle panels on mobile
    function adjustTogglePanelsForMobile() {
        const isMobile = window.innerWidth <= 650;
        if (isMobile) {
            togglePanels.forEach(panel => {
                // Increase font weight for better visibility
                panel.querySelectorAll('h1, p').forEach(element => {
                    element.style.fontWeight = 'bold';
                });
                
                // Ensure buttons are visible and properly sized
                const button = panel.querySelector('.btn');
                if (button) {
                    button.style.border = '2px solid #fff';
                }
                
                // Ensure social icons are visible
                const socialIcons = panel.querySelectorAll('.social-icons a');
                socialIcons.forEach(icon => {
                    icon.style.border = '2px solid #fff';
                });
            });
        } else {
            // Reset styles when not on mobile
            togglePanels.forEach(panel => {
                panel.querySelectorAll('h1, p').forEach(element => {
                    element.style.fontWeight = '';
                });
                
                const button = panel.querySelector('.btn');
                if (button) {
                    button.style.border = '';
                }
                
                const socialIcons = panel.querySelectorAll('.social-icons a');
                socialIcons.forEach(icon => {
                    icon.style.border = '';
                });
            });
        }
    }

    // Auto-focus prevention on mobile
    const formInputs = document.querySelectorAll('input, select');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            if (window.innerWidth <= 650) {
                // Prevent keyboard from pushing content
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
        });
    });

    // Fix for iOS input focusing issues
    function fixIOSInputIssues() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
            document.body.style.cursor = 'pointer';
            document.documentElement.style.webkitTouchCallout = 'none';
        }
    }

    // Validate form fields before submission
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim() || field.disabled) {
                isValid = false;
                field.classList.add('error');
                
                // Highlight the field with error
                field.style.border = '2px solid #ff3333';
                
                // Remove error styling after user starts typing
                field.addEventListener('input', function() {
                    this.style.border = '';
                    this.classList.remove('error');
                }, { once: true });
            }
        });
        
        return isValid;
    }

    // Toggle between forms
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
        // Scroll to top when switching forms on mobile
        if (window.innerWidth <= 650) {
            setTimeout(() => {
                formBoxes[1].scrollTop = 0;
            }, 500);
        }
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
        // Scroll to top when switching forms on mobile
        if (window.innerWidth <= 650) {
            setTimeout(() => {
                formBoxes[0].scrollTop = 0;
            }, 500);
        }
    });

    // Add responsive behavior for mobile devices
    function handleMobileView() {
        const isMobile = window.innerWidth <= 650;
        const isSmallMobile = window.innerWidth <= 480;
        const viewportHeight = window.innerHeight;
        
        // Set a minimum height for the content
        const minHeight = 500;
        const calculatedVH = Math.max(viewportHeight * 0.01, minHeight / 100);
        
        // Handle form box height based on device size
        formBoxes.forEach(box => {
            if (isSmallMobile) {
                box.style.maxHeight = (viewportHeight * 0.8) + 'px'; // 80% of viewport height for small mobile
            } else if (isMobile) {
                box.style.maxHeight = (viewportHeight * 0.75) + 'px'; // 75% of viewport height for mobile
            } else {
                box.style.maxHeight = '';
            }
        });
        
        // Fix for iOS viewport height issues
        document.documentElement.style.setProperty('--vh', `${calculatedVH}px`);
        
        // Adjust toggle panels for better mobile visibility
        adjustTogglePanelsForMobile();
    }

    // Fix for iOS initial viewport height
    function setVhProperty() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    // Add animation to order buttons
    orderButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Get the form
            const form = this.closest('form');
            const orderBtn = this;
            // Validate the form before submitting
            if (validateForm(form)) {
                if (!orderBtn.classList.contains('animate')) {
                    orderBtn.classList.add('animate');
                    // Disable scrolling during animation
                    const formBox = button.closest('.form-box');
                    formBox.style.overflowY = 'hidden';
                    // Submit form after animation
                    setTimeout(() => {
                        form.submit();
                        form.reset();
                        // Update order summary after reset
                        const formType = form.id === 'shoesForm' ? 'shoes' : 'shorts';
                        updateOrderSummary(formType);
                        // Re-enable scrolling if needed
                        setTimeout(() => {
                            formBox.style.overflowY = 'auto';
                        }, 500);
                        // Remove animate class after the full animation (10s)
                        setTimeout(() => {
                            orderBtn.classList.remove('animate');
                        }, 10000 - 2400); // 10s total minus the 2.4s already waited
                    }, 2400);
                }
            } else {
                // If validation fails, scroll to the first error field
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    firstError.focus();
                }
            }
        });
    });

    // Fix iOS 100vh issue
    window.addEventListener('resize', () => {
        handleMobileView();
        setVhProperty();
    });

    // Check for orientation change on mobile
    window.addEventListener('orientationchange', () => {
        // Small delay to ensure new dimensions are calculated
        setTimeout(() => {
            handleMobileView();
            setVhProperty();
            
            // Reset form scrolling position on orientation change
            formBoxes.forEach(box => {
                box.scrollTop = 0;
            });
        }, 200);
    });

    // Initial setup
    handleMobileView();
    setVhProperty();
    fixIOSInputIssues();
    adjustTogglePanelsForMobile();

    // Fix for mobile scrolling issues
    formBoxes.forEach(formBox => {
        formBox.addEventListener('touchstart', function(e) {
            if (this.scrollHeight > this.clientHeight) {
                e.stopPropagation();
            }
        }, { passive: true });
    });

    // Prevent form submission on enter key
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                return false;
            }
        });
    });
});