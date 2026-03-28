let currentAdminDate = new Date().toISOString().split('T')[0];
let adminSection = 'grid';
let selectedBooking = null;

// Вход в админку
window.enterAdmin = () => {
    window.isAdminMode = true;
    renderAdminLayout();
};

function renderAdminLayout() {
    const root = document.getElementById('app');
    root.innerHTML = `
        <div class="admin-header" style="background:white; padding:15px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #eee">
            <h2 style="margin:0; font-weight:800; font-size:16px;">CLUB 595 ADMIN</h2>
            <button onclick="location.reload()" style="background:#3A3D38; color:white; border:none; padding:8px 15px; border-radius:10px; font-size:12px;">Logout</button>
        </div>
        
        <div class="admin-tabs">
            <button class="tab-btn ${adminSection==='grid'?'active':''}" onclick="adminSection='grid'; renderAdminLayout()">Schedule</button>
            <button class="tab-btn ${adminSection==='clients'?'active':''}" onclick="adminSection='clients'; renderAdminSection('clients')">Clients Base</button>
            <button class="tab-btn ${adminSection==='settings'?'active':''}" onclick="adminSection='settings'; renderAdminSection('settings')">Settings</button>
        </div>
        <div id="admin-main-area"></div>

        <!-- КАРТОЧКА КЛИЕНТА (MODAL) -->
        <div class="overlay" id="overlay" onclick="closeClientCard()"></div>
        <div class="modal" id="client-card-modal">
            <div id="card-content"></div>
        </div>
    `;
    if(adminSection === 'grid') renderSchedule();
}

// 1. РЕНДЕР СЕТКИ
async function renderSchedule() {
    const area = document.getElementById('admin-main-area');
    let weekHtml = `<div class="week-strip">`;
    for(let i=0; i<7; i++) {
        let d = new Date();
        d.setDate(d.getDate() + i);
        let dStr = d.toISOString().split('T')[0];
        weekHtml += `
            <div class="day-card ${dStr === currentAdminDate ? 'active' : ''}" onclick="currentAdminDate='${dStr}'; renderSchedule()">
                <span>${d.toLocaleDateString('en-US', {weekday: 'short'})}</span>
                <b>${d.getDate()}</b>
            </div>`;
    }
    area.innerHTML = weekHtml + `</div><div id="grid-container" style="background:white"></div>`;

    db.collection("bookings").where("date", "==", currentAdminDate).onSnapshot(snap => {
        const bookings = snap.docs.map(d => ({id: d.id, ...d.data()}));
        let gridHtml = ``;
        // Генерируем часы (например с 10 до 20)
        for(let h=10; h<=19; h++) {
            let t = `${h}:00`;
            gridHtml += `
                <div class="grid-row">
                    <div class="time-col">${t}</div>
                    <div class="slot">
                        ${bookings.filter(b => b.time === t).map(b => `
                            <div class="booking-badge" onclick="openClientCard('${b.id}')">
                                <span class="b-name">${b.name}</span>
                                <span style="font-size:9px; opacity:0.7">${b.service}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>`;
        }
        document.getElementById('grid-container').innerHTML = gridHtml;
    });
}

// 2. ОТКРЫТИЕ КАРТОЧКИ КЛИЕНТА
window.openClientCard = async (bookingId) => {
    const doc = await db.collection("bookings").doc(bookingId).get();
    const b = doc.data();
    
    // Ищем всю историю этого клиента по номеру телефона
    const historySnap = await db.collection("bookings").where("phone", "==", b.phone).get();
    const history = historySnap.docs.map(d => d.data());

    const content = document.getElementById('card-content');
    content.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px">
            <h2 style="margin:0; font-weight:900; font-size:20px">Appointment details</h2>
            <span onclick="closeClientCard()" style="cursor:pointer; font-size:24px; color:#CCC">✕</span>
        </div>

        <div style="display:flex; gap:20px; border-bottom:1px solid #EEE; margin-bottom:20px; font-weight:700; font-size:14px">
            <span style="border-bottom:2px solid black; padding-bottom:10px">Details</span>
            <span style="color:#AAA">Activity</span>
        </div>

        <!-- КЛИЕНТ -->
        <div style="border:1px solid #EEE; border-radius:15px; padding:15px; display:flex; align-items:center; gap:15px; margin-bottom:15px">
            <div style="width:45px; height:45px; background:var(--olive); border-radius:50%; display:flex; align-items:center; justify-content:center; color:white; font-weight:900">${b.name[0]}</div>
            <div style="text-align:left">
                <div style="font-weight:800; font-size:16px">${b.name}</div>
                <div style="font-size:12px; color:#888">${b.phone}</div>
            </div>
        </div>

        <!-- ДЕТАЛИ СЕАНСА -->
        <div style="background:var(--bg); border-radius:15px; padding:15px; text-align:left; margin-bottom:15px">
            <div style="font-size:11px; font-weight:800; color:var(--olive-dark); margin-bottom:10px">SERVICE DETAILS:</div>
            <div style="font-weight:700; font-size:14px">${b.service}</div>
            <div style="font-size:13px; color:#666">${b.date} at ${b.time}</div>
        </div>

        <!-- АБОНЕМЕНТ -->
        <div style="background:var(--olive-dark); color:white; border-radius:15px; padding:20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center">
            <div>
                <div style="font-size:10px; opacity:0.8">SESSIONS LEFT</div>
                <div style="font-size:28px; font-weight:900">${b.sessionsLeft || 0}</div>
            </div>
            <button onclick="deductFromCard('${bookingId}')" style="background:white; color:black; border:none; padding:10px 15px; border-radius:10px; font-weight:800; font-size:11px">DEDUCT</button>
        </div>

        <!-- ИСТОРИЯ ВИЗИТОВ -->
        <div style="text-align:left">
            <div style="font-size:11px; font-weight:800; color:#AAA; margin-bottom:10px">VISIT HISTORY (${history.length}):</div>
            <div style="max-height:100px; overflow-y:auto; font-size:12px; color:#666">
                ${history.map(h => `<div>• ${h.date} - ${h.service}</div>`).join('')}
            </div>
        </div>

        <button class="checkout-btn" style="background:black; color:white; width:100%; padding:18px; border-radius:12px; margin-top:20px; font-weight:800">Checkout</button>
    `;

    document.getElementById('client-card-modal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
};

window.closeClientCard = () => {
    document.getElementById('client-card-modal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
};

window.deductFromCard = async (id) => {
    await db.collection("bookings").doc(id).update({ sessionsLeft: firebase.firestore.FieldValue.increment(-1) });
    alert("Session deducted!");
    openClientCard(id); // Обновляем данные в карточке
};

// 3. ДРУГИЕ СЕКЦИИ (Клиенты, Настройки)
function renderAdminSection(type) {
    adminSection = type;
    const area = document.getElementById('admin-main-area');
    if(type === 'settings') {
        area.innerHTML = `<div class="settings-box"><h3>Working Hours</h3><p>Configure your studio schedule here.</p></div>`;
    }
    if(type === 'clients') {
        area.innerHTML = `<div style="padding:20px"><h3>Client Database</h3><p>Loading records...</p></div>`;
    }
}
