window.isAdminMode = false;

window.enterAdmin = () => {
    window.isAdminMode = true;
    const root = document.getElementById('app');
    root.innerHTML = `
        <div class="admin-view" style="display:block">
            <header>
                <div style="font-weight:900">MAR 23, 2026 ▾</div>
                <div onclick="location.reload()" style="cursor:pointer">✕</div>
            </header>
            <div class="masters-row">
                <div class="time-col"></div>
                <div class="master-head"><div class="avatar" style="background:#8E9382">M</div><div style="font-size:11px">Mary</div></div>
                <div class="master-head"><div class="avatar">M</div><div style="font-size:11px">Mila</div></div>
            </div>
            <div id="admin-grid"></div>
        </div>
        <div class="overlay" id="overlay" onclick="window.closeAdm()"></div>
        <div class="modal" id="admModal">
            <h2 id="adm-n" style="margin:0"></h2>
            <p id="adm-i" style="color:#8E9382"></p>
            <div style="background:#FDF9ED; padding:20px; border-radius:15px; margin-top:15px; text-align:center">
                <div style="font-size:10px; font-weight:800">SESSIONS</div>
                <div id="adm-c" style="font-size:40px; font-weight:900">10</div>
                <button class="book-btn" onclick="window.deductOne()">DEDUCT SESSION</button>
            </div>
        </div>`;
    
    db.collection("bookings").onSnapshot(snap => {
        const bookings = snap.docs.map(d => ({id: d.id, ...d.data()}));
        const grid = document.getElementById('admin-grid');
        if (!grid) return;
        grid.innerHTML = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"].map(h => `
            <div class="grid-row">
                <div class="time-col">${h}</div>
                <div class="slot">
                    ${bookings.filter(b => b.time === h && b.master === 'm1').map(b => `
                        <div class="booking-badge" onclick="window.openAdm('${b.id}')">
                            <b>${b.name}</b><br>${b.service.substring(0,10)}...
                        </div>`).join('')}
                </div>
                <div class="slot"></div>
            </div>`).join('');
    });
};

let curId = null;
window.openAdm = async (id) => {
    const doc = await db.collection("bookings").doc(id).get();
    const data = doc.data(); curId = id;
    document.getElementById('adm-n').innerText = data.name;
    document.getElementById('adm-i').innerText = data.service + ' @ ' + data.time;
    document.getElementById('adm-c').innerText = data.sessionsLeft;
    document.getElementById('admModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
};

window.closeAdm = () => {
    document.getElementById('admModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
};

window.deductOne = async () => {
    await db.collection("bookings").doc(curId).update({ sessionsLeft: firebase.firestore.FieldValue.increment(-1) });
    document.getElementById('adm-c').innerText -= 1;
};
