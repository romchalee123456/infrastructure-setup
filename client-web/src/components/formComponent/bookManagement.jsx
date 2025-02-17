import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Edit2,
  Trash2,
  Save,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import bookService from "../../services/bookService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function BookManagement() {
  const [books, setBooks] = useState([]);
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [editingBookId, setEditingBookId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    category: "",
    cover_image: "",
    total_copies: 1,
    available_copies: 1,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const MySwal = withReactContent(Swal);

  const handleEdit = (book) => {
    setBookForm({
      title: book.title,
      author: book.author,
      category: book.category,
      cover_image: book.cover_image,
      total_copies: book.total_copies,
      available_copies: book.available_copies,
    });
    setEditingBookId(book.book_id);
    setIsAddingBook(true);
  };

const handleDelete = async (id) => {
  MySwal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await bookService.deleteBookById(id);
        fetchBooks();

        MySwal.fire({
          title: "Deleted!",
          text: "The book has been deleted.",
          icon: "success",
        });

      } catch (error) {
        console.error("Error deleting book:", error);
        MySwal.fire({
          title: "Error!",
          text: "Failed to delete book.",
          icon: "error",
        });
      }
    }
  });
};


  const resetForm = () => {
    setBookForm({
      title: "",
      author: "",
      category: "",
      cover_image: "",
      total_copies: 1,
      available_copies: 1,
    });
    setEditingBookId(null);
  };

  const openForm = () => {
    resetForm();
    setIsAddingBook(true);
  };

  const closeForm = () => {
    resetForm();
    setIsAddingBook(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBookForm = {
      ...bookForm,
      total_copies: Number(bookForm.total_copies),
      available_copies: Number(bookForm.available_copies),
    };
  
    try {
      if (editingBookId) {
        await bookService.updateBookById(editingBookId, updatedBookForm);
      } else {
        await bookService.addBook(updatedBookForm);
      }
  
      closeForm();
      fetchBooks();
  
      MySwal.fire({
        title: <i>Save Success</i>,
        icon: "success",
        confirmButtonText: "Ok",
      });
  
    } catch (error) {
      console.error("Error saving book:", error);
  
      MySwal.fire({
        title: <i>Error saving book</i>,
        text: error.response?.data?.message || "Something went wrong",
        icon: "warning",
        confirmButtonText: "Ok",
      });
    }
  };
  

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleRowDoubleClick = (bookId) => {
    const bookToEdit = books.find((book) => book.book_id === bookId);
    handleEdit(bookToEdit);
  };
  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const fetchBooks = async () => {
    try {
      const response = await bookService.getAllBook();
      if (!Array.isArray(response)) return;
      setBooks(response);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

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
        {!isAddingBook && (
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />
        )}
        {!isAddingBook && (
          <div className="text-slate-600 leading-normal font-light">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      author
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr
                      key={book.book_id}
                      onDoubleClick={() => handleRowDoubleClick(book.book_id)}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4">{book.title}</td>
                      <td className="px-6 py-4">{book.author}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-5">
                          <button
                            onClick={() => handleEdit(book)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(book.book_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-center mt-2 mb-2">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="text-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div>
                  <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-gray-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        {isAddingBook ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Title
              </label>
              <input
                type="text"
                placeholder="Title"
                value={bookForm.title}
                onChange={(e) =>
                  setBookForm({ ...bookForm, title: e.target.value })
                }
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="author"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Author
              </label>
              <input
                type="text"
                placeholder="Author"
                value={bookForm.author}
                onChange={(e) =>
                  setBookForm({ ...bookForm, author: e.target.value })
                }
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Category
              </label>
              <input
                type="text"
                placeholder="Category"
                value={bookForm.category}
                onChange={(e) =>
                  setBookForm({ ...bookForm, category: e.target.value })
                }
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="total_copies"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Quantity
              </label>
              <input
                type="number"
                placeholder="Quantity"
                value={bookForm.total_copies}
                onChange={(e) =>
                  setBookForm({
                    ...bookForm,
                    total_copies: e.target.value,
                    available_copies: e.target.value,
                  })
                }
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="available_copies"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Available
              </label>
              <input
                type="number"
                placeholder="Available"
                value={bookForm.available_copies}
                required
                disabled
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="cover_image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Cover Image URL
              </label>
              <input
                type="url"
                placeholder="Cover Image URL"
                value={bookForm.cover_image}
                onChange={(e) =>
                  setBookForm({ ...bookForm, cover_image: e.target.value })
                }
                required
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded-md mr-3"
            >
              {editingBookId ? "Update Book" : "Save Book"}
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="bg-gray-300 text-black px-4 py-2 rounded-md"
            >
              Cancel
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}

export default BookManagement;
