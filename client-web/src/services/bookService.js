import http from "../http-common";

const bookService = {
    async getAllBook() {
        const res = await http.get(`/api/book/getAllBook`);
        return res.data.data ?? [];  
    },
    async getBookById(id) {
        const res = await http.get(`/api/book/getBookById/${id}`);
        return res.data;
    },
    async addBook(data) {
        const res = await http.post(`/api/book/addBook`, data);
        return res.data;
    },
    async deleteBookById(id) {
        const res = await http.delete(`/api/book/deleteBookById/${id}`);
        return res.data;
    },
    async updateBookById(id,data ) {
        const res = await http.put(`/api/book/updateBookById/${id}`, data);
        return res.data;
    },
    async searchBooks(query) {
        const res = await http.get(`/api/book/searchBooks`, { params: query });
        return res.data;
    },
    async getAllCategories() {
        const res = await http.get(`/api/book/getAllCategories`);
        return res.data;
    }
};


export default bookService;
