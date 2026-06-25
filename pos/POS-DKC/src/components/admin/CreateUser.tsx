import { useEffect, useState } from "react";
import SearchBar from "../SearchBar";
import { IoClose } from "react-icons/io5";
import { FaTrash, FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import AdminSidebar from "./AdminSidebar";
import { updateUserPin } from "../../api/apiServices";
import {
  createUser,
  getUsers,
  deleteUser,
  verifyAdmin,
} from "../../api/apiServices";
import AdminHeader from "./AdminHeader";

const COLORS = ["#5C4033", "#8B6F5E", "#C8A882", "#E9DCCF", "#A0856C"];

const CreateUser = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [adminPassword, setAdminPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [newPin, setNewPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [showAdminPassPin, setShowAdminPassPin] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    pin: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      let list: any[] = [];
      if (Array.isArray(data)) list = data;
      else if (Array.isArray(data.users)) list = data.users;
      else if (Array.isArray(data.data)) list = data.data;
      setUsers(list.filter((u) => u.role === "user"));
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) { fetchUsers(); return; }
    const filtered = users.filter(
      (u) =>
        u.name.toLowerCase().includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase())
    );
    setUsers(filtered);
  };

  const handleCreateUser = async () => {
    if (form.pin.length !== 4) return alert("PIN must be 4 digits");
    setLoading(true);
    try {
      await createUser(form);
      setForm({ name: "", email: "", password: "", pin: "" });
      setSelectedUser(null);
      setShowForm(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setShowPinModal(true);
  };

  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await verifyAdmin(adminPassword);
      await deleteUser(deleteId);
      setShowDeleteModal(false);
      setAdminPassword("");
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePin = async () => {
    if (newPin.length !== 4) return alert("PIN must be 4 digits");
    setLoading(true);
    try {
      await verifyAdmin(adminPassword);
      await updateUserPin(selectedUser._id, newPin, adminPassword);
      alert("PIN updated successfully");
      setShowPinModal(false);
      setAdminPassword("");
      setNewPin("");
      fetchUsers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string) =>
    name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const getAvatarColor = (index: number) => COLORS[index % COLORS.length];

  return (
    <div className="flex min-h-screen bg-[#FAF6F1]">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-[240px]" : "ml-0"}`}>
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">

          {/* ── PAGE HEADER ── */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-xl font-bold text-[#3D2314] tracking-tight">User Management</h1>
                <p className="text-xs text-[#A0856C] mt-0.5">{users.length} registered users</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedUser(null);
                setForm({ name: "", email: "", password: "", pin: "" });
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-br from-[#5C4033] to-[#3D2314] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-[0_4px_14px_rgba(61,35,20,0.3)] hover:shadow-[0_6px_20px_rgba(61,35,20,0.4)] transition-all duration-200 hover:-translate-y-0.5"
            >
              <FaUserPlus size={14} />
              Add User
            </button>
          </div>

          {/* ── TABLE CARD ── */}
          <div className="bg-white rounded-2xl shadow-[0_2px_16px_rgba(92,64,51,0.06)] border border-[#EFE8DF] overflow-hidden">
            <div className="flex items-center gap-2 px-6 py-1 border-b border-[#EFE8DF]">
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-[#C8A882] to-[#8B6F5E]" />
              <h2 className="text-sm font-bold text-[#3D2314] tracking-tight">All Users</h2>
              {/* ── SEARCH ── */}
              <div className="w-full max-w-sm ml-auto">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>

            <div className="overflow-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-[#FAF6F1]">
                    <th className="p-4 text-left text-[11px] font-bold text-[#A0856C] uppercase tracking-widest">User</th>
                    <th className="p-4 text-center text-[11px] font-bold text-[#A0856C] uppercase tracking-widest">Email</th>
                    <th className="p-4 text-center text-[11px] font-bold text-[#A0856C] uppercase tracking-widest">PIN</th>
                    <th className="p-4 text-center text-[11px] font-bold text-[#A0856C] uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-[#A0856C] text-sm">
                        No users found. Add your first user!
                      </td>
                    </tr>
                  ) : (
                    users.map((u, idx) => (
                      <tr key={u._id} className="border-t border-[#F5F0EB] hover:bg-[#FAF6F1] transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: getAvatarColor(idx) }}
                            >
                              {getInitials(u.name)}
                            </div>
                            <div>
                              <p className="font-semibold text-[#3D2314] text-sm">{u.name}</p>
                              <p className="text-[11px] text-[#A0856C]">User</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center text-[#5C4033] text-sm">{u.email}</td>
                        <td className="p-4 text-center">
                          <span className="bg-[#F5EDE3] text-[#8B6F5E] rounded-lg px-3 py-1 text-xs font-bold tracking-widest">
                            ••••
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleSelectUser(u)}
                              className="w-8 h-8 rounded-lg bg-[#F5EDE3] hover:bg-[#EDD9C8] text-[#8B6F5E] flex items-center justify-center transition-colors"
                              title="Edit PIN"
                            >
                              <MdEdit size={14} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(u._id)}
                              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-500 flex items-center justify-center transition-colors"
                              title="Delete User"
                            >
                              <FaTrash size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          CREATE USER MODAL
      ══════════════════════════════════════ */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">

            {/* Modal top accent */}
            <div className="h-1.5 bg-gradient-to-r from-[#5C4033] via-[#8B6F5E] to-[#C8A882]" />

            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5C4033] to-[#3D2314] flex items-center justify-center shadow-md">
                    <FaUserPlus className="text-white" size={14} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#3D2314] text-base">Create New User</h3>
                    <p className="text-xs text-[#A0856C]">Fill in the details below</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="w-8 h-8 rounded-lg hover:bg-[#F5EDE3] flex items-center justify-center text-[#A0856C] hover:text-[#5C4033] transition-colors"
                >
                  <IoClose size={18} />
                </button>
              </div>

              {/* Form Fields */}
              <div className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#5C4033] mb-1.5 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={form.name}
                    className="w-full px-4 py-3 border-2 border-[#EFE8DF] rounded-xl text-sm text-[#3D2314] placeholder-[#C8A882] bg-[#FAF6F1] focus:outline-none focus:border-[#8B6F5E] focus:bg-white transition-all"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-[#5C4033] mb-1.5 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. john@example.com"
                    value={form.email}
                    className="w-full px-4 py-3 border-2 border-[#EFE8DF] rounded-xl text-sm text-[#3D2314] placeholder-[#C8A882] bg-[#FAF6F1] focus:outline-none focus:border-[#8B6F5E] focus:bg-white transition-all"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-[#5C4033] mb-1.5 uppercase tracking-wider">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter secure password"
                      value={form.password}
                      className="w-full px-4 py-3 pr-12 border-2 border-[#EFE8DF] rounded-xl text-sm text-[#3D2314] placeholder-[#C8A882] bg-[#FAF6F1] focus:outline-none focus:border-[#8B6F5E] focus:bg-white transition-all"
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0856C] hover:text-[#5C4033] transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>

                {/* PIN */}
                <div>
                  <label className="block text-xs font-semibold text-[#5C4033] mb-1.5 uppercase tracking-wider">4-Digit PIN</label>
                  <div className="flex gap-3 justify-center">
                    {[0, 1, 2, 3].map((i) => (
                      <input
                        key={i}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={form.pin[i] || ""}
                        className="w-14 h-14 text-center text-xl font-bold border-2 border-[#EFE8DF] rounded-xl text-[#3D2314] bg-[#FAF6F1] focus:outline-none focus:border-[#8B6F5E] focus:bg-white transition-all"
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                          const pinArr = (form.pin + "    ").slice(0, 4).split("");
                          pinArr[i] = val;
                          setForm({ ...form, pin: pinArr.join("").trim() });
                          if (val && e.target.nextElementSibling) {
                            (e.target.nextElementSibling as HTMLInputElement).focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !form.pin[i] && e.currentTarget.previousElementSibling) {
                            (e.currentTarget.previousElementSibling as HTMLInputElement).focus();
                          }
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleCreateUser}
                  disabled={loading}
                  className="w-full bg-gradient-to-br from-[#5C4033] to-[#3D2314] text-white py-3.5 rounded-xl font-semibold text-sm mt-2 shadow-[0_4px_14px_rgba(61,35,20,0.3)] hover:shadow-[0_6px_20px_rgba(61,35,20,0.4)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <FaUserPlus size={13} />
                      Create User
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          DELETE MODAL
      ══════════════════════════════════════ */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-400 to-red-500" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                  <FaTrash className="text-red-400" size={14} />
                </div>
                <div>
                  <h3 className="font-bold text-[#3D2314] text-base">Delete User</h3>
                  <p className="text-xs text-[#A0856C]">This action cannot be undone</p>
                </div>
              </div>

              <label className="block text-xs font-semibold text-[#5C4033] mb-1.5 uppercase tracking-wider">Admin Password</label>
              <div className="relative mb-4">
                <input
                  type={showAdminPass ? "text" : "password"}
                  placeholder="Enter your admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-[#EFE8DF] rounded-xl text-sm text-[#3D2314] placeholder-[#C8A882] bg-[#FAF6F1] focus:outline-none focus:border-red-300 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0856C] hover:text-[#5C4033] transition-colors"
                >
                  {showAdminPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => { setShowDeleteModal(false); setAdminPassword(""); }}
                  className="flex-1 py-2.5 rounded-xl border-2 border-[#EFE8DF] text-[#8B6F5E] text-sm font-semibold hover:bg-[#FAF6F1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  ) : (
                    <>
                      <FaTrash size={11} />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          UPDATE PIN MODAL
      ══════════════════════════════════════ */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-[#5C4033] via-[#8B6F5E] to-[#C8A882]" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8A882] to-[#8B6F5E] flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(selectedUser?.name)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#3D2314] text-base">Update PIN</h3>
                    <p className="text-xs text-[#A0856C]">{selectedUser?.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => { setShowPinModal(false); setAdminPassword(""); setNewPin(""); }}
                  className="w-8 h-8 rounded-lg hover:bg-[#F5EDE3] flex items-center justify-center text-[#A0856C] transition-colors"
                >
                  <IoClose size={18} />
                </button>
              </div>

              {/* New PIN boxes */}
              <label className="block text-xs font-semibold text-[#5C4033] mb-2 uppercase tracking-wider">New 4-Digit PIN</label>
              <div className="flex gap-3 justify-center mb-4">
                {[0, 1, 2, 3].map((i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={newPin[i] || ""}
                    className="w-14 h-14 text-center text-xl font-bold border-2 border-[#EFE8DF] rounded-xl text-[#3D2314] bg-[#FAF6F1] focus:outline-none focus:border-[#8B6F5E] focus:bg-white transition-all"
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "").slice(0, 1);
                      const pinArr = (newPin + "    ").slice(0, 4).split("");
                      pinArr[i] = val;
                      setNewPin(pinArr.join("").trim());
                      if (val && e.target.nextElementSibling) {
                        (e.target.nextElementSibling as HTMLInputElement).focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !newPin[i] && e.currentTarget.previousElementSibling) {
                        (e.currentTarget.previousElementSibling as HTMLInputElement).focus();
                      }
                    }}
                  />
                ))}
              </div>

              {/* Admin password */}
              <label className="block text-xs font-semibold text-[#5C4033] mb-1.5 uppercase tracking-wider">Admin Password</label>
              <div className="relative mb-4">
                <input
                  type={showAdminPassPin ? "text" : "password"}
                  placeholder="Enter your admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-[#EFE8DF] rounded-xl text-sm text-[#3D2314] placeholder-[#C8A882] bg-[#FAF6F1] focus:outline-none focus:border-[#8B6F5E] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPassPin(!showAdminPassPin)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A0856C] hover:text-[#5C4033] transition-colors"
                >
                  {showAdminPassPin ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>

              <button
                onClick={handleUpdatePin}
                disabled={loading}
                className="w-full bg-gradient-to-br from-[#5C4033] to-[#3D2314] text-white py-3.5 rounded-xl font-semibold text-sm shadow-[0_4px_14px_rgba(61,35,20,0.3)] hover:shadow-[0_6px_20px_rgba(61,35,20,0.4)] hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                ) : (
                  "Update PIN"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateUser;