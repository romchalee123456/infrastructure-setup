import http from '@/http-common';
export default {
    async getAllBook() {
        const res = await http.get('/book/getAllBook');
        return res.data;
    },
    async getBookById(id) {
        const res = await http.get(`/book/getBookById/${id}`);
        return res.data;
    },
    async addBook(data) {
        const res = await http.post('/book/addBook', data);
        return res.data;
    },
    async deleteBookById(id) {
        const res = await http.delete(`/book/deleteBookById/${id}`);
        return res.data;
    },
    async updateBookById(data,id) {
        const res = await http.put(`/book/updateBookById/${id}`, data);
        return res.data;
    },
    async searchBooks(query) {
        const res = await http.get('/book/searchBooks', { params: query });
        return res.data;
    },
    async getAllCategories() {
        const res = await http.get('/book/categories');
        return res.data;
    }
    
};