---
date: <% tp.date.now("YYYY-MM-DD") %>
day: <% tp.date.now("dddd") %>
tags:
  - daily
sleep:
sex: false
brushed_teeth: false
mood: 
cssclasses:
  - my-class
  - hide-properties_reading
  - hide-properties_editing
  - daily-note
  - starfield
banner: "![[twilight-sky.gif]]"
content_starts: "120"
banner_y: 0
banner_height: 400
<%*
// Graph Links Logic
const g_title = tp.file.title;
let g_base = window.moment(g_title, "YYYY-MM-DD", true);
if (!g_base.isValid()) g_base = window.moment();

const g_prevMoment = g_base.clone().subtract(1, "day");
const g_nextMoment = g_base.clone().add(1, "day");

const g_prev = g_prevMoment.format("YYYY-MM-DD");
const g_next = g_nextMoment.format("YYYY-MM-DD");

const g_year = g_base.format("YYYY");
const g_monthYear = g_base.format("MMMM YYYY");
const g_week = g_base.format("ww");

const g_prevPath = `Digital Hobonichi/${g_prevMoment.format("YYYY")}/${g_prevMoment.format("MM-MMMM")}/${g_prev}.md`;
const g_nextPath = `Digital Hobonichi/${g_nextMoment.format("YYYY")}/${g_nextMoment.format("MM-MMMM")}/${g_next}.md`;
const g_yearPath = `Digital Hobonichi/${g_year}/Yearly Overview.md`;
const g_monthPath = `Digital Hobonichi/${g_year}/Monthly Overview/${g_monthYear}.md`;
const g_weekPath = `Digital Hobonichi/${g_year}/Weekly Overview/${g_year}-W${g_week}.canvas`;
%>
graph_links:
  - "[[<% g_prevPath %>]]"
  - "[[<% g_yearPath %>]]"
  - "[[<% g_monthPath %>]]"
  - "[[<% g_weekPath %>]]"
  - "[[<% g_nextPath %>]]"
---


<center><h3><font color="#ffffff">Hello, Andrea! Today is</font></h3></center>
<center><h1><font color="#ffffff"><u><% tp.date.now("dddd, MMMM Do, YYYY") %></u></font></h1></center>
<center><p><font color="#ffffff">%weather1%</font></p></center>


<%*
const title = tp.file.title;
let base = window.moment(title, "YYYY-MM-DD", true);
if (!base.isValid()) base = window.moment();

const prevMoment = base.clone().subtract(1, "day");
const nextMoment = base.clone().add(1, "day");

const prev = prevMoment.format("YYYY-MM-DD");
const next = nextMoment.format("YYYY-MM-DD");

const year = base.format("YYYY");
const monthYear = base.format("MMMM YYYY");
const monthShortYear = base.format("MMM YYYY");
const week = base.format("ww");
const weekLabel = "W" + week;

// tiny helper: makes a proper internal link anchor
const makeLink = (path, label) =>
  `<a href="${encodeURI(path)}" data-href="${path}" class="internal-link nav-button">${label}</a>`;

const prevPath = `Digital Hobonichi/${prevMoment.format("YYYY")}/${prevMoment.format("MM-MMMM")}/${prev}.md`;
const nextPath = `Digital Hobonichi/${nextMoment.format("YYYY")}/${nextMoment.format("MM-MMMM")}/${next}.md`;
const yearPath = `Digital Hobonichi/${year}/Yearly Overview.md`;
const monthPath = `Digital Hobonichi/${year}/Monthly Overview/${monthYear}.md`;
const weekPath = `Digital Hobonichi/${year}/Weekly Overview/${year}-W${week}.canvas`;

const prevLink  = makeLink(prevPath, "← Previous Day");
const nextLink  = makeLink(nextPath, "Next Day →");
const yearLink  = makeLink(yearPath, year);
const monthLink = makeLink(monthPath, monthShortYear);
const weekLink  = makeLink(weekPath, weekLabel);

tR += `
<div class="nav-header">
  ${prevLink}
  ${yearLink}
  ${monthLink}
  ${weekLink}
  ${nextLink}
</div>
`;
%>

<%* tR += await tp.user.randomQuote() %>

<br>

> [!multi-column]
>> [!habit|wide-2]- Daily Habits
>> ```meta-bind
>> INPUT[toggle(title(👀)):sex]
>> ```
>> ```meta-bind
>> INPUT[toggle(title(🦷)):brushed_teeth]
>> ```
>> ```meta-bind
>> INPUT[slider(title(🙃), minValue(0), maxValue(10)):mood]
>> ```
>> ```meta-bind
>> INPUT[time(title(😴)):fellAsleep]
>> ```
>> ```meta-bind
>> INPUT[time(title(🌞)):wokeUp]
>> ```
>> ```dataviewjs
>> const { DateTime } = dv.luxon;
>>let fellAsleep = dv.current().fellAsleep;
>>let wokeUp = dv.current().wokeUp;
>>if (fellAsleep && wokeUp) {
>>    // Parse times as DateTime objects
>>    let asleepDT = DateTime.fromFormat(fellAsleep, "HH:mm");
>>    let wakeDT = DateTime.fromFormat(wokeUp, "HH:mm");  
>>    // If wake time is earlier than sleep time, assume it's the next day
>>    if (wakeDT < asleepDT) {
>>        wakeDT = wakeDT.plus({ days: 1 });
>>    }    
>>    // Calculate difference
>>    let diff = wakeDT.diff(asleepDT, ["hours", "minutes"]);
>>   let h = Math.floor(diff.hours).toString().padStart(2, "0");
>>    let m = Math.round(diff.minutes).toString().padStart(2, "0");    
>>    // Convert to decimal hours for frontmatter
>>    let totalHours = Number(diff.as("hours").toFixed(2));  
>>    // Update frontmatter using MetaEdit
>>    const meta = app.plugins.plugins["metaedit"]?.api;
>>    let active = app.workspace.getActiveFile();
>>    if (meta && active) {
>>        let current = dv.current().sleep;
>>        if (Number(current) !== totalHours) {
>>            await meta.update("sleep", totalHours, active.path);
>>        }
>>    }
>>    
>>    // Display the result
>>    dv.paragraph(`**Time Slept:** ${h} hours and ${m} minutes`);
>>} else {
>>    dv.paragraph("**Time Slept:** _Enter sleep times_");
>>}
>> ```
>
>> [!hobbies|wide-2]- Hobbies Log
>> ```meta-bind
>> INPUT[number(title(🎨), placeholder(minutes)):coloring]
>> ```
>> ```meta-bind
>> INPUT[number(title(📖), placeholder(minutes)):reading]
>> ```
>> ```meta-bind
>> INPUT[number(title(✒️), placeholder(minutes)):writing]
>> ```


## :LiCalendarClock: Daily Log
<% tp.file.cursor() %>


## :LiPiggyBank: Spending
| Cost | Item | Notes |
| ---- | ---- | ----- |
|      |      |       |
```dataviewjs
let file = app.workspace.getActiveFile();
let content = await app.vault.read(file);
let lines = content.split("\n");

let inTable = false;
let total = 0;

for (let line of lines) {
  if (line.trim().startsWith("| Cost")) {
    inTable = true;
    continue;
  }

  if (inTable) {
    if (!line.trim().startsWith("|") || line.trim().startsWith("| ----")) continue;

    let cells = line.split("|").map(cell => cell.trim());
    let rawCost = cells[1].replace(/[^0-9.]/g, ""); // 💥 removes $ and other non-numeric chars
    let cost = parseFloat(rawCost);

    if (!isNaN(cost)) {
      total += cost;
    }
  }
}

if (total > 0) {
  dv.paragraph(`**Total Spent:** $${total.toFixed(2)}`);
} else {
  dv.paragraph(`**You spent $0 today!**`);
}
```

## :LiActivitySquare: Changes to the Universe Today
> [!created]- Created Today
> ```dataview
> table without id
> file.link as Note,
> file.folder as Folder,
> file.ctime as "Created"
> FROM ""
> where file.ctime >= date(<%tp.file.title%>) AND file.ctime <= date(<%moment(tp.file.title,'YYYY-MM-DD').add(1, 'd').format("YYYY-MM-DD")%>) AND file.path != this.file.path
> sort file.ctime desc
> ```

> [!modified]- Modified Today
> ```dataview
> table without id
> file.link as Note,
> file.folder as Folder,
> file.mtime as "Last Modified"
> FROM ""
> where file.mtime >= date(<%tp.file.title%>) AND file.mtime <= date(<%moment(tp.file.title,'YYYY-MM-DD').add(1, 'd').format("YYYY-MM-DD")%>) AND file.path != this.file.path
> sort file.mtime desc
> ```


## :LiBrain: What's On My Mind?


## :LiImage: Today's Snapshots
