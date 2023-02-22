import { Request, Response } from "express";
import usersSchema from "../models/usersSchema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * @desc auhenticate a user with username and password
 * @route POST /auth
 * @access public
 * @param req
 * @param res
 * @returns access_token
 */
const login = async function (req: Request, res: Response) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "All fields are required!" });
    }
    // check if the user exist
    const checkUser = await usersSchema.findOne({ username }).lean().exec();
    if (!checkUser || !checkUser.active) {
      return res
        .status(401)
        .json({ message: "Unauthorized ! ", status: "error" });
    }

    // check if the password match
    const matchPassword = await bcrypt.compare(password, checkUser.password!);

    // the password doesn't match
    if (!matchPassword) {
      res.status(401).json({ message: "Unauthorized", status: "error" });
    }
    // generate jwt access_token and refresh_token
    const access_token = jwt.sign(
      {
        UserInfo: {
          username: checkUser.username,
          roles: checkUser.roles,
        },
      },
      process.env.JWT_ACCESS_TOKEN!,
      {
        expiresIn: "30s",
      }
    );

    const refresh_token = jwt.sign(
      {
        username: checkUser.username,
      },
      process.env.JWT_REFRESH_TOKEN!,
      {
        expiresIn: "1m",
      }
    );

    // send the refresh with the http only cookie so that it can't be access by hacker
    res.cookie("jwt", refresh_token, {
      maxAge: 1000 * 60 * 24 * 7,
      // TODO set it to true before deploying , this is just for testing on local
      secure: false, // only with https
      // TODO set it to true before deploying , this is just for testing on local,
      sameSite: "none",
      httpOnly: false, // only accessible by web server
    });

    // now let's send the access token to the client
    res.status(200).json({ access_token });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

/**
 * @desc to refresh the access_token when he is expires using the valid refresh_token
 * @route GET /auth/refresh
 * @access public
 * @param req
 * @param res
 * @returns
 */
const refresh = function (req: Request, res: Response) {
  try {
    const cookie = req.headers.cookie;
    const cookies = req.headers.cookies;
    // TODO this possible because of the cookie-parse library
    console.log("cookies : ", cookies);
    console.log("cookie : ", cookie);

    // if (!cookies || (cookies && !cookies.jwt)) {
    if (!cookie) {
      res.status(401).json({
        message: "Unauthorized",
        status: "eeror",
      });
      return;
    }

    const jwtCookie = cookie.split("=")[1];
    jwt.verify(
      jwtCookie,
      process.env.JWT_REFRESH_TOKEN!,
      async function (err, decode) {
        // ckeck is there is any error
        if (err) {
          console.log(err);
          res.status(403).json({ message: "Forbidden" });
          return;
        }
        // if not get username form the payload
        if (decode && typeof decode != "string") {
          const { username } = decode;
          // find the actual user on the database
          const foundUser = await usersSchema.findOne({ username });

          if (!foundUser) {
            res.status(401).json({ message: "Unauthorized" });
            return;
          }
          // generate a new access_token and send it abck to the client
          const access_token = jwt.sign(
            {
              UserInfo: {
                username: foundUser.username,
                roles: foundUser.roles,
              },
            },
            process.env.JWT_ACCESS_TOKEN as string,
            {
              expiresIn: "30s",
            }
          );

          res.status(200).json({ access_token });
        }
      }
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const logout = function (req: Request, res: Response) {
  const cookie = req.headers.cookie;
  if (!cookie) res.status(404); //no content;

  res.clearCookie("jwt", {
    // TODO set it to true before deploying , this is just for testing on local
    secure: false, // only with https
    // TODO set it to true before deploying , this is just for testing on local,
    sameSite: "none",
    httpOnly: false, // only accessible by web server
  });
  res.status(200).json({ message: "Cookie Cleared ! " });
};

export default { login, refresh, logout };
