const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.borrowBook = async (req, res) => {
  const { book_id } = req.params;
  const { member_id, due_date } = req.body;

  try {
    // แก้ไขการใช้งาน id ที่ไม่ถูกต้อง
    const book = await prisma.book.findUnique({
      where: { book_id: Number(book_id) }, // ใช้ id ที่ถูกต้อง
    });
    const member = await prisma.member.findUnique({
      where: { member_id: Number(member_id) }, // ใช้ id ที่ถูกต้อง
    });

    if (!book || !member) {
      return res.status(404).send({
        status: "error",
        message: "Book or Member not found",
      });
    }

    const existingBorrow = await prisma.borrowing.findFirst({
      where: {
        member_id: Number(member_id),
        book_id: Number(book_id),
        status: "borrowed",
      },
    });

    if (existingBorrow) {
      return res.status(400).send({
        status: "error",
        message: "You have already borrowed this book",
      });
    }

    if (book.available_copies <= 0) {
      return res.status(400).send({
        status: "error",
        message: "No available copies to borrow",
      });
    }

    const parsedDueDate = new Date(due_date);
    if (isNaN(parsedDueDate)) {
      return res.status(400).send({
        status: "error",
        message: "Invalid due date",
      });
    }

    const result = await prisma.borrowing.create({
      data: {
        member_id: Number(member_id),
        book_id: Number(book_id),
        borrow_date: new Date(),
        due_date: parsedDueDate,
        status: "borrowed",
      },
    });

    await prisma.book.update({
      where: { book_id: Number(book_id) }, // ใช้ id ที่ถูกต้อง
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
      where: { borrow_id: Number(borrow_id) },
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
      where: { book_id: borrowRecord.book_id },
      data: { available_copies: borrowRecord.book.available_copies + 1 },
    });

    const result = await prisma.borrowing.update({
      where: { borrow_id: Number(borrow_id) },
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
  const member_id = req.currentUserId;
  try {
    const resultmember = await prisma.member.findUnique({
      where: { member_id: req.currentUserId },
    });

    if (!resultmember.user || resultmember.role !== "admin") {
      const result = await prisma.borrowing.findMany({
        include: { 
          book: true ,
          member: true
        },
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
    } else {
      const result = await prisma.borrowing.findMany({
        where: { member_id: Number(member_id) },
        include: { 
          book: true ,
          member: true
        },
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
    }
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

exports.calculateFine = async (req, res) => {
  const { borrow_id } = req.params;

  try {
    const borrowing = await prisma.borrowing.findUnique({
      where: { id: borrow_id },
    });

    if (!borrowing || !borrowing.due_date || borrowing.status === "returned") {
      return res.status(404).send({
        status: "error",
        message: "Borrowing record not found or already returned",
      });
    }

    if (borrowing.return_date && borrowing.return_date > borrowing.due_date) {
      const overdueDays = Math.ceil(
        (borrowing.return_date.getTime() - borrowing.due_date.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      const fineAmount = overdueDays * (borrowing.fine_per_day ?? 10);

      await prisma.borrowing.update({
        where: { id: borrow_id },
        data: { fine: fineAmount },
      });

      res.status(200).send({
        status: "success",
        message: `Fine calculated: ${fineAmount}`,
        data: { fine: fineAmount },
      });
    } else {
      res.status(200).send({
        status: "success",
        message: "No fine due",
        data: { fine: 0 },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      status: "error",
      message: "Server error",
    });
  }
};
