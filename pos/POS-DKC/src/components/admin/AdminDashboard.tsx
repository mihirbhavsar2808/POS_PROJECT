import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area } from "recharts";
import { useEffect, useMemo, useState } from "react";
import { getAdminDashboard } from "../../api/apiServices";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import { FaAngleDown } from "react-icons/fa";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const COLORS = ["#5C4033", "#8B6F5E", "#C8A882", "#E9DCCF", "#A0856C"];
const filterByTime = (orders: any[], filter: string) => {
  const now = new Date();

  // ✅ normalize today (remove time)
  now.setHours(0, 0, 0, 0);

  return orders.filter((o) => {
    const d = new Date(o.createdAt);
    d.setHours(0, 0, 0, 0); // ✅ normalize order date

    if (filter === "week") {
      const start = new Date(now);
      start.setDate(now.getDate() - 6); // last 7 days
      return d >= start && d <= now;
    }

    if (filter === "2weeks") {
      const start = new Date(now);
      start.setDate(now.getDate() - 13); // last 14 days
      return d >= start && d <= now;
    }

    if (filter === "month") {
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    }

    if (filter === "year") {
      return d.getFullYear() === now.getFullYear();
    }

    return true;
  });
};

const formatNumber = (value: number) => {
  return Number(value).toLocaleString("en-IN");
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-[#E9DCCF] rounded-xl px-4 py-3 shadow-lg text-sm text-[#5C4033]">
      <div className="font-bold mb-1 text-[#3D2314]">{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} className="text-[#8B6F5E]">
          {p.name}:{" "}
          <strong className="text-[#5C4033]">
            {p.name === "revenue"
              ? `₹${formatNumber(p.value)}`
              : formatNumber(p.value)}
          </strong>
        </div>
      ))}
    </div>
  );
};


