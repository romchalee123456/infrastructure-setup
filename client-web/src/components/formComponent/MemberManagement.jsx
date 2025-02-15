import React, { useState, useEffect } from "react";
import { Save, X, UserPlus } from "lucide-react";
import memberService from "../../services/memberService";

export function MemberManagement() {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [members, setMembers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    role: "user",
    profile_picture: ""
  });

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await memberService.getAllMember();
        setMembers(response.data);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    }
    fetchMembers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await memberService.addMember(newUser);
      setIsAddingUser(false);
      setNewUser({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        role: "user",
        profile_picture: ""
      });
      const updatedMembers = await memberService.getAllMember();
      setMembers(updatedMembers.data);
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Management</h2>
          {!isAddingUser && (
            <button
              onClick={() => setIsAddingUser(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <UserPlus className="w-5 h-5" />
              Add New User
            </button>
          )}
        </div>

        {isAddingUser && (
          <form onSubmit={handleSubmit} className="max-w-md space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={newUser.first_name}
                onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={newUser.last_name}
                onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={newUser.phone_number}
                onChange={(e) => setNewUser({ ...newUser, phone_number: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
              <input
                type="text"
                value={newUser.profile_picture}
                onChange={(e) => setNewUser({ ...newUser, profile_picture: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="https://example.com/profile.jpg"
              />
            </div>
            {newUser.profile_picture && (
              <div className="mt-2">
                <img
                  src={newUser.profile_picture}
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              </div>
            )}
            <div className="flex gap-2 mt-6">
              <button type="submit" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                <Save className="w-4 h-4" /> Save User
              </button>
              <button type="button" onClick={() => setIsAddingUser(false)} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200">
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default MemberManagement;
