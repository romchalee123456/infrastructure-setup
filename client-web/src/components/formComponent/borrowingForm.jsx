import React, { useState } from "react";
import { X } from "lucide-react";
import bookService from "../../services/bookService";

export function BorrowingForm({ book, onClose }) {
  const [duration, setDuration] = useState(7);
  const [isLoading, setIsLoading] = useState(false);

  const handleBorrow = async () => {
    if (book.available_copies <= 0) {
      alert("หนังสือเล่มนี้ถูกยืมหมดแล้ว");
      return;
    }

    setIsLoading(true);
    try {
      await bookService.borrowBook({
        book_id: book.book_id,
        borrow_duration: duration,
      });

      alert("ยืมหนังสือสำเร็จ!");
      onClose();
    } catch (error) {
      console.error("Error borrowing book:", error);
      alert("เกิดข้อผิดพลาดในการยืมหนังสือ");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row">
          <img
            src={book.cover_image}
            alt={book.title}
            className="w-full md:w-1/3 h-64 md:h-auto object-cover"
          />

          <div className="p-6 flex-1">
            <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
            <p className="text-gray-600 mb-4">by {book.author}</p>

            <div className="space-y-2 mb-6">
              <p>
                <span className="font-semibold">Category:</span> {book.category}
              </p>
              <p>
                <span className="font-semibold">Available:</span>{" "}
                {book.available_copies} of {book.total_copies}
              </p>
            </div>

            {book.available_copies > 0 ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Borrow Duration (days)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2"
                  >
                    <option value={7}>7 days</option>
                    <option value={14}>14 days</option>
                    <option value={30}>30 days</option>
                  </select>
                </div>

                <button
                  onClick={handleBorrow}
                  className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Borrow Book"}
                </button>
              </div>
            ) : (
              <p className="text-red-600 font-medium">
                This book is currently unavailable
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BorrowingForm;
