import http from '@/http-common';
export default {
    async borrowBook(id) {
        const res = await http.post(`/borrowing/borrowBook/${id}`);
        return res.data;
    },
    async returnBook(borrow_id) {
        const res = await http.put(`/borrowing/returnBook/${borrow_id}`);
        return res.data;
    },
    async getBorrowingHistoryAll(member_id) {
        const res = await http.get(`/borrowing/getBorrowingHistoryAll/${member_id}`);
        return res.data;
    },
    async getBorrowingHistoryById(member_id) {
        const res = await http.get(`/borrowing/getBorrowingHistoryById/${member_id}`);
        return res.data;
    },
    async getBooksStatus(member_id) {
        const res = await http.get(`/borrowing/getBooksStatus/${member_id}`);
        return res.data;
    }
};