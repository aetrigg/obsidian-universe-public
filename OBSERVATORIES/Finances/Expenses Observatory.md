---
banner: "![[moon.gif]]"
image: [[moon.gif]]
content_starts: "50"
banner_y: 80
banner_height: 400
cssclasses:
  - my-class
  - hide-properties_reading
  - hide-properties_editing
  - daily-note
  - expenses-observatory
  - starfield
---

<center><h3 style="color:#ffffff; font-size: 18px; margin-bottom: 5px;">Welcome to your</h3></center>
<center><h1 style="color:#ffffff; margin-bottom:20px; font-size: 28px;"><u>Expenses Observatory</u></h1></center>

```datacorejsx
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

function ExpensesDashboard() {
  const currentYear = new Date().getFullYear().toString();
  const currentMonth = String(new Date().getMonth() + 1).padStart(2, "0");

  const [year, setYear] = dc.useState(currentYear);
  const [month, setMonth] = dc.useState(currentMonth);
  const [data, setData] = dc.useState(null);
  const [loading, setLoading] = dc.useState(true);

  const pieChartRef = dc.useRef(null);
  const lineChartRef = dc.useRef(null);
  const barChartRef = dc.useRef(null);

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
        type: "doughnut",
        data: {
          labels: pieLabels,
          datasets: [{
            data: pieData,
            backgroundColor: pieColors,
            borderWidth: 0,
            cutout: "60%"
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false }
          }
        }
      }, pieChartRef.current);
    }

    // Line Chart (Daily Spending Trend)
    if (lineChartRef.current && data.sortedDays.length > 0) {
      lineChartRef.current.innerHTML = "";
      const labels = data.sortedDays;

      window.renderChart({
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Daily Spending",
            data: labels.map(d => data.dailySpending[d].Total),
            borderColor: "#8A6CF5",
            backgroundColor: "rgba(138, 108, 245, 0.2)",
            fill: true,
            tension: 0.4,
            pointRadius: 2,
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { display: false },
            y: {
              display: false,
              beginAtZero: true
            }
          }
        }
      }, lineChartRef.current);
    }

    // Bar Chart
    if (barChartRef.current) {
      barChartRef.current.innerHTML = "";

      if (month === "all") {
        const activeMonths = MONTHS.filter(m => data.monthlyTotals[m] > 0);
        if (activeMonths.length > 0) {
          const barData = activeMonths.map(m => data.monthlyTotals[m]);

          window.renderChart({
            type: "bar",
            data: {
              labels: activeMonths,
              datasets: [{
                data: barData,
                backgroundColor: "#8A6CF5",
                borderRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: textColor }, grid: { display: false } },
                y: { display: false, beginAtZero: true }
              }
            }
          }, barChartRef.current);
        }
      } else {
        const activeWeeks = Object.keys(data.weeklyTotals).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
        if (activeWeeks.length > 0) {
          const barData = activeWeeks.map(w => data.weeklyTotals[w]);

          window.renderChart({
            type: "bar",
            data: {
              labels: activeWeeks,
              datasets: [{
                data: barData,
                backgroundColor: "#8A6CF5",
                borderRadius: 6
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: textColor }, grid: { display: false } },
                y: { display: false, beginAtZero: true }
              }
            }
          }, barChartRef.current);
        }
      }
    }
  }, [data, month]);

  const loadData = async () => {
    setLoading(true);
    try {
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
            if (!inTable || !t.startsWith("|") || t.includes("-----")) continue;
            // if (/^\|\s*\|\s*\|\s*\|$/.test(t)) continue; // Removed faulty regex

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

        // Find top category
        let topCat = "None";
        let topAmount = 0;
        CATS.forEach(c => {
          if (totals[c] > topAmount) {
            topAmount = totals[c];
            topCat = c;
          }
        });

        // Calculate average per day
        const daysWithSpending = sortedDays.filter(d => dailySpending[d].Total > 0).length;
        const avgPerDay = daysWithSpending > 0 ? grand / daysWithSpending : 0;

        setData({
          totals,
          monthlyTotals,
          weeklyTotals,
          dailySpending,
          sortedDays,
          expenses: expenses.sort((a, b) => b.date.localeCompare(a.date)),
          grand,
          topCat,
          topAmount,
          avgPerDay,
          transactionCount: expenses.length
        });
    } catch (e) {
        console.error("ExpensesDashboard Error:", e);
    } finally {
        setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: "24px", marginBottom: "10px" }}>✦ · · · ✦</div>
        <div style={{ opacity: 0.7 }}>Scanning the cosmos for transactions...</div>
      </div>
    );
  }

  // Styles
  const cardStyle = {
    background: "rgba(20, 20, 20, 0.1)",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(2.5px)"
  };

  const statCardStyle = {
    ...cardStyle,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    minWidth: "140px",
    flex: "1"
  };

  const statValue = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "var(--text-accent)",
    marginBottom: "4px"
  };

  const statLabel = {
    fontSize: "12px",
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  return (
    <div style={{ padding: "20px 0", fontFamily: "var(--font-interface)" }}>

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
        .card-link {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.6);
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
          background-image: linear-gradient(var(--text-accent), var(--text-accent));
          background-position: 100% 100%;
          background-repeat: no-repeat;
          background-size: 0% 1px;
          transition: color 0.5s ease-in-out, background-size 0.3s ease-in-out, text-shadow 0.3s ease-in-out;
        }
        .card-link:hover {
          color: #ffffff !important;
          background-size: 100% 1px;
          background-position: 0% 100%;
          text-shadow: 0 0 8px #8A6CF5, 0 0 14px #BA9FFF, 0 0 24px #C3B1FF;
        }
        .responsive-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 25px;
        }
      `}</style>

      {/* Time Period Filters */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginBottom: "30px" }}>
        <div className="glyph-dropdown" style={{ position: "relative" }}>
          <div className="glyph-dropdown-header">{year}</div>
          <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px", zIndex: 100 }}>
            {[ "2025", "2026"].map(y => (
              <div key={y} className="glyph-dropdown-option" onClick={() => setYear(y)}>{y}</div>
            ))}
          </div>
        </div>

        <div className="glyph-dropdown" style={{ position: "relative" }}>
          <div className="glyph-dropdown-header">{monthLabels[month]}</div>
          <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px", zIndex: 100 }}>
            {monthOrder.map(val => (
              <div key={val} className="glyph-dropdown-option" onClick={() => setMonth(val)}>{monthLabels[val]}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "25px", flexWrap: "wrap", justifyContent: "center" }}>
        <div style={statCardStyle}>
          <div style={statValue}>${data.grand.toFixed(0)}</div>
          <div style={statLabel}>Total Spent</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValue}>{data.transactionCount}</div>
          <div style={statLabel}>Transactions</div>
        </div>
        <div style={statCardStyle}>
          <div style={statValue}>${data.avgPerDay.toFixed(0)}</div>
          <div style={statLabel}>Avg / Day</div>
        </div>
        <div style={statCardStyle}>
          <div style={{ ...statValue, color: COLORS[data.topCat] }}>{data.topCat}</div>
          <div style={statLabel}>Top Category</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="responsive-grid">

        {/* Donut Chart Card */}
        <div style={cardStyle}>
          <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "15px", opacity: 0.8 }}>✦ Spending Distribution ✦</div>
          {data.grand > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div ref={pieChartRef} style={{ width: "140px", height: "140px" }} />
              <div style={{ flex: 1 }}>
                {CATS.filter(c => data.totals[c] > 0).map(c => (
                  <div key={c} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", fontSize: "13px" }}>
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: COLORS[c] }} />
                    <span style={{ flex: 1 }}>{c}</span>
                    <span style={{ opacity: 0.7 }}>{Math.round(data.totals[c] / data.grand * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ) : <div style={{ opacity: 0.5, fontStyle: "italic" }}>No data</div>}
        </div>

        {/* Bar Chart Card */}
        <div style={{ ...cardStyle, overflow: "hidden" }}>
          <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "15px", opacity: 0.8 }}>✦ {month === "all" ? "Monthly" : "Weekly"} Breakdown ✦</div>
          <div ref={barChartRef} style={{ height: "160px", maxHeight: "160px", overflow: "hidden" }} />
        </div>
      </div>

      {/* Spending Trend - Full Width */}
      <div style={{ ...cardStyle, marginBottom: "25px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
          <div style={{ fontSize: "12px", fontWeight: "600", opacity: 0.8 }}>✦ Spending Trajectory ✦</div>
          <a
            href="obsidian://open?vault=Universe-Public&file=OBSERVATORIES%2FFinances%2FWealth%20Flux%20Report"
            className="card-link"
            onClick={() => {
              localStorage.setItem("wealthFluxNav", JSON.stringify({ year, month, scrollTo: "daily-spending-trend" }));
            }}
          >
            View Details →
          </a>
        </div>
        {data.sortedDays.length > 0 ? (
          <div ref={lineChartRef} style={{ height: "120px", maxHeight: "120px", overflow: "hidden", position: "relative" }} />
        ) : <div style={{ opacity: 0.5, fontStyle: "italic" }}>No data</div>}
      </div>

      {/* Category Bars - Compact */}
      <div style={cardStyle}>
        <div style={{ fontSize: "12px", fontWeight: "600", marginBottom: "15px", opacity: 0.8 }}>✦ Category Breakdown ✦</div>
        {data.grand > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px 20px" }}>
            {CATS.filter(c => data.totals[c] > 0).map(c => {
              const pct = Math.round(data.totals[c] / data.grand * 100);
              return (
                <div key={c} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ minWidth: "70px", fontSize: "13px" }}>{c}</span>
                  <div style={{ flex: 1, height: "8px", background: "var(--background-primary)", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: pct + "%", background: COLORS[c], borderRadius: "4px" }} />
                  </div>
                  <span style={{ minWidth: "55px", fontSize: "12px", textAlign: "right", opacity: 0.7 }}>${data.totals[c].toFixed(0)}</span>
                </div>
              );
            })}
          </div>
        ) : <div style={{ opacity: 0.5, fontStyle: "italic" }}>No spending data</div>}
      </div>

      {/* Recent Transactions - Compact List */}
      <div style={{ ...cardStyle, marginTop: "25px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
          <div style={{ fontSize: "12px", fontWeight: "600", opacity: 0.8 }}>✦ Recent Transactions ✦</div>
          <a
            href="obsidian://open?vault=Universe-Public&file=OBSERVATORIES%2FFinances%2FExpenses%20Log"
            className="card-link"
          >
            View All →
          </a>
        </div>
        {data.expenses.length > 0 ? (
          <div>
            {data.expenses.slice(0, 8).map((e, i) => (
              <div key={i} style={{
                display: "flex",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: i < 7 ? "1px solid var(--background-modifier-border)" : "none",
                gap: "12px"
              }}>
                <span style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: COLORS[e.cat],
                  flexShrink: 0
                }} />
                <span style={{ flex: 1, fontSize: "13px" }}>{e.item}</span>
                <span style={{ fontSize: "12px", opacity: 0.5 }}>{e.dateLabel}</span>
                <span style={{ fontSize: "13px", fontWeight: "500", minWidth: "60px", textAlign: "right" }}>${e.cost.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : <div style={{ opacity: 0.5, fontStyle: "italic" }}>No transactions</div>}
      </div>

    </div>
  );
}

return <ExpensesDashboard />; 
```