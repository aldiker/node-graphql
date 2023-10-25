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

export function completeTodo(id, done, successCallback) {
    console.log(`! - completeTodo: id = ${id}`)

    // Изменяем запись в БД через GraphQL-запрос
    const query = `
        mutation {
            completeTodo (todo: {id: ${id}, done: ${done}}) {
                id createdAt updatedAt
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
            successCallback(response.data.completeTodo)
        })
        .catch((e) => console.log(e))
}

export function removeTodo(id, successCallback) {
    console.log(`! - removeTodo: id = ${id}`)

    // Удаляем запись в БД через GraphQL-запрос
    const query = `
        mutation {
            removeTodo (id: ${id})
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
