const WeatherDashboard = ({ year, month, monthName }) => { 
  const MONTH_FOLDER = `${month}-${monthName}`; 
  const FOLDER_PATH = `Digital Hobonichi/${year}/${MONTH_FOLDER}`; 

  const [temps, setTemps] = dc.useState([]); 
  const [loading, setLoading] = dc.useState(true); 
  const lineChartRef = dc.useRef(null); 

  dc.useEffect(() => { 
    const loadWeather = async () => { 
      const files = app.vault.getMarkdownFiles().filter(f => 
        f.path.startsWith(FOLDER_PATH) && /\d{4}-\d{2}-\d{2}\.md$/.test(f.name) 
      ); 

      const data = []; 
      for (const file of files) { 
        const content = await app.vault.read(file); 
        const tempMatch = content.match(/(-?\d+)°F\s*•\s*(-?\d+)°F/); 
        if (tempMatch) { 
          const day = parseInt(file.basename.slice(-2)); 
          const label = window.moment(file.basename, "YYYY-MM-DD").format("MMM D"); 
          const conditionMatch = content.match(/<br>(\p{Emoji})\s*([^<]+)<\/font>/u); 
          const emoji = conditionMatch ? conditionMatch[1] : null; 
          const condition = conditionMatch ? conditionMatch[2].trim() : null; 
          data.push({ 
            day, 
            label, 
            low: parseInt(tempMatch[1]), 
            high: parseInt(tempMatch[2]), 
            emoji, 
            condition 
          }); 
        } 
      } 
      data.sort((a, b) => a.day - b.day); 
      setTemps(data); 
      setLoading(false); 
    }; 
    loadWeather(); 
  }, []); 

  // Render chart when data loads 
  dc.useEffect(() => { 
    if (!temps.length || !lineChartRef.current || !window.renderChart) return; 

    lineChartRef.current.innerHTML = ""; 
    const labels = temps.map(t => t.label); 

    window.renderChart({ 
      type: "line", 
      data: { 
        labels, 
        datasets: [ 
          { 
            label: "High", 
            data: temps.map(t => t.high), 
            borderColor: "#ff4444", 
            backgroundColor: "rgba(255, 68, 68, 0.1)", 
            fill: false, 
            tension: 0.4, 
            pointRadius: 4, 
            pointHoverRadius: 6, 
            borderWidth: 2.5 
          }, 
          { 
            label: "Low", 
            data: temps.map(t => t.low), 
            borderColor: "#60a5fa", 
            backgroundColor: "rgba(96, 165, 250, 0.1)", 
            fill: false, 
            tension: 0.4, 
            pointRadius: 4, 
            pointHoverRadius: 6, 
            borderWidth: 2.5 
          }, 
          { 
            label: "Daily Avg", 
            data: temps.map(t => Math.round((t.high + t.low) / 2)), 
            borderColor: "#a855f7", 
            borderDash: [5, 5], 
            fill: false, 
            tension: 0.4, 
            pointRadius: 0, 
            borderWidth: 1.5 
          } 
        ] 
      }, 
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        interaction: { 
          mode: "index", 
          intersect: false 
        }, 
        plugins: { 
          legend: { display: false }, 
          tooltip: { 
            backgroundColor: "rgba(0,0,0,0.8)", 
            titleFont: { size: 13 }, 
            bodyFont: { size: 12 }, 
            padding: 10, 
            callbacks: { 
              label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}°F` 
            } 
          } 
        }, 
        scales: { 
          x: { 
            ticks: { color: "#ffffff", font: { size: 10 } }, 
            grid: { display: false } 
          }, 
          y: { 
            ticks: { 
              color: "#ffffff", 
              font: { size: 10 }, 
              callback: (v) => v + "°" 
            }, 
            grid: { color: "rgba(255,255,255,0.1)" } 
          } 
        } 
      } 
    }, lineChartRef.current); 
  }, [temps]); 

  const cardStyle = { 
    flex: 1, 
    minWidth: "120px", 
    background: "rgba(20, 20, 20, 0.1)", 
    borderRadius: "12px", 
    padding: "16px 20px", 
    textAlign: "center", 
    border: "1px solid rgba(255, 255, 255, 0.1)", 
    backdropFilter: "blur(2.5px)", 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    justifyContent: "center" 
  }; 

  if (loading) return ( 
    <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", animation: "fadeIn 0.5s ease" }}> 
      <div style={{ fontSize: "24px", marginBottom: "10px" }}>✨</div> 
      <div style={{ fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Aligning Stars...</div> 
    </div> 
  ); 
  
  if (temps.length === 0) { return (
    <div style={{ ...cardStyle, textAlign: "center", padding: "30px" }}>
      <p style={{ margin: 0, color: "var(--text-faint)", fontStyle: "italic" }}>No weather data located for this month</p>
    </div>
    )
  }

  // Calculate stats 
  const avgLow = Math.round(temps.reduce((a, t) => a + t.low, 0) / temps.length); 
  const avgHigh = Math.round(temps.reduce((a, t) => a + t.high, 0) / temps.length); 
  const coldest = temps.reduce((min, t) => t.low < min.low ? t : min, temps[0]); 
  const warmest = temps.reduce((max, t) => t.high > max.high ? t : max, temps[0]); 

  // Count weather conditions by emoji 
  const conditionCounts = temps.reduce((acc, t) => { 
    if (t.emoji) { 
      acc[t.emoji] = acc[t.emoji] || { count: 0, condition: t.condition }; 
      acc[t.emoji].count++; 
    } 
    return acc; 
  }, {}); 
  const sortedConditions = Object.entries(conditionCounts).sort((a, b) => b[1].count - a[1].count); 

  const valueStyle = { 
    fontSize: "24px", 
    fontWeight: "bold", 
    marginBottom: "4px" 
  }; 

  const labelStyle = { 
    fontSize: "11px", 
    opacity: 0.7, 
    textTransform: "uppercase", 
    letterSpacing: "0.5px" 
  }; 

  return ( 
    <div style={{ fontFamily: "var(--font-interface)" }}> 
      {/* Stat Cards */} 
      <div style={{ display: "flex", gap: "25px", marginBottom: "20px", flexWrap: "wrap" }}> 
        <div style={cardStyle}> 
          <div style={{ ...valueStyle, color: "var(--text-accent)" }}>{avgLow}°F — {avgHigh}°F</div> 
          <div style={labelStyle}>Average</div> 
        </div> 
        <div style={cardStyle}> 
          <div style={{ ...valueStyle, color: "#60a5fa" }}>{coldest.low}°F</div> 
          <div style={labelStyle}>Coldest ({coldest.label})</div> 
        </div> 
        <div style={cardStyle}> 
          <div style={{ ...valueStyle, color: "#ff4444" }}>{warmest.high}°F</div> 
          <div style={labelStyle}>Warmest ({warmest.label})</div> 
        </div> 
        <div style={cardStyle}> 
          <div style={{ ...valueStyle, color: "var(--text-accent)" }}>{temps.length}</div> 
          <div style={labelStyle}>Days Tracked</div> 
        </div> 
      </div> 

      {/* Line Graph */} 
      <div style={{ 
        background: "rgba(20, 20, 20, 0.1)", 
        borderRadius: "12px", 
        padding: "16px", 
        border: "1px solid rgba(255, 255, 255, 0.1)", 
        backdropFilter: "blur(2.5px)", 
        marginBottom: "20px" 
      }}> 
        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}> 
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}> 
            <div style={{ width: "12px", height: "3px", background: "#ff4444", borderRadius: "2px" }} /> 
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>High</span> 
          </div> 
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}> 
            <div style={{ width: "12px", height: "3px", background: "#60a5fa", borderRadius: "2px" }} /> 
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Low</span> 
          </div> 
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}> 
            <div style={{ width: "12px", height: "3px", background: "#a855f7", borderRadius: "2px", borderTop: "1px dashed #a855f7" }} /> 
            <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>Daily Avg</span> 
          </div> 
        </div> 
        <div ref={lineChartRef} style={{ height: "140px" }} /> 
      </div> 

      {/* Weather Conditions Breakdown */} 
      {sortedConditions.length > 0 && (() => { 
        const conditionLabels = { 
          "☀️": "Sunny", "☀": "Sunny", "🔆": "Sunny", "🌤️": "Mostly Sunny", "🌤": "Mostly Sunny", 
          "⛅": "Partly Cloudy", "⛅️": "Partly Cloudy", "🌥️": "Mostly Cloudy", "🌥": "Mostly Cloudy", 
          "☁️": "Cloudy", "☁": "Cloudy", "🌧️": "Rain", "🌧": "Rain", 
          "🌦️": "Showers", "🌦": "Showers", "⛈️": "Thunderstorm", "⛈": "Thunderstorm", 
          "🌨️": "Snow", "🌨": "Snow", "❄️": "Snow", "❄": "Snow", 
          "🌫️": "Fog", "🌫": "Fog", "💨": "Windy", "🌪️": "Tornado", "🌪": "Tornado" 
        }; 
        return ( 
          <div style={{ display: "flex", gap: "25px", flexWrap: "wrap" }}> 
            {sortedConditions.map(([emoji, data]) => ( 
              <div key={emoji} style={{ ...cardStyle, padding: "16px", gap: "4px", minWidth: "80px" }}> 
                <span style={{ fontSize: "28px" }}>{emoji}</span> 
                <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--text-accent)" }}>{data.count}</div> 
                <div style={labelStyle}>{(conditionLabels[emoji] || "WEATHER").toUpperCase()} {data.count === 1 ? "DAY" : "DAYS"}</div> 
              </div> 
            ))} 
          </div> 
        ); 
      })()} 
    </div> 
  ); 
} 
return { WeatherDashboard };