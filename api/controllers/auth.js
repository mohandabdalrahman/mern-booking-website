import bycrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createError } from '../utils/error.js';
export const register = async (req, res, next) => {
  try {
    const salt = bycrypt.genSaltSync(10);
    const hashPassword = bycrypt.hashSync(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword
    });
    await newUser.save();
    res.status(200).send('User has been created');
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, 'user not found'));
    const isPasswordCorrect = await bycrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return next(createError(400, 'wrong password or username'));
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.jwt);
    const { password, isAdmin, ...otherDetails } = user._doc;
    res.cookie('access_token', token, { httpOnly: true }).status(200).json({ ...otherDetails });
  } catch (error) {
    next(error);
  }
};