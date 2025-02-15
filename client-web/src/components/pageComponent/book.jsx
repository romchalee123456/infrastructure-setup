import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import bookService from "../../services/bookService";
import BorrowingForm from "../formComponent/borrowingForm";

export function Book() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCategory, setSearchCategory] = useState("all");
  const [categories, setCategories] = useState(["all"]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const data = await bookService.getAllBook();
        setBooks(data);
        const uniqueCategories = ["all", ...new Set(data.map((book) => book.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    }
    fetchBooks();
  }, []);

  const filteredBooks = books.filter((book) => 
    (book.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    book.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (searchCategory === "all" || book.category === searchCategory)
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by title or author..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="border rounded-lg px-4 py-2"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.book_id}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedBook(book)}
          >
            <img src={book.cover_image} alt={book.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{book.author}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total: {book.total_copies}</span>
                <span className={`text-sm ${book.available_copies > 0 ? "text-green-600" : "text-red-600"}`}>
                  {book.available_copies} available
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedBook && <BorrowingForm book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  );
}

export default Book;
