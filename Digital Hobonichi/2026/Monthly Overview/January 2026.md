---
banner: "![[aurora-sky.gif]]"
content_starts: 25
banner_y: 40
banner_height: 400
month: January 2026
tags:
  - monthly
  - 2026
cssclasses:
  - my-class
  - hide-properties_reading
  - hide-properties_editing
  - starfield
  - glowing-stars
journal: Monthly Journal
date_created: 2026-01-01
---



```datacorejsx 
const { QuickLinks } = await dc.require("SYSTEM/_scripts/Datacore/QuickLinks.jsx");
return <QuickLinks />;
```

<br>

<center><h3><font color="#ffffff">Hello, Andrea! It is</font></h3></center>
<center><h1 class="title-margin"><font color="#ffffff"><u>January 2026</u></font></h1></center>
<br>

> [!navblock] 
> [[Digital Hobonichi/2025/Monthly Overview/December 2025.md|Dec]] ← [[Digital Hobonichi/2026/Yearly Overview.md|2026]] `$="[[Digital Hobonichi/" + moment().format("YYYY") + "/" + moment().format("MM-MMMM") + "/" + moment().format("YYYY-MM-DD") + ".md|Today]]"` → [[Digital Hobonichi/2026/Monthly Overview/February 2026.md|Feb]] 
> 
> `$=dv.paragraph((() => { const m = moment("2026-01-01"); const weeks = []; let w = m.clone().startOf('month'); const end = m.clone().endOf('month'); while (w.isSameOrBefore(end)) { const wk = w.isoWeek(); const yr = w.isoWeekYear(); if (!weeks.find(x => x.w === wk && x.y === yr)) weeks.push({w: wk, y: yr}); w.add(1, 'week'); } return weeks.map(x => "[[Digital Hobonichi/" + x.y + "/Weekly Overview/" + x.y + "-W" + String(x.w).padStart(2,'0') + ".canvas|W" + x.w + "]]" ).join(" "); })())`

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

<center><h2 id="signal-calendar" style="margin-bottom:20px;"><font color="#ffffff">𝚜 𝚒 𝚐 𝚗 𝚊 𝚕 &nbsp; 𝚌 𝚊 𝚕 𝚎 𝚗 𝚍 𝚊 𝚛</font></h2></center>


```datacorejsx 
const { SignalCalendar } = await dc.require("SYSTEM/_scripts/Datacore/SignalCalendar.jsx");
return <SignalCalendar year="2026" month="01" monthName="January" />;
```

<br>

---
<br>
<div id="signals-breakdown-target" style="position: absolute; scroll-margin-top: 200px;"></div>
<center><h2 id="signals-breakdown" style="margin-bottom:20px;"><font color="#ffffff">𝚜 𝚒 𝚐 𝚗 𝚊 𝚕 &nbsp; 𝚋 𝚛 𝚎 𝚊 𝚔 𝚍 𝚘 𝚠 𝚗</font></h2></center>

```datacorejsx 
const { SignalsBreakdown } = await dc.require("SYSTEM/_scripts/Datacore/SignalsBreakdown.jsx");
return <SignalsBreakdown year="2026" month="01" monthName="January" />;
```

<br>

---
<br>
<div id="weather-target" style="position: absolute; scroll-margin-top: 200px;"></div>
<center><h2 id="weather" style="margin-bottom:20px;"><font color="#ffffff">𝚝 𝚑 𝚒 𝚜 &nbsp; 𝚖 𝚘 𝚗 𝚝 𝚑 ' 𝚜 &nbsp; 𝚠 𝚎 𝚊 𝚝 𝚑 𝚎 𝚛</font></h2></center>

```datacorejsx 
const { WeatherDashboard } = await dc.require("SYSTEM/_scripts/Datacore/WeatherDashboard.jsx");
return <WeatherDashboard year="2026" month="01" monthName="January" />;
```

<br>

---
<br>
<div id="gallery-target" style="position: absolute; scroll-margin-top: 200px;"></div>
<center><h2 id="gallery" style="margin-bottom:20px;"><font color="#ffffff">𝚙 𝚑 𝚘 𝚝 𝚘 &nbsp; 𝚐 𝚊 𝚕 𝚕 𝚎 𝚛 𝚢</font></h2></center>

```datacorejsx 
const { PhotoGallery } = await dc.require("SYSTEM/_scripts/Datacore/PhotoGallery.jsx");
return <PhotoGallery year="2026" month="01" monthName="January" />;
```

<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
<br>
