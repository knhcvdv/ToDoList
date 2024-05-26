// Завдання 1. Створення додатку "Список справ".
const list = document.getElementById("todo-list");
const itemCountSpan = document.getElementById("item-count");
const uncheckedCountSpan = document.getElementById("unchecked-count");

// 2. Вигляд, у якому будуть зберігатися справи у пам'яті програми,
// що саме необхідно зберігати для кожної справи. (масив об'єктів)
const todos = [];

function addTodo(todo) {
  fetch("https://todolist-6d552-default-rtdb.firebaseio.com/todos.json", {
    method: "POST",
    body: JSON.stringify(todo),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      todo.id = data.name;
      todos.push(todo);
      render();
      updateCounter();
    })
    .catch((error) => console.error("Error:", error));
}

function newTodo() {
  const newTodo = prompt("Enter a new TODO:");
  if (newTodo) {
    const todo = { text: newTodo, checked: false };
    addTodo(todo);
  }
}

// 4. Функція renderTodo, що приймає одну справу і створює
// рядок із елементом <li> з вкладеними input, label, … згідно шаблону.
function renderTodo(todo) {
  const checked = todo.checked ? "checked" : "";
  const lineThrough = todo.checked ? "text-decoration-line-through" : "";
  const html = `
    <li class="list-group-item">
      <input type="checkbox" class="form-check-input me-2" id="${todos.indexOf(
        todo
      )}" ${checked} onchange="checkTodo(${todos.indexOf(todo)})">
      <label for="${todos.indexOf(
        todo
      )}"><span class="text-success ${lineThrough}">${todo.text}</span></label>
      <button class="btn btn-danger btn-sm float-end" onclick="deleteTodo(${todos.indexOf(
        todo
      )})">delete</button>
    </li>
  `;
  return html;
}

// 5. Функція render, що приймає масив todos, перетворює його на масив рядків,
// що описують HTML розмітку за допомогою функції renderTodo.
function render() {
  const html = todos.map(renderTodo).join("");
  list.innerHTML = html;
}

// 6. Функція updateCounter, що буде оновлювати значення лічильників.
function updateCounter() {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter((todo) => !todo.checked).length;
}

function deleteTodoFromDB(id) {
  fetch(`https://todolist-6d552-default-rtdb.firebaseio.com/todos/${id}.json`, {
    method: "DELETE",
  })
    .then(() => {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      todos.length = 0;
      todos.push(...updatedTodos);
      render();
      updateCounter();
    })
    .catch((error) => console.error("Error:", error));
}

function deleteTodo(index) {
  const todoToDelete = todos[index];
  deleteTodoFromDB(todoToDelete.id);
}

// 8. Функція checkTodo, що відмічає відповідний елемент з масиву todos і потім викликає функції render та updateCounter.
function checkTodo(index) {
  todos[index].checked = !todos[index].checked;
  render();
  updateCounter();
}

let isLoading = false;
let error = null;

function fetchTodos() {
  isLoading = true;
  error = null;

  fetch("https://todolist-6d552-default-rtdb.firebaseio.com/todos.json")
    .then((response) => response.json())
    .then((data) => {
      const todosData = data ? Object.entries(data) : [];
      const newTodos = todosData.map(([id, todo]) => ({ id, ...todo }));
      todos.length = 0;
      todos.push(...newTodos);
      render();
      updateCounter();
    })
    .catch((err) => {
      error = err.message;
      console.error("Error:", error);
      render();
    })
    .finally(() => {
      isLoading = false;
      render();
    });
}

window.addEventListener("load", fetchTodos);

function render() {
  const loadingElement = document.getElementById("loading");
  const errorElement = document.getElementById("error");
  const listElement = document.getElementById("todo-list");

  if (isLoading) {
    loadingElement.classList.remove("d-none");
    errorElement.classList.add("d-none");
    listElement.innerHTML = "";
  } else if (error) {
    loadingElement.classList.add("d-none");
    errorElement.classList.remove("d-none");
    errorElement.textContent = error;
    listElement.innerHTML = "";
  } else {
    loadingElement.classList.add("d-none");
    errorElement.classList.add("d-none");
    const html = todos.map(renderTodo).join("");
    listElement.innerHTML = html;
  }
}

function updateTodoInDB(id, updatedTodo) {
  fetch(`https://todolist-6d552-default-rtdb.firebaseio.com/todos/${id}.json`, {
    method: "PATCH",
    body: JSON.stringify(updatedTodo),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? updatedTodo : todo
      );
      todos.length = 0;
      todos.push(...updatedTodos);
      render();
      updateCounter();
    })
    .catch((error) => console.error("Error:", error));
}

function checkTodo(index) {
  const updatedTodo = { ...todos[index], checked: !todos[index].checked };
  updateTodoInDB(updatedTodo.id, updatedTodo);
}
