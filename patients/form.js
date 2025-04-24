// Firebase config (replace with your actual config)
const firebaseConfig = {
    apiKey: "AIzaSyANabSYGVWjrHU1wou5g_gMeIYw67I7Ejg",
    authDomain: "sakhicare-b4e84.firebaseapp.com",
    projectId: "sakhicare-b4e84",
    storageBucket: "sakhicare-b4e84.firebasestorage.app",
    messagingSenderId: "1067514445060",
    appId: "1:1067514445060:web:bc75fc3ec0f88527ffe451",
    measurementId: "G-L7RLDR38PY"
  };
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ====== FORM LOGIC ======
let currentStep = 1;
let patientType = null;

// Step navigation logic
function showStep(step) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    const stepElement = document.querySelector(`.step[data-step="${step}"]`);
    if (stepElement) stepElement.classList.add('active');
    document.querySelector('.step-indicator').textContent = `Step ${step}/3`;
    document.querySelector('.prev-step').style.display = step === 1 ? 'none' : 'inline-block';
    document.querySelector('.next-step').style.display = step === 3 ? 'none' : 'inline-block';
    document.querySelector('.btn-success').style.display = step === 3 ? 'inline-block' : 'none';
    currentStep = step;
}

// Patient type selection
document.querySelectorAll('.patient-type').forEach(btn => {
    btn.addEventListener('click', () => {
        patientType = btn.dataset.type;
        document.getElementById('pregnancyFields').style.display = 'none';
        document.getElementById('childFields').style.display = 'none';
        document.getElementById(`${patientType}Fields`).style.display = 'block';
        showStep(2);
    });
});

// Navigation buttons
document.querySelector('.next-step').addEventListener('click', () => {
    if (currentStep === 2 && !validateStep2()) return;
    if (currentStep === 2) calculateRisk();
    showStep(currentStep + 1);
});
document.querySelector('.prev-step').addEventListener('click', () => {
    showStep(currentStep - 1);
});

// Validation logic
function validateStep2() {
    let isValid = true;
    const form = document.getElementById('patientForm');
    form.classList.add('was-validated');

    // Validate pregnancy fields
    if (patientType === 'pregnancy') {
        const age = form.elements['age'];
        const hb = form.elements['hemoglobin'];
        const bp = form.elements['bp'];
        if (age.value < 15 || age.value > 50) { age.classList.add('is-invalid'); isValid = false; } else { age.classList.remove('is-invalid'); }
        if (hb.value < 5 || hb.value > 20) { hb.classList.add('is-invalid'); isValid = false; } else { hb.classList.remove('is-invalid'); }
        const bpPattern = /^\d{2,3}\/\d{2,3}$/;
        if (!bpPattern.test(bp.value)) { bp.classList.add('is-invalid'); isValid = false; } else { bp.classList.remove('is-invalid'); }
    }
    // Validate child fields
    else if (patientType === 'child') {
        const age = form.elements['age'];
        if (age.value < 0 || age.value > 5) { age.classList.add('is-invalid'); isValid = false; } else { age.classList.remove('is-invalid'); }
        const weight = form.elements['birth_weight'];
        if (weight.value < 0.5 || weight.value > 7) { weight.classList.add('is-invalid'); isValid = false; } else { weight.classList.remove('is-invalid'); }
    }

    // Common fields
    const phone = form.elements['phone'];
    const address = form.elements['address'];
    const adhar = form.elements['adhar'];
    const phonePattern = /^\d{10}$/;
    const adharPattern = /^\d{12}$/;
    if (!phonePattern.test(phone.value)) { phone.classList.add('is-invalid'); isValid = false; } else { phone.classList.remove('is-invalid'); }
    if (!adharPattern.test(adhar.value)) { adhar.classList.add('is-invalid'); isValid = false; } else { adhar.classList.remove('is-invalid'); }
    if (!address.value.trim()) { address.classList.add('is-invalid'); isValid = false; } else { address.classList.remove('is-invalid'); }

    return isValid;
}

// Risk calculation logic
function calculateRisk() {
    let reasons = [];
    const formData = new FormData(document.getElementById('patientForm'));

    if (patientType === 'pregnancy') {
        const age = parseInt(formData.get('age'));
        const hb = parseFloat(formData.get('hemoglobin'));
        const bp = formData.get('bp').split('/').map(Number);
        const chronicDisease = formData.get('chronic_disease');
        const cSection = formData.get('c_section');
        if (age < 18 || age > 35) reasons.push("Age risk");
        if (hb < 10) reasons.push("Low hemoglobin");
        if (bp[0] > 140 || bp[1] > 90) reasons.push("High BP");
        if (chronicDisease !== 'None') reasons.push(`Chronic: ${chronicDisease}`);
        if (cSection === 'Yes') reasons.push("Previous C-section");
    }
    else if (patientType === 'child') {
        const birthWeight = parseFloat(formData.get('birth_weight'));
        const congenital = formData.get('congenital');
        const immunization = formData.get('immunization');
        if (birthWeight < 2.5) reasons.push("Low birth weight");
        if (congenital !== 'None') reasons.push(`Congenital: ${congenital}`);
        if (immunization === 'Incomplete') reasons.push("Incomplete immunization");
    }

    const riskStatus = reasons.length > 0 ? 'High Risk' : 'Normal';
    document.getElementById('riskStatus').textContent = riskStatus;
    document.getElementById('riskReasons').textContent = reasons.join(', ') || 'None';
    document.querySelector('[name="risk_status"]').value = riskStatus;
}

// Submit handler
document.getElementById('patientForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Convert numeric fields
    if (data.age) data.age = Number(data.age);
    if (data.hemoglobin) data.hemoglobin = Number(data.hemoglobin);
    if (data.birth_weight) data.birth_weight = Number(data.birth_weight);

    // Add patient-type field for Firestore
    data["patient-type"] = patientType;

    try {
        await db.collection('seva sangini').add({
            ...data,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        alert('Patient added successfully!');
        e.target.reset();
        showStep(1);
        document.getElementById('pregnancyFields').style.display = 'none';
        document.getElementById('childFields').style.display = 'none';
    } catch (error) {
        alert('Error saving patient. Please try again.');
    }
});

// Initial setup
showStep(1);
