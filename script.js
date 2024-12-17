class TodoApp {
    constructor() {
        this.tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        this.initEventListeners();
        this.renderTasks();
        this.updateStats();
    }

    initEventListeners() {
        const taskForm = document.getElementById('task-form');
        if (taskForm) {
            taskForm.addEventListener('submit', this.addTask.bind(this));
        }

        const searchBar = document.getElementById('search-bar');
        if (searchBar) {
            searchBar.addEventListener('input', this.filterTasks.bind(this));
        }

        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', this.sortTasks.bind(this));
        }
    }

    addTask(event) {
        event.preventDefault();
        
        const taskNameInput = document.getElementById('task-name');
        const taskDateInput = document.getElementById('task-date');
        const taskPriorityInput = document.getElementById('task-priority');

        if (!taskNameInput || !taskDateInput || !taskPriorityInput) {
            console.error('One or more form elements not found');
            return;
        }

        const taskName = taskNameInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskPriority = taskPriorityInput.value;

        if (!taskName) {
            alert('Please enter a task name');
            return;
        }

        const newTask = {
            id: Date.now(),
            name: taskName,
            date: taskDate,
            priority: taskPriority,
            completed: false
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        // Reset form
        taskNameInput.value = '';
        taskDateInput.value = '';
        taskPriorityInput.selectedIndex = 0;
    }

    renderTasks(tasksToRender = this.tasks) {
        const taskList = document.getElementById('task-list');
        if (!taskList) {
            console.error('Task list element not found');
            return;
        }

        taskList.innerHTML = '';

        tasksToRender.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.classList.add('task-item', `${task.priority}-priority`);
            
            // Check if task is overdue
            const today = new Date();
            const taskDate = new Date(task.date);
            if (taskDate < today && !task.completed) {
                taskElement.classList.add('overdue');
            }

            taskElement.innerHTML = `
                <span>${task.name} - ${task.date}</span>
                <div>
                    <button onclick="todoApp.toggleComplete(${task.id})">
                        ${task.completed ? '✓' : '○'}
                    </button>
                    <button onclick="todoApp.deleteTask(${task.id})">🗑️</button>
                </div>
            `;

            taskList.appendChild(taskElement);
        });
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
    }

    toggleComplete(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    filterTasks() {
        const searchBar = document.getElementById('search-bar');
        if (!searchBar) return;

        const searchTerm = searchBar.value.toLowerCase();
        const filteredTasks = this.tasks.filter(task => 
            task.name.toLowerCase().includes(searchTerm)
        );
        this.renderTasks(filteredTasks);
    }

    sortTasks() {
        const sortSelect = document.getElementById('sort-select');
        if (!sortSelect) return;

        const sortMethod = sortSelect.value;
        let sortedTasks = [...this.tasks];

        switch(sortMethod) {
            case 'date':
                sortedTasks.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'priority':
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                sortedTasks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);
                break;
            case 'name':
                sortedTasks.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }

        this.renderTasks(sortedTasks);
    }

    updateStats() {
        const totalTasksElem = document.getElementById('total-tasks');
        const completedTasksElem = document.getElementById('completed-tasks');
        const overdueTasksElem = document.getElementById('overdue-tasks');

        if (!totalTasksElem || !completedTasksElem || !overdueTasksElem) return;

        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        const overdueTasks = this.tasks.filter(task => {
            const today = new Date();
            const taskDate = new Date(task.date);
            return taskDate < today && !task.completed;
        }).length;

        totalTasksElem.textContent = totalTasks;
        completedTasksElem.textContent = completedTasks;
        overdueTasksElem.textContent = overdueTasks;
    }

    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
}

// Ensure the DOM is fully loaded before initializing the app
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new TodoApp();
});