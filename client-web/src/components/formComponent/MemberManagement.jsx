import React, { useState, useEffect } from "react";
import { Save, X, UserPlus, ChevronLeft, ChevronRight  } from "lucide-react";
import memberService from "../../services/memberService";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export function MemberManagement() {
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [members, setMembers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    role: "user",
    profile_image: "",  
    membership_date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const addNewUser = async () => {
    setNewUser({
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      role: "",
      membership_date: "",
      profile_image: "", 
    });
    setSelectedUserId(null);

    await openModal();
  };

  const openModal = async () => {
    setIsAddingUser(true);
  };

  const closeModal = async () => {
    setIsAddingUser(false);
  };

  const handleRowDoubleClick = async (userId) => {
    setSelectedUserId(userId);
    try {
      const res = await memberService.getMemberById(userId);
      res.data.membership_date = res.data.membership_date.split("T")[0];
      res.data.password = "";
      setNewUser(res.data);

      openModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    console.log(selectedUserId);
    if (selectedUserId === null) {
      handleSave();
    } else {
      handleUpdate();
    }
  };

  const handleSave = async () => {
    console.log(newUser);
    if (!newUser.username || !newUser.email || !newUser.role) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await memberService.addMember(newUser);

      if (response.status === "success") {
        setMembers({
          username: "",
          password: "",
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          role: "",
          membership_date: "",
          profile_image: "", 
        });
        await fetchMembers();
        withReactContent(Swal)
          .fire({
            title: <i>Save Success</i>,
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "Ok",
          })
          .then((result) => {
            if (result.isConfirmed) {
              closeModal();
            }
          });
      } else {
        withReactContent(Swal)
          .fire({
            title: <i>Failed to save user details.</i>,
            icon: "warning",
            showCancelButton: false,
            confirmButtonText: "Ok",
          })
          .then((result) => {
            if (result.isConfirmed) {
            }
          });
      }
    } catch (error) {
      console.error("Error saving user details:", error);
      console.log(error.response.data.message);
      withReactContent(Swal)
        .fire({
          title: <i>{error.response.data.message}</i>,
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

  const handleUpdate = async () => {
    if (!newUser.username || !newUser.email || !newUser.role) {
      alert("Please fill in all required fields");
      return;
    }

    const response = await memberService.updateMember(newUser, selectedUserId);

    if (response.status === "success") {
      setNewUser({
        username: members.username,
        password: members.password,
        first_name: members.first_name,
        last_name: members.last_name,
        email: members.email,
        phone_number: members.phone_number,
        role: members.role,
        profile_image: members.profile_image, 
      });
      await fetchMembers();
      withReactContent(Swal)
        .fire({
          title: <i>Update Success</i>,
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "Ok",
        })
        .then((result) => {
          if (result.isConfirmed) {
            closeModal();
          }
        });
    } else {
      withReactContent(Swal)
        .fire({
          title: <i>Failed to update user details.</i>,
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

  const handleDelete = async (userId) => { 
    withReactContent(Swal)
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await memberService.deleteMemberById(userId);
            if (response.status === "success") {
              await fetchMembers();
              withReactContent(Swal)
                .fire({
                  title: <i>User deleted successfully</i>,
                  icon: "success",
                  showCancelButton: false,
                  confirmButtonText: "Ok",
                })
                .then((result) => {
                  if (result.isConfirmed) {
                    closeModal();
                  }
                });
            } else {
              withReactContent(Swal)
                .fire({
                  title: <i>Failed to delete user</i>,
                  icon: "warning",
                  showCancelButton: false,
                  confirmButtonText: "Ok",
                })
                .then((result) => {
                  if (result.isConfirmed) {
                  }
                });
            }
          } catch (error) {
            console.error("Error deleting user:", error);
            withReactContent(Swal)
              .fire({
                title: <i>{error.response.data.message}</i>,
                icon: "warning",
                showCancelButton: false,
                confirmButtonText: "Ok",
              })
              .then((result) => {
                if (result.isConfirmed) {
                }
              });
          }
        }
      });
  };
  

  const filteredMembers = members.filter((user) =>
    user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastMember = currentPage * itemsPerPage;
  const indexOfFirstMember = indexOfLastMember - itemsPerPage;
  const currentMembers = filteredMembers.slice(indexOfFirstMember, indexOfLastMember);
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  async function fetchMembers() {
    try {
      const response = await memberService.getAllMember();
      setMembers(response.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">User Management</h2>
          {!isAddingUser && (
            <button
              onClick={addNewUser}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              <UserPlus className="w-5 h-5" />
              Add New Member
            </button>
          )}
        </div>
        {!isAddingUser && (
          <input
            type="text"
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
          />
        )}
        {!isAddingUser && (
          <div className="text-slate-600 leading-normal font-light">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Profile
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Full Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Member Date
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((user) => (
                    <tr
                      key={user.member_id}
                      onDoubleClick={() => handleRowDoubleClick(user.member_id)}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4">
                        <img
                          className="w-8 h-8 rounded-full"
                          src={user.profile_image}
                          alt="Profile"
                        />
                      </td>
                      <td className="px-6 py-4">
                        {user.first_name} {user.last_name}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(user.membership_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-5">
                          <button
                            onClick={() => handleRowDoubleClick(user.member_id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user.member_id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            delete
                          </button>
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
                  className="text-gray-700"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div>
                  <span className="text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>

                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="text-gray-700"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
        {isAddingUser && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                value={newUser.first_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, first_name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={newUser.last_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, last_name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={newUser.phone_number}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone_number: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({
                    ...newUser,
                    role: e.target.value,
                  })
                }
                className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-3 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture URL
              </label>
              <input
                type="url"
                value={newUser.profile_image}
                onChange={(e) =>
                  setNewUser({ ...newUser, profile_image: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2"
                placeholder="https://example.com/profile.jpg"
              />
            </div>
            {newUser.profile_image && (
              <div className="mt-2">
                <img
                  src={newUser.profile_image}
                  alt="Profile Preview"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              </div>
            )}
            <div className="flex gap-2 mt-6">
              <button
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                onClick={handleSubmit}
              >
                Save User
              </button>
              <button
                type="button"
                onClick={() => setIsAddingUser(false)}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemberManagement;
