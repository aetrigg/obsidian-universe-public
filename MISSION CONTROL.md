---
banner: https://i.pinimg.com/1200x/8e/d4/44/8ed444f7ce9b59da13b51ae2f93806de.jpg
cssclasses:
  - my-class
  - hide-properties_reading
  - hide-properties_editing
  - headings-accent
  - dashboard
  - starfield
  - glowing-stars
content_starts: "100"
banner_y: 85
banner_height: 450
obsidianUIMode: preview
---

![:idklol:|center|150](https://i.pinimg.com/originals/61/db/72/61db72842e367b18a49da3838b945464.gif)
<center><h3><font color="#ffffff">The Universe Awaits, Andrea. It is</font></h3></center>
<center><iframe src="https://free.timeanddate.com/clock/ia30vlvp/n5279/fn12/fs30/fcfff/tct/pct/ftbu/tt0/tw0/th2/tb1" frameborder="0" width="562" height="37" allowtransparency="true"></iframe></center>

```dataviewjs
const today = window.moment();
const prev = today.clone().subtract(1, "day");
const next = today.clone().add(1, "day");

const year = today.format("YYYY");
const monthFolder = today.format("MM-MMMM");
const week = today.format("ww");
const monthLong = today.format("MMMM");
const monthShort = today.format("MMM");

// Build true file paths (so links open correctly)
// const prevPath  = `Digital Hobonichi/${prev.format("YYYY")}/${prev.format("MM-MMMM")}/${prev.format("YYYY-MM-DD")}.md`;
const todayPath = `Digital Hobonichi/${year}/${monthFolder}/${today.format("YYYY-MM-DD")}.md`;
// const nextPath  = `Digital Hobonichi/${next.format("YYYY")}/${next.format("MM-MMMM")}/${next.format("YYYY-MM-DD")}.md`;

const yearlyPath  = `Digital Hobonichi/${year}/Yearly Overview.md`;
const monthlyPath = `Digital Hobonichi/${year}/Monthly Overview/${monthLong} ${year}.md`;
const weeklyPath  = `Digital Hobonichi/${year}/Weekly Overview/${year}-W${week}.canvas`;
const inboxPath =  `SYSTEM/Launchpads/INBOX LAUNCHPAD.base`;

// Helper to make Obsidian-styled internal links
const link = (path, label) =>
  `<a class="internal-link" data-href="${path}" href="${path}">${label}</a>`;

// Build the nav HTML
const html = `
  ${link(yearlyPath, year)} 
  ${link(monthlyPath, `${monthShort} ${year}`)} 
  ${link(weeklyPath, `W${week}`)}
  ${link(todayPath, "Today")}
  ${link(inboxPath, "Inbox")}
`;

// Render into a styled container
const container = dv.el("span", "", { cls: "home-nav" });
container.style.display = "flex";
container.style.justifyContent = "center";
container.style.alignContent = "center";
container.style.alignItems = "center";
container.innerHTML = html;

// need to add buttons that adds a daily log to the daily note, one that creates new task to certain sub-inbox

```




<hr>


<!-- let's try to set it up based on the glow-y homepage by HOCA -->

<center><h1>𝚕 𝚊 𝚞 𝚗 𝚌 𝚑 𝚙 𝚊 𝚍</h1></center>
<div class="dashboard-panel">



  - <a href="obsidian://open?vault=Universe-Public&file=SYSTEM%2FLaunchpads%2F5OJ%20LAUNCHPAD.base">
    <div class="glow-icon-container">
      <svg class="glow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M21.65,2.24a1,1,0,0,0-.8-.23l-13,2A1,1,0,0,0,7,5V15.35A3.45,3.45,0,0,0,5.5,15,3.5,3.5,0,1,0,9,18.5V10.86L20,9.17v4.18A3.45,3.45,0,0,0,18.5,13,3.5,3.5,0,1,0,22,16.5V3A1,1,0,0,0,21.65,2.24ZM5.5,20A1.5,1.5,0,1,1,7,18.5,1.5,1.5,0,0,1,5.5,20Zm13-2A1.5,1.5,0,1,1,20,16.5,1.5,1.5,0,0,1,18.5,18ZM20,7.14,9,8.83v-3L20,4.17Z"/></svg>
      <div class="glow-label">5TH OF JUNE</div>
    </div>
  </a>

  - <a href="obsidian://open?vault=Universe-Public&file=SYSTEM%2FLaunchpads%2FCOLORINGTHECOSMOS%20LAUNCHPAD.base">
    <div class="glow-icon-container">
      <svg class="glow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M7.42,15.54a1,1,0,0,0,0,1.41,1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.41A1,1,0,0,0,7.42,15.54Zm0-8.49a1,1,0,0,0,0,1.41,1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.41A1,1,0,0,0,7.42,7.05Zm4.95,10a1,1,0,1,0,1,1A1,1,0,0,0,12.37,17Zm-6-6a1,1,0,1,0,1,1A1,1,0,0,0,6.37,11Zm6-6a1,1,0,1,0,1,1A1,1,0,0,0,12.37,5Zm3.54,2.05a1,1,0,1,0,1.41,0A1,1,0,0,0,15.91,7.05Zm6.3,0a11,11,0,1,0-7.85,15.74,3.87,3.87,0,0,0,2.5-1.65A4.2,4.2,0,0,0,17.47,18a5.65,5.65,0,0,1-.1-1,5,5,0,0,1,3-4.56,3.84,3.84,0,0,0,2.06-2.25A4,4,0,0,0,22.21,7.08Zm-1.7,2.44a1.9,1.9,0,0,1-1,1.09A7,7,0,0,0,15.37,17a7.3,7.3,0,0,0,.14,1.4,2.16,2.16,0,0,1-.31,1.65,1.79,1.79,0,0,1-1.21.8,8.72,8.72,0,0,1-1.62.15,9,9,0,0,1-9-9.28A9.05,9.05,0,0,1,11.85,3h.51a9,9,0,0,1,8.06,5A2,2,0,0,1,20.51,9.52ZM12.37,11a1,1,0,1,0,1,1A1,1,0,0,0,12.37,11Z"/></svg>
      <div class="glow-label">COLORINGTHECOSMOS</div>
    </div>
  </a>

- <a href="obsidian://open?vault=Universe-Public&file=OBSERVATORIES%2FActivity%20Observatory">
    <div class="glow-icon-container">
       <svg class="glow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6,13H2a1,1,0,0,0-1,1v8a1,1,0,0,0,1,1H6a1,1,0,0,0,1-1V14A1,1,0,0,0,6,13ZM5,21H3V15H5ZM22,9H18a1,1,0,0,0-1,1V22a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V10A1,1,0,0,0,22,9ZM21,21H19V11h2ZM14,1H10A1,1,0,0,0,9,2V22a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V2A1,1,0,0,0,14,1ZM13,21H11V3h2Z"/></svg>
      <div class="glow-label">UNIVERSE ACTIVITY</div>
    </div>
  </a>

##

- <a href="obsidian://open?vault=Universe-Public&file=SYSTEM%2FLaunchpads%2FFINANCES%20LAUNCHPAD.base">
	<div class="glow-icon-container">
		<svg class="glow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M6,11a1,1,0,1,0,1,1A1,1,0,0,0,6,11Zm12,0a1,1,0,1,0,1,1A1,1,0,0,0,18,11Zm2-6H4A3,3,0,0,0,1,8v8a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V8A3,3,0,0,0,20,5Zm1,11a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V8A1,1,0,0,1,4,7H20a1,1,0,0,1,1,1ZM12,9a3,3,0,1,0,3,3A3,3,0,0,0,12,9Zm0,4a1,1,0,1,1,1-1A1,1,0,0,1,12,13Z"/></svg>
		<div class="glow-label">FINANCES</div>
	</div>
</a>

- <a href="obsidian://open?vault=Universe-Public&file=OBSERVATORIES%2FFrequency%20Scanner">
	<div class="glow-icon-container">
		<svg class="glow-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			  <path d="M3.707 6.293l2.586 -2.586a1 1 0 0 1 1.414 0l5.586 5.586a1 1 0 0 1 0 1.414l-2.586 2.586a1 1 0 0 1 -1.414 0l-5.586 -5.586a1 1 0 0 1 0 -1.414" />
			  <path d="M6 10l-3 3l3 3l3 -3" />
			  <path d="M10 6l3 -3l3 3l-3 3" />
			  <path d="M12 12l1.5 1.5" />
			  <path d="M14.5 17a2.5 2.5 0 0 0 2.5 -2.5" />
			  <path d="M15 21a6 6 0 0 0 6 -6" />
		</svg>
		<div class="glow-label">FREQUENCY SCANNER</div>
	</div>
</a>

- <a href="obsidian://open?vault=Universe-Public&file=NORTH%20STAR">
	<div class="glow-icon-container">
		<svg class="glow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68a1,1,0,0,0,.4,1,1,1,0,0,0,1.05.07L12,18.76l5.1,2.68a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.89l.72,4.19-3.76-2a1,1,0,0,0-.94,0l-3.76,2,.72-4.19a1,1,0,0,0-.29-.89l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z"/></svg>
		<div class="glow-label">NORTH STAR</div>
	</div>
</a>

</div>



<hr>


<center><h1>𝚜 𝚝 𝚊 𝚝 𝚜</h1></center>
&nbsp;

>[!multi-column]
>> [!blank-container]
>>```dataviewjs
>>const files = dv.pages().where(p => !p.file.path.includes("5TH OF JUNE/Note Imports/"))
>>const oldestFile = files.sort(f => f.file.ctime)[0]
>>const daysSinceStart = Math.floor((Date.now() - oldestFile.file.ctime) / (1000 * 60 * 60 * 24))
>>dv.paragraph(`<div class="home-stats-widget grow">
>>  <div style="font-size: 14px; opacity: 0.7; margin-bottom:10px;">growing for</div>
>>  <div style="font-size: 48px; font-weight: bold; margin-bottom: 5px;">${daysSinceStart}</div>
>>  <div style="font-size: 14px; opacity: 0.7;">days and counting</div>
>></div>`)
>
>> [!blank-container]
>> ```dataviewjs
>> const totalNotes = dv.pages().length
>> dv.paragraph(`<div class="home-stats-widget stars">
>>   <div style="font-size: 14px; opacity: 0.7; margin-bottom: 5px;">currently has</div>
>>   <div style="font-size: 48px; font-weight: bold; margin-bottom: 5px;">${totalNotes}</div>
>>   <div style="font-size: 14px; opacity: 0.7;">total stars</div>
>> </div>`)
>> ```
>
>> [!blank-container]
>> ```dataviewjs
>> const allTags = dv.pages().flatMap(p => p.file.tags).distinct()
>> const totalTags = allTags.length
>>
>> dv.paragraph(`<div class="home-stats-widget constellations">
>>   <div style="font-size: 14px; opacity: 0.7; margin-bottom: 5px;">currently has</div>
>>   <div style="font-size: 48px; font-weight: bold; margin-bottom: 5px;">${totalTags}</div>
>>   <div style="font-size: 14px; opacity: 0.7;">constellations</div>
>> </div>`)
>> ```

&nbsp;

<center><h3>⛧°. 𝚑 𝚎 𝚊 𝚝 𝚖 𝚊 𝚙 .°⛧</h3></center>


```contributionGraph
graphType: calendar
dateRangeValue: 3
dateRangeType: LATEST_MONTH
startOfWeek: 0
showCellRuleIndicators: true
titleStyle:
  textAlign: center
  fontSize: 125px
  fontWeight: normal
dataSource:
  type: PAGE
  value: ""
  dateField:
    type: FILE_MTIME
  filters: []
  countField:
    type: DEFAULT
fillTheScreen: false
enableMainContainerShadow: false
cellStyle:
  minWidth: 17px
  minHeight: 17px
emptyCellDisplay: box
showEmptyCells: true
cellStyleRules:
  - id: Lovely_a
    color: "#f6dcfeff"
    min: 1
    max: 2
  - id: Lovely_b
    color: "#e4b8fdff"
    min: 2
    max: 3
  - id: Lovely_c
    color: "#d092f8ff"
    min: 3
    max: 5
  - id: Lovely_d
    color: "#b46aecff"
    min: 5
    max: "10"
  - id: 1762559186290
    min: "10"
    max: "15"
    color: "#9246ccff"
    text: ""
  - id: 1762559204720
    min: "15"
    max: "20"
    color: "#6c26a2ff"
    text: ""
  - id: 1762559218507
    min: "20"
    max: "25"
    color: "#51157eff"
    text: ""
  - id: 1762559232966
    min: "25"
    max: "30"
    color: "#3c0a60ff"
    text: ""
  - id: 1762559267539
    min: "30"
    max: "35"
    color: "#2e0549ff"
    text: ""
  - id: 1762559284612
    min: "35"
    max: "9999"
    color: "#1f0333ff"
    text: ""

```



```search-bar
show started files
```