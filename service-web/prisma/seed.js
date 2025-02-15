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
      profile_image: 'https://i.pravatar.cc/150?img=1' 
    },
  });

  const books = [
    { 
      title: 'The Great Gatsby', 
      author: 'F. Scott Fitzgerald', 
      category: 'Novel', 
      total_copies: 10, 
      available_copies: 10,
      cover_image: 'https://media.the101.world/wp-content/uploads/2022/05/05143815/20220521-Nara_-fb-scaled.webp'
    },
    { 
      title: 'To Kill a Mockingbird', 
      author: 'Harper Lee', 
      category: 'Fiction', 
      total_copies: 8, 
      available_copies: 8,
      cover_image: 'https://d32vymxhv9fq6b.cloudfront.net/images/books/large/97817/9781784870799.jpg'
    },
    { 
      title: '1984', 
      author: 'George Orwell', 
      category: 'Dystopian', 
      total_copies: 12, 
      available_copies: 12,
      cover_image: 'https://api.chulabook.com/images/pid-103136.jpg'
    },
    { 
      title: 'Pride and Prejudice', 
      author: 'Jane Austen', 
      category: 'Classic', 
      total_copies: 5, 
      available_copies: 5,
      cover_image: 'https://bci.kinokuniya.com/th/jsp/images/book-img/97861/97861650/9786165087575.JPG'
    },
    { 
      title: 'The Catcher in the Rye', 
      author: 'J.D. Salinger', 
      category: 'Fiction', 
      total_copies: 7, 
      available_copies: 7,
      cover_image: 'https://www.asiabooks.com/media/catalog/product/cache/a5ac216be58c0cbce1cb04612ece96dc/1/0/1000237540_front_xxxl_114.jpg'
    },
    { 
      title: 'The Hobbit', 
      author: 'J.R.R. Tolkien', 
      category: 'Fantasy', 
      total_copies: 15, 
      available_copies: 15,
      cover_image: 'https://bci.kinokuniya.com/jsp/images/book-img/97897/97897424/9789742474522.JPG'
    },
    { 
      title: 'Moby-Dick', 
      author: 'Herman Melville', 
      category: 'Adventure', 
      total_copies: 6, 
      available_copies: 6,
      cover_image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSDjHA3lrq4HH69Xr-1KpB59A-JZGUaFsvqXdFTi7aAZaOtP9Iz'
    },
    { 
      title: 'War and Peace', 
      author: 'Leo Tolstoy', 
      category: 'Historical', 
      total_copies: 9, 
      available_copies: 9,
      cover_image: 'https://bci.kinokuniya.com/jsp/images/book-img/97861/97861651/9786165144629.JPG'
    },
    { 
      title: 'The Odyssey', 
      author: 'Homer', 
      category: 'Epic', 
      total_copies: 4, 
      available_copies: 4,
      cover_image: 'https://kledthai.com/pub/media/catalog/product/cache/ec9bc38d41dea32eed9dacd87373392e/2/2/221628-7M4vUQUdrBRapJxNCmFKyL.jpg'
    },
    { 
      title: 'The Divine Comedy', 
      author: 'Dante Alighieri', 
      category: 'Epic', 
      total_copies: 3, 
      available_copies: 3,
      cover_image: 'https://f.ptcdn.info/745/066/000/q0ht7h37d6OeR7CsvUU5-o.jpg'
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
