let currentFilter = 'all';

const priorityIcons = {
  High: '<span class="priority-icon text-danger">🔴</span>',
  Medium: '<span class="priority-icon text-warning">🟠</span>',
  Low: '<span class="priority-icon text-success">🟢</span>'
};

const categoryBadges = {
  Work: 'primary',
  Personal: 'info',
  Shopping: 'warning',
  Other: 'secondary'
};

function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  let completedCount = 0;
  let visibleCount = 0;

  tasks.forEach((task, index) => {
    if (currentFilter === "completed" && !task.completed) return;
    if (currentFilter === "pending" && task.completed) return;

    const isCompleted = task.completed ? "task-completed" : "";
    if (task.completed) completedCount++;
    visibleCount++;

    const badgeClass = categoryBadges[task.category] || "dark";
    const priority = priorityIcons[task.priority] || "";

    const item = document.createElement("li");
    item.className = `task-item ${isCompleted}`;
    item.innerHTML = `
      <div class="flex-grow-1">
        <strong>${priority}${task.text}</strong><br>
        <small class="text-muted">Due: ${task.dueDate}</small><br>
        <span class="badge bg-${badgeClass} badge-category">${task.category}</span>
        <span class="badge bg-light text-dark">${task.priority}</span>
      </div>
      <div class="task-icons">
        <i class="fa-solid fa-check text-success" title="Mark Complete" onclick="toggleComplete(${index})"></i>
        <i class="fa-solid fa-pen-to-square text-primary" title="Edit Task" onclick="editTask(${index})"></i>
        <i class="fa-solid fa-trash text-danger" title="Delete Task" onclick="deleteTask(${index})"></i>
      </div>
    `;
    taskList.appendChild(item);
  });

  updateProgress(completedCount, visibleCount);
}

function updateProgress(completed, total) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const bar = document.getElementById("progressBar");
  bar.style.width = percent + "%";
  bar.textContent = percent + "%";
}

function filterTasks(filter) {
  currentFilter = filter;
  loadTasks();
}

function toggleComplete(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function deleteTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
}

function editTask(index) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const task = tasks[index];
  const newText = prompt("Update task description:", task.text);
  if (newText !== null) {
    task.text = newText.trim() || task.text;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  }
}

document.addEventListener("DOMContentLoaded", loadTasks);
