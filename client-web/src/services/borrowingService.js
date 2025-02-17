import http from "../http-common";

const  borrowingService = {
  async borrowBook({ book_id, member_id, due_date }) {
    try {
      const response = await http.post(`/api/borrowing/borrowBook/${book_id}`, {
        member_id,
        due_date,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async returnBook(borrow_id) {
    const res = await http.put(`/api/borrowing/returnBook/${borrow_id}`); 
    return res.data;
  },

  async getBorrowingHistoryAll() {
    const res = await http.get(`/api/borrowing/getBorrowingHistoryAll`);
    return res.data;
  },

  async getBorrowingHistoryById(member_id) {
    const res = await http.get(`/api/borrowing/getBorrowingHistoryById/${member_id}`);
    return res.data;
  },

  async getBooksStatus(member_id) {
    const res = await http.get(`/api/borrowing/getBooksStatus/${member_id}`);
    return res.data;
  },

  async calculateFine(borrow_id) {
    try {
      const res = await http.put(`/api/borrowing/calculateFine/${borrow_id}`);
      return res.data;
    } catch (error) {
      console.error("Error calculating fine:", error);
      throw error;
    }
  }
  
};

export default borrowingService;