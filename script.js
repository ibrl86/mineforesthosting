// ⚡ Config Firebase
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

// Helper pentru mesaje
function showMessage(id, text, color="green") {
    const el = document.getElementById(id);
    if(el) {
        el.innerText = text;
        el.style.color = color;
    }
}

// Register
document.getElementById("register-form").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;

    auth.createUserWithEmailAndPassword(email, password)
        .then(() => showMessage("register-message", "Cont creat cu succes!"))
        .catch(err => showMessage("register-message", err.message, "red"));
});

// Login
document.getElementById("login-form").addEventListener("submit", e => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    auth.signInWithEmailAndPassword(email, password)
        .then(() => showMessage("login-message", `Login reușit! Bun venit, ${email}`))
        .catch(err => showMessage("login-message", err.message, "red"));
});

// Forgot password
document.getElementById("forgot-password").addEventListener("click", () => {
    const email = prompt("Introdu email-ul pentru resetare:");
    if(email) {
        auth.sendPasswordResetEmail(email)
            .then(() => alert("Email de resetare trimis cu succes!"))
            .catch(err => alert(err.message));
    }
});

// Activate plan
function activatePlan(planName) {
    const user = auth.currentUser;
    if(!user) {
        alert("Trebuie să fii logat pentru a lua planul!");
        return;
    }

    db.collection("users").doc(user.uid).set({ plan: planName }, { merge: true })
      .then(() => alert(`Ai activat planul ${planName}!`))
      .catch(err => alert(err.message));
}
