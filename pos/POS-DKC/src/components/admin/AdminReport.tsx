import { useEffect, useMemo, useState } from "react";
import { getAdminDashboard } from "../../api/apiServices";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import {
  FaAngleDown, FaDownload, FaFilePdf, FaFileExcel, FaFileCsv,
  FaArrowUp, FaArrowDown, FaChartLine, FaBoxOpen, FaUsers, FaClipboardList,
  FaFire, FaGem, FaStar
} from "react-icons/fa";

/* ═══════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════ */
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const PALETTE = ["#C8965A","#8B6F5E","#5C4033","#A0856C","#E9DCCF"];
const STATUS_STYLE: Record<string, { dot: string; badge: string; text: string }> = {
  Delivered:  { dot: "#22c55e", badge: "rgba(34,197,94,0.12)",   text: "#16a34a" },
  Pending:    { dot: "#f59e0b", badge: "rgba(245,158,11,0.12)",  text: "#d97706" },
  Cancelled:  { dot: "#ef4444", badge: "rgba(239,68,68,0.12)",   text: "#dc2626" },
  Processing: { dot: "#3b82f6", badge: "rgba(59,130,246,0.12)",  text: "#2563eb" },
};

const filterByTime = (orders: any[], filter: string) => {
  const now = new Date();
  return orders.filter((o) => {
    const d = new Date(o.createdAt);
    if (filter === "week")   { const w = new Date(); w.setDate(now.getDate()-7);  return d >= w; }
    if (filter === "2weeks") { const w = new Date(); w.setDate(now.getDate()-14); return d >= w; }
    if (filter === "month")  return d.getMonth()===now.getMonth() && d.getFullYear()===now.getFullYear();
    if (filter === "year")   return d.getFullYear()===now.getFullYear();
    return true;
  });
};

const fmt = (v: number) => Number(v).toLocaleString("en-IN");

