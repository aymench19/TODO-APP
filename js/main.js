document.addEventListener('DOMContentLoaded', function() {
    let priorityChart;
    let statusChart;

    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskPriority = document.getElementById('task-priority');
    const taskList = document.getElementById('task-list');
    const searchInput = document.getElementById('search-input');
    const sortBy = document.getElementById('sort-by');
    const sortOrder = document.getElementById('sort-order');

    initCharts();

    taskDate.value = new Date().toISOString().split('T')[0];

    let tasks = TaskStorage.loadTasks();
    renderTasks(tasks);

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

    taskList.addEventListener('click', function(e) {
        const li = e.target.closest('li');
        if (!li) return;

        const taskId = parseInt(li.dataset.id);

        if (e.target.classList.contains('delete-btn')) {
            const task = tasks.find(t => t.id === taskId);
            if (confirm(`Êtes-vous sûr de vouloir supprimer la tâche : "${task.text}" ?`)) {
                tasks = tasks.filter(task => task.id !== taskId);
                TaskStorage.saveTasks(tasks);
                renderTasks(tasks);
                updateDashboardStats();
            }
        }
        else if (e.target.classList.contains('complete-btn')) {
            const task = tasks.find(t => t.id === taskId);
            const action = task.completed ? 'marquer comme non terminée' : 'marquer comme terminée';
            
            if (confirm(`Voulez-vous vraiment ${action} cette tâche ?\n\n"${task.text}"`)) {
                tasks = tasks.map(task => {
                    if (task.id === taskId) {
                        return { ...task, completed: !task.completed };
                    }
                    return task;
                });
                TaskStorage.saveTasks(tasks);
                renderTasks(tasks);
                updateDashboardStats();
            }
        }
    });

    searchInput.addEventListener('input', function() {
        renderTasks(tasks);
    });

    sortBy.addEventListener('change', function() {
        renderTasks(tasks);
    });

    sortOrder.addEventListener('change', function() {
        renderTasks(tasks);
    });

    function initCharts() {
        const priorityCtx = document.getElementById('priority-chart').getContext('2d');
        const statusCtx = document.getElementById('status-chart').getContext('2d');
        
        priorityChart = new Chart(priorityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Faible', 'Normale', 'Haute'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: [
                        '#5bc0de',
                        '#f0ad4e',
                        '#d9534f'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
        
        statusChart = new Chart(statusCtx, {
            type: 'pie',
            data: {
                labels: ['Incomplètes', 'Complétées'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: [
                        '#f0ad4e',
                        '#5cb85c'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${value} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    function updateCharts() {
        if (!priorityChart || !statusChart) return;
        
        const lowCount = tasks.filter(t => t.priority === 'low').length;
        const mediumCount = tasks.filter(t => t.priority === 'medium').length;
        const highCount = tasks.filter(t => t.priority === 'high').length;
        
        priorityChart.data.datasets[0].data = [lowCount, mediumCount, highCount];
        priorityChart.update();
        
        const completeCount = tasks.filter(t => t.completed).length;
        const incompleteCount = tasks.length - completeCount;
        
        statusChart.data.datasets[0].data = [incompleteCount, completeCount];
        statusChart.update();
    }

    function renderTasks(tasksToRender) {
        const searchTerm = searchInput.value.toLowerCase();
        let filteredTasks = tasksToRender.filter(task => 
            task.text.toLowerCase().includes(searchTerm)
        );

        filteredTasks = sortTasks(filteredTasks);

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

    function updateDashboardStats() {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const incompleteTasks = totalTasks - completedTasks;
        const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        document.getElementById('total-tasks').textContent = totalTasks;
        document.getElementById('completed-tasks').textContent = completedTasks;
        document.getElementById('incomplete-tasks').textContent = incompleteTasks;

        document.getElementById('completion-bar').style.width = `${completionPercentage}%`;

        updateCharts();
    }

    function sortTasks(tasks) {
        const sortField = sortBy.value;
        const order = sortOrder.value;
        
        return [...tasks].sort((a, b) => {
            if (sortField === 'priority') {
                const priorityOrder = { high: 3, medium: 2, low: 1 };
                const aValue = priorityOrder[a.priority];
                const bValue = priorityOrder[b.priority];
                
                return order === 'asc' ? aValue - bValue : bValue - aValue;
            }
            
            if (sortField === 'completed') {
                return order === 'asc' ? 
                    (a.completed - b.completed) : 
                    (b.completed - a.completed);
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

    function formatDate(dateString) {
        if (!dateString) return '';
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
});