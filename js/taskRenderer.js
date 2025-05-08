class TaskRenderer {
    constructor(taskList) {
        this.taskList = taskList;
    }

    render(tasks, { searchTerm = '', sortField = 'date', sortOrder = 'asc' } = {}) {
        const filteredTasks = this._filterTasks(tasks, searchTerm);
        const sortedTasks = this._sortTasks(filteredTasks, sortField, sortOrder);
        
        this.taskList.innerHTML = '';
        
        if (sortedTasks.length === 0) {
            this.taskList.innerHTML = '<li class="no-tasks">Aucune tâche trouvée</li>';
            return;
        }

        sortedTasks.forEach(task => {
            this.taskList.appendChild(this._createTaskElement(task));
        });
    }

    _filterTasks(tasks, searchTerm) {
        return tasks.filter(task => 
            task.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    _sortTasks(tasks, sortField, order) {
        return [...tasks].sort((a, b) => {
            if (sortField === 'priority') {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                const aValue = priorityOrder[a.priority];
                const bValue = priorityOrder[b.priority];
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            if (sortField === 'completed') {
                return order === 'asc' ? (a.completed - b.completed) : (b.completed - a.completed);
            }
            
            let aValue, bValue;
            
            if (sortField === 'date') {
                aValue = new Date(a.date);
                bValue = new Date(b.date);
            } else {
                aValue = a[sortField].toLowerCase();
                bValue = b[sortField].toLowerCase();
            }
            
            if (aValue < bValue) return order === 'asc' ? -1 : 1;
            if (aValue > bValue) return order === 'asc' ? 1 : -1;
            return 0;
        });
    }

    _createTaskElement(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.classList.add(task.priority);
        if (task.completed) li.classList.add('completed');
        
        const priorityClass = `${task.priority}-priority`;
        const priorityText = 
            task.priority === 'high' ? 'Haute' : 
            task.priority === 'medium' ? 'Normale' : 'Faible';
        
        li.innerHTML = `
            <div class="task-info">
                <button class="complete-btn">${task.completed ? '✓' : ''}</button>
                <span class="task-text">${task.text}</span>
                <span class="task-date">${this._formatDate(task.date)}</span>
                <span class="task-priority ${priorityClass}">${priorityText}</span>
            </div>
            <button class="delete-btn">Supprimer</button>
        `;
        
        return li;
    }

    _formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
}