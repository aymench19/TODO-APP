class TaskManager {
    constructor() {
        this.tasks = TaskStorage.loadTasks();
        this.taskRenderer = new TaskRenderer(document.getElementById('task-list'));
        this.dashboard = new Dashboard();
        
        this._initElements();
        this._initEventListeners();
        this._renderAll();
    }

    _initElements() {
        this.taskForm = document.getElementById('task-form');
        this.taskInput = document.getElementById('task-input');
        this.taskDate = document.getElementById('task-date');
        this.taskPriority = document.getElementById('task-priority');
        this.searchInput = document.getElementById('search-input');
        this.sortBy = document.getElementById('sort-by');
        this.sortOrder = document.getElementById('sort-order');
        
        this.taskDate.value = new Date().toISOString().split('T')[0];
    }

    _initEventListeners() {
        this.taskForm.addEventListener('submit', (e) => this._handleFormSubmit(e));
        document.getElementById('task-list').addEventListener('click', (e) => this._handleTaskListClick(e));
        this.searchInput.addEventListener('input', () => this._renderAll());
        this.sortBy.addEventListener('change', () => this._renderAll());
        this.sortOrder.addEventListener('change', () => this._renderAll());
    }

    _handleFormSubmit(e) {
        e.preventDefault();
        
        const text = this.taskInput.value.trim();
        if (text === '') return;

        const newTask = {
            id: Date.now(),
            text: text,
            date: this.taskDate.value,
            priority: this.taskPriority.value,
            completed: false
        };

        this.tasks.push(newTask);
        this._saveAndRender();
        this.taskInput.value = '';
        this.taskInput.focus();
    }

    _handleTaskListClick(e) {
        const li = e.target.closest('li');
        if (!li) return;

        const taskId = parseInt(li.dataset.id);
        const task = this.tasks.find(t => t.id === taskId);

        if (e.target.classList.contains('delete-btn')) {
            if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche : "${task.text}" ?`)) {
                this.tasks = this.tasks.filter(task => task.id !== taskId);
                this._saveAndRender();
            }
        }
        else if (e.target.classList.contains('complete-btn')) {
            const action = task.completed ? 'marquer comme non terminée' : 'marquer comme terminée';
            
            if (confirm(`Voulez-vous vraiment ${action} cette tâche ?\n\n"${task.text}"`)) {
                this.tasks = this.tasks.map(task => {
                    if (task.id === taskId) {
                        return { ...task, completed: !task.completed };
                    }
                    return task;
                });
                this._saveAndRender();
            }
        }
    }

    _saveAndRender() {
        TaskStorage.saveTasks(this.tasks);
        this._renderAll();
    }

    _renderAll() {
        const options = {
            searchTerm: this.searchInput.value,
            sortField: this.sortBy.value,
            sortOrder: this.sortOrder.value
        };
        
        this.taskRenderer.render(this.tasks, options);
        this.dashboard.update(this.tasks);
    }
}