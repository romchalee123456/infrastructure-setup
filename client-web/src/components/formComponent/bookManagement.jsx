import React, { useState, useEffect } from "react";
import { PlusCircle, Edit2, Trash2, Save, X } from "lucide-react";
import bookService from "../../services/bookService";

export function BookManagement() {
  const [books, setBooks] = useState([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    coverImage: "",
    quantity: 1,
    available: 1,
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await bookService.getAllBook();
      if (!Array.isArray(response)) return;
      setBooks(response);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBookId) {
        await bookService.updateBookById(editingBookId, bookForm);
      } else {
        await bookService.addBook(bookForm);
      }
      closeForm();
      fetchBooks();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  const handleEdit = (book) => {
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn || "",
      category: book.category,
      coverImage: book.cover_image,
      quantity: book.total_copies,
      available: book.available_copies,
    });
    setEditingBookId(book.book_id);
    setIsAddingBook(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        await bookService.deleteBookById(id);
        fetchBooks();
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const openForm = () => {
    resetForm();
    setIsAddingBook(true);
  };

  const closeForm = () => {
    resetForm();
    setIsAddingBook(false);
  };

  const resetForm = () => {
    setBookForm({
      title: "",
      author: "",
      isbn: "",
      category: "",
      coverImage: "",
      quantity: 1,
      available: 1,
    });
    setEditingBookId(null);
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Book Management</h2>
          {!isAddingBook && (
            <button
              onClick={openForm}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <PlusCircle className="w-5 h-5" /> Add New Book
            </button>
          )}
        </div>

        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />

        {isAddingBook ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Title" value={bookForm.title} onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
            <input type="text" placeholder="Author" value={bookForm.author} onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
            <input type="text" placeholder="ISBN" value={bookForm.isbn} onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
            <input type="text" placeholder="Category" value={bookForm.category} onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
            <input type="url" placeholder="Cover Image URL" value={bookForm.coverImage} onChange={(e) => setBookForm({ ...bookForm, coverImage: e.target.value })} required className="w-full border rounded-lg px-3 py-2" />
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">{editingBookId ? "Update Book" : "Save Book"}</button>
            <button type="button" onClick={closeForm} className="bg-gray-300 text-black px-4 py-2 rounded">Cancel</button>
          </form>
        ) : (
          <ul>
            {filteredBooks.map((book) => (
              <li key={book.book_id} className="border p-4 mb-2 flex justify-between">
                <span>{book.title} - {book.author}</span>
                <div>
                  <button onClick={() => handleEdit(book)} className="bg-blue-500 text-white px-3 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(book.book_id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default BookManagement;

