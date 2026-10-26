import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserTypeModel } from '../models/UserModel.js';


// register
export const register = async (userObj) => {
  // check if email already exists
  const existingUser = await UserTypeModel.findOne({ email: userObj.email });
  if (existingUser) {
    const err = new Error("Email already registered");
    err.status = 400;
    throw err;
  }

  // hash the password first
  userObj.password = await bcrypt.hash(userObj.password, 10);
  // create document with hashed password
  const userDoc = await UserTypeModel.create(userObj);
  // convert document to object to remove password
  const newUserObj = userDoc.toObject();
  // delete the password object
  delete newUserObj.password;
  // return userObj without password
  return newUserObj;
};

// authenticate
export const authenticate = async ({ email, password }) => {
  // check with user email
  const user = await UserTypeModel.findOne({ email });
  if (!user) {
    const err = new Error("Invalid Email");
    err.status = 401;
    throw err;
  }
  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid Password");
    err.status = 401;
    throw err;
  }
  if (!user.isActive) {
    const err = new Error("Your account is Blocked, contact admin");
    err.status = 403;
    throw err;
  }
  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
  const userObj = user.toObject();
  delete userObj.password;
  return { token, user: userObj };
};