module.exports = async () => {
  // ==== Helpers ====
  const monthAbbr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const ordinal = (n) => {
    const s = ["th","st","nd","rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  async function getNoteDate(file) {
    const content = await app.vault.read(file);
    const m = content.match(/^\s*date:\s*(\d{4}-\d{2}-\d{2})\s*$/m);
    let d;
    if (m) {
      d = new Date(m[1] + "T00:00:00");
    } else {
      const base = file.basename;
      const m2 = base.match(/^(\d{4}-\d{2}-\d{2})$/);
      d = m2 ? new Date(m2[1] + "T00:00:00") : new Date();
    }
    return d;
  }

  function isNthWeekdayOfMonth(dateObj, weekday, nth) {
    const y = dateObj.getFullYear();
    const m = dateObj.getMonth();
    const first = new Date(y, m, 1);
    const firstDow = first.getDay();
    const firstWanted = 1 + ((weekday - firstDow + 7) % 7);
    const targetDom = firstWanted + 7 * (nth - 1);
    return dateObj.getDate() === targetDom;
  }

  function isoWeek(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
  }

  function prettyWhen(dateObj, timeStr) {
    const mon = monthAbbr[dateObj.getMonth()];
    const day = ordinal(dateObj.getDate());
    const year = dateObj.getFullYear();
    return `(@${mon} ${day}, ${year} ${timeStr})`;
  }

  // ==== Rules ====
  const rules = [
    { type: "weekly", weekday: 2, time: "10:00am", label: "Trends Meeting #work" },
    { type: "weekly", weekday: 3, time: "10:00am", label: "Design Focus Time #work" },
    { type: "nthWeekdayOfMonth", weekday: 3, nth: 1, time: "12:00pm", label: "Check-in w/ Nikki #work" },
    { type: "biweekly", weekday: 2, anchor: "2025-09-09", time: "3:00pm", label: "Bi-Weekly Design Meeting #work" },
  ];

  const file = app.workspace.getActiveFile();
  if (!file) {
    console.error("🚨 No active file found.");
    return;
  }

  const noteDate = await getNoteDate(file);
  const day = noteDate.getDay();

  let content = await app.vault.read(file);
  let lines = content.split("\n");

  const headingIndex = lines.findIndex(line =>
    line.trim().toLowerCase().startsWith(">> ## :licalendarcheck: events")
  );
  if (headingIndex === -1) {
    console.error("🚨 Could not find '>> ## :LiCalendarCheck: Events' heading.");
    return;
  }

  let insertIndex = headingIndex + 1;
  while (
    insertIndex < lines.length &&
    lines[insertIndex].trim() !== "" &&
    !lines[insertIndex].startsWith(">> ##") &&
    !lines[insertIndex].startsWith("## ")
  ) {
    lines.splice(insertIndex, 1);
  }

  const todayEvents = [];
  for (const r of rules) {
    if (r.type === "weekly" && day === r.weekday) {
      todayEvents.push(`>> - [ ] ${r.label} ${prettyWhen(noteDate, r.time)}`);
    } else if (r.type === "nthWeekdayOfMonth") {
      if (isNthWeekdayOfMonth(noteDate, r.weekday, r.nth)) {
        todayEvents.push(`>> - [ ] ${r.label} ${prettyWhen(noteDate, r.time)}`);
      }
    } else if (r.type === "biweekly" && day === r.weekday) {
      const anchor = new Date(r.anchor + "T00:00:00");
      const sameParity = (isoWeek(noteDate) - isoWeek(anchor) + 5200) % 2 === 0;
      if (sameParity) {
        todayEvents.push(`>> - [ ] ${r.label} ${prettyWhen(noteDate, r.time)}`);
      }
    }
  }

  if (todayEvents.length > 0) {
    lines.splice(insertIndex, 0, ...todayEvents);
    console.log("📅 Injected recurring events:", todayEvents);
  } else {
    lines.splice(insertIndex, 0, ">> No events today");
    console.log("🛏 No recurring events — placeholder added.");
  }

  const updated = lines.join("\n");
  await app.vault.modify(file, updated);
};