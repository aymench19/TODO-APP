class Dashboard {
    constructor() {
        this.priorityChart = this._initPriorityChart();
        this.statusChart = this._initStatusChart();
    }

    update(tasks) {
        this._updateStats(tasks);
        this._updateCharts(tasks);
    }

    _initPriorityChart() {
        const priorityCtx = document.getElementById('priority-chart').getContext('2d');
        return new Chart(priorityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Faible', 'Normale', 'Haute'],
                datasets: [{
                    data: [0, 0, 0],
                    backgroundColor: ['#5bc0de', '#f0ad4e', '#d9534f'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
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

    _initStatusChart() {
        const statusCtx = document.getElementById('status-chart').getContext('2d');
        return new Chart(statusCtx, {
            type: 'pie',
            data: {
                labels: ['Incomplètes', 'Complétées'],
                datasets: [{
                    data: [0, 0],
                    backgroundColor: ['#f0ad4e', '#5cb85c'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom' },
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

    _updateStats(tasks) {
        const totalTasks = tasks.length;
        const completedTasks = tasks.filter(task => task.completed).length;
        const incompleteTasks = totalTasks - completedTasks;
        const completionPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

        document.getElementById('total-tasks').textContent = totalTasks;
        document.getElementById('completed-tasks').textContent = completedTasks;
        document.getElementById('incomplete-tasks').textContent = incompleteTasks;
        document.getElementById('completion-bar').style.width = `${completionPercentage}%`;
    }

    _updateCharts(tasks) {
        const lowCount = tasks.filter(t => t.priority === 'low').length;
        const mediumCount = tasks.filter(t => t.priority === 'medium').length;
        const highCount = tasks.filter(t => t.priority === 'high').length;
        
        this.priorityChart.data.datasets[0].data = [lowCount, mediumCount, highCount];
        this.priorityChart.update();
        
        const completeCount = tasks.filter(t => t.completed).length;
        const incompleteCount = tasks.length - completeCount;
        
        this.statusChart.data.datasets[0].data = [incompleteCount, completeCount];
        this.statusChart.update();
    }
}