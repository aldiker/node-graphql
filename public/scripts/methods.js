export function addTodo(title, successCallback) {
    const order_title = title.trim()
    if (!order_title) {
        return
    }

    // Создаем новую запись в БД через GraphQL-запрос
    const query = `
        mutation {
            createTodo (todo: {title: "${order_title}"}) {
                id title done createdAt updatedAt
            }
        }
    `
    fetch('/graphql', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({ query }),
    })
        .then((res) => res.json())
        .then((response) => {
            console.log(response)
            this.todos.push(response.data.createTodo)
            successCallback()
        })
        .catch((e) => console.log(e))
}

export function removeTodo(id, successCallback) {
    console.log(`! - removeTodo: id = ${id}`)

    // Вызываем API DELETE
    fetch('/api/todo/' + id, {
        method: 'delete',
    })
        .then(() => {
            console.log(`! - removeTodo: fetch.then`)
            // Удаляем элемент из внутренней таблицы "state.todos"
            this.todos = this.todos.filter(
                (t) => t.id.toString() !== id.toString()
            )
            successCallback()
        })
        .catch((e) => console.log(e))
}

export function completeTodo(id, done, successCallback) {
    console.log(`! - completeTodo: id = ${id}`)

    fetch('/api/todo/' + id, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ done: done }),
    })
        .then((res) => res.json())
        .then(({ todo }) => {
            console.log(todo)
            successCallback(todo)
        })
        .catch((e) => console.log(e))
}