const AdminDashboard = () => {
  const [data, setData] = useState<any>(null);
  const [selectedUser, setSelectedUser] = useState("all");
  const [timeFilter, setTimeFilter] = useState("month");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    getAdminDashboard().then(setData);
  }, []);

  const orders = data?.orders || [];
  const users = data?.userStats || [];

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (selectedUser !== "all") {
      result = result.filter((o: any) => {
        const id = typeof o.userId === "string" ? o.userId : o.userId?._id;
        return String(id) === String(selectedUser);
      });
    }
    return filterByTime(result, timeFilter);
  }, [orders, selectedUser, timeFilter]);

  /* TOTALS */
  const totalRevenue = filteredOrders.reduce(
    (a: number, b: any) => a + (b.totalAmount || 0), 0
  );

  // const chartData = useMemo(() => {
  //   if (timeFilter === "year") {
  //     const monthly = Array(12).fill(0);
  //     filteredOrders.forEach((o: any) => { monthly[new Date(o.createdAt).getMonth()] += o.totalAmount || 0; });
  //     return monthly.map((v, i) => ({ name: months[i], revenue: v, orders: Math.round(v / 2) }));
  //   }
  //   if (timeFilter === "week" || timeFilter === "2weeks") {
  //     const map: any = {};

  //     filteredOrders.forEach((o: any) => {
  //       const date = new Date(o.createdAt);
  //       const key = date.toISOString().split("T")[0]; // YYYY-MM-DD

  //       map[key] = (map[key] || 0) + (o.totalAmount || 0);
  //     });

  //     return Object.entries(map)
  //       .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()) // ✅ SORT
  //       .map(([k, v]) => ({
  //         name: k,
  //         revenue: v,
  //         orders: Math.round((v as number) / 2),
  //       }));
  //   }
  //   const monthly = Array(12).fill(0);
  //   filteredOrders.forEach((o: any) => { monthly[new Date(o.createdAt).getMonth()] += o.totalAmount || 0; });
  //   return monthly.map((v, i) => ({ name: months[i], revenue: v, orders: Math.round(v / 2) }));
  // }, [filteredOrders, timeFilter]);

  const chartData = useMemo(() => {
  if (timeFilter === "week" || timeFilter === "2weeks") {
    
    const days = timeFilter === "week" ? 7 : 14;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // ✅ Step 1: create full date range
    const dateArray: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      const key = d.toISOString().split("T")[0];
      dateArray.push(key);
    }

    // ✅ Step 2: map actual data
    const dataMap: any = {};

    filteredOrders.forEach((o: any) => {
      const d = new Date(o.createdAt);
      d.setHours(0, 0, 0, 0);

      const key = d.toISOString().split("T")[0];

      if (!dataMap[key]) {
        dataMap[key] = 0;
      }

      dataMap[key] += o.totalAmount || 0;
    });

    // ✅ Step 3: fill missing dates with 0
    return dateArray.map((date) => ({
      name: new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      }),
      revenue: dataMap[date] || 0,
      orders: Math.round((dataMap[date] || 0) / 2),
    }));
  }

  // existing month/year logic
  if (timeFilter === "year") {
    const monthly = Array(12).fill(0);
    filteredOrders.forEach((o: any) => {
      monthly[new Date(o.createdAt).getMonth()] += o.totalAmount || 0;
    });

    return monthly.map((v, i) => ({
      name: months[i],
      revenue: v,
      orders: Math.round(v / 2),
    }));
  }

  // month
  const monthly = Array(12).fill(0);
  filteredOrders.forEach((o: any) => {
    monthly[new Date(o.createdAt).getMonth()] += o.totalAmount || 0;
  });

  return monthly.map((v, i) => ({
    name: months[i],
    revenue: v,
    orders: Math.round(v / 2),
  }));

}, [filteredOrders, timeFilter]);

  const statusData = useMemo(() => {
    const map: any = {};
    filteredOrders.forEach((o: any) => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [filteredOrders]);

  const topProducts = useMemo(() => {
    const map: any = {};
    filteredOrders.forEach((o: any) => {
      o.cartItems?.forEach((item: any) => {
        if (!map[item.title]) map[item.title] = 0;
        map[item.title] += item.quantity;
      });
    });
    return Object.entries(map)
      .map(([title, qty]) => ({ title, qty }))
      .sort((a: any, b: any) => b.qty - a.qty)
      .slice(0, 5);
  }, [filteredOrders]);

  if (!data) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#FAF6F1] gap-4">
      <div className="w-11 h-11 rounded-full border-[3px] border-[#E9DCCF] border-t-[#8B6F5E] animate-spin" />
      <span className="text-[#8B6F5E] text-sm tracking-widest">Loading dashboard…</span>
    </div>
  );

  const axProps = { fontSize: 11, fill: "#A0856C" };

  return (
    <div className="flex min-h-screen bg-[#FAF6F1]">
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
        <AdminHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 px-7 py-7 overflow-y-auto flex flex-col gap-5">
          <div className="flex justify-between items-center bg-white rounded-2xl px-6 py-4 shadow-sm border border-[#EFE8DF]">
            <div>
              <h2 className="text-[19px] font-bold text-[#3D2314] tracking-tight">Dashboard Overview</h2>
              <p className="text-xs text-[#A0856C] mt-0.5">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="border-[1.5px] border-[#E9DCCF] rounded-xl px-3.5 py-2 text-sm text-[#5C4033] bg-[#FAF6F1] cursor-pointer outline-none"
              >
                <option value="all">All Users</option>
                {users.map((u: any) => (
                  <option key={u.userId} value={u.userId}>{u.name}</option>
                ))}
              </select> */}
              <div className="flex items-center gap-4">

                {/* USER SELECT */}
                <div className="relative">
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="
        appearance-none
        bg-[#3D2314]
        text-[#E9DCCF]
        border border-[#C8A882]/30
        rounded-xl

        pl-5 pr-12 py-3.5   /* ✅ PERFECT BALANCE */

        text-sm
        shadow-sm
        outline-none
        cursor-pointer
        transition-all duration-200

        hover:bg-[#4b2e1d]
        focus:ring-2 focus:ring-[#C8A882]/40
      "
                  >
                    <option value="all">All Users</option>
                    {users.map((u: any) => (
                      <option key={u.userId} value={u.userId}>
                        {u.name}
                      </option>
                    ))}
                  </select>

                  {/* Custom Arrow */}
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#C8A882] text-xs">
                    <FaAngleDown />
                  </span>
                </div>

                {/* TIME FILTER */}
                <div className="relative">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="
        appearance-none
        bg-[#3D2314]
        text-[#E9DCCF]
        border border-[#C8A882]/30
        rounded-xl

        pl-5 pr-7 py-3.5   /* ✅ SAME SPACING */

        text-sm
        shadow-sm
        outline-none
        cursor-pointer
        transition-all duration-200

        hover:bg-[#4b2e1d]
        focus:ring-2 focus:ring-[#C8A882]/40
      "
                  >
                    <option value="week">This Week</option>
                    <option value="2weeks">Last 2 Weeks</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#C8A882] text-xs">
                    <FaAngleDown />
                  </span>
                </div>

              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C8A882] to-[#8B6F5E] flex items-center justify-center text-white font-bold text-sm cursor-pointer">
                A
              </div>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-3 gap-5">
            <StatCard
              label="Total Revenue"
              value={`₹${Number(totalRevenue).toLocaleString("en-IN")}`}
              gradient="from-[#5C4033] to-[#3D2314]"
              sub={`↑ ${timeFilter} range`}
            />
            <StatCard
              label="Total Orders"
              value={filteredOrders.length}
              gradient="from-[#8B6F5E] to-[#5C4033]"
              sub="Across selected range"
            />
            <StatCard
              label="Total Users"
              value={users.length}
              gradient="from-[#C8A882] to-[#8B6F5E]"
              sub="Registered accounts"
            />
          </div>

          {/* ── AREA CHART ── */}
          <Box title="Revenue Growth">
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B6F5E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8B6F5E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#F0E8DF" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="name" tick={axProps} axisLine={false} tickLine={false} />
                <YAxis
                  width={80}   // 👈 FIX: prevents cut-off
                  tickFormatter={(value) => formatNumber(value)}  // 👈 comma format
                  tick={axProps}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="revenue" name="revenue"
                  stroke="#8B6F5E" strokeWidth={2.5} fill="url(#revGrad)"
                  dot={false} activeDot={{ r: 5, fill: "#5C4033", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>

          {/* ── LINE + PIE ── */}
          <div className="grid grid-cols-2 gap-5">

            <Box title="Orders Overview">
              {/* <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="#F0E8DF" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" tick={axProps} axisLine={false} tickLine={false} />
                  <YAxis tick={axProps} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    dataKey="orders" name="orders"
                    stroke="#C8A882" strokeWidth={2.5}
                    dot={false} activeDot={{ r: 5, fill: "#8B6F5E", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer> */}
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 20, left: 20, bottom: 0 }}  // ✅ spacing fix
                >
                  <CartesianGrid stroke="#F0E8DF" strokeDasharray="4 4" vertical={false} />

                  <XAxis
                    dataKey="name"
                    tick={axProps}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    width={80}  // ✅ FIX overflow
                    tickFormatter={(value) => Number(value).toLocaleString("en-IN")} // ✅ comma
                    tick={axProps}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Line
                    dataKey="orders"
                    name="orders"
                    stroke="#C8A882"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#8B6F5E", stroke: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>

            <Box title="Order Status">
              <div className="flex items-center gap-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData} dataKey="value"
                      outerRadius={78} innerRadius={44}
                      paddingAngle={3}
                    >
                      {statusData.map((_: any, i: number) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1">
                  {statusData.map((s: any, i: number) => (
                    <div
                      key={s.name}
                      className="flex items-center gap-2 text-sm text-[#5C4033] py-[7px] border-b border-[#F5F0EB]"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: COLORS[i % COLORS.length] }}
                      />
                      <span className="flex-1">{s.name}</span>
                      <span className="font-bold text-[#3D2314]">{s.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Box>

          </div>

          {/* ── BAR + TOP PRODUCTS ── */}
          <div className="grid grid-cols-2 gap-5">

            <Box title="Performance">
              {/* <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }} barSize={13}>
                  <CartesianGrid stroke="#F0E8DF" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" tick={axProps} axisLine={false} tickLine={false} />
                  <YAxis tick={axProps} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="revenue" radius={[6, 6, 0, 0]}>
                    {chartData.map((_: any, i: number) => (
                      <Cell key={i} fill={i % 2 === 0 ? "#8B6F5E" : "#C8A882"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer> */}
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={chartData}
                  margin={{ top: 5, right: 15, left: 15, bottom: 0 }}
                  barSize={13}
                >
                  <CartesianGrid stroke="#F0E8DF" strokeDasharray="4 4" vertical={false} />

                  <XAxis
                    dataKey="name"
                    tick={axProps}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    width={80}
                    tickFormatter={(value) => Number(value).toLocaleString("en-IN")}
                    tick={axProps}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomTooltip />} />

                  <Bar dataKey="revenue" name="revenue" radius={[6, 6, 0, 0]}>
                    {chartData.map((_: any, i: number) => (
                      <Cell key={i} fill={i % 2 === 0 ? "#8B6F5E" : "#C8A882"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            <Box title="Top Products">
              {topProducts.length === 0 && (
                <div className="text-[#A0856C] text-sm text-center mt-10">
                  No product data for selected range.
                </div>
              )}
              {topProducts.map((p: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3 border-b border-[#F5F0EB] last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        background: `${COLORS[i % COLORS.length]}22`,
                        color: COLORS[i % COLORS.length],
                      }}
                    >
                      {i + 1}
                    </div>
                    <span className="text-sm text-[#3D2314] font-medium">{p.title}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="w-14 h-[5px] rounded bg-[#F0E8DF] overflow-hidden">
                      <div
                        className="h-full rounded"
                        style={{
                          width: `${(p.qty / (topProducts[0] as any).qty) * 100}%`,
                          background: COLORS[i % COLORS.length],
                        }}
                      />
                    </div>
                    <span
                      className="rounded-full px-3 py-0.5 text-xs font-bold bg-[#F5EDE3] text-[#8B6F5E]"
                    >
                      ×{p.qty}
                    </span>
                  </div>
                </div>
              ))}
            </Box>

          </div>
        </main>
      </div>
    </div>
  );
};

/* ── UI HELPERS ── */
const StatCard = ({ label, value, gradient, sub }: any) => (
  <div className={`relative overflow-hidden rounded-[18px] p-6 bg-gradient-to-br ${gradient} shadow-[0_8px_28px_rgba(61,35,20,0.18)]`}>
    {/* Decorative circles */}
    <div className="absolute -right-4 -top-4 w-[90px] h-[90px] rounded-full bg-white/[0.07]" />
    <div className="absolute right-6 -bottom-6 w-[60px] h-[60px] rounded-full bg-white/[0.05]" />
    <p className="text-[11px] text-white/65 tracking-widest uppercase">{label}</p>
    <h2 className="text-[28px] font-extrabold text-white mt-2 tracking-tight">{value}</h2>
    <p className="mt-2.5 text-[11px] text-white/45">{sub}</p>
  </div>
);

const Box = ({ title, children }: any) => (
  <div className="bg-white rounded-[18px] p-6 shadow-[0_2px_16px_rgba(92,64,51,0.06)] border border-[#EFE8DF]">
    <div className="flex items-center gap-2 text-sm font-bold text-[#3D2314] mb-4 tracking-tight">
      <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-br from-[#C8A882] to-[#8B6F5E]" />
      {title}
    </div>
    {children}
  </div>
);

export default AdminDashboard;