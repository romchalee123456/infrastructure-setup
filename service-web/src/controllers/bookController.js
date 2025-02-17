const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.addBook = async (req, res) => {
  const { title, author, category, total_copies, available_copies, cover_image } = req.body;

  if (!Number.isInteger(total_copies) || total_copies <= 0 ||
      !Number.isInteger(available_copies) || available_copies < 0 || available_copies > total_copies) {
    return res.status(400).send({ status: "error", message: "Invalid total_copies or available_copies value" });
  }

  try {
    const result = await prisma.book.create({
      data: {
        title,
        author,
        category,
        total_copies,
        available_copies,
        cover_image,
      },
    });

    res.status(201).send({
      status: "success",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", message: err.message });
  }
};

exports.updateBookById = async (req, res) => {
  const { id } = req.params;
  const { title, author, category, total_copies, available_copies, cover_image } = req.body;

  if (total_copies !== undefined) {
    if (!Number.isInteger(total_copies) || total_copies <= 0) {
      return res.status(400).send({ status: "error", message: "Invalid total_copies value" });
    }
  }

  if (available_copies !== undefined) {
    if (!Number.isInteger(available_copies) || available_copies < 0 || available_copies > total_copies) {
      return res.status(400).send({ status: "error", message: "Invalid available_copies value" });
    }
  }

  try {
    const result = await prisma.book.update({
      where: { book_id: Number(id) },
      data: { 
        title,
        author,
        category,
        total_copies,
        available_copies,
        cover_image,
      },
    });
    console.log(result); 
    res.status(200).send({
      status: "success",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", message: err.message });
  }
};

exports.deleteBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.book.delete({ where: { book_id: Number(id) } });
    res.status(200).send({ status: "success", data });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", message: err.message });
  }
};

exports.getAllBook = async (req, res) => {
  try {
    const data = await prisma.book.findMany();
    if (!data.length) {
      return res.status(404).send({ status: "error", message: "No books found" });
    }

    res.status(200).send({
      status: "success",
      data: data ,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", message: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const data = await prisma.book.findUnique({
      where: { book_id: Number(req.params.id) },
    });

    if (!data) {
      return res.status(404).send({ status: "error", message: "Book not found" });
    }

    res.status(200).send({
      status: "success",
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", message: err.message });
  }
};

exports.searchBooks = async (req, res) => {
  const { title, author, category } = req.query;

  try {
    const query = {};
    if (title) query.title = { contains: title, mode: "insensitive" };
    if (author) query.author = { contains: author, mode: "insensitive" };
    if (category) query.category = category;

    const result = await prisma.book.findMany({ where: query });

    if (!result.length) {
      return res.status(404).send({ status: "error", message: "No books found matching the criteria" });
    }

    res.status(200).send({
      status: "success",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", message: "Server error" });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await prisma.book.findMany({
      select: { category: true },
      distinct: ['category']
    });

    if (!categories.length) {
      return res.status(404).send({ status: "error", message: "No categories found" });
    }

    res.status(200).send({
      status: "success",
      data: categories.map(c => c.category),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: "error", message: "Server error" });
  }
};