/* ═══════════════════════════════════════
   COMPONENT
═══════════════════════════════════════ */
const AdminReport = () => {
  const [data,         setData        ] = useState<any>(null);
  const [timeFilter,   setTimeFilter  ] = useState("month");
  const [selectedUser, setSelectedUser] = useState("all");
  const [activeTab,    setActiveTab   ] = useState<"sales"|"products"|"users"|"orders">("sales");
  const [sidebarOpen,  setSidebarOpen ] = useState(false);
  const [exportOpen,   setExportOpen  ] = useState(false);
  const [animKey,      setAnimKey     ] = useState(0);

  useEffect(() => { getAdminDashboard().then(setData); }, []);
  useEffect(() => { setAnimKey(k => k + 1); }, [activeTab, timeFilter, selectedUser]);

  const orders = data?.orders || [];
  const users  = data?.userStats || [];

  /* ── Apply user filter first, then time filter ── */
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

  /* ── KPIs ── */
  const totalRevenue    = filteredOrders.reduce((a: number, b: any) => a + (b.totalAmount || 0), 0);
  const totalOrders     = filteredOrders.length;
  const avgOrderValue   = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const deliveredOrders = filteredOrders.filter((o: any) => o.status === "Delivered").length;
  const cancelledOrders = filteredOrders.filter((o: any) => o.status === "Cancelled").length;
  const pendingOrders   = filteredOrders.filter((o: any) => o.status === "Pending").length;
  const deliveryRate    = totalOrders ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  /* ── Monthly breakdown ── */
  const monthlyData = useMemo(() => {
    const rev = Array(12).fill(0), cnt = Array(12).fill(0), can = Array(12).fill(0);
    filteredOrders.forEach((o: any) => {
      const m = new Date(o.createdAt).getMonth();
      rev[m] += o.totalAmount || 0;
      cnt[m] += 1;
      if (o.status === "Cancelled") can[m] += 1;
    });
    return months.map((name, i) => ({ name, revenue: rev[i], orders: cnt[i], cancelled: can[i] }));
  }, [filteredOrders]);

  /* ── Top products ── */
  const topProducts = useMemo(() => {
    const map: any = {};
    filteredOrders.forEach((o: any) => {
      o.cartItems?.forEach((item: any) => {
        if (!map[item.title]) map[item.title] = { qty: 0, revenue: 0 };
        map[item.title].qty     += item.quantity;
        map[item.title].revenue += (item.price || 0) * item.quantity;
      });
    });
    return Object.entries(map)
      .map(([title, v]: any) => ({ title, ...v }))
      .sort((a: any, b: any) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredOrders]);

  /* ── User activity ── */
  const userActivity = useMemo(() => {
    const map: any = {};
    filteredOrders.forEach((o: any) => {
      const uid   = typeof o.userId === "string" ? o.userId : o.userId?._id;
      const uObj  = users.find((u: any) => String(u.userId) === String(uid));
      const name  = uObj?.name  || "Unknown";
      const email = uObj?.email || "";
      if (!map[uid]) map[uid] = { name, email, orders: 0, revenue: 0, products: {} };
      map[uid].orders  += 1;
      map[uid].revenue += o.totalAmount || 0;
      o.cartItems?.forEach((item: any) => {
        if (!map[uid].products[item.title]) map[uid].products[item.title] = 0;
        map[uid].products[item.title] += item.quantity;
      });
    });
    return Object.values(map).sort((a: any, b: any) => b.revenue - a.revenue);
  }, [filteredOrders, users]);

  /* ── Status counts ── */
  const statusMap = useMemo(() => {
    const map: any = {};
    filteredOrders.forEach((o: any) => { map[o.status] = (map[o.status] || 0) + 1; });
    return map;
  }, [filteredOrders]);

  const maxMonthRevenue = Math.max(...monthlyData.map(m => m.revenue), 1);

  /* ── Selected user label ── */
  const selectedUserName = selectedUser === "all"
    ? null
    : users.find((u: any) => String(u.userId) === String(selectedUser))?.name || "User";

  /* ── Shared select style — matches AdminDashboard ── */
  const selectStyle: React.CSSProperties = {
    appearance:"none",
    background:"#3D2314",
    color:"#E9DCCF",
    border:"1px solid rgba(200,162,130,0.3)",
    borderRadius:12,
    paddingTop:10, paddingBottom:10, paddingLeft:16, paddingRight:40,
    fontSize:13,
    fontWeight:600,
    outline:"none",
    cursor:"pointer",
    fontFamily:"inherit",
    letterSpacing:"0.02em",
    boxShadow:"0 2px 8px rgba(61,35,20,0.12)",
    transition:"background 0.2s",
  };

  if (!data) return (
    <div style={{
      height:"100vh", display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center",
      background:"linear-gradient(135deg,#1a0f0a 0%,#2d1810 50%,#1a0f0a 100%)", gap:20
    }}>
      <div style={{ width:56, height:56, borderRadius:"50%", border:"3px solid rgba(200,150,90,0.15)", borderTop:"3px solid #C8965A", animation:"spin 0.9s linear infinite" }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ color:"#C8965A", fontSize:13, letterSpacing:"0.2em", fontFamily:"'DM Mono',monospace" }}>LOADING REPORTS</span>
    </div>
  );

  const TABS = [
    { id:"sales",    label:"Sales",     icon:<FaChartLine/>     },
    { id:"products", label:"Products",  icon:<FaBoxOpen/>       },
    { id:"users",    label:"Customers", icon:<FaUsers/>         },
    { id:"orders",   label:"Orders",    icon:<FaClipboardList/> },
  ] as const;

  const kpis = [
    { label:"Total Revenue",   value:`₹${fmt(totalRevenue)}`, sub:`${totalOrders} transactions`,  icon:"₹", grad:"linear-gradient(135deg,#5C4033,#3D2314)"  },
    { label:"Total Orders",    value:fmt(totalOrders),         sub:"Across all statuses",          icon:"#", grad:"linear-gradient(135deg,#8B6F5E,#5C4033)"  },
    { label:"Avg Order Value", value:`₹${fmt(avgOrderValue)}`, sub:"Per transaction",              icon:"~", grad:"linear-gradient(135deg,#C8A882,#8B6F5E)"  },
    { label:"Delivery Rate",   value:`${deliveryRate}%`,       sub:`${deliveredOrders} delivered`, icon:"%", grad:"linear-gradient(135deg,#A0856C,#5C4033)"  },
  ];

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#FAF6F1", fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@400;500&display=swap');
        @keyframes spin    { to { transform:rotate(360deg) } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        .row-hover:hover   { background:rgba(200,150,90,0.04)!important; transition:background 0.2s; }
        .tab-btn           { transition:all 0.25s cubic-bezier(.4,0,.2,1); }
        .kpi-card          { transition:transform 0.2s, box-shadow 0.2s; }
        .kpi-card:hover    { transform:translateY(-3px); box-shadow:0 20px 48px rgba(61,35,20,0.22)!important; }
        .export-item:hover { background:rgba(200,150,90,0.06)!important; }
        select:hover       { background:#4b2e1d!important; }
        select:focus       { outline:none; box-shadow:0 0 0 2px rgba(200,162,130,0.4); }
      `}</style>

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div style={{ flex:1, display:"flex", flexDirection:"column", transition:"margin 0.3s", marginLeft:sidebarOpen?"240px":"0" }}>
        <AdminHeader sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main style={{ flex:1, padding:"28px 32px", overflowY:"auto", display:"flex", flexDirection:"column", gap:24 }}>

          {/* ══════ TOP BAR ══════ */}
          <div style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            background:"#fff", borderRadius:20, padding:"18px 28px",
            boxShadow:"0 2px 16px rgba(92,64,51,0.06)", border:"1px solid #EFE8DF"
          }}>
            {/* Left: Title */}
            <div>
              <h2 style={{ margin:0, fontSize:19, fontWeight:700, color:"#3D2314", letterSpacing:"-0.3px" }}>
                Reports
              </h2>
              <p style={{ margin:"3px 0 0", fontSize:12, color:"#A0856C" }}>
                {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
                {selectedUserName && (
                  <span style={{ marginLeft:10, background:"rgba(200,150,90,0.14)", color:"#8B6F5E", padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700 }}>
                    · {selectedUserName}
                  </span>
                )}
              </p>
            </div>

            {/* Right: Controls */}
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>

              {/* ── User Filter ── */}
              <div style={{ position:"relative" }}>
                <select value={selectedUser} onChange={e=>setSelectedUser(e.target.value)} style={selectStyle}>
                  <option value="all">All Users</option>
                  {users.map((u: any) => (
                    <option key={u.userId} value={u.userId}>{u.name}</option>
                  ))}
                </select>
                <span style={{ pointerEvents:"none", position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"#C8A882", fontSize:11 }}>
                  <FaAngleDown />
                </span>
              </div>

              {/* ── Time Filter ── */}
              <div style={{ position:"relative" }}>
                <select value={timeFilter} onChange={e=>setTimeFilter(e.target.value)} style={selectStyle}>
                  <option value="week">This Week</option>
                  <option value="2weeks">Last 2 Weeks</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
                <span style={{ pointerEvents:"none", position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", color:"#C8A882", fontSize:11 }}>
                  <FaAngleDown />
                </span>
              </div>

              {/* ── Export ── */}
              <div style={{ position:"relative" }}>
                <button onClick={()=>setExportOpen(!exportOpen)} style={{
                  display:"flex", alignItems:"center", gap:8,
                  background:"#3D2314", color:"#E9DCCF",
                  border:"1px solid rgba(200,162,130,0.3)", borderRadius:12,
                  padding:"10px 16px", fontSize:13, fontWeight:600,
                  cursor:"pointer", fontFamily:"inherit", letterSpacing:"0.02em",
                  boxShadow:"0 2px 8px rgba(61,35,20,0.12)"
                }}>
                  <FaDownload style={{ color:"#C8A882", fontSize:12 }}/>
                  Export
                  <FaAngleDown style={{ color:"#C8A882", fontSize:11 }}/>
                </button>
                {exportOpen && (
                  <div style={{
                    position:"absolute", right:0, top:"calc(100% + 8px)",
                    background:"#fff", border:"1px solid #EFE8DF", borderRadius:16,
                    boxShadow:"0 16px 48px rgba(61,35,20,0.14)", zIndex:50, overflow:"hidden", minWidth:180
                  }}>
                    {[
                      { label:"PDF",   icon:<FaFilePdf   style={{color:"#C44B2B"}}/>, f:"pdf"  },
                      { label:"Excel", icon:<FaFileExcel style={{color:"#217346"}}/>, f:"xlsx" },
                      { label:"CSV",   icon:<FaFileCsv   style={{color:"#5C4033"}}/>, f:"csv"  },
                    ].map(item=>(
                      <button key={item.f} className="export-item"
                        onClick={()=>{console.log("export",item.f);setExportOpen(false);}}
                        style={{
                          width:"100%", display:"flex", alignItems:"center", gap:12,
                          padding:"13px 18px", fontSize:13, color:"#3D2314",
                          background:"transparent", border:"none",
                          borderBottom:"1px solid #F5EDE3", cursor:"pointer",
                          fontFamily:"inherit", fontWeight:500
                        }}>
                        {item.icon} Export as {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Avatar */}
              <div style={{
                width:40, height:40, borderRadius:"50%",
                background:"linear-gradient(135deg,#C8A882,#8B6F5E)",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontWeight:700, fontSize:14, cursor:"pointer"
              }}>A</div>
            </div>
          </div>

          {/* ══════ KPI CARDS ══════ */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20 }}>
            {kpis.slice(0,3).map(({ label, value, sub, grad }, i) => (
              <div key={label} className="kpi-card" style={{
                position:"relative", overflow:"hidden", borderRadius:18, padding:"22px 24px",
                background:grad, boxShadow:"0 8px 28px rgba(61,35,20,0.18)",
                animation:`fadeUp 0.5s ease ${i*0.08}s both`
              }}>
                <div style={{ position:"absolute", right:-16, top:-16, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
                <div style={{ position:"absolute", right:24, bottom:20, width:40, height:40, borderRadius:99, background:"rgba(255,255,255,0.08)" }}/>
                <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.65)", letterSpacing:"0.15em", textTransform:"uppercase" }}>{label}</p>
                <h2 style={{ margin:"8px 0 0", fontSize:28, fontWeight:800, color:"#fff", letterSpacing:"-0.5px" }}>{value}</h2>
                <p style={{ margin:"6px 0 0", fontSize:11, color:"rgba(255,255,255,0.45)" }}>{sub}</p>
              </div>
            ))}
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:20, marginTop:-8 }}>
            {/* 4th KPI + 2 delivery stats */}
            <div className="kpi-card" style={{
              position:"relative", overflow:"hidden", borderRadius:18, padding:"22px 24px",
              background:kpis[3].grad, boxShadow:"0 8px 28px rgba(61,35,20,0.18)",
              animation:"fadeUp 0.5s ease 0.24s both"
            }}>
              <div style={{ position:"absolute", right:-16, top:-16, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
              <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.65)", letterSpacing:"0.15em", textTransform:"uppercase" }}>{kpis[3].label}</p>
              <h2 style={{ margin:"8px 0 0", fontSize:28, fontWeight:800, color:"#fff", letterSpacing:"-0.5px" }}>{kpis[3].value}</h2>
              <p style={{ margin:"6px 0 0", fontSize:11, color:"rgba(255,255,255,0.45)" }}>{kpis[3].sub}</p>
            </div>
            {[
              { label:"Total Users",   value:fmt(users.length),   sub:"Registered accounts", grad:"linear-gradient(135deg,#8B6F5E,#5C4033)" },
              { label:"Total Orders",  value:fmt(totalOrders),    sub:"In selected period",  grad:"linear-gradient(135deg,#C8A882,#8B6F5E)" },
            ].map(({ label, value, sub, grad }, i) => (
              <div key={label} className="kpi-card" style={{
                position:"relative", overflow:"hidden", borderRadius:18, padding:"22px 24px",
                background:grad, boxShadow:"0 8px 28px rgba(61,35,20,0.18)",
                animation:`fadeUp 0.5s ease ${(i+4)*0.08}s both`
              }}>
                <div style={{ position:"absolute", right:-16, top:-16, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
                <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.65)", letterSpacing:"0.15em", textTransform:"uppercase" }}>{label}</p>
                <h2 style={{ margin:"8px 0 0", fontSize:28, fontWeight:800, color:"#fff", letterSpacing:"-0.5px" }}>{value}</h2>
                <p style={{ margin:"6px 0 0", fontSize:11, color:"rgba(255,255,255,0.45)" }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* ══════ TABS ══════ */}
          <div style={{ display:"flex", alignItems:"center", gap:4, background:"#fff", borderRadius:16, padding:6, width:"fit-content", boxShadow:"0 2px 16px rgba(92,64,51,0.06)", border:"1px solid #EFE8DF" }}>
            {TABS.map(tab=>(
              <button key={tab.id} className="tab-btn" onClick={()=>setActiveTab(tab.id)}
                style={{
                  display:"flex", alignItems:"center", gap:8,
                  padding:"10px 20px", borderRadius:12, border:"none",
                  fontSize:13, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
                  background: activeTab===tab.id ? "#3D2314" : "transparent",
                  color: activeTab===tab.id ? "#E9DCCF" : "#A0856C",
                  boxShadow: activeTab===tab.id ? "0 4px 14px rgba(61,35,20,0.22)" : "none",
                  letterSpacing:"0.02em"
                }}>
                <span style={{ fontSize:11 }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* ══════════════════════════
              SALES TAB
          ══════════════════════════ */}
          {activeTab==="sales" && (
            <div key={`sales-${animKey}`} style={{ display:"flex", flexDirection:"column", gap:20, animation:"fadeUp 0.4s ease both" }}>

              {/* Mini stats */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12 }}>
                {[
                  { label:"Revenue",   value:`₹${fmt(totalRevenue)}`, icon:<FaGem/>,           color:"#C8965A" },
                  { label:"Orders",    value:fmt(totalOrders),         icon:<FaClipboardList/>, color:"#8B6F5E" },
                  { label:"Delivered", value:fmt(deliveredOrders),     icon:<FaStar/>,          color:"#22c55e" },
                  { label:"Pending",   value:fmt(pendingOrders),       icon:<FaFire/>,          color:"#f59e0b" },
                  { label:"Cancelled", value:fmt(cancelledOrders),     icon:<FaArrowDown/>,     color:"#ef4444" },
                ].map(({ label, value, icon, color })=>(
                  <div key={label} style={{ background:"#fff", borderRadius:16, padding:"16px 18px", border:"1px solid #EFE8DF", boxShadow:"0 2px 12px rgba(92,64,51,0.05)" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                      <p style={{ margin:0, fontSize:10, color:"#A0856C", letterSpacing:"0.12em", textTransform:"uppercase", fontWeight:700 }}>{label}</p>
                      <span style={{ fontSize:11, color, opacity:0.8 }}>{icon}</span>
                    </div>
                    <p style={{ margin:0, fontSize:20, fontWeight:800, color:"#3D2314" }}>{value}</p>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <Panel title="Monthly Revenue Overview" sub="Bar height = revenue">
                <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:180, padding:"0 4px" }}>
                  {monthlyData.map((row, i) => {
                    const h = row.revenue > 0 ? Math.max((row.revenue / maxMonthRevenue) * 160, 8) : 4;
                    return (
                      <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                        <div style={{ position:"relative", display:"flex", alignItems:"flex-end", height:160 }}>
                          <div title={row.revenue > 0 ? `₹${fmt(row.revenue)}` : "No data"} style={{
                            width:"100%", minWidth:20, borderRadius:"6px 6px 0 0", height:h,
                            background: row.revenue > 0 ? (i%2===0?"#8B6F5E":"#C8A882") : "#EDE4D8",
                            transition:"height 0.6s cubic-bezier(.4,0,.2,1)",
                            position:"relative", overflow:"hidden", cursor:"default"
                          }}>
                            {row.revenue > 0 && <div style={{ position:"absolute", top:0, left:0, right:0, height:"30%", background:"rgba(255,255,255,0.15)", borderRadius:"6px 6px 0 0" }}/>}
                          </div>
                        </div>
                        <span style={{ fontSize:9, color:"#A0856C", fontWeight:700, letterSpacing:"0.05em", fontFamily:"'DM Mono',monospace" }}>{row.name}</span>
                      </div>
                    );
                  })}
                </div>
              </Panel>

              {/* Monthly table */}
              <Panel title="Monthly Sales Breakdown" sub="Full breakdown by month">
                <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                  <thead><THead cols={["Month","Orders","Revenue","Cancelled","Avg Value","vs Prev"]}/></thead>
                  <tbody>
                    {monthlyData.map((row, i) => {
                      const prev    = monthlyData[i-1];
                      const diff    = prev ? row.revenue - prev.revenue : 0;
                      const hasData = row.orders > 0;
                      return (
                        <tr key={i} className="row-hover" style={{ borderBottom:"1px solid #F5EDE3", opacity:hasData?1:0.4 }}>
                          <td style={{ padding:"13px 16px 13px 0", fontWeight:700, color:"#3D2314" }}>{row.name}</td>
                          <td style={{ padding:"13px 16px 13px 0", color:"#5C4033" }}>{row.orders}</td>
                          <td style={{ padding:"13px 16px 13px 0", fontWeight:700, color:"#3D2314" }}>
                            {row.revenue > 0 ? `₹${fmt(row.revenue)}` : "—"}
                          </td>
                          <td style={{ padding:"13px 16px 13px 0" }}>
                            {row.cancelled > 0
                              ? <StatusPill color="#dc2626" bg="rgba(239,68,68,0.1)">{row.cancelled} cancelled</StatusPill>
                              : <span style={{ color:"#C8A882" }}>—</span>}
                          </td>
                          <td style={{ padding:"13px 16px 13px 0", color:"#8B6F5E" }}>
                            {row.orders ? `₹${fmt(Math.round(row.revenue/row.orders))}` : "—"}
                          </td>
                          <td style={{ padding:"13px 16px 13px 0" }}>
                            {!prev||!hasData
                              ? <span style={{ color:"#C8A882", fontSize:12 }}>—</span>
                              : diff>0
                                ? <span style={{ display:"flex", alignItems:"center", gap:4, color:"#16a34a", fontSize:12, fontWeight:700 }}><FaArrowUp style={{ fontSize:9 }}/>+₹{fmt(diff)}</span>
                                : diff<0
                                  ? <span style={{ display:"flex", alignItems:"center", gap:4, color:"#dc2626", fontSize:12, fontWeight:700 }}><FaArrowDown style={{ fontSize:9 }}/>-₹{fmt(Math.abs(diff))}</span>
                                  : <span style={{ color:"#C8A882", fontSize:12 }}>No change</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop:"2px solid #EFE8DF", background:"#FAF6F1" }}>
                      <td style={{ padding:"14px 16px 14px 0", fontWeight:900, color:"#3D2314" }}>Total</td>
                      <td style={{ padding:"14px 16px 14px 0", fontWeight:800, color:"#3D2314" }}>{totalOrders}</td>
                      <td style={{ padding:"14px 16px 14px 0", fontWeight:900, color:"#3D2314" }}>₹{fmt(totalRevenue)}</td>
                      <td style={{ padding:"14px 16px 14px 0", fontWeight:800, color:"#dc2626" }}>{cancelledOrders}</td>
                      <td style={{ padding:"14px 16px 14px 0", fontWeight:800, color:"#3D2314" }}>₹{fmt(avgOrderValue)}</td>
                      <td style={{ padding:"14px 16px 14px 0", color:"#C8A882", fontSize:12 }}>—</td>
                    </tr>
                  </tfoot>
                </table>
              </Panel>
            </div>
          )}

          {/* ══════════════════════════
              PRODUCT TAB
          ══════════════════════════ */}
          {activeTab==="products" && (
            <div key={`prod-${animKey}`} style={{ animation:"fadeUp 0.4s ease both" }}>
              <Panel title="Product Performance" sub={`Top ${topProducts.length} products by revenue`}>
                {topProducts.length===0
                  ? <Empty label="No product data for selected range."/>
                  : (
                    <>
                      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:24 }}>
                        {topProducts.slice(0,6).map((p: any, i: number)=>{
                          const share = totalRevenue ? Math.round((p.revenue/totalRevenue)*100) : 0;
                          return (
                            <div key={i} style={{ background:"#FAF6F1", borderRadius:14, padding:"14px 16px", border:"1px solid #EFE8DF" }}>
                              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                                <span style={{ display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600, color:"#3D2314", maxWidth:"70%", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                  <span style={{ width:22, height:22, borderRadius:8, flexShrink:0, background:`${PALETTE[i%PALETTE.length]}22`, color:PALETTE[i%PALETTE.length], fontSize:10, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center" }}>{i+1}</span>
                                  {p.title}
                                </span>
                                <span style={{ fontSize:12, fontWeight:800, color:"#3D2314" }}>{share}%</span>
                              </div>
                              <div style={{ height:6, borderRadius:99, background:"#EDE4D8", overflow:"hidden" }}>
                                <div style={{ height:"100%", borderRadius:99, background:`linear-gradient(90deg,${PALETTE[i%PALETTE.length]},${PALETTE[(i+1)%PALETTE.length]})`, width:`${share}%`, transition:"width 0.8s cubic-bezier(.4,0,.2,1)" }}/>
                              </div>
                              <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                                <span style={{ fontSize:11, color:"#A0856C" }}>×{fmt(p.qty)} units</span>
                                <span style={{ fontSize:11, color:"#5C4033", fontWeight:700 }}>₹{fmt(p.revenue)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                        <thead><THead cols={["#","Product","Units Sold","Revenue","Revenue Share"]}/></thead>
                        <tbody>
                          {topProducts.map((p: any, i: number)=>{
                            const share = totalRevenue ? Math.round((p.revenue/totalRevenue)*100) : 0;
                            return (
                              <tr key={i} className="row-hover" style={{ borderBottom:"1px solid #F5EDE3" }}>
                                <td style={{ padding:"12px 16px 12px 0" }}>
                                  <div style={{ width:28, height:28, borderRadius:10, background:`${PALETTE[i%PALETTE.length]}18`, color:PALETTE[i%PALETTE.length], display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:900 }}>{i+1}</div>
                                </td>
                                <td style={{ padding:"12px 16px 12px 0", fontWeight:600, color:"#3D2314", maxWidth:220 }}>
                                  <span style={{ display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.title}</span>
                                </td>
                                <td style={{ padding:"12px 16px 12px 0", color:"#5C4033", fontFamily:"'DM Mono',monospace", fontSize:12 }}>×{fmt(p.qty)}</td>
                                <td style={{ padding:"12px 16px 12px 0", fontWeight:700, color:"#3D2314" }}>₹{fmt(p.revenue)}</td>
                                <td style={{ padding:"12px 16px 12px 0" }}>
                                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                    <div style={{ width:80, height:5, borderRadius:99, background:"#EDE4D8", overflow:"hidden" }}>
                                      <div style={{ height:"100%", borderRadius:99, background:PALETTE[i%PALETTE.length], width:`${share}%` }}/>
                                    </div>
                                    <span style={{ fontSize:11, color:"#A0856C", minWidth:28, fontFamily:"'DM Mono',monospace" }}>{share}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr style={{ borderTop:"2px solid #EFE8DF", background:"#FAF6F1" }}>
                            <td colSpan={2} style={{ padding:"13px 16px 13px 0", fontWeight:900, color:"#3D2314" }}>Total</td>
                            <td style={{ padding:"13px 16px 13px 0", fontWeight:800, color:"#3D2314", fontFamily:"'DM Mono',monospace", fontSize:12 }}>
                              ×{fmt(topProducts.reduce((a: number, p: any)=>a+p.qty, 0))}
                            </td>
                            <td style={{ padding:"13px 16px 13px 0", fontWeight:900, color:"#3D2314" }}>₹{fmt(totalRevenue)}</td>
                            <td style={{ padding:"13px 16px 13px 0", color:"#A0856C", fontSize:11, fontFamily:"'DM Mono',monospace" }}>100%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </>
                  )}
              </Panel>
            </div>
          )}

          {/* ══════════════════════════
              CUSTOMERS TAB
          ══════════════════════════ */}
          {activeTab==="users" && (
            <div key={`users-${animKey}`} style={{ display:"flex", flexDirection:"column", gap:20, animation:"fadeUp 0.4s ease both" }}>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
                {[
                  { label:"Total Users",     value:fmt(users.length),        grad:"linear-gradient(135deg,#5C4033,#3D2314)", icon:"👥" },
                  { label:"Active Buyers",   value:fmt(userActivity.length),  grad:"linear-gradient(135deg,#8B6F5E,#5C4033)", icon:"🛍️" },
                  { label:"Revenue / Buyer", value:userActivity.length?`₹${fmt(Math.round(totalRevenue/userActivity.length))}`:"₹0", grad:"linear-gradient(135deg,#C8A882,#8B6F5E)", icon:"💰" },
                ].map(({ label, value, grad, icon })=>(
                  <div key={label} className="kpi-card" style={{ borderRadius:18, padding:"22px 26px", background:grad, boxShadow:"0 8px 28px rgba(61,35,20,0.18)", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", right:-12, top:-12, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }}/>
                    <div style={{ fontSize:22, marginBottom:10 }}>{icon}</div>
                    <p style={{ margin:0, fontSize:11, color:"rgba(255,255,255,0.65)", letterSpacing:"0.15em", textTransform:"uppercase" }}>{label}</p>
                    <h2 style={{ margin:"6px 0 0", fontSize:26, fontWeight:800, color:"#fff" }}>{value}</h2>
                  </div>
                ))}
              </div>

              <Panel title="Customer Activity" sub="Sorted by total spend">
                {userActivity.length===0
                  ? <Empty label="No customer data for selected range."/>
                  : (
                    <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                      <thead><THead cols={["#","Customer","Orders","Total Spent","Avg Order","Top Product","Contribution"]}/></thead>
                      <tbody>
                        {(userActivity as any[]).map((u: any, i: number)=>{
                          const contrib = totalRevenue ? Math.round((u.revenue/totalRevenue)*100) : 0;
                          const topProd = Object.entries(u.products||{}).sort((a:any,b:any)=>b[1]-a[1])[0];
                          return (
                            <tr key={i} className="row-hover" style={{ borderBottom:"1px solid #F5EDE3" }}>
                              <td style={{ padding:"13px 14px 13px 0", color:"#A0856C", fontWeight:700, fontFamily:"'DM Mono',monospace", fontSize:12 }}>#{i+1}</td>
                              <td style={{ padding:"13px 14px 13px 0" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                                  <div style={{ width:34, height:34, borderRadius:"50%", flexShrink:0, background:PALETTE[i%PALETTE.length], display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:13, boxShadow:`0 4px 12px ${PALETTE[i%PALETTE.length]}50` }}>
                                    {u.name?.[0]?.toUpperCase()||"?"}
                                  </div>
                                  <div>
                                    <p style={{ margin:0, fontWeight:700, color:"#3D2314", fontSize:13 }}>{u.name}</p>
                                    {u.email && <p style={{ margin:0, fontSize:11, color:"#A0856C" }}>{u.email}</p>}
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding:"13px 14px 13px 0" }}>
                                <span style={{ background:"rgba(200,150,90,0.12)", color:"#8B6F5E", borderRadius:8, padding:"3px 10px", fontSize:12, fontWeight:700 }}>{u.orders}</span>
                              </td>
                              <td style={{ padding:"13px 14px 13px 0", fontWeight:800, color:"#3D2314" }}>₹{fmt(u.revenue)}</td>
                              <td style={{ padding:"13px 14px 13px 0", color:"#8B6F5E" }}>₹{fmt(Math.round(u.revenue/u.orders))}</td>
                              <td style={{ padding:"13px 14px 13px 0", maxWidth:140 }}>
                                {topProd
                                  ? <span style={{ fontSize:11, color:"#5C4033", background:"rgba(92,64,51,0.08)", borderRadius:8, padding:"3px 9px", display:"block", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                                      {topProd[0]} <span style={{ color:"#A0856C" }}>×{topProd[1] as number}</span>
                                    </span>
                                  : <span style={{ color:"#C8A882" }}>—</span>}
                              </td>
                              <td style={{ padding:"13px 14px 13px 0" }}>
                                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                  <div style={{ width:72, height:5, borderRadius:99, background:"#EDE4D8", overflow:"hidden" }}>
                                    <div style={{ height:"100%", borderRadius:99, background:PALETTE[i%PALETTE.length], width:`${contrib}%` }}/>
                                  </div>
                                  <span style={{ fontSize:11, color:"#A0856C", minWidth:28, fontFamily:"'DM Mono',monospace" }}>{contrib}%</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                      <tfoot>
                        <tr style={{ borderTop:"2px solid #EFE8DF", background:"#FAF6F1" }}>
                          <td colSpan={2} style={{ padding:"13px 14px 13px 0", fontWeight:900, color:"#3D2314" }}>Total</td>
                          <td style={{ padding:"13px 14px 13px 0", fontWeight:800, color:"#3D2314" }}>{totalOrders}</td>
                          <td style={{ padding:"13px 14px 13px 0", fontWeight:900, color:"#3D2314" }}>₹{fmt(totalRevenue)}</td>
                          <td style={{ padding:"13px 14px 13px 0", fontWeight:800, color:"#3D2314" }}>₹{fmt(avgOrderValue)}</td>
                          <td style={{ padding:"13px 14px 13px 0" }}/>
                          <td style={{ padding:"13px 14px 13px 0", color:"#A0856C", fontSize:11, fontFamily:"'DM Mono',monospace" }}>100%</td>
                        </tr>
                      </tfoot>
                    </table>
                  )}
              </Panel>
            </div>
          )}

          {/* ══════════════════════════
              ORDERS TAB
          ══════════════════════════ */}
          {activeTab==="orders" && (
            <div key={`orders-${animKey}`} style={{ display:"flex", flexDirection:"column", gap:20, animation:"fadeUp 0.4s ease both" }}>

              <div style={{ display:"grid", gridTemplateColumns:`repeat(${Math.min(Object.keys(statusMap).length,4)},1fr)`, gap:14 }}>
                {Object.entries(statusMap).map(([status, count]: any, i)=>{
                  const s   = STATUS_STYLE[status] || { dot:"#A0856C", badge:"rgba(160,133,108,0.12)", text:"#8B6F5E" };
                  const pct = totalOrders ? Math.round((count/totalOrders)*100) : 0;
                  return (
                    <div key={status} style={{ background:"#fff", borderRadius:18, padding:"18px 20px", border:"1px solid #EFE8DF", boxShadow:"0 2px 12px rgba(92,64,51,0.06)" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                        <span style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", background:s.badge, color:s.text, padding:"4px 10px", borderRadius:8 }}>{status}</span>
                        <span style={{ fontSize:11, color:"#A0856C", background:"#FAF6F1", padding:"3px 9px", borderRadius:8, fontWeight:600, fontFamily:"'DM Mono',monospace" }}>{pct}%</span>
                      </div>
                      <p style={{ margin:0, fontSize:28, fontWeight:900, color:"#3D2314" }}>{fmt(count)}</p>
                      <div style={{ marginTop:10, height:4, borderRadius:99, background:"#EDE4D8", overflow:"hidden" }}>
                        <div style={{ height:"100%", borderRadius:99, background:s.dot, width:`${pct}%`, transition:"width 0.8s ease" }}/>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Panel title="All Orders" sub={`${filteredOrders.length} orders in selected period`}>
                {filteredOrders.length===0
                  ? <Empty label="No orders for selected range."/>
                  : (
                    <div style={{ overflowX:"auto" }}>
                      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                        <thead><THead cols={["Order ID","Customer","Items","Amount","Status","Date"]}/></thead>
                        <tbody>
                          {filteredOrders.map((o: any, i: number)=>{
                            const uid       = typeof o.userId==="string" ? o.userId : o.userId?._id;
                            const uObj      = users.find((u: any)=>String(u.userId)===String(uid));
                            const name      = uObj?.name || "Guest";
                            const itemCount = o.cartItems?.reduce((a: number, c: any)=>a+(c.quantity||1),0)||0;
                            const s         = STATUS_STYLE[o.status]||{ dot:"#A0856C", badge:"rgba(160,133,108,0.12)", text:"#8B6F5E" };
                            return (
                              <tr key={i} className="row-hover" style={{ borderBottom:"1px solid #F5EDE3" }}>
                                <td style={{ padding:"13px 16px 13px 0" }}>
                                  <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#A0856C", background:"#FAF6F1", padding:"3px 9px", borderRadius:8 }}>
                                    #{String(o._id||i).slice(-6).toUpperCase()}
                                  </span>
                                </td>
                                <td style={{ padding:"13px 16px 13px 0" }}>
                                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                                    <div style={{ width:28, height:28, borderRadius:"50%", flexShrink:0, background:PALETTE[i%PALETTE.length], display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:800, fontSize:11 }}>
                                      {name[0]?.toUpperCase()||"?"}
                                    </div>
                                    <span style={{ fontWeight:600, color:"#3D2314" }}>{name}</span>
                                  </div>
                                </td>
                                <td style={{ padding:"13px 16px 13px 0", color:"#8B6F5E" }}>{itemCount} item{itemCount!==1?"s":""}</td>
                                <td style={{ padding:"13px 16px 13px 0", fontWeight:800, color:"#3D2314" }}>₹{fmt(o.totalAmount||0)}</td>
                                <td style={{ padding:"13px 16px 13px 0" }}>
                                  <span style={{ fontSize:11, fontWeight:700, padding:"4px 11px", borderRadius:8, background:s.badge, color:s.text }}>{o.status}</span>
                                </td>
                                <td style={{ padding:"13px 16px 13px 0", color:"#A0856C", fontSize:12, fontFamily:"'DM Mono',monospace" }}>
                                  {new Date(o.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
              </Panel>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════
   HELPERS
═══════════════════════════════════════ */
const THead = ({ cols }: { cols: string[] }) => (
  <tr style={{ borderBottom:"2px solid #EFE8DF" }}>
    {cols.map(c=>(
      <th key={c} style={{ textAlign:"left", padding:"10px 16px 10px 0", fontSize:10, fontWeight:700, color:"#A0856C", letterSpacing:"0.12em", textTransform:"uppercase", whiteSpace:"nowrap" }}>{c}</th>
    ))}
  </tr>
);

const Panel = ({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) => (
  <div style={{ background:"#fff", borderRadius:18, padding:"24px 28px", boxShadow:"0 2px 16px rgba(92,64,51,0.06)", border:"1px solid #EFE8DF" }}>
    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:18 }}>
      <span style={{ display:"inline-block", width:8, height:8, borderRadius:"50%", background:"linear-gradient(135deg,#C8A882,#8B6F5E)" }}/>
      <div>
        <h3 style={{ margin:0, fontSize:14, fontWeight:700, color:"#3D2314", letterSpacing:"-0.2px" }}>{title}</h3>
        {sub && <p style={{ margin:0, fontSize:11, color:"#A0856C" }}>{sub}</p>}
      </div>
    </div>
    {children}
  </div>
);

const StatusPill = ({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) => (
  <span style={{ fontSize:11, fontWeight:700, color, background:bg, padding:"3px 10px", borderRadius:8 }}>{children}</span>
);

const Empty = ({ label }: { label: string }) => (
  <div style={{ textAlign:"center", padding:"48px 0", color:"#A0856C", fontSize:13 }}>
    <div style={{ fontSize:32, marginBottom:12, opacity:0.4 }}>📊</div>
    {label}
  </div>
);

export default AdminReport;