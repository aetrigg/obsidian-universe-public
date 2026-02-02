const SignalCalendar = ({ year, month, monthName }) => {
  const MONTH_FOLDER = `${month}-${monthName}`;
  const FOLDER_PATH = `Digital Hobonichi/${year}/${MONTH_FOLDER}`;
  const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const [glyphs, setGlyphs] = dc.useState(null);
  const [dayData, setDayData] = dc.useState({});
  const [selectedDay, setSelectedDay] = dc.useState(null);
  const [loading, setLoading] = dc.useState(true);

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

      const data = {};
      for (const file of files) {
        const day = parseInt(file.basename.slice(-2));
        const content = await app.vault.read(file);
        const glyphMatches = content.match(/^-\s*\[([^\]]+)\]/gm) || [];
        const glyphList = glyphMatches.map(m => {
          const match = m.match(/\s*\[(.)\]/);
          return match ? match[1] : null;
        }).filter(g => g && glyphData[g]);

        const glyphCounts = glyphList.reduce((acc, g) => {
          acc[g] = (acc[g] || 0) + 1;
          return acc;
        }, {});

        const entries = [];
        for (const line of content.split("\n")) {
          const match = line.match(/^-\s*\[(.)\]\s*(.+)/);
          if (match && glyphData[match[1]]) {
            const timeMatch = match[2].match(/^(\d{1,2}:\d{2}\s*(AM|PM)?(\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)?)?)/i);
            const time = timeMatch ? timeMatch[1].trim() : null;
            const text = match[2].replace(/^\d{1,2}:\d{2}\s*(AM|PM)?(\s*-\s*\d{1,2}:\d{2}\s*(AM|PM)?)?\s*\/\/\s*/i, "").trim();
            entries.push({ glyph: match[1], text, time });
          }
        }

        data[day] = { file, glyphCounts, entries, totalGlyphs: glyphList.length };
      }

      setDayData(data);
      setLoading(false);
    };
    loadAll();
  }, []);

  const GlyphIcon = ({ glyph, size = 16 }) => {
    const info = glyphs?.[glyph];
    if (!info?.icon) return <span style={{ fontFamily: "monospace" }}>[{glyph}]</span>;
    return <div style={{ width: size, height: size, minWidth: size, WebkitMaskImage: `url("${info.icon}")`, maskImage: `url("${info.icon}")`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center", backgroundColor: info.color }} />;
  };

  // Loading Component
  const LoadingView = () => (
    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", animation: "fadeIn 0.5s ease" }}>
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>✨</div>
      <div style={{ fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Aligning Stars...</div>
    </div>
  );

  if (loading) return <LoadingView />;

  // Calculate stats
  const daysLogged = Object.keys(dayData).length;
  const totalEntries = Object.values(dayData).reduce((sum, d) => sum + d.totalGlyphs, 0);
  const mostActiveDay = Object.entries(dayData).reduce((max, [day, d]) =>
    d.totalGlyphs > (max.count || 0) ? { day: parseInt(day), count: d.totalGlyphs } : max, { day: null, count: 0 }
  );
  const avgPerDay = daysLogged > 0 ? Math.round(totalEntries / daysLogged) : 0;

  // Calendar grid (Monday = 0, Sunday = 6)
  const firstDay = (new Date(parseInt(year), parseInt(month) - 1, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === parseInt(year) && today.getMonth() === parseInt(month) - 1;
  const todayDate = isCurrentMonth ? today.getDate() : null;

  const weeks = [];
  let currentWeek = new Array(firstDay).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    currentWeek.push(day);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null);
    weeks.push(currentWeek);
  }

  const selectedData = selectedDay ? dayData[selectedDay] : null;

  // Animation keyframes
  const animStyles = ` 
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  `;

  // Styles
  const cardStyle = {
    background: "rgba(20, 20, 20, 0.1)",
    borderRadius: "12px",
    padding: "16px 20px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(2.5px)",
    transition: "transform 0.2s ease, box-shadow 0.2s ease"
  };

  const statCardStyle = (delay) => ({
    ...cardStyle,
    flex: 1,
    minWidth: "100px",
    textAlign: "center",
    animation: `fadeInUp 0.4s ease ${delay}s both`,
    cursor: "default"
  });

  const valueStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "var(--text-accent)",
    marginBottom: "5px"
  };

  const labelStyle = {
    fontSize: "11px",
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  };

  return (
    <div style={{ fontFamily: "var(--font-interface)" }}>
      <style>{animStyles}</style>

      {/* Stat Cards */}
      <div style={{ display: "flex", gap: "25px", marginBottom: "20px", flexWrap: "wrap" }}>
        <div style={statCardStyle(0)}>
          <div style={valueStyle}>{daysLogged}</div>
          <div style={labelStyle}>Days w/ Signals</div>
        </div>
        <div style={statCardStyle(0.1)}>
          <div style={valueStyle}>{totalEntries}</div>
          <div style={labelStyle}>Total Signals</div>
        </div>
        <div style={statCardStyle(0.2)}>
          <div style={valueStyle}>{avgPerDay}</div>
          <div style={labelStyle}>Avg / Day</div>
        </div>
        <div style={statCardStyle(0.3)}>
          <div style={valueStyle}>{mostActiveDay.day ? `${monthName.substring(0,3)} ${mostActiveDay.day}` : "—"}</div>
          <div style={labelStyle}>Most Signals</div>
        </div>
      </div>

      {/* Calendar Card */}
      <div style={{ ...cardStyle, marginBottom: "20px", animation: "fadeInUp 0.5s ease 0.2s both" }}>
        {/* Calendar Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px" }}>
          {/* Day headers */}
          {DAYS_OF_WEEK.map((day, i) => (
            <div key={day} style={{ textAlign: "center", fontSize: "11px", color: "var(--text-muted)", padding: "8px 0", fontWeight: "600" }}>{day}</div>
          ))}

          {/* Calendar days */}
          {weeks.flat().map((day, idx) => {
            if (!day) return <div key={idx} style={{ padding: "10px" }} />;

            const hasData = dayData[day];
            const isSelected = selectedDay === day;
            const isToday = day === todayDate;

            return (
              <div
                key={idx}
                onClick={() => hasData && setSelectedDay(isSelected ? null : day)}
                style={{
                  padding: "10px 4px",
                  textAlign: "center",
                  borderRadius: "8px",
                  cursor: hasData ? "pointer" : "default",
                  background: isSelected ? "var(--interactive-accent)" : (isToday ? "var(--background-primary)" : "transparent"),
                  color: isSelected ? "#fff" : (hasData ? "var(--text-normal)" : "var(--text-faint)"),
                  border: isToday && !isSelected ? "2px solid var(--interactive-accent)" : "2px solid transparent",
                  transition: "all 0.2s ease"
                }}
                onMouseEnter={e => { if (hasData && !isSelected) { e.currentTarget.style.background = "var(--background-modifier-hover)"; e.currentTarget.style.transform = "scale(1.05)"; }}}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; if (hasData && !isSelected) { e.currentTarget.style.background = isToday ? "var(--background-primary)" : "transparent"; }}}
              >
                <div style={{ fontSize: "14px", fontWeight: hasData ? "600" : "normal" }}>{day}</div>
                {hasData && (
                  <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginTop: "4px" }}>
                    {Object.keys(hasData.glyphCounts).slice(0, 4).map((g, i) => (
                      <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: isSelected ? "#fff" : (glyphs[g]?.color || "#888"), transition: "transform 0.2s ease" }} />
                    ))}
                    {Object.keys(hasData.glyphCounts).length > 4 && (
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: isSelected ? "#fff" : "var(--text-muted)" }} />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedData && (
        <div style={{ ...cardStyle, animation: "fadeInUp 0.5s ease both" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
            <div style={{ fontSize: "14px", fontWeight: "600", opacity: 0.8 }}>
              {monthName} {selectedDay}, {year}
            </div>
            <button
              onClick={() => app.workspace.openLinkText(selectedData.file.path, "", false)}
              style={{ padding: "6px 14px", borderRadius: "6px", border: "none", background: "var(--interactive-accent)", color: "#fff", cursor: "pointer", fontSize: "12px", fontWeight: "500", transition: "transform 0.15s ease, box-shadow 0.15s ease" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
            >
              Open Daily Star
            </button>
          </div>

          {/* Glyph summary */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "15px" }}>
            {Object.entries(selectedData.glyphCounts).map(([glyph, count], i) => (
              <div key={glyph} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 12px", background: "transparent", borderRadius: "30px", border: `2px solid ${glyphs[glyph]?.color || "#888"}` }}>
                <GlyphIcon glyph={glyph} size={16} />
                <span style={{ fontSize: "12px", color: "#fff" }}>{glyphs[glyph]?.name}</span>
                {count > 1 && <span style={{ fontSize: "11px", fontWeight: "600", color: glyphs[glyph]?.color }}>{count}</span>}
              </div>
            ))}
          </div>

          {/* Entry list */}
          <div style={{ maxHeight: "200px", overflowY: "auto" }}>
            {selectedData.entries.slice(0, 10).map((entry, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 0", borderBottom: i < Math.min(selectedData.entries.length, 10) - 1 ? "1px solid rgba(255, 255, 255, 0.1)" : "none" }}>
                <GlyphIcon glyph={entry.glyph} size={16} />
                <span style={{ fontSize: "13px", lineHeight: "1.4", flex: 1 }}>{entry.text}</span>
                {entry.time && <span style={{ fontSize: "11px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{entry.time}</span>}
              </div>
            ))}
            {selectedData.entries.length > 10 && (
              <p style={{ color: "var(--text-muted)", fontSize: "12px", textAlign: "center", marginTop: "10px" }}>
                +{selectedData.entries.length - 10} more entries...
              </p>
            )}
          </div>
        </div>
      )}

      {/* No selection prompt */}
      {!selectedData && daysLogged > 0 && (
        <div style={{ ...cardStyle, textAlign: "center", padding: "30px", animation: "fadeIn 0.15s ease both" }}>
          <p style={{ margin: 0, fontSize: "14px", color: "var(--text-muted)" }}>Choose a day on the calendar to see its signals</p>
        </div>
      )}
    </div>
  );
}
return { SignalCalendar };