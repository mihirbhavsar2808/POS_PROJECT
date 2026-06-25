import { useState, useRef } from "react";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
const STEPS = [
  { n: 1, label: "Basic Info", icon: "◈" },
  { n: 2, label: "Pricing", icon: "₹" },
  { n: 3, label: "Media", icon: "⬡" },
  { n: 4, label: "Review", icon: "✓" },
];

/* ── Shared Tailwind strings ── */
const inputCls = "w-full px-4 py-3 border-[1.5px] border-[#E9DCCF] rounded-xl text-sm text-[#3D2314] bg-[#FAF6F1] outline-none focus:border-[#C8A882] focus:ring-2 focus:ring-[#C8A882]/20 transition-all placeholder-[#C8A882]/40 mt-2";
const nextBtnCls = "py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#5C4033] to-[#3D2314] text-white hover:from-[#3D2314] hover:to-[#2a1709] shadow-[0_6px_20px_rgba(61,35,20,0.25)] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed";
const backBtnCls = "px-5 py-3.5 rounded-xl text-sm font-semibold bg-[#FAF6F1] text-[#8B6F5E] border border-[#E9DCCF] hover:bg-[#F0E8DF] transition-colors";

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="block text-[11px] text-[#A0856C] font-semibold tracking-widest uppercase">
    {children}
  </label>
);

