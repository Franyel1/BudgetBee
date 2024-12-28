import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const User = mongoose.model('User');

const startAuthenticatedSession = (req, user) => {
  return new Promise((fulfill, reject) => {
    req.session.regenerate((err) => {
      if (!err) {
        req.session.user = user;
        fulfill(user);
      } else {
        reject(err);
      }
    });
  });
};


const endAuthenticatedSession = req => {
  return new Promise((fulfill, reject) => {
    req.session.destroy(err => err ? reject(err) : fulfill(null));
  });
};


const register = async (username, email, password) => {
  if (username.length <= 7 || password.length <= 7) {
    throw { message: 'Username  and password must be at least 8 characters' };
  }

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw { message: 'Username unavailable' };
  }


  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);


  const user = new User({
    username,
    passwordHash,
    email
  });

  await user.save();
  return user;
};


const login = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw { message: 'Wrong username or password' };
  }

  const passwordMatches = bcrypt.compareSync(password, user.passwordHash);
  if (!passwordMatches) {
    throw { message: 'Wrong username or password' };
  }

  return user;
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login
};