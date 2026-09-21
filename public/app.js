const API_URL = '/api/tasks';

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskTitleInput = document.getElementById('task-title');
const taskDescInput = document.getElementById('task-desc');
const taskList = document.getElementById('task-list');

// State
let tasks = [];

// Load tasks when page opens
document.addEventListener('DOMContentLoaded', fetchTasks);

// Handle form submission
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = taskTitleInput.value.trim();
    const description = taskDescInput.value.trim();
    
    if (!title) return;

    await addTask({ title, description });
    
    // Reset form
    taskForm.reset();
    taskTitleInput.focus();
});

// Fetch all tasks from backend
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
}

// Create a new task
async function addTask(taskData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });
        const newTask = await response.json();
        tasks.push(newTask);
        renderTasks();
    } catch (error) {
        console.error('Error adding task:', error);
    }
}

// Update task completion status
async function toggleTaskStatus(id, currentStatus) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !currentStatus })
        });
        const updatedTask = await response.json();
        
        // Update task list with the new data
        tasks = tasks.map(t => t._id === id ? updatedTask : t);
        renderTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
}

// Delete a task
async function deleteTask(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        tasks = tasks.filter(t => t._id !== id);
        renderTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
}

// Render the task list to the screen
function renderTasks() {
    taskList.innerHTML = '';

    // Put uncompleted tasks first
    const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);

    sortedTasks.forEach(task => {
        const li = document.createElement('li');
        if (task.completed) li.className = 'completed';
        
        // Checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskStatus(task._id, task.completed));
        
        // Text Content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'task-title';
        titleDiv.textContent = task.title;
        contentDiv.appendChild(titleDiv);

        if (task.description) {
            const descDiv = document.createElement('div');
            descDiv.className = 'task-desc';
            descDiv.textContent = task.description;
            contentDiv.appendChild(descDiv);
        }

        // Delete Button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task._id));

        // Add everything to the list item
        li.appendChild(checkbox);
        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);
        
        taskList.appendChild(li);
    });
}
