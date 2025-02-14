import http from "@/http-common";
export default {
  async getAllMember() {
    const res = await http.get("/member/getAllMember");
    return res.data;
  },
  async getMemberById(id) {
    const res = await http.get(`/member/getMemberById/${id}`);
    return res.data;
  },
  async addMember(data) {
    const res = await http.post("/member/addMember", data);
    return res.data;
  },
  async deleteMemberById(id) {
    const res = await http.delete(`/member/deleteMemberById/${id}`);
    return res.data;
  },
  async updateMember(data, id) {
    const res = await http.put(`/member/updateMember/${id}`, data);
    return res.data;
  },
  async updateProfilePicture(data) {
    const res = await http.put("/member/updateProfilePicture", data);
    return res.data;
  },  
  async getMemberByUsername(username) {
    const res = await http.get(`/member/getMemberByUsername/${username}`);
    return res.data;
  },
};
