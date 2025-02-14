const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);

  await prisma.member.create({
    data: {
      username: 'john_doe',
      password: hashedPassword, 
      first_name: 'John',
      last_name: 'Doe',
      email: 'johndoe@example.com',
      phone_number: '1234567890',
      role: 'admin',
      membership_date: new Date(),
      profile_image: 'https://i.pravatar.cc/150?img=1' // รูปโปรไฟล์ตัวอย่าง
    },
  });

  const books = [
    { 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      category: 'Novel', 
      total_copies: 10, 
      available_copies: 10,
      cover_image: 'https://m.media-amazon.com/images/I/81xXAyP9D-L.jpg'
    },
    { 
      title: 'To Kill a Mockingbird', 
      author: 'Harper Lee', 
      category: 'Fiction', 
      total_copies: 8, 
      available_copies: 8,
      cover_image: 'https://m.media-amazon.com/images/I/81OtwZ2Rp3L.jpg'
    },
    { 
      title: '1984', 
      author: 'George Orwell', 
      category: 'Dystopian', 
      total_copies: 12, 
      available_copies: 12,
      cover_image: 'https://m.media-amazon.com/images/I/71kxa1-0FYL.jpg'
    },
    { 
      title: 'Pride and Prejudice', 
      author: 'Jane Austen', 
      category: 'Classic', 
      total_copies: 5, 
      available_copies: 5,
      cover_image: 'https://m.media-amazon.com/images/I/81z1SxX9QQL.jpg'
    },
    { 
      title: 'The Catcher in the Rye', 
      author: 'J.D. Salinger', 
      category: 'Fiction', 
      total_copies: 7, 
      available_copies: 7,
      cover_image: 'https://m.media-amazon.com/images/I/71YKQ+Xlb5L.jpg'
    },
    { 
      title: 'The Hobbit', 
      author: 'J.R.R. Tolkien', 
      category: 'Fantasy', 
      total_copies: 15, 
      available_copies: 15,
      cover_image: 'https://m.media-amazon.com/images/I/81t2CVWEsUL.jpg'
    },
    { 
      title: 'Moby-Dick', 
      author: 'Herman Melville', 
      category: 'Adventure', 
      total_copies: 6, 
      available_copies: 6,
      cover_image: 'https://m.media-amazon.com/images/I/81dqXQx9KoL.jpg'
    },
    { 
      title: 'War and Peace', 
      author: 'Leo Tolstoy', 
      category: 'Historical', 
      total_copies: 9, 
      available_copies: 9,
      cover_image: 'https://m.media-amazon.com/images/I/81R+4+dFJYL.jpg'
    },
    { 
      title: 'The Odyssey', 
      author: 'Homer', 
      category: 'Epic', 
      total_copies: 4, 
      available_copies: 4,
      cover_image: 'https://m.media-amazon.com/images/I/81rlXRPcvQL.jpg'
    },
    { 
      title: 'The Divine Comedy', 
      author: 'Dante Alighieri', 
      category: 'Epic', 
      total_copies: 3, 
      available_copies: 3,
      cover_image: 'https://m.media-amazon.com/images/I/71udO5rs8hL.jpg'
    },
  ];

  for (const book of books) {
    await prisma.book.create({
      data: book,
    });
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
