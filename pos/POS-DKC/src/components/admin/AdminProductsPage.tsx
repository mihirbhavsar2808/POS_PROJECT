import { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";

const COLORS = ["#5C4033", "#8B6F5E", "#C8A882", "#E9DCCF", "#A0856C"];

const AdminProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [editProduct, setEditProduct] = useState<any>(null);
  const [showEdit, setShowEdit] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/products");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const openEdit = (product: any) => {
    setEditProduct(product);
    setShowEdit(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete product?")) return;
    await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
    setProducts(products.filter((p) => p._id !== id));
  };

  const handleEditChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") {
      setEditProduct({ ...editProduct, thumbnail: files[0] });
    } else if (name === "price") {
      const rawValue = value.replace(/,/g, "");
      if (/^\d*$/.test(rawValue)) {
        setEditProduct({ ...editProduct, price: rawValue });
      }
    } else {
      setEditProduct({ ...editProduct, [name]: value });
    }
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", editProduct.title);
    formData.append("price", editProduct.price);
    formData.append("category", editProduct.category);
    formData.append("quantity", editProduct.quantity);
    if (editProduct.thumbnail instanceof File) {
      formData.append("thumbnail", editProduct.thumbnail);
    }
    const res = await fetch(
      `http://localhost:5000/api/products/${editProduct._id}`,
      { method: "PUT", body: formData }
    );
    const updated = await res.json();
    if (res.ok) {
      setProducts(products.map((p) => (p._id === updated._id ? updated : p)));
      setShowEdit(false);
      setEditProduct(null);
      alert("Updated Successfully");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAF6F1] font-sans">

      {/* ✅ SIDEBAR */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ✅ MAIN CONTENT */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${sidebarOpen ? "ml-[240px]" : "ml-0"}
        `}
      >
        {/* ✅ HEADER */}
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* ✅ PAGE */}
        <main className="flex-1 px-7 py-7 overflow-y-auto flex flex-col gap-6">

          {/* ── TOP BAR ── */}
          <div className="flex justify-between items-center bg-white rounded-2xl px-6 py-4 shadow-sm border border-[#EFE8DF]">
            <div>
              <h2 className="text-[19px] font-bold text-[#3D2314] tracking-tight">Products</h2>
              <p className="text-xs text-[#A0856C] mt-0.5">
                {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="relative w-72">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A0856C] text-sm">⌕</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 border-[1.5px] border-[#E9DCCF] rounded-xl text-sm text-[#5C4033] bg-[#FAF6F1] outline-none focus:border-[#C8A882] focus:ring-2 focus:ring-[#C8A882]/20 transition-all placeholder-[#C8A882]"
              />
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-3 gap-5">
            <StatCard
              label="Total Products"
              value={products.length}
              gradient="from-[#5C4033] to-[#3D2314]"
              sub="In catalog"
            />
            <StatCard
              label="Filtered Results"
              value={filtered.length}
              gradient="from-[#8B6F5E] to-[#5C4033]"
              sub="Matching search"
            />
            <StatCard
              label="Categories"
              value={[...new Set(products.map((p) => p.category))].length}
              gradient="from-[#C8A882] to-[#8B6F5E]"
              sub="Unique categories"
            />
          </div>

          {/* ── PRODUCT GRID ── */}
          <div className="bg-white rounded-[18px] p-6 shadow-[0_2px_16px_rgba(92,64,51,0.06)] border border-[#EFE8DF]">
            <div className="flex items-center gap-2 text-sm font-bold text-[#3D2314] mb-5 tracking-tight">
              <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-[#C8A882] to-[#8B6F5E]" />
              All Products
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#A0856C]">
                <div className="text-5xl mb-3 opacity-30">◎</div>
                <p className="text-sm font-medium">No products found</p>
                <p className="text-xs mt-1 opacity-60">Try adjusting your search</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {filtered.map((p, i) => (
                  <div
                    key={p._id}
                    className="relative bg-[#FAF6F1] rounded-[14px] p-4 border border-[#EFE8DF] hover:border-[#C8A882] hover:shadow-[0_8px_28px_rgba(92,64,51,0.12)] transition-all duration-300 overflow-hidden"
                  >
                    <div
                      className="absolute top-3 right-3 w-2 h-2 rounded-full opacity-60"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />

                    <div className="h-36 w-full rounded-xl bg-white border border-[#EFE8DF] flex items-center justify-center overflow-hidden mb-3">
                      <img
                        src={`http://localhost:5000/uploads/${p.thumbnail}`}
                        className="h-full w-full object-contain p-2"
                        alt={p.title}
                      />
                    </div>

                    <div className="mb-3">
                      <h3 className="font-semibold text-[#3D2314] text-sm leading-snug line-clamp-2">
                        {p.title}
                      </h3>
                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[11px] text-[#A0856C] bg-[#E9DCCF]/50 px-2 py-0.5 rounded-full">
                          {p.category}
                        </span>
                        <span className="text-xs text-[#8B6F5E]">Qty: {p.quantity}</span>
                      </div>
                      <p className="text-[#5C4033] font-extrabold text-base mt-2">
                        ₹{Number(p.price).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#3D2314] text-[#FAF6F1] hover:bg-[#5C4033] transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#E9DCCF] text-[#8B6F5E] hover:bg-[#C8A882]/40 hover:text-[#5C4033] transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ════ EDIT MODAL ════ */}
      {
        showEdit && editProduct && (
          <div className="fixed inset-0 bg-[#3D2314]/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-[420px] shadow-[0_24px_60px_rgba(61,35,20,0.25)] border border-[#EFE8DF] overflow-x-hidden overflow-y-auto max-h-[90vh]">

              <div className="bg-gradient-to-r from-[#3D2314] to-[#5C4033] px-6 py-5 flex items-center justify-between">
                <div>
                  <h3 className="text-[#FAF6F1] font-bold text-base">Edit Product</h3>
                  <p className="text-[#C8A882] text-xs mt-0.5 truncate max-w-[260px]">
                    {editProduct.title}
                  </p>
                </div>
                <button
                  onClick={() => setShowEdit(false)}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-[#E9DCCF] flex items-center justify-center text-lg transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                {editProduct.thumbnail && (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-full h-36 bg-[#FAF6F1] rounded-xl border border-[#EFE8DF] flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          editProduct.thumbnail instanceof File
                            ? URL.createObjectURL(editProduct.thumbnail)
                            : `http://localhost:5000/uploads/${editProduct.thumbnail}`
                        }
                        className="h-full object-contain p-2"
                        alt="Preview"
                      />
                    </div>
                    <p className="text-[10px] text-[#A0856C] tracking-wide uppercase font-medium">
                      Current Image
                    </p>
                  </div>
                )}

                {["title", "price", "category", "quantity"].map((field) => (
                  <div key={field}>
                    <label className="block text-[11px] text-[#A0856C] font-semibold tracking-widest uppercase mb-1.5">
                      {field}
                    </label>
                    <input
                      name={field}
                      type={field === "quantity" ? "number" : "text"}
                      value={
                        field === "price"
                          ? editProduct.price
                            ? Number(editProduct.price).toLocaleString("en-IN")
                            : ""
                          : editProduct[field]
                      }
                      onChange={handleEditChange}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="w-full border-[1.5px] border-[#E9DCCF] px-4 py-2.5 rounded-xl text-sm text-[#3D2314] bg-[#FAF6F1] outline-none focus:border-[#C8A882] focus:ring-2 focus:ring-[#C8A882]/20 transition-all placeholder-[#C8A882]/60"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-[11px] text-[#A0856C] font-semibold tracking-widest uppercase mb-1.5">
                    Change Image
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    onChange={handleEditChange}
                    className="block w-full text-sm text-[#5C4033]
                    file:mr-3 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-xs file:font-semibold
                    file:bg-[#E9DCCF] file:text-[#5C4033]
                    hover:file:bg-[#C8A882]/40 cursor-pointer"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowEdit(false)}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold bg-[#FAF6F1] text-[#8B6F5E] border border-[#E9DCCF] hover:bg-[#E9DCCF]/50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#5C4033] to-[#3D2314] text-white hover:from-[#3D2314] hover:to-[#2a1709] shadow-[0_4px_14px_rgba(61,35,20,0.3)] transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
    </div >
  );
};

const StatCard = ({ label, value, gradient, sub }: any) => (
  <div className={`relative overflow-hidden rounded-[18px] p-6 bg-gradient-to-br ${gradient} shadow-[0_8px_28px_rgba(61,35,20,0.18)]`}>
    <div className="absolute -right-4 -top-4 w-[90px] h-[90px] rounded-full bg-white/[0.07]" />
    <div className="absolute right-6 -bottom-6 w-[60px] h-[60px] rounded-full bg-white/[0.05]" />
    <p className="text-[11px] text-white/65 tracking-widest uppercase">{label}</p>
    <h2 className="text-[28px] font-extrabold text-white mt-2 tracking-tight">{value}</h2>
    <p className="mt-2.5 text-[11px] text-white/45">{sub}</p>
  </div>
);

export default AdminProductsPage;