const StepHeader = ({ icon, title, sub }: { icon: string; title: string; sub: string }) => (
  <div className="bg-gradient-to-r from-[#3D2314] to-[#5C4033] px-7 py-5">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#C8A882] text-lg">{icon}</div>
      <div>
        <h3 className="text-[#FAF6F1] font-bold text-base">{title}</h3>
        <p className="text-[#C8A882]/70 text-xs mt-0.5">{sub}</p>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════ */
const AddProductForm = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({
    title: "", price: "", thumbnail: null, category: "", quantity: "", description: "",
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const formatPrice = (v: string) => {
    const n = v.replace(/,/g, "");
    return isNaN(Number(n)) ? v : Number(n).toLocaleString("en-IN");
  };

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (name === "thumbnail") {
      const f = files[0];
      setForm({ ...form, thumbnail: f });
      if (f) setPreview(URL.createObjectURL(f));
    } else if (name === "price") {
      const raw = value.replace(/,/g, "");
      if (!isNaN(Number(raw))) setForm({ ...form, price: formatPrice(raw) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("image/")) {
      setForm({ ...form, thumbnail: f });
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("price", form.price.replace(/,/g, ""));
    fd.append("category", form.category);
    fd.append("quantity", form.quantity);
    fd.append("thumbnail", form.thumbnail);
    if (form.description) fd.append("description", form.description);
    try {
      const res = await fetch("http://localhost:5000/api/products", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setForm({ title: "", price: "", thumbnail: null, category: "", quantity: "", description: "" });
        setPreview(null);
        setTimeout(() => { setSuccess(false); setStep(1); }, 3500);
      } else alert(data.error);
    } catch (err) { console.error(err); }
    finally { setSubmitting(false); }
  };

  const isLowStock = Number(form.quantity) > 0 && Number(form.quantity) <= 10;
  const step1Valid = !!(form.title && form.category);
  const step2Valid = !!(form.price && form.quantity);
  const step3Valid = !!form.thumbnail;

  /* ── SUCCESS SCREEN ── */
  if (success) return (
    <div className="flex min-h-screen bg-[#FAF6F1] font-sans">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
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
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C8A882] to-[#5C4033] flex items-center justify-center mx-auto mb-5 shadow-[0_8px_32px_rgba(92,64,51,0.3)]">
              <span className="text-white text-3xl font-bold">✓</span>
            </div>
            <h2 className="text-2xl font-extrabold text-[#3D2314]">Product Published!</h2>
            <p className="text-[#A0856C] text-sm mt-2">Your product is now live in the catalog.</p>
            <button
              onClick={() => { setSuccess(false); setStep(1); }}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#3D2314] text-[#FAF6F1] text-sm font-semibold hover:bg-[#5C4033] transition-colors"
            >
              Add Another Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );

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

          {/* ── Top stepper bar ── */}
          <div className="flex justify-between items-center bg-white rounded-2xl px-6 py-4 shadow-sm border border-[#EFE8DF]">
            <div>
              <h2 className="text-[19px] font-bold text-[#3D2314] tracking-tight">Add New Product</h2>
              <p className="text-xs text-[#A0856C] mt-0.5">Step {step} of 4 — {STEPS[step - 1].label}</p>
            </div>
            <div className="flex items-center gap-1.5">
              {STEPS.map((s, i) => (
                <div key={s.n} className="flex items-center gap-1.5">
                  <button
                    onClick={() => { if (s.n <= step) setStep(s.n); }}
                    className={`w-8 h-8 rounded-full text-[11px] font-extrabold flex items-center justify-center transition-all duration-300
                      ${step === s.n
                        ? "bg-[#3D2314] text-[#C8A882] shadow-[0_4px_12px_rgba(61,35,20,0.3)]"
                        : s.n < step ? "bg-[#C8A882]/30 text-[#5C4033]"
                          : "bg-[#F0E8DF] text-[#C8A882]/50"
                      }`}
                  >
                    {s.n < step ? "✓" : s.n}
                  </button>
                  {i < STEPS.length - 1 && (
                    <div className={`w-8 h-[2px] rounded-full transition-all duration-500 ${s.n < step ? "bg-[#C8A882]" : "bg-[#F0E8DF]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Main grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT — step content */}
            <div className="lg:col-span-2">

              {/* ──────── STEP 1 ──────── */}
              {step === 1 && (
                <div className="bg-white rounded-[20px] border border-[#EFE8DF] shadow-[0_2px_20px_rgba(92,64,51,0.07)] overflow-hidden">
                  <StepHeader icon="◈" title="Basic Information" sub="Name your product and pick a category" />

                  <div className="p-7 space-y-6">
                    <div>
                      <Label>Product Title</Label>
                      <input name="title" type="text" value={form.title} onChange={handleChange}
                        placeholder="e.g. Premium Leather Wallet" className={inputCls} />
                      {form.title && <p className="text-[11px] text-[#A0856C] mt-1.5">{form.title.length} characters</p>}
                    </div>

                    <div>
                      <Label>Category</Label>
                      <input
                        type="text"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="Enter category (e.g. Electronics, Fashion, etc.)"
                        className={inputCls}
                      />
                    </div>

                    <div>
                      <Label>Description <span className="text-[#C8A882]/50 font-normal normal-case tracking-normal">(optional)</span></Label>
                      <textarea name="description" value={form.description} onChange={handleChange}
                        placeholder="Describe your product in a few lines..." rows={3} className={`${inputCls} resize-none`} />
                    </div>
                  </div>

                  <div className="px-7 pb-7">
                    <button onClick={() => step1Valid && setStep(2)} disabled={!step1Valid} className={`w-full ${nextBtnCls}`}>
                      Continue to Pricing →
                    </button>
                  </div>
                </div>
              )}

              {/* ──────── STEP 2 ──────── */}
              {step === 2 && (
                <div className="bg-white rounded-[20px] border border-[#EFE8DF] shadow-[0_2px_20px_rgba(92,64,51,0.07)] overflow-hidden">
                  <StepHeader icon="₹" title="Pricing & Stock" sub="Set the price and available quantity" />

                  <div className="p-7 space-y-6">
                    <div>
                      <Label>Selling Price</Label>
                      <div className="relative mt-2">
                        <div className="absolute left-0 top-0 bottom-0 w-12 flex items-center justify-center bg-[#F5EDE3] rounded-l-xl border-r border-[#E9DCCF]">
                          <span className="text-[#8B6F5E] font-bold text-sm">₹</span>
                        </div>
                        <input name="price" type="text" value={form.price} onChange={handleChange}
                          placeholder="0"
                          className="w-full pl-14 pr-4 py-3.5 border-[1.5px] border-[#E9DCCF] rounded-xl text-[#3D2314] font-bold text-lg bg-[#FAF6F1] outline-none focus:border-[#C8A882] focus:ring-2 focus:ring-[#C8A882]/20 transition-all placeholder-[#C8A882]/30"
                        />
                      </div>
                      {form.price && (
                        <p className="text-xs text-[#A0856C] mt-2">Display price: <span className="font-bold text-[#5C4033]">₹{form.price}</span></p>
                      )}
                    </div>

                    <div>
                      <Label>Stock Quantity</Label>
                      <div className="flex items-center gap-3 mt-2">
                        <button type="button" onClick={() => setForm({ ...form, quantity: String(Math.max(0, Number(form.quantity) - 1)) })}
                          className="w-11 h-11 rounded-xl bg-[#F0E8DF] hover:bg-[#E9DCCF] text-[#5C4033] font-bold text-xl flex items-center justify-center transition-colors">−</button>
                        <input name="quantity" type="number" value={form.quantity} onChange={handleChange}
                          placeholder="0"
                          className="flex-1 text-center py-3 border-[1.5px] border-[#E9DCCF] rounded-xl text-[#3D2314] font-bold text-xl bg-[#FAF6F1] outline-none focus:border-[#C8A882] focus:ring-2 focus:ring-[#C8A882]/20 transition-all"
                        />
                        <button type="button" onClick={() => setForm({ ...form, quantity: String(Number(form.quantity) + 1) })}
                          className="w-11 h-11 rounded-xl bg-[#3D2314] hover:bg-[#5C4033] text-[#C8A882] font-bold text-xl flex items-center justify-center transition-colors">+</button>
                      </div>

                      {form.quantity && (
                        <div className={`mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold
                          ${isLowStock ? "bg-amber-50 border border-amber-200 text-amber-700"
                            : Number(form.quantity) > 50 ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                              : "bg-[#F5EDE3] border border-[#E9DCCF] text-[#8B6F5E]"
                          }`}>
                          <span>{isLowStock ? "⚠" : "●"}</span>
                          {isLowStock ? "Low stock — consider restocking soon"
                            : Number(form.quantity) > 50 ? "Healthy stock level"
                              : "Moderate stock level"
                          }
                        </div>
                      )}
                    </div>

                    {form.price && form.quantity && (
                      <div className="rounded-2xl bg-gradient-to-br from-[#FAF6F1] to-[#F5EDE3] border border-[#E9DCCF] p-4">
                        <p className="text-[11px] text-[#A0856C] font-bold uppercase tracking-widest mb-3">Inventory Value</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#8B6F5E]">₹{form.price} × {form.quantity} units</span>
                          <span className="text-lg font-extrabold text-[#3D2314]">
                            ₹{(Number(form.price.replace(/,/g, "")) * Number(form.quantity)).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-7 pb-7 flex gap-3">
                    <button onClick={() => setStep(1)} className={backBtnCls}>← Back</button>
                    <button onClick={() => step2Valid && setStep(3)} disabled={!step2Valid} className={`flex-1 ${nextBtnCls}`}>
                      Continue to Media →
                    </button>
                  </div>
                </div>
              )}

              {/* ──────── STEP 3 ──────── */}
              {step === 3 && (
                <div className="bg-white rounded-[20px] border border-[#EFE8DF] shadow-[0_2px_20px_rgba(92,64,51,0.07)] overflow-hidden">
                  <StepHeader icon="⬡" title="Product Image" sub="Upload a clear product photo" />

                  <div className="p-7">
                    <div
                      onDrop={handleDrop}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onClick={() => fileRef.current?.click()}
                      className={`relative rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 text-center
                        ${dragOver ? "border-[#8B6F5E] bg-[#F5EDE3] scale-[1.01]"
                          : preview ? "border-[#C8A882] bg-[#FAF6F1]"
                            : "border-[#E9DCCF] bg-[#FAF6F1] hover:border-[#C8A882] hover:bg-[#F5EDE3]"
                        }`}
                    >
                      {preview ? (
                        <div className="p-4">
                          <img src={preview} className="h-52 w-full object-contain rounded-xl" alt="Preview" />
                          <p className="text-xs text-[#A0856C] mt-3 font-medium">✓ {(form.thumbnail as File)?.name}</p>
                          <p className="text-[11px] text-[#C8A882] mt-1">Click to replace</p>
                        </div>
                      ) : (
                        <div className="py-16 px-6">
                          <div className="w-16 h-16 rounded-2xl bg-[#F0E8DF] flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl text-[#C8A882]">↑</span>
                          </div>
                          <p className="text-sm font-bold text-[#5C4033]">
                            {dragOver ? "Drop your image here" : "Drag & drop or click to upload"}
                          </p>
                          <p className="text-xs text-[#A0856C] mt-2">PNG, JPG, WEBP · Max 5MB</p>
                        </div>
                      )}
                    </div>
                    <input ref={fileRef} type="file" name="thumbnail" accept="image/*" onChange={handleChange} className="hidden" />
                  </div>

                  <div className="px-7 pb-7 flex gap-3">
                    <button onClick={() => setStep(2)} className={backBtnCls}>← Back</button>
                    <button onClick={() => step3Valid && setStep(4)} disabled={!step3Valid} className={`flex-1 ${nextBtnCls}`}>
                      Review Product →
                    </button>
                  </div>
                </div>
              )}

              {/* ──────── STEP 4 ──────── */}
              {step === 4 && (
                <div className="bg-white rounded-[20px] border border-[#EFE8DF] shadow-[0_2px_20px_rgba(92,64,51,0.07)] overflow-hidden">
                  <StepHeader icon="✓" title="Review & Submit" sub="Confirm all details before publishing" />

                  <div className="p-7">
                    <div className="flex gap-5 items-start">
                      {preview && (
                        <div className="w-28 h-28 flex-shrink-0 rounded-2xl border border-[#EFE8DF] overflow-hidden bg-[#FAF6F1]">
                          <img src={preview} className="w-full h-full object-contain p-2" alt="product" />
                        </div>
                      )}
                      <div className="flex-1 space-y-3">
                        <div>
                          <p className="text-[10px] text-[#A0856C] uppercase tracking-widest font-bold">Product Name</p>
                          <p className="text-[#3D2314] font-bold text-base mt-0.5">{form.title}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Price", value: `₹${form.price}` },
                            { label: "Quantity", value: `${form.quantity} units` },
                            { label: "Category", value: form.category },
                          ].map((item) => (
                            <div key={item.label} className="bg-[#FAF6F1] rounded-xl p-3 border border-[#EFE8DF]">
                              <p className="text-[10px] text-[#A0856C] uppercase tracking-widest font-bold">{item.label}</p>
                              <p className="text-[#3D2314] font-bold text-sm mt-0.5 truncate">{item.value}</p>
                            </div>
                          ))}
                        </div>
                        {form.description && (
                          <div className="bg-[#FAF6F1] rounded-xl p-3 border border-[#EFE8DF]">
                            <p className="text-[10px] text-[#A0856C] uppercase tracking-widest font-bold mb-1">Description</p>
                            <p className="text-xs text-[#5C4033] leading-relaxed">{form.description}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 mt-5 flex-wrap">
                      {[1, 2, 3].map((n) => (
                        <button key={n} onClick={() => setStep(n)}
                          className="px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-[#F5EDE3] text-[#8B6F5E] hover:bg-[#E9DCCF] transition-colors">
                          Edit Step {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-7 pb-7 flex gap-3">
                    <button onClick={() => setStep(3)} className={backBtnCls}>← Back</button>
                    <button onClick={handleSubmit} disabled={submitting}
                      className={`flex-1 py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 flex items-center justify-center gap-2
                        ${submitting ? "bg-[#8B6F5E] text-white/70 cursor-not-allowed"
                          : "bg-gradient-to-r from-[#5C4033] to-[#3D2314] text-white hover:from-[#3D2314] hover:to-[#2a1709] shadow-[0_6px_20px_rgba(61,35,20,0.28)]"
                        }`}
                    >
                      {submitting
                        ? <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Publishing…</>
                        : "Publish Product ✓"
                      }
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — live preview + progress */}
            <div className="flex flex-col gap-5">

              {/* Live Preview Card */}
              <div className="bg-white rounded-[18px] border border-[#EFE8DF] shadow-[0_2px_16px_rgba(92,64,51,0.06)] overflow-hidden">
                <div className="px-5 py-4 border-b border-[#F0E8DF] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-br from-[#C8A882] to-[#8B6F5E]" />
                  <span className="text-sm font-bold text-[#3D2314]">Live Preview</span>
                </div>
                <div className="p-5">
                  <div className="rounded-2xl border border-[#EFE8DF] bg-[#FAF6F1] overflow-hidden">
                    <div className="h-32 bg-[#F0E8DF] flex items-center justify-center">
                      {preview
                        ? <img src={preview} className="h-full w-full object-contain p-3" alt="Preview" />
                        : <span className="text-4xl text-[#E9DCCF]">⬡</span>
                      }
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-[#A0856C] font-medium truncate">{form.category || "Category"}</p>
                      <p className="text-sm font-bold text-[#3D2314] mt-0.5 truncate">{form.title || "Product Title"}</p>
                      <p className="text-base font-extrabold text-[#5C4033] mt-1">{form.price ? `₹${form.price}` : "₹0"}</p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[11px] text-[#A0856C]">{form.quantity ? `${form.quantity} in stock` : "Stock: —"}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                          ${isLowStock ? "bg-amber-100 text-amber-600" : "bg-[#E9DCCF] text-[#8B6F5E]"}`}>
                          {isLowStock ? "Low Stock" : "In Stock"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step Guide */}
              <div className="bg-gradient-to-br from-[#3D2314] to-[#5C4033] rounded-[18px] p-5 shadow-[0_8px_28px_rgba(61,35,20,0.2)]">
                <p className="text-[#C8A882] text-[11px] font-bold tracking-widest uppercase mb-4">Your Progress</p>
                <div className="space-y-3">
                  {STEPS.map((s) => (
                    <div key={s.n} className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-extrabold flex-shrink-0 transition-all
                        ${s.n < step ? "bg-[#C8A882] text-[#3D2314]"
                          : s.n === step ? "bg-white text-[#3D2314]"
                            : "bg-white/10 text-[#C8A882]/40"
                        }`}>
                        {s.n < step ? "✓" : s.icon}
                      </div>
                      <p className={`text-xs font-semibold transition-colors
                        ${s.n === step ? "text-[#FAF6F1]"
                          : s.n < step ? "text-[#C8A882]"
                            : "text-[#E9DCCF]/35"
                        }`}>
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddProductForm;