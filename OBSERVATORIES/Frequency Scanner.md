---
banner: "![[space.gif]]"
content_starts: "120"
banner_y: 30
banner_height: 450
obsidianUIMode: preview
cssclasses:
  - my-class
  - hide-properties_reading
  - hide-properties_editing
  - dashboard
  - starfield
---

<center><h3 style="color:#ffffff;">Welcome to your</h3></center>
<center><h1 style="color:#ffffff; margin-bottom:20px;">Frequency Scanner</h1></center>
<center><p style="color:#ffffff;">Tune into the celestial archives of your daily logs</p></center>

<br>

```datacorejsx
const BASE_PATH = "Digital Hobonichi";

function FrequencyScannerMinimal() {
  // Navigation State
  const [year, setYear] = dc.useState(window.moment().format("YYYY"));
  const [month, setMonth] = dc.useState(window.moment().format("MM"));

  // Data State
  const [signals, setSignals] = dc.useState([]);
  const [loading, setLoading] = dc.useState(true);
  const [glyphs, setGlyphs] = dc.useState(null);
  const [selectedCategory, setSelectedCategory] = dc.useState("All");
  const [selectedGlyph, setSelectedGlyph] = dc.useState(null);

  // Constants
  const monthLabels = {
    "all": "All Months", "01": "January", "02": "February", "03": "March",
    "04": "April", "05": "May", "06": "June", "07": "July",
    "08": "August", "09": "September", "10": "October", "11": "November", "12": "December"
  };
  const monthOrder = ["all", "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  // Load Data
  dc.useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      
      // 1. Load Glyph Definitions
      const glyphFile = app.vault.getAbstractFileByPath("SYSTEM/_scripts/JSON/Glyphs.json");
      if (!glyphFile) { setLoading(false); return; }
      const glyphContent = await app.vault.read(glyphFile);
      const glyphData = JSON.parse(glyphContent);
      setGlyphs(glyphData);

      // 2. Load Signals from Daily Notes based on Year/Month
      const folderPath = BASE_PATH + "/" + year;
      const files = app.vault.getMarkdownFiles().filter(f => {
        if (!f.path.startsWith(folderPath)) return false;
        if (!/\d{4}-\d{2}-\d{2}\.md$/.test(f.name)) return false;
        if (month !== "all") return f.name.slice(5, 7) === month;
        return true;
      });

      const items = [];
      for (const file of files) {
        const content = await app.vault.read(file);
        const lines = content.split("\n");
        
        for (let i = 0; i < lines.length; i++) {
          // Match lines starting with - [x]
          const match = lines[i].match(/^-\s*\[(.)\]\s*(.+)/);
          if (match) {
            const g = match[1];
            // Only include known glyphs
            if (!glyphData[g]) continue;

            const fullText = match[2];
            // Extract time
            const timeMatch = fullText.match(/^(\d{1,2}:\d{2}\s*(AM|PM)?(\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)?)?)/i);
            const time = timeMatch ? timeMatch[1].trim() : null;
            // Clean text
            const text = fullText.replace(/^(\d{1,2}:\d{2}\s*(AM|PM)?(\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)?)?)\s*\/\/\s*/i, "").trim();
            
            // Check for sub-notes (indented lines below)
            const subNotes = [];
            let j = i + 1;
            while (j < lines.length && /^[\t\s]+-/.test(lines[j])) {
              const subText = lines[j].replace(/^[\t\s]+-\s*(\[[^\]]*\])?\s*/, "").trim();
              if (subText) subNotes.push(subText);
              j++;
            }

            items.push({
              id: `${file.basename}-${i}`,
              date: file.basename,
              file,
              glyph: g,
              category: glyphData[g].category || "Uncategorized",
              text,
              time,
              subNotes
            });
          }
        }
      }
      
      // Sort by date (newest first)
      items.sort((a, b) => b.date.localeCompare(a.date));
      setSignals(items);
      setLoading(false);
    };
    loadAll();
  }, [year, month]); // Re-run when year/month changes

  // --- Components ---

  const GlyphIcon = ({ glyph, size = 16 }) => {
    const info = glyphs?.[glyph];
    if (!info?.icon) return <span>[{glyph}]</span>; 
    return <div style={{ width: size, height: size, minWidth: size, WebkitMaskImage: `url("${info.icon}")`, maskImage: `url("${info.icon}")`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", backgroundColor: info.color }} />; 
  }; 

  const LoadingView = () => ( 
    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", animation: "fadeIn 0.5s ease" }}> 
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>✨</div> 
      <div style={{ fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Aligning Stars...</div> 
    </div> 
  ); 

  if (loading || !glyphs) return <LoadingView />; 

  // --- Logic ---

  // Get list of categories 
  const categories = ["All", ...[...new Set(Object.values(glyphs).map(g => g.category).filter(Boolean))].sort()]; 

  // Filter signals 
  const filteredSignals = signals.filter(s => { 
    if (selectedCategory !== "All" && s.category !== selectedCategory) return false; 
    if (selectedGlyph && s.glyph !== selectedGlyph) return false; 
    return true; 
  }); 

  // Calculate counts for Categories 
  const categoryCounts = signals.reduce((acc, s) => { 
    acc[s.category] = (acc[s.category] || 0) + 1; 
    return acc; 
  }, {}); 

  // Get glyphs for current category selection 
  const availableGlyphs = selectedCategory === "All"  
    ? [...new Set(signals.map(s => s.glyph))] 
    : [...new Set(signals.filter(s => s.category === selectedCategory).map(s => s.glyph))]; 

  // Styles 
  const cardStyle = { 
    background: "rgba(20, 20, 20, 0.1)", 
    borderRadius: "12px", 
    padding: "16px", 
    border: "1px solid rgba(255, 255, 255, 0.1)", 
    backdropFilter: "blur(2.5px)", 
    marginBottom: "20px" 
  }; 

  return ( 
            <div style={{ fontFamily: "var(--font-interface)" }}> 
              <style>{` 
                        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } 
                                .date-link { 
                                  transition: color 0.3s, background-size 0.3s; 
                                  display: inline-block; 
                                  cursor: pointer; 
                                  text-decoration: none; 
                                  background-image: linear-gradient(var(--text-accent), var(--text-accent)); 
                                  background-position: 100% 100%; 
                                  background-repeat: no-repeat; 
                                  background-size: 0% 1px; 
                                  color: var(--text-muted);
                                } 
                                .date-link:hover { 
                                  color: var(--text-accent) !important; 
                                  background-size: 100% 1px; 
                                  background-position: 0% 100%; 
                                }
                                .glyph-btn {
                                  cursor: pointer;
                                  transition: transform 0.1s, opacity 0.1s;
                                  will-change: transform;
                                }
                                .glyph-btn:hover {
                                  transform: scale(1.2);
                                }
                                
                                /* Cosmic Filter Buttons - Mission Control Style */
                                .cosmic-grid-container {
                                  display: flex;
                                  flex-wrap: wrap;
                                  gap: 0px; 
                                  justify-content: flex-start;
                                  margin-bottom: 20px;
                                }
                                
                                .cosmic-grid-container .cosmic-btn {
                                  display: inline-block;
                                  padding: 5px 15px;
                                  margin: 4px 4px;
                                  border-radius: 30px !important;
                                  font-weight: bold;
                                  text-decoration: none !important;
                                  transition: all 0.1s;
                                  background-color: transparent;
                                  border: 2px solid #ffffff !important; /* White like Mission Control */
                                  color: #ffffff !important;
                                  opacity: 0.5; /* Dimmed like unresolved links */
                                  font-size: 11px;
                                  cursor: pointer;
                                  white-space: nowrap;
                                }
                        
                                                        
                
	                            .cosmic-grid-container .cosmic-btn:hover {
                                    opacity: 1;
                                    background-color: #8A5CF5;
                                    border-color: #8A5CF5 !important;
                                    color: #ffffff !important;
                                }
                                                        
                
                                                        
                                .cosmic-grid-container .cosmic-btn.active {
						            opacity: 1;
					                background-color: #8A5CF5;
						            border-color: #8A5CF5 !important;
							        color: #ffffff !important;
							        filter: drop-shadow(0 0 2px #8A6CF5) drop-shadow(0 0 4px #BA9FFF);
					                box-shadow: 0 0 8px rgba(138, 108, 245, 0.6), 0 0 16px rgba(138, 108, 245, 0.3);`}</style> 
                                  {/* 0. Navigation / Filters */}
                          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
                            
                            {/* Year Dropdown */}
                            <div className="glyph-dropdown" style={{ position: "relative" }}>
                              <div className="glyph-dropdown-header">{year}</div>
                              <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px" }}>
                                {["2025", "2026"].map(y => (
                                  <div key={y} className="glyph-dropdown-option" onClick={() => { setYear(y); setSelectedGlyph(null); }}>{y}</div>
                                ))}
                              </div>
                            </div>
                    
                            {/* Month Dropdown */}
                            <div className="glyph-dropdown" style={{ position: "relative" }}>
                              <div className="glyph-dropdown-header">{monthLabels[month]}</div>
                              <div className="glyph-dropdown-options" style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "0", paddingTop: "5px" }}>
                                {monthOrder.map(val => (
                                  <div key={val} className="glyph-dropdown-option" onClick={() => { setMonth(val); setSelectedGlyph(null); }}>{monthLabels[val]}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* 2. Filters */} 
                      <div style={{ ...cardStyle, animation: "fadeInUp 0.3s ease both" }}> 
                        {/* Category Pills (Cosmic Style) */} 
                        <div className="cosmic-grid-container"> 
                          {categories.map(cat => {
                            const count = cat === "All" ? signals.length : (categoryCounts[cat] || 0);
                            if (count === 0) return null;
                            const isActive = selectedCategory === cat;
                            return (
                              <div  
                                key={cat}
                                className={`cosmic-btn ${isActive ? "active" : ""}`}
                                onClick={() => { setSelectedCategory(cat); setSelectedGlyph(null); }} 
                              > 
                                {cat} {cat !== "All" && `(${count})`} 
                              </div> 
                            );
                          })} 
                        </div> 
                
                        {/* Glyph Icons (Filtered by Category) */} 
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", borderTop: "1px solid rgba(255, 255, 255, 0.1)", paddingTop: "16px" }}> 
                          {availableGlyphs.map(g => {
                            const isSelected = selectedGlyph === g;
                            const info = glyphs[g];
                            return (
                              <div  
                                key={g}
                                className="glyph-btn"
                                onClick={() => setSelectedGlyph(isSelected ? null : g)} 
                                title={info.name} 
                                style={{  
                                  opacity: selectedGlyph && !isSelected ? 0.4 : 1, 
                                  transform: isSelected ? "scale(1.3)" : undefined, 
                                  filter: isSelected ? `drop-shadow(0 0 2px ${info.color}) drop-shadow(0 0 4px ${info.color})` : "none"
                                }}
                              > 
                                <GlyphIcon glyph={g} size={24} /> 
                              </div> 
                            );
                          })} 
                        </div> 
                      </div> 
                
                      {/* 3. Signal List */} 
                      <div style={{ ...cardStyle, animation: "fadeInUp 0.3s ease 0.1s both" }}> 
                 
        <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "15px", opacity: 0.8, display: "flex", justifyContent: "space-between" }}> 
          <span>{selectedGlyph ? `${glyphs[selectedGlyph]?.name} Signals` : "All Signals"}</span> 
          <span style={{ fontSize: "12px", opacity: 0.6 }}>{filteredSignals.length} entries</span> 
        </div> 

                        <div style={{ maxHeight: "600px", overflowY: "auto", paddingRight: "5px" }}> 
                          {filteredSignals.map((item, i) => ( 
                            <div  
                              key={item.id} 
                              className="signal-row" 
                              style={{  
                                display: "flex",  
                                flexDirection: "column", 
                                padding: "10px 0",  
                                borderBottom: "1px solid rgba(255, 255, 255, 0.1)", 
                                cursor: "default", 
                                animation: `fadeInUp 0.3s ease ${i * 0.02}s both` 
                              }} 
                            > 
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}> 
                                <div style={{ marginTop: "2px" }}><GlyphIcon glyph={item.glyph} size={18} /></div> 
                                <div style={{ flex: 1, fontSize: "13px", color: "#eee" }}>{item.text}</div> 
                                {/* Metadata - Right Aligned */} 
                                <div style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", marginLeft: "10px" }}> 
                                  <span  
                                    className="date-link"
                                    onClick={() => app.workspace.openLinkText(item.file.path, "", false)} 
                                  > 
                                    {window.moment(item.date).format("MMM D")}
                                  </span> 
                                  {item.time && ` • ${item.time}`}
                                </div> 
                              </div> 
                
                              {/* Sub-notes */} 
                              {item.subNotes.length > 0 && ( 
                                <div style={{ marginLeft: "30px", marginTop: "4px" }}> 
                                  {item.subNotes.map((note, j) => ( 
                                    <div key={j} style={{ fontSize: "12px", color: "var(--text-muted)", padding: "2px 0", display: "flex", alignItems: "flex-start", gap: "6px" }}>
                                      <span style={{ opacity: 0.5 }}>↳</span>
                                      <span>{note}</span>
                                    </div> 
                                  ))} 
                                </div> 
                              )} 
                            </div> 
                          ))} 
                                  {filteredSignals.length === 0 && ( 
                    <div style={{ textAlign: "center", padding: "30px", fontStyle: "italic", color: "var(--text-muted)" }}> 
                      No signals found for this selection. 
                    </div> 
                  )} 
                </div>      </div> 

    </div> 
  ); 
}
return <FrequencyScannerMinimal />; 
```