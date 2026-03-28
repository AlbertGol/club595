window.isAdminMode = false;

// Экран логина
window.renderLoginScreen = () => {
    const root = document.getElementById('app');
    root.innerHTML = `
        <div class="container" style="display:flex; flex-direction:column; justify-content:center; align-items:center; min-height:100vh;">
            <div style="background:white; padding:30px; border-radius:30px; width:100%; box-shadow:0 10px 30px rgba(0,0,0,0.05);">
                <h2 style="margin:0 0 20px 0; text-align:center;">Admin Login</h2>
                <input type="email" id="adm-email" placeholder="Email (admin@595.com)">
                <input type="password" id="adm-pass" placeholder="Password">
                <button class="btn-main" style="background:#3A3D38; color:white; margin-top:10px;" onclick="window.handleLogin()">Login</button>
                <button onclick="location.reload()" style="background:none; border:none; color:#AAA; margin-top:20px; width:100%;">Back to site</button>
            </div>
        </div>
    `;
};

window.handleLogin = async () => {
    const email = document.getElementById('adm-email').value;
    const pass = document.getElementById('adm-pass').value;
    try {
        await firebase.auth().signInWithEmailAndPassword(email, pass);
        window.enterAdmin(); // Если пароль верный — идем в шахматку
    } catch (e) {
        alert("Wrong email or password!");
    }
};

// Функция входа в саму админку (шахматку)
window.enterAdmin = () => {
    window.isAdminMode = true;
    renderAdminLayout();
};

// ... тут идет функция renderAdminLayout, которую я давал в прошлом сообщении (с карточкой клиента) ...
// Я её сократил для ясности, но в твоем GitHub она должна быть полной!
