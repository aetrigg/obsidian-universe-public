---
banner: "![[black-hole.gif]]"
image: [[black-hole.gif]]
content_starts: "50"
banner_y: 30
banner_height: 400
cssclasses:
  - my-class
  - hide-properties_reading
  - hide-properties_editing
  - daily-note
  - glowing-stars
  - starfield
---

<center><h3 style="color:#ffffff;">Welcome to your</h3></center>
<center><h1 style="color:#ffffff; margin-bottom:20px;"><u>Expenses Log</u></h1></center>


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

const monthLabels = {
  "all": "All Months", "01": "January", "02": "February", "03": "March",
  "04": "April", "05": "May", "06": "June", "07": "July",
  "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"
};
const monthOrder = ["all", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

function ExpenseLog() {
  const now = new Date();
  const currentYear = now.getFullYear().toString();
  const currentMonth = String(now.getMonth() + 1).padStart(2, "0");

  const [year, setYear] = dc.useState(currentYear);
  const [month, setMonth] = dc.useState(currentMonth);
  const [expenses, setExpenses] = dc.useState([]);
  const [loading, setLoading] = dc.useState(true);

  // Filter & pagination state
  const [filterCategory, setFilterCategory] = dc.useState("all");
  const [searchTerm, setSearchTerm] = dc.useState("");
  const [currentPage, setCurrentPage] = dc.useState(1);
  const [itemsPerPage, setItemsPerPage] = dc.useState(15);

  const loadExpenses = async () => {
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

        // console.log(`ExpenseLog: Found ${files.length} files in ${folderPath} for month ${month}`);

        const expenseList = [];

        for (const file of files) {
          const content = await app.vault.read(file);
          const lines = content.split("\n");
          let inTable = false;
          const dateName = file.name.replace(".md", "");
          const dayLabel = window.moment(dateName, "YYYY-MM-DD").format("MMM D");

          for (const line of lines) {
            const t = line.trim();
            
            // Check for table header
            if (t.includes("| Cost")) { 
                inTable = true; 
                continue; 
            }
            
            if (!inTable) continue;
            if (!t.startsWith("|")) continue;
            if (t.includes("-----")) continue;
            // Removed problematic regex check for empty rows
            // if (/^|\s*|\s*|\s*|$/.test(t)) continue;

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

            expenseList.push({ cost, item, cat, date: dateName, dateLabel: dayLabel });
          }
        }
        
        // console.log(`Parsed ${expenseList.length} expenses`);
        setExpenses(expenseList.sort((a, b) => b.date.localeCompare(a.date)));
    } catch (e) {
        console.error("ExpenseLog Error:", e);
    } finally {
        setLoading(false);
    }
  };

  // Reset to page 1 when filters change
  dc.useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchTerm, month, year]);

  dc.useEffect(() => { loadExpenses(); }, [year, month]);

  if (loading) return <p style={{ textAlign: "center", padding: "40px" }}>Loading expenses...</p>;

  // Filter expenses
  const filtered = expenses.filter(e => {
    const matchesCategory = filterCategory === "all" || e.cat === filterCategory;
    const matchesSearch = searchTerm === "" || e.item.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination calculations
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExpenses = filtered.slice(startIndex, endIndex);

  // Calculate totals
  const grandTotal = expenses.reduce((sum, e) => sum + e.cost, 0);
  const filteredTotal = filtered.reduce((sum, e) => sum + e.cost, 0);

  const headingStyle = { color: "var(--text-accent)", marginBottom: "16px", textAlign: "center" };

  return (
    <div style={{ fontFamily: "var(--font-interface)" }}>
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
      
      <br/>

      {/* Year/Month Filters */}
      <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "20px" }}>

        {/* Year Dropdown */}
        <div className="glyph-dropdown" style={{ position: "relative" }}>
          <div className="glyph-dropdown-header">{year}</div>
          <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px", zIndex: 100 }}>
            {["2025", "2026"].map(y => (
              <div key={y} className="glyph-dropdown-option" onClick={() => setYear(y)}>{y}</div>
            ))}
          </div>
        </div>

        {/* Month Dropdown */}
        <div className="glyph-dropdown" style={{ position: "relative" }}>
          <div className="glyph-dropdown-header">{monthLabels[month]}</div>
          <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px", zIndex: 100 }}>
            {monthOrder.map(val => (
              <div key={val} className="glyph-dropdown-option" onClick={() => setMonth(val)}>{monthLabels[val]}</div>
            ))}
          </div>
        </div>

      </div>
      
      <hr />

      {/* Filter Controls */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "25px", flexWrap: "wrap", alignItems: "center", justifyContent: "center" }}>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="glyph-search"
        />

        {/* Category Dropdown - Glyph Style */}
        <div className="glyph-dropdown" style={{ position: "relative" }}>
          <div className="glyph-dropdown-header">{filterCategory === "all" ? "All Categories" : filterCategory}</div>
          <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px", zIndex: 100, minWidth: "150px" }}>
            <div className="glyph-dropdown-option" onClick={() => setFilterCategory("all")}>All Categories</div>
            {CATS.map(c => (
              <div key={c} className="glyph-dropdown-option" onClick={() => setFilterCategory(c)}>{c}</div>
            ))}
          </div>
        </div>

        {/* Items Per Page Dropdown - Glyph Style */}
        <div className="glyph-dropdown" style={{ position: "relative" }}>
          <div className="glyph-dropdown-header">Show {itemsPerPage} items</div>
          <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px", zIndex: 100 }}>
            {[10, 15, 25, 50, 100].map(n => (
              <div key={n} className="glyph-dropdown-option" onClick={() => setItemsPerPage(n)}>{n} items</div>
            ))}
          </div>
        </div>

      </div>

      {/* Results Summary */}
      <div style={{ textAlign: "center", marginBottom: "15px", opacity: 0.8, fontSize: "14px" }}>
        Showing {paginatedExpenses.length} of {totalItems} expenses
        {(filterCategory !== "all" || searchTerm !== "") ? (
          <span> (filtered) • Total: <strong>${filteredTotal.toFixed(2)}</strong></span>
        ) : (
          <span> • Total: <strong>${grandTotal.toFixed(2)}</strong></span>
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
          {expenses.length > 0
            ? "No expenses match your filters"
            : "No expenses recorded for this period"}
        </p>
      )}

      {/* Clear Filters Button */}
      {(filterCategory !== "all" || searchTerm !== "") && (
        <div className="clear-filters-container">
          <button
            className="clear-filters-btn"
            onClick={() => { setFilterCategory("all"); setSearchTerm(""); }}
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}

return <ExpenseLog />; 

```