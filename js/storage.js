// Gestion du localStorage
const TaskStorage = {
    saveTasks: function(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    },

    loadTasks: function() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }
};