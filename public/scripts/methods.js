export function addTodo(title, successCallback) {
    const order_title = title.trim()
    if (!order_title) {
        return
    }

    fetch('/api/todo', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: order_title }),
    })
        .then((res) => res.json())
        .then(({ todo }) => {
            console.log(todo)
            this.todos.push(todo)
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
