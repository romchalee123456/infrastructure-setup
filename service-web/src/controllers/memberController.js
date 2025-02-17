const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { hashPassword } = require("../util/password");

exports.addMember = async (req, res) => {
    const { username, password, first_name, last_name, email, phone_number, role,profile_image } = req.body;

    var existingUser = await prisma.member.findUnique({
      where: { username: username }});

    if (existingUser) {
      return res.status(400).send({
        status: "error",
        message: "Username is already taken",
      });
    }
    var existingEmail = await prisma.member.findUnique({
      where: { email: email }});
    
    if (existingEmail) {
      return res.status(400).send({
        status: "error",
        message: "Email is already registered",
      });
    }

    try {
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
          profile_image: profile_image || undefined,
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
  const { username, first_name, last_name, email, phone_number,password,role,profile_image } = req.body;
  
  try {

    const result = await prisma.member.update({
      where: { member_id: Number(id) },
      data: {
        username,
        password, 
        first_name,
        last_name,
        email,
        phone_number,
        profile_image: profile_image || undefined,
      },
    });

    if(password){
      const hashedPassword = await hashPassword(password);
      await prisma.member.update({
        where: { member_id: Number(id) },
        data: { password: hashedPassword },
      });
    }
    if(role){
      if(role !== result.role){
        await prisma.member.update({
          where: { member_id: Number(id) },
          data: { role: role },
        });
      }
    }

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
  const {  profile_image } = req.body;
  try {
    if (! profile_image) {
      return res.status(400).send({
        status: "error",
        message: "Profile picture URL is required",
      });
    }

    const updatedUser = await prisma.member.update({
      where: { member_id },
      data: {  profile_image },
    });

    res.status(200).send({
      status: "success",
      message: "Profile picture updated successfully",
      user: {
        id: updatedUser.member_id,
        username: updatedUser.username,
         profile_image: updatedUser. profile_image,
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