const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

async function main() {

  await prisma.member.create({
    data: {
      username: 'john_doe',
      password: 'password123',
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      phone_number: '1234567890',
      role: 'admin',
      membership_date: new Date(),
    },
  })

  const books = [
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Novel', total_copies: 10, available_copies: 10 },
    { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', total_copies: 8, available_copies: 8 },
    { title: '1984', author: 'George Orwell', category: 'Dystopian', total_copies: 12, available_copies: 12 },
    { title: 'Pride and Prejudice', author: 'Jane Austen', category: 'Classic', total_copies: 5, available_copies: 5 },
    { title: 'The Catcher in the Rye', author: 'J.D. Salinger', category: 'Fiction', total_copies: 7, available_copies: 7 },
    { title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', total_copies: 15, available_copies: 15 },
    { title: 'Moby-Dick', author: 'Herman Melville', category: 'Adventure', total_copies: 6, available_copies: 6 },
    { title: 'War and Peace', author: 'Leo Tolstoy', category: 'Historical', total_copies: 9, available_copies: 9 },
    { title: 'The Odyssey', author: 'Homer', category: 'Epic', total_copies: 4, available_copies: 4 },
    { title: 'The Divine Comedy', author: 'Dante Alighieri', category: 'Epic', total_copies: 3, available_copies: 3 },
  ]

  for (const book of books) {
    await prisma.book.create({
      data: book,
    })
  }
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
