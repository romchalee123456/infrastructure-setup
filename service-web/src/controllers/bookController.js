const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addBook = async (req, res) => {
  const { title, author, category, total_copies, available_copies } = req.body;

  if (
    !Number.isInteger(total_copies) ||
    total_copies <= 0 ||
    !Number.isInteger(available_copies) ||
    available_copies < 0 ||
    available_copies > total_copies
  ) {
    return res.status(400).send({
      status: "error",
      message: "Invalid total_copies or available_copies value",
    });
  }

  try {
    const result = await prisma.book.create({
      data: {
        title,
        author,
        category,
        total_copies,
        available_copies,
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

exports.updateBookById = async (req, res) => {
  const { id } = req.params;
  const { title, author, category, total_copies, available_copies } = req.body;
  if (
    !Number.isInteger(total_copies) ||
    total_copies <= 0 ||
    !Number.isInteger(available_copies) ||
    available_copies < 0 ||
    available_copies > total_copies
  ) {
    return res.status(400).send({
      status: "error",
      message: "Invalid total_copies or available_copies value",
    });
  }
  try {
    const result = await prisma.book.update({
      where: { book_id: Number(id) },
      title,
      author,
      category,
      total_copies,
      available_copies,
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

exports.deleteBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.member.delete({
      where: { book_id: Number(id) },
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

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.member.findUnique({
      where: { member_id: Number(id) },
    });

    if (!data) {
      return res.status(404).send({
        status: "error",
        message: "Book not found",
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

exports.getAllBook = async (req, res) => {
  try {
    const data = await prisma.book.findMany();
    if (!data || data.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No books found",
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
