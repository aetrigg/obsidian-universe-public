---
banner: "![[vaporwave.gif]]"
image: [[vaporwave.gif]]
content_starts: "25"
banner_y: 25
banner_height: 400
cssclasses:
  - my-class
  - hide-properties_reading
  - hide-properties_editing
  - daily-note
  - glowing-stars
  - starfield
---

```datacorejsx
const { WealthFluxQuickLinks } = await dc.require("SYSTEM/_scripts/Datacore/WealthFluxQuickLinks.jsx");
const BASE_PATH = "Digital Hobonichi";

const COLORS = {
  "Subs": "#FED073",
  "Rent": "#5CCEE6",
  "Bills": "#7FBEFE",
  "Fast Food": "#D4FF81",
  "Personal": "#C586FF",
  "Coloring": "#FFB3C1",
  "Baby": "#66E0E0",
  "Junk Food": "#4CAF50",
  "Weed": "#064F2E",
  "Other": "#B3D4FF"
};

const CATS = ["Subs", "Rent", "Bills", "Fast Food", "Coloring", "Baby", "Junk Food", "Other", "Personal", "Weed"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthLabels = {
  "all": "All Months", "01": "January", "02": "February", "03": "March",
  "04": "April", "05": "May", "06": "June", "07": "July",
  "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"
};
const monthOrder = ["all", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

function FinancesObservatory() {
  // Check localStorage for navigation state
  const navRef = dc.useRef(null);
  if (navRef.current === null) {
    try {
      const navData = localStorage.getItem("wealthFluxNav");
      if (navData) {
        navRef.current = JSON.parse(navData);
        localStorage.removeItem("wealthFluxNav");
      } else {
        navRef.current = {};
      }
    } catch (e) {
      navRef.current = {};
    }
  }

  const [year, setYear] = dc.useState(navRef.current?.year || "2026");
  const [month, setMonth] = dc.useState(navRef.current?.month || "all");
  const [data, setData] = dc.useState(null);
  const [loading, setLoading] = dc.useState(true);

  // Expense log filter & pagination state
  const [filterCategory, setFilterCategory] = dc.useState("all");
  const [currentPage, setCurrentPage] = dc.useState(1);
  const [itemsPerPage, setItemsPerPage] = dc.useState(15);

  const pieChartRef = dc.useRef(null);
  const lineChartRef = dc.useRef(null);
  const barChartRef = dc.useRef(null);
  const dailyTrendRef = dc.useRef(null);

  // Scroll to daily spending trend if navigated from Expenses Observatory
  dc.useEffect(() => {
    if (navRef.current?.scrollTo === "daily-spending-trend" && !loading && data) {
      setTimeout(() => {
        dailyTrendRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, [loading, data]);

  // Reset to page 1 when filters change
  dc.useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, month, year]);

  dc.useEffect(() => { loadData(); }, [year, month]);

  // Render charts when data changes
  dc.useEffect(() => {
    if (!data || !window.renderChart) return;

    const isDark = document.body.classList.contains("theme-dark");
    const textColor = isDark ? "#ffffff" : "#000000";
    const gridColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)";

    // Pie Chart
    if (pieChartRef.current && data.grand > 0) {
      pieChartRef.current.innerHTML = "";
      const pieLabels = [];
      const pieData = [];
      const pieColors = [];
      CATS.forEach(c => {
        if (data.totals[c] > 0) {
          pieLabels.push(c);
          pieData.push(data.totals[c]);
          pieColors.push(COLORS[c]);
        }
      });

      window.renderChart({
        type: "pie",
        data: {
          labels: pieLabels,
          datasets: [{
            data: pieData,
            backgroundColor: pieColors
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "right", labels: { color: textColor } },
            title: { display: false, text: "Total: $" + data.grand.toFixed(2), color: textColor }
          }
        }
      }, pieChartRef.current);
    }

    // Line Chart (Daily Spending Trend)
    if (lineChartRef.current && data.sortedDays.length > 0) {
      lineChartRef.current.innerHTML = "";
      const labels = data.sortedDays;
      const activeCats = CATS.filter(c => data.sortedDays.some(d => data.dailySpending[d][c] > 0));

      const datasets = [{
        label: "Total",
        data: labels.map(d => data.dailySpending[d].Total),
        borderColor: "#FF0000",
        backgroundColor: "rgba(255,0,0,0.1)",
        fill: false,
        tension: 0.3,
        pointRadius: 4,
        borderWidth: 3
      }];

      activeCats.forEach(c => {
        const hex = COLORS[c];
        const r = parseInt(hex.slice(1,3), 16);
        const g = parseInt(hex.slice(3,5), 16);
        const b = parseInt(hex.slice(5,7), 16);
        datasets.push({
          label: c,
          data: labels.map(d => data.dailySpending[d][c] || 0),
          borderColor: COLORS[c],
          backgroundColor: "rgba(" + r + "," + g + "," + b + ",0.3)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
          borderWidth: 2
        });
      });

      window.renderChart({
        type: "line",
        data: { labels, datasets },
        options: {
          responsive: true,
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { display: true, position: "bottom", labels: { color: textColor, boxWidth: 12, padding: 10 } }
          },
          scales: {
            x: { ticks: { color: textColor }, grid: { color: gridColor } },
            y: {
              beginAtZero: true,
              ticks: { color: textColor, callback: function(v) { return "$" + v; } },
              grid: { color: gridColor }
            }
          }
        }
      }, lineChartRef.current);
    }

    // Bar Chart (Monthly or Weekly Totals)
    if (barChartRef.current) {
      barChartRef.current.innerHTML = "";

      if (month === "all") {
        // Monthly Totals
        const activeMonths = MONTHS.filter(m => data.monthlyTotals[m] > 0);
        if (activeMonths.length > 0) {
          const barData = activeMonths.map(m => data.monthlyTotals[m]);
          const yearTotal = barData.reduce((a, b) => a + b, 0);
          const avgMonthly = yearTotal / activeMonths.length;
          const avgLine = activeMonths.map(() => avgMonthly);

          window.renderChart({
            type: "bar",
            data: {
              labels: activeMonths,
              datasets: [
                {
                  label: "Monthly Spending",
                  data: barData,
                  backgroundColor: "#4CAF50",
                  borderRadius: 4,
                  order: 2
                },
                {
                  label: "Average ($" + avgMonthly.toFixed(0) + ")",
                  data: avgLine,
                  type: "line",
                  borderColor: "#FF6B6B",
                  backgroundColor: "transparent",
                  borderWidth: 2,
                  borderDash: [5, 5],
                  pointRadius: 0,
                  fill: false,
                  order: 1
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                legend: { display: true, position: "bottom", labels: { color: textColor, boxWidth: 12, padding: 10 } },
                title: { display: false }
              },
              scales: {
                x: { ticks: { color: textColor }, grid: { display: false } },
                y: {
                  beginAtZero: true,
                  ticks: { color: textColor, callback: function(v) { return "$" + v; } },
                  grid: { color: gridColor }
                }
              }
            }
          }, barChartRef.current);
        }
      } else {
        // Weekly Totals
        const activeWeeks = Object.keys(data.weeklyTotals).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
        if (activeWeeks.length > 0) {
          const barData = activeWeeks.map(w => data.weeklyTotals[w]);
          const weekTotal = barData.reduce((a, b) => a + b, 0);
          const avgWeekly = weekTotal / activeWeeks.length;
          const avgLine = activeWeeks.map(() => avgWeekly);

          window.renderChart({
            type: "bar",
            data: {
              labels: activeWeeks,
              datasets: [
                {
                  label: "Weekly Spending",
                  data: barData,
                  backgroundColor: "#2196F3",
                  borderRadius: 4,
                  order: 2
                },
                {
                  label: "Average ($" + avgWeekly.toFixed(0) + ")",
                  data: avgLine,
                  type: "line",
                  borderColor: "#FF6B6B",
                  backgroundColor: "transparent",
                  borderWidth: 2,
                  borderDash: [5, 5],
                  pointRadius: 0,
                  fill: false,
                  order: 1
                }
              ]
            },
            options: {
              responsive: true,
              plugins: {
                legend: { display: true, position: "bottom", labels: { color: textColor, boxWidth: 12, padding: 10 } },
                title: { display: false }
              },
              scales: {
                x: { ticks: { color: textColor }, grid: { display: false } },
                y: {
                  beginAtZero: true,
                  ticks: { color: textColor, callback: function(v) { return "$" + v; } },
                  grid: { color: gridColor }
                }
              }
            }
          }, barChartRef.current);
        }
      }
    }
  }, [data, month]);

  const loadData = async () => {
    setLoading(true);
    const folderPath = BASE_PATH + "/" + year;
    const files = app.vault.getMarkdownFiles().filter(f => {
      if (!f.path.startsWith(folderPath)) return false;
      if (!/\d{4}-\d{2}-\d{2}\.md$/.test(f.name)) return false;
      if (month !== "all") {
        return f.name.slice(5, 7) === month;
      }
      return true;
    });

    const totals = {};
    CATS.forEach(c => { totals[c] = 0; });
    const monthlyTotals = {};
    const weeklyTotals = {};
    const dailySpending = {};
    const expenses = [];

    for (const file of files) {
      const content = await app.vault.read(file);
      const lines = content.split("\n");
      let inTable = false;
      const dateName = file.name.replace(".md", "");
      const monthKey = window.moment(dateName, "YYYY-MM-DD").format("MMM");
      const weekNum = window.moment(dateName, "YYYY-MM-DD").isoWeek();
      const weekKey = "W" + weekNum;
      const dayLabel = window.moment(dateName, "YYYY-MM-DD").format("MMM D");

      if (!dailySpending[dayLabel]) {
        dailySpending[dayLabel] = { Total: 0, date: dateName };
        CATS.forEach(c => { dailySpending[dayLabel][c] = 0; });
      }

      for (const line of lines) {
        const t = line.trim();
        if (t.includes("| Cost")) { inTable = true; continue; }
        if (!inTable || !t.startsWith("|") || t.includes("----")) continue;
        if (/^\|\s*\|\s*\|\s*\|$/.test(t)) continue;

        const cells = line.split("|").map(c => c.trim());
        if (cells.length < 4) continue;

        const cost = parseFloat((cells[1] || "").replace(/[^0-9.]/g, ""));
        const item = cells[2] || "";
        const notes = (cells[3] || "").toLowerCase();

        if (isNaN(cost) || cost <= 0) continue;

        let cat = "Other";

        if (notes.includes("#finances/subscription")) cat = "Subs";
        else if (notes.includes("#finances/rent")) cat = "Rent";
        else if (notes.includes("#finances/fastfood")) cat = "Fast Food";
        else if (notes.includes("#finances/bill")) cat = "Bills";
        else if (notes.includes("#finances/coloring")) cat = "Coloring";
        else if (notes.includes("#finances/baby")) cat = "Baby";
        else if (notes.includes("#finances/personal") || notes.includes("#finances/hygiene")) cat = "Personal";
        else if (notes.includes("#finances/weed") || notes.includes("#finances/420") || notes.includes("#finances/dispensary")) cat = "Weed";
        else if (notes.includes("#finances/junkfood")) cat = "Junk Food";
        else {
          const itemLower = item.toLowerCase();
          const combined = itemLower + " " + notes;

          if (/google\s*play|apple|chatgpt|claude|openai|discord\s*nitro|cap\s*cut|capcut|youtube\s*premium|spotify|netflix|hulu|max\b|paramount|disney|peacock|amazon\s*prime/i.test(combined)) cat = "Subs";
          else if (/rent|lease|apartment|landlord/i.test(combined)) cat = "Rent";
          else if (/papa\s*john|mcdonald|burger\s*king|taco\s*bell|domino|pizza|wendy|chipotle|five\s*guys|kfc|culver|arby|sonic|jimmy\s*john|panera|little\s*caesars|starbucks|dunkin|dairy\s*queen|fazoli|subway|panda/i.test(combined)) cat = "Fast Food";
          else if (/weed|dispensary|flower|cart|dab|joint|blunt|edible|pre-?roll|shatter|bud/i.test(combined)) cat = "Weed";
          else if (/electric|gas|water|utility|internet|phone|bill|insurance|car\s*payment|visible/i.test(combined)) cat = "Bills";
          else if (/marker|pencil|coloring|art\s*supply|sketch|paper|ohuhu|arrtx|kalour/i.test(combined)) cat = "Coloring";
          else if (/diaper|formula|baby|bottle|wipes|toy|clothes|onesie|pacifier|theo/i.test(combined)) cat = "Baby";
          else if (/shampoo|conditioner|soap|body\s*wash|toothpaste|deodorant|razor|toilet\s*paper|sanitary|hygiene|lotion|makeup|skincare|vyvanse|rx/i.test(combined)) cat = "Personal";
          else if (/chips|candy|snack|soda|cookie|ice\s*cream|donut|pop|chocolate|brownie/i.test(combined)) cat = "Junk Food";
        }

        totals[cat] = totals[cat] + cost;
        monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + cost;
        weeklyTotals[weekKey] = (weeklyTotals[weekKey] || 0) + cost;
        dailySpending[dayLabel].Total += cost;
        dailySpending[dayLabel][cat] += cost;
        expenses.push({ cost, item, cat, date: dateName, dateLabel: dayLabel });
      }
    }

    let grand = 0;
    CATS.forEach(c => { grand = grand + totals[c]; });

    const sortedDays = Object.keys(dailySpending).sort((a, b) => {
      return dailySpending[a].date.localeCompare(dailySpending[b].date);
    });

    setData({
      totals,
      monthlyTotals,
      weeklyTotals,
      dailySpending,
      sortedDays,
      expenses: expenses.sort((a, b) => b.date.localeCompare(a.date)),
      grand
    });
    setLoading(false);
  };

  if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>Gathering financial data...</p>;

  const max = Math.max(...CATS.map(c => data.totals[c]).filter(v => v > 0), 1);


  const headingStyle = { color: "#ffffff", marginBottom: "0px", textAlign: "center" };

  return (
    <div style={{ padding: "20px 0", fontFamily: "var(--font-interface)" }}>
      <div style={{ marginBottom: "30px" }}>
        <WealthFluxQuickLinks />
      </div>
      {/* Dropdown Animation Styles */}
      <style>{`
        .glyph-dropdown-options {
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
          visibility: hidden;
        }
        .glyph-dropdown:hover .glyph-dropdown-options {
          opacity: 1;
          transform: translateY(0);
          visibility: visible;
        }
      `}</style>

      {/* Filters - Hover Dropdowns */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>

        {/* Year Dropdown */}
        <div className="glyph-dropdown" style={{ position: "relative" }}>
          <div className="glyph-dropdown-header" style={{ backdropFilter: "blur(2.5px)" }}>{year}</div>
          <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px", zIndex: 100 }}>
            {["2025", "2026"].map(y => (
              <div key={y} className="glyph-dropdown-option" onClick={() => setYear(y)}>{y}</div>
            ))}
          </div>
        </div>

        {/* Month Dropdown */}
        <div className="glyph-dropdown" style={{ position: "relative" }}>
          <div className="glyph-dropdown-header" style={{ backdropFilter: "blur(2.5px)" }}>{monthLabels[month]}</div>
          <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px", zIndex: 100 }}>
            {monthOrder.map(val => (
              <div key={val} className="glyph-dropdown-option" onClick={() => setMonth(val)}>{monthLabels[val]}</div>
            ))}
          </div>
        </div>

      </div>

      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h3 style={{ color: "#ffffff" }}>Welcome to your</h3>
        <h1 style={{ color: "#ffffff", marginBottom: "20px" }}><u>Wealth Flux Report</u></h1>
        <p class="para-margins"><i>Charting the constant flow of wealth passing through my universe, providing a deep-field view of trends over time.</i></p>
      </div>


      {/* Spending by Category */}
      <div id="category-target" style={{ position: "absolute", scrollMarginTop: "200px" }} />
      <hr/>
      <div style={{ marginBottom: "40px" }}>
        <h3 style={headingStyle}>𝚜 𝚙 𝚎 𝚗 𝚍 𝚒 𝚗 𝚐 &nbsp; 𝚋 𝚢 &nbsp; 𝚌 𝚊 𝚝 𝚎 𝚐 𝚘 𝚛 𝚢</h3>
        <br/>
        {data.grand > 0 ? (
          <div>
            {CATS.filter(c => data.totals[c] > 0).map(c => (
              <div key={c} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ minWidth: "90px", fontWeight: 500 }}>{c}</span>
                <div style={{ flex: 1, height: "24px", background: "var(--background-secondary)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: Math.round(data.totals[c] / max * 100) + "%", background: COLORS[c], borderRadius: "4px" }} />
                </div>
                <span style={{ minWidth: "80px", textAlign: "right" }}>${data.totals[c].toFixed(2)}</span>
                <span style={{ minWidth: "40px", textAlign: "right", opacity: 0.6 }}>{Math.round(data.totals[c] / data.grand * 100)}%</span>
              </div>
            ))}
          </div>
        ) : <p style={{ fontStyle: "italic", opacity: 0.6 }}>No spending data for this period</p>}
        <h3 style={{ marginBottom: "15px", textAlign: "center", paddingTop: "10px", color: "#ffffff" }}>Total: ${data.grand.toFixed(2)}</h3>
      </div>

      <hr />

      {/* Spending Pie Chart - Interactive Chart.js */}
      <div id="pie-target" style={{ position: "absolute", scrollMarginTop: "200px" }} />
      <div style={{ marginBottom: "0px" }}>
        <h3 style={headingStyle}>𝚜 𝚙 𝚎 𝚗 𝚍 𝚒 𝚗 𝚐 &nbsp; 𝚙 𝚒 𝚎 &nbsp; 𝚌 𝚑 𝚊 𝚛 𝚝</h3>
        {data.grand > 0 ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div ref={pieChartRef} style={{ width: "50%", minHeight: "300px" }} />
          </div>
        ) : <p style={{ fontStyle: "italic", opacity: 0.6 }}>No spending data for this period</p>}
      </div>

      <hr />

      {/* Daily Spending Trend - Interactive Chart.js */}
      <div id="trends-target" style={{ position: "absolute", scrollMarginTop: "200px" }} />
      <div ref={dailyTrendRef} style={{ marginBottom: "40px" }}>
        <h3 style={headingStyle}>𝚍 𝚊 𝚒 𝚕 𝚢 &nbsp; 𝚜 𝚙 𝚎 𝚗 𝚍 𝚒 𝚗 𝚐 &nbsp; 𝚝 𝚛 𝚎 𝚗 𝚍 𝚜</h3>
        {data.sortedDays.length > 0 ? (
          <div ref={lineChartRef} style={{ minHeight: "300px" }} />
        ) : <p style={{ fontStyle: "italic", opacity: 0.6 }}>No spending data for this period</p>}
      </div>

      <hr />

      {/* Monthly/Weekly Totals - Interactive Chart.js */}
      <div id="totals-target" style={{ position: "absolute", scrollMarginTop: "200px" }} />
      <div style={{ marginBottom: "40px" }}>
        <h3 style={headingStyle}>{month === "all" ? "𝚖 𝚘 𝚗 𝚝 𝚑 𝚕 𝚢 \u00a0 𝚝 𝚘 𝚝 𝚊 𝚕 𝚜" : "𝚠 𝚎 𝚎 𝚔 𝚕 𝚢 \u00a0 𝚝 𝚘 𝚝 𝚊 𝚕 𝚜"}</h3>
        <div ref={barChartRef} style={{ minHeight: "300px" }} />
      </div>

      <hr />

      {/* Expense Log */}
      <div id="log-target" style={{ position: "absolute", scrollMarginTop: "200px" }} />
      <div style={{ marginBottom: "40px" }}>
        <h3 style={headingStyle}>{month === "all" ? "𝚢 𝚎 𝚊 𝚛 𝚕 𝚢 \u00a0 𝚎 𝚡 𝚙 𝚎 𝚗 𝚜 𝚎 𝚜" : "𝚖 𝚘 𝚗 𝚝 𝚑 𝚕 𝚢 \u00a0 𝚎 𝚡 𝚙 𝚎 𝚗 𝚜 𝚎 𝚜"}</h3>
        <br/>

        {/* Filter Controls */}
        <div style={{ display: "flex", gap: "20px", marginBottom: "25px", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>

          {/* Category Dropdown */}
          <div className="glyph-dropdown" style={{ position: "relative" }}>
            <div className="glyph-dropdown-header">{filterCategory === "all" ? "All Categories" : filterCategory}</div>
            <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px", zIndex: 100, minWidth: "150px" }}>
              <div className="glyph-dropdown-option" onClick={() => setFilterCategory("all")}>All Categories</div>
              {CATS.map(c => (
                <div key={c} className="glyph-dropdown-option" onClick={() => setFilterCategory(c)}>{c}</div>
              ))}
            </div>
          </div>

          {/* Items Per Page Dropdown */}
          <div className="glyph-dropdown" style={{ position: "relative" }}>
            <div className="glyph-dropdown-header">Show {itemsPerPage} items</div>
            <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px", zIndex: 100 }}>
              {[10, 15, 25, 50, 100].map(n => (
                <div key={n} className="glyph-dropdown-option" onClick={() => setItemsPerPage(n)}>{n} items</div>
              ))}
            </div>
          </div>

        </div>

        {(() => {
          const filtered = data.expenses.filter(e => filterCategory === "all" || e.cat === filterCategory);
          const totalItems = filtered.length;
          const totalPages = Math.ceil(totalItems / itemsPerPage);
          const startIndex = (currentPage - 1) * itemsPerPage;
          const paginatedExpenses = filtered.slice(startIndex, startIndex + itemsPerPage);
          const filteredTotal = filtered.reduce((sum, e) => sum + e.cost, 0);

          return (
            <>
              {/* Results Summary */}
              <div style={{ textAlign: "center", marginBottom: "15px", opacity: 0.8, fontSize: "14px" }}>
                Showing {paginatedExpenses.length} of {totalItems} expenses
                {filterCategory !== "all" && (
                  <span> (filtered) • Total: <strong>${filteredTotal.toFixed(2)}</strong></span>
                )}
              </div>

              {paginatedExpenses.length > 0 ? (
                <>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ borderBottom: "2px solid var(--background-modifier-border)" }}>
                        <th style={{ textAlign: "left", padding: "8px" }}>Date</th>
                        <th style={{ textAlign: "left", padding: "8px" }}>Item</th>
                        <th style={{ textAlign: "left", padding: "8px" }}>Category</th>
                        <th style={{ textAlign: "right", padding: "8px" }}>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedExpenses.map((e, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid var(--background-modifier-border)" }}>
                          <td style={{ padding: "8px" }}>{e.dateLabel}</td>
                          <td style={{ padding: "8px" }}>{e.item}</td>
                          <td style={{ padding: "8px" }}>
                            <span
                              className="expense-tag"
                              style={{
                                "--tag-color": COLORS[e.cat],
                                "--tag-text": (() => {
                                  const hex = COLORS[e.cat].replace("#", "");
                                  const r = parseInt(hex.slice(0,2), 16);
                                  const g = parseInt(hex.slice(2,4), 16);
                                  const b = parseInt(hex.slice(4,6), 16);
                                  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
                                  return luminance > 0.5 ? "#000000" : "#ffffff";
                                })()
                              }}
                              onClick={() => setFilterCategory(e.cat)}
                              title={"Click to filter by " + e.cat}
                            >
                              {e.cat.toLowerCase().replace(" ", "-")}
                            </span>
                          </td>
                          <td style={{ padding: "8px", textAlign: "right" }}>${e.cost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="pagination-controls">
                      <button
                        className={"pagination-btn pagination-first" + (currentPage === 1 ? " pagination-disabled" : "")}
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        First
                      </button>
                      <button
                        className={"pagination-btn pagination-prev" + (currentPage === 1 ? " pagination-disabled" : "")}
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                      <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        className={"pagination-btn pagination-next" + (currentPage === totalPages ? " pagination-disabled" : "")}
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                      <button
                        className={"pagination-btn pagination-last" + (currentPage === totalPages ? " pagination-disabled" : "")}
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        Last
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p style={{ fontStyle: "italic", opacity: 0.6, textAlign: "center" }}>
                  {data.expenses.length > 0 ? "No expenses match your filter" : "No expenses recorded for this period"}
                </p>
              )}

              {/* Clear Filter Button */}
              {filterCategory !== "all" && (
                <div className="clear-filters-container">
                  <button className="clear-filters-btn" onClick={() => setFilterCategory("all")}>
                    Clear Filter
                  </button>
                </div>
              )}
            </>
          );
        })()}
      </div>

    </div>
  );
}

return <FinancesObservatory />;
```
