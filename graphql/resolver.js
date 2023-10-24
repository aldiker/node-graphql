const Todo = require('../models/todo.js')

const users = [
    { name: 'Igor', age: 30, email: 'igor@ukr.net' },
    { name: 'Elena', age: 24, email: 'elena@gmail.com' },
]

module.exports = {
    test() {
        return {
            count: Math.trunc(Math.random() * 10),
            users: users,
        }
    },
    random({ min, max, count }) {
        const arr = []
        for (let i = 0; i < count; i++) {
            const element = Math.random() * (max - min) + min
            arr.push(element)
        }
        return arr
    },
    addTestUser({ user: { name, email } }) {
        const newUser = {
            name,
            email,
            age: Math.ceil(Math.random() * 30),
        }
        users.push(newUser)
        return newUser
    },
    async getTodos() {
        try {
            return await Todo.findAll()
        } catch (e) {
            console.log(e)
        }
    },
}
