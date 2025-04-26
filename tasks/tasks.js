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

const ashaId = localStorage.getItem('ashaId');
const tasksRow = document.getElementById('tasks-row');

function getStatusBadge(status) {
  if (status === 'pending') return '<span class="badge bg-warning text-dark">Pending</span>';
  if (status === 'Completed') return '<span class="badge bg-success">Completed</span>';
  if (status === 'Overdue') return '<span class="badge bg-danger">Overdue</span>';
  return '';
}

function getActionButton(status, taskId) {
  if (status === 'Completed') {
    return '<button class="btn btn-outline-secondary w-100" disabled>Completed</button>';
  } else {
    return `<button class="btn btn-primary w-100" onclick="markTaskDone('${taskId}')">Mark as Done</button>`;
  }
}

function renderTaskCard(taskId, data) {
  return `
    <div class="col">
      <div class="card shadow-sm h-100">
        <div class="card-body">
          <h5 class="card-title">${data.title || 'Untitled Task'}</h5>
          <p class="card-text">${data.description || ''}</p>
          <p class="text-muted mb-1"><strong>Due:</strong> ${data.dueDate ? new Date(data.dueDate.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
          <p class="text-muted"><strong>Status:</strong> ${getStatusBadge(data.status)}</p>
          ${getActionButton(data.status, taskId)}
        </div>
      </div>
    </div>
  `;
}



function loadTasks() {
  if (!ashaId) {
    tasksRow.innerHTML = '<div class="col"><div class="alert alert-warning">No ASHA ID found. Please log in.</div></div>';
    return;
  }

  db.collection('tasks')
    .where('ashaId', '==', ashaId)
    .orderBy('dueDate')
    .get()
    .then(snapshot => {
      if (snapshot.empty) {
        tasksRow.innerHTML = '<div class="col"><div class="alert alert-info">No tasks found.</div></div>';
        return;
      }
      let html = '';
      snapshot.forEach(doc => {
        html += renderTaskCard(doc.id, doc.data());
      });
      tasksRow.innerHTML = html;
    })
    .catch(error => {
      tasksRow.innerHTML = `<div class="col"><div class="alert alert-danger">Error loading tasks: ${error.message}</div></div>`;
    });
}

function markTaskDone(taskId) {
  db.collection('tasks').doc(taskId)
    .update({ status: 'Completed' })
    .then(loadTasks)
    .catch(error => alert('Failed to update task: ' + error.message));
}

window.markTaskDone = markTaskDone;

document.addEventListener('DOMContentLoaded', loadTasks);
