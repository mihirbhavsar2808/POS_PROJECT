import {
    AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
    PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { getAdminDashboard, deleteOrder } from "../../api/apiServices";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {
    FaAngleDown, FaBox, FaCheckCircle,
    FaClock, FaTimes, FaFire, FaChartLine,
    FaShoppingBag, FaStar, FaTrash, FaSearch
} from "react-icons/fa";

/* ───────────────────────────────────────────────────────────
   CONSTANTS
─────────────────────────────────────────────────────────── */
const PALETTE = {
    espresso: "#2C1810",
    mahogany: "#3D2314",
    walnut: "#5C4033",
    sienna: "#8B6F5E",
    caramel: "#C8A882",
    cream: "#E9DCCF",
    parchment: "#FAF6F1",
    linen: "#F5EDE3",
    sage: "#3D7A5C",
    rosewood: "#B94A4A",
};

const CHART_COLORS = [PALETTE.walnut, PALETTE.sienna, PALETTE.caramel, PALETTE.cream, "#A0856C"];

const STATUS_META: Record<string, { color: string; bg: string; glow: string; icon: ReactNode; label: string }> = {
    paid: { color: "#3D7A5C", bg: "rgba(61,122,92,0.12)", glow: "rgba(61,122,92,0.3)", icon: <FaCheckCircle size={10} />, label: "Paid" },
    failed: { color: "#B94A4A", bg: "rgba(185,74,74,0.12)", glow: "rgba(185,74,74,0.3)", icon: <FaTimes size={10} />, label: "Failed" },
    ongoing: { color: "#C8A882", bg: "rgba(200,168,130,0.12)", glow: "rgba(200,168,130,0.3)", icon: <FaClock size={10} />, label: "Ongoing" },
    unpaid: { color: "#C8A882", bg: "rgba(200,168,130,0.12)", glow: "rgba(200,168,130,0.3)", icon: <FaClock size={10} />, label: "Unpaid" },
};

const STATUS_PILL: Record<string, { active: string; text: string }> = {
    all: { active: "rgba(200,168,130,0.25)", text: "#C8A882" },
    paid: { active: "rgba(61,122,92,0.3)", text: "#6EE7B7" },
    failed: { active: "rgba(185,74,74,0.3)", text: "#FCA5A5" },
    ongoing: { active: "rgba(200,168,130,0.3)", text: "#FCD34D" },
    unpaid: { active: "rgba(200,168,130,0.3)", text: "#FCD34D" },
};

const ALL_STATUSES = ["all", "Paid", "Failed", "Ongoing", "Unpaid"] as const;

const formatINR = (v: number) => `₹${Number(v).toLocaleString("en-IN")}`;
const fmtDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

/* ───────────────────────────────────────────────────────────
   CUSTOM TOOLTIP
─────────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: "rgba(44,24,16,0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(200,168,130,0.2)",
            borderRadius: 14,
            padding: "10px 16px",
            boxShadow: "0 8px 32px rgba(44,24,16,0.4)",
        }}>
            <div style={{ color: PALETTE.caramel, fontSize: 11, fontWeight: 700, marginBottom: 6, letterSpacing: "0.05em" }}>
                {label}
            </div>
            {payload.map((p: any, i: number) => (
                <div key={i} style={{ color: PALETTE.cream, fontSize: 12 }}>
                    {p.name}:{" "}
                    <strong style={{ color: "#fff" }}>
                        {p.name === "revenue" ? formatINR(p.value) : Number(p.value).toLocaleString("en-IN")}
                    </strong>
                </div>
            ))}
        </div>
    );
};

/* ───────────────────────────────────────────────────────────
   TIME FILTER
─────────────────────────────────────────────────────────── */
const filterByTime = (orders: any[], filter: string) => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return orders.filter((o) => {
        const d = new Date(o.createdAt);
        d.setHours(0, 0, 0, 0);
        if (filter === "week") {
            const start = new Date(now);
            start.setDate(now.getDate() - 6);
            return d >= start && d <= now;
        }
        if (filter === "2weeks") {
            const start = new Date(now);
            start.setDate(now.getDate() - 13);
            return d >= start && d <= now;
        }
        if (filter === "month") {
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }
        if (filter === "year") {
            return d.getFullYear() === now.getFullYear();
        }
        return true;
    });
};

