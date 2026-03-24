// Конфиг Firebase (Твой)
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

// 1. Загрузка услуг
db.collection("services").onSnapshot(snap => {
    const list = document.getElementById('services-list');
    list.innerHTML = '';
    snap.forEach(doc => {
        const s = doc.data();
        list.innerHTML += `
            <div class="service-card" onclick="openBooking('${doc.id}', '${s.name}')">
                <div class="service-name">${s.name}</div>
                <div class="service-price">$${s.price}</div>
            </div>
        `;
    });
});

// 2. Открытие записи
window.openBooking = (id, name) => {
    const modal = document.getElementById('booking-modal');
    modal.style.display = 'flex';
    document.getElementById('modal-content').innerHTML = `
        <h2 style="font-weight:900">Book ${name}</h2>
        <input type="text" id="c-name" placeholder="Your Name" style="width:100%; padding:15px; margin-top:15px; border-radius:12px; border:1px solid #ddd;">
        <button onclick="confirmVisit('${name}')" style="width:100%; background:#8E9382; color:white; padding:20px; margin-top:15px; border:none; border-radius:15px; font-weight:800;">CONFIRM</button>
    `;
};

window.closeBooking = () => { document.getElementById('booking-modal').style.display = 'none'; };

window.confirmVisit = async (name) => {
    const client = document.getElementById('c-name').value;
    await db.collection("bookings").add({
        client: client, service: name, date: new Date().toLocaleDateString()
    });
    alert("Success!");
    closeBooking();
};
