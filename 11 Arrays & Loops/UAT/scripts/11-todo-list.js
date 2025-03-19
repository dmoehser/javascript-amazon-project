// Utility Functions
function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function getFromLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// ToDo List Practice 1
const todoList1 = [];

function renderTodoList1() {
  let todoListHtml = '';
  
  for (let i = 0; i < todoList1.length; i++) {
    const todo = todoList1[i];
    const html = `<div class="todo-item">${todo}</div>`;
    todoListHtml += html;
  }
  
  document.querySelector('.js-todo-list-1').innerHTML = todoListHtml;
}

function addTodo1() {
  const inputElement = document.querySelector('.js-todo-input-1');
  const name = inputElement.value.trim();
  
  if (name) {
    todoList1.push(name);
    console.log('Todo Liste 1:', todoList1);
    inputElement.value = '';
    renderTodoList1();
  }
}

// ToDo List Practice 2
const todoList2 = getFromLocalStorage('todoList2');

function renderTodoList2() {
  let todoListHtml = '';
  
  for (let i = 0; i < todoList2.length; i++) {
    const todo = todoList2[i];
    const html = `
      <div class="todo-item">
        ${todo}
        <button class="delete-todo-button" onclick="deleteTodo2(${i})">Delete</button>
      </div>`;
    todoListHtml += html;
  }
  
  document.querySelector('.js-todo-list-2').innerHTML = todoListHtml;
  saveToLocalStorage('todoList2', todoList2);
}

function addTodo2() {
  const inputElement = document.querySelector('.js-todo-input-2');
  const name = inputElement.value.trim();
  
  if (name) {
    todoList2.push(name);
    console.log('Todo Liste 2:', todoList2);
    inputElement.value = '';
    renderTodoList2();
  }
}

function deleteTodo2(index) {
  todoList2.splice(index, 1);
  renderTodoList2();
}

// ToDo List Practice 3
const todoList3 = getFromLocalStorage('todoList3');

function renderTodoList3() {
  const todoListHtml = todoList3
    .map((todo, i) => `
      <div class="todo-item ${todo.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          ${todo.completed ? 'checked' : ''} 
          onchange="toggleTodo3(${todo.id})"
        >
        <span class="todo-text">${todo.name} - Fällig am: ${todo.dueDate}</span>
        <button 
          class="delete-todo-button" 
          onclick="deleteTodo3(${todo.id})"
        >
          Delete
        </button>
      </div>
    `)
    .join('');
  
  document.querySelector('.js-todo-list-3').innerHTML = todoListHtml;
  saveToLocalStorage('todoList3', todoList3);
}

function addTodo3() {
  const inputElement = document.querySelector('.js-todo-input-3');
  const dateElement = document.querySelector('.js-date-input-3');
  const name = inputElement.value.trim();
  const dueDate = dateElement.value;
  
  if (!name || !dueDate) {
    alert('Bitte füllen Sie beide Felder aus');
    return;
  }

  const newTodo = {
    id: Date.now(),
    name: name,
    dueDate: dueDate,
    completed: false
  };
  
  todoList3.push(newTodo);
  console.log('Todo Liste 3:', todoList3);
  
  inputElement.value = '';
  dateElement.value = '';
  renderTodoList3();
}

function toggleTodo3(id) {
  const todo = todoList3.find(t => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    renderTodoList3();
  }
}

function deleteTodo3(id) {
  const index = todoList3.findIndex(todo => todo.id === id);
  if (index !== -1) {
    todoList3.splice(index, 1);
    renderTodoList3();
  }
}

// Initialize all lists
document.addEventListener('DOMContentLoaded', function() {
  renderTodoList1();
  renderTodoList2();
  renderTodoList3();
}); 