import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getDatabase, ref, get, set, update } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";

// ===============================
// Firebase Config
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyAgCua6dfrPnXbCGkq7n1rVcWOP5vyBoFA",
  authDomain: "smart-glove-902e2.firebaseapp.com",
  projectId: "smart-glove-902e2",
  storageBucket: "smart-glove-902e2.firebasestorage.app",
  messagingSenderId: "559781453953",
  appId: "1:559781453953:web:9d76f473509e9fee37ed80",
  measurementId: "G-T3HCZK3CQ2",
  databaseURL: "https://smart-glove-902e2-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// DOM Elements
const patientForm = document.getElementById("patient-form");
const patientInfo = document.getElementById("patient-info");
const editBtn = document.getElementById("edit-btn");
const signoutBtn = document.getElementById("signout-btn");

const pName = document.getElementById("p-name");
const pAge = document.getElementById("p-age");
const pGender = document.getElementById("p-gender");

const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const genderInput = document.getElementById("gender");

let currentUID = null;

// ===============================
// Auth Protection
// ===============================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "index.html"; // redirect if not logged in
  } else {
    currentUID = user.uid;
    await loadPatientDetails();
  }
});

// ===============================
// Load Patient Details
// ===============================
async function loadPatientDetails() {
  const userRef = ref(db, "patients/" + currentUID);
  const snapshot = await get(userRef);

  if (snapshot.exists()) {
    const data = snapshot.val();
    displayPatient(data);
  } else {
    showForm(); // first-time user
  }
}

// ===============================
// Display Patient Info
// ===============================
function displayPatient(data) {
  pName.textContent = data.name;
  pAge.textContent = data.age;
  pGender.textContent = data.gender;

  patientInfo.classList.remove("hidden");
  patientForm.classList.add("hidden");
}

// ===============================
// Show Form (for new or edit)
// ===============================
function showForm(existingData = null) {
  if (existingData) {
    nameInput.value = existingData.name;
    ageInput.value = existingData.age;
    genderInput.value = existingData.gender;
  } else {
    patientForm.reset();
  }

  patientInfo.classList.add("hidden");
  patientForm.classList.remove("hidden");
}

// ===============================
// Save/Update Patient Info
// ===============================
patientForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: nameInput.value,
    age: ageInput.value,
    gender: genderInput.value,
  };

  try {
    await set(ref(db, "patients/" + currentUID), data);
    displayPatient(data);
  } catch (error) {
    alert("Error saving details: " + error.message);
  }
});

// ===============================
// Edit Button
// ===============================
editBtn.addEventListener("click", async () => {
  const snapshot = await get(ref(db, "patients/" + currentUID));
  if (snapshot.exists()) {
    showForm(snapshot.val());
  }
});

// ===============================
// Sign Out
// ===============================
signoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});
