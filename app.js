const firebaseConfig = {
    apiKey: "AIzaSyDFvlQ-tr9hARes2Z8M5iK8h2bJQlWNJD8",
    authDomain: "club595.firebaseapp.com",
    projectId: "club595",
    storageBucket: "club595.firebasestorage.app",
    messagingSenderId: "452572247063",
    appId: "1:452572247063:web:040230b948ada5b9a69852"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

let step = 1;
let selectedSvc = null;
let selectedTime = '';

// Главная функция рендера
function renderClient() {
    const root = document.getElementById('app');
    if (window.isAdminMode) return;

    if (step === 1) {
        root.innerHTML = `
            <div class="container">
                <h1>CLUB 5/95</h1>
                <p style="text-align:center; letter-spacing:3px; color:#8E9382; margin-bottom:30px; font-size:10px;">PREMIUM MASSAGE</p>
                <div id="services-list">
                    <button class="service-btn" onclick="window.goStep2('Neck Massage')">Neck & Shoulder Restoration</button>
                    <button class="service-btn" onclick="window.goStep2('Detox Massage')">Detox & Drainage Boost</button>
                    <button class="service-btn" onclick="window.goStep2('System 5/95')">System 5/95 (Official)</button>
                </div>
                <button onclick="window.showLogin()" style="margin-top:100px; background:none; border:none; color:#CCC; font-size:10px; width:100%; cursor:pointer;">STAFF ACCESS</button>
            </div>
        `;
    } else if (step === 2) {
        root.innerHTML = `
            <div class="container">
                <h2>Select Time</h2>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                    ${['10:00', '12:00', '14:00', '16:00', '18:00'].map(t => `<button class="btn-time" onclick="window.confirmTime('${t}')">${t}</button>`).join('')}
                </div>
                <button onclick="window.setStep(1)" style="margin-top:20px; background:none; border:none; color:#AAA; font-weight:bold;">← BACK</button>
            </div>
        `;
    } else if (step === 3) {
        root.innerHTML = `
            <div class="container">
                <h2>Your Details</h2>
                <input type="text" id="c-name" placeholder="Name">
                <input type="tel" id="c-phone" placeholder="Phone">
                <button class="btn-main" style="background:#8B5E3C; color:white;" onclick="window.sendBooking()">Book Now</button>
            </div>
        `;
    }
}

// Функции для кнопок
window.setStep = (s) => { step = s; renderClient(); };
window.goStep2 = (name) => { selectedSvc = name; step = 2; renderClient(); };
window.confirmTime = (t) => { selectedTime = t; step = 3; renderClient(); };
window.showLogin = () => { window.isAdminMode = true; window.renderLoginScreen(); };

window.sendBooking = async () => {
    const n = document.getElementById('c-name').value;
    const p = document.getElementById('c-phone').value;
    if(!n || !p) return alert("Fill details");
    await db.collection("bookings").add({
        name: n, phone: p, service: selectedSvc, time: selectedTime,
        date: new Date().toISOString().split('T')[0],
        sessionsLeft: 10, master: 'm1'
    });
    alert("Success!");
    location.reload();
};

renderClient();
