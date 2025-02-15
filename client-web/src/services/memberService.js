import http from "../http-common";
export default {
  async getAllMember() {
    const res = await http.get(`/api/member/getAllMember`);
    return res.data; 
  },
  async getMemberById(id) {
    const res = await http.get(`/api/member/getMemberById/${id}`);
    return res.data;
  },
  async addMember(data) {
    const res = await http.post(`/api/member/addMember`, data);
    return res.data;
  },
  async deleteMemberById(id) {
    const res = await http.delete(`/api/member/deleteMemberById/${id}`);
    return res.data;
  },
  async updateMember(data, id) {
    const res = await http.put(`/api/member/updateMember/${id}`, data);
    return res.data;
  },
  async getMemberByUsername(username) {
    const res = await http.get(`/api/member/getMemberByUsername/${username}`);
    return res.data;
  },
};
