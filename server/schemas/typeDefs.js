const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: String!
    savedBooks: [Book]!
  }

  
  input Book {
    bookId: ID!
    authors: String!
    description: String!
    title: String!
    image: String!
    link: String!
  }

  input Auth {
    token: ID!
    user: User
  }

  type Query {
    user(id: ID!): User
    userByUsername(username: String!): User
  }

  type Mutation {
    createUser(username: String!, email: String!, password: String!): AuthPayload
    login(usernameOrEmail: String!, password: String!): AuthPayload
    saveBook(book: BookInput!): User
    deleteBook(bookId: ID!): User
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;

module.exports = typeDefs;
