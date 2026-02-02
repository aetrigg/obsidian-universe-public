---
banner: "![[blue-space.gif]]"
content_starts: 1
banner_y: 80
banner_height: 400
month: <% tp.file.title %>
tags: 
  - monthly 
  - <% tp.date.now("YYYY", 0, tp.file.title, "MMMM YYYY") %>
cssclasses: 
  - my-class 
  - hide-properties_reading 
  - hide-properties_editing 
  - starfield
  - glowing-stars
  - daily-note
journal: Monthly Journal
date_created: <% tp.date.now("YYYY-MM-01", 0, tp.file.title, "MMMM YYYY") %>
---

<%*
// Shared Variables
const title = tp.file.title;
let base = window.moment(title, "MMMM YYYY", true);
if (!base.isValid()) base = window.moment();

const year = base.format("YYYY");
const month = base.format("MM");
const monthName = base.format("MMMM");
const quarter = "Q" + base.quarter();

const prevMonth = base.clone().subtract(1, 'month');
const nextMonth = base.clone().add(1, 'month');

const prevPath = `Digital Hobonichi/${prevMonth.format("YYYY")}/Monthly Overview/${prevMonth.format("MMMM YYYY")}.md`;
const prevLabel = prevMonth.format("MMM");

const nextPath = `Digital Hobonichi/${nextMonth.format("YYYY")}/Monthly Overview/${nextMonth.format("MMMM YYYY")}.md`;
const nextLabel = nextMonth.format("MMM");

const yearPath = `Digital Hobonichi/${year}/Yearly Overview.md`;
%>

```datacorejsx 
const { QuickLinks } = await dc.require("SYSTEM/_scripts/Datacore/QuickLinks.jsx");
return <QuickLinks />;
```

<br>

<center><h3><font color="#ffffff">Hello, Andrea! It is</font></h3></center>
<center><h1 class="title-margin"><font color="#ffffff"><u><% monthName %> <% year %></u></font></h1></center>
<br>

> [!navblock] 
> [[<% prevPath %>|<% prevLabel %>]] ← [[<% yearPath %>|<% year %>]] `$="[[Digital Hobonichi/" + moment().format("YYYY") + "/" + moment().format("MM-MMMM") + "/" + moment().format("YYYY-MM-DD") + ".md|Today]]"` → [[<% nextPath %>|<% nextLabel %>]] 
> 
> `$=dv.paragraph((() => { const m = moment("<% year %>-<% month %>-01"); const weeks = []; let w = m.clone().startOf('month'); const end = m.clone().endOf('month'); while (w.isSameOrBefore(end)) { const wk = w.isoWeek(); const yr = w.isoWeekYear(); if (!weeks.find(x => x.w === wk && x.y === yr)) weeks.push({w: wk, y: yr}); w.add(1, 'week'); } return weeks.map(x => "[[Digital Hobonichi/" + x.y + "/Weekly Overview/" + x.y + "-W" + String(x.w).padStart(2,'0') + ".canvas|W" + x.w + "]]" ).join(" "); })())`

`BUTTON[banner-image]`

```meta-bind-button 
label: "" 
icon: "image" 
style: plain 
class: "home-buttons" 
cssStyle: "" 
backgroundImage: "" 
tooltip: "Change Banner" 
id: banner-image 
hidden: true 
actions: 
  - type: command 
    command: pexels-banner:set-banner-image 

```

```meta-bind-button 
label: "" 
icon: "chart-pie" 
style: plain 
class: "home-buttons" 
cssStyle: "" 
backgroundImage: "" 
tooltip: "Update Ratings" 
id: update-ratings 
hidden: true 
actions: 
  - type: inlineJS 
    code: "window.dispatchEvent(new CustomEvent('open-l10-modal'))" 

```

<br>
<div id="signal-calendar-target" style="position: absolute; scroll-margin-top: 200px;"></div>

<center><h2 id="signal-calendar" style="margin-bottom:20px; letter-spacing:15px;"><font color="#ffffff">signal calendar</font></h2></center>


```datacorejsx 
const { SignalCalendar } = await dc.require("SYSTEM/_scripts/Datacore/SignalCalendar.jsx");
return <SignalCalendar year="<% year %>" month="<% month %>" monthName="<% monthName %>" />;
```

<br>

---
<br>
<div id="signals-breakdown-target" style="position: absolute; scroll-margin-top: 200px;"></div>
<center><h2 id="signals-breakdown" style="margin-bottom:20px; letter-spacing: 15px;"><font color="#ffffff">signal breakdown</font></h2></center>

```datacorejsx 
const { SignalsBreakdown } = await dc.require("SYSTEM/_scripts/Datacore/SignalsBreakdown.jsx");
return <SignalsBreakdown year="<% year %>" month="<% month %>" monthName="<% monthName %>" />;
```

<br>

---
<br>
<div id="weather-target" style="position: absolute; scroll-margin-top: 200px;"></div>
<center><h2 id="weather" style="margin-bottom:20px; letter-spacing: 15px;"><font color="#ffffff">this month's weather</font></h2></center>

```datacorejsx 
const { WeatherDashboard } = await dc.require("SYSTEM/_scripts/Datacore/WeatherDashboard.jsx");
return <WeatherDashboard year="<% year %>" month="<% month %>" monthName="<% monthName %>" />;
```

<br>

---
<br>
<div id="gallery-target" style="position: absolute; scroll-margin-top: 200px;"></div>
<center><h2 id="gallery" style="margin-bottom:20px; letter-spacing:15px;"><font color="#ffffff">photo gallery</font></h2></center>

```datacorejsx 
const { PhotoGallery } = await dc.require("SYSTEM/_scripts/Datacore/PhotoGallery.jsx");
return <PhotoGallery year="<% year %>" month="<% month %>" monthName="<% monthName %>" />;
```

<br>
<br>
<br>
<br>
<br>
<br>
<br>