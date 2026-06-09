const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filter-btn");

const taskCounter = document.getElementById("taskCounter");
const clearCompleted = document.getElementById("clearCompleted");
const emptyMessage = document.getElementById("emptyMessage");
const themeToggle = document.getElementById("themeToggle");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();

    if (!text) {
        alert("Please enter a task.");
        return;
    }

    tasks.push({
        id: Date.now(),
        text,
        completed: false
    });

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {

        if(currentFilter === "active"){
            return !task.completed;
        }

        if(currentFilter === "completed"){
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span class="${task.completed ? "completed" : ""}">
                ${task.text}
            </span>

            <div class="actions">

                <button
                    class="complete-btn"
                    data-id="${task.id}">
                    ${task.completed ? "↺" : "✓"}
                </button>

                <button
                    class="edit-btn"
                    data-id="${task.id}">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    data-id="${task.id}">
                    Delete
                </button>

            </div>
        `;

        taskList.appendChild(li);
    });

    const activeTasks =
        tasks.filter(task => !task.completed).length;

    taskCounter.textContent =
        `${activeTasks} task${activeTasks !== 1 ? "s" : ""} left`;

    emptyMessage.style.display =
        filteredTasks.length === 0
            ? "block"
            : "none";
}

addBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", e => {
    if(e.key === "Enter"){
        addTask();
    }
});

taskList.addEventListener("click", e => {

    const id = Number(e.target.dataset.id);

    if(e.target.classList.contains("complete-btn")){

        tasks = tasks.map(task =>
            task.id === id
                ? {...task, completed: !task.completed}
                : task
        );

        saveTasks();
        renderTasks();
    }

    if(e.target.classList.contains("edit-btn")){

        const task =
            tasks.find(task => task.id === id);

        const updatedText =
            prompt("Edit Task:", task.text);

        if(
            updatedText !== null &&
            updatedText.trim() !== ""
        ){
            task.text = updatedText.trim();

            saveTasks();
            renderTasks();
        }
    }

    if(e.target.classList.contains("delete-btn")){

        const confirmDelete =
            confirm("Delete this task?");

        if(confirmDelete){

            tasks = tasks.filter(
                task => task.id !== id
            );

            saveTasks();
            renderTasks();
        }
    }
});

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        currentFilter =
            button.dataset.filter;

        renderTasks();
    });
});

clearCompleted.addEventListener("click", () => {

    const completedCount =
        tasks.filter(task => task.completed).length;

    if(completedCount === 0){
        alert("No completed tasks.");
        return;
    }

    const confirmClear =
        confirm("Clear all completed tasks?");

    if(confirmClear){

        tasks = tasks.filter(
            task => !task.completed
        );

        saveTasks();
        renderTasks();
    }
});

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const theme =
        document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("theme", theme);

    themeToggle.textContent =
        theme === "dark"
        ? "☀️"
        : "🌙";
});

const savedTheme =
    localStorage.getItem("theme");

if(savedTheme === "dark"){

    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}

renderTasks();