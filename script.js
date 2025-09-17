// ⚡ Config Firebase (înlocuiește cu config-ul tău)
const firebaseConfig = {
    apiKey: "API_KEY",
    authDomain: "PROJECT_ID.firebaseapp.com",
    projectId: "PROJECT_ID",
    storageBucket: "PROJECT_ID.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Register
document.getElementById("register-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert("Cont creat cu succes!"))
        .catch(err => alert(err.message));
});

// Login
document.getElementById("login-form")?.addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => window.location.href = "dashboard.html")
        .catch(err => alert(err.message));
});

// Dashboard
if (window.location.pathname.includes("dashboard.html")) {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = "index.html";
        } else {
            document.getElementById("user-email").innerText = user.email;
            db.collection("users").doc(user.uid).get().then(doc => {
                if (doc.exists) {
                    document.getElementById("user-plan").innerText = doc.data().plan || "Niciun plan";
                }
            });
        }
    });

    document.getElementById("logout-btn").addEventListener("click", () => {
        auth.signOut().then(() => window.location.href = "index.html");
    });
}

// Funcția pentru a lua un plan
function activatePlan(planName) {
    const user = auth.currentUser;
    if (!user) {
        alert("Trebuie să fii logat pentru a lua planul!");
        return;
    }
    db.collection("users").doc(user.uid).set({ plan: planName }, { merge: true })
        .then(() => {
            alert(`Ai activat planul ${planName}!`);
            document.getElementById("user-plan").innerText = planName;
            document.getElementById("server-ip").innerText = "play.mineforest.com";
            document.getElementById("server-port").innerText = "25565";
        });

}
