import React, { useState, useEffect } from 'react';
import { Edit2, X, Save } from 'lucide-react';
import memberService from "../../services/memberService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function Profile({ setUser }) {
  const [user, setUserState] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    profile_image: ""
  });
  const MySwal = withReactContent(Swal);
  const member_id = localStorage.getItem('member_id');

  useEffect(() => {
    const fetchUserData = async () => {
      if (member_id) {
        try {
          const response = await memberService.getMemberById(member_id); 
          if (response && response.data) {
            const updatedUser = response.data;
            setUserState(updatedUser); 
            setUser(updatedUser); 
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    fetchUserData();
  }, [member_id, setUser]);

  useEffect(() => {
    if (user) {
      setEditForm({
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        profile_image: user.profile_image || "" 
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await memberService.updateMember(user.member_id, editForm);
      if (updatedUser) {
        setUser(updatedUser);
        setIsEditing(false); 
        
        MySwal.fire({
          title: <i>Profile Updated</i>,
          text: "Your profile has been successfully updated.",
          icon: "success",
          confirmButtonText: "Ok"
        });

      }
    } catch (error) {
      console.error("Failed to update profile:", error);

      MySwal.fire({
        title: <i>Error</i>,
        text: "Failed to update your profile. Please try again.",
        icon: "error",
        confirmButtonText: "Ok"
      });
    }
  };

  if (!user) {
    return <p className="text-center text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Management</h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                value={editForm.first_name}
                onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                value={editForm.last_name}
                onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={editForm.phone_number}
                onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image Url</label>
              <input
                type="text"
                value={editForm.profile_image}
                onChange={(e) => setEditForm({ ...editForm, profile_image: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone_number: user.phone_number,
                    profile_image: user.profile_image || ""
                  });
                }}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 flex items-center gap-2"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-center items-start ">
          <div className="bg-white p-6 rounded-lg  w-full max-w-xl">
            <div className="flex justify-center items-center mb-6">
              {user.profile_image ? (
                <img src={user.profile_image} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-white">No Image</div>
              )}
            </div>
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              <p className="mb-2"><span className="font-semibold">Username:</span> {user.username}</p>
              <p className="mb-2"><span className="font-semibold">First Name:</span> {user.first_name}</p>
              <p className="mb-2"><span className="font-semibold">Last Name:</span> {user.last_name}</p>
              <p className="mb-2"><span className="font-semibold">Email:</span> {user.email}</p>
              <p className="mb-2"><span className="font-semibold">Phone Number:</span> {user.phone_number}</p>
            </div>
          </div>
        </div>
        
        


        )}
      </div>
    </div>
  );
}

export default Profile;
