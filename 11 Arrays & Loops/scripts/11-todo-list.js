// ToDo List Practice 1
const todoList1 = JSON.parse(localStorage.getItem('todoList1')) || [];

function renderTodoList1() {
  let todoListHtml = '';
  
  for (let i = 0; i < todoList1.length; i++) {
    const todo = todoList1[i];
    const html = `<p>${todo}</p>`;
    todoListHtml += html;
  }
  
  document.querySelector('.js-todo-list-1').innerHTML = todoListHtml;
}

function addTodo1() {
  const inputElement = document.querySelector('.js-todo-input-1');
  const name = inputElement.value;
  
  todoList1.push(name);
  console.log('Todo Liste 1:', todoList1);
  
  inputElement.value = '';
  renderTodoList1();
}

document.addEventListener('DOMContentLoaded', function() {
  renderTodoList1();
});

// ToDo List Practice 2
const todoList2 = JSON.parse(localStorage.getItem('todoList2')) || [];

function renderTodoList2() {
  let todoListHtml = '';
  
  for (let i = 0; i < todoList2.length; i++) {
    const todo = todoList2[i];
    const html = `<p>
      ${todo} 
      <button onclick="
        todoList2.splice(${i}, 1);
        renderTodoList2();
      ">Delete</button>
      </p>`;
    todoListHtml += html;
  }
  
  document.querySelector('.js-todo-list-2').innerHTML = todoListHtml;
  localStorage.setItem('todoList2', JSON.stringify(todoList2));
}

function addTodo2() {
  const inputElement = document.querySelector('.js-todo-input-2');
  const name = inputElement.value;
  
  todoList2.push(name);
  console.log('Todo Liste 2:', todoList2);
  
  inputElement.value = '';
  renderTodoList2();
}

document.addEventListener('DOMContentLoaded', function() {
  renderTodoList2();
});

// ToDo List Practice 3
const todoList3 = JSON.parse(localStorage.getItem('todoList3')) || [];

function renderTodoList3() {
  let todoListHtml = '';
  
  for (let i = 0; i < todoList3.length; i++) {
    const todo = todoList3[i];
    const html = `
      <div class="grid-todo">
        <div>${todo.name}</div>
        <div>${todo.dueDate}</div>
        <button class="delete-todo-button" onclick="
          todoList3.splice(${i}, 1);
          renderTodoList3();
        ">Delete</button>
      </div>
    `;
    todoListHtml += html;
  }
  
  document.querySelector('.js-todo-list-3').innerHTML = todoListHtml;
  localStorage.setItem('todoList3', JSON.stringify(todoList3));
}

function addTodo3() {
  const inputElement = document.querySelector('.js-todo-input-3');
  const dateElement = document.querySelector('.js-date-input-3');
  const name = inputElement.value;
  const dueDate = dateElement.value;
  
  if (name && dueDate) {
    todoList3.push({
      name: name,
      dueDate: dueDate
    });
    
    console.log('Todo Liste 3:', todoList3);
    
    inputElement.value = '';
    dateElement.value = '';
    renderTodoList3();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  renderTodoList3();
});