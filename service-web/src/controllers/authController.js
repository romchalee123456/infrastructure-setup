const { hashPassword, comparePassword } = require("../util/password");
const {
  generateToken,
  generateRefreshToken,
  verifyToken,
} = require("../util/token");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.register = async (req, res) => {
  try {
    const { username, password, first_name, last_name, email, phone_number } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ status: "error", message: "Missing required fields" });
    }

    const existingUser = await prisma.member.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ status: "error", message: "Username is already taken" });
    }

    const existingEmail = await prisma.member.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(400).json({ status: "error", message: "Email is already registered" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = await prisma.member.create({
      data: {
        username,
        password: hashedPassword,
        first_name,
        last_name,
        email,
        phone_number,
        role: "user",
        membership_date: new Date(),
        profile_picture: null,
      },
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: {
        id: newUser.member_id,
        username: newUser.username,
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        phone_number: newUser.phone_number,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error", details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.member.findUnique({ where: { username } });

    if (!user) {
      return res.status(400).send({
        status: "error",
        message: "Invalid username or password",
      });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).send({
        status: "error",
        message: "Invalid username or password",
      });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    res.status(200).send({
      status: "success",
      message: "Login successful",
      accessToken,
      refreshToken,
      member_id: user.member_id, 
      username: user.username, 
      profile_image: user.profile_image,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};

exports.refreshAccessToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).send({
      status: "error",
      message: "Refresh token is required",
    });
  }

  try {
    const decoded = verifyToken(refreshToken, true);

    if (!decoded) {
      return res.status(403).send({
        status: "error",
        message: "Invalid refresh token",
      });
    }

    const accessToken = generateToken({
      id: decoded.id,
      username: decoded.username,
    });
    res.status(200).send({
      status: "success",
      data: { accessToken },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};


