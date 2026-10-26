import express from 'express'
export const commonRouter=express.Router();
import { authenticate } from '../services/authservice.js';
import { compare } from 'bcryptjs';
import { UserTypeModel } from '../models/UserModel.js';
import bcrypt from 'bcryptjs';
import {verifyToken} from '../middlewares/verifyToken.js'

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    maxAge: 24 * 60 * 60 * 1000,
  };
};

// login
commonRouter.post('/authenticate', async (req, res, next) => {
  try {
    let userCred = req.body;
    let { token, user } = await authenticate(userCred);
    
    res.cookie("token", token, getCookieOptions());
    res.status(200).json({
      message: "login success",
      payload: user,
      token,
    });
  } catch (err) {
    next(err);
  }
});

// logout
commonRouter.get('/logout', async (req, res) => {
  res.clearCookie("token", getCookieOptions());
  res.status(200).json({ message: "user logged out" });
});

// update password (protected)
commonRouter.put('/change-password', verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.userId;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }

    if (newPassword.length < 4) {
      return res.status(400).json({ message: "New password must be at least 4 characters" });
    }

    const userObj = await UserTypeModel.findById(userId);
    if (!userObj) {
      return res.status(404).json({ message: "User not found" });
    }

    const verify = await compare(currentPassword, userObj.password);
    if (!verify) {
      return res.status(400).json({ message: "Current password does not match" });
    }

    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    await UserTypeModel.findByIdAndUpdate(userId, { password: newHashedPassword });

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    next(err);
  }
});

// check-auth (returns full user payload from DB)
commonRouter.get('/check-auth', verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res, next) => {
  try {
    const user = await UserTypeModel.findById(req.user.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: "Your account is blocked. Contact admin." });
    }
    res.status(200).json({
      message: "authenticated",
      payload: user,
    });
  } catch (err) {
    next(err);
  }
});