// script.js - Estructura básica

// Variables globales
let tasks = [];
let editingTaskId = null;

// Elementos del DOM
const taskForm = document.getElementById('task-form');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const taskPriority = document.getElementById('task-priority');
const taskDueDate = document.getElementById('task-due-date');
const taskStatus = document.getElementById('task-status');
const cancelEditBtn = document.getElementById('cancel-edit');

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicació Kanban carregada');
    
    // Configurar la fecha mínima en el campo de fecha (hoy)
    const today = new Date().toISOString().split('T')[0];
    taskDueDate.min = today;
    
    // Aquí se cargarán las tareas del localStorage en futuros issues
    // loadTasksFromStorage();
    
    // Aquí se renderizarán las tareas en futuros issues
    // renderTasks();
    
    // Aquí se actualizarán las estadísticas en futuros issues
    // updateStats();
});

// Funciones que se implementarán en futuros issues
function saveTask(event) {
    event.preventDefault();
    console.log('Guardar tasca (a implementar)');
}

function editTask(taskId) {
    console.log('Editar tasca (a implementar)');
}

function deleteTask(taskId) {
    console.log('Eliminar tasca (a implementar)');
}

function moveTask(taskId, newStatus) {
    console.log('Moure tasca (a implementar)');
}

function filterTasks() {
    console.log('Filtrar tasques (a implementar)');
}

function searchTasks() {
    console.log('Cercar tasques (a implementar)');
}

function updateStats() {
    console.log('Actualitzar estadístiques (a implementar)');
}

function saveTasksToStorage() {
    console.log('Guardar tasques a localStorage (a implementar)');
}

function loadTasksFromStorage() {
    console.log('Carregar tasques de localStorage (a implementar)');
}

// Event listeners básicos (se completarán en futuros issues)
taskForm.addEventListener('submit', saveTask);
cancelEditBtn.addEventListener('click', function() {
    console.log('Cancel·lar edició (a implementar)');
});