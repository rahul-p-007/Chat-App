import { UserModel } from "../database/Schema/User.schema.js";

import { z } from "zod";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";
export const signup = async (req, res) => {
  const { fullName, username, email, password, confirmPassword, gender } =
    req.body;
  try {
    // checking user given credentials or not
    if (
      !fullName ||
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !gender
    ) {
      return res.status(404).json({
        success: false,
        message: "Enter all the credentials",
      });
    }
    // Comparing the password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Password don't match",
      });
    }

    //checking is user already exist or not
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists / login",
      });
    }
    // taking strong password
    const passwordSchema = z
      .string()
      .min(5, "Minimum 5 character")
      .max(15, "Maximum 15 character are allowed")
      .regex(/[A-Z]/, "Enter Atleast one uppercase character")
      .regex(/[a-z]/, "Enter atleast one lowercase characater")
      .regex(/\d/, "Enter alteat one numberic character")
      .regex(/[@#$?%^&*]/, "Enter alteast one special character");
    const InputValidation = z.object({
      fullName: z.string(),
      username: z.string(),
      email: z.string().email(),
      password: passwordSchema,
    });
    const InputDatavalidate = InputValidation.safeParse({
      fullName,
      username,
      email,
      password,
    });
    if (!InputDatavalidate.success) {
      return res.status(400).json({
        success: false,
        message: "Input validation failded",
        error: InputDatavalidate.error.errors[0].message,
      });
    }
    //hasing password
    const hashPassword = await bcrypt.hash(password, 10);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const user = await UserModel.create({
      fullName,
      username,
      email,
      password: hashPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });
    if (user) {
      generateToken(user._id, res);
      return res.status(201).json({
        success: true,
        message: "User is created \n Welcome to your website 😇",
        user: user,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Enter all credentails",
      });
    }
    const existingUser = await UserModel.findOne({
      email,
    });
    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not exist . Please use signup",
      });
    }
    const comparePassword = await bcrypt.compare(
      password,
      existingUser?.password || ""
    );
    if (!comparePassword) {
      return res.status(411).json({
        success: false,
        messsage: "Invalid email or password",
      });
    }
    generateToken(existingUser._id, res);
    return res.status(200).json({
      success: true,
      message: "You successfully login 🤩",
      userData: existingUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 0,
    });
    return res.json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