const getUserId = (o: any): string => typeof o.userId === "string" ? o.userId : o.userId?._id || "";
const getUserName = (o: any): string =>
    typeof o.userId === "object" ? o.userId?.name || o.userId?.email || "Unknown" : o.userId || "Unknown";

/* ───────────────────────────────────────────────────────────
   MAIN COMPONENT
─────────────────────────────────────────────────────────── */
const AdminOrders = () => {
    const [data, setData] = useState<any>(null);
    const [timeFilter, setTimeFilter] = useState("month");
    const [statusFilter, setStatusFilter] = useState("all");
    const [selectedUser, setSelectedUser] = useState("all");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");   
    const [paymentFilter, setPaymentFilter] = useState("all");
    const PER_PAGE = 8;

    useEffect(() => { getAdminDashboard().then(setData); }, []);

    const orders: any[] = data?.orders || [];

    const userList = useMemo(() => {
        const map = new Map<string, string>();
        orders.forEach((o) => {
            const id = getUserId(o), name = getUserName(o);
            if (id && !map.has(id)) map.set(id, name);
        });
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
    }, [orders]);

    const chartBase = useMemo(() => {
        let base = filterByTime(orders, timeFilter);
        if (selectedUser !== "all") base = base.filter((o) => String(getUserId(o)) === String(selectedUser));
        return base;
    }, [orders, timeFilter, selectedUser]);

    const filteredOrders = useMemo(() => {
        let result = [...orders];

        // USER FILTER
        if (selectedUser !== "all") {
            result = result.filter(
                (o) => String(getUserId(o)) === String(selectedUser)
            );
        }

        // STATUS FILTER (MATCH SCHEMA)
        if (statusFilter !== "all") {
            result = result.filter(
                (o) => o.status?.toLowerCase() === statusFilter.toLowerCase()
            );
        }

        // PAYMENT FILTER (NEW)
        if (paymentFilter !== "all") {
            result = result.filter(
                (o) => o.paymentMethod === paymentFilter
            );
        }

        // SORT
        return result.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

    }, [orders, statusFilter, selectedUser, paymentFilter]);

    const totalPages = Math.ceil(filteredOrders.length / PER_PAGE);
    const pageOrders = filteredOrders.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const chartData = useMemo(() => {
        if (timeFilter === "week" || timeFilter === "2weeks") {
            const days = timeFilter === "week" ? 7 : 14;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const dateArray: string[] = [];
            for (let i = days - 1; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                dateArray.push(d.toISOString().split("T")[0]);
            }
            const dataMap: any = {};
            chartBase.forEach((o) => {
                const d = new Date(o.createdAt);
                d.setHours(0, 0, 0, 0);
                const key = d.toISOString().split("T")[0];
                if (!dataMap[key]) dataMap[key] = 0;
                dataMap[key] += o.totalAmount || 0;
            });
            return dateArray.map((date) => ({
                name: new Date(date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }),
                revenue: dataMap[date] || 0,
            }));
        }
        const m = Array(12).fill(0);
        chartBase.forEach((o) => { m[new Date(o.createdAt).getMonth()] += o.totalAmount || 0; });
        return m.map((v, i) => ({ name: months[i], revenue: v }));
    }, [chartBase, timeFilter]);

    const statusData = useMemo(() => {
        const map: Record<string, number> = {};
        chartBase.forEach((o) => { map[o.status] = (map[o.status] || 0) + 1; });
        return Object.entries(map).map(([name, value]) => ({ name, value }));
    }, [chartBase]);

    const kpi = useMemo(() => {
        const revenue = chartBase.reduce((s, o) => s + (o.totalAmount || 0), 0);
        const avg = chartBase.length ? revenue / chartBase.length : 0;
        return { revenue, count: chartBase.length, avg };
    }, [chartBase]);

    const selectedUserName = useMemo(
        () => userList.find((u) => u.id === selectedUser)?.name || null,
        [selectedUser, userList]
    );

    const clearUser = () => { setSelectedUser("all"); setPage(1); };
    const axProps = { fontSize: 10, fill: "#A0856C" };

    const handleDelete = async (id: string) => {
        try {
            if (!confirm("Are you sure you want to delete this order?")) return;
            await deleteOrder(id);
            const fresh = await getAdminDashboard();
            setData(fresh);
        } catch (err: any) {
            alert(err.message);
        }
    };

    if (!data) return (
        <div className="h-screen flex flex-col items-center justify-center bg-[#FAF6F1] gap-4">
            <div className="w-12 h-12 rounded-full border-[3px] border-[#E9DCCF] border-t-[#8B6F5E] animate-spin" />
            <span className="text-[#8B6F5E] text-xs tracking-[0.2em] uppercase">Loading orders</span>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#FAF6F1]">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? "ml-[240px]" : "ml-0"}`}>
                <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <main className="flex-1 px-6 py-6 overflow-y-auto flex flex-col gap-5">

                    {/* ── HERO HEADER ── */}
                    <div
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, ${PALETTE.espresso} 0%, ${PALETTE.mahogany} 50%, ${PALETTE.walnut} 100%)`,
                            boxShadow: "0 20px 60px rgba(44,24,16,0.35)",
                        }}
                    >
                        <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-10"
                            style={{ background: `radial-gradient(circle, ${PALETTE.caramel}, transparent)` }} />
                        <div className="absolute -bottom-8 left-20 w-40 h-40 rounded-full opacity-10"
                            style={{ background: `radial-gradient(circle, ${PALETTE.sienna}, transparent)` }} />
                        <div className="absolute inset-0 opacity-[0.04]"
                            style={{ backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 30px,rgba(255,255,255,1) 30px,rgba(255,255,255,1) 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,rgba(255,255,255,1) 30px,rgba(255,255,255,1) 31px)" }} />

                        <div className="relative px-8 py-6 flex justify-between items-center">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#C8A882] animate-pulse" />
                                    <span className="text-[#C8A882] text-[10px] tracking-[0.25em] uppercase font-semibold">Admin Panel</span>
                                </div>
                                <h1 className="text-2xl font-black text-white tracking-tight leading-tight">
                                    Orders Management
                                    {selectedUserName && (
                                        <span className="ml-3 text-base font-normal text-[#C8A882]">· {selectedUserName}</span>
                                    )}
                                </h1>
                                <p className="text-[#A0856C] text-xs mt-1">
                                    {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <StyledSelect
                                    value={selectedUser}
                                    onChange={(v) => { setSelectedUser(v); setPage(1); }}
                                    options={[{ value: "all", label: "All Users" }, ...userList.map((u) => ({ value: u.id, label: u.name }))]}
                                    icon={<FaStar size={10} />}
                                />
                                <StyledSelect
                                    value={timeFilter}
                                    onChange={(v) => { setTimeFilter(v); setPage(1); }}
                                    options={[
                                        { value: "week", label: "This Week" },
                                        { value: "2weeks", label: "Last 2 Weeks" },
                                        { value: "month", label: "This Month" },
                                        { value: "year", label: "This Year" },
                                    ]}
                                    icon={<FaChartLine size={10} />}
                                />
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C8A882] to-[#8B6F5E] flex items-center justify-center text-white font-black text-sm shadow-lg cursor-pointer">
                                    A
                                </div>
                            </div>
                        </div>

                        {selectedUserName && (
                            <div className="px-8 pb-4 flex items-center gap-3">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-3.5 py-1.5 text-xs">
                                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#C8A882] to-[#8B6F5E] flex items-center justify-center text-white font-bold text-[10px]">
                                        {selectedUserName.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-[#E9DCCF] font-medium">{selectedUserName}</span>
                                    <button onClick={clearUser} className="text-[#A0856C] hover:text-white transition-colors ml-1">
                                        <FaTimes size={9} />
                                    </button>
                                </div>
                                <span className="text-[#7A6050] text-xs">{kpi.count} orders · {formatINR(kpi.revenue)}</span>
                            </div>
                        )}
                    </div>

                    {/* ── KPI CARDS ── */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { label: "Total Revenue", value: formatINR(kpi.revenue), sub: selectedUserName ? `${selectedUserName}'s spend` : "Selected period", icon: <FaFire size={16} />, accent: PALETTE.walnut, accentLight: "rgba(92,64,51,0.08)" },
                            { label: "Total Orders", value: kpi.count, sub: "All statuses", icon: <FaShoppingBag size={16} />, accent: PALETTE.sienna, accentLight: "rgba(139,111,94,0.08)" },
                            { label: "Avg Order Value", value: formatINR(Math.round(kpi.avg)), sub: "Per transaction", icon: <FaChartLine size={16} />, accent: "#A07040", accentLight: "rgba(160,112,64,0.08)" },
                        ].map((card, i) => (
                            <div key={i} className="relative rounded-2xl overflow-hidden"
                                style={{ background: "#fff", border: `1px solid ${PALETTE.cream}`, boxShadow: "0 2px 20px rgba(92,64,51,0.07)" }}>
                                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: card.accent }} />
                                <div className="px-5 py-5 pl-6">
                                    <div className="flex items-start justify-between mb-3">
                                        <p className="text-[10px] text-[#A0856C] tracking-[0.15em] uppercase font-semibold">{card.label}</p>
                                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: card.accentLight, color: card.accent }}>
                                            {card.icon}
                                        </div>
                                    </div>
                                    <h3 className="text-[22px] font-black text-[#2C1810] tracking-tight leading-none mb-1">{card.value}</h3>
                                    <p className="text-[10px] text-[#C8A882]">{card.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── CHARTS ── */}
                    <div className="grid grid-cols-5 gap-4">
                        <GlassCard title="Revenue Trend" subtitle={selectedUserName || "All users"} icon={<FaChartLine size={12} />} className="col-span-3">
                            <ResponsiveContainer width="100%" height={210}>
                                <AreaChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="revGradPremium" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor={PALETTE.sienna} stopOpacity={0.3} />
                                            <stop offset="95%" stopColor={PALETTE.sienna} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="#F0E8DF" strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" tick={axProps} axisLine={false} tickLine={false} />
                                    <YAxis width={72} tickFormatter={(v) => `₹${Number(v / 1000).toFixed(0)}K`} tick={axProps} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="revenue" name="revenue"
                                        stroke={PALETTE.sienna} strokeWidth={2.5}
                                        fill="url(#revGradPremium)" dot={false}
                                        activeDot={{ r: 5, fill: PALETTE.walnut, stroke: "#fff", strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </GlassCard>

                        <GlassCard title="Order Status" subtitle="Breakdown" icon={<FaBox size={12} />} className="col-span-2">
                            <div className="flex flex-col items-center">
                                <ResponsiveContainer width="100%" height={130}>
                                    <PieChart>
                                        <Pie data={statusData} dataKey="value" outerRadius={58} innerRadius={34} paddingAngle={3} startAngle={90} endAngle={-270}>
                                            {statusData.map((_: any, i: number) => (
                                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip content={<CustomTooltip />} />
                                    </PieChart>
                                </ResponsiveContainer>
                                {statusData.length === 0 && <p className="text-xs text-[#C8A882] text-center mt-2">No data</p>}
                                <div className="w-full mt-2 space-y-2">
                                    {statusData.map((s: any, i: number) => {
                                        const total = statusData.reduce((acc: number, x: any) => acc + x.value, 0);
                                        const pct = total ? Math.round((s.value / total) * 100) : 0;
                                        return (
                                            <div key={s.name} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                                                <span className="flex-1 text-[11px] text-[#5C4033] capitalize">{s.name}</span>
                                                <span className="text-[11px] text-[#A0856C]">{pct}%</span>
                                                <span className="text-[11px] font-bold text-[#3D2314] w-5 text-right">{s.value}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                    {/* ── ORDERS TABLE ── */}
                    <div className="rounded-2xl overflow-hidden"
                        style={{ background: "#fff", border: `1px solid ${PALETTE.cream}`, boxShadow: "0 4px 24px rgba(92,64,51,0.08)" }}>

                        {/* Table header band */}
                        <div
                            className="px-6 py-4 flex items-center justify-between flex-wrap gap-3"
                            style={{ background: `linear-gradient(90deg, ${PALETTE.espresso} 0%, ${PALETTE.mahogany} 100%)` }}
                        >
                            {/* Left — title */}
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-[#C8A882]">
                                    <FaShoppingBag size={13} />
                                </div>
                                <div>
                                    <h3 className="text-white text-sm font-bold tracking-tight">All Orders</h3>
                                    <p className="text-[#7A6050] text-[10px]">{filteredOrders.length} results</p>
                                </div>
                            </div>
                                    <div className="flex items-center gap-2 flex-1 bg-[#FAF6F1] border border-[#E9DCCF] rounded-xl px-4 py-2.5">
                 <FaSearch size={12} className="text-[#A0856C]" />
                 <input
                   value={search}
                   onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                   placeholder="Search by order ID or customer name…"
                   className="flex-1 bg-transparent text-sm text-[#3D2314] placeholder:text-[#C8A882] outline-none"
                 />
              </div>
                            {/* Right — status filter pills */}
                            <div className="flex items-center gap-1.5 flex-wrap">
                                {ALL_STATUSES.map((s) => {
                                    const isActive = statusFilter === s;
                                    const cm = STATUS_PILL[s];
                                    return (
                                        <button
                                            key={s}
                                            onClick={() => { setStatusFilter(s); setPage(1); }}
                                            className="text-[10px] px-3 py-1.5 rounded-full font-semibold capitalize transition-all"
                                            style={isActive
                                                ? { background: cm.active, color: cm.text, border: `1px solid ${cm.text}55` }
                                                : { background: "transparent", color: "#6A5048", border: "1px solid transparent" }
                                            }
                                        >
                                            {s === "all" ? "All" : s}
                                        </button>
                                    );
                                })}

                                {selectedUser !== "all" && (
                                    <button
                                        onClick={clearUser}
                                        className="flex items-center gap-1.5 text-[10px] text-[#8B6F5E] hover:text-[#C8A882] transition-colors border border-[rgba(200,168,130,0.2)] rounded-lg px-2.5 py-1.5 ml-2"
                                    >
                                        <FaTimes size={8} /> Clear user
                                    </button>
                                )}
                            </div>
                            {/* PAYMENT FILTER */}
                            <div className="flex gap-2 ml-3 border-l pl-3 border-[#E9DCCF]">
                                {["all", "cash", "card"].map((p) => {
                                    const isActive = paymentFilter === p;

                                    return (
                                        <button
                                            key={p}
                                            onClick={() => {
                                                setPaymentFilter(p);
                                                setPage(1);
                                            }}
                                            className="text-[10px] px-3 py-1.5 rounded-full font-semibold capitalize transition-all"
                                            style={
                                                isActive
                                                    ? {
                                                        background: "#3D2314",
                                                        color: "#fff",
                                                    }
                                                    : {
                                                        background: "#F5EDE3",
                                                        color: "#5C4033",
                                                    }
                                            }
                                        >
                                            {p}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr style={{ background: PALETTE.parchment, borderBottom: `1px solid ${PALETTE.cream}` }}>
                                        {["Order No.", "Customer", "Date", "Items", "Amount", "Status", ""].map((h) => (
                                            <th key={h} className="text-left px-5 py-3 text-[10px] text-[#A0856C] uppercase tracking-[0.12em] font-semibold">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {pageOrders.length === 0 && (
                                        <tr>
                                            <td colSpan={7}>
                                                <div className="flex flex-col items-center justify-center py-16 gap-3">
                                                    <div className="w-14 h-14 rounded-2xl bg-[#FAF6F1] flex items-center justify-center text-[#D4C5BB]">
                                                        <FaShoppingBag size={22} />
                                                    </div>
                                                    <p className="text-sm text-[#C8A882] font-medium">No orders found</p>
                                                    <p className="text-xs text-[#D4C5BB]">Try adjusting your filters</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {pageOrders.map((order: any, rowIdx: number) => {
                                        const oid = order._id || "—";
                                        const uname = getUserName(order);
                                        const uid = getUserId(order);
                                        const status = (order.status || "pending").toLowerCase();
                                        const meta = STATUS_META[status] || STATUS_META["pending"];
                                        const isOpen = expandedOrder === oid;
                                        const isActiveUser = selectedUser === uid;
                                        const globalIndex = (page - 1) * PER_PAGE + rowIdx + 1;

                                        return (
                                            <>
                                                <tr
                                                    key={oid}
                                                    className="group transition-colors"
                                                    style={{
                                                        borderBottom: `1px solid ${PALETTE.linen}`,
                                                        background: rowIdx % 2 === 0 ? "#fff" : PALETTE.parchment,
                                                    }}
                                                    onMouseEnter={(e) => (e.currentTarget.style.background = "#FDF7F2")}
                                                    onMouseLeave={(e) => (e.currentTarget.style.background = rowIdx % 2 === 0 ? "#fff" : PALETTE.parchment)}
                                                >
                                                    {/* Order No. */}
                                                    <td className="px-5 py-4">
                                                        <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg"
                                                            style={{ background: PALETTE.linen, color: PALETTE.walnut }}>
                                                            {String(globalIndex).padStart(2, "0")}
                                                        </span>
                                                    </td>

                                                    {/* Customer */}
                                                    <td className="px-5 py-4">
                                                        <button
                                                            onClick={() => { setSelectedUser(isActiveUser ? "all" : uid); setPage(1); }}
                                                            title={isActiveUser ? "Clear filter" : `Filter by ${uname}`}
                                                            className="flex items-center gap-2.5"
                                                        >
                                                            <div
                                                                className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-[11px] font-black transition-all flex-shrink-0"
                                                                style={{
                                                                    background: isActiveUser
                                                                        ? `linear-gradient(135deg, ${PALETTE.mahogany}, ${PALETTE.walnut})`
                                                                        : `linear-gradient(135deg, ${PALETTE.caramel}, ${PALETTE.sienna})`,
                                                                    boxShadow: isActiveUser ? `0 0 0 2px ${PALETTE.caramel}` : "none",
                                                                }}
                                                            >
                                                                {uname.charAt(0).toUpperCase()}
                                                            </div>
                                                            <div className="text-left">
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="text-sm font-semibold transition-colors"
                                                                        style={{ color: isActiveUser ? PALETTE.mahogany : PALETTE.walnut }}>
                                                                        {uname}
                                                                    </span>
                                                                    {isActiveUser && (
                                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                                                                            style={{ background: PALETTE.mahogany, color: PALETTE.caramel }}>
                                                                            active
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </button>
                                                    </td>

                                                    {/* Date */}
                                                    <td className="px-5 py-4 text-[#8B6F5E] text-sm">{fmtDate(order.createdAt)}</td>

                                                    {/* Items */}
                                                    <td className="px-5 py-4">
                                                        <span className="text-sm text-[#8B6F5E]">
                                                            {order.cartItems?.length ?? 0}
                                                            <span className="text-[#C8A882]"> item{(order.cartItems?.length ?? 0) !== 1 ? "s" : ""}</span>
                                                        </span>
                                                    </td>

                                                    {/* Amount */}
                                                    <td className="px-5 py-4">
                                                        <span className="text-sm font-black text-[#2C1810]">{formatINR(order.totalAmount || 0)}</span>
                                                    </td>

                                                    {/* Status badge */}
                                                    <td className="px-5 py-4">
                                                        <span
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold"
                                                            style={{
                                                                color: meta.color,
                                                                background: meta.bg,
                                                                boxShadow: `0 0 0 1px ${meta.glow}`,
                                                            }}
                                                        >
                                                            {meta.icon}
                                                            {meta.label}
                                                        </span>
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setExpandedOrder(isOpen ? null : oid)}
                                                                className="text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all"
                                                                style={isOpen
                                                                    ? { background: PALETTE.mahogany, color: PALETTE.caramel }
                                                                    : { background: PALETTE.linen, color: PALETTE.sienna }
                                                                }
                                                            >
                                                                {isOpen ? "Close ↑" : "View ↓"}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(oid)}
                                                                className="px-3 py-1.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 transition"
                                                            >
                                                                <FaTrash size={12} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {/* Expanded detail row */}
                                                {isOpen && (
                                                    <tr key={`${oid}-exp`}>
                                                        <td colSpan={7} style={{ background: PALETTE.linen, borderBottom: `1px solid ${PALETTE.cream}` }}>
                                                            <div className="px-6 py-5">
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-1 h-5 rounded-full" style={{ background: PALETTE.sienna }} />
                                                                        <span className="text-xs font-bold text-[#3D2314] tracking-widest uppercase">Order Details</span>
                                                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded"
                                                                            style={{ background: PALETTE.cream, color: PALETTE.walnut }}>
                                                                            #{oid.slice(-12).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex items-center gap-4 text-xs text-[#8B6F5E]">
                                                                        {order.paymentMethod && (
                                                                            <span className="flex items-center gap-1">
                                                                                <span className="text-[#C8A882]">Payment:</span>
                                                                                <strong className="text-[#3D2314]">{order.paymentMethod}</strong>
                                                                            </span>
                                                                        )}
                                                                        {order.address && (
                                                                            <span className="flex items-center gap-1 truncate max-w-xs">
                                                                                <span className="text-[#C8A882]">Ship to:</span>
                                                                                <strong className="text-[#3D2314]">
                                                                                    {[order.address.street, order.address.city, order.address.state].filter(Boolean).join(", ")}
                                                                                </strong>
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                {order.cartItems?.length ? (
                                                                    <div className="grid grid-cols-3 gap-3">
                                                                        {order.cartItems.map((item: any, idx: number) => (
                                                                            <div key={idx} className="flex items-center gap-3 rounded-xl p-3"
                                                                                style={{ background: "#fff", border: `1px solid ${PALETTE.cream}`, boxShadow: "0 2px 8px rgba(92,64,51,0.05)" }}>
                                                                                {item.image ? (
                                                                                    <img src={item.image} alt={item.title}
                                                                                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                                                                                        style={{ border: `1px solid ${PALETTE.cream}` }} />
                                                                                ) : (
                                                                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                                                                        style={{ background: PALETTE.linen, color: PALETTE.caramel }}>
                                                                                        <FaBox size={16} />
                                                                                    </div>
                                                                                )}
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="text-sm font-semibold text-[#2C1810] truncate">{item.title}</p>
                                                                                    <p className="text-[10px] text-[#A0856C] mt-0.5">
                                                                                        {item.quantity} × {formatINR(item.price || 0)}
                                                                                    </p>
                                                                                </div>
                                                                                <span className="text-xs font-black flex-shrink-0" style={{ color: PALETTE.walnut }}>
                                                                                    {formatINR((item.quantity || 1) * (item.price || 0))}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-sm text-[#A0856C]">No items.</p>
                                                                )}

                                                                <div className="mt-4 flex items-center justify-end gap-2 pt-3"
                                                                    style={{ borderTop: `1px solid ${PALETTE.cream}` }}>
                                                                    <span className="text-xs text-[#A0856C]">Order Total</span>
                                                                    <span className="text-lg font-black" style={{ color: PALETTE.mahogany }}>
                                                                        {formatINR(order.totalAmount || 0)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-3.5"
                                style={{ borderTop: `1px solid ${PALETTE.cream}`, background: PALETTE.parchment }}>
                                <span className="text-[11px] text-[#A0856C]">
                                    {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filteredOrders.length)} of {filteredOrders.length} orders
                                </span>
                                <div className="flex items-center gap-1">
                                    <PagBtn disabled={page === 1} onClick={() => setPage(p => p - 1)} label="←" />
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                        .reduce<(number | "…")[]>((acc, p, i, arr) => {
                                            if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…");
                                            acc.push(p);
                                            return acc;
                                        }, [])
                                        .map((p, i) =>
                                            p === "…"
                                                ? <span key={`e${i}`} className="text-[#C8A882] px-1 text-xs">…</span>
                                                : <PagBtn key={p} active={page === p} onClick={() => setPage(p as number)} label={String(p)} />
                                        )}
                                    <PagBtn disabled={page === totalPages} onClick={() => setPage(p => p + 1)} label="→" />
                                </div>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
};

/* ═══════════════════════════════════════════════════════
   REUSABLE SUB-COMPONENTS
═══════════════════════════════════════════════════════ */

const GlassCard = ({ title, subtitle, icon, children, className = "" }: any) => (
    <div className={`rounded-2xl overflow-hidden ${className}`}
        style={{ background: "#fff", border: `1px solid ${PALETTE.cream}`, boxShadow: "0 2px 20px rgba(92,64,51,0.06)" }}>
        <div className="flex items-center gap-2.5 px-5 pt-4 pb-3" style={{ borderBottom: `1px solid ${PALETTE.linen}` }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: PALETTE.linen, color: PALETTE.sienna }}>
                {icon}
            </div>
            <div>
                <h4 className="text-sm font-bold text-[#3D2314] leading-none">{title}</h4>
                {subtitle && <p className="text-[10px] text-[#A0856C] mt-0.5">{subtitle}</p>}
            </div>
        </div>
        <div className="px-5 py-4">{children}</div>
    </div>
);

const StyledSelect = ({ value, onChange, options, icon }: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    icon: React.ReactNode;
}) => (
    <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6050] pointer-events-none">{icon}</div>
        <select
            value={value}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
            className="appearance-none text-[#E9DCCF] text-xs rounded-xl pl-8 pr-8 py-2.5 outline-none cursor-pointer transition-all"
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(200,168,130,0.2)" }}
        >
            {options.map((o: any) => (
                <option key={o.value} value={o.value} style={{ background: PALETTE.mahogany }}>{o.label}</option>
            ))}
        </select>
        <FaAngleDown size={9} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6050]" />
    </div>
);

const PagBtn = ({ label, onClick, active = false, disabled = false }: any) => (
    <button onClick={onClick} disabled={disabled}
        className="w-8 h-8 rounded-lg text-[11px] font-bold transition-all"
        style={active
            ? { background: PALETTE.mahogany, color: PALETTE.caramel, boxShadow: "0 2px 8px rgba(44,24,16,0.25)" }
            : disabled
                ? { color: "#D4C5BB", cursor: "not-allowed" }
                : { color: PALETTE.sienna, background: "transparent" }
        }
    >
        {label}
    </button>
);

export default AdminOrders;