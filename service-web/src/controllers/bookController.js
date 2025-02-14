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

exports.searchBooks = async (req, res) => {
  const { title, author, category } = req.query;

  try {
    const query = {};
    
    if (title) {
      query.title = { contains: title, mode: "insensitive" };
    }
    if (author) {
      query.author = { contains: author, mode: "insensitive" };
    }
    if (category) {
      query.category = category;
    }
    const result = await prisma.book.findMany({
      where: query
    });

    if (!result.length) {
      return res.status(404).send({
        status: "error",
        message: "No books found matching the criteria",
      });
    }

    res.status(200).send({
      status: "success",
      data: result,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.book.findMany({
      select: { category: true },
      distinct: ['category']
    });

    if (!categories.length) {
      return res.status(404).send({
        status: "error",
        message: "No categories found",
      });
    }

    res.status(200).send({
      status: "success",
      data: categories.map(c => c.category),
    });

  } catch (err) {
    console.error(err);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};
