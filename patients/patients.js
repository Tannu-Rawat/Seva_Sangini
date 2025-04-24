if (localStorage.getItem("isLoggedIn") !== "true") {
            window.location.href = "../index.html";
        }

        // Logout function
        function logout() {
            localStorage.removeItem("isLoggedIn");
            window.location.href = "../index.html";
}
const firebaseConfig = {
    apiKey: "AIzaSyANabSYGVWjrHU1wou5g_gMeIYw67I7Ejg",
    authDomain: "sakhicare-b4e84.firebaseapp.com",
    projectId: "sakhicare-b4e84",
    storageBucket: "sakhicare-b4e84.firebasestorage.app",
    messagingSenderId: "1067514445060",
    appId: "1:1067514445060:web:bc75fc3ec0f88527ffe451",
    measurementId: "G-L7RLDR38PY"
};
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Utility: Format timestamp
  function formatTimestamp(ts) {
    if (!ts) return '';
    try {
      const date = ts.toDate ? ts.toDate() : new Date(ts);
      return date.toLocaleString();
    } catch {
      return ts;
    }
  }

  // Fetch and render patients
  function renderPatients() {
    db.collection("seva sangini").get().then(snapshot => {
      const all = [];
      const pregnancy = [];
      const child = [];
      const highRisk = [];
      snapshot.forEach(doc => {
        const p = doc.data();
        p.id = doc.id;
        all.push(p);
        if (p["patient-type"] === "pregnancy") pregnancy.push(p);
        if (p["patient-type"] === "child") child.push(p);
        if (p.risk_status && String(p.risk_status).toLowerCase().includes("high")) highRisk.push(p);
      });
      fillTable("allPatientsTableBody", all);
      fillTable("pregnancyPatientsTableBody", pregnancy);
      fillTable("childPatientsTableBody", child);
      fillTable("highRiskPatientsTableBody", highRisk);
    });
  }

  // Fill a table with all fields
  function fillTable(tbodyId, patients) {
    const tbody = document.getElementById(tbodyId);
    if (!tbody) return;
    if (!patients.length) {
      tbody.innerHTML = `<tr><td colspan="16" class="text-center text-muted">No patients found</td></tr>`;
      return;
    }
    tbody.innerHTML = patients.map(p => `
      <tr>
        <td>${p.name || ""}</td>
        <td>${p["patient-type"] || ""}</td>
        <td>${p.phone || ""}</td>
        <td>${p.adhar || ""}</td>
        <td>${p.address || ""}</td>
        <td>${p.age ?? ""}</td>
        <td>${p.hemoglobin ?? ""}</td>
        <td>${p.bp || ""}</td>
        <td>${p.chronic_disease || ""}</td>
        <td>${p.c_section || ""}</td>
        <td>${p.birth_weight ?? ""}</td>
        <td>${p.congenital || ""}</td>
        <td>${p.immunization || ""}</td>
        <td>${p.risk_status || ""}</td>
        <td>${formatTimestamp(p.timestamp)}</td>
        <td>${p.comments || ""}</td>
      </tr>
    `).join('');
  }

  // On page load
document.addEventListener("DOMContentLoaded", renderPatients);
  document.getElementById('aadhaarSearchBtn').addEventListener('click', function() {
      const aadhaar = document.getElementById('aadhaarSearch').value.trim();
      if (!aadhaar) return;
      db.collection("seva sangini").where("adhar", "==", aadhaar).get().then(snapshot => {
          const patients = [];
          snapshot.forEach(doc => {
              const p = doc.data();
              p.id = doc.id;
              patients.push(p);
          });
          // Show in All Patients table (or create a modal if you want)
          fillTable("allPatientsTableBody", patients);
          // Optionally, switch to the "All Patients" tab:
          var tab = new bootstrap.Tab(document.querySelector('#all-tab'));
          tab.show();
      });
  });

  // Optional: Pressing Enter in the input triggers search
  document.getElementById('aadhaarSearch').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
          document.getElementById('aadhaarSearchBtn').click();
      }
  });
   document.getElementById('aadhaarSearchBtn').addEventListener('click', function() {
      const aadhaar = document.getElementById('aadhaarSearch').value.trim();
      if (!aadhaar) return;
      db.collection("seva sangini").where("adhar", "==", aadhaar).get().then(snapshot => {
          const patients = [];
          snapshot.forEach(doc => {
              const p = doc.data();
              p.id = doc.id;
              patients.push(p);
          });
          // Show in All Patients table (or create a modal if you want)
          fillTable("allPatientsTableBody", patients);
          // Optionally, switch to the "All Patients" tab:
          var tab = new bootstrap.Tab(document.querySelector('#all-tab'));
          tab.show();
      });
  });

  // Optional: Pressing Enter in the input triggers search
  document.getElementById('aadhaarSearch').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
          document.getElementById('aadhaarSearchBtn').click();
      }
  });
        