import { Request, Response } from "express";
import usersSchema from "../models/usersSchema.js";
import bcrypt from "bcrypt";
import noteSchema from "../models/noteSchema.js";

/**
 * @desc get all users
 * @route GET /user
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const getAllUser = async function (req: Request, res: Response) {
  try {
    // to avoid sending back password to client
    const users = await usersSchema.find().select("-password").lean();
    if (!users || !users.length)
      return res.status(400).json({ message: "No user found !" });
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
  }
};

/**
 * @desc create a new users
 * @route POST /user
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const createUser = async function (req: Request, res: Response) {
  try {
    // checking for valid property
    const { username, password, roles } = req.body;
    if (
      !Boolean(username) ||
      !Boolean(password) ||
      !roles ||
      !Array.isArray(roles)
    ) {
      res.status(400).json({ message: "All fields are required!" });
    }
    // chek for duplicating
    const user = await usersSchema.findOne({ username }).lean().exec();
    if (user)
      //conflict
      return res.status(409).json({ message: "The user already exist" });

    // hashing password
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await usersSchema.create({
      username,
      password: hashPassword,
      roles,
    });
    console.log("newuser : ", newUser);
    if (newUser) {
      const userResponse = `the user with the name${username} and id ${newUser.id} was created successfully`;
      res.status(201).send(userResponse);
    } else {
      res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (err) {}
};

/**
 * @desc update users
 * @route PATCH /user
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const updateUser = async function (req: Request, res: Response) {
  try {
    const { id, username, password, roles, active } = req.body;

    if (
      !id ||
      !Boolean(username) ||
      !roles ||
      !Array.isArray(roles) ||
      !active ||
      typeof active != "boolean"
    ) {
      res.status(400).json({ message: "All fields are required!" });
    }

    const user = await usersSchema.findById(id);
    if (!user)
      return res
        .status(404)
        .json({ message: "user with the id of " + id + " is not found!" });

    // duplicate
    const duplicate = await usersSchema.findOne({ username }).exec();

    if (duplicate && duplicate._id.toString() != id) {
      return res
        .status(409)
        .json({ message: "user with " + username + " already exist" });
    }

    user.username = username;
    user.roles = roles;
    user.active = active;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    const NewUpt = await user.save();
    res
      .status(200)
      .json({ message: "User updated with username " + NewUpt.username });
  } catch (err) {}
};

/**
 * @desc delete users
 * @route DELETE /user
 * @access Private
 * @param req
 * @param res
 * @returns
 */
const deleteUser = async function (req: Request, res: Response) {
  const { id } = req.body;
  if (!id) res.status(400).json({ message: "userID Required" });

  const notes = await noteSchema.findOne({ user: id }).exec();

  if (notes) res.status(200).json({ message: "user has assigned notes" });

  const user = await usersSchema.findById(id).exec();
  if (!user)
    res.status(200).json({ message: "user with specifique ID not found" });
  const deleteUser = await user?.deleteOne()!;

  res.json({
    message: `${deleteUser.username} with ID ${deleteUser._id} deleted`,
  });
};

export default { getAllUser, createUser, deleteUser, updateUser };
