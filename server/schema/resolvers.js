const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        user: async (parent, args, context) => {
            if (context.user) {
                const user = await User.findById(context.user._id);
      
                return user;
            }
      
            throw new AuthenticationError('Not logged in');
        },
    },

    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);

            return { token, user };
        },
        login: async (parent, { username, password }) => {
            const user = await User.findOne({ username });

            if (!user) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Incorrect credentials');
            }

            const token = signToken(user);

            return { token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user) {
                const addBook = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true }
                );

                return addBook;
            }
        },
        removeBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const removeBook = await User.findByIdAndUpdate(
                    { _id: context.user._id },
                    { $pull: {savedBooks: { bookId } } },
                    { new: true }
                );

                return removeBook; 
            }
        }
    }
};

module.exports = resolvers;