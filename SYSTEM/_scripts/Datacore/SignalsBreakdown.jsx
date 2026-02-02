const SignalsBreakdown = ({ year, month, monthName }) => { 
  const MONTH_FOLDER = `${month}-${monthName}`;
  const FOLDER_PATH = `Digital Hobonichi/${year}/${MONTH_FOLDER}`;

  const [signals, setSignals] = dc.useState([]); 
  const [loading, setLoading] = dc.useState(true); 
  const [glyphs, setGlyphs] = dc.useState(null); 
  const [selectedGlyph, setSelectedGlyph] = dc.useState(null); 
  const [hoveredGlyph, setHoveredGlyph] = dc.useState(null);

  // Load Data 
  dc.useEffect(() => { 
    const loadAll = async () => { 
      const glyphFile = app.vault.getAbstractFileByPath("SYSTEM/_scripts/JSON/Glyphs.json"); 
      if (!glyphFile) { setLoading(false); return; } 
      const glyphContent = await app.vault.read(glyphFile); 
      const glyphData = JSON.parse(glyphContent); 
      setGlyphs(glyphData);

      const files = app.vault.getMarkdownFiles().filter(f => 
        f.path.startsWith(FOLDER_PATH) && /\d{4}-\d{2}-\d{2}\.md$/.test(f.name) 
      );

      const items = []; 
      for (const file of files) { 
        const content = await app.vault.read(file);
        const lines = content.split("\n"); 
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          // We only process NON-INDENTED lines as potential parents.
          const match = line.match(/^-\s*\[(.)\]\s*(.+)/);
          
          if (match) {
              // This is a top-level signal. Process it.
              const g = match[1];
              if (!glyphData[g]) continue;
      
              const fullText = match[2];
              const timeMatch = fullText.match(/^(\d{1,2}:\d{2}\s*(AM|PM)?(\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)?)?)/i);
              const time = timeMatch ? timeMatch[1].trim() : null;
              const text = fullText.replace(/^(\d{1,2}:\d{2}\s*(AM|PM)?(\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)?)?)\s*\/\/\s*/i, "").trim();
      
              const subNotes = [];
              let j = i + 1;
      
              // Look ahead for sub-items
              while (j < lines.length && /^[\t\s]+-/.test(lines[j])) {
                  const subLine = lines[j];
                  const subSignalMatch = subLine.match(/^[\t\s]*-\s*\[(.)\]\s*(.+)/);
      
                  if (subSignalMatch) {
                      // This is an indented signal. Process it as a top-level item.
                      const subG = subSignalMatch[1];
                      if (glyphData[subG]) {
                          const subFullText = subSignalMatch[2];
                          const subTimeMatch = subFullText.match(/^(\d{1,2}:\d{2}\s*(AM|PM)?(\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)?)?)/i);
                          const subTime = subTimeMatch ? subTimeMatch[1].trim() : null;
                          const subTextContent = subFullText.replace(/^(\d{1,2}:\d{2}\s*(AM|PM)?(\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)?)?)\s*\/\/\s*/i, "").trim();
      
                          items.push({
                              id: `${file.basename}-${j}`,
                              date: file.basename,
                              file,
                              glyph: subG,
                              category: glyphData[subG].category || "Uncategorized",
                              text: subTextContent,
                              time: subTime,
                              subNotes: [] // Indented signals don't have their own sub-notes for simplicity
                          });
                      }
                  } else {
                      // This is a plain sub-note for the parent.
                      const subText = subLine.replace(/^[\t\s]+-\s*/, "").trim();
                      if (subText) subNotes.push(subText);
                  }
                  j++;
              }
      
              // Push the parent signal.
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
      
              // Skip the processed sub-lines
              i = j - 1;
          }
        }
      } 
      
      items.sort((a, b) => b.date.localeCompare(a.date)); 
      setSignals(items); 
      setLoading(false); 
    };
    loadAll(); 
  }, []); 

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

  const activitySignals = signals.filter(s => 
    ["Activities", "Health", "Communication", "People", "Personal"].includes(s.category)
  );
  const activityGlyphGroups = activitySignals.reduce((acc, s) => {
    acc[s.glyph] = (acc[s.glyph] || 0) + 1;
    return acc;
  }, {});
  const topActivityGlyphEntry = Object.entries(activityGlyphGroups)
    .sort((a, b) => b[1] - a[1])[0];

  const glyphGroups = signals.reduce((acc, s) => {
    acc[s.glyph] = (acc[s.glyph] || 0) + 1;
    return acc;
  }, {});

  const sortedGlyphs = Object.entries(glyphGroups)
    .sort((a, b) => b[1] - a[1]);

  const displaySignals = selectedGlyph 
    ? signals.filter(s => s.glyph === selectedGlyph) 
    : []; 

  // Styles 
  const cardStyle = { 
    background: "rgba(20, 20, 20, 0.1)", 
    borderRadius: "12px", 
    padding: "16px", 
    border: "1px solid rgba(255, 255, 255, 0.1)", 
    backdropFilter: "blur(2.5px)"
  }; 
  
  const getGlowStyle = (color) => `0 0 12px ${color}99, 0 0 24px ${color}99`;

  return ( 
    <div style={{ fontFamily: "var(--font-interface)" }}> 
      <style>{` 
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } 
        .date-link { 
          transition: color 0.5s ease-in-out, background-size 0.3s ease-in-out; 
          display: inline-block; 
          cursor: pointer; 
          text-decoration: none; 
          background-image: linear-gradient(var(--text-accent), var(--text-accent)); 
          background-position: 100% 100%; 
          background-repeat: no-repeat; 
          background-size: 0% 1px; 
        } 
        .date-link:hover { 
          color: var(--text-accent) !important; 
          background-size: 100% 1px; 
          background-position: 0% 100%; 
        } 
      `}</style> 

      {/* 1. Summary Header */} 
      <div style={{ display: "flex", gap: "20px", marginBottom: "20px", flexWrap: "wrap" }}> 
        <div style={{ ...cardStyle, flex: 1, minWidth: "120px", textAlign: "center", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}> 
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--text-accent)" }}>{sortedGlyphs.length}</div> 
          <div style={{ fontSize: "10px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px" }}>Total Activities</div> 
        </div> 
        {topActivityGlyphEntry && (() => { 
           const [glyph, count] = topActivityGlyphEntry;
           const info = glyphs[glyph];
           return (
             <div style={{ ...cardStyle, flex: 1, minWidth: "120px", textAlign: "center", padding: "20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" }}>
               <GlyphIcon glyph={glyph} size={28} />
               <div style={{ fontSize: "14px", fontWeight: "600", color: info?.color || "var(--text-accent)" }}>{info?.name}</div>
               <div style={{ fontSize: "10px", opacity: 0.7, textTransform: "uppercase", letterSpacing: "0.5px" }}>Top Activity</div>
             </div>
           );
        })()}
      </div> 

      {/* 2. Glyph Cards Grid */} 
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", 
        gap: "20px", 
        marginBottom: "20px" 
      }}> 
        {sortedGlyphs.map(([glyph, count], idx) => { 
          const info = glyphs[glyph];
          const isSelected = selectedGlyph === glyph;
          const isHovered = hoveredGlyph === glyph;
          const pct = Math.round((count / signals.length) * 100);
          
          const dynamicStyle = {
            ...cardStyle,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            cursor: "pointer",
            border: isSelected ? `2px solid ${info?.color || "var(--interactive-accent)"}` : "1px solid rgba(255, 255, 255, 0.1)",
            background: isSelected ? "rgba(255, 255, 255, 0.1)" : (isHovered ? "rgba(255, 255, 255, 0.05)" : "rgba(20, 20, 20, 0.05)"),
            transition: "all 0.2s ease",
            animation: `fadeInUp 0.4s ease ${idx * 0.03}s both`,
            transform: isHovered && !isSelected ? "translateY(-3px)" : "",
            boxShadow: (isHovered && !isSelected) || isSelected ? getGlowStyle(info?.color || "var(--interactive-accent)") : ""
          };
          
          return (
            <div 
              key={glyph} 
              onClick={() => setSelectedGlyph(isSelected ? null : glyph)}
              onMouseEnter={() => setHoveredGlyph(glyph)}
              onMouseLeave={() => setHoveredGlyph(null)}
              style={dynamicStyle}
            >
              <GlyphIcon glyph={glyph} size={28} />
              <div style={{ fontSize: "20px", fontWeight: "bold", color: info?.color }}>{count}</div>
              <div style={{ fontSize: "11px", opacity: 0.7, textAlign: "center", lineHeight: "1.2" }}>{info?.name}</div>
              <div style={{ fontSize: "10px", color: "var(--text-muted)", opacity: 0.8 }}>{pct}%</div>
            </div>
          );
        })}
      </div>

      {/* 3. Signal List (Conditional) */} 
      {selectedGlyph ? (
      <div style={{ ...cardStyle, animation: "fadeInUp 0.3s ease-out both" }}> 
        <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "15px", opacity: 0.8, display: "flex", justifyContent: "space-between", alignItems: "center" }}> 
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
             <GlyphIcon glyph={selectedGlyph} size={18} />
             <span>{glyphs[selectedGlyph]?.name} Signals</span>
          </div>
          <span style={{ fontSize: "12px", opacity: 0.6 }}>{displaySignals.length} entries</span> 
        </div> 

        <div style={{ maxHeight: "400px", overflowY: "auto", paddingRight: "5px" }}> 
          {displaySignals.map((item, i) => (
            <div  
              key={item.id}
              style={{
                padding: "10px 0",
                borderBottom: i < displaySignals.length - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <GlyphIcon glyph={item.glyph} size={18} />
                <span style={{ flex: 1, fontSize: "13px" }}>{item.text}</span>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap", marginLeft: "10px" }}>
                  <span 
                    className="date-link"
                    onClick={() => app.workspace.openLinkText(item.file.path, "", false)}
                    style={{ color: "var(--text-muted)" }}
                  >
                    {monthName.slice(0, 3)} {item.date.slice(-2)}
                  </span>
                  {item.time && ` • ${item.time}`}
                </span>
              </div>
              {item.subNotes?.length > 0 && (
                <div style={{ marginLeft: "30px", marginTop: "6px" }}>
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
        </div>
      </div> 
      ) : (
        <div style={{ ...cardStyle, textAlign: "center", padding: "30px", animation: "fadeIn 0.15s ease both" }}> 
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>Choose a card above to view its signals</p> 
        </div> 
      )}

    </div> 
  );
}
return { SignalsBreakdown };