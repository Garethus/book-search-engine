const { User, Book } = require('../models');

const resolvers = {
  Query: {
    me: async (parent, { id }) => {
      const user = await User.findById(id);

      if (!user) {
        throw new Error('Cannot find a user with this id!');
      }

      return user;
    },
  },
  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });

      if (!user) {
        throw new Error('Something went wrong while creating the user!');
      }

      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { usernameOrEmail, password }) => {
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
    saveBook: async (parent, { book }, { user }) => {
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
    removeBook: async (parent, { bookId }, { user }) => {
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
