const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function findUserByEmail(email) {
  return await User.findOne({ email });
}

async function createJWT(user) {
  return jwt.sign(
    {
      email: user.email,
      userId: user._id,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1h",
    }
  );
}

function sendErrorResponse(res, message, statusCode = 500) {
  console.error(message);
  res.status(statusCode).json({ message });
}

module.exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return sendErrorResponse(res, "Auth failed", 401);
    }

    const token = await createJWT(user);
    res.status(200).json({
      message: "Auth successful",
      token,
    });
  } catch (error) {
    sendErrorResponse(res, "Internal Server Error");
  }
};

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (await findUserByEmail(email)) {
      return sendErrorResponse(res, "Email already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      _id: new mongoose.Types.ObjectId(),
      name,
      email,
      password: hashedPassword,
    });

    const result = await user.save();
    res.status(201).json({
      data: {
        _id: result._id,
        name: result.name,
        email: result.email,
      },
      message: "User created successfully",
    });
  } catch (error) {
    if (error.code && error.code === 11000) {
      return sendErrorResponse(res, "Email already registered", 409);
    }
    sendErrorResponse(res, "Internal Server Error");
  }
};
