// АУТЕНТИФИКАЦИЯ
async function handleLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    try {
        await firebase.auth().signInWithEmailAndPassword(email, pass);
        showView('admin-dashboard');
        renderAdminSection('grid');
    } catch (e) { alert("Error: " + e.message); }
}

function handleLogout() {
    firebase.auth().signOut();
    location.reload();
}

// РЕНДЕР СЕКЦИЙ
function renderAdminSection(type) {
    const area = document.getElementById('admin-content-area');
    area.innerHTML = `<p style="padding:20px">Loading ${type}...</p>`;

    if (type === 'grid') {
        db.collection("bookings").onSnapshot(snap => {
            let html = `<div class="admin-grid"><div>Time</div><div>Mary</div><div>Mila</div>`;
            const hours = ['09:00', '11:00', '13:00', '15:00', '17:00'];
            hours.forEach(h => {
                const b = snap.docs.find(d => d.data().time === h);
                html += `<div class="admin-cell">${h}</div>`;
                html += `<div class="admin-cell" style="background:${b?'var(--accent)':'none'}">${b ? b.data().name : ''}</div>`;
                html += `<div class="admin-cell"></div>`;
            });
            area.innerHTML = html + `</div>`;
        });
    } else if (type === 'services') {
        area.innerHTML = `
            <div style="padding:20px">
                <h3>Manage Services</h3>
                <button class="btn-primary" onclick="addService()">+ Add New Service</button>
                <div id="admin-services-list"></div>
            </div>`;
        loadAdminServices();
    }
}

async function addService() {
    const name = prompt("Service Name:");
    const price = Number(prompt("Price:"));
    const duration = Number(prompt("Duration (min):"));
    if (name && price) {
        await db.collection("services").add({ name, price, duration });
    }
}

function loadAdminServices() {
    db.collection("services").onSnapshot(snap => {
        const list = document.getElementById('admin-services-list');
        if(!list) return;
        list.innerHTML = '';
        snap.forEach(doc => {
            const s = doc.data();
            list.innerHTML += `
                <div style="padding:15px; background:white; margin-top:10px; border-radius:10px; display:flex; justify-content:space-between">
                    <span>${s.name} ($${s.price})</span>
                    <button onclick="deleteService('${doc.id}')" style="color:red">Delete</button>
                </div>`;
        });
    });
}

async function deleteService(id) {
    if(confirm("Delete this service?")) await db.collection("services").doc(id).delete();
}
