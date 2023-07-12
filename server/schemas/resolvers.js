const { User, Book } = require('../models');

const resolvers = {
  Query: {
    user: async (_, { id }) => {
      const user = await User.findById(id);

      if (!user) {
        throw new Error('Cannot find a user with this id!');
      }

      return user;
    },
    userByUsername: async (_, { username }) => {
      const user = await User.findOne({ username });

      if (!user) {
        throw new Error("Can't find a user with this username!");
      }

      return user;
    },
  },
  Mutation: {
    createUser: async (_, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new Error('Something went wrong while creating the user!');
      }

      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { usernameOrEmail, password }) => {
      const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      });

      if (!user) {
        throw new Error("Can't find this user");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new Error('Wrong password!');
      }

      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (_, { book }, { user }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }

      return updatedUser;
    },
    deleteBook: async (_, { bookId }, { user }) => {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user.id },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("Couldn't find user with this id!");
      }

      return updatedUser;
    },
  },
};

module.exports = resolvers;
