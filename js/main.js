document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskPriority = document.getElementById('task-priority');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');
    const sortBy = document.getElementById('sort-by');
    const sortOrder = document.getElementById('sort-order');

    // Définir la date du jour par défaut
    taskDate.value = new Date().toISOString().split('T')[0];

    // Charger les tâches au démarrage
    let tasks = TaskStorage.loadTasks();
    renderTasks(tasks);

    // Ajouter une nouvelle tâche
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const text = taskInput.value.trim();
        if (text === '') return;

        const newTask = {
            id: Date.now(),
            text: text,
            date: taskDate.value,
            priority: taskPriority.value,
            completed: false
        };

        tasks.push(newTask);
        TaskStorage.saveTasks(tasks);
        renderTasks(tasks);
        
        taskInput.value = '';
        taskInput.focus();
        updateDashboardStats();
    });

    // Gestion des clics sur la liste
    taskList.addEventListener('click', function(e) {
        const li = e.target.closest('li');
        if (!li) return;

        const taskId = parseInt(li.dataset.id);

        // Suppression
        if (e.target.classList.contains('delete-btn')) {
            tasks = tasks.filter(task => task.id !== taskId);
            TaskStorage.saveTasks(tasks);
            renderTasks(tasks);
            updateDashboardStats();
        }
        // Marquage complet/incomplet
        else if (e.target.classList.contains('complete-btn')) {
            tasks = tasks.map(task => {
                if (task.id === taskId) {
                    return { ...task, completed: !task.completed };
                }
                return task;
            });
            TaskStorage.saveTasks(tasks);
            renderTasks(tasks);
        }
    });

    // Recherche de tâches
    searchInput.addEventListener('input', function() {
        renderTasks(tasks);
    });

    // Tri des tâches
    sortBy.addEventListener('change', function() {
        renderTasks(tasks);
    });

    sortOrder.addEventListener('change', function() {
        renderTasks(tasks);
    });

    // Fonction pour afficher les tâches
    function renderTasks(tasksToRender) {
        // Filtrer selon la recherche
        const searchTerm = searchInput.value.toLowerCase();
        let filteredTasks = tasksToRender.filter(task => 
            task.text.toLowerCase().includes(searchTerm)
        );

        // Trier les tâches
        filteredTasks = sortTasks(filteredTasks);

        // Afficher les tâches
        taskList.innerHTML = '';
        
        if (filteredTasks.length === 0) {
            taskList.innerHTML = '<li class="no-tasks">Aucune tâche trouvée</li>';
            return;
        }

        filteredTasks.forEach(task => {
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
                    <span class="task-date">${formatDate(task.date)}</span>
                    <span class="task-priority ${priorityClass}">${priorityText}</span>
                </div>
                <button class="delete-btn">Supprimer</button>
            `;
            
            taskList.appendChild(li);
        });
        updateDashboardStats();
    }
    // Après la fonction renderTasks, ajoutez :
function updateDashboardStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const incompleteTasks = totalTasks - completedTasks;
    const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Mettre à jour les compteurs
    document.getElementById('total-tasks').textContent = totalTasks;
    document.getElementById('completed-tasks').textContent = completedTasks;
    document.getElementById('incomplete-tasks').textContent = incompleteTasks;

    // Mettre à jour la barre de progression
    document.getElementById('completion-bar').style.width = `${completionPercentage}%`;

    // Calculer la répartition par priorité
    const highPriority = tasks.filter(task => task.priority === 'high').length;
    const mediumPriority = tasks.filter(task => task.priority === 'medium').length;
    const lowPriority = tasks.filter(task => task.priority === 'low').length;

    // Mettre à jour les barres de priorité
    updatePriorityBar('high', highPriority, totalTasks);
    updatePriorityBar('medium', mediumPriority, totalTasks);
    updatePriorityBar('low', lowPriority, totalTasks);
}

function updatePriorityBar(priority, count, total) {
    const percentage = total > 0 ? (count / total) * 100 : 0;
    const fillElement = document.getElementById(`${priority}-priority-fill`);
    fillElement.style.width = `${percentage}%`;
    fillElement.setAttribute('title', `${count} tâches (${Math.round(percentage)}%)`);
}

    // Fonction de tri
    function sortTasks(tasks) {
        const sortField = sortBy.value;
        const order = sortOrder.value;
        
        return [...tasks].sort((a, b) => {
            // Priorité spéciale (high > medium > low)
            if (sortField === 'priority') {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                const aValue = priorityOrder[a.priority];
                const bValue = priorityOrder[b.priority];
                
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            // Statut (complété vs incomplet)
            if (sortField === 'completed') {
                return order === 'asc' ? 
                    (a.completed - b.completed) : 
                    (b.completed - a.completed);
            }
            
            // Pour les autres champs
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

    // Formatage de la date
    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
});