import { date, pluralizeTasks, capitalize } from './filters.js'
import { addTodo, removeTodo, completeTodo } from './methods.js'

const state = {
    show: true,
    todos: [],
}

function updateTaskList(todos) {
    // Длина массива задач
    const todosLenght = state.todos.length

    // Отображаем количество введенных задач
    const cardCountElement = document.getElementById('card-count')
    cardCountElement.textContent = `${todosLenght} ${pluralizeTasks(
        todosLenght
    )}`

    // Подбираем текст, который будем писать над задачами в зависимости от их количества
    const ordersTitleElement = document.getElementById('orders-title')
    if (todosLenght) {
        ordersTitleElement.textContent = 'Ваши задачи:'
    } else {
        ordersTitleElement.textContent = 'У Вас 0 задач, добавьте новую'
    }

    // Берем элемент, куда будем закидывать задачи
    const taskListElement = document.getElementById('task-list')
    // Очищаем предыдущий список задач
    taskListElement.innerHTML = ''

    // Перебираем задачи в объекте state.todos и добавляем их на страницу
    todos.forEach((todo, index) => {
        const taskElement = document.createElement('div')
        // Генерируем уникальный ID для каждого чекбокса
        const checkboxId = `checkbox-${index}`
        const buttonDeleteId = `btn-delete-${index}`

        taskElement.innerHTML = `
            <div class="task">

                <label>
                    <input
                        type="checkbox"
                        class="filled-in"
                        ${todo.done ? 'checked="checked"' : ''}
                        id="${checkboxId}"
                    />
                    <span></span>
                </label>

                <div class="task-details">
                    <p 
                        class="${todo.done ? 'order-done' : ''}"
                        style="font-size: 16px"
                        id="todoTitle-${todo.id}"
                        >
                            ${todo.title}
                    </p>
                    <p 
                        class="task-date" 
                        style="font-size: 10px"
                        id="updatedAt-${todo.id}"
                        > 
                            Добавлено в: ${date(todo.createdAt, true)}
                            (изменено в: ${date(todo.updatedAt, true)})
                    </p>
                </div>

                <button 
                    class="btn-floating btn waves-effect waves-light blue-grey darken-3"
                    name="delete" 
                    data-todo-id="${todo.id}"
                    id="${buttonDeleteId}"
                    >
                        <i class="material-icons">close</i>
                </button>
            </div>
            
            <br>
        `
        // Добавляем сформированный <div> элемент в список задач
        taskListElement.appendChild(taskElement)

        // Добавляем слушатель событий для чекбокса
        const checkbox = document.getElementById(checkboxId)
        checkbox.addEventListener('change', (event) => {
            // Обновляем значение todo.done в соответствии с состоянием чекбокса
            todo.done = event.target.checked

            // Вызываем функцию completeTodo и передаем в неё id
            console.log(
                `! - checkbox: todo.id = ${todo.id}, todo.done = ${todo.done}`
            )

            completeTodo(todo.id, todo.done, (updatedTodo) => {
                // Этот код будет выполнен после успешного обновления

                console.log('Элемент из колбека "updatedTodo":')
                console.log(updatedTodo)

                // Меняем текст с измененной датой
                const updatedDateElement = document.getElementById(
                    `updatedAt-${updatedTodo.id}`
                )
                updatedDateElement.textContent = `
                    Добавлено в: ${date(updatedTodo.createdAt, true)}
                    (изменено в: ${date(updatedTodo.updatedAt, true)})
                    `

                // Зачеркиваем и нет текст с названием задачи
                const todoTitleElement = document.getElementById(
                    `todoTitle-${updatedTodo.id}`
                )
                if (todoTitleElement) {
                    if (todo.done) todoTitleElement.classList.add('order-done')
                    else todoTitleElement.classList.remove('order-done')
                }
            })
        })

        // Добавляем слушатель событий для кнопки "Удалить"
        const deleteButton = document.getElementById(buttonDeleteId)
        deleteButton.addEventListener('click', function () {
            // Берем индекс задачи, которую надо удалить
            const todoId = this.getAttribute('data-todo-id')
            // Вызываем метод "removeTodo" передавая контекст "state" и значение для метода "todoId"
            removeTodo.call(state, todoId, () => {
                // Обновляем таблицу
                updateTaskList(state.todos)
            })
        })
    })
}

// Запускаем обработчик события, когда загрузилось полностью DOM
document.addEventListener('DOMContentLoaded', function () {
    // Получаем данные с БД через API GET-запрос
    fetch('/api/todo', {
        method: 'get',
    })
        .then((res) => res.json())
        .then((todos) => {
            console.log(todos)
            state.todos = todos
            updateTaskList(state.todos)
        })
        .catch((e) => console.log(e))

    const cardTitle = document.getElementById('card-title')
    cardTitle.textContent = date()

    const orderNameInput = document.getElementById('order_name')
    const labelOrderName = document.getElementById('label_order_name')

    orderNameInput.addEventListener('input', function () {
        if (orderNameInput.value) {
            labelOrderName.textContent = 'Задача:'
        } else {
            labelOrderName.textContent = ''
        }
    })

    // Найдите вашу форму по селектору
    const form = document.querySelector('form')
    form.addEventListener('submit', function (event) {
        // Предотвращаем стандартное действие отправки формы
        event.preventDefault()

        // Добавление задачи (addTodo)
        addTodo.call(state, capitalize(orderNameInput.value), () => {
            // Обновляем содержимое элемента "task-list" на странице
            updateTaskList(state.todos)

            // Очищаем поле ввода
            orderNameInput.value = ''
            // Восстанавливаем текст label
            labelOrderName.textContent = ''
        })
    })
})
