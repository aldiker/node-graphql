const { buildSchema } = require('graphql')

module.exports = buildSchema(`
    type User {
        name: String!
        email: String!
        age: Int!
    }

    type TestType {
        count: Int!
        users: [User!]!
    }

    input UserType {
        name: String!
        email: String!
    }

    type Todo {
        id: ID!
        title: String!
        done: Boolean!
        createdAt: String
        updatedAt: String
    }


    type Query {
        test: TestType!
        random(min: Int!, max: Int!, count: Int!): [Float!]!
        getTodos: [Todo!]!
    }

    input TodoInput {
        title: String!
    }

    input completeTodoInput {
        id: ID!
        done: Boolean!
    }

    type Mutation {
        addTestUser(user: UserType!): User!
        createTodo(todo: TodoInput!): Todo!
        completeTodo(todo: completeTodoInput!): Todo!
    }
`)
