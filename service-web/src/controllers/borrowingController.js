const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.borrowBook = async (req, res) => {
  const { id: book_id } = req.params;
  const { member_id, due_date } = req.body;
  try {
    const book = await prisma.book.findUnique({
      where: { id: book_id },
    });
    const member = await prisma.member.findUnique({
      where: { id: member_id },
    });

    if (!book || !member) {
      return res.status(404).send({
        status: "error",
        message: "Book or Member not found",
      });
    }

    if (book.available_copies <= 0) {
      return res.status(400).send({
        status: "error",
        message: "No available copies to borrow",
      });
    }

    const result = await prisma.borrowing.create({
      data: {
        member_id,
        book_id,
        borrow_date: new Date(),
        due_date: new Date(due_date),
        status: "borrowed",
      },
    });

    await prisma.book.update({
      where: { id: book_id },
      data: { available_copies: book.available_copies - 1 },
    });

    res.status(200).send({
      status: "success",
      message: "Book borrowed successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};

exports.returnBook = async (req, res) => {
  const { borrow_id } = req.params;

  try {
    const borrowRecord = await prisma.borrowing.findUnique({
      where: { id: borrow_id },
      include: { book: true },
    });

    if (!borrowRecord) {
      return res.status(404).send({
        status: "error",
        message: "Borrow record not found",
      });
    }

    if (borrowRecord.status === "returned") {
      return res.status(400).send({
        status: "error",
        message: "This book has already been returned",
      });
    }

    borrowRecord.status = "returned";
    borrowRecord.return_date = new Date();

    await prisma.book.update({
      where: { id: borrowRecord.book_id },
      data: { available_copies: borrowRecord.book.available_copies + 1 },
    });

    const result = await prisma.borrowing.update({
      where: { id: borrow_id },
      data: { status: "returned", return_date: new Date() },
    });

    res.status(200).send({
      status: "success",
      message: "Book returned successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};

exports.getBorrowingHistoryAll = async (req, res) => {
  const { member_id } = req.params;
  try {
    const result = await prisma.borrowing.findMany({
      where: { member_id },
      include: { book: true },
    });

    if (!result || result.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No borrowing history found",
      });
    }

    res.status(200).send({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};

exports.getBorrowingHistoryById = async (req, res) => {
  const { member_id } = req.params;
  try {
    if (req.user.member_id !== Number(member_id)) {
      return res.status(403).send({
        status: "error",
        message: "You can only view your own borrowing history",
      });
    }

    const result = await prisma.borrowing.findMany({
      where: { member_id: Number(member_id) },
      include: { book: true },
    });

    if (!result || result.length === 0) {
      return res.status(404).send({
        status: "error",
        message: "No borrowing history found",
      });
    }

    res.status(200).send({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};

exports.getBooksStatus = async (req, res) => {
  const { member_id } = req.params;
  try {
    const result = await prisma.borrowing.findMany({
      where: {
        member_id: Number(member_id),
        status: "borrowed",
      },
      include: { book: true },
    });

    res.status(200).send({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};
