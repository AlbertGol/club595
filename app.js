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

let bookingData = { service: '', date: '', time: '', name: '', phone: '' };

// Инициализация
window.onload = () => {
    loadServices();
    loadPortfolio();
    loadReviews();
};

function loadServices() {
    db.collection("services").onSnapshot(snap => {
        const list = document.getElementById('services-list');
        list.innerHTML = '';
        snap.forEach(doc => {
            const s = doc.data();
            list.innerHTML += `
                <div class="service-item" onclick="startBooking('${s.name}', ${s.price})">
                    <div>
                        <div style="font-weight:700">${s.name}</div>
                        <div style="font-size:11px; opacity:0.5">${s.duration} min</div>
                    </div>
                    <div style="font-weight:800; color:var(--accent)">$${s.price}</div>
                </div>`;
        });
    });
}

function startBooking(serviceName, price) {
    bookingData.service = serviceName;
    const modal = document.getElementById('booking-modal');
    modal.style.display = 'flex';
    renderBookingStep('calendar');
}

function renderBookingStep(step) {
    const content = document.getElementById('booking-step-content');
    if (step === 'calendar') {
        content.innerHTML = `
            <h3 style="margin:0 0 20px 0">Select Date</h3>
            <input type="date" id="book-date" onchange="bookingData.date=this.value; renderBookingStep('time')">
        `;
    } else if (step === 'time') {
        content.innerHTML = `
            <h3 style="margin:0 0 20px 0">Select Time</h3>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px">
                ${['09:00', '11:00', '13:00', '15:00', '17:00'].map(t => `
                    <button class="day-btn" onclick="bookingData.time='${t}'; renderBookingStep('details')">${t}</button>
                `).join('')}
            </div>
        `;
    } else if (step === 'details') {
        content.innerHTML = `
            <h3 style="margin:0 0 20px 0">Your Info</h3>
            <input type="text" id="c-name" placeholder="Name">
            <input type="tel" id="c-phone" placeholder="Phone">
            <button class="btn-primary" onclick="finishBooking()">Book Now</button>
        `;
    }
}

async function finishBooking() {
    bookingData.name = document.getElementById('c-name').value;
    bookingData.phone = document.getElementById('c-phone').value;
    
    await db.collection("bookings").add({
        ...bookingData,
        master: 'm1', // Default Mary
        status: 'confirmed',
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    document.getElementById('booking-step-content').innerHTML = `<div style="text-align:center"><h2>Success! ✨</h2><p>Wait for you at ${bookingData.time}</p></div>`;
    setTimeout(closeBooking, 3000);
}

function closeBooking() { document.getElementById('booking-modal').style.display = 'none'; }
function showView(id) {
    document.querySelectorAll('.view').forEach(v => v.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
}
