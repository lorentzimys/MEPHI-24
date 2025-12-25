// State management
let todos = [];
let currentFilter = 'all';

// DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const todoCount = document.getElementById('todoCount');
const clearCompletedBtn = document.getElementById('clearCompleted');
const filterBtns = document.querySelectorAll('.filter-btn');

// Load todos from localStorage
function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
        todos = JSON.parse(savedTodos);
    }
    renderTodos();
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    renderTodos();
}

// Add new todo
function addTodo() {
    const text = todoInput.value.trim();
    if (text === '') return;
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    todos.push(todo);
    todoInput.value = '';
    saveTodos();
}

// Toggle todo completion
function toggleTodo(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
}

// Delete todo
function deleteTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
}

// Clear completed todos
function clearCompleted() {
    todos = todos.filter(todo => !todo.completed);
    saveTodos();
}

// Filter todos
function filterTodos(filter) {
    currentFilter = filter;
    
    // Update filter buttons
    filterBtns.forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    renderTodos();
}

// Render todos
function renderTodos() {
    // Filter todos based on current filter
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(todo => !todo.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed);
    }
    
    // Clear list
    todoList.innerHTML = '';
    
    // Render todos
    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<li class="empty-message">Нет задач</li>';
    } else {
        filteredTodos.forEach(todo => {
            const li = document.createElement('li');
            li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            
            li.innerHTML = `
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    data-id="${todo.id}"
                >
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="delete-btn" data-id="${todo.id}">✕</button>
            `;
            
            todoList.appendChild(li);
        });
    }
    
    // Update count
    const activeCount = todos.filter(todo => !todo.completed).length;
    todoCount.textContent = `${activeCount} ${getPluralForm(activeCount, 'задача', 'задачи', 'задач')}`;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get plural form for Russian
function getPluralForm(count, one, few, many) {
    const mod10 = count % 10;
    const mod100 = count % 100;
    
    if (mod100 >= 11 && mod100 <= 19) return many;
    if (mod10 === 1) return one;
    if (mod10 >= 2 && mod10 <= 4) return few;
    return many;
}

// Event listeners
addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

todoList.addEventListener('click', (e) => {
    if (e.target.classList.contains('todo-checkbox')) {
        const id = parseInt(e.target.dataset.id);
        toggleTodo(id);
    } else if (e.target.classList.contains('delete-btn')) {
        const id = parseInt(e.target.dataset.id);
        deleteTodo(id);
    }
});

clearCompletedBtn.addEventListener('click', clearCompleted);

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterTodos(btn.dataset.filter);
    });
});

// Initialize app
loadTodos();

