import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import borrowingService from "../../services/borrowingService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function HistoryBorrowing() {
  const [historyList, setHistoryList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  async function fetchHistory() {
    try {
      const response = await borrowingService.getBorrowingHistoryAll();
      setHistoryList(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const filteredHistorys = historyList
    .filter(
      (borrow) =>
        borrow.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        borrow.status.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const indexOfLastHistory = currentPage * itemsPerPage;
  const indexOfFirstHistory = indexOfLastHistory - itemsPerPage;
  const currentHistorys = filteredHistorys.slice(indexOfFirstHistory, indexOfLastHistory);
  const totalPages = Math.ceil(filteredHistorys.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleReturn = async (borrow_id) => {
    try {
      const response = await borrowingService.returnBook(borrow_id);
      if (response.status === "success") {
        const fineResponse = await borrowingService.calculateFine(borrow_id);
        if (fineResponse.status === "success") {
          await fetchHistory(); 
          withReactContent(Swal)
            .fire({
              title: <i>Save Success</i>,
              icon: "success",
              showCancelButton: false,
              confirmButtonText: "Ok",
            })
            .then((result) => {
              if (result.isConfirmed) {
              }
            });
        } else {
          throw new Error(fineResponse.message);
        }
      } else {
        throw new Error("ไม่สามารถคืนหนังสือได้");
      }
    } catch (error) {
      console.error("Error return:", error);
      withReactContent(Swal)
        .fire({
          title: <i>{error.message}</i>,
          icon: "warning",
          showCancelButton: false,
          confirmButtonText: "Ok",
        })
        .then((result) => {
          if (result.isConfirmed) {
          }
        });
    }
  };

  return (
    <div className="text-slate-600 leading-normal font-light">
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 text-center">Title</th>
              <th scope="col" className="px-6 py-3 text-center">Borrow Date</th>
              <th scope="col" className="px-6 py-3 text-center">Due Date</th>
              <th scope="col" className="px-6 py-3 text-center">Return Date</th>
              <th scope="col" className="px-6 py-3 text-center">Fine</th>
              <th scope="col" className="px-6 py-3 text-center">Member</th>
              <th scope="col" className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentHistorys.map((borrow) => (
              <tr key={borrow.book_id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 text-center">{borrow.book.title}</td>
                <td className="px-6 py-4 text-center">{new Date(borrow.borrow_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center">{new Date(borrow.due_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center">{borrow.return_date && new Date(borrow.return_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center">{borrow.fine}</td>
                <td className="px-6 py-4 text-center">{borrow.member.username}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-5">
                    {borrow.status === "borrowed" && (
                      <button
                        onClick={() => handleReturn(borrow.borrow_id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Return Book
                      </button>
                    )}
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
            className="text-gray-700 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-gray-700 mx-4">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="text-gray-700 disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default HistoryBorrowing;
