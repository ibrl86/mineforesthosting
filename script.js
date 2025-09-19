// ⚡ Config Firebase
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Init Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

//
// ---------------- REGISTER ----------------
document.getElementById("register-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("✅ Cont creat cu succes!"))
        .catch(err => alert("❌ " + err.message));
});

//
// ---------------- LOGIN EMAIL/PAROLA ----------------
document.getElementById("login-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => window.location.href = "dashboard.html")
        .catch(err => alert("❌ " + err.message));
});

//
// ---------------- RESETARE PAROLA ----------------
document.getElementById("forgot-password")?.addEventListener("click", () => {
    const email = prompt("Te rog introdu email-ul tău pentru resetarea parolei:");
    if (!email) return;

    auth.sendPasswordResetEmail(email)
        .then(() => alert("✅ Email de resetare trimis! Verifică inbox-ul tău."))
        .catch(err => alert("❌ " + err.message));
});

//
// ---------------- LOGIN GOOGLE ----------------
document.getElementById("google-login")?.addEventListener("click", () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider)
        .then(result => {
            alert("✅ Conectat cu Google: " + result.user.email);
            window.location.href = "dashboard.html";
        })
        .catch(err => alert("❌ " + err.message));
});

//
// ---------------- LOGIN DISCORD ----------------
document.getElementById("discord-login")?.addEventListener("click", () => {
    const provider = new firebase.auth.OAuthProvider("discord.com");
    auth.signInWithPopup(provider)
        .then(result => {
            alert("✅ Conectat cu Discord: " + (result.user.displayName || result.user.email));
            window.location.href = "dashboard.html";
        })
        .catch(err => alert("❌ " + err.message));
});

//
// ---------------- DASHBOARD ----------------
if (window.location.pathname.includes("dashboard.html")) {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = "index.html";
        } else {
            document.getElementById("user-email").innerText = user.email || user.displayName;
            db.collection("users").doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    document.getElementById("user-plan").innerText = doc.data().plan || "Niciun plan";
                }
            });
        }
    });

    document.getElementById("logout-btn")?.addEventListener("click", () => {
        auth.signOut().then(() => window.location.href = "index.html");
    });
}

//
// ---------------- FUNCȚIA: ACTIVEAZĂ PLAN ----------------
function activatePlan(planName) {
    const user = auth.currentUser;
    if (!user) {
        alert("⚠️ Trebuie să fii logat pentru a lua planul!");
        return;
    }
    db.collection("users").doc(user.uid).set({ plan: planName }, { merge: true })
        .then(() => {
            alert(`✅ Ai activat planul ${planName}!`);
            document.getElementById("user-plan").innerText = planName;
            document.getElementById("server-ip").innerText = "play.mineforest.com";
            document.getElementById("server-port").innerText = "25565";
        });
}
