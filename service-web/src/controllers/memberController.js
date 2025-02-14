const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hashPassword } = require("../util/password");

exports.addMember = async (req, res) => {
    const { username, password, first_name, last_name, email, phone_number, role } = req.body;
  
    try {

      if (req.user.role !== "admin") {
        return res.status(403).send({
          status: "error",
          message: "Only admins can add members.",
        });
      }
  
      if (role === "admin" && req.user.role !== "admin") {
        return res.status(403).send({
          status: "error",
          message: "Only admins can add another admin.",
        });
      }

      const hashedPassword = await hashPassword(password);
  
      const result = await prisma.member.create({
        data: {
          username,
          password: hashedPassword, 
          first_name,
          last_name,
          email,
          phone_number,
          role: role || "user", 
          membership_date: new Date(), 
        },
      });
  
      res.status(201).send({
        status: "success",
        data: result,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        status: "error",
        message: err.message,
      });
    }
  };

exports.updateMember = async (req, res) => {
  const { id } = req.params;
  const { username, first_name, last_name, email, phone_number } = req.body;
  try {
    const result = await prisma.member.update({
      where: { member_id: Number(id) },
      data: {
        username,
        first_name,
        last_name,
        email,
        phone_number,
      },
    });

    res.status(200).send({
      status: "success",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: err.message,
    });
  }
};

exports.deleteMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.member.delete({
      where: { member_id: Number(id) },
    });

    res.status(200).send({
      status: "success",
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: err.message,
    });
  }
};

exports.getAllMember = async (req, res) => {
  try {
    const data = await prisma.member.findMany();
    if (!data || data.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No members found",
      });
    }

    res.status(200).send({
      status: "success",
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: err.message,
    });
  }
};

exports.getMemberById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.member.findUnique({
      where: { member_id: Number(id) },
    });

    if (!data) {
      return res.status(404).send({
        status: "error",
        message: "Member not found",
      });
    }

    res.status(200).send({
      status: "success",
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: err.message,
    });
  }
};

exports.getMemberByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const data = await prisma.member.findMany({
      where: {
        username: {
          contains: username,  
          mode: "insensitive", 
        },
      },
    });

    if (!data || data.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No members found",
      });
    }

    res.status(200).send({
      status: "success",
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: err.message,
    });
  }
};
exports.updateProfilePicture = async (req, res) => {
  const { member_id } = req.user;
  const { profile_picture } = req.body;
  try {
    if (!profile_picture) {
      return res.status(400).send({
        status: "error",
        message: "Profile picture URL is required",
      });
    }

    const updatedUser = await prisma.member.update({
      where: { member_id },
      data: { profile_picture },
    });

    res.status(200).send({
      status: "success",
      message: "Profile picture updated successfully",
      user: {
        id: updatedUser.member_id,
        username: updatedUser.username,
        profile_picture: updatedUser.profile_picture,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};