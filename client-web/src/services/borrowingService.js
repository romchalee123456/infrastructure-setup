import http from "../http-common";
export default {
    async borrowBook(id) {
        const res = await http.post(`/api/borrowing/borrowBook/${id}`);
        return res.data;
    },
    async returnBook(borrow_id) {
        const res = await http.put(`/api/borrowing/returnBook/${borrow_id}`);
        return res.data;
    },
    async getBorrowingHistoryAll(member_id) {
        const res = await http.get(`/api/borrowing/getBorrowingHistoryAll/${member_id}`);
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
        const res = await http.get(`/api/borrowing/calculateFine/${borrow_id}`);
        return res.data;
    }
};