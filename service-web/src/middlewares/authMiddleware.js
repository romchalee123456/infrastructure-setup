const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isAdmin = async (req, res, next) => {

  const result = await prisma.member.findUnique({
    where: { member_id: req.currentUserId },});

    req.user = result;
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).send({
        status: "error",
        message: "Access denied. Admins only.",
      });
    }
     next();
  };

  module.exports = isAdmin;
  