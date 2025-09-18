import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

// ===============================
// Firebase Config
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyAgCua6dfrPnXbCGkq7n1rVcWOP5vyBoFA",
  authDomain: "smart-glove-902e2.firebaseapp.com",
  projectId: "smart-glove-902e2",
  storageBucket: "smart-glove-902e2.appspot.com",
  messagingSenderId: "559781453953",
  appId: "1:559781453953:web:9d76f473509e9fee37ed80",
  measurementId: "G-T3HCZK3CQ2"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// ===============================
// Tabs Switching
// ===============================
const tabSignIn = document.getElementById('tab-signin');
const tabSignUp = document.getElementById('tab-signup');
const signinForm = document.getElementById('signin-form');
const signupForm = document.getElementById('signup-form');

tabSignIn.onclick = () => {
  tabSignIn.classList.add('active');
  tabSignUp.classList.remove('active');
  signinForm.style.display = 'block';
  signupForm.style.display = 'none';
};
tabSignUp.onclick = () => {
  tabSignUp.classList.add('active');
  tabSignIn.classList.remove('active');
  signupForm.style.display = 'block';
  signinForm.style.display = 'none';
};

// ===============================
// Firebase Authentication
// ===============================

// Sign Up with Email/Password
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value.trim();
  const pass = document.getElementById('signup-pass').value;

  try {
    await createUserWithEmailAndPassword(auth, email, pass);
    alert('✅ Account created. Please sign in.');
    tabSignIn.click();
  } catch (error) {
    alert("❌ " + error.message);
  }
});

// Sign In with Email/Password
signinForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signin-email').value.trim();
  const pass = document.getElementById('signin-pass').value;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch (error) {
    alert("❌ " + error.message);
  }
});

// Google Sign-In
document.getElementById('google-login').addEventListener('click', async () => {
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    alert("❌ " + error.message);
  }
});

// Sign Out
document.getElementById('signout-btn').addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert("❌ " + error.message);
  }
});

// ===============================
// Redirect after login
// ===============================
onAuthStateChanged(auth, (user) => {
  if (user) {
    // If logged in, go to monitor page
    window.location.href = "monitor.html";
  }
});
