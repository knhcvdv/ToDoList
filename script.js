// Завдання 1. Створення додатку "Список справ".
const list = document.getElementById("todo-list");
const itemCountSpan = document.getElementById("item-count");
const uncheckedCountSpan = document.getElementById("unchecked-count");

// 2. Вигляд, у якому будуть зберігатися справи у пам'яті програми,
// що саме необхідно зберігати для кожної справи. (масив об'єктів)
const todos = [];

// 3. Реалізація функції newTodo,запит для введення нового завдання.
function newTodo() {
  const newTodo = prompt("Enter a new TODO:");
  if (newTodo) {
    todos.push({ text: newTodo, checked: false });
    render();
    updateCounter();
  }
}

// 4. Функція renderTodo, що приймає одну справу і створює
//рядок із елементом <li> з вкладеними input, label, … згідно шаблону.
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

// 5. Функція render, що приймає масив todos, перетворює його на масив рядків,
// що описують HTML розмітку за допомогою функції renderTodo.
function render() {
  const html = todos.map(renderTodo).join("");
  list.innerHTML = html;
}

// 6. Функція updateCounter, що буде оновлювати значення лічильників.
function updateCounter() {
  itemCountSpan.textContent = todos.length;
  uncheckedCountSpan.textContent = todos.filter((todo) => !todo.checked).length;
}

// 7. Функція deleteTodo, що видаляє відповідний елемент з масиву todos і потім викликає функції render та updateCounter.
function deleteTodo(index) {
  todos.splice(index, 1);
  render();
  updateCounter();
}

// 8. Функція checkTodo, що відмічає відповідний елемент з масиву todos і потім викликає функції render та updateCounter.
function checkTodo(index) {
  todos[index].checked = !todos[index].checked;
  render();
  updateCounter();
}
