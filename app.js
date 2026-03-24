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

const SERVICES = [
    { id: 1, name: 'Neck & Shoulder Restoration', img: 'https://images.unsplash.com/photo-1544161515-4ad6ce6db874?w=600', desc: 'Снимает зажимы и усталость. EMS + прогрев.' },
    { id: 2, name: 'Detox & Drainage Boost', img: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600', desc: 'Выводит токсины и лишнюю жидкость.' },
    { id: 3, name: 'Innovative Japanese Stone', img: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600', desc: 'Древние техники + современные девайсы.' },
    { id: 4, name: 'System 5/95 (Official)', img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=600', desc: 'Наш фирменный аппаратный массаж.' }
];

let step = 1; let selectedSvc = null; let selectedTime = '';

function renderApp() {
    const root = document.getElementById('app');
    if (window.isAdminMode) return;

    if (step === 1) {
        root.innerHTML = `<div class="container">
            <h1>TYPES OF MASSAGE</h1>
            <p style="text-align:center; font-size:10px; letter-spacing:4px; color:#8E9382; margin-bottom:30px">CLUB 5/95</p>
            ${SERVICES.map(s => `<button class="service-btn" onclick="window.chooseSvc(${s.id})">${s.name}</button>`).join('')}
            <button onclick="window.enterAdmin()" style="margin-top:50px; background:none; border:none; color:#AAA; font-size:10px; width:100%">ADMIN ACCESS</button>
        </div>`;
    } else if (step === 2) {
        root.innerHTML = `<div class="container">
            <img src="${selectedSvc.img}" style="width:100%; border-radius:20px; height:250px; object-fit:cover; margin-bottom:20px">
            <h2>${selectedSvc.name}</h2>
            <p style="font-size:14px; line-height:1.6">${selectedSvc.desc}</p>
            <p style="font-weight:900">$149 / 90 min</p>
            <button class="book-btn" onclick="window.goTime()">BOOK NOW</button>
            <button onclick="window.goBack(1)" style="margin-top:20px; background:none; border:none; font-weight:bold; color:#AAA">← BACK</button>
        </div>`;
    } else if (step === 3) {
        root.innerHTML = `<div class="container">
            <h1>SELECT TIME</h1>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:20px">
                ${['10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM'].map(t => `<button class="service-btn" style="justify-content:center" onclick="window.confirmT('${t}')">${t}</button>`).join('')}
            </div>
        </div>`;
    } else if (step === 4) {
        root.innerHTML = `<div class="container">
            <h1>CONTACT INFO</h1>
            <input type="text" id="nameIn" placeholder="Name" style="width:100%; padding:15px; border-radius:10px; border:1px solid #D9A87E; margin-bottom:10px">
            <input type="tel" id="phoneIn" placeholder="Phone" style="width:100%; padding:15px; border-radius:10px; border:1px solid #D9A87E; margin-bottom:20px">
            <button class="book-btn" onclick="window.sendToCloud()">CONFIRM</button>
        </div>`;
    }
}

window.chooseSvc = (id) => { selectedSvc = SERVICES.find(x => x.id === id); step = 2; renderApp(); };
window.goTime = () => { step = 3; renderApp(); };
window.confirmT = (t) => { selectedTime = t; step = 4; renderApp(); };
window.goBack = (s) => { step = s; renderApp(); };
window.sendToCloud = async () => {
    const n = document.getElementById('nameIn').value;
    const p = document.getElementById('phoneIn').value;
    await db.collection("bookings").add({ name: n, phone: p, time: selectedTime, service: selectedSvc.name, master: 'm1', sessionsLeft: 10, date: '2026-03-23' });
    alert("Success!"); window.location.reload();
};

renderApp();